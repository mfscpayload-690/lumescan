'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldCheck, Zap, AlertTriangle, Copy } from 'lucide-react';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface Finding {
  file: string;
  category?: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  description: string;
  recommendation: string;
}

/**
 * Client-side React component that provides a batched GitHub repository security scanning UI and orchestrates the scan workflow, status logs, and findings display.
 *
 * Renders controls to initialize and paginate scans, a live status log panel with copy-to-clipboard, and a findings matrix that shows categorized security issues with remediation copy actions.
 *
 * @returns A JSX element rendering the dashboard UI for configuring scans, viewing status logs, and browsing security findings.
 */
export default function DashboardPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

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
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeScan(0);
  };

  const executeScan = async (currentOffset: number = 0) => {
    setIsScanning(true);
    if (currentOffset === 0) {
      setFindings([]);
      setLogs([]);
      setOffset(0);
    }
    
    addLog(`Initiating scan for: ${repoUrl} (Batch: ${currentOffset / 50 + 1})`, 'info');
    
    try {
      addLog('Validating repository structure...', 'info');
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/scan/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl, offset: currentOffset }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize scan');
      }

      const data = await response.json();
      setTotalFound(data.total_found);
      setOffset(data.offset);
      
      addLog(`Found ${data.total_found} target files.`, 'info');
      if (data.message) {
        addLog(data.message, 'warning');
      }
      
      addLog('Prioritizing and categorizing tree...', 'info');
      data.files_found.forEach((f: any) => {
        addLog(`Target: ${f.path} [${f.category}]`, 'success');
      });
      
      if (data.files_found.length > 0) {
        addLog(`Initiating prioritized AI analysis for ${data.files_found.length} files...`, 'info');
        
        const analyzeResponse = await fetch('http://127.0.0.1:8000/api/v1/scan/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner: data.owner,
            repo: data.repo,
            files: data.files_found
          }),
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
                  
                  setFindings(prev => [...prev, ...newFindings]);
                  
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
      }
      
      addLog('Full security audit complete.', 'success');
    } catch (err) {
      addLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tighter">LUME<span className="text-emerald-500">SCAN</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500" /> System Active</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4">Repository Config</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">GITHUB REPO URL</label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full bg-black border border-zinc-700 px-4 py-3 rounded text-sm focus:outline-none focus:border-emerald-500 transition-all cyber-glow"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full py-3 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isScanning ? 'SCANNING...' : 'INITIALIZE AUDIT'}
                </button>
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

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Audit Scope</h2>
              <ul className="text-xs space-y-2 text-gray-500">
                <li>• Logic (Python/JS Controllers)</li>
                <li>• Config (Dependencies/CORS)</li>
                <li>• Secrets (.env/Keys)</li>
                <li>• Workflows (CI/CD)</li>
              </ul>
            </div>
          </div>

          {/* Status Log */}
          <div className="md:col-span-2 bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="bg-[#111] border-b border-[#333] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-[#10b981]" />
                <span className="font-mono text-sm font-bold tracking-widest text-[#999]">STATUS LOG</span>
              </div>
              <button 
                onClick={() => {
                  const logText = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
                  navigator.clipboard.writeText(logText);
                  addLog('Logs copied to clipboard!', 'success');
                }}
                className="flex items-center gap-2 text-xs font-mono text-[#666] hover:text-[#10b981] transition-colors group"
                title="Copy Logs"
              >
                <Copy size={14} className="group-hover:scale-110 transition-transform" />
                <span>COPY</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 custom-scrollbar">
                {logs.length === 0 && (
                  <div className="text-zinc-700 italic">Waiting for input...</div>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                    <span className={`
                      ${log.type === 'success' ? 'text-emerald-500' : ''}
                      ${log.type === 'warning' ? 'text-amber-500' : ''}
                      ${log.type === 'error' ? 'text-rose-500' : ''}
                      ${log.type === 'info' ? 'text-blue-400' : ''}
                    `}>
                      {log.message}
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
                SECURITY FINDINGS <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-mono">{findings.length} ISSUES</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {findings.map((finding, idx) => (
                <div key={idx} className="group p-5 bg-[#0a0a0a] border border-[#333] rounded-xl hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden">
                  {/* Category Accent */}
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 opacity-5 rotate-45 
                    ${finding.category === 'Logic' ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#666] font-mono tracking-widest uppercase">FILE PATH</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border border-zinc-700 font-bold uppercase tracking-tighter
                          ${finding.category === 'Logic' ? 'text-blue-400 border-blue-500/30' : 'text-emerald-400 border-emerald-500/30'}`}>
                          {finding.category || 'GENERAL'}
                        </span>
                      </div>
                      <code className="text-xs text-emerald-400 truncate max-w-[250px]">{finding.file}</code>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase
                      ${finding.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : ''}
                      ${finding.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : ''}
                      ${finding.severity === 'Medium' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : ''}
                      ${finding.severity === 'Low' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/50' : ''}
                      ${finding.severity === 'Informational' ? 'bg-zinc-500/20 text-zinc-500 border border-zinc-500/50' : ''}
                    `}>
                      {finding.severity}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 mb-1">DETECTION</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{finding.description}</p>
                    </div>
                    
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg group/rem relative">
                      <h4 className="text-[10px] font-bold text-emerald-500 mb-1 uppercase tracking-tighter">REMEDIATION</h4>
                      <p className="text-xs text-emerald-200/70">{finding.recommendation}</p>
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
}
