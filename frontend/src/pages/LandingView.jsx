import React from 'react';
import { 
  ArrowRight, 
  Mic, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function LandingView({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-xs font-medium text-teal-800 mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Powered by Sarvam AI • Multilingual Voice & Vision</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 max-w-3xl mx-auto leading-[1.12]">
          Every repair. Remembered.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Keep track of your appliances, repairs and warranties — all in one place. Just speak or upload a document.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#preview"
            className="px-5 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 font-medium text-sm transition-colors"
          >
            See How It Works
          </a>
        </div>

        {/* Product Preview Card */}
        <div id="preview" className="mt-14 max-w-4xl mx-auto text-left">
          <div className="rounded-xl border border-zinc-200/90 bg-white shadow-xl shadow-zinc-200/40 overflow-hidden">
            {/* Mock Header */}
            <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                <span className="text-xs font-mono text-zinc-400 ml-2">FixSaathi Dashboard</span>
              </div>
              <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/50">
                Live Demo Active
              </span>
            </div>

            {/* Mock Content */}
            <div className="p-6 space-y-6">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/40">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Total Appliances</span>
                  <p className="text-xl font-bold text-zinc-900 mt-0.5">4</p>
                </div>
                <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/40">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Repairs Recorded</span>
                  <p className="text-xl font-bold text-zinc-900 mt-0.5">3</p>
                </div>
                <div className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/40">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-medium">Active Warranties</span>
                  <p className="text-xl font-bold text-teal-700 mt-0.5">3</p>
                </div>
              </div>

              {/* Sample Appliance Card with Warning */}
              <div className="border border-zinc-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                      WM
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900">Samsung Washing Machine</h4>
                      <p className="text-xs text-zinc-500">Model WW80T504DAX • Purchased 10 Jan 2025</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Warranty Active
                  </span>
                </div>

                {/* Subtle Recurring Warning */}
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Similar issue reported previously:</strong> Water not draining. Previous repair on 15 September 2026.</span>
                </div>

                {/* Timeline snippet */}
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span>Last Service: Drain pump replaced (₹1,200)</span>
                  <span className="text-teal-600 font-medium cursor-pointer hover:underline" onClick={onGetStarted}>
                    View Timeline →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Core Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-zinc-200/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-medium">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              1. Remember every repair.
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Maintain an accurate chronological repair timeline for every appliance. Know which technician worked on it, what parts were replaced, and how much you paid.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-medium">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              2. Understand bills and warranties.
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Upload PDF or image bills and warranty cards. Sarvam AI extracts warranty deadlines, part numbers, and expenses so you can review and edit before saving.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-medium">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              3. Speak in your preferred language.
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Record complaints naturally in Hindi, Marathi, English, Tamil, and other Indian languages. FixSaathi checks previous repair records and suggests questions for the technician.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 border-t border-zinc-200/80 text-center text-xs text-zinc-500">
        <p>© 2026 FixSaathi. AI-Powered Repair History & Service Management Platform.</p>
        <p className="mt-1 text-[11px] text-zinc-400">Built with Sarvam AI • Indian Language Models</p>
      </footer>
    </div>
  );
}
