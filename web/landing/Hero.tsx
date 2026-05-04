import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center bg-black overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Is your repository <span className="text-emerald-500">production-ready?</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Automated Deep-Cycle Security Audits. Scan, detect, and secure your infrastructure in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-md hover:bg-emerald-400 transition-all cyber-glow"
          >
            Launch App
          </Link>
          <button className="px-8 py-4 border border-gray-700 text-white font-bold rounded-md hover:bg-white/5 transition-all">
            View Documentation
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
    </section>
  );
};
