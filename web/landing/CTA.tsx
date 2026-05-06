import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Book } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 reveal reveal-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          Secure Your Codebase
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
          Ready to automate your <br />
          <span className="text-gradient">Security Lifecycle?</span>
        </h2>
        
        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Join professional engineering teams using LumeScan to audit infrastructure, 
          remediate vulnerabilities, and build trust at scale.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto h-14 px-10 flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-bold rounded-full hover:bg-emerald-400 transition-all cyber-glow group"
          >
            Launch Workstation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/docs"
            className="w-full sm:w-auto h-14 px-10 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-white font-bold rounded-full hover:bg-slate-800 transition-all group"
          >
            <Book size={18} className="text-slate-500 group-hover:text-emerald-500" />
            Documentation
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-slate-500 grayscale opacity-50">
          <div className="flex items-center gap-2">
            <Terminal size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Open Source</span>
          </div>
        </div>
      </div>
    </section>
  );
};
