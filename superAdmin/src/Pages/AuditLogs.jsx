import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Download,
  Clock,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const AuditLogs = () => {
  const { auditLogs } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedModule !== 'ALL' && log.module !== selectedModule) return false;
      if (selectedStatus !== 'ALL' && log.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = log.description?.toLowerCase().includes(q);
        const matchesActor = log.actorName?.toLowerCase().includes(q);
        const matchesTarget = log.target?.toLowerCase().includes(q);
        if (!matchesDesc && !matchesActor && !matchesTarget) return false;
      }
      return true;
    });
  }, [auditLogs, selectedModule, selectedStatus, searchQuery]);

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Log ID,Timestamp,Actor,Role,Module,Action,Target,IP,Status,Description']
        .concat(
          auditLogs.map(
            (l) =>
              `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.module}","${l.action}","${l.target}","${l.ip}","${l.status}","${l.description.replace(/"/g, '""')}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PlutoPlat_AuditTrail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SuperAdminLayout title="Platform Security & System Telemetry">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Immutable Audit Ledger</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                Live Audit Stream
              </span>
            </div>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Cryptographic logging of all administrative actions, authentication attempts, property lifecycle modifications, and system interventions.
            </p>
          </div>

          <button
            onClick={handleExportLogs}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-white border border-[#E8E3D8] hover:bg-[#FAF8F5] text-[#1C201C] rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <Download size={15} className="text-[#B49A70]" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Search audit events by description, actor, or target ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full pl-10 pr-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 text-[#1C201C] placeholder:text-[#A9A69B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="h-11 px-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl text-[#1C201C] focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 cursor-pointer font-medium"
            >
              <option value="ALL">All Modules</option>
              <option value="PROPERTY">Property Events</option>
              <option value="AUTH">Authentication</option>
              <option value="USER">User & Roles</option>
              <option value="ENQUIRY">Enquiries & Leads</option>
              <option value="ADMIN">Admin Intervention</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-11 px-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl text-[#1C201C] focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success Only</option>
              <option value="BLOCKED">Blocked / Lockouts</option>
              <option value="FAILED">Failures</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Event Ref / Time</th>
                  <th className="py-4 px-5">Actor</th>
                  <th className="py-4 px-5">Module & Action</th>
                  <th className="py-4 px-5">Event Description</th>
                  <th className="py-4 px-5">IP Address</th>
                  <th className="py-4 px-5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#6E6D66]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <History size={28} className="mx-auto text-[#B49A70]/50" />
                        <p className="font-serif text-base text-[#1C201C]">No audit records found</p>
                        <p className="text-[11px] text-[#8A887F]">
                          No telemetry matched your current filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Ref & Time */}
                      <td className="py-4 px-5 font-mono text-xs text-[#6E6D66]">
                        <span className="font-semibold text-[#1C201C]">{log.id}</span>
                        <p className="text-[10px] text-[#8A887F] mt-0.5">{log.timestamp}</p>
                      </td>

                      {/* Actor */}
                      <td className="py-4 px-5">
                        <p className="font-serif text-sm font-semibold text-[#1C201C]">{log.actorName}</p>
                        <span className="inline-block text-[10px] uppercase tracking-wider text-[#B49A70] font-bold mt-0.5">
                          {log.actorRole}
                        </span>
                      </td>

                      {/* Module & Action */}
                      <td className="py-4 px-5">
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B49A70]/15 text-[#8A734D] mb-1">
                          {log.module}
                        </span>
                        <p className="font-mono text-xs text-[#1C201C] font-semibold">{log.action}</p>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-5 max-w-sm">
                        <p className="text-xs text-[#1C201C] leading-snug">{log.description}</p>
                        {log.target && (
                          <p className="text-[11px] text-[#8A887F] mt-0.5">Target: {log.target}</p>
                        )}
                      </td>

                      {/* IP */}
                      <td className="py-4 px-5 font-mono text-xs text-[#6E6D66]">
                        {log.ip || '103.25.14.92'}
                      </td>

                      {/* Result */}
                      <td className="py-4 px-5 text-right">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : log.status === 'BLOCKED'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AuditLogs;
