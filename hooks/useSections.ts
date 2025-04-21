import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Section = Database['public']['Tables']['sections']['Row']

export const useSections = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSections = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('sections')
        .select('*')
        .order('suggested_order', { ascending: true })

      if (dbError) throw dbError
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getSection = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('sections')
        .select('*')
        .eq('id', id)
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

  const getSectionByName = async (name: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('sections')
        .select('*')
        .eq('name', name)
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

  const getSlidesForSection = async (sectionId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('slides')
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index', { ascending: true })

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
    getSections,
    getSection,
    getSectionByName,
    getSlidesForSection,
  }
}
