import React, { useState, useEffect } from 'react';
import { FirebaseService, FirebaseHealthStatus } from '../../services/firebaseService';
import { 
  CheckCircle2, AlertTriangle, XCircle, RefreshCw, Copy, Check, 
  ExternalLink, Database, ShieldAlert, Key, HelpCircle, X
} from 'lucide-react';

interface FirebaseStatusGuideProps {
  onStatusChange?: (status: FirebaseHealthStatus) => void;
}

export const FirebaseStatusGuide: React.FC<FirebaseStatusGuideProps> = ({ onStatusChange }) => {
  const [health, setHealth] = useState<FirebaseHealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'env' | 'storage'>('rules');

  const runCheck = async () => {
    setIsChecking(true);
    try {
      const res = await FirebaseService.checkHealth();
      setHealth(res);
      if (onStatusChange) onStatusChange(res);
    } catch (e) {
      console.error('Health check failed', e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const STORAGE_RULES_SNIPPET = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

  const VERCEL_ENV_VARS = [
    { key: 'VITE_FIREBASE_API_KEY', value: (import.meta as any).env?.VITE_FIREBASE_API_KEY || '' },
    { key: 'VITE_FIREBASE_AUTH_DOMAIN', value: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '' },
    { key: 'VITE_FIREBASE_PROJECT_ID', value: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '' },
    { key: 'VITE_FIREBASE_STORAGE_BUCKET', value: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '' },
    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '' },
    { key: 'VITE_FIREBASE_APP_ID', value: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '' },
    { key: 'VITE_FIREBASE_MEASUREMENT_ID', value: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || '' }
  ];

  if (!health) {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-500 py-1">
        <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
        <span>Testing Cloud Firestore live connection...</span>
      </div>
    );
  }

  return (
    <>
      {/* ── STATUS BANNER ── */}
      {health.canWrite ? (
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-ui">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="font-bold">Cloud Firestore Connected:</span>
            <span className="hidden md:inline text-emerald-800">All articles and changes persist live across all visitors.</span>
          </div>
          <button
            onClick={runCheck}
            disabled={isChecking}
            className="text-[11px] text-emerald-700 hover:text-emerald-950 font-semibold flex items-center space-x-1 ml-3"
            title="Re-test live connection"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Re-check</span>
          </button>
        </div>
      ) : !health.isConfigured ? (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-ui">
          <div className="flex items-center space-x-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-bold">Firebase Not Configured on Vercel: </span>
              <span className="text-amber-900">Missing environment variables in Vercel. Changes only save locally in your browser.</span>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('env'); setIsModalOpen(true); }}
            className="flex-shrink-0 ml-3 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs"
          >
            Fix in Vercel
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-red-50 border border-red-300 text-red-950 text-xs font-ui animate-pulse-subtle">
          <div className="flex items-center space-x-2 min-w-0">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-red-800">Firestore Permission Denied: </span>
              <span className="text-red-900">Security rules in Firebase Console are blocking writes. Changes will NOT persist!</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            <button
              onClick={() => { setActiveTab('rules'); setIsModalOpen(true); }}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs"
            >
              Fix Security Rules
            </button>
            <button
              onClick={runCheck}
              disabled={isChecking}
              className="p-1 rounded-lg text-slate-500 hover:bg-red-100"
              title="Test again"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* ── SETUP & TROUBLESHOOTING MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0F4C3A] to-[#18392B] text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center space-x-2.5">
                <Database className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-amber-100">
                    Fix Firebase Cloud Database Persistence
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Why articles do not persist and how to enable permanent live sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Alert Box */}
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-start space-x-3 text-xs">
                {health.canWrite ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">
                    Current Firebase Status: {health.canWrite ? 'Healthy & Fully Operational' : health.errorCode || 'Action Required'}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {health.canWrite
                      ? 'Cloud Firestore is connected and accepting reads and writes. Everything you post will be stored permanently.'
                      : health.errorMessage || 'Cloud Firestore is rejecting writes due to permission rules. Follow Step 1 below.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-3 space-x-2 text-xs font-bold font-ui">
              <button
                onClick={() => setActiveTab('rules')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'rules'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Step 1: Firestore Rules (Crucial!)</span>
              </button>

              <button
                onClick={() => setActiveTab('env')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'env'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Step 2: Vercel Environment Variables</span>
              </button>

              <button
                onClick={() => setActiveTab('storage')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'storage'
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Step 3: Storage Rules</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              
              {/* TAB 1: FIRESTORE RULES */}
              {activeTab === 'rules' && (
                <div className="space-y-4 text-xs font-ui">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                    <p className="font-bold">Why changes didn't save:</p>
                    <p className="text-[11px] leading-relaxed">
                      By default, Google Firebase Firestore starts in <strong>Locked Mode</strong> (<code className="bg-amber-100 px-1 rounded">allow read, write: if false;</code>). 
                      Until you change this rule, Firebase actively rejects every article and edit with <strong>PERMISSION_DENIED</strong>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Copy this rule into Firebase Console:</span>
                      <button
                        onClick={() => handleCopy(FIRESTORE_RULES_SNIPPET, 'firestore-rules')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px]"
                      >
                        {copiedKey === 'firestore-rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'firestore-rules' ? 'Copied!' : 'Copy Rule'}</span>
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800">
                      {FIRESTORE_RULES_SNIPPET}
                    </pre>
                  </div>

                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-[11px] leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <li>Go to <a href="https://console.firebase.google.com/project/voice-of-sufism/firestore/rules" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center">Firebase Console &gt; Firestore &gt; Rules <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>.</li>
                    <li>Replace the existing code with the snippet above.</li>
                    <li>Click the blue <strong>"Publish"</strong> button at the top right.</li>
                    <li>Click the <strong>"Test Connection Now"</strong> button below!</li>
                  </ol>
                </div>
              )}

              {/* TAB 2: VERCEL ENV VARS */}
              {activeTab === 'env' && (
                <div className="space-y-4 text-xs font-ui">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Because your <code className="bg-slate-100 px-1 rounded font-mono">.env</code> file is protected by <code className="bg-slate-100 px-1 rounded font-mono">.gitignore</code>, Vercel needs these variables added in your dashboard under <strong>Settings &gt; Environment Variables</strong>:
                  </p>

                  <div className="space-y-2">
                    {VERCEL_ENV_VARS.map((v) => (
                      <div key={v.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="min-w-0 pr-2">
                          <p className="font-mono font-bold text-slate-900 text-[11px]">{v.key}</p>
                          <p className="font-mono text-slate-500 text-[10px] truncate max-w-sm">{v.value}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(v.value, v.key)}
                          className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center space-x-1"
                        >
                          {copiedKey === v.key ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === v.key ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    * After adding these in Vercel, go to <strong>Deployments &gt; Redeploy</strong> for changes to take effect.
                  </p>
                </div>
              )}

              {/* TAB 3: STORAGE RULES */}
              {activeTab === 'storage' && (
                <div className="space-y-4 text-xs font-ui">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Copy this into Firebase Storage &gt; Rules:</span>
                      <button
                        onClick={() => handleCopy(STORAGE_RULES_SNIPPET, 'storage-rules')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px]"
                      >
                        {copiedKey === 'storage-rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'storage-rules' ? 'Copied!' : 'Copy Rule'}</span>
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800">
                      {STORAGE_RULES_SNIPPET}
                    </pre>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Open <a href="https://console.firebase.google.com/project/voice-of-sufism/storage/rules" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center">Firebase Storage &gt; Rules <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a> and click <strong>Publish</strong>.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={runCheck}
                disabled={isChecking}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Testing Firestore...' : 'Test Connection Now'}</span>
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
