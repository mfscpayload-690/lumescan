import { useState, useCallback } from 'react';

export interface Finding {
  file: string;
  category?: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  description: string;
  recommendation: string;
}

export interface LogEntry {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'system' | 'boot';
  message: string;
  timestamp: string;
}

export interface AuditSession {
  id: string;
  repo: string;
  status: 'idle' | 'scanning' | 'completed' | 'partial';
  findings: Finding[];
  logs: LogEntry[];
  metadata: any;
  filesAnalyzed: number;
  totalFiles: number;
  startedAt: string;
  completedAt: string;
  elapsedSeconds: number;
}

const HISTORY_KEY = 'lumescan:history';
const ACTIVE_SESSION_PREFIX = 'lumescan:active:';

export const useAuditCache = () => {
  const [history, setHistory] = useState<AuditSession[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const saveToHistory = useCallback((session: AuditSession) => {
    setHistory(prev => {
      // Filter out if same repo was just saved to avoid duplicates in quick succession
      const filtered = prev.filter(s => s.id !== session.id);
      const newHistory = [session, ...filtered].slice(0, 25); // Cap at 25
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const getHistory = useCallback(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  const saveActiveSession = useCallback((repo: string, data: Partial<AuditSession>) => {
    if (typeof window === 'undefined') return;
    const key = `${ACTIVE_SESSION_PREFIX}${repo}`;
    const existing = sessionStorage.getItem(key);
    const updated = existing ? { ...JSON.parse(existing), ...data } : data;
    sessionStorage.setItem(key, JSON.stringify(updated));
  }, []);

  const getActiveSession = useCallback((repo: string): Partial<AuditSession> | null => {
    if (typeof window === 'undefined') return null;
    const key = `${ACTIVE_SESSION_PREFIX}${repo}`;
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }, []);

  const clearActiveSession = useCallback((repo: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`${ACTIVE_SESSION_PREFIX}${repo}`);
  }, []);

  return {
    history,
    saveToHistory,
    getHistory,
    clearHistory,
    saveActiveSession,
    getActiveSession,
    clearActiveSession
  };
};
