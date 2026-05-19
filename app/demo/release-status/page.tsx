import { ReleaseReadinessCard } from '@/components/release-readiness-card';

export default function ReleaseStatusDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Release Status Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReleaseReadinessCard repo="JeevantheDev/shipbrain_sandbox" branch="main" />
        <ReleaseReadinessCard repo="JeevantheDev/shipbrain_sandbox" branch="feature/blocked-ci" />
        <ReleaseReadinessCard repo="JeevantheDev/shipbrain_sandbox" branch="feature/pending-review" />
        <ReleaseReadinessCard repo="JeevantheDev/shipbrain_sandbox" branch="feature/incident" />
      </div>
    </div>
  );
}
