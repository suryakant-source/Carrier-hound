import React from "react";
import { cn } from "@/lib/utils";
import {
  TestimonialCard,
  TestimonialAuthor,
} from "@/components/ui/testimonial-card";

export interface TestimonialItem {
  author: TestimonialAuthor;
  text: string;
}

export interface TestimonialsWithMarqueeProps {
  title?: string;
  description?: string;
  testimonials: TestimonialItem[];
  className?: string;
}

export function TestimonialsWithMarquee({
  title = "Loved by job seekers everywhere",
  description = "Thousands of people found their dream job through us - here's what they say.",
  testimonials,
  className,
}: TestimonialsWithMarqueeProps) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-background", className)}>
      <div className="max-w-container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Marquee Wrapper with edge fade gradients on sm+ */}
        <div className="relative w-full overflow-hidden">
          {/* Left edge gradient fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 sm:w-36 bg-gradient-to-r from-background to-transparent sm:block z-10" />

          {/* Right edge gradient fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 sm:w-36 bg-gradient-to-l from-background to-transparent sm:block z-10" />

          {/* Marquee Track with hover pause */}
          <div className="group flex overflow-hidden py-4 [--gap:1.25rem] [--duration:35s] [gap:var(--gap)] flex-row max-w-full">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {testimonials.map((item, i) => (
                <TestimonialCard
                  key={`track1-${i}`}
                  author={item.author}
                  text={item.text}
                />
              ))}
            </div>

            <div
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
              aria-hidden="true"
            >
              {testimonials.map((item, i) => (
                <TestimonialCard
                  key={`track2-${i}`}
                  author={item.author}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsWithMarquee;
