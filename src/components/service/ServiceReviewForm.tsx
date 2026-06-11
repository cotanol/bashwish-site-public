'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ServiceReviewFormProps {
  serviceSlug: string
  serviceName: string
  onSuccess?: () => void
}

export default function ServiceReviewForm({ serviceSlug, serviceName, onSuccess }: ServiceReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    rating: 5,
    text: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/api/public/services/${serviceSlug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review')
      }

      // Success - show message and reset form
      setShowSuccess(true)
      setFormData({ authorName: '', authorEmail: '', rating: 5, text: '' })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onSuccess?.()
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border-2 border-[#000000] shadow-[3px_3px_0_#000000] rounded-lg p-4 md:p-6 my-6">
  <h3 className="text-xl md:text-2xl font-bold text-[#1C3658] mb-4">
    Write a Review for {serviceName}
  </h3>

  {/* Success Message */}
  {showSuccess && (
    <div className="bg-green-50 border-2 border-green-500 text-green-700 p-3 md:p-4 rounded-lg mb-6 flex items-start md:items-center gap-3">
      <div className="text-xl md:text-2xl">✅</div>
      <div>
        <h4 className="font-bold text-sm md:text-base">Review submitted for approval!</h4>
        <p className="text-xs md:text-sm">Your review will be visible after admin approval.</p>
      </div>
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-4">
    {error && (
      <div className="bg-red-50 border-2 border-red-500 text-red-700 p-3 rounded-lg text-sm">
        {error}
      </div>
    )}

    {/* Rating */}
    <div>
      <Label htmlFor="rating" className="text-[#1C3658] font-semibold mb-2 block">
        Rating *
      </Label>
      <div className="flex gap-1 md:gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="text-3xl md:text-4xl hover:scale-110 transition-transform focus:outline-none"
          >
            {star <= formData.rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {formData.rating === 1 && 'Poor'}
        {formData.rating === 2 && 'Fair'}
        {formData.rating === 3 && 'Good'}
        {formData.rating === 4 && 'Very Good'}
        {formData.rating === 5 && 'Excellent'}
      </p>
    </div>

    {/* Name */}
    <div>
      <Label htmlFor="authorName" className="text-[#1C3658] font-semibold">
        Your Name *
      </Label>
      <Input
        id="authorName"
        type="text"
        required
        value={formData.authorName}
        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
        className="mt-1 w-full border-2 border-[#000000] focus:border-[#F8BD36] rounded-full px-4"
        placeholder="John Doe"
      />
    </div>

    {/* Email (optional) */}
    <div>
      <Label htmlFor="authorEmail" className="text-[#1C3658] font-semibold">
        Email (optional)
      </Label>
      <Input
        id="authorEmail"
        type="email"
        value={formData.authorEmail}
        onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
        className="mt-1 w-full border-2 border-[#000000] focus:border-[#F8BD36] rounded-full px-4"
        placeholder="john@example.com"
      />
      <p className="text-xs text-gray-500 mt-1">We&apos;ll never share your email</p>
    </div>

    {/* Review Text */}
    <div>
      <Label htmlFor="text" className="text-[#1C3658] font-semibold">
        Your Review
      </Label>
      <Textarea
        id="text"
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        className="mt-1 w-full border-2 border-[#000000] focus:border-[#F8BD36] rounded-lg min-h-[120px] p-3"
        placeholder="Share your experience with this service..."
      />
    </div>

    {/* Submit Button */}
    <div className="pt-2">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F8BD36] hover:bg-[#e0a820] text-[#1C3658] font-bold rounded-full border-2 border-[#000000] shadow-[3px_3px_0_#000000] hover:shadow-[5px_5px_0_#000000] transition-all disabled:opacity-50 disabled:cursor-not-allowed py-3"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review for Approval'}
      </Button>
    </div>

    <p className="text-xs text-gray-500 text-center">
      * Your review will be published after admin approval
    </p>
  </form>
</div>
  )
}
