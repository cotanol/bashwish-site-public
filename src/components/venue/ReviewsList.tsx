'use client'

interface Review {
  id: string
  authorName: string
  rating: number
  text: string | null
  reviewDate: string
  createdAt: string
}

interface ReviewsListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ReviewsList({ reviews, averageRating, totalReviews }: ReviewsListProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xl">
            {star <= rating ? '⭐' : '☆'}
          </span>
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 border-2 border-[#000000] rounded-lg">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-[#1C3658] mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this venue!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
  {/* Rating Summary */}
  <div className="bg-[#FBF2E0] border-2 border-[#000000] shadow-[3px_3px_0_#000000] rounded-lg p-4 md:p-6">
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Score Circle */}
      <div className="text-center w-full md:w-auto">
        <div className="text-5xl font-bold text-[#1C3658]">
          {averageRating.toFixed(1)}
        </div>
        <div className="mt-2 flex justify-center">{renderStars(Math.round(averageRating))}</div>
        <p className="text-sm text-gray-600 mt-1">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2 w-full">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter((r) => r.rating === stars).length
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

          return (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm font-medium w-8 md:w-12 text-right">{stars} ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#F8BD36] h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 md:w-12 text-right">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  </div>

  {/* Individual Reviews */}
  <div className="space-y-4">
    <h3 className="text-xl md:text-2xl font-bold text-[#1C3658]">Customer Reviews</h3>
    {reviews.map((review) => (
      <div
        key={review.id}
        className="bg-white border-2 border-[#000000] shadow-[2px_2px_0_#000000] rounded-lg p-4 md:p-6 hover:shadow-[4px_4px_0_#000000] transition-all"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-0">
          <div>
            <h4 className="font-bold text-lg text-[#1C3658] break-words">{review.authorName}</h4>
            <p className="text-xs md:text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
          <div className="flex-shrink-0">
             {renderStars(review.rating)}
          </div>
        </div>
        {review.text && (
          <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words">
            {review.text}
          </p>
        )}
      </div>
    ))}
  </div>
</div>
  )
}
