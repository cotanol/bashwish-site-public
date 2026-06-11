"use client";

import { useState } from "react";
import ReviewForm from "@/components/venue/ReviewForm";
import ReviewsList from "@/components/venue/ReviewsList";
import { Button } from "@/components/ui/button";

interface ReviewsSectionProps {
  venueSlug: string;
  venueName: string;
  reviews: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function ReviewsSection({
  venueSlug,
  venueName,
  reviews,
}: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / // eslint-disable-line @typescript-eslint/no-explicit-any
        reviews.length
      : 0;
  return (
    <div className="px-4 md:px-12 lg:px-32 xl:px-44 bg-[#FBF2E0] py-8 md:py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1C3658] mb-8 text-center">
        Customer Reviews
      </h2>

      {/* Reviews List */}
      <div className="mb-8 md:mb-12">
        <ReviewsList
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={reviews.length}
        />
      </div>

      {/* Write Review Button */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant="golden"
          size="golden"
          className="cursor-pointer shadow-lg hover:shadow-xl transition-all"
        >
          {showReviewForm ? "Hide Review Form" : "Write a Review"}
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="animate-in slide-in-from-top duration-300">
          <ReviewForm venueSlug={venueSlug} venueName={venueName} />
        </div>
      )}
    </div>
  );
}
