import React, { useState } from 'react'
import Button from './Button'
// Remove storage import, add embedding and supabase imports
import { extractTextFromFile, generateEmbeddings, storeEmbeddings } from '../lib/embeddings'
import { supabase } from '../lib/supabase'
import type { TablesInsert } from '../types/supabase' // For type safety

// Define supported MIME types based on Gemini documentation (excluding Markdown)
const SUPPORTED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/heic',
  'image/heif',
  'image/svg+xml',
  'image/tiff',
  
  // Audio
  'audio/wav',
  'audio/mp3',
  'audio/mpeg', 
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/midi',
  'audio/x-midi',
  
  // Video
  'video/mp4',
  'video/mpeg',
  'video/mov',
  'video/avi',
  'video/x-flv',
  'video/mpg',
  'video/webm',
  'video/wmv',
  'video/3gpp',
  'video/quicktime',
  
  // Documents (PDF is primary focus for vision)
  'application/pdf',
  
  // Microsoft Office - Modern Formats
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-visio.drawing.main+xml', // .vsdx
  
  // Microsoft Office - Legacy Formats
  'application/msword', // .doc
  'application/vnd.ms-excel', // .xls
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.visio', // .vsd
  'application/vnd.ms-outlook', // .msg
  'application/vnd.ms-project', // .mpp
  'application/x-mspublisher', // .pub
  'application/vnd.ms-access', // .mdb
  
  // OpenDocument Formats
  'application/vnd.oasis.opendocument.text', // .odt
  'application/vnd.oasis.opendocument.spreadsheet', // .ods
  'application/vnd.oasis.opendocument.presentation', // .odp
  
  // Archive formats
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/gzip',
  'application/x-tar',
  
  // Text and code formats
  'application/x-javascript', 'text/javascript',
  'application/x-python', 'text/x-python',
  'text/plain',
  'text/html',
  'text/css',
  'text/csv',
  'text/xml',
  'text/rtf',
  'text/markdown',
  'application/json',
  'application/xml',
  'application/sql',
  'application/xhtml+xml',
  
  // Email formats
  'message/rfc822', // .eml
  
  // Calendar formats
  'text/calendar', // .ics
  
  // Font formats
  'font/ttf',
  'font/woff',
  'font/woff2',
  'font/otf',
  
  // CAD and 3D formats
  'application/vnd.dwg',
  'application/vnd.dxf',
  'model/stl',
  
  // Database formats
  'application/vnd.sqlite3',
  
  // Vector graphics
  'application/postscript', // .eps, .ps
  'application/illustrator', // .ai
  
  // Other business-relevant formats
  'application/vnd.adobe.photoshop', // .psd
  'application/vnd.adobe.indesign', // .indd
  'application/vnd.ms-xpsdocument', // .xps
  'application/vnd.google-earth.kml+xml', // .kml
]
// Simple text chunking function (adjust as needed)
function chunkTextByParagraphs(text: string, chunkSize = 1000, overlap = 100): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0) // Split by blank lines
  const chunks: string[] = []
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 1 <= chunkSize) {
      currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph
    } else {
      // If chunk is full or adding paragraph exceeds size, push current chunk
      if (currentChunk.length > 0) {
        chunks.push(currentChunk)
      }
      // Start new chunk, handle paragraphs larger than chunkSize
      if (paragraph.length <= chunkSize) {
        currentChunk = paragraph
      } else {
        // Basic handling for very long paragraphs: split by sentence or fixed length
        // This is a simplified approach; more sophisticated chunking might be needed
        let remainingParagraph = paragraph
        while (remainingParagraph.length > 0) {
          const splitPoint = Math.min(chunkSize, remainingParagraph.length)
          chunks.push(remainingParagraph.substring(0, splitPoint))
          remainingParagraph = remainingParagraph.substring(splitPoint - overlap > 0 ? splitPoint - overlap : splitPoint) // Add overlap
        }
        currentChunk = '' // Reset chunk after handling long paragraph
      }
    }
  }
  // Add the last chunk if it's not empty
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }
  return chunks
}


interface FileUploadProps {
  pitchDeckId: string // To link embeddings and full text
  // Callback can be simplified or removed if direct feedback is sufficient
  onProcessingComplete?: (results: { fileName: string; success: boolean; error?: string }[]) => void
  disabled?: boolean
}

// Correct function signature to use onProcessingComplete
function FileUpload({ pitchDeckId, onProcessingComplete, disabled = false }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingMessage, setProcessingMessage] = useState<string | null>(null) // Renamed state

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
    setError(null) // Clear previous errors on new selection
    setProcessingMessage(null) // Renamed state
  }

  // Renamed function to reflect the new process
  const handleProcessFilesClick = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !pitchDeckId) {
      setError('Please select files and ensure a Pitch Deck ID is available.')
      return
      return
    }

    setIsUploading(true) // Keep isUploading state for UI feedback
    setError(null)
    setProcessingMessage('Starting file processing...')

    const processingResults: { fileName: string; success: boolean; error?: string }[] = []

    for (const file of Array.from(selectedFiles)) {
      let fullText = ''
      try {
        // --- Check against supported types, with fallback for .md extension ---
        const isSupportedDirectly = SUPPORTED_MIME_TYPES.includes(file.type)
        const isMarkdownExtension = file.name.toLowerCase().endsWith('.md') && file.type === '' // Check extension only if type is empty

        if (!isSupportedDirectly && !isMarkdownExtension) {
           console.warn(`Skipping unsupported file type: ${file.name} (${file.type || 'unknown'})`)
           processingResults.push({ fileName: file.name, success: false, error: `File type (${file.type || file.name.split('.').pop() || 'unknown'}) is not supported` })
           continue // Skip to the next file
        }
        // --- End checks ---

        // Determine the mimeType to use for processing (important for Gemini)
        const effectiveMimeType = isMarkdownExtension ? 'text/markdown' : file.type

        setProcessingMessage(`Extracting text from ${file.name}...`)
        // Pass the determined MIME type to the extraction function
        fullText = await extractTextFromFile(file, effectiveMimeType)

        if (!fullText || fullText.trim().length === 0) {
          console.warn(`No text extracted from ${file.name}. Skipping embedding.`)
          processingResults.push({ fileName: file.name, success: true, error: 'No text content found' }) // Mark as success but note no text
          continue // Skip to next file if no text
        }

        // Store the full extracted text
        setProcessingMessage(`Storing full text for ${file.name}...`)
        const uploadedDocData: TablesInsert<'uploaded_documents'> = {
          pitch_deck_id: pitchDeckId,
          filename: file.name,
          mime_type: effectiveMimeType, // Use determined MIME type
          full_text: fullText,
        }
        const { error: insertError } = await supabase
          .from('uploaded_documents')
          .insert(uploadedDocData)

        if (insertError) {
          throw new Error(`Failed to store full text: ${insertError.message}`)
        }

        // Chunk the text
        setProcessingMessage(`Chunking text for ${file.name}...`)
        const chunks = chunkTextByParagraphs(fullText) // Use the helper

        if (chunks.length === 0) {
           console.warn(`No chunks generated for ${file.name} after extraction. Skipping embedding.`)
           processingResults.push({ fileName: file.name, success: true, error: 'Text extracted but resulted in no chunks' })
           continue
        }

        // Generate embeddings
        setProcessingMessage(`Generating embeddings for ${chunks.length} chunks from ${file.name}...`)
        const embeddings = await generateEmbeddings(chunks)

        // Prepare data for storage
        const embeddingsData = chunks.map((chunk, index) => ({
          pitch_deck_id: pitchDeckId,
          content: chunk,
          embedding: embeddings[index],
          metadata: { source: file.name, chunk: index + 1, mime_type: effectiveMimeType }, // Use determined MIME type in metadata
        }))

        // Store embeddings
        setProcessingMessage(`Storing ${embeddings.length} embeddings for ${file.name}...`)
        await storeEmbeddings(embeddingsData)

        processingResults.push({ fileName: file.name, success: true })
        setProcessingMessage(`Successfully processed ${file.name}.`)

      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.'
        console.error(`Error processing file ${file.name}:`, err)
        setError(`Error processing ${file.name}: ${message}`) // Show specific file error
        processingResults.push({ fileName: file.name, success: false, error: message })
        // Decide whether to stop processing or continue with next file
        // break; // Uncomment to stop on first error
      }
    } // End of file loop

    // Final UI update
    const successfulCount = processingResults.filter(r => r.success).length
    const failedCount = processingResults.length - successfulCount

    if (successfulCount > 0) {
      setProcessingMessage(`Processing complete. Successfully processed ${successfulCount} file(s).${failedCount > 0 ? ` Failed: ${failedCount}.` : ''}`)
    } else if (failedCount > 0) {
       setError(`Processing failed for ${failedCount} file(s). Check console for details.`)
       setProcessingMessage(null) // Clear processing message if only errors
    } else {
       setProcessingMessage('No files processed.') // Should not happen if files were selected
    }


    // Reset state
    setSelectedFiles(null)
    const input = document.getElementById('file-upload-input') as HTMLInputElement
    if (input) input.value = '' // Clear file input
    setIsUploading(false)

    // Optional: Trigger callback with detailed results
    onProcessingComplete?.(processingResults)
  } // Added missing closing brace for handleProcessFilesClick

  return (
    <div className="neo-container p-4 space-y-3"> {/* Basic container styling */}
      <h3 className="text-lg font-semibold border-b border-black pb-1">Process Documents</h3> {/* Title updated */}
      <div>
        <label htmlFor="file-upload-input" className="block text-sm font-medium text-gray-700 mb-1">
          Select Files:
        </label>
        <input
          id="file-upload-input"
          type="file"
          multiple // Allow multiple file selection
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-50 hover:file:bg-gray-100 disabled:opacity-50"
        />
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="text-xs text-gray-600">
          <p>Selected:</p>
          <ul>
            {/* Add File type annotation */}
            {Array.from(selectedFiles).map((file: File, index) => (
              <li key={index}>- {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
            ))}
          </ul>
        </div>
      )}

      <Button
        buttonText={isUploading ? 'Processing...' : 'Process Selected Files'} // Button text updated
        onClick={handleProcessFilesClick} // Function name updated
        disabled={!selectedFiles || selectedFiles.length === 0 || isUploading || disabled}
        color="violet" // Or another appropriate color
      />

      {error && <p className="text-red-600 text-sm mt-2">Error: {error}</p>}
      {/* Use processingMessage state */}
      {processingMessage && !error && <p className="text-blue-600 text-sm mt-2">{processingMessage}</p>}
    </div>
  )
} // Added missing closing brace for the component function

export default FileUpload
