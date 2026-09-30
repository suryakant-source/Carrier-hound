"use client";

import React from "react";
import { TestimonialsWithMarquee, TestimonialItem } from "@/components/blocks/testimonials-with-marquee";

const testimonials: TestimonialItem[] = [
  {
    author: {
      name: "Priya Sharma",
      handle: "@priya_builds",
      avatar: "https://i.pravatar.cc/96?img=25",
    },
    text: "Landed an unlisted Frontend role directly via company ATS. Skipped the LinkedIn black hole completely!",
  },
  {
    author: {
      name: "Liam Anderson",
      handle: "@liam_codes",
      avatar: "https://i.pravatar.cc/96?img=12",
    },
    text: "CareerMonke picked up a US remote job 2 hours after posting. Got an offer in 10 days flat.",
  },
  {
    author: {
      name: "Ananya Deshmukh",
      handle: "@ananya_ux",
      avatar: "https://i.pravatar.cc/96?img=32",
    },
    text: "Best tool for product designers. Real hidden career page listings with verified salary ranges!",
  },
  {
    author: {
      name: "Marcus Vance",
      handle: "@marcus_data",
      avatar: "https://i.pravatar.cc/96?img=60",
    },
    text: "Applied directly to a stealth fintech through their greenhouse link. Starting as Lead Data Analyst next Monday!",
  },
  {
    author: {
      name: "Rohan Patel",
      handle: "@rohan_devops",
      avatar: "https://i.pravatar.cc/96?img=15",
    },
    text: "Zero recruiter markup, zero ghost positions. Found my current remote DevOps role within my first week.",
  },
  {
    author: {
      name: "Emily Watson",
      handle: "@emily_growth",
      avatar: "https://i.pravatar.cc/96?img=49",
    },
    text: "Found marketing jobs you simply cannot find on public aggregators. The platform paid for itself instantly!",
  },
];

export function TestimonialsMarqueeDemo() {
  return (
    <TestimonialsWithMarquee
      title="Loved by job seekers everywhere"
      description="Thousands of people found their dream job through us - here's what they say."
      testimonials={testimonials}
    />
  );
}

export default TestimonialsMarqueeDemo;
