"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function JobSearchRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const destination = qs ? `/jobs?${qs}` : "/jobs";
    router.replace(destination);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">
          Redirecting to canonical CareerMonke Jobs directory…
        </p>
      </div>
    </div>
  );
}

export default function JobSearchAllRedirectPage() {
  return (
    <Suspense>
      <JobSearchRedirectInner />
    </Suspense>
  );
}
