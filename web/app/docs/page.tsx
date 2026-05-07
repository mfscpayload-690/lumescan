'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Book, Cpu, Shield, Zap,
  Terminal, ArrowRight,
  ShieldCheck, AlertTriangle, Search
} from 'lucide-react';
import { Navbar } from '@/landing/Navbar';
import { Footer } from '@/landing/Footer';
import { useReveal } from '@/hooks/useReveal';

const DocsPage = () => {
  useReveal();

  const sections = [
    {
      title: "Quick Start",
      icon: Zap,
      content: "Simply paste a public GitHub repository URL into the scanner. LumeScan automatically identifies the tech stack and begins a prioritized security audit.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Core Engines",
      icon: Cpu,
      content: "Our system leverages the Groq LPU™ Inference Engine for real-time static analysis, enabling us to scan thousands of lines of code in seconds.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Security Taxonomy",
      icon: Shield,
      content: "Findings are categorized into Critical, High, Medium, and Low severities, covering Logic, Config, Workflow, and Secrets vulnerabilities.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "API Reference",
      icon: Terminal,
      content: "LumeScan provides a robust REST API for integrating security scans directly into your CI/CD pipelines and developer workflows.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl reveal reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              Documentation
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
              Securing the <span className="text-gradient">Future</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              LumeScan is a next-generation security orchestration platform designed to automate the discovery of vulnerabilities in modern software ecosystems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-20">
            {sections.map((section, idx) => (
              <div key={idx} className="group p-8 bg-slate-900/30 border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-all reveal reveal-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`p-4 w-fit rounded-2xl ${section.bg} ${section.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <section.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {section.content}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-emerald-500 font-bold group-hover:gap-3 transition-all">
                  Read more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {/* Detailed Guide Section */}
          <div className="mt-32 space-y-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center reveal reveal-up">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Search className="text-emerald-500" />
                  Intelligent Discovery
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  LumeScan doesn&apos;t just look for patterns; it understands context. Our discovery engine recursively traverses your repository tree, 
                  classifying files based on their role in the application architecture.
                </p>
                <ul className="space-y-4">
                  {[
                    "Automatic tech-stack identification",
                    "Recursive tree traversal",
                    "File-type classification (Logic, Config, etc.)",
                    "Smart pagination for massive repos"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <ShieldCheck size={12} className="text-emerald-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
                <div className="relative z-10 font-mono text-sm space-y-2 text-emerald-500/70">
                  <div className="text-slate-500">// Discovery Sequence</div>
                  <div>$ lumescan init https://github.com/example/repo</div>
                  <div className="text-white">Analyzing tree structure...</div>
                  <div className="text-white">Detected: React, Node.js, Docker</div>
                  <div className="text-white">Files indexed: 1,248</div>
                  <div className="text-white">Priority: 12 Logic, 4 Config</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center reveal reveal-up">
              <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/5 blur-[80px] group-hover:bg-red-500/10 transition-colors" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-red-500 font-bold flex items-center gap-2">
                      <AlertTriangle size={16} /> CRITICAL
                    </span>
                    <span className="text-slate-500 text-xs">Findings ID: LS-902</span>
                  </div>
                  <div className="text-white font-bold">Unencrypted Secret in main.py</div>
                  <div className="text-slate-400 text-sm italic">&quot;Hardcoded AWS_SECRET_KEY found at line 42...&quot;</div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <ShieldCheck className="text-red-500" />
                  Real-time Auditing
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Once files are identified, the LPU-powered audit engine begins a multi-pass analysis. We look for deep logic flaws that 
                  traditional regex-based scanners miss.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="text-2xl font-bold text-white">50ms</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Avg Inference Time</div>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="text-2xl font-bold text-white">99%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="mt-40 text-center reveal reveal-up">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to secure your repo?</h2>
            <div className="flex justify-center gap-6">
              <Link href="/dashboard" className="px-8 py-4 bg-emerald-500 text-slate-950 rounded-2xl hover:bg-emerald-400 transition-all font-bold shadow-2xl shadow-emerald-500/20">
                Start Free Scan
              </Link>
              <Link href="https://github.com/mfscpayload-690/lumescan" className="px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all font-bold border border-white/5">
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocsPage;
