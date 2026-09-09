import React, { useState } from 'react';
import { ActivityLog } from '../../types/cms';
import { 
  X, 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Download, 
  Calendar,
  Layers,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  logs = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  if (!isOpen) return null;

  // Extract distinct users
  const distinctUsers = Array.from(new Set(logs.map(l => l.user).filter(Boolean)));

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.target || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.timestamp || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBadge = selectedBadge === 'all' || log.badgeType === selectedBadge;
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;

    return matchesSearch && matchesBadge && matchesUser;
  });

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Target', 'Type'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp || ''}"`,
      `"${l.user || ''}"`,
      `"${l.action || ''}"`,
      `"${l.target || ''}"`,
      `"${l.badgeType || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vos_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
        
        {/* Modal Header */}
        <div className="bg-[#090D16] text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-amber-300 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white flex items-center space-x-2">
                <span>System Security & Audit Trail</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-sans font-bold">
                  {logs.length} Events Logged
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete chronological log of user logins, article publishes, edits, and deletions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCsv}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-amber-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer shadow-xs"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap gap-2.5 items-center justify-between flex-shrink-0">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, action, target item, or date..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by Badge Type */}
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none cursor-pointer"
            >
              <option value="all">All Action Types</option>
              <option value="security">Security & Logins</option>
              <option value="publish">Published Items</option>
              <option value="create">Created Records</option>
              <option value="update">Updates & Edits</option>
              <option value="delete">Deletions</option>
            </select>

            {/* Filter by User */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none cursor-pointer"
            >
              <option value="all">All Users</option>
              {distinctUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Audit Log Table */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 custom-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-sm">No audit records found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start space-x-3.5">
                    {/* User Initials Badge */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C3A] to-emerald-900 text-amber-300 font-serif font-bold text-xs flex items-center justify-center border border-emerald-600/60 shadow-xs flex-shrink-0 mt-0.5">
                      {(log.user || 'U').substring(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{log.user}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          log.badgeType === 'security' ? 'bg-indigo-50 text-indigo-900 border border-indigo-200' :
                          log.badgeType === 'publish' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
                          log.badgeType === 'create' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                          log.badgeType === 'delete' ? 'bg-rose-50 text-rose-900 border border-rose-200' :
                          'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {log.action}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Target Record: <span className="font-bold text-slate-800 font-serif">{log.target}</span>
                      </p>
                    </div>
                  </div>

                  {/* Exact Date & Time */}
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 sm:self-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0 font-medium">
          <span>Showing {filteredLogs.length} of {logs.length} total logged activities</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close Audit Log
          </button>
        </div>

      </div>

    </div>
  );
};
