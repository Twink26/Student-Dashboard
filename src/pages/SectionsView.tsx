import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import BatchOverviewCard from "../components/BatchOverviewCard";
import BatchComparisonChart from "../components/BatchComparisonChart";
import BatchStudentTable from "../components/BatchStudentTable";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import { fetchSectionAnalytics, StudentApiNetworkError } from "../lib/studentApi";
import { adaptSectionAnalyticsResponse } from "../lib/studentAdapter";
import type { SectionAnalytics } from "../lib/studentTypes";

interface SectionsViewProps {
  onSelectStudent: (studentId: string) => void;
}

type LoadState = "loading" | "error" | "ready";

export default function SectionsView({ onSelectStudent }: SectionsViewProps) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [analytics, setAnalytics] = useState<SectionAnalytics | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const response = await fetchSectionAnalytics();
        if (cancelled) return;
        setAnalytics(adaptSectionAnalyticsResponse(response));
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof StudentApiNetworkError) {
          setLoadState("error");
        } else {
          setLoadState("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadState === "loading") {
    return <LoadingState />;
  }

  if (loadState === "error" || !analytics) {
    return (
      <ErrorState
        message="Unable to load section data. Please try again."
        suggestion="Check your connection and reload the page."
      />
    );
  }

  if (analytics.batches.length === 0) {
    return (
      <ErrorState message="No section data available." suggestion="No batches were found in the sheet." />
    );
  }

  const activeBatch = analytics.batches.find((b) => b.batch === selectedBatch) ?? null;

  if (activeBatch) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedBatch(null)}
          className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80"
        >
          <ArrowLeft size={15} aria-hidden />
          All batches
        </button>

        <div>
          <h1 className="font-display text-2xl text-ink">Batch {activeBatch.batch}</h1>
          <p className="mt-1 text-sm text-ink-soft">{activeBatch.studentCount} students</p>
        </div>

        <BatchStudentTable students={activeBatch.students} onSelectStudent={onSelectStudent} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Section Overview</h1>
        <p className="mt-1 text-sm text-ink-soft">Compare batches, then drill into any section.</p>
      </div>

      <BatchComparisonChart batches={analytics.batches} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {analytics.batches.map((batch) => (
          <BatchOverviewCard key={batch.batch} batch={batch} onSelect={setSelectedBatch} />
        ))}
      </div>
    </div>
  );
}