// Parent "Smart" Component - The brain of reviews
"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import VenueReviewsPreview from "./VenueReviewsPreview";
import VenueReviewsModal from "./VenueReviewsModal";

// Define review type (internal component format)
export interface VenueReview {
  id: string;
  author: string;
  date: string;
  rating: number; // from 1 to 5
  text: string;
  avatarUrl?: string;
}

// API review type
interface APIReview {
  id: string;
  authorName: string;
  rating: number;
  text: string | null;
  reviewDate: string;
  source: string;
}

interface VenueReviewsProps {
  reviews?: APIReview[];
}

export default function VenueReviews({
  reviews: apiReviews,
}: VenueReviewsProps) {
  // Transform API reviews to component format
  const reviews: VenueReview[] = useMemo(() => {
    if (!apiReviews || apiReviews.length === 0) {
      return [];
    }

    return apiReviews.map((review) => ({
      id: review.id,
      author: review.authorName,
      date: new Date(review.reviewDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      rating: review.rating,
      text: review.text || "",
      avatarUrl: undefined,
    }));
  }, [apiReviews]);
  // Centralized states - The brain
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "recent", // 'recent', 'highest', 'lowest'
    stars: "all", // 'all', 5, 4, 3, 2, 1
  });

  // If no reviews, show message
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No reviews available yet for this venue.
        </p>
      </div>
    );
  }

  // --- Filter Logic (here in the parent) ---
  const filteredReviews = reviews
    .filter((review) => {
      if (filters.stars === "all") return true;
      return review.rating === Number(filters.stars);
    })
    .sort((a, b) => {
      if (filters.sortBy === "highest") return b.rating - a.rating;
      if (filters.sortBy === "lowest") return a.rating - b.rating;
      // By default, 'recent' (we assume they're already sorted by date)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // --- Simple Calculations ---
  const overallRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);
  const reviewCount = reviews.length;

  // --- Handlers ---
  const handleOpenModal = () => setIsModalOpen(true);
  const handleFilterChange = (type: "sortBy" | "stars", value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <>
      {/* Preview shown on the page */}
      <VenueReviewsPreview
        rating={overallRating}
        count={reviewCount}
        reviews={reviews} // Pass ALL reviews for the carousel
        onOpenModal={handleOpenModal}
      />

      {/* Modal with all reviews */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!h-[80vh] !w-[90vw] !max-w-[1000px] p-0 flex flex-col">
          <DialogTitle className="sr-only">Guest Reviews</DialogTitle>
          <div className="flex-1 min-h-0">
            <VenueReviewsModal
              reviews={filteredReviews}
              filters={filters}
              onFilterChange={handleFilterChange}
              overallRating={overallRating}
              reviewCount={reviewCount}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
