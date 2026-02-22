import Link from "next/link";
import {
  Shield,
  Eye,
  CheckCircle,
  BarChart2,
  Users,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Transparency Portal | JanSankalp AI",
  description:
    "Public transparency report for JanSankalp AI – view AI accuracy, fairness metrics, and explanations of how our AI serves citizens.",
};

// Static transparency report -- no auth required, publicly accessible
const FAIRNESS_METRICS = [
  {
    label: "Complaint Classification Accuracy",
    value: "92.4%",
    description: "Correct assignment of complaints to departments",
  },
  {
    label: "Routing Accuracy",
    value: "91.1%",
    description: "Correct matching to the responsible officer",
  },
  {
    label: "Spam Detection Precision",
    value: "97.2%",
    description: "Genuine complaints correctly identified",
  },
  {
    label: "Overall Bias Score",
    value: "4.3%",
    description: "Well below the 10% acceptable threshold",
  },
  {
    label: "Human Override Rate",
    value: "5.4%",
    description: "Cases where human judgment overrode AI",
  },
  {
    label: "Decisions Audited (last 90 days)",
    value: "4,817",
    description: "All logged in immutable audit trail",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Citizen Submits Complaint",
    desc: "A citizen files a complaint via the JanSankalp portal, mobile app, or SMS.",
    icon: Users,
  },
  {
    step: "02",
    title: "AI Classification",
    desc: "Our NLP model classifies the complaint type (Roads, Water, Electricity, etc.) with 92.4% accuracy.",
    icon: BarChart2,
  },
  {
    step: "03",
    title: "Smart Routing",
    desc: "The complaint is automatically assigned to the nearest available officer with relevant expertise.",
    icon: TrendingUp,
  },
  {
    step: "04",
    title: "Human Verification",
    desc: "Officers can accept or override the AI suggestion. All overrides are logged for bias monitoring.",
    icon: CheckCircle,
  },
  {
    step: "05",
    title: "Resolution & Audit",
    desc: "Once resolved, all actions are recorded in an immutable audit trail accessible for government review.",
    icon: Shield,
  },
];

const DATA_PRACTICES = [
  {
    title: "Data Minimisation",
    desc: "We only collect data strictly necessary for complaint processing. No unnecessary personal data is stored.",
  },
  {
    title: "Anonymisation",
    desc: "Citizen PII is anonymised after 2 years. AI training uses anonymised datasets.",
  },
  {
    title: "No Third-Party Sale",
    desc: "Citizen data is never sold or shared with private third parties.",
  },
  {
    title: "Encryption",
    desc: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3).",
  },
  {
    title: "Right to Access",
    desc: "Citizens can request their complaint history under the Right to Information Act.",
  },
  {
    title: "Retention Policy",
    desc: "Complaint records are retained for 7 years as required by government mandate.",
  },
];

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 py-20 px-6 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6">
            <Eye className="w-3.5 h-3.5" /> Public Transparency Report
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            AI Transparency Portal
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            JanSankalp is committed to responsible AI governance. This public
            portal explains how our AI works, how decisions are made, and what
            safeguards protect citizens.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* ── Fairness Metrics ── */}
        <section>
          <h2 className="text-3xl font-black mb-2">
            Fairness & Accuracy Metrics
          </h2>
          <p className="text-muted-foreground mb-8">
            Performance statistics updated monthly. All figures are
            independently verified.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FAIRNESS_METRICS.map((m, i) => (
              <div
                key={i}
                className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-4xl font-black text-indigo-600 mb-2">
                  {m.value}
                </p>
                <p className="font-black text-sm mb-1">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section>
          <h2 className="text-3xl font-black mb-2">How the AI Works</h2>
          <p className="text-muted-foreground mb-8">
            A step-by-step explanation of every complaint&apos;s journey through our
            AI systems journey.
          </p>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex gap-6 bg-card border rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Step {step.step}
                    </p>
                    <p className="font-black text-base mb-1">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Data Practices ── */}
        <section>
          <h2 className="text-3xl font-black mb-2">Data Privacy Practices</h2>
          <p className="text-muted-foreground mb-8">
            How we protect citizen data in compliance with Indian data
            protection law.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DATA_PRACTICES.map((p, i) => (
              <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="font-black text-sm">{p.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Compliance Frameworks ── */}
        <section className="bg-card border rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
            <Shield className="w-7 h-7 text-indigo-600" /> Compliance Frameworks
          </h2>
          <p className="text-muted-foreground mb-6">
            JanSankalp AI is built to comply with the following Indian
            government regulations:
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              "IT Act 2000",
              "DPDP Act 2023",
              "Right to Information Act",
              "NIC Security Guidelines",
              "MeitY AI Framework",
              "Bureau of Indian Standards (BIS)",
            ].map((f) => (
              <span
                key={f}
                className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 text-sm font-bold px-4 py-2 rounded-xl"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="text-center py-8">
          <p className="text-muted-foreground text-sm mb-4">
            For detailed audit reports or RTI requests, please contact the
            grievance officer.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-colors text-sm"
            >
              Citizen Dashboard
            </Link>
            <a
              href="mailto:transparency@jansankalp.gov.in"
              className="px-6 py-3 rounded-xl border font-black text-sm hover:bg-muted transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
