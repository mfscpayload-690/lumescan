import React from 'react';
import Link from 'next/link';
import { Shield, Globe } from 'lucide-react';

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

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/welcome" className="flex items-center gap-2 mb-6 group">
              <Shield size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold tracking-tight text-white">
                LUME<span className="text-emerald-500">SCAN</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Professional code security audits designed for modern engineering teams. 
              Secure your infrastructure, protect your users, and build with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/welcome#features" className="hover:text-emerald-500 transition-colors">Features</Link></li>
              <li><Link href="/about" className="hover:text-emerald-500 transition-colors">About</Link></li>
              <li><Link href="/" className="hover:text-emerald-500 transition-colors">Scanner</Link></li>
              <li><Link href="https://github.com/mfscpayload-690/lumescan" target="_blank" className="hover:text-emerald-500 transition-colors">Source Code</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/docs" className="hover:text-emerald-500 transition-colors">Documentation</Link></li>
              <li><Link href="/docs#api" className="hover:text-emerald-500 transition-colors">API Reference</Link></li>
              <li><Link href="/docs#deep-linking" className="hover:text-emerald-500 transition-colors">Deep Linking</Link></li>
              <li><Link href="https://github.com/mfscpayload-690/lumescan" target="_blank" className="hover:text-emerald-500 transition-colors">GitHub Repo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/mfscpayload-690/lumescan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                title="View on GitHub"
              >
                <GithubIcon size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                <Globe size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/aravindlal8086" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-white hover:bg-[#0077b5] transition-all"
                title="Connect on LinkedIn"
              >
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
          <p>© {new Date().getFullYear()} LumeScan Security Inc. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
