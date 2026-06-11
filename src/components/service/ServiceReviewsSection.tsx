"use client";

import { useState } from "react";
import ServiceReviewForm from "@/components/service/ServiceReviewForm";
import ServiceReviewsList from "@/components/service/ServiceReviewsList";
import { Button } from "@/components/ui/button";

interface ServiceReviewsSectionProps {
  serviceSlug: string;
  serviceName: string;
  reviews: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function ServiceReviewsSection({
  serviceSlug,
  serviceName,
  reviews,
}: ServiceReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / // eslint-disable-line @typescript-eslint/no-explicit-any
        reviews.length
      : 0;
  return (
    <div className="pb-12 md:pb-24 lg:pb-44 px-4 md:px-12 lg:px-40 bg-[#FBF2E0]">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1C3658] mb-8 text-center">
        Customer Reviews
      </h2>

      {/* Reviews List */}
      <div className="mb-8 md:mb-12">
        <ServiceReviewsList
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
          <ServiceReviewForm serviceSlug={serviceSlug} serviceName={serviceName} />
        </div>
      )}
    </div>
  );
}
