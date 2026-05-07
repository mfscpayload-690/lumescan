'use client';

import React from 'react';
import { Navbar } from '@/landing/Navbar';
import { Footer } from '@/landing/Footer';
import {
  Book, Cpu, Shield, Zap, 
  Terminal, ArrowRight,
  ShieldCheck, AlertTriangle, Search
} from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const DocsPage = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Sidebar Navigation - Hidden on mobile, sticky on desktop */}
          <aside className="hidden lg:block space-y-8 sticky top-32 h-fit reveal reveal-left">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Getting Started</h3>
              <ul className="space-y-1">
                <li><a href="#introduction" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"><Book size={14} /> Introduction</a></li>
                <li><a href="#architecture" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"><Cpu size={14} /> Architecture</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">API Reference</h3>
              <ul className="space-y-1">
                <li><a href="#auth" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"><Shield size={14} /> Authentication</a></li>
                <li><a href="#endpoints" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"><Terminal size={14} /> Endpoints</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Features</h3>
              <ul className="space-y-1">
                <li><a href="#deep-linking" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"><Zap size={14} /> Deep Linking</a></li>
                <li><a href="#classification" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"><Search size={14} /> File Classification</a></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-24 md:space-y-32">
            {/* Introduction Section */}
            <section id="introduction" className="space-y-8 reveal reveal-up">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                  Documentation
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Securing the <span className="text-gradient brightness-110">Future</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl">
                  LumeScan is a professional-grade security auditing workstation designed to identify vulnerabilities in GitHub repositories using advanced AI analysis. 
                  Streamline your audit process with automated classification and actionable remediation plans.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group">
                  <ShieldCheck className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-white mb-2">Security First</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Built with a focus on detecting logic flaws, sensitive data leaks, and configuration errors.</p>
                </div>
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all group">
                  <Zap className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-white mb-2">Real-time Analysis</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Streaming analysis results via NDJSON for immediate feedback and responsiveness.</p>
                </div>
              </div>
            </section>

            {/* System Architecture Section */}
            <section id="architecture" className="space-y-8 reveal reveal-up">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Intelligent Discovery</h2>
                <p className="text-slate-400 leading-relaxed max-w-3xl">
                  The LumeScan platform is split into a high-density Next.js workstation and a high-performance FastAPI backend to ensure maximum performance and security.
                </p>
              </div>

              <div className="p-6 sm:p-10 bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden relative group">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="w-full lg:w-1/3 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center group-hover:border-emerald-500/40 transition-all">
                    <div className="text-emerald-500 font-bold mb-2">Workstation</div>
                    <div className="text-[10px] text-slate-500 font-mono">Next.js 15+ App</div>
                  </div>
                  
                  <div className="flex lg:flex-1 items-center justify-center">
                    <ArrowRight className="text-slate-800 lg:rotate-0 rotate-90" size={24} />
                  </div>

                  <div className="w-full lg:w-1/3 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-center group-hover:border-blue-500/40 transition-all">
                    <div className="text-blue-500 font-bold mb-2">LumeScan API</div>
                    <div className="text-[10px] text-slate-500 font-mono">FastAPI / Python</div>
                  </div>

                  <div className="flex lg:flex-1 items-center justify-center">
                    <ArrowRight className="text-slate-800 lg:rotate-0 rotate-90" size={24} />
                  </div>

                  <div className="w-full lg:w-1/3 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-center group-hover:border-amber-500/40 transition-all">
                    <div className="text-amber-500 font-bold mb-2">AI Core</div>
                    <div className="text-[10px] text-slate-500 font-mono">Groq / Llama-3.3</div>
                  </div>
                </div>

                {/* Vertical Step Guide on Mobile */}
                <div className="mt-12 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 gap-4 text-[11px] font-medium text-slate-500">
                  <div className="flex items-center gap-3 lg:flex-col lg:text-center">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">1</span>
                    <p>Frontend initiates scan with repository metadata</p>
                  </div>
                  <div className="flex items-center gap-3 lg:flex-col lg:text-center">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">2</span>
                    <p>API fetches repository tree and classifies security targets</p>
                  </div>
                  <div className="flex items-center gap-3 lg:flex-col lg:text-center">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">3</span>
                    <p>API streams file-by-file security analysis results</p>
                  </div>
                  <div className="flex items-center gap-3 lg:flex-col lg:text-center">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">4</span>
                    <p>Workstation renders findings in real-time Matrix UI</p>
                  </div>
                </div>
              </div>
            </section>

            {/* API Reference Section */}
            <section id="api" className="space-y-12 reveal reveal-up">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">Seamless Flow</h2>
                <div id="auth" className="p-6 bg-slate-900/20 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Shield size={18} className="text-purple-500" />
                    Authentication
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Currently, the LumeScan Public API is in open preview. No authentication is required for basic repository scanning. 
                    Rate limits apply based on IP address to ensure system stability for all researchers.
                  </p>
                </div>
              </div>

              <div id="endpoints" className="space-y-12">
                {/* Search Endpoint */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-500 text-[10px] font-bold rounded uppercase tracking-widest">GET</span>
                    <code className="text-emerald-400 font-mono text-sm break-all">/api/v1/search/repos</code>
                  </div>
                  <p className="text-sm text-slate-400">Search for GitHub repositories with prioritized auto-completion.</p>
                  <div className="bg-black/40 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-600">
                    Query Params: <span className="text-slate-300">q (string)</span> - Min 2 characters.
                  </div>
                </div>

                {/* Init Endpoint */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold rounded uppercase tracking-widest">POST</span>
                    <code className="text-emerald-400 font-mono text-sm break-all">/api/v1/scan/init</code>
                  </div>
                  <p className="text-sm text-slate-400">Initializes the scanning process and returns classified file tree metadata.</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-slate-900">
                      <div className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-tighter">Payload</div>
                      <pre className="text-xs text-slate-300 overflow-x-auto">{"{\n  \"repo_url\": \"owner/repo\",\n  \"offset\": 0\n}"}</pre>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-slate-900">
                      <div className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-tighter">Response</div>
                      <pre className="text-xs text-emerald-500/60 overflow-x-auto">{"{\n  \"files_found\": [...],\n  \"metadata\": {...}\n}"}</pre>
                    </div>
                  </div>
                </div>

                {/* Analyze Endpoint */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold rounded uppercase tracking-widest">POST</span>
                    <code className="text-emerald-400 font-mono text-sm break-all">/api/v1/scan/analyze</code>
                  </div>
                  <p className="text-sm text-slate-400">Streams real-time analysis results for specific security targets.</p>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                    <p className="text-[11px] text-amber-200/60 leading-relaxed">
                      <strong>Critical:</strong> This endpoint utilizes HTTP Streaming (NDJSON). Results are yielded as they are generated by the AI core. 
                      Implement a buffer on your client to handle varying stream speeds.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Deep Linking Section */}
            <section id="deep-linking" className="space-y-8 reveal reveal-up">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Actionable Intel</h2>
                <p className="text-slate-400 leading-relaxed max-w-3xl">
                  LumeScan supports browser-based deep linking for seamless integration into your security workflow. 
                  Trigger audits instantly by navigating to specific repository paths.
                </p>
              </div>
              <div className="p-8 bg-slate-900/20 border border-slate-800 rounded-3xl space-y-6 relative overflow-hidden group">
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol Format</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase tracking-tighter">Live Support</span>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:border-emerald-500/20 transition-all">
                  <code className="text-emerald-400 text-sm md:text-base break-all">lumescan.vercel.app/<span className="text-white">owner</span>/<span className="text-white">repo</span></code>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                    Example: lumescan.vercel.app/nextjs/next.js
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap size={160} className="text-emerald-500" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocsPage;
