import React from 'react';
import { Zap, Shield, Search, Terminal, ArrowRight, Code, Globe } from 'lucide-react';

const features = [
  {
    title: "Deep-Cycle Scanning",
    description: "Our proprietary engine performs multi-layered scans across logic, configurations, and secrets to ensure total coverage.",
    icon: Search,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    isComingSoon: false
  },
  {
    title: "AI Analysis Engine",
    description: "Powered by Llama-3.3-70b-Groq for ultra-fast, context-aware code analysis and instant remediation plans.",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    isComingSoon: false
  },
  {
    title: "Deep Linking",
    description: "Trigger automated audits instantly via URL. Seamlessly integrate LumeScan into your browser or existing documentation.",
    icon: Globe,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    isComingSoon: false
  },
  {
    title: "CI/CD Integration",
    description: "Seamlessly integrate LumeScan into your existing workflows with support for GitHub Actions and custom webhooks.",
    icon: Terminal,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    isComingSoon: true
  },
  {
    title: "Infrastructure Guard",
    description: "Beyond just code—we audit your Dockerfiles, K8s manifests, and environment configs for security drift.",
    icon: Shield,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    isComingSoon: true
  },
  {
    title: "Dependency Tracking",
    description: "Real-time monitoring of your supply chain. We alert you the moment a CVE is published for your stack.",
    icon: Code,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    isComingSoon: true
  }
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 lg:py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-6 relative reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 reveal reveal-up reveal-delay-1">
            Powerful Scanning Suite
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] reveal reveal-up reveal-delay-2">
            Comprehensive Protection <br className="hidden sm:block" />
            <span className="text-gradient brightness-110">for Modern Development</span>
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-lg leading-relaxed reveal reveal-up reveal-delay-3">
            LumeScan combines traditional static analysis with modern AI to provide a <span className="text-white font-medium">security suite</span> that works at the speed of your team.
          </p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`group p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm reveal reveal-up reveal-delay-${idx + 1}`}
            >
              <div className={`p-3 w-fit rounded-xl ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon size={24} />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-white leading-tight">
                {feature.title}
              </h3>
              {feature.isComingSoon && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  Coming Soon
                </span>
              )}
            </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight size={14} />
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
};
