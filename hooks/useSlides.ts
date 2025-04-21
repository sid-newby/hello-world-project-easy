import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Slide = Database['public']['Tables']['slides']['Row']
type SlideInsert = Database['public']['Tables']['slides']['Insert']
type SlideUpdate = Database['public']['Tables']['slides']['Update']

export const useSlides = (pitchDeckId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSlide = async (slide: Omit<SlideInsert, 'pitch_deck_id' | 'order_index'>) => {
    try {
      setIsLoading(true)
      setError(null)

      // Get the current highest order_index
      const { data: existingSlides, error: countError } = await supabase
        .from('slides')
        .select('order_index')
        .eq('pitch_deck_id', pitchDeckId)
        .order('order_index', { ascending: false })
        .limit(1)

      if (countError) throw countError

      const nextOrderIndex = existingSlides?.[0]?.order_index ?? 0

      const { data, error: dbError } = await supabase
        .from('slides')
        .insert([{
          ...slide,
          pitch_deck_id: pitchDeckId,
          order_index: nextOrderIndex + 1
        }])
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

  const updateSlide = async (id: string, updates: SlideUpdate) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('slides')
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

  const deleteSlide = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error: dbError } = await supabase
        .from('slides')
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

  const reorderSlides = async (slideIds: string[]) => {
    try {
      setIsLoading(true)
      setError(null)

      // Update each slide's order_index based on its position in the array
      const updates = slideIds.map((id, index) => ({
        id,
        order_index: index + 1
      }))

      const { error: dbError } = await supabase
        .from('slides')
        .upsert(updates)

      if (dbError) throw dbError
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getSlides = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('slides')
        .select('*, sections(*)')
        .eq('pitch_deck_id', pitchDeckId)
        .order('order_index', { ascending: true })

      if (dbError) throw dbError
      return data as (Slide & { sections: Database['public']['Tables']['sections']['Row'] })[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getSlide = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('slides')
        .select('*, sections(*)')
        .eq('id', id)
        .single()

      if (dbError) throw dbError
      return data as Slide & { sections: Database['public']['Tables']['sections']['Row'] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToSlides = (callback: (slides: Slide[]) => void) => {
    const subscription = supabase
      .channel('slides_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slides',
          filter: `pitch_deck_id=eq.${pitchDeckId}`
        },
        async () => {
          const { data } = await supabase
            .from('slides')
            .select('*')
            .eq('pitch_deck_id', pitchDeckId)
            .order('order_index', { ascending: true })
          
          if (data) callback(data)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  return {
    isLoading,
    error,
    createSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    getSlides,
    getSlide,
    subscribeToSlides,
  }
}
