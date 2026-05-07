import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee } from 'lucide-react';

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

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/welcome" className="flex items-center gap-2 sm:gap-3 group">
              <Image
                src="/lumescan-logo.png"
                alt="LumeScan Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
              <span className="text-base sm:text-xl font-bold tracking-tighter text-white">
                LUME<span className="text-emerald-500">SCAN</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/welcome#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
              <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</Link>
              <a href="https://github.com/mfscpayload-690/lumescan/discussions" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Community</a>
              <Link href="/docs" className="text-sm font-medium text-emerald-500/80 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-bold">
                Docs
                <span className="px-1 py-0.5 bg-emerald-500/10 text-[8px] rounded uppercase">v1</span>
              </Link>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 mr-7 sm:mr-0">
              <a
                href="https://github.com/mfscpayload-690/lumescan"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-all group"
                title="View Source on GitHub"
              >
                <GithubIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a
                href="https://buymeacoffee.com/mfscpayload690"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-2 sm:h-10 sm:px-3 hidden min-[380px]:flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-all gap-2 group"
                title="Support LumeScan"
              >
                <Coffee size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-[10px] font-bold uppercase hidden lg:block text-slate-400 group-hover:text-amber-300">Support</span>
              </a>
              <Link
                href="/"
                className="h-9 px-3 sm:h-10 sm:px-6 flex items-center justify-center text-xs sm:text-sm font-bold bg-emerald-500 text-slate-950 rounded-full hover:bg-emerald-400 transition-all cyber-glow whitespace-nowrap"
              >
                <span className="hidden md:inline">Launch App</span>
                <span className="md:hidden">Launch</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
