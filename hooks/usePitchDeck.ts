import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type PitchDeck = Database['public']['Tables']['pitch_decks']['Row']
type PitchDeckInsert = Database['public']['Tables']['pitch_decks']['Insert']
type PitchDeckUpdate = Database['public']['Tables']['pitch_decks']['Update']

export const usePitchDeck = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPitchDeck = async (deck: Omit<PitchDeckInsert, 'user_id'>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: dbError } = await supabase
        .from('pitch_decks')
        .insert([{ ...deck, user_id: user.id }])
        .select()
        .single()

      if (dbError) throw dbError
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updatePitchDeck = async (id: string, updates: PitchDeckUpdate) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('pitch_decks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (dbError) throw dbError
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deletePitchDeck = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error: dbError } = await supabase
        .from('pitch_decks')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getPitchDeck = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('pitch_decks')
        .select('*, slides(*)')
        .eq('id', id)
        .single()

      if (dbError) throw dbError
      return data as PitchDeck & { slides: Database['public']['Tables']['slides']['Row'][] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getUserPitchDecks = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: dbError } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (dbError) throw dbError
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createPitchDeck,
    updatePitchDeck,
    deletePitchDeck,
    getPitchDeck,
    getUserPitchDecks,
  }
}
