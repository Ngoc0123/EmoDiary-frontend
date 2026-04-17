import { Suspense } from "react";
import { AnalysisResult } from "@/components/pages/analysis";

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-[#F5E6D3]">Loading analysis...</div>}>
      <AnalysisResult />
    </Suspense>
  );
}

