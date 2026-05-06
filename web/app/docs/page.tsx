'use client';

import React from 'react';
import Link from 'next/link';
import {
  Book, Code, Cpu, Shield, Zap, Globe,
  Terminal, Server, ArrowRight,
  ShieldCheck, AlertTriangle, FileCode, Search
} from 'lucide-react';

const Github = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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

const DocsPage = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/welcome" className="flex items-center gap-2 group">
              <img src="/lumescan-logo.png" alt="Logo" className="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-tighter text-xl">LUME<span className="text-emerald-500">SCAN</span></span>
              <span className="ml-2 px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded uppercase font-bold tracking-widest">Docs v1.0</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <a href="#introduction" className="hover:text-white transition-colors">Introduction</a>
              <a href="#api" className="hover:text-white transition-colors">API Reference</a>
              <a href="#deep-linking" className="hover:text-white transition-colors">Deep Linking</a>
              <Link href="/" className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-bold hover:bg-emerald-400 transition-all">
                Launch App
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block space-y-8 sticky top-32 h-fit">
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Getting Started</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#introduction" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Book size={14} /> Introduction</a></li>
                <li><a href="#architecture" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Cpu size={14} /> Architecture</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">API Reference</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#auth" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Shield size={14} /> Authentication</a></li>
                <li><a href="#endpoints" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Terminal size={14} /> Endpoints</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#deep-linking" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Zap size={14} /> Deep Linking</a></li>
                <li><a href="#classification" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Search size={14} /> File Classification</a></li>
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-24">
            {/* Introduction */}
            <section id="introduction" className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                Overview
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Introduction</h2>
              <p className="text-xl text-zinc-400 leading-relaxed">
                LumeScan is a professional-grade security auditing workstation designed to identify vulnerabilities in GitHub repositories using advanced AI analysis. It streamlines the audit process by classifying files, identifying high-risk areas, and providing actionable remediation plans.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <ShieldCheck className="text-emerald-500 mb-4" size={32} />
                  <h4 className="font-bold mb-2">Security First</h4>
                  <p className="text-sm text-zinc-500">Built with a focus on detecting logic flaws, sensitive data leaks, and configuration errors.</p>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <Zap className="text-blue-500 mb-4" size={32} />
                  <h4 className="font-bold mb-2">Real-time Analysis</h4>
                  <p className="text-sm text-zinc-500">Streaming analysis results via NDJSON for immediate feedback and responsiveness.</p>
                </div>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">System Architecture</h2>
              <p className="text-zinc-400 leading-relaxed">
                The platform is split into a Next.js 15+ workstation frontend and a high-performance FastAPI backend.
              </p>
              <div className="p-8 bg-black border border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded">Workstation (Next.js)</div>
                    <ArrowRight className="text-zinc-700" />
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded">LumeScan API (FastAPI)</div>
                    <ArrowRight className="text-zinc-700" />
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded">Groq / AI Core</div>
                  </div>
                  <div className="text-zinc-600 pl-4 border-l border-zinc-800 ml-20 space-y-2 py-4">
                    <div>1. Frontend initiates scan with repo URL</div>
                    <div>2. API fetches repo tree and classifies targets</div>
                    <div>3. API streams file-by-file AI security analysis</div>
                    <div>4. Frontend renders findings in real-time matrix</div>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">API Reference</h2>
                <div id="auth" className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold">
                    <Shield size={18} className="text-purple-500" />
                    Authentication
                  </div>
                  <p className="text-sm text-zinc-500">
                    Currently, the LumeScan Public API is in open preview. No authentication is required for basic repository scanning. Rate limits apply based on IP address to ensure system stability.
                  </p>
                </div>
              </div>

              <div id="endpoints" className="space-y-12">
                {/* Search */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-blue-500 text-[10px] font-bold rounded">GET</span>
                    <code className="text-emerald-400 font-mono text-sm">/api/v1/search/repos</code>
                  </div>
                  <p className="text-sm text-zinc-400">Search for GitHub repositories with auto-completion data.</p>
                  <div className="bg-zinc-900/50 p-4 rounded-lg font-mono text-xs text-zinc-500">
                    Query Params: <span className="text-zinc-300">q (string)</span> - Min 2 chars.
                  </div>
                </div>

                {/* Init */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-emerald-500 text-black text-[10px] font-bold rounded">POST</span>
                    <code className="text-emerald-400 font-mono text-sm">/api/v1/scan/init</code>
                  </div>
                  <p className="text-sm text-zinc-400">Initializes the scan and returns classified file tree metadata.</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                      <div className="text-[10px] font-bold text-zinc-600 mb-2 uppercase">Request Body</div>
                      <pre className="text-xs text-zinc-300">{"{\n  \"repo_url\": \"owner/repo\",\n  \"offset\": 0\n}"}</pre>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                      <div className="text-[10px] font-bold text-zinc-600 mb-2 uppercase">Response Highlights</div>
                      <pre className="text-xs text-emerald-500/80">{"{\n  \"files_found\": [...],\n  \"metadata\": {...},\n  \"total_found\": 124\n}"}</pre>
                    </div>
                  </div>
                </div>

                {/* Analyze */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-emerald-500 text-black text-[10px] font-bold rounded">POST</span>
                    <code className="text-emerald-400 font-mono text-sm">/api/v1/scan/analyze</code>
                  </div>
                  <p className="text-sm text-zinc-400">Streams NDJSON analysis results for specific files.</p>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-200/60 leading-relaxed">
                      <strong>Note:</strong> This endpoint uses HTTP Streaming. Results are yielded as they are generated by the AI core. Expect roughly 1.5s delay between file chunks for safety.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Deep Linking */}
            <section id="deep-linking" className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Deep Linking</h2>
              <p className="text-zinc-400 leading-relaxed">
                LumeScan supports browser-based deep linking for seamless integration into your security workflow. You can trigger a scan automatically by navigating to a specific URL structure.
              </p>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">FORMAT</span>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold">AVAILABLE NOW</span>
                </div>
                <div className="bg-black p-4 rounded-xl border border-zinc-800 flex items-center justify-between group">
                  <code className="text-emerald-400 text-sm">lumescan.vercel.app/<span className="text-white">owner</span>/<span className="text-white">repo</span></code>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] text-zinc-500 font-bold">
                    EXAMPLE: lumescan.vercel.app/nextjs/next.js
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} LumeScan Professional. Built for security researchers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DocsPage;
