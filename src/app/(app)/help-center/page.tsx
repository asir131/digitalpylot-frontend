"use client";

export const dynamic = "force-dynamic";
export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Help Center</h2>
        <p className="text-sm text-mist">Quick answers and support resources.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          "How do I reset my password?",
          "How do I request new permissions?",
          "Where can I see audit logs?",
          "Who can assign roles?",
        ].map((question) => (
          <div key={question} className="rounded-2xl border border-steel bg-white p-4">
            <p className="text-sm font-semibold text-ink">{question}</p>
            <p className="mt-2 text-xs text-mist">FAQ placeholder content.</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-steel bg-cream p-6 text-sm text-mist">
        Contact support at support@digitalpylot.local
      </div>
    </div>
  );
}




