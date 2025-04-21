import { useState, useEffect } from 'react'
import Dialog from './Dialog' // Import the Dialog component
import CreateProjectForm from './CreateProjectForm' // Import the form
import { useAuth } from '../context/AuthProvider' // Import useAuth
import { supabase } from '../lib/supabase' // Import supabase client
import { Tables } from '../types/supabase' // Import generated types
import { Link } from 'react-router-dom' // Import Link

/**
 * Represents the main dashboard view where users can see existing projects
 * or create new ones.
 */
function ProjectDashboard() {
  const { user } = useAuth() // Get the current user
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [pitchDecks, setPitchDecks] = useState<Tables<'pitch_decks'>[]>([])
  const [loadingDecks, setLoadingDecks] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const handleOpenModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    // TODO: Add logic to refresh project list if needed after creation
    // Consider calling fetchDecks() here or passing a refresh callback
  }

  // Fetch pitch decks for the current user
  useEffect(() => {
    const fetchDecks = async () => {
      if (!user) return // Should not happen if routing is correct, but good practice

      setLoadingDecks(true)
      setFetchError(null)
      try {
        const { data, error } = await supabase
          .from('pitch_decks')
          .select('*') // Select all columns
          .eq('user_id', user.id) // Filter by current user ID
          .order('created_at', { ascending: false }) // Show newest first

        if (error) {
          throw error
        }
        setPitchDecks(data || [])
      } catch (err) { // Use unknown type
        console.error("Error fetching pitch decks:", err)
        const message = (err instanceof Error) ? err.message : "Failed to load pitch decks."
        setFetchError(message)
      } finally {
        setLoadingDecks(false)
      }
    }

    fetchDecks()
  }, [user]) // Re-fetch if user changes (e.g., logout/login)


  return (
    // Remove outer padding (p-10 pt-28), padding will be handled by AppLayout or specific content sections
    <div className="pt-28 w-full min-h-screen bg-[color:var(--c-bg)] text-[color:var(--c-fg)]">
        <h1 className="text-3xl font-bold mb-8 text-[color:var(--c-fg)] lowercase">your pitch decks</h1>

        {/* Pitch Deck List Area */}
        <div className="mb-6 min-h-[100px]"> {/* Added min-height */}
          {loadingDecks ? (
            <p className="text-[color:var(--c-fg)]">Loading decks...</p>
          ) : fetchError ? (
            <p className="text-red-600">Error: {fetchError}</p> // Error message
          ) : pitchDecks.length === 0 ? (
            <p className="italic text-[color:var(--c-fg)] opacity-60">no projects yet. create one!</p> // No projects message
          ) : (
            <ul className="space-y-3"> {/* List container */}
              {pitchDecks.map((deck) => (
                <li key={deck.id} className="border-2 border-[color:white] rounded-md shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-shadow bg-[color:var(--c-bg)]">
                  <Link to={`/deck/${deck.id}`} className="block p-3 hover:bg-[color:var(--c-bg)]">
                    <h3 className="text-xl font-bold lowercase text-[color:var(--c-fg)]">{deck.title}</h3>
                    {deck.company_name && <p className="text-sm text-[color:var(--c-fg)] opacity-80">company: {deck.company_name}</p>}
                    {deck.description && <p className="text-sm text-[color:var(--c-fg)] opacity-60 mt-1">{deck.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-4 bg-[color:var(--c-bg)] text-[color:var(--c-fg)]">
          <button
            className="bg-[color:var(--c-accent)] text-[color:var(--c-fg)] border-[color:var(--c-accent)] border-2 font-bold text-lg lowercase rounded-md transition-all duration-150 px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[color:var(--c-bg)] hover:text-[color:var(--c-accent)] hover:border-[color:var(--c-accent)]"
            onClick={handleOpenModal}
          >
            + create new pitch deck
          </button>
        </div>

      {/* Create Project Modal */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title="create new pitch deck"
        width="lg" // Adjust width as needed
      >
        <CreateProjectForm
          onSuccess={handleCloseModal} // Close modal on success
          onCancel={handleCloseModal} // Close modal on cancel
        />
      </Dialog>
    </div>
  )
}

export default ProjectDashboard
