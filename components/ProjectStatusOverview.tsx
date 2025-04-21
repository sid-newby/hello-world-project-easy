import { useState, useEffect } from 'react' // Add useEffect
import { Tables } from '../types/supabase'
import Button from './Button' // Import Button
import Drawer from './Drawer' // Import Drawer
import FileUpload from './FileUpload' // Import FileUpload
import { listFiles, uploadFilesToBucket } from '../lib/storage' // Import listFiles AND uploadFilesToBucket (though upload is handled in FileUpload)
import { getLatestEmbeddingInfo, generateEmbeddings, storeEmbeddings } from '../lib/embeddings' // Import embedding functions
import { extractTextFromFile } from '../lib/textExtractor' // Import text extractor
import { chunkTextByParagraph } from '../lib/chunker' // Import chunker
// Removed unused FileObject import

interface ProjectStatusOverviewProps {
  deck: Tables<'pitch_decks'> | null
}

// Helper function for formatting dates
const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A'
  try {
    // Use 'en-US' locale and 'America/Chicago' time zone
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      timeZone: 'America/Chicago',
      hour12: true // Use AM/PM
    }).format(new Date(dateString))
  } catch (e) {
    console.error("Error formatting date:", e)
    return 'Invalid Date'
  }
}

// Define a simpler type for the file list state based on what listFiles returns
interface SimpleFileObject {
  name: string;
  id: string | null; // id can be null for folders/placeholders
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, unknown>;
}

function ProjectStatusOverview({ deck }: ProjectStatusOverviewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false) // State for drawer
  const [uploadedFiles, setUploadedFiles] = useState<SimpleFileObject[]>([]) // Use simpler type
  const [latestEmbedding, setLatestEmbedding] = useState<Tables<'document_embeddings'> | null>(null)
  const [loadingMetrics, setLoadingMetrics] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)
  const [showFileList, setShowFileList] = useState(false) // State to toggle file list

  // Fetch metrics when deck ID changes or drawer closes (to refresh after upload)
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!deck?.id) return

      setLoadingMetrics(true)
      setMetricsError(null)
      // Keep existing files while loading? Or clear? Clearing for now.
      // setUploadedFiles([])
      // setLatestEmbedding(null)

      const storagePath = `pitch_decks/${deck.id}/uploads/`

      try {
        // Fetch file list and latest embedding info in parallel
        const [fileListResult, embeddingInfoResult] = await Promise.all([
          listFiles(storagePath),
          getLatestEmbeddingInfo(deck.id)
        ]);

        // Process file list result
        if ('error' in fileListResult) {
          throw new Error(`Storage Error: ${fileListResult.error}`)
        }
        // Filter out potential placeholder objects if Supabase adds them
        setUploadedFiles(fileListResult.filter(f => f.name !== '.emptyFolderPlaceholder'))

        // Process embedding info result
        if (embeddingInfoResult && 'error' in embeddingInfoResult) {
          console.warn(`Embedding Info Error: ${embeddingInfoResult.error}`)
          // Set specific error or just note it?
          setMetricsError(prev => prev ? `${prev}; Embedding Info Error: ${embeddingInfoResult.error}` : `Embedding Info Error: ${embeddingInfoResult.error}`)
        } else if (embeddingInfoResult) {
           setLatestEmbedding(embeddingInfoResult)
        } else {
           setLatestEmbedding(null) // Ensure it's null if no embedding found
        }

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load document metrics.'
        console.error("Error fetching metrics:", err)
        setMetricsError(message)
        setUploadedFiles([]) // Clear files on error
        setLatestEmbedding(null) // Clear embedding info on error
      } finally {
        setLoadingMetrics(false)
      }
    }

    fetchMetrics()
  }, [deck?.id, isDrawerOpen]) // Re-fetch when deck changes or drawer closes


  if (!deck) {
    return <div>No deck data available.</div> // Should ideally not happen if parent handles loading/error
  }

  return (
    <div className="p-4 h-full bg-[color:var(--c-bg)] text-[color:var(--c-fg)]">
      <h2 className="text-xl font-semibold border-b-[1px] border-b-[color:white] pb-2 mb-3 text-[color:var(--c-fg)]">
        Project Overview
      </h2>
      <div className="space-y-2 text-sm">
        <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Title:</strong> {deck.title}</p>
        {deck.company_name && <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Company:</strong> {deck.company_name}</p>}
        {deck.industry && <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Industry:</strong> {deck.industry}</p>}
        {deck.funding_stage && <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Funding Stage:</strong> {deck.funding_stage}</p>}
        {deck.funding_goal && <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Funding Goal:</strong> ${deck.funding_goal.toLocaleString()}</p>}
        {deck.description && <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Description:</strong> {deck.description}</p>}
        <p className="text-[color:var(--c-fg)]"><strong className="text-[color:var(--c-fg)]">Status:</strong> {deck.status || 'Not Started'}</p> {/* Placeholder status */}
        {/* TODO: Add progress indicator */}
      </div>

      {/* Document Section */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <h3 className="text-lg font-semibold mb-2 text-[color:var(--c-fg)]">Documents & Embeddings</h3>

        {/* Metrics Display */}
        <div className="text-sm space-y-1 mb-3">
          {loadingMetrics && <p className="italic text-gray-400">Loading metrics...</p>}
          {metricsError && <p className="text-red-500">Error loading metrics: {metricsError}</p>}
          {!loadingMetrics && !metricsError && (
            <>
              <p>
                <strong className="text-[color:var(--c-fg)]">Uploaded Files:</strong> {uploadedFiles.length}
                {uploadedFiles.length > 0 && (
                  <button
                    onClick={() => setShowFileList(!showFileList)}
                    className="ml-2 text-xs text-blue-400 hover:underline focus:outline-none"
                  >
                    ({showFileList ? 'Hide' : 'Show'} List)
                  </button>
                )}
              </p>
              <p>
                <strong className="text-[color:var(--c-fg)]">Last Embedded:</strong>{' '}
                {/* More robust safe access for Json type */}
                {(typeof latestEmbedding?.metadata === 'object' && // Check if it's an object
                  latestEmbedding.metadata !== null && // Check if it's not null
                  !Array.isArray(latestEmbedding.metadata) && // Check if it's not an array
                  typeof (latestEmbedding.metadata as Record<string, unknown>).source === 'string' // Check if source exists and is string
                    ? (latestEmbedding.metadata as Record<string, string>).source // Now cast to string for rendering
                    : 'N/A'
                )}
              </p>
              <p>
                <strong className="text-[color:var(--c-fg)]">Last Embedded Time:</strong>{' '}
                {formatDateTime(latestEmbedding?.created_at)}
              </p>
            </>
          )}
        </div>

         {/* Conditional File List */}
         {showFileList && uploadedFiles.length > 0 && (
          <div className="mb-3 p-2 border border-gray-700 rounded max-h-40 overflow-y-auto">
            <ul className="list-disc list-inside text-xs">
              {uploadedFiles.map((file) => (
                <li key={file.id || file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}


        <Button
          buttonText="Upload Documents"
          onClick={() => setIsDrawerOpen(true)}
          color="blue" // Or another appropriate color
          className="neo-button" // Apply NeoBrutalism style
        />
      </div>

      {/* File Upload Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Upload Project Documents"
      >
        <FileUpload
          pitchDeckId={deck.id} // Pass the current deck ID
          // Replace the console log with the actual processing logic
          onUploadComplete={async (uploadResults) => {
            console.log('Upload complete:', uploadResults)
            setIsDrawerOpen(false) // Close drawer

            if (!deck?.id) {
              console.error("Cannot process embeddings without a deck ID.")
              // TODO: Show error to user?
              return
            }

            const successfulUploads = uploadResults.filter(r => !r.error && r.storagePath)
            if (successfulUploads.length === 0) {
               console.log("No successful uploads to process for embedding.")
               return
            }

            console.log(`Starting embedding process for ${successfulUploads.length} files...`)
            // TODO: Add UI feedback for embedding process (loading state)

            try {
              for (const upload of successfulUploads) {
                console.log(`Processing file: ${upload.fileName}`)

                // --- This part is tricky client-side ---
                // Ideally, we'd get the File object directly, but onUploadComplete only has path.
                // Option 1: Pass File objects through (modify FileUpload/storage) - Complex state mgmt.
                // Option 2: Fetch the file back from storage - Inefficient.
                // Option 3: Process *before* upload in FileUpload - Best for client-side, but needs refactor.
                // Option 4: Trigger a backend function (e.g., Supabase Edge Function) - Recommended for robustness.

                // --- Assuming we had the File object (Illustrative - Needs Refactor/Backend) ---
                // const fileObject = /* somehow get the File object corresponding to upload.fileName */;
                // if (!fileObject) continue; // Skip if we can't get the file

                // const extractedText = await extractTextFromFile(fileObject);
                // const chunks = chunkTextByParagraph(extractedText);
                // if (chunks.length === 0) continue; // Skip if no text/chunks

                // const embeddings = await generateEmbeddings(chunks);
                // const dataToStore = chunks.map((chunk, index) => ({
                //   pitch_deck_id: deck.id,
                //   content: chunk,
                //   embedding: embeddings[index],
                //   metadata: {
                //      source: upload.fileName, // Use original filename
                //      storagePath: upload.storagePath,
                //      chunk_index: index
                //   }
                // }));
                // await storeEmbeddings(dataToStore);
                // console.log(`Successfully embedded ${upload.fileName}`);
                 console.warn(`Placeholder: Embedding logic for ${upload.fileName} needs implementation (client-side extraction/chunking or backend trigger).`)

              }
               console.log("Finished embedding process (placeholders).")
               // TODO: Refresh metrics after successful embedding of all files
               // Consider calling fetchMetrics() again, but might need better state management
               // to avoid race conditions if embedding takes time.

            } catch (error) {
               console.error("Error during embedding process:", error)
               // TODO: Show error to user
            }
          }}
        />
      </Drawer>
    </div>
  )
}

export default ProjectStatusOverview
