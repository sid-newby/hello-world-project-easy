import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom' // Import Link for back button
import { supabase } from '../lib/supabase'
import { Tables } from '../types/supabase'
import { useAuth } from '../context/AuthProvider' // To ensure user owns the deck (optional but recommended)
import ProjectStatusOverview from '../components/ProjectStatusOverview' // Import new component
import ChatInterface from '../components/ChatInterface' // Import new component

/**
 * Page for viewing/editing a specific pitch deck. Serves as the main project hub.
 */
function DeckEditorPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const { user } = useAuth() // Get current user
  const [deck, setDeck] = useState<Tables<'pitch_decks'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeckDetails = async () => {
      if (!deckId || !user) {
        setError("Deck ID or user information is missing.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from('pitch_decks')
          .select('*')
          .eq('id', deckId)
          .eq('user_id', user.id) // Ensure the user owns this deck
          .single() // Expect only one result

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // PostgREST code for "Not found"
             setError(`Pitch deck with ID ${deckId} not found or you don't have permission to view it.`)
          } else {
            throw fetchError
          }
        }
        setDeck(data)
      } catch (err) {
        console.error("Error fetching deck details:", err)
        const message = (err instanceof Error) ? err.message : "Failed to load deck details."
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDeckDetails()
  }, [deckId, user]) // Re-fetch if deckId or user changes

  // Render states: Loading, Error, Not Found, Success
  const renderContent = () => {
    if (loading) {
      return <p>Loading deck details...</p>
    }
    if (error) {
      return <p className="text-red-600">Error: {error}</p>
    }
    if (!deck) {
      // This case might be covered by the error state if fetchError occurred
      return <p>Pitch deck not found.</p>
    }

    // Success state: Display two-column layout with overview and chat
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
        {/* Left Column: Project Overview */}
        <div className="md:col-span-1 h-full">
          <ProjectStatusOverview deck={deck} />
        </div>

        {/* Right Column: Chat Interface */}
        <div className="md:col-span-2 h-full">
          <ChatInterface />
        </div>
      </div>
    )
  }

  return (
    // Remove outer padding (p-6 pt-24...), padding will be handled by AppLayout or specific content sections
    <div className="pt-28 w-full min-h-screen bg-[color:var(--c-bg)] text-[color:var(--c-fg)]">
  <Link to="/" className="text-blue-600 hover:underline mb-4 block">&larr; Back to Dashboard</Link>
  {renderContent()}
</div>
  )
}

export default DeckEditorPage
