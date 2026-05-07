import React from 'react';
// Landing hero component with premium animations and responsive layout
import Link from 'next/link';
import { ShieldCheck, ChevronRight, Zap, Lock, Coffee, Book, ChevronDown } from 'lucide-react';

const GithubIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.26 1.23-.26 1.86v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 lg:pt-20 lg:pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/10 blur-[140px] rounded-full animate-float" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full animate-float [animation-delay:2s]" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-emerald-500/30" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hero-grid)" />
          </svg>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <div className="lg:col-span-7 text-center lg:text-left space-y-10 reveal reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest reveal reveal-up reveal-delay-1">
              <Zap size={12} className="animate-pulse" />
              New: AI-Powered Remediation
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white reveal reveal-up reveal-delay-2">
                Secure your code<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-400 brightness-110">
                  with confidence.
                </span>
              </h1>
  
              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed reveal reveal-up reveal-delay-3">
                LumeScan provides friendly, professional-grade security audits for your GitHub repositories. 
                Detect vulnerabilities before they reach production.
              </p>
            </div>

            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 reveal reveal-up reveal-delay-4">
              <Link 
                href="/" 
                className="group w-auto h-12 px-6 sm:h-14 sm:px-8 bg-emerald-500 text-slate-950 text-[13px] sm:text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cyber-glow whitespace-nowrap"
              >
                Launch App
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="https://github.com/mfscpayload-690/lumescan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 glass border-slate-800 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center shrink-0"
                  title="Star on GitHub"
                >
                  <GithubIcon size={18} className="sm:w-5 sm:h-5" />
                </a>
                <Link 
                  href="/docs"
                  className="h-12 px-4 sm:h-14 sm:px-6 bg-slate-900 border border-slate-800 text-slate-400 text-[13px] sm:text-sm font-bold rounded-xl hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shrink-0"
                >
                  <Book size={16} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Docs</span>
                  <span className="sm:hidden">Docs</span>
                </Link>
              </div>
            </div>

            </div>

          <div className="lg:col-span-5 relative lg:block reveal reveal-up reveal-delay-5">
            <div className="p-1 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10">
              <div className="p-4 sm:p-8 rounded-[1.3rem] sm:rounded-[1.8rem] bg-slate-950/80 backdrop-blur-2xl relative overflow-hidden border border-slate-800/50 shadow-2xl">
                <div className="absolute inset-0 bg-emerald-500/5 -z-10" />
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all group">
                    <div className="p-2 sm:p-4 bg-emerald-500/10 rounded-lg sm:rounded-2xl group-hover:scale-110 transition-transform shrink-0">
                      <ShieldCheck size={20} className="text-emerald-500 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-white text-base sm:text-lg font-bold">100% Open Source</h3>
                      <p className="text-[12px] sm:text-sm text-slate-500 leading-tight">Transparent, community-driven security.</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/30 transition-all group">
                    <div className="p-2 sm:p-4 bg-blue-500/10 rounded-lg sm:rounded-2xl group-hover:scale-110 transition-transform shrink-0">
                      <Lock size={20} className="text-blue-500 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-white text-base sm:text-lg font-bold">Privacy First</h3>
                      <p className="text-[12px] sm:text-sm text-slate-500 leading-tight">No data retention. Your code is safe.</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/30 transition-all group">
                    <div className="p-2 sm:p-4 bg-purple-500/10 rounded-lg sm:rounded-2xl group-hover:scale-110 transition-transform shrink-0">
                      <Zap size={20} className="text-purple-500 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-white text-base sm:text-lg font-bold">Blazing Fast</h3>
                      <p className="text-[12px] sm:text-sm text-slate-500 leading-tight">Deep scans completed in minutes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating effect elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full animate-pulse [animation-delay:1s]" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-pointer z-20"
           onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-emerald-500 animate-bounce"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Scroll</span>
        </div>
      </div>
    </section>
  );
};
