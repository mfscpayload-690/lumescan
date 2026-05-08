'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Terminal, ShieldCheck, Zap, AlertTriangle, Copy, Download,
  FileDown, FileCode, FileText, Square, Play, Star, GitFork,
  Clock, Shield, Code, Globe, Activity, Timer,
  ChevronDown, ChevronUp, Eye, Package, Unlock, Lock, AlertCircle,
  Search,
  History as HistoryIcon,
  RotateCcw,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuditCache, AuditSession } from '@/hooks/useAuditCache';

// Brand Icons (Custom SVGs as per user requirement to avoid lucide-react for brands)
const GithubIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.26 1.23-.26 1.86v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const CoffeeIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" x2="6" y1="2" y2="4" />
    <line x1="10" x2="10" y1="2" y2="4" />
    <line x1="14" x2="14" y1="2" y2="4" />
  </svg>
);

interface LogEntry {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system' | 'boot';
  message: string;
  timestamp: string;
}

const getLanguageColor = (lang: string) => {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Rust': '#dea584',
    'Go': '#00ADD8',
    'C++': '#f34b7d',
    'Java': '#b07219',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Shell': '#89e051',
    'Vue': '#41b883',
    'React': '#61dafb',
    'C': '#555555',
    'C#': '#178600',
  };
  return colors[lang] || '#8b949e';
};

const Github = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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

interface WorkstationProps {
  initialRepo?: string;
}

export const Workstation: React.FC<WorkstationProps> = ({ initialRepo }) => {
  const [repoUrl, setRepoUrl] = useState(initialRepo || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchingRepos, setIsSearchingRepos] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const [repoMetadata, setRepoMetadata] = useState<any>(null);
  const [scanStartTime, setScanStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isLogCollapsed, setIsLogCollapsed] = useState(true);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed' | 'partial'>('idle');
  const { saveToHistory, saveActiveSession, getActiveSession, clearActiveSession } = useAuditCache();
  const scanIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const inputRef = useRef<HTMLInputElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, newLog]);
  };

  useEffect(() => {
    // Only scroll if we have more than the boot sequence logs
    if (logs.length > 4) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const hasBooted = useRef(false);
  const initialScanTriggered = useRef(false);

  // System Boot Sequence
  useEffect(() => {
    if (!hasBooted.current) {
      const bootSequence = [
        { msg: 'LumeScan Professional v1.0.4 initializing...', type: 'info' as const, delay: 100 },
        { msg: 'Establishing secure link to analysis cluster...', type: 'info' as const, delay: 600 },
        { msg: 'Services Online: Security_Core, Dependency_Sentry, Secret_Vault.', type: 'success' as const, delay: 1100 },
        { msg: 'SESSION AUTHORIZED. System ready.', type: 'success' as const, delay: 1600 }
      ];

      bootSequence.forEach((item) => {
        setTimeout(() => {
          addLog(item.msg, item.msg.includes('AUTHORIZED') || item.msg.includes('Online') ? 'success' : 'info');
        }, item.delay);
      });

      hasBooted.current = true;
    }

    // If deep linked, auto-trigger scan after boot (only once)
    if (initialRepo && !initialScanTriggered.current) {
      const cached = getActiveSession(initialRepo);
      if (cached && cached.findings) {
        addLog(`Restoring active session for ${initialRepo}...`, 'info');
        setFindings(cached.findings || []);
        setLogs(prev => [...prev, ...(cached.logs || [])]);
        setRepoMetadata(cached.metadata);
        setTotalFound(cached.totalFiles || 0);
        setOffset(0);
        setScanStatus(cached.status || 'completed');
        initialScanTriggered.current = true;
      } else {
        setTimeout(() => {
          if (!initialScanTriggered.current) {
            executeScan(0, initialRepo);
            initialScanTriggered.current = true;
          }
        }, 2000);
      }
    }
  }, [initialRepo, getActiveSession]);

  // Persist active session as it changes
  useEffect(() => {
    if (isScanning && repoUrl) {
      saveActiveSession(repoUrl, {
        id: scanIdRef.current,
        repo: repoUrl,
        findings,
        logs: logs.slice(-50), // Only last 50 logs for perf
        metadata: repoMetadata,
        totalFiles: totalFound,
        status: scanStatus,
        startedAt: new Date(scanStartTime || Date.now()).toISOString(),
        elapsedSeconds: elapsedTime
      });
    }
  }, [findings, logs, isScanning, repoUrl, repoMetadata, totalFound, scanStatus, scanStartTime, elapsedTime, saveActiveSession]);

  // Progressive Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (repoUrl && repoUrl.length >= 2 && !repoUrl.startsWith('http')) {
        setIsSearchingRepos(true);
        setShowDropdown(true);
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
          const res = await fetch(`${apiBase}/api/v1/search/repos?q=${encodeURIComponent(repoUrl)}`);
          if (!res.ok) throw new Error('Search failed');
          const data = await res.json();
          setSearchResults(data.items || []);
          setShowDropdown(data.items?.length > 0 || isSearchingRepos);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
          setShowDropdown(false);
        } finally {
          setIsSearchingRepos(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
        setIsSearchingRepos(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [repoUrl]);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isScanning) {
      if (!scanStartTime) setScanStartTime(Date.now());
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (scanStartTime || Date.now())) / 1000));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isScanning, scanStartTime]);

  // Reset timer on new scan
  useEffect(() => {
    if (isScanning && offset === 0) {
      setScanStartTime(Date.now());
      setElapsedTime(0);
    }
  }, [isScanning, offset]);

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

    const trimmedRepo = repoUrl.trim();
    if (!trimmedRepo) {
      addLog('Validation Error: Repository path cannot be empty.', 'error');
      return;
    }

    executeScan(0);
    inputRef.current?.blur();
  };

  const executeScan = async (currentOffset: number = 0, targetRepo: string = repoUrl) => {
    setIsScanning(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (currentOffset === 0) {
      // Only clear if it's a different repo or we are starting fresh
      if (targetRepo !== repoUrl || scanStatus === 'completed' || scanStatus === 'idle') {
        setFindings([]);
        setLogs([]);
        setOffset(0);
        setTotalFound(0);
        scanIdRef.current = Math.random().toString(36).substring(7);
      }
    }

    setScanStatus('scanning');
    addLog(`Initiating scan for: ${targetRepo} (Batch: ${currentOffset / 50 + 1})`, 'info');

    let scanCompletedSuccessfully = false;

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
      setOffset(data.offset);
      setRepoMetadata(data.metadata);

      addLog(`Found ${data.total_found} target files.`, 'info');
      if (data.message) {
        addLog(data.message, 'warning');
      }

      addLog('Prioritizing and categorizing tree...', 'info');
      data.files_found.forEach((f: any) => {
        addLog(`Target: ${f.path} [${f.category}]`, 'success');
      });

      if (data.files_found.length > 0) {
        if (signal.aborted) return;
        addLog(`Initiating prioritized AI analysis for ${data.files_found.length} files...`, 'info');

        const analyzeResponse = await fetch(`${apiBase}/api/v1/scan/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner: data.owner,
            repo: data.repo,
            files: data.files_found
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
                } else if (result.findings && result.findings.length > 0) {
                  const newFindings = result.findings.map((finding: any) => ({
                    file: result.file,
                    category: result.category,
                    ...finding
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

                  newFindings.forEach((f: any) => {
                    addLog(`[${f.severity}] ${result.file} (${result.category}): ${f.description}`,
                      f.severity === 'Critical' || f.severity === 'High' ? 'error' : 'warning');
                  });
                } else {
                  addLog(`Analysis for ${result.file} (${result.category}): No critical issues.`, 'success');
                }
              } catch (e) {
                console.error("Error parsing stream chunk:", e);
              }
            }
          }
        }
        scanCompletedSuccessfully = true;
      }
    } catch (err) {
      if ((err as any).name === 'AbortError') {
        addLog('Security audit terminated. Displaying results found so far.', 'warning');
        setScanStatus('partial');
        saveSessionToHistory('partial');
      } else {
        addLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
        setScanStatus('idle');
      }
    } finally {
      setIsScanning(false);
      abortControllerRef.current = null;
      if (scanCompletedSuccessfully) {
        setScanStatus('completed');
        addLog('Full security audit complete.', 'success');
        saveSessionToHistory('completed');
      }
    }
  };

  const saveSessionToHistory = (status: 'completed' | 'partial') => {
    const session: AuditSession = {
      id: scanIdRef.current,
      repo: repoUrl,
      status,
      findings,
      logs: logs.slice(-20), // Keep a small log trail
      metadata: repoMetadata,
      filesAnalyzed: findings.length,
      totalFiles: totalFound,
      startedAt: new Date(scanStartTime || Date.now()).toISOString(),
      completedAt: new Date().toISOString(),
      elapsedSeconds: elapsedTime
    };
    saveToHistory(session);
    clearActiveSession(repoUrl);
  };

  const handleStopScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      addLog('Terminating active audit stream...', 'warning');
    }
  };

  const exportResults = (format: 'xml' | 'yaml' | 'markdown') => {
    let content = '';
    const timestamp = new Date().toISOString();
    const promptHeader = `### SECURITY REMEDIATION TASK ###\nRepository: ${repoUrl}\nGenerated: ${timestamp}\nTotal Issues: ${findings.length}\n\nINSTRUCTIONS FOR AI AGENT:\nYou are an expert Security Engineer. Analyze the following ${format.toUpperCase()} audit data from LumeScan and provide a detailed implementation plan and code patches to remediate these vulnerabilities. Prioritize 'Critical' and 'High' severity items.\n\n`;

    if (format === 'xml') {
      const xmlFindings = findings.map(f => `
  <vulnerability>
    <file>${f.file}</file>
    <severity>${f.severity}</severity>
    <category>${f.category}</category>
    <type>${f.type}</type>
    <description>${f.description}</description>
    <recommendation>${f.recommendation}</recommendation>
  </vulnerability>`).join('');
      content = `${promptHeader}<security_audit>\n  <metadata>\n    <repo>${repoUrl}</repo>\n    <count>${findings.length}</count>\n  </metadata>\n  <findings>${xmlFindings}\n  </findings>\n</security_audit>`;
    } else if (format === 'yaml') {
      const yamlFindings = findings.map(f => `  - file: "${f.file}"
    severity: "${f.severity}"
    category: "${f.category}"
    type: "${f.type}"
    description: "${f.description.replace(/"/g, "'")}"
    recommendation: "${f.recommendation.replace(/"/g, "'")}"`).join('\n');
      content = `${promptHeader}security_audit:\n  repository: "${repoUrl}"\n  findings:\n${yamlFindings}`;
    } else {
      const mdFindings = findings.map(f => `### [${f.severity}] ${f.file}\n- **Category**: ${f.category}\n- **Type**: ${f.type}\n- **Description**: ${f.description}\n- **Remediation**: ${f.recommendation}\n`).join('\n');
      content = `${promptHeader}# Security Audit Report: ${repoUrl}\n\n${mdFindings}`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumescan_audit_${new Date().getTime()}.${format === 'markdown' ? 'md' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog(`Exported ${format.toUpperCase()} AI Package.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 selection:bg-emerald-500/30">
      <div className="max-w-[1440px] mx-auto">
        {/* Subtle Decorative Background */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />

        {/* Header Mask & Vignette */}
        <div className="sticky top-0 z-30 h-20 -mb-20 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent backdrop-blur-sm pointer-events-none" />

        <header className="sticky top-4 z-40 flex items-center justify-between mb-8 bg-slate-900/70 backdrop-blur-xl border border-slate-800 px-4 py-3 rounded-2xl shadow-2xl shadow-black/20 transition-all">
          <Link href="/welcome" className="flex items-center gap-2 group">
            <img src="/lumescan-logo.png" alt="LumeScan Logo" className="w-8 h-8 object-contain rounded-lg group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-bold tracking-tighter text-white group-hover:text-emerald-400 transition-colors">LUME<span className="text-emerald-500">SCAN</span></h1>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/mfscpayload-690/lumescan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-all group"
              title="View Source on GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://buymeacoffee.com/mfscpayload690"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 border border-slate-700/50 rounded-lg text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-all flex items-center gap-2 group"
              title="Support LumeScan"
            >
              <CoffeeIcon size={18} />
              <span className="text-[10px] font-bold uppercase hidden sm:block text-slate-400 group-hover:text-amber-300">Support</span>
            </a>
            <Link
              href="/history"
              className="p-2 bg-slate-800 border border-slate-700/50 rounded-lg text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 transition-all flex items-center gap-2 group"
              title="Audit History"
            >
              <HistoryIcon size={18} />
              <span className="text-[10px] font-bold uppercase hidden sm:block text-slate-400 group-hover:text-emerald-300">History</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl backdrop-blur-md relative z-20">
              <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4">Repository Config</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs text-slate-400 font-bold mb-2 uppercase tracking-tighter">Target Repository [ or Repo URL ]</label>
                  <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      ref={inputRef}
                      type="text"
                      autoFocus
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      onFocus={() => repoUrl.length >= 2 && !repoUrl.startsWith('http') && setShowDropdown(true)}
                      placeholder="e.g. owner/repo"
                      className="w-full bg-slate-950/50 border border-slate-800 pl-11 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-all cyber-glow placeholder:text-slate-600"
                    />
                  </div>

                  {/* Results Dropdown */}
                  {showDropdown && (isSearchingRepos || searchResults.length > 0) && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      {isSearchingRepos && (
                        <div className="p-4 flex items-center justify-center gap-2 text-slate-400 border-b border-slate-800/50">
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Searching Repositories...</span>
                        </div>
                      )}
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setRepoUrl(result.full_name);
                            setShowDropdown(false);
                            executeScan(0, result.full_name);
                            inputRef.current?.blur();
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-800 border-b border-slate-800/50 last:border-0 transition-colors group/item"
                        >
                          <div className="text-sm font-bold text-emerald-500 group-hover/item:text-emerald-400 truncate">{result.full_name}</div>
                          {result.description && (
                            <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{result.description}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {isScanning ? (
                  <button
                    type="button"
                    onClick={handleStopScan}
                    className="w-full py-3 bg-rose-500 text-white font-bold rounded hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  >
                    <Square size={16} fill="white" /> STOP AUDIT
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!repoUrl.trim()}
                    className="w-full py-3 bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    {scanStatus === 'partial' || scanStatus === 'completed' ? (
                      <><RotateCcw size={16} /> RE-INITIALIZE AUDIT</>
                    ) : (
                      <><Play size={16} fill="currentColor" /> INITIALIZE AUDIT</>
                    )}
                  </button>
                )}
              </form>
              {totalFound > offset + 50 && !isScanning && (
                <button
                  onClick={() => executeScan(offset + 50)}
                  className="w-full mt-4 py-3 bg-transparent border border-emerald-500 text-emerald-500 font-bold rounded hover:bg-emerald-500/10 transition-all"
                >
                  SCAN NEXT BATCH ({offset + 51}-{Math.min(offset + 100, totalFound)})
                </button>
              )}
            </div>

            {!repoMetadata && !isScanning && (
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl backdrop-blur-md relative z-10 animate-in fade-in duration-500">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Audit Scope</h2>
                <ul className="text-xs space-y-2 text-slate-400">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Logic (Python/JS Controllers)</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Config (Dependencies/CORS)</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Secrets (.env/Keys)</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Workflows (CI/CD)</li>
                </ul>
              </div>
            )}

            {repoMetadata && (
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl backdrop-blur-md relative z-10 animate-in fade-in slide-in-from-left-4 duration-500 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-lg font-medium text-white flex items-center gap-2.5 truncate pr-4 font-sans">
                    <Zap size={18} className="text-blue-400 fill-blue-400/20 shrink-0" />
                    {repoMetadata.full_name || (repoUrl && repoUrl.includes('/') ? repoUrl.split('/').filter(Boolean).slice(-2).join('/') : repoUrl) || 'CURRENT REPOSITORY'}
                  </h2>
                  <div className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-500 uppercase shrink-0">
                    {repoMetadata.visibility || 'Public'}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Primary Stats Grid - 4 in a row */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col gap-0.5 hover:border-amber-500/30 transition-colors group">
                      <div className="text-slate-500 flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider">
                        <Star size={10} className="text-amber-400 group-hover:scale-110 transition-transform" /> Stars
                      </div>
                      <div className="text-base font-bold text-white tracking-tighter">
                        {repoMetadata.stars?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col gap-0.5 hover:border-blue-500/30 transition-colors group">
                      <div className="text-slate-500 flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider">
                        <GitFork size={10} className="text-blue-400 group-hover:scale-110 transition-transform" /> Forks
                      </div>
                      <div className="text-base font-bold text-white tracking-tighter">
                        {repoMetadata.forks?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col gap-0.5 hover:border-rose-500/30 transition-colors group">
                      <div className="text-slate-500 flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider">
                        <AlertCircle size={10} className="text-rose-500 group-hover:scale-110 transition-transform" /> Issues
                      </div>
                      <div className="text-base font-bold text-white tracking-tighter">
                        {repoMetadata.open_issues?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col gap-0.5 hover:border-emerald-500/30 transition-colors group">
                      <div className="text-slate-500 flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider">
                        <Eye size={10} className="text-emerald-500 group-hover:scale-110 transition-transform" /> Watch
                      </div>
                      <div className="text-base font-bold text-white tracking-tighter">
                        {repoMetadata.watchers?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>

                  {/* Technical Meta List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2.5 p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/50 hover:bg-slate-950/60 transition-colors">
                      {repoMetadata.languages && repoMetadata.languages.length > 0 ? (
                        repoMetadata.languages.slice(0, 12).map((lang: string) => {
                          const mapping: Record<string, string> = {
                            'JavaScript': 'js', 'TypeScript': 'ts', 'Python': 'py',
                            'HTML': 'html', 'CSS': 'css', 'Rust': 'rust', 'Go': 'go',
                            'C++': 'cpp', 'Java': 'java', 'PHP': 'php', 'Ruby': 'ruby',
                            'Shell': 'bash', 'Vue': 'vue', 'React': 'react', 'C': 'c', 'C#': 'cs'
                          };
                          const iconId = mapping[lang] || lang.toLowerCase().replace('#', 's').replace('++', 'pp');
                          return (
                            <img
                              key={lang}
                              src={`https://skillicons.dev/icons?i=${iconId}`}
                              alt={lang}
                              title={lang}
                              className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-110 transition-transform cursor-help"
                            />
                          );
                        })
                      ) : (
                        <div className="flex items-center gap-2 py-1">
                          <Code size={14} className="text-slate-600" />
                          <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Awaiting Technology Scan</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/50 hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-500/10 rounded">
                          <Shield size={14} className="text-purple-500" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">License Type</span>
                      </div>
                      <span className="text-xs font-mono text-slate-200 truncate max-w-[140px]" title={repoMetadata.license}>
                        {repoMetadata.license || 'Proprietary'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/50 hover:bg-slate-950/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-500/10 rounded">
                          <Package size={14} className="text-blue-500" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Storage Size</span>
                      </div>
                      <span className="text-xs font-mono text-slate-200">
                        {repoMetadata.size ? `${(repoMetadata.size / 1024).toFixed(1)} MB` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {repoMetadata.description && (
                    <div className="p-4 bg-slate-950/30 border-l-2 border-emerald-500/30 rounded-r-lg italic">
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        &quot;{repoMetadata.description}&quot;
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Last Synchronized:</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(repoMetadata.updated_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col ${isLogCollapsed ? 'h-auto md:h-[700px]' : 'h-[500px] md:h-[700px]'} shadow-inner transition-all duration-300`}>
            <div className="bg-slate-900/80 border-b border-slate-800 p-4 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Terminal size={18} className="text-emerald-500" />
                  <span className="font-mono text-sm font-bold tracking-widest text-slate-300">ANALYSIS LOG</span>
                </div>

                {/* Integrated Status & Timer */}
                <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full 
                      ${isScanning ? 'bg-blue-500 animate-pulse' :
                        scanStatus === 'completed' ? 'bg-emerald-500' :
                          scanStatus === 'partial' ? 'bg-amber-500' : 'bg-slate-700'} 
                      shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                      {isScanning ? 'SCAN ACTIVE' :
                        scanStatus === 'completed' ? 'AUDIT COMPLETED' :
                          scanStatus === 'partial' ? 'AUDIT STOPPED (PARTIAL)' : 'ENGINE READY'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800">
                    <Timer size={10} className="text-slate-600" />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:
                      {(elapsedTime % 60).toString().padStart(2, '0')}s
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLogCollapsed(!isLogCollapsed)}
                  className="md:hidden flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-tighter"
                >
                  {isLogCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span>{isLogCollapsed ? 'Expand' : 'Collapse'}</span>
                </button>
                <button
                  onClick={() => {
                    const logText = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
                    navigator.clipboard.writeText(logText);
                    addLog('Logs copied to clipboard!', 'success');
                  }}
                  className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-emerald-500 transition-colors group"
                  title="Copy Logs"
                >
                  <Copy size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden xs:inline">COPY</span>
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 custom-scrollbar bg-slate-950/30 ${isLogCollapsed ? 'hidden md:block' : 'block'}`}>
              {logs.map((log, idx) => (
                <div key={log.id} className="flex gap-3">
                  <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`
                      ${log.type === 'success' ? 'text-emerald-400' : ''}
                      ${log.type === 'warning' ? 'text-amber-400/90' : ''}
                      ${log.type === 'error' ? 'text-rose-400' : ''}
                      ${log.type === 'info' ? 'text-slate-400' : ''}
                    `}>
                    {log.message}
                    {idx === logs.length - 1 && (
                      <span className="inline-block w-1.5 h-4 bg-emerald-500 ml-1 animate-[pulse_1s_infinite] align-middle" />
                    )}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Result Matrix */}
        {findings.length > 0 && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="text-amber-500" />
                SECURITY FINDINGS <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono tracking-tighter">{findings.length} ISSUES DETECTED</span>
              </h2>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono hidden md:block uppercase tracking-wider">AI REMEDIATION PACKAGE:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => exportResults('xml')}
                    className="p-2 bg-slate-900 border border-slate-800 rounded hover:border-emerald-500/50 text-slate-400 hover:text-emerald-500 transition-all flex items-center gap-2 text-[10px] font-bold"
                    title="Export XML"
                  >
                    <FileCode size={14} /> XML
                  </button>
                  <button
                    onClick={() => exportResults('yaml')}
                    className="p-2 bg-slate-900 border border-slate-800 rounded hover:border-emerald-500/50 text-slate-400 hover:text-emerald-500 transition-all flex items-center gap-2 text-[10px] font-bold"
                    title="Export YAML"
                  >
                    <FileDown size={14} /> YAML
                  </button>
                  <button
                    onClick={() => exportResults('markdown')}
                    className="p-2 bg-slate-900 border border-slate-800 rounded hover:border-emerald-500/50 text-slate-400 hover:text-emerald-500 transition-all flex items-center gap-2 text-[10px] font-bold"
                    title="Export Markdown"
                  >
                    <FileText size={14} /> MD
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {findings.map((finding, idx) => (
                <div key={idx} className="group p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden shadow-lg shadow-black/20">
                  {/* Category Accent */}
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 opacity-5 rotate-45 
                    ${finding.category === 'Logic' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target Module</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border border-slate-700 font-bold uppercase tracking-tighter
                          ${finding.category === 'Logic' ? 'text-blue-400 border-blue-500/30' : 'text-emerald-400 border-emerald-500/30'}`}>
                          {finding.category || 'GENERAL'}
                        </span>
                      </div>
                      <code className="text-xs text-emerald-400/90 truncate max-w-[250px] font-mono">{finding.file}</code>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
                      ${finding.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : ''}
                      ${finding.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : ''}
                      ${finding.severity === 'Medium' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : ''}
                      ${finding.severity === 'Low' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/50' : ''}
                      ${finding.severity === 'Informational' ? 'bg-slate-500/20 text-slate-500 border border-slate-500/50' : ''}
                    `}>
                      {finding.severity}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Diagnostic Output</h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">{finding.description}</p>
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg group/rem relative">
                      <h4 className="text-[10px] font-bold text-emerald-500/80 mb-1 uppercase tracking-tighter">Recommended Patch</h4>
                      <p className="text-xs text-emerald-200/60 font-sans leading-relaxed">{finding.recommendation}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(finding.recommendation);
                          addLog(`Copied remediation for ${finding.file}`, 'success');
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover/rem:opacity-100 transition-opacity text-emerald-500 hover:scale-110"
                        title="Copy Recommendation"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
