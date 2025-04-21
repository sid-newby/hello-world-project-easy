import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthProvider'
import Input from './Input' // Assuming Input component exists
import Button from './Button' // Assuming Button component exists

interface CreateProjectFormProps {
  onSuccess: () => void // Callback on successful creation
  onCancel: () => void // Callback to close the form/dialog
}

function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [fundingStage, setFundingStage] = useState('')
  const [fundingGoal, setFundingGoal] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      setError('You must be logged in to create a project.')
      return
    }
    if (!title.trim()) {
      setError('Pitch deck title is required.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('pitch_decks')
        .insert({
          user_id: user.id,
          title: title.trim(),
          company_name: companyName.trim() || null,
          industry: industry.trim() || null,
          funding_stage: fundingStage.trim() || null,
          funding_goal: fundingGoal === '' ? null : Number(fundingGoal),
          description: description.trim() || null,
          // Add other fields like key_metrics if needed later
        })

      if (insertError) {
        throw insertError
      }

      console.log('Pitch deck created successfully!')
      onSuccess() // Call success callback (e.g., close dialog, refresh list)

    } catch (err) { // Use unknown type for better type safety
      console.error('Error creating pitch deck:', err)
      // Type guard or assertion needed if accessing specific properties of err
      const message = (err instanceof Error) ? err.message : 'Failed to create pitch deck. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 bg-red-100 p-2 border border-red-300">{error}</p>}

      {/* Assuming Input component takes label, value, onChange, type, etc. */}
      <Input
        label="Pitch Deck Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Series A Funding Round"
        required
      />
      <Input
        label="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="e.g., Acme Corporation"
      />
      <Input
        label="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="e.g., SaaS, E-commerce"
      />
       <Input
        label="Funding Stage"
        value={fundingStage}
        onChange={(e) => setFundingStage(e.target.value)}
        placeholder="e.g., Seed, Series A, Pre-seed"
      />
       <Input
        label="Funding Goal ($)"
        type="number"
        value={fundingGoal}
        onChange={(e) => setFundingGoal(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder="e.g., 1000000"
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional: Briefly describe this pitch deck"
          rows={3}
          className="neo-input w-full" // Use neo-input style
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          buttonText="Cancel"
          onClick={onCancel}
          color="gray" // Assuming Button has color prop
          disabled={isLoading}
        />
        <Button
          type="submit"
          buttonText={isLoading ? 'Creating...' : 'Create Pitch Deck'}
          color="violet" // Assuming Button has color prop
          disabled={isLoading}
        />
      </div>
    </form>
  )
}

export default CreateProjectForm
