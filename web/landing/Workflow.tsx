import React from 'react';
import { MousePointer2, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Point",
    description: "Drop any public GitHub repository URL. No installation, no configuration, no friction.",
    icon: MousePointer2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    preview: (
      <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-500 flex items-center gap-3">
        <span className="text-emerald-500/50">https://github.com/</span>
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        <div className="ml-auto px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-[8px] font-bold">SCAN</div>
      </div>
    )
  },
  {
    id: "02",
    title: "Process",
    description: "Our Analysis Engine deep-scans your logic, configs, and CI/CD workflows for hidden vulnerabilities.",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    preview: (
      <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <div className="h-2 w-32 bg-slate-800 rounded" />
        </div>
        <div className="h-2 w-48 bg-slate-800/50 rounded" />
        <div className="h-2 w-40 bg-slate-800/30 rounded" />
      </div>
    )
  },
  {
    id: "03",
    title: "Patch",
    description: "Get production-ready patches and context-aware implementation plans to secure your code instantly.",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    preview: (
      <div className="mt-8 p-4 bg-slate-900/50 border border-emerald-500/20 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-2 w-20 bg-emerald-500/30 rounded" />
          <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-[4px] text-[8px] font-bold">PATCH READY</div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-slate-800 rounded" />
          <div className="h-1.5 w-3/4 bg-emerald-500/20 rounded" />
        </div>
      </div>
    )
  }
];

export const Workflow: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 reveal reveal-up">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The Audit <span className="text-gradient">Lifecycle</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From identification to remediation in three streamlined steps. 
            Professional security audits, automated.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-10" />

          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`relative group bg-slate-900/10 border border-slate-800/50 p-8 rounded-3xl hover:bg-slate-900/30 hover:border-slate-700 transition-all duration-500 reveal reveal-up reveal-delay-${idx + 1}`}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-sm font-black text-slate-500 group-hover:text-emerald-500 transition-colors">
                {step.id}
              </div>

              <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <step.icon size={28} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                {step.title}
                <ArrowRight size={18} className="text-slate-600 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
              </h3>
              
              <p className="text-slate-400 leading-relaxed text-sm">
                {step.description}
              </p>

              {step.preview}

              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 to-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.02),transparent_70%)] pointer-events-none" />
    </section>
  );
};
