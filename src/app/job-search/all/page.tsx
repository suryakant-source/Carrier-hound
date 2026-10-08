"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
import { searchJobs } from "@/lib/api/jobs";
import type { User } from "@supabase/supabase-js";
import type { Job } from "@/data/jobs";
import { CATEGORIES } from "@/data/categories";
import { expandCategoryFilter } from "@/lib/taxonomy";
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
  AlertTriangle,
  RotateCcw,
  BookmarkPlus,
} from "lucide-react";
import MatchScoreBadge from "@/components/matcher/MatchScoreBadge";
import { quickTrackJob } from "@/lib/tracker/storage";

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

  // State (initialized from URL params)
  const initialCity = searchParams.get("city") || "";
  const initialQ = searchParams.get("q") || searchParams.get("search") || "";
  const initialCat = searchParams.get("cat") || "";
  const initialCategories = searchParams.get("categories")
    ? searchParams.get("categories")!.split(",").map((c) => c.trim()).filter(Boolean)
    : initialCat
    ? [initialCat]
    : [];
  const initialCountry = searchParams.get("country") || "all";
  const initialRemote = searchParams.get("remote") === "true";
  const initialSalary = searchParams.get("salary") || "all";
  const initialExperience = searchParams.get("experience") || "all";
  const initialDate = searchParams.get("date") || "all";
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  // Immediate input keystroke state vs debounced search term
  const [searchInput, setSearchInput] = useState(initialQ);
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [cityFilter, setCityFilter] = useState(initialCity);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [countryFilter, setCountryFilter] = useState(initialCountry);
  const [remoteOnly, setRemoteOnly] = useState(initialRemote);
  const [dateFilter, setDateFilter] = useState(initialDate);
  const [salaryFilter, setSalaryFilter] = useState(initialSalary);
  const [experienceFilter, setExperienceFilter] = useState(initialExperience);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  // Social App Category Pill State (reflects ?cat=... in URL)
  const [activePillCategory, setActivePillCategory] = useState<string | null>(initialCat || null);

  const [slideOverOpen, setSlideOverOpen] = useState(false);

  // Live Supabase Jobs & Pagination State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const activeRequestIdRef = useRef(0);

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

  // Quick Track Job Application
  const handleTrackJob = async (job: Job) => {
    try {
      await quickTrackJob(
        {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary_text: job.salary,
          apply_url: job.applyUrl,
        },
        "saved"
      );
      toast.success(`"${job.title}" added to Application Tracker!`);
    } catch (err) {
      toast.error("Could not add job to tracker");
    }
  };

  // Categories list
  const allCategoryOptions = useMemo(() => {
    return CATEGORIES.map((c) => ({ value: c.slug, label: c.name }));
  }, []);

  const jobsPerPage = 10;
  const totalPages = Math.ceil(totalJobs / jobsPerPage) || 1;

  // Compact page input state for direct jump
  const [pageInput, setPageInput] = useState(String(currentPage));
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    } else {
      setPageInput(String(currentPage));
    }
  };

  // 300ms Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== searchTerm) {
        setSearchTerm(trimmed);
        setCurrentPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchTerm]);

  // Immediate commit on Search button click or Enter key
  const handleCommitSearch = useCallback(() => {
    const trimmed = searchInput.trim();
    if (trimmed !== searchTerm) {
      setSearchTerm(trimmed);
      setCurrentPage(1);
    }
  }, [searchInput, searchTerm]);

  // URL sync helper
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "all" || val === "false") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, val);
      }
    });
    window.history.pushState({}, "", url.toString());
  }, []);

  // Sync state changes to URL
  useEffect(() => {
    updateUrl({
      q: searchTerm.trim() || null,
      cat: activePillCategory || null,
      categories: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
      country: countryFilter !== "all" ? countryFilter : null,
      remote: remoteOnly ? "true" : null,
      salary: salaryFilter !== "all" ? salaryFilter : null,
      experience: experienceFilter !== "all" ? experienceFilter : null,
      date: dateFilter !== "all" ? dateFilter : null,
      page: currentPage > 1 ? String(currentPage) : null,
    });
  }, [
    searchTerm,
    activePillCategory,
    selectedCategories,
    countryFilter,
    remoteOnly,
    salaryFilter,
    experienceFilter,
    dateFilter,
    currentPage,
    updateUrl,
  ]);

  // Handle browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      const cat = params.get("cat") || null;
      const cats = params.get("categories")
        ? params.get("categories")!.split(",").map((c) => c.trim()).filter(Boolean)
        : [];
      const country = params.get("country") || "all";
      const remote = params.get("remote") === "true";
      const salary = params.get("salary") || "all";
      const exp = params.get("experience") || "all";
      const dt = params.get("date") || "all";
      const pg = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

      setSearchInput(q);
      setSearchTerm(q);
      setActivePillCategory(cat);
      setSelectedCategories(cats);
      setCountryFilter(country);
      setRemoteOnly(remote);
      setSalaryFilter(salary);
      setExperienceFilter(exp);
      setDateFilter(dt);
      setCurrentPage(pg);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch unique active countries from database on mount
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("jobs")
      .select("country")
      .eq("status", "active")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const uniqueCountries = Array.from(
            new Set(data.map((j: any) => j.country).filter(Boolean))
          ).sort() as string[];
          if (uniqueCountries.length > 0) {
            setAvailableCountries(uniqueCountries);
          }
        }
      });
  }, []);

  // Handle Category Pill Selection (toggling, URL sync, page reset)
  const handleSelectPillCategory = (id: string | null) => {
    setActivePillCategory(id);
    setCurrentPage(1);
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
    setSearchInput("");
    setSearchTerm("");
    setCityFilter("");
    setCurrentPage(1);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.pushState({}, "", url.toString());
    }
  };

  // Live Database Fetch — Instant, debounced, resilient via searchJobs service
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setFetchError(null);
    const requestId = ++activeRequestIdRef.current;

    const runFetch = async () => {
      try {
        const result = await searchJobs({
          q: searchTerm,
          city: cityFilter || undefined,
          cat: activePillCategory || undefined,
          categories: selectedCategories,
          country: countryFilter,
          remote: remoteOnly,
          salary: salaryFilter,
          experience: experienceFilter,
          date: dateFilter,
          page: currentPage,
          pageSize: jobsPerPage,
        });

        if (!isMounted || requestId !== activeRequestIdRef.current) return;
        setJobs(result.jobs);
        setTotalJobs(result.total);
        if (result.availableCountries.length > 0 && availableCountries.length === 0) {
          setAvailableCountries(result.availableCountries);
        }
        setLoading(false);
      } catch (err: any) {
        if (!isMounted || requestId !== activeRequestIdRef.current) return;
        console.error("Fetch jobs error:", err);
        setFetchError(err?.message || "Connection error occurred");
        setJobs([]);
        setLoading(false);
      }
    };

    runFetch();

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
    dateFilter,
    currentPage,
    retryCount,
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
              href="/tracker"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-slate-100 transition-colors min-h-[44px]"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Tracker</span>
            </Link>
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
              href="/tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors min-h-[44px]"
            >
              <BookmarkPlus className="w-4 h-4 text-blue-600" />
              <span>Application Tracker</span>
            </Link>
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

        {/* Row 2: Search input + Search button + Filter Toggle */}
        <div className="border-t border-gray-100 bg-gray-50/60 py-3 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCommitSearch();
                }}
                placeholder="Search jobs by title or company..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E4E4E7] rounded-lg text-base sm:text-sm text-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm min-h-[44px]"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleCommitSearch}
              className="hidden sm:inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            {/* Filter Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setSlideOverOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3.5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-xs min-h-[44px] shrink-0 cursor-pointer"
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
      {/* MAIN JOB FEED (Centered Clean Layout)                                     */}
      {/* ========================================================================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        <div className="space-y-4">
          {/* Job Count Line & Active Filters Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <h2 className="text-lg font-bold text-[#09090B]">
              {fetchError ? (
                <span className="text-red-600">Error loading listings</span>
              ) : totalJobs > 0 ? (
                <span>
                  Showing {totalJobs.toLocaleString()} active listings
                </span>
              ) : (
                <span>{loading ? "Searching active listings..." : "No matching jobs found"}</span>
              )}
            </h2>

            <div className="flex items-center gap-3">
              {(selectedCategories.length > 0 ||
                countryFilter !== "all" ||
                remoteOnly ||
                salaryFilter !== "all" ||
                experienceFilter !== "all" ||
                activePillCategory !== null ||
                searchTerm ||
                searchInput) && (
                <button
                  onClick={handleResetAllFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Reset all filters</span>
                </button>
              )}
              <span className="text-xs font-mono text-gray-400">Page {currentPage} of {totalPages}</span>
            </div>
          </div>

            {/* Job Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-xs animate-pulse space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="h-6 bg-slate-200 rounded-md w-3/4 max-w-md" />
                        <div className="h-4 bg-slate-100 rounded-md w-1/2 max-w-xs" />
                      </div>
                      <div className="h-10 w-32 bg-slate-200 rounded-xl" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                      <div className="h-6 w-24 bg-slate-100 rounded-full" />
                      <div className="h-6 w-28 bg-slate-100 rounded-full" />
                      <div className="h-6 w-20 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="bg-white border border-rose-200 rounded-xl p-8 sm:p-10 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Database Connection Error</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">{fetchError}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setRetryCount((c) => c + 1)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Request</span>
                  </button>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-10 sm:p-12 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">No Listings Match Your Filters</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Try adjusting or resetting your category, salary, experience, or search terms to uncover more unindexed roles.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 cursor-pointer shadow-xs"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-150 space-y-4"
                >

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Job Title: text-xl sm:text-2xl semibold with wrap (Unblurred) + Deterministic AI Fit Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#09090B] tracking-tight hover:text-[#2563EB] cursor-pointer break-words">
                          {job.title}
                        </h3>
                        <MatchScoreBadge
                          job={{
                            id: job.id,
                            title: job.title,
                            company: job.company,
                            location: job.location,
                            salary_text: job.salary,
                            apply_url: job.applyUrl,
                            description: (job as any).snippet || (job as any).description,
                          }}
                          size="sm"
                        />
                      </div>

                      {/* Company Name, Location, Date */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-[#4B5563]">
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

                    {/* Action buttons: Direct Apply Link + Track + More */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end w-full sm:w-auto pt-2 sm:pt-0">
                      {/* Direct Apply button */}
                      <button
                        type="button"
                        onClick={(e) => handleApplyClick(e, job.applyUrl)}
                        className="flex-1 sm:flex-initial w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl sm:rounded-full font-semibold text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap group"
                      >
                        {!isPro && <Lock className="w-3.5 h-3.5 opacity-80" />}
                        <span>Apply Direct</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Quick Track Application */}
                        <button
                          type="button"
                          onClick={() => handleTrackJob(job)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl sm:rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          title="Save this job to Application Pipeline Tracker"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Track</span>
                        </button>

                        {/* Outline pill More button with layers icon */}
                        <button
                          type="button"
                          onClick={() => setMoreModalJob(job)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl sm:rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>More</span>
                        </button>
                      </div>
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

            {/* Pagination: Previous | Compact Page Input | Next > */}
            <div className="pt-6 pb-24 sm:pb-12 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 min-h-[44px] border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </button>

              {/* Compact Page Number Input */}
              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700">
                <span className="text-gray-500">Page</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => handlePageInputSubmit()}
                  className="w-12 h-9 px-1 text-center font-mono font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs sm:text-sm shadow-xs"
                  aria-label="Current page number"
                />
                <span className="text-gray-500">of {totalPages}</span>
              </form>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center justify-center gap-1 px-4 sm:px-5 py-2 min-h-[44px] bg-black hover:bg-neutral-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
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
        onChangeDate={(d) => {
          setDateFilter(d);
          setCurrentPage(1);
        }}
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
        availableCountries={availableCountries}
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
