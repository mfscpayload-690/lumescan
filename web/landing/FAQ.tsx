'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is LumeScan?",
    answer: "LumeScan is an AI-powered code security audit tool that analyzes your repositories for vulnerabilities, exposed secrets, and logic flaws using advanced models like Llama 3."
  },
  {
    question: "How do I start an audit?",
    answer: "You can paste any public GitHub repository URL into the Workstation dashboard, or use our deep-linking feature by appending the owner/repo to our domain (e.g., lumescan.com/owner/repo)."
  },
  {
    question: "What languages does LumeScan support?",
    answer: "We support a wide range of languages including JavaScript, TypeScript, Python, Rust, Go, Java, and C++."
  },
  {
    question: "Is my source code safe?",
    answer: "Absolutely. LumeScan performs ephemeral static analysis. We do not permanently store your source code on our servers after the audit is complete."
  },
  {
    question: "Does it work with private repositories?",
    answer: "Currently, LumeScan supports public repositories directly via URL. Support for private repositories via secure GitHub App integration is coming soon."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-slate-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 reveal reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about LumeScan and how it helps secure your codebase.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-sm overflow-hidden reveal reveal-up reveal-delay-${idx + 1}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between group transition-colors hover:bg-slate-800/30 focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle size={18} className={`transition-colors ${openIndex === idx ? 'text-emerald-500' : 'text-slate-500'}`} />
                  <span className={`text-sm md:text-base font-semibold transition-colors ${openIndex === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-emerald-500' : ''}`} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-5 pt-0 text-slate-400 text-sm leading-relaxed ml-8 lg:ml-10">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
