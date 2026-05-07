'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Search,
  Zap,
  Activity,
  History,
  ShieldCheck,
  Globe,
  Star,
  GitFork,
  Clock,
  ExternalLink,
  X,
  Code2,
  Terminal,
  Play,
  Square,
  Shield,
  Package,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system' | 'boot';
  message: string;
  timestamp: string;
}



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

interface Finding {
  file: string;
  category?: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  description: string;
  recommendation: string;
}

interface RepoSearchResult {
  full_name: string;
  description?: string;
}

interface RepoMetadata {
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languages: string[];
  license: string;
  updated_at: string;
  open_issues: number;
}

interface WorkstationProps {
  initialRepo?: string;
}

export const Workstation: React.FC<WorkstationProps> = ({ initialRepo }) => {
  const [repoUrl, setRepoUrl] = useState(initialRepo || '');
  const [searchResults, setSearchResults] = useState<RepoSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [repoMetadata, setRepoMetadata] = useState<RepoMetadata | null>(null);
  const [scanStartTime, setScanStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isLogCollapsed, setIsLogCollapsed] = useState(true);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  useEffect(() => {
    if (logs.length > 4) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const executeScan = useCallback(async (currentOffset: number = 0, targetRepo: string = repoUrl) => {
    setIsScanning(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (currentOffset === 0) {
      setFindings([]);
      setLogs([]);
      setTotalFound(0);
      setScanStartTime(Date.now());
      setElapsedTime(0);
    }

    addLog(`Initiating scan for: ${targetRepo}`, 'info');

    try {
      addLog('Validating repository structure...', 'info');

      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiBase}/api/v1/scan/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: targetRepo, offset: currentOffset }),
        signal
      });

      if (!response.ok) {
        throw new Error('Failed to initialize scan');
      }

      const data = await response.json();
      setTotalFound(data.total_found);
      setRepoMetadata(data.metadata);

      addLog(`Found ${data.total_found} target files.`, 'info');

      if (data.files && data.files.length > 0) {
        if (signal.aborted) return;
        addLog(`Initiating prioritized AI analysis for ${data.files.length} files...`, 'info');

        const analyzeResponse = await fetch(`${apiBase}/api/v1/scan/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner: data.owner,
            repo: data.repo,
            files: data.files
          }),
          signal
        });

        if (!analyzeResponse.ok) {
          throw new Error('AI Analysis failed');
        }

        const reader = analyzeResponse.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (reader) {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const result = JSON.parse(line);
                if (result.error) {
                  addLog(`Error analyzing ${result.file}: ${result.error}`, 'error');
                  continue;
                }
                
                if (result.findings && result.findings.length > 0) {
                  const newFindings = result.findings.map((finding: Finding) => ({
                    ...finding,
                    file: result.file,
                    category: result.category
                  }));

                  const severityWeight: Record<string, number> = {
                    'Critical': 5,
                    'High': 4,
                    'Medium': 3,
                    'Low': 2,
                    'Informational': 1
                  };

                  setFindings(prev => {
                    const combined = [...prev, ...newFindings];
                    return combined.sort((a, b) =>
                      (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0)
                    );
                  });

                  newFindings.forEach((f: Finding) => {
                    addLog(`[${f.severity}] ${result.file}: ${f.description}`,
                      f.severity === 'Critical' || f.severity === 'High' ? 'error' : 'warning');
                  });
                } else {
                  addLog(`Clean: ${result.file}`, 'success');
                }
              } catch (e) {
                console.error("Failed to parse analysis line:", e);
              }
            }
          }
        }
      }

      addLog('Scan sequence completed.', 'success');
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        addLog('Scan aborted by user.', 'warning');
      } else {
        addLog(`Scan failed: ${error.message}`, 'error');
      }
    } finally {
      setIsScanning(false);
      abortControllerRef.current = null;
    }
  }, [repoUrl, addLog]);

  // Progressive Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (repoUrl && repoUrl.length >= 2 && !repoUrl.startsWith('http')) {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
          const res = await fetch(`${apiBase}/api/v1/search/repos?q=${encodeURIComponent(repoUrl)}`);
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          setSearchResults(data.items || []);
          setShowDropdown(data.items?.length > 0);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
          setShowDropdown(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [repoUrl]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && scanStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - scanStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanStartTime]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning) return;
    executeScan(0);
  };

  const stopScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const hasBooted = useRef(false);
  useEffect(() => {
    if (!hasBooted.current) {
      const messages: [string, LogEntry['type']][] = [
        ['[SYSTEM] LumeScan Core v1.0.4 initialized.', 'boot'],
        ['[SYSTEM] Connecting to Groq LPU Inference Engine...', 'boot'],
        ['[SYSTEM] Secure WebSocket tunnel established.', 'boot'],
        ['[SYSTEM] Ready for target acquisition.', 'boot'],
      ];

      messages.forEach((m, i) => {
        setTimeout(() => addLog(m[0], m[1]), i * 400);
      });
      hasBooted.current = true;
    }
  }, [addLog]);

  useEffect(() => {
    if (initialRepo && !isScanning) {
      // Use setTimeout to avoid synchronous setState inside useEffect
      const timer = setTimeout(() => {
        executeScan(0, initialRepo);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialRepo, isScanning, executeScan]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" /> Target Acquisition
            </h2>
            
            <form onSubmit={handleFormSubmit} className="relative" ref={dropdownRef}>
              <div className="relative group">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="owner/repo or github url"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-700"
                  disabled={isScanning}
                />
                <GithubIcon size={18} className="absolute right-4 top-3.5 text-slate-700 group-focus-within:text-emerald-500/50 transition-colors" />
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRepoUrl(result.full_name);
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-800 flex flex-col gap-1 transition-colors border-b border-white/5 last:border-0"
                    >
                      <span className="text-sm font-bold text-slate-200">{result.full_name}</span>
                      {result.description && (
                        <span className="text-xs text-slate-500 line-clamp-1">{result.description}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {!isScanning ? (
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    <Play size={16} fill="currentColor" /> Initialize Scan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopScan}
                    className="flex-1 bg-slate-800 hover:bg-red-500/20 hover:text-red-500 text-slate-300 font-bold py-3 rounded-xl transition-all border border-slate-700 hover:border-red-500/50 flex items-center justify-center gap-2 group"
                  >
                    <Square size={16} fill="currentColor" className="group-hover:animate-pulse" /> Abort Scan
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Repo Info Card */}
          {repoMetadata && (
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden reveal reveal-left shadow-2xl">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden">
                    <GithubIcon size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{repoMetadata.full_name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Star size={10} className="text-amber-500" /> {repoMetadata.stars.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <GitFork size={10} className="text-blue-500" /> {repoMetadata.forks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-3">
                  &ldquo;{repoMetadata.description || 'No description provided.'}&rdquo;
                </p>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Shield size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">License:</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-md">
                      {repoMetadata.license}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Package size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Primary Languages:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {repoMetadata.languages.slice(0, 5).map((lang) => {
                        const iconMapping: Record<string, string> = {
                          'JavaScript': 'js', 'TypeScript': 'ts', 'Python': 'py',
                          'HTML': 'html', 'CSS': 'css', 'Rust': 'rust', 'Go': 'go',
                          'C++': 'cpp', 'Java': 'java', 'PHP': 'php', 'Ruby': 'ruby',
                          'Shell': 'bash', 'Vue': 'vue', 'React': 'react', 'C': 'c', 'C#': 'cs'
                        };
                        const iconId = iconMapping[lang];
                        if (iconId) {
                          return (
                            <Image 
                              key={lang}
                              src={`https://skillicons.dev/icons?i=${iconId}`}
                              alt={lang}
                              title={lang}
                              width={24}
                              height={24}
                              className="w-6 h-6 hover:scale-110 transition-transform cursor-help"
                            />
                          );
                        }
                        return (
                          <span key={lang} className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-800 rounded border border-white/5 text-slate-400">
                            {lang}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Last Update:</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(repoMetadata.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Console / Log Area */}
        <div className="lg:col-span-2 flex flex-col h-[700px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900/80 border-b border-slate-800 p-4 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-emerald-500" />
              <span className="font-mono text-sm font-bold tracking-widest text-slate-300 uppercase">Analysis Terminal</span>
            </div>
            {isScanning && (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">
                  Processing... {elapsedTime}s
                </span>
              </div>
            )}
            <button 
              onClick={() => setIsLogCollapsed(!isLogCollapsed)}
              className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-500"
            >
              {isLogCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.02),transparent)]">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 py-0.5 group">
                <span className="text-slate-700 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'warning' ? 'text-amber-400' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'info' ? 'text-slate-400' : ''}
                  ${log.type === 'boot' ? 'text-blue-400 italic font-bold' : ''}
                  ${log.type === 'system' ? 'text-purple-400 font-bold' : ''}
                  break-all
                `}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-900 border-t border-slate-800 p-3 grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Files Discovered</span>
              <span className="text-lg font-mono font-bold text-white">{totalFound}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Critical Risks</span>
              <span className="text-lg font-mono font-bold text-red-500">
                {findings.filter(f => f.severity === 'Critical').length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Total Findings</span>
              <span className="text-lg font-mono font-bold text-emerald-500">{findings.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Table */}
      {findings.length > 0 && (
        <div className="mt-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="text-emerald-500" /> Audit Findings Report
            </h2>
            <button 
              onClick={() => {
                const text = findings.map(f => `[${f.severity}] ${f.file}: ${f.description}`).join('\n');
                navigator.clipboard.writeText(text);
              }}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <Copy size={14} /> Copy Report
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Severity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source File</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finding Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {findings.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border
                        ${f.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                        ${f.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : ''}
                        ${f.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                        ${f.severity === 'Low' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                        ${f.severity === 'Informational' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' : ''}
                      `}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-[150px]" title={f.file}>
                          {f.file.split('/').pop()}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono italic truncate max-w-[150px]">
                          {f.file.split('/').slice(0, -1).join('/') || './'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                        {f.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/10">
                        <Zap size={12} /> {f.recommendation}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isScanning && findings.length === 0 && (
        <div className="mt-20 text-center space-y-4 opacity-40 grayscale reveal reveal-up">
          <div className="inline-flex p-6 rounded-[32px] bg-slate-900 border border-slate-800">
            <Shield size={64} className="text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-300">No Target Acquired</h3>
            <p className="text-sm text-slate-500">Initialize a scan to begin deep security analysis.</p>
          </div>
        </div>
      )}
    </div>
  );
};
