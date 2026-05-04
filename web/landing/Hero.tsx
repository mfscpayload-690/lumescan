import React from 'react';
// Landing hero component with premium animations and responsive layout
import Link from 'next/link';
import { ShieldCheck, ChevronRight, Zap, Lock, Coffee, Book } from 'lucide-react';

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="text-center lg:text-left space-y-10 reveal reveal-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest reveal reveal-up reveal-delay-1">
              <Zap size={14} className="animate-pulse" />
              New: AI-Powered Remediation
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1] text-white reveal reveal-up reveal-delay-2">
                Secure your code<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 brightness-125">
                  with confidence.
                </span>
              </h1>
  
              <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed reveal reveal-up reveal-delay-3">
                LumeScan provides friendly, professional-grade security audits for your GitHub repositories. 
                Detect vulnerabilities before they reach production.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 reveal reveal-up reveal-delay-4">
              <Link 
                href="/" 
                className="group w-full sm:w-auto h-16 px-10 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 cyber-glow"
              >
                Launch App
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/mfscpayload-690/lumescan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 glass border-zinc-800 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center"
                  title="Star on GitHub"
                >
                  <GithubIcon size={24} />
                </a>
                <Link 
                  href="/docs"
                  className="h-14 px-8 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-xl hover:text-white hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
                >
                  <Book size={18} />
                  Docs
                </Link>
              </div>
            </div>

            </div>

          <div className="relative lg:block reveal reveal-up reveal-delay-5">
            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20">
              <div className="p-8 rounded-[1.8rem] bg-zinc-950/80 backdrop-blur-2xl relative overflow-hidden border border-white/5">
                <div className="absolute inset-0 bg-emerald-500/5 -z-10" />
                <div className="space-y-6">
                  <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">100% Open Source</h3>
                      <p className="text-sm text-zinc-500">Transparent, community-driven security.</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all group">
                    <div className="p-4 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <Lock size={32} className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">Privacy First</h3>
                      <p className="text-sm text-zinc-500">No data retention. Your code is safe.</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all group">
                    <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <Zap size={32} className="text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">Blazing Fast</h3>
                      <p className="text-sm text-zinc-500">Deep scans completed in minutes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating effect elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full animate-pulse [animation-delay:1s]" />
          </div>
        </div>
      </div>
    </section>
  );
};
