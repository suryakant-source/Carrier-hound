import React from "react";
import { Star } from "lucide-react";
import { Review, MiniReview } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const COLOR_CLASSES: Record<MiniReview["color"], { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
  rose: { bg: "bg-rose-100", text: "text-rose-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-800" },
  sky: { bg: "bg-sky-100", text: "text-sky-700" },
  violet: { bg: "bg-violet-100", text: "text-violet-700" },
};

interface ReviewCardProps {
  review: Review;
  className?: string;
}

/**
 * Standard Review Card styled exactly like the 1st reference testimonial (Image 1)
 */
export function ReviewCard({ review, className }: ReviewCardProps) {
  const colorStyle = COLOR_CLASSES[review.color] || COLOR_CLASSES.indigo;
  const initials = review.initials || review.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "bg-white border border-[#E4E4E7] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all duration-150 hover:shadow-md",
        className
      )}
    >
      <div>
        {/* Header row: Avatar + Name/Handle on left, 5 gold stars on right */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0",
                colorStyle.bg,
                colorStyle.text
              )}
            >
              {initials}
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#09090B] leading-none mb-1">{review.name}</h5>
              <span className="text-xs text-gray-500 font-normal leading-none">
                {review.handle || (review.role ? `@${review.role.toLowerCase().replace(/\s+/g, "_")}` : "@verified")}
              </span>
            </div>
          </div>

          {/* 5 Gold Stars */}
          <div className="flex items-center gap-0.5 text-[#F59E0B]" aria-label={`${review.stars} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <p className="text-sm sm:text-base text-[#09090B] leading-relaxed font-normal">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

interface MiniReviewCardProps {
  review: MiniReview;
  className?: string;
}

/**
 * Mini Review Card for Wall of Love styled exactly like the 1st reference testimonial (Image 1)
 */
export function MiniReviewCard({ review, className }: MiniReviewCardProps) {
  const colorStyle = COLOR_CLASSES[review.color] || COLOR_CLASSES.indigo;

  return (
    <div
      className={cn(
        "bg-white border border-[#E4E4E7] rounded-xl p-5 shadow-sm break-inside-avoid mb-4 transition-all duration-150 hover:shadow-md",
        className
      )}
    >
      {/* Header row: Avatar + Name/Handle on left, 5 gold stars on right */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0",
              colorStyle.bg,
              colorStyle.text
            )}
          >
            {review.initials}
          </div>
          <div>
            <h5 className="text-sm font-bold text-[#09090B] leading-none mb-1">{review.name}</h5>
            <span className="text-xs text-gray-500 font-normal leading-none">{review.handle}</span>
          </div>
        </div>

        {/* 5 Gold Stars */}
        <div className="flex items-center gap-0.5 text-[#F59E0B]" aria-label={`${review.stars} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>
      </div>

      {/* Testimonial Quote */}
      <p className="text-sm text-[#09090B] leading-relaxed font-normal">
        &ldquo;{review.quote}&rdquo;
      </p>
    </div>
  );
}
