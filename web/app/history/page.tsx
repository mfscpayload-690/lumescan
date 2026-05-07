'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Trash2, 
  Search, 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  History as HistoryIcon,
  ChevronRight,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { useAuditCache, AuditSession } from '@/hooks/useAuditCache';

export default function HistoryPage() {
  const { history, clearHistory, getHistory } = useAuditCache();
  const [localHistory, setLocalHistory] = useState<AuditSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLocalHistory(getHistory());
  }, [getHistory]);

  const filteredHistory = localHistory.filter(session => 
    session.repo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityCount = (findings: any[], severity: string) => {
    return findings.filter(f => f.severity === severity).length;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 selection:bg-emerald-500/30">
      <div className="max-w-[1200px] mx-auto">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />

        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <HistoryIcon className="text-emerald-500" />
                AUDIT <span className="text-emerald-500">HISTORY</span>
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                Showing {filteredHistory.length} of {localHistory.length} past sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search repositories..."
                className="w-full bg-slate-900/50 border border-slate-800 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
              />
            </div>
            {localHistory.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all history?')) {
                    clearHistory();
                    setLocalHistory([]);
                  }
                }}
                className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all group"
                title="Clear All History"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </header>

        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl backdrop-blur-sm">
            <div className="p-4 bg-slate-800/50 rounded-full mb-6">
              <Search size={40} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">No audits found</h3>
            <p className="text-slate-500 mt-2 text-center max-w-xs">
              {searchTerm ? 'No results match your search criteria.' : 'Your security audit history will appear here once you start scanning repositories.'}
            </p>
            {!searchTerm && (
              <Link 
                href="/" 
                className="mt-8 px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Start New Audit
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredHistory.map((session) => (
              <Link 
                key={session.id}
                href={`/${session.repo}`}
                className="group p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl hover:shadow-emerald-500/5 backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl border ${session.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                    {session.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold truncate group-hover:text-emerald-400 transition-colors font-sans">{session.repo}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter border ${session.status === 'completed' ? 'border-emerald-500/30 text-emerald-500' : 'border-amber-500/30 text-amber-500'}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(session.completedAt)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {Math.floor(session.elapsedSeconds / 60)}m {session.elapsedSeconds % 60}s</span>
                      <span className="flex items-center gap-1.5"><Shield size={12} /> {session.findings.length} findings</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Severity Breakdown */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-xs font-bold mb-1">
                        {getSeverityCount(session.findings, 'Critical')}
                      </div>
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Crit</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold mb-1">
                        {getSeverityCount(session.findings, 'High')}
                      </div>
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">High</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-bold mb-1">
                        {getSeverityCount(session.findings, 'Medium')}
                      </div>
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Med</span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-800 rounded-full group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
