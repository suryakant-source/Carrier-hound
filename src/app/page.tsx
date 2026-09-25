"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandIcon from "@/components/BrandIcon";
import DotPattern from "@/components/DotPattern";
import AvatarStack from "@/components/AvatarStack";
import ProductScreenshotMock from "@/components/ProductScreenshotMock";
import { ReviewCard, MiniReviewCard } from "@/components/ReviewCards";
import { FaqHomeItem } from "@/components/FaqItems";
import { WhiteHeroButton, OutlineSmallButton, PrimaryButton } from "@/components/Buttons";
import CategorySelectModal from "@/components/CategorySelectModal";
import Footer from "@/components/Footer";
import { FULL_REVIEWS, MINI_REVIEWS } from "@/data/testimonials";
import { X, Check, Mail, ExternalLink, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewsCount, setReviewsCount] = useState({ row1: 3, row2: 3, row3: 3 });
  const [visibleMiniReviews, setVisibleMiniReviews] = useState(16);

  // Reviews partitioned for the 3 distinct review sections
  const row1Reviews = FULL_REVIEWS.slice(0, 3);
  const row2Reviews = FULL_REVIEWS.slice(3, 6);
  const row3Reviews = FULL_REVIEWS.slice(6, 9);

  return (
    <div className="min-h-screen bg-white text-[#09090B] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Blue #2563EB, centered) with overlay header              */}
      {/* ========================================================================= */}
      <section className="relative bg-[#2563EB] text-white pt-6 pb-20 sm:pb-28 lg:pb-32 overflow-hidden">
        {/* Background Subtle Gradient & Dots */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Minimal Hero Header (no nav bar, sits directly on blue hero) */}
        <div className="w-full max-w-[1340px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-4 sm:pt-6 mb-16 sm:mb-20 lg:mb-24 flex items-center justify-between relative z-20">
          {/* Left: Round white logo circle - enlarged */}
          <Link
            href="/"
            aria-label="YourBrand Home"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          >
            <BrandIcon className="w-8 h-8 sm:w-9 sm:h-9 text-[#2563EB]" />
          </Link>

          {/* Right: Outlined white 'Sign In' button - enlarged & well-proportioned */}
          <Link
            href="/login"
            className="w-[96px] sm:w-[108px] h-[46px] sm:h-[50px] rounded-xl border-2 border-white/90 hover:border-white text-white font-bold text-sm sm:text-base flex items-center justify-center transition-all hover:bg-white/10 shadow-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Hero Content - shifted downward so View Jobs sits just slightly above center */}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-20 space-y-4 sm:space-y-5 pt-2 sm:pt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold leading-tight sm:leading-tight text-white max-w-3xl mx-auto tracking-tight">
            Find jobs not on LinkedIn/Indeed
          </h1>

          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            We find jobs posted on company websites.
          </p>

          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 bg-white text-[#09090B] font-bold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>View Jobs</span>
              <ArrowRight className="w-5 h-5 ml-0.5 stroke-[2.5]" />
            </button>
            <Link
              href="/radar"
              className="inline-flex items-center justify-center gap-2 bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-base px-6 py-3.5 sm:py-4 rounded-xl border border-white/20 hover:border-cyan-400 backdrop-blur-md shadow-lg hover:scale-105 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>3D Globe Radar</span>
            </Link>
          </div>

          <div className="pt-3 sm:pt-4">
            <AvatarStack
              peopleCount="8,573"
              jobsCount="4.5 million"
              textColor="text-white/90"
            />
          </div>
        </div>

        {/* Product Screenshot Mock nested inside hero on blue background */}
        <div className="mt-10 sm:mt-14 max-w-[880px] mx-auto px-4 sm:px-6 relative z-20">
          {/* Dotted grid pattern behind top-right corner */}
          <div className="absolute -top-6 -right-4 sm:-top-7 sm:-right-6 pointer-events-none hidden sm:block z-0">
            <DotPattern width={160} height={120} dotColor="rgba(255, 255, 255, 0.45)" rows={6} cols={8} />
          </div>

          {/* Dotted grid pattern behind bottom-left corner */}
          <div className="absolute -bottom-6 -left-4 sm:-bottom-7 sm:-left-6 pointer-events-none hidden sm:block z-0">
            <DotPattern width={160} height={120} dotColor="rgba(255, 255, 255, 0.45)" rows={6} cols={8} />
          </div>

          <div className="relative z-10">
            <ProductScreenshotMock />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM VS SOLUTION (Centered H2 + 2 columns)                          */}
      {/* ========================================================================= */}
      <section className="pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] max-w-content mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#09090B] tracking-tight mb-4">
            Tired of getting auto-rejections?
          </h2>
          <p className="text-[#4B5563] text-base sm:text-lg">
            Traditional aggregator algorithms bury your resume under hundreds of bots and agency spam. Here is how YourBrand changes the odds:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left card: Competitor (Big job boards) */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-7 shadow-sm">
            <h3 className="text-xl font-bold text-[#09090B] pb-4 mb-6 border-b border-gray-100 flex items-center justify-between">
              <span>Big job boards</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-red-500 bg-red-50 px-2.5 py-1 rounded">
                High Friction
              </span>
            </h3>
            <ul className="space-y-4">
              {[
                "1,000+ applicants within hours of syndication",
                "Ghost listings that expired weeks ago",
                "Aggressive recruiter tracking and 8-page questionnaires",
                "Concealed compensation and vague salary ranges",
                "Recruiting agency reposts disguising client identities",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-red-600 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right card: YourBrand (5 green checks) */}
          <div className="bg-[#F8FAFF] border-2 border-blue-500/80 rounded-xl p-7 shadow-[0_12px_32px_rgba(37,99,235,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <h3 className="text-xl font-bold text-[#09090B] pb-4 mb-6 border-b border-blue-100 flex items-center gap-2">
              <span className="text-[#2563EB]">YourBrand</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                Direct Signal
              </span>
            </h3>
            <ul className="space-y-4">
              {[
                "Under 25 applicants per unindexed opening",
                "Verified active ATS endpoints polled sub-hourly",
                "One click direct to employer Greenhouse, Lever, or Ashby",
                "Pre-calculated salary chips and true compensation bounds",
                "Direct employer requisitions only—no staffing brokers",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base text-[#09090B] font-medium leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REVIEWS ROW 1 (3 ReviewCards + See More button)                       */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white max-w-content mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {row1Reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <OutlineSmallButton onClick={() => setModalOpen(true)}>
            See More Reviews
          </OutlineSmallButton>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CTA BAND (Blue #2563EB, Free Preview style)                            */}
      {/* ========================================================================= */}
      <section className="bg-[#2563EB] text-white py-20 lg:py-[115px] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Free Preview: Explore Verified Hidden Requisitions
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-[515px] mx-auto leading-relaxed">
            Scan live feeds from 12,000+ top engineering employers. Filter by salary, timezone, and exact role criteria with zero commitment.
          </p>
          <div className="pt-2">
            <WhiteHeroButton onClick={() => setModalOpen(true)} className="px-8 min-w-[210px]">
              View Jobs
            </WhiteHeroButton>
            <div className="text-xs text-white/70 mt-2 font-medium">
              (Preview Only • No Credit Card Required)
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOUNDER CARD (Centered bordered card ~670px)                           */}
      {/* ========================================================================= */}
      <section className="pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] max-w-content mx-auto px-6 w-full">
        <div className="max-w-[670px] mx-auto bg-white border border-[#E4E4E7] rounded-xl p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Left: Big round photo placeholder + button */}
            <div className="flex flex-col items-center flex-shrink-0 space-y-3">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80"
                  alt="Founder photo"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span>My Videos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Right: Name, role, story, 3 stats */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-[#09090B]">Alex Mercer</h3>
                <p className="text-sm font-medium text-[#2563EB]">Founder & Career Systems Engineer</p>
              </div>

              <p className="text-[#4B5563] text-sm leading-relaxed">
                After spending six years building distributed platform infrastructure and watching hundreds of brilliant peers struggle with broken job boards, I wrote automated crawlers to query company ATS pages directly. YourBrand is built to give candidates unfair velocity in their job search.
              </p>

              {/* 3 Stats: 10M+ Views / 50K+ Followers / 500K+ Likes */}
              <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div>
                  <div className="text-lg font-black text-[#09090B]">10M+</div>
                  <div className="text-xs text-gray-500">Career Views</div>
                </div>
                <div>
                  <div className="text-lg font-black text-[#09090B]">50K+</div>
                  <div className="text-xs text-gray-500">Subscribers</div>
                </div>
                <div>
                  <div className="text-lg font-black text-[#09090B]">500K+</div>
                  <div className="text-xs text-gray-500">Community Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. REVIEWS ROW 2 (3 cards + See More button)                              */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white max-w-content mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {row2Reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <OutlineSmallButton onClick={() => setModalOpen(true)}>
            See More Reviews
          </OutlineSmallButton>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ (Gray-100 bg #F3F4F6, centered H2, 2 Q&A items, max-width ~670px) */}
      {/* ========================================================================= */}
      <section className="bg-[#F3F4F6] py-20 lg:py-[100px]">
        <div className="max-w-[670px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#09090B] tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base">
              Everything you need to know about our direct employer discovery radar.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200/80 shadow-sm divide-y divide-gray-100">
            <FaqHomeItem
              question="How is YourBrand different from LinkedIn or Indeed?"
              answer="Conventional job boards require employers to manually publish and pay for promotional placement, which results in huge backlogs and thousands of applicants per listing. YourBrand automatically queries verified company career endpoints directly every 15 minutes, uncovering positions before they are publicized."
            />
            <FaqHomeItem
              question="Do you take a percentage of my compensation if I get hired?"
              answer="Never. We are not a staffing agency or contingency recruiter. 100% of your compensation and equity offer stays with you. We simply give you direct, unmediated access to open employer requisitions."
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. REVIEWS ROW 3 (3 cards + See More button)                              */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white max-w-content mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {row3Reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <OutlineSmallButton onClick={() => setModalOpen(true)}>
            See More Reviews
          </OutlineSmallButton>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CONTACT (Gray-50 bg #F9FAFB, id="contact")                            */}
      {/* ========================================================================= */}
      <section id="contact" className="bg-[#F9FAFB] py-20 lg:py-[100px] border-t border-gray-200/60">
        <div className="max-w-xl mx-auto px-6 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#09090B] tracking-tight">
            Contact us
          </h2>
          <p className="text-[#4B5563] text-base leading-relaxed">
            Have questions about career feeds, employer integrations, or membership tiers? Our direct support engineering team is here to help.
          </p>
          <div className="pt-2">
            <a
              href="mailto:support@yourbrand.example.com"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-7 py-3 rounded-[6px] text-base transition-colors shadow-sm"
            >
              <Mail className="w-5 h-5" />
              <span>support@yourbrand.example.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. WALL OF LOVE (~30 MiniReviewCards in CSS columns masonry)             */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-[120px] max-w-content mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142033] tracking-tight mb-3">
            24,800+ job seekers are using YourBrand
          </h2>
          <p className="text-[#4B5563] text-base">
            Real feedback from software engineers, product designers, and remote professionals who landed roles.
          </p>
        </div>

        {/* 4-column masonry via Tailwind columns */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
          {MINI_REVIEWS.slice(0, visibleMiniReviews).map((mini) => (
            <MiniReviewCard key={mini.id} review={mini} />
          ))}
        </div>

        {visibleMiniReviews < MINI_REVIEWS.length && (
          <div className="mt-10 text-center">
            <OutlineSmallButton onClick={() => setVisibleMiniReviews(MINI_REVIEWS.length)}>
              Show All 30+ Reviews
            </OutlineSmallButton>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 12. FOOTER (Navy #090E34) & 13. BackToTop Button                          */}
      {/* ========================================================================= */}
      <Footer />

      {/* Category selection modal triggered by both "View Jobs" buttons */}
      <CategorySelectModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
