"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RemotePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/resume");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-sm font-semibold text-gray-500">Redirecting to AI Resume Scanner...</div>
      </div>
    </div>
  );
}
