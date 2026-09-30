"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import Modal from "@/components/Modal";
import AvatarStack from "@/components/AvatarStack";
import Chip from "@/components/Chip";
import PaywallModal from "@/components/PaywallModal";
import UserMenu from "@/components/UserMenu";
import CategoryPillBar from "@/components/CategoryPillBar";
import FilterSlideOver from "@/components/FilterSlideOver";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Job } from "@/data/jobs";
import { CATEGORIES } from "@/data/categories";
import { toast } from "react-toastify";
import {
  Search,
  Briefcase,
  FileText,
  LogIn,
  Clock,
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  SlidersHorizontal,
  Radio,
  ExternalLink,
  Lock,
  Loader2,
  Menu,
} from "lucide-react";

// Category mapping for social app style category pills
const PILL_CATEGORY_MAPPING: Record<string, string[]> = {
  tech: ["software", "engineering", "technology", "devops", "ai-ml", "ai", "mobile-dev", "architecture"],
  design: ["design", "art-design"],
  marketing: ["marketing", "product-marketing", "sales"],
  finance: ["finance"],
  data: ["data-analytics", "data-science"],
  product: ["product"],
  hr: ["hr", "recruiting"],
  operations: ["operations"],
  sales: ["sales"],
  "cyber-security": ["cyber-security"],
  "qa-testing": ["qa-testing"],
  "customer-support": ["customer-support", "customer-success"],
  legal: ["legal"],
  healthcare: ["healthcare"],
};

function JobSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categories") || "";

  // Auth & Membership state
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const updateAuthAndPro = (currentUser: User | null) => {
      let effectiveUser = currentUser;
      if (!effectiveUser && typeof window !== "undefined") {
        const localEmail = localStorage.getItem("careermonke_user_email");
        if (localEmail) {
          effectiveUser = {
            id: "local-user",
            email: localEmail,
            user_metadata: {},
          } as User;
        }
      }

      setUser(effectiveUser);
      if (!effectiveUser) {
        setIsPro(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("careermonke_pro_active");
        }
        return;
      }
      const isUserPro = effectiveUser.user_metadata?.is_pro === true;
      const isLocalPro =
        typeof window !== "undefined" &&
        localStorage.getItem("careermonke_pro_active") === "true";
      setIsPro(Boolean(isUserPro || isLocalPro));
    };

    // Initial check
    updateAuthAndPro(null);

    supabase.auth.getUser().then(({ data }) => {
      updateAuthAndPro(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        const localEmail =
          typeof window !== "undefined"
            ? localStorage.getItem("careermonke_user_email")
            : null;
        if (!localEmail) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("careermonke_pro_active");
          }
          setUser(null);
          setIsPro(false);
        } else {
          updateAuthAndPro(null);
        }
      } else {
        updateAuthAndPro(session.user);
      }
    });

    const handleStorageUpdate = () => {
      supabase.auth.getUser().then(({ data }) => {
        updateAuthAndPro(data.user);
      });
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("careermonke_pro_updated", handleStorageUpdate);
    window.addEventListener("careermonke_auth_updated", handleStorageUpdate);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("careermonke_pro_updated", handleStorageUpdate);
      window.removeEventListener("careermonke_auth_updated", handleStorageUpdate);
    };
  }, []);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [countryFilter, setCountryFilter] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Social App Category Pill State (reflects ?cat=... in URL)
  const [activePillCategory, setActivePillCategory] = useState<string | null>(
    searchParams.get("cat") || (initialCategory ? initialCategory : null)
  );

  // Advanced Filters State (Salary, Experience)
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  // Live Supabase Jobs & Pagination State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(4600);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [moreModalJob, setMoreModalJob] = useState<Job | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [signupEmail, setSignupEmail] = useState("");
  const [paywallOpen, setPaywallOpen] = useState(false);

  const handleProUnlocked = () => {
    setIsPro(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("careermonke_pro_active", "true");
    }
    toast.success("CareerMonke Pro unlocked! All verified job details and direct apply links are active.");
  };

  // Handle clicking on any blurred detail (Location, Date, Remote, Salary)
  const handleGatedAction = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      toast.info("Please sign in first to access CareerMonke Pro and unlock job details.");
      router.push("/login?next=/job-search/all");
      return;
    }
    if (!isPro) {
      setPaywallOpen(true);
    }
  };

  // Handle Apply Direct — if guest -> prompt sign in. If authed & free -> Paywall. If Pro -> open URL!
  const handleApplyClick = (e: React.MouseEvent, applyUrl?: string) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in first to apply directly to verified employer listings.");
      router.push("/login?next=/job-search/all");
      return;
    }
    if (!isPro) {
      setPaywallOpen(true);
      return;
    }
    if (applyUrl && applyUrl !== "#") {
      window.open(applyUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Opening employer application portal...");
    }
  };

  // Categories list
  const allCategoryOptions = useMemo(() => {
    return CATEGORIES.map((c) => ({ value: c.slug, label: c.name }));
  }, []);

  const jobsPerPage = 10;
  const totalPages = Math.ceil(totalJobs / jobsPerPage) || 1;

  // Handle Category Pill Selection (toggling, URL sync, page reset)
  const handleSelectPillCategory = (id: string | null) => {
    setActivePillCategory(id);
    setCurrentPage(1);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (id) {
        url.searchParams.set("cat", id);
      } else {
        url.searchParams.delete("cat");
      }
      url.searchParams.delete("categories");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    setSelectedCategories([]);
    setCountryFilter("all");
    setRemoteOnly(false);
    setDateFilter("all");
    setSalaryFilter("all");
    setExperienceFilter("all");
    setActivePillCategory(null);
    setSearchTerm("");
    setCurrentPage(1);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("cat");
      url.searchParams.delete("categories");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Live Database Fetch — Instant & lightweight!
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const supabase = createClient();
    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("status", "active");

    if (searchTerm.trim()) {
      query = query.or(
        `title.ilike.%${searchTerm.trim()}%,company.ilike.%${searchTerm.trim()}%`
      );
    }

    // Category Pill Filter
    if (activePillCategory) {
      if (activePillCategory === "trending") {
        query = query.in("company", [
          "OpenAI",
          "Stripe",
          "Linear",
          "ElevenLabs",
          "Perplexity AI",
          "Baseten",
          "Cohere",
          "Notion",
        ]);
      } else if (activePillCategory === "tech") {
        query = query.or(
          "category.in.(software,engineering,devops,ai),title.ilike.%engineer%,title.ilike.%developer%"
        );
      } else if (activePillCategory === "design") {
        query = query.or("category.eq.design,title.ilike.%design%,title.ilike.%ui%,title.ilike.%ux%");
      } else if (activePillCategory === "marketing") {
        query = query.or("category.eq.marketing,title.ilike.%marketing%,title.ilike.%growth%");
      } else if (activePillCategory === "finance") {
        query = query.or("category.eq.finance,title.ilike.%finance%,title.ilike.%accounting%");
      } else if (activePillCategory === "data") {
        query = query.or("category.eq.data,title.ilike.%data%,title.ilike.%analytics%,title.ilike.%ml%");
      } else if (activePillCategory === "internships") {
        query = query.or("title.ilike.%intern%,job_type.ilike.%intern%");
      } else if (activePillCategory === "remote") {
        query = query.eq("remote_scope", "remote");
      } else if (activePillCategory === "fresher") {
        query = query.or(
          "title.ilike.%junior%,title.ilike.%entry%,title.ilike.%associate%,title.ilike.%graduate%,title.ilike.%fresher%,title.ilike.%intern%"
        );
      } else if (activePillCategory === "product") {
        query = query.ilike("title", "%product%");
      } else if (activePillCategory === "hr") {
        query = query.or("title.ilike.%hr%,title.ilike.%people%,title.ilike.%recruiting%,title.ilike.%talent%");
      } else if (activePillCategory === "operations") {
        query = query.or("title.ilike.%operation%,title.ilike.%ops%");
      } else if (activePillCategory === "sales") {
        query = query.or("title.ilike.%sales%,title.ilike.%account executive%,title.ilike.%business development%");
      } else if (activePillCategory === "cyber-security") {
        query = query.ilike("title", "%security%");
      } else if (activePillCategory === "qa-testing") {
        query = query.or("title.ilike.%test%,title.ilike.%qa%,title.ilike.%quality%");
      } else if (activePillCategory === "customer-support") {
        query = query.or("title.ilike.%support%,title.ilike.%success%");
      } else if (activePillCategory === "legal") {
        query = query.or("title.ilike.%legal%,title.ilike.%counsel%,title.ilike.%compliance%");
      } else if (activePillCategory === "healthcare") {
        query = query.or("title.ilike.%health%,title.ilike.%care%,title.ilike.%medical%");
      } else if (PILL_CATEGORY_MAPPING[activePillCategory]) {
        query = query.in("category", PILL_CATEGORY_MAPPING[activePillCategory]);
      }
    }

    if (selectedCategories.length > 0) {
      query = query.in("category", selectedCategories);
    }

    if (countryFilter !== "all") {
      query = query.eq("country", countryFilter);
    }

    if (remoteOnly) {
      query = query.eq("remote_scope", "remote");
    }

    // Experience Filter
    if (experienceFilter === "fresher") {
      query = query.or(
        "title.ilike.%junior%,title.ilike.%entry%,title.ilike.%associate%,title.ilike.%graduate%,title.ilike.%fresher%,title.ilike.%intern%"
      );
    } else if (experienceFilter === "senior") {
      query = query.or(
        "title.ilike.%senior%,title.ilike.%lead%,title.ilike.%staff%,title.ilike.%principal%,title.ilike.%director%"
      );
    } else if (experienceFilter === "mid") {
      query = query.not("title", "ilike", "%senior%").not("title", "ilike", "%intern%");
    }

    const from = (currentPage - 1) * jobsPerPage;
    const to = from + jobsPerPage - 1;

    query = query.order("id", { ascending: true }).range(from, to);

    query.then(({ data, count, error }) => {
      if (!isMounted) return;
      if (!error && data) {
        const mapped: Job[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          company: d.company,
          location: d.location,
          date: d.date || "Today",
          salary: d.salary_text || "Competitive",
          category: d.category || "software",
          remote: d.remote_scope === "remote",
          country: d.country || "United States",
          type: d.job_type === "full-time" ? "Full-time" : d.job_type,
          directSource: true,
          applyUrl: d.apply_url || "#",
        }));
        setJobs(mapped);
        if (count !== null) setTotalJobs(count);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [
    searchTerm,
    activePillCategory,
    selectedCategories,
    countryFilter,
    remoteOnly,
    experienceFilter,
    salaryFilter,
    currentPage,
  ]);

  const handleToggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
    setCurrentPage(1);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = signupEmail.trim();
    if (!cleanEmail) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("careermonke_user_email", cleanEmail);
      document.cookie = `careermonke_user_email=${encodeURIComponent(cleanEmail)}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("careermonke_auth_updated"));
    }

    setUser({ id: "local-user", email: cleanEmail, user_metadata: {} } as User);
    toast.success(`Welcome, ${cleanEmail}!`);
    setApplyModalJob(null);
    setSignupEmail("");

    if (!isPro) {
      setPaywallOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#09090B] flex flex-col">
      {/* ========================================================================= */}
      {/* APP HEADER (White, bottom shadow, 2 rows)                                 */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        {/* Row 1: Logo & Nav Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
              <BrandIcon className="w-7 h-7" />
            </div>
            <span className="text-xl font-black text-blue-600 tracking-tight">CareerMonke</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/job-search/all"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-slate-100 transition-colors min-h-[44px]"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Jobs</span>
            </Link>
            <button
              type="button"
              onClick={() => setPaywallOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px]"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Resume</span>
            </button>
            <Link
              href="/radar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-cyan-950 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-xs min-h-[44px]"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>3D Radar</span>
            </Link>
            <UserMenu variant="light" />
          </div>

          {/* Mobile Header Controls: UserMenu + Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <UserMenu variant="light" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 shadow-lg animate-fadeIn">
            <Link
              href="/job-search/all"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors min-h-[44px]"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Jobs Feed</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setPaywallOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors min-h-[44px] text-left cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>AI Resume Scanner</span>
            </button>
            <Link
              href="/radar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white min-h-[44px]"
            >
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>3D Radar View</span>
            </Link>
          </div>
        )}

        {/* Row 2: Search input + Search button + Mobile Filter Toggle */}
        <div className="border-t border-gray-100 bg-gray-50/60 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search job title... (Exact search)"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm min-h-[44px]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setSlideOverOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3.5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-xs min-h-[44px] shrink-0 cursor-pointer"
              aria-label="Toggle job filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold">Filters</span>
              {(selectedCategories.length > 0 ||
                countryFilter !== "all" ||
                remoteOnly ||
                salaryFilter !== "all" ||
                experienceFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Row 3: Category Filter Pill-Bar (Social app style, horizontal scroll with snap) */}
        <CategoryPillBar
          activeCategory={activePillCategory}
          onSelectCategory={handleSelectPillCategory}
          onOpenFilters={() => setSlideOverOpen(true)}
          hasActiveFilters={
            selectedCategories.length > 0 ||
            countryFilter !== "all" ||
            remoteOnly ||
            salaryFilter !== "all" ||
            experienceFilter !== "all" ||
            dateFilter !== "all"
          }
        />
      </header>

      {/* ========================================================================= */}
      {/* 2 COLUMNS BODY                                                           */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-8 items-start">
          {/* ===================================================================== */}
          {/* Left Column: Filter Card (~290px)                                     */}
          {/* ===================================================================== */}
          <aside
            className={`bg-white border border-[#E4E4E7] rounded-xl p-5 shadow-sm lg:sticky lg:top-36 space-y-6 ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-[#09090B] text-base">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </div>
              {(selectedCategories.length > 0 ||
                countryFilter !== "all" ||
                remoteOnly ||
                salaryFilter !== "all" ||
                experienceFilter !== "all" ||
                activePillCategory !== null) && (
                <button
                  onClick={handleResetAllFilters}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Category Filter with multi-select chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Categories
              </label>

              {/* Selected Category Chips */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedCategories.map((catSlug) => {
                    const catObj = CATEGORIES.find((c) => c.slug === catSlug);
                    return (
                      <span
                        key={catSlug}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-200"
                      >
                        <span>{catObj?.name || catSlug}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(catSlug)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Category dropdown */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleToggleCategory(e.target.value);
                }}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="">+ Add category filter...</option>
                {allCategoryOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={selectedCategories.includes(opt.value)}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Country / Region
              </label>
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">All Countries</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Remote Filter */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => {
                    setRemoteOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-medium text-[#09090B]">100% Remote Only</span>
              </label>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Date Discovered
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="all">Anytime (Live ATS feed)</option>
                <option value="24h">Past 24 hours</option>
                <option value="7d">Past 7 days</option>
                <option value="30d">Past 30 days</option>
              </select>
            </div>

            {/* Pro Tip Box */}
            <div className="bg-[#F8FAFF] p-3.5 rounded-lg border border-[#DBE3EF] text-xs text-[#4B5563] space-y-1">
              <span className="font-bold text-blue-700 block">Crawler Live Status:</span>
              <p>Polling verified company domains every 15 minutes. No agency syndication.</p>
            </div>
          </aside>

          {/* ===================================================================== */}
          {/* Right Column: Job Count + Job Cards + Pagination                      */}
          {/* ===================================================================== */}
          <div className="space-y-4">
            {/* Job Count Line */}
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-bold text-[#09090B]">
                {totalJobs > 0 ? (
                  <span>
                    Showing {totalJobs.toLocaleString()} active listings{" "}
                    <span className="text-sm font-normal text-gray-500">(from 61,065 monitored jobs)</span>
                  </span>
                ) : (
                  <span>{loading ? "Searching active listings..." : "No matching jobs found"}</span>
                )}
              </h2>
              <span className="text-xs font-mono text-gray-400">Page {currentPage} of {totalPages}</span>
            </div>

            {/* Job Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-8 bg-gray-100 rounded w-1/2 mt-4" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-12 text-center space-y-3">
                <p className="text-gray-500 text-base">No listings match your current filter selections.</p>
                <button
                  onClick={handleResetAllFilters}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      {/* Job Title: text-2xl semibold (Unblurred) */}
                      <h3 className="text-2xl font-semibold text-[#09090B] tracking-tight hover:text-[#2563EB] cursor-pointer">
                        {job.title}
                      </h3>

                      {/* Company Name, Location, Date */}
                      <div className="flex flex-wrap items-center gap-2.5 text-sm text-[#4B5563]">
                        {/* Company Name (Blurred if !isPro) */}
                        <span
                          onClick={!isPro ? handleGatedAction : undefined}
                          className={
                            !isPro
                              ? "filter blur-[6px] select-none text-gray-800 font-semibold cursor-pointer"
                              : "font-semibold text-gray-900"
                          }
                          title={
                            !isPro
                              ? user
                                ? "Click to unlock company with Pro"
                                : "Sign in to unlock company"
                              : undefined
                          }
                        >
                          {job.company}
                        </span>

                        <span>•</span>

                        {/* Location (Blurred if !isPro) */}
                        <span
                          onClick={!isPro ? handleGatedAction : undefined}
                          className={`flex items-center gap-1 ${
                            !isPro ? "cursor-pointer group/loc" : ""
                          }`}
                          title={
                            !isPro
                              ? user
                                ? "Click to unlock location with Pro"
                                : "Sign in to unlock location"
                              : undefined
                          }
                        >
                          <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover/loc:text-blue-600 transition-colors" />
                          <span
                            className={
                              !isPro
                                ? "filter blur-[6px] select-none text-gray-700"
                                : ""
                            }
                          >
                            {job.location}
                          </span>
                        </span>

                        <span>•</span>

                        {/* Date (Blurred if !isPro) */}
                        <span
                          onClick={!isPro ? handleGatedAction : undefined}
                          className={`flex items-center gap-1 font-mono text-xs ${
                            !isPro ? "cursor-pointer group/date" : "text-gray-400"
                          }`}
                          title={
                            !isPro
                              ? user
                                ? "Click to unlock release date with Pro"
                                : "Sign in to unlock release date"
                              : undefined
                          }
                        >
                          <Clock className="w-3.5 h-3.5 text-gray-400 group-hover/date:text-blue-600 transition-colors" />
                          <span
                            className={
                              !isPro
                                ? "filter blur-[5px] select-none text-gray-600"
                                : "text-gray-400"
                            }
                          >
                            {job.date || "Today"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Direct Apply Link + Outline pill More */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      {/* Direct Apply button */}
                      <button
                        type="button"
                        onClick={(e) => handleApplyClick(e, job.applyUrl)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full font-semibold text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap group"
                      >
                        {!isPro && <Lock className="w-3.5 h-3.5 opacity-80" />}
                        <span>Apply Direct</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>

                      {/* Outline pill More button with layers icon */}
                      <button
                        type="button"
                        onClick={() => setMoreModalJob(job)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>More</span>
                      </button>
                    </div>
                  </div>

                  {/* Chips: Salary, Source, Remote */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                    {!isPro ? (
                      <button
                        type="button"
                        onClick={handleGatedAction}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-transparent hover:bg-gray-50/80 px-3 py-1 text-[0.88rem] text-gray-700 transition-all cursor-pointer group"
                        title={
                          user
                            ? "Click to unlock verified salary with Pro"
                            : "Sign in to unlock verified salary"
                        }
                      >
                        <Lock className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                        <span className="filter blur-[6px] select-none font-mono text-gray-800 tracking-tight">
                          {job.salary || "$130,000 - $175,000"}
                        </span>
                      </button>
                    ) : (
                      <Chip variant="salary">{job.salary}</Chip>
                    )}

                    <Chip variant="source">Direct ATS Source</Chip>

                    {job.remote && (
                      <span
                        onClick={!isPro ? handleGatedAction : undefined}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          !isPro
                            ? "border-gray-200 bg-gray-50/60 text-gray-700 cursor-pointer hover:border-gray-300 transition-all"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                        title={
                          !isPro
                            ? user
                              ? "Click to unlock remote status with Pro"
                              : "Sign in to unlock remote status"
                            : undefined
                        }
                      >
                        <span
                          className={!isPro ? "filter blur-[5px] select-none" : ""}
                        >
                          100% Remote
                        </span>
                      </span>
                    )}

                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-auto">
                      Verified Active
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Pagination: Previous | Page 1 | Next > (black button) */}
            <div className="pt-6 pb-12 flex items-center justify-between">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-sm font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: "More" -> Other matched jobs from this company                   */}
      {/* ========================================================================= */}
      <Modal
        open={!!moreModalJob}
        onOpenChange={(open) => !open && setMoreModalJob(null)}
        title={
          moreModalJob
            ? isPro
              ? `${moreModalJob.company} — Role Breakdown`
              : "Requisition Details — Role Breakdown"
            : "Job Details"
        }
        description="Verified direct-source requisition data directly from employer ATS."
      >
        {moreModalJob && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold block">
                {moreModalJob.category.toUpperCase()} • {moreModalJob.type}
              </span>
              <h4 className="text-xl font-bold text-gray-900 leading-tight">
                {moreModalJob.title}
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 pt-1">
                <span
                  className={
                    !isPro
                      ? "filter blur-[6px] select-none text-gray-800 font-semibold"
                      : "font-semibold text-gray-900"
                  }
                >
                  {moreModalJob.company}
                </span>
                <span>•</span>
                <span className={!isPro ? "filter blur-[6px] select-none text-gray-700" : ""}>
                  {moreModalJob.location}
                </span>
                <span>•</span>
                <span className={!isPro ? "filter blur-[6px] select-none text-gray-700 font-mono" : "text-emerald-700 font-bold font-mono"}>
                  {moreModalJob.salary}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
              <span>✓ 100% Verified Direct Application Endpoint</span>
              <span className="font-bold">Zero Middlemen</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMoreModalJob(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={(e) => handleApplyClick(e, moreModalJob.applyUrl)}
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm cursor-pointer"
              >
                {!isPro && <Lock className="w-4 h-4 opacity-80" />}
                <span>Go to Employer Application</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: "Apply" while logged out -> Sign up now to apply to this job     */}
      {/* ========================================================================= */}
      <Modal
        open={!!applyModalJob}
        onOpenChange={(open) => !open && setApplyModalJob(null)}
        title="Sign up now to apply to this job"
        description="Unlock direct employer Greenhouse, Lever, and Ashby endpoints with verified salary data."
      >
        <form onSubmit={handleSignupSubmit} className="space-y-5 pt-2">
          {applyModalJob && (
            <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-sm">
              <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold mb-0.5">
                Target Requisition
              </span>
              <span className="font-bold text-[#09090B] block">{applyModalJob.title}</span>
              <span className="text-xs text-emerald-700 font-semibold">{applyModalJob.salary}</span>
            </div>
          )}

          <div>
            <label htmlFor="signup-email" className="block text-sm font-semibold text-[#09090B] mb-1.5">
              Work or Personal Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] rounded-lg text-sm text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer shadow-sm text-sm"
          >
            Sign up to Unlock Direct Link
          </button>

          {/* AvatarStack + social proof line inside modal */}
          <div className="pt-2 flex justify-center">
            <AvatarStack
              peopleCount="24,800+"
              jobsCount="61,000+"
              textColor="text-gray-700"
            />
          </div>
        </form>
      </Modal>

      {/* Advanced Filter Slide-Over Drawer */}
      <FilterSlideOver
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        countryFilter={countryFilter}
        onChangeCountry={(c) => {
          setCountryFilter(c);
          setCurrentPage(1);
        }}
        remoteOnly={remoteOnly}
        onToggleRemote={(r) => {
          setRemoteOnly(r);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        onChangeDate={(d) => setDateFilter(d)}
        salaryFilter={salaryFilter}
        onChangeSalary={(s) => {
          setSalaryFilter(s);
          setCurrentPage(1);
        }}
        experienceFilter={experienceFilter}
        onChangeExperience={(exp) => {
          setExperienceFilter(exp);
          setCurrentPage(1);
        }}
        onResetAll={handleResetAllFilters}
      />

      {/* Paywall Modal */}
      <PaywallModal
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        user={user}
        onSuccess={handleProUnlocked}
      />
    </div>
  );
}

export default function JobSearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center text-gray-500 font-medium">
          Loading live job radar...
        </div>
      }
    >
      <JobSearchContent />
    </React.Suspense>
  );
}
