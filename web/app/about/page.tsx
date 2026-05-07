'use client';

import React from 'react';
import { Navbar } from '@/landing/Navbar';
import { Footer } from '@/landing/Footer';
import { Shield, ExternalLink, Code, Server, Cpu, Terminal, Mail, Users, Heart } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

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

const LinkedinIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AboutPage() {
  useReveal();

  const projects = [
    {
      name: "Sniff-Recon",
      description: "AI-powered network packet analyzer for anomaly detection and security reconnaissance.",
      link: "https://github.com/mfscpayload-690/Sniff-Recon",
      tags: ["Python", "AI", "Networking"]
    },
    {
      name: "MovieMonk-AI",
      description: "Smart entertainment discovery engine with context-aware search and spoiler-free insights.",
      link: "https://github.com/mfscpayload-690/moviemonk-ai",
      tags: ["React 19", "Groq", "Vite"]
    },
    {
      name: "Dorkbase",
      description: "Advanced OSINT query builder for penetration testers and security researchers.",
      link: "https://github.com/mfscpayload-690/dorkbase",
      tags: ["Security", "OSINT", "React"]
    },
    {
      name: "Lintd",
      description: "Cross-distro Linux desktop auditor focused on package health and system integrity.",
      link: "https://github.com/mfscpayload-690/lintd",
      tags: ["Bash", "Linux", "Audit"]
    }
  ];

  const skills = [
    { category: "Security", items: ["Penetration Testing", "OSINT", "Network Forensics", "Audit Frameworks"], icon: Shield, color: "text-emerald-500" },
    { category: "Development", items: ["React / TypeScript", "Python", "Go", "Next.js"], icon: Code, color: "text-blue-500" },
    { category: "Infrastructure", items: ["Arch Linux", "Self-Hosting", "Docker", "Bash Scripting"], icon: Server, color: "text-purple-500" },
    { category: "AI Integration", items: ["Groq LPU", "LLM Fine-tuning", "Semantic Search"], icon: Cpu, color: "text-amber-500" }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
            <div className="flex-1 space-y-8 reveal reveal-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                Developer Profile
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-none">
                Aravind <span className="text-gradient">Lal</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                A cybersecurity researcher and full-stack developer dedicated to building tools that bridge the gap between AI and security reconnaissance.
                Based in the intersection of hardware builds and software security.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="https://github.com/mfscpayload-690" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-slate-900/50 transition-all group">
                  <GithubIcon size={20} className="group-hover:text-emerald-500 transition-colors" />
                  <span className="font-bold">mfscpayload-690</span>
                </a>
                <a href="https://www.linkedin.com/in/aravindlal8086" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-[#0077b5]/50 hover:bg-slate-900/50 transition-all group">
                  <LinkedinIcon size={20} className="group-hover:text-[#0077b5] transition-colors" />
                  <span className="font-bold">LinkedIn</span>
                </a>
                <a href="mailto:aravindlalwork@gmail.com" className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 font-bold">
                  <Mail size={20} />
                  <span>Contact Me</span>
                </a>
              </div>
            </div>

            <div className="flex-1 relative reveal reveal-right">
              <div className="aspect-square w-full max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
                <div className="relative z-10 p-1 bg-gradient-to-br from-emerald-500/50 to-blue-500/50 rounded-3xl overflow-hidden group">
                  <div className="bg-slate-950 h-full w-full rounded-[22px] flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[0.98]">
                    {/* Stylized Avatar Placeholder */}
                    <Terminal size={120} className="text-emerald-500 opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                {/* Floating Meta Stats */}
                <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl reveal reveal-up reveal-delay-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Status</div>
                      <div className="text-xs font-mono font-bold text-white uppercase tracking-widest">Compiling Future...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <section className="mt-32 py-24 bg-slate-900/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6 reveal reveal-up">
              <h2 className="text-3xl font-bold text-white">The Vision Behind LumeScan</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Security shouldn&apos;t be a bottleneck—it should be a reflex. LumeScan was born out of the need for an audit engine that
                doesn&apos;t just find vulnerabilities, but understands them. By leveraging massive inference capabilities, we turn raw
                static analysis into actionable remediation plans.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {skills.map((skill, idx) => (
                <div key={idx} className="p-6 bg-slate-950 border border-slate-900 rounded-2xl hover:border-slate-700 transition-all group reveal reveal-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`p-3 w-fit rounded-xl bg-slate-900 ${skill.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <skill.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{skill.category}</h3>
                  <ul className="space-y-2">
                    {skill.items.map((item, i) => (
                      <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal reveal-up">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Featured Ecosystem</h2>
                <p className="text-slate-400">Other notable projects from the LumeScan architect.</p>
              </div>
              <a href="https://github.com/mfscpayload-690?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-bold flex items-center gap-2 hover:underline">
                View all repositories <ExternalLink size={16} />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <a
                  key={idx}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-8 bg-slate-950 border border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all relative overflow-hidden reveal reveal-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                      <GithubIcon size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex gap-2 pt-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Terminal size={120} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contributors Section */}
        <section className="mt-32 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900/50 border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden reveal reveal-up">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                    Open Source
                  </div>
                  <h2 className="text-4xl font-bold text-white">Built by the community, <br/><span className="text-blue-400">for the community.</span></h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    LumeScan is an open-source initiative. We believe in the power of collective intelligence to secure the future of software. 
                    A massive thank you to everyone who has contributed to the codebase, documentation, and research.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                    <a 
                      href="https://github.com/mfscpayload-690/lumescan/graphs/contributors" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl hover:bg-slate-200 transition-all font-bold shadow-2xl shadow-white/5"
                    >
                      <Users size={20} />
                      <span>View Contributors</span>
                    </a>
                    <a 
                      href="https://github.com/mfscpayload-690/lumescan" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all font-bold border border-white/5"
                    >
                      <Heart size={20} className="text-red-500" />
                      <span>Join the Movement</span>
                    </a>
                  </div>
                </div>
                <div className="flex-1 relative hidden lg:block">
                  <div className="grid grid-cols-3 gap-4 opacity-20">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-800 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users size={120} className="text-blue-500/50" />
                  </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
