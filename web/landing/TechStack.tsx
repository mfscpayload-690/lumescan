import React from 'react';
import Image from 'next/image';

const technologies = [
  {
    name: "Rust",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    category: "Systems",
    invert: true
  },
  {
    name: "Go",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
    category: "Systems"
  },
  {
    name: "TypeScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "Web"
  },
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    category: "Data/AI"
  },
  {
    name: "C++",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    category: "Core"
  },
  {
    name: "GitHub",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    category: "Platform",
    invert: true
  },
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    category: "Infrastructure"
  },
  {
    name: "OWASP",
    logo: "https://cdn.simpleicons.org/owasp/6899bb",
    category: "Standards"
  }
];

export const TechStack: React.FC = () => {
  return (
    <section className="py-24 border-y border-white/5 bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md reveal reveal-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Enterprise <span className="text-emerald-500">Ecosystem</span> Support
            </h2>
            <p className="text-slate-400 leading-relaxed">
              LumeScan integrates seamlessly into modern polyglot infrastructure.
              From systems programming in Rust to complex web architectures in TypeScript,
              we&apos;ve got you covered.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["OWASP Top 10", "CWE", "SANS 25"].map((std) => (
                <span key={std} className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {std}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className={`group p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/30 hover:bg-slate-900/40 transition-all duration-300 reveal reveal-up reveal-delay-${idx % 4 + 1}`}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-1">
                  <Image
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    width={48}
                    height={48}
                    className={`w-12 h-12 object-contain transition-all duration-300 ${tech.invert ? 'brightness-200 invert' : ''} group-hover:scale-110`}
                    unoptimized
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{tech.name}</div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-tighter">{tech.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
