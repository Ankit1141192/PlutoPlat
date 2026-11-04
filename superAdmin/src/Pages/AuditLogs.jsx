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
              <h2 className="font-serif text-lg text-[#1C201C]">Immutable Audit Ledger</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Live Audit Stream
              </span>
            </div>
            <p className="text-xs text-[#6E6D66]">
              Cryptographic logging of all administrative actions, authentication attempts, property lifecycle modifications, and system interventions.
            </p>
          </div>

          <button
            onClick={handleExportLogs}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-[#DDD8CE] hover:bg-[#F8F6F2] text-[#1C201C] rounded-xs shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Download size={14} className="text-[#B49A70]" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 border border-[#DDD8CE] rounded-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766E]" />
            <input
              type="text"
              placeholder="Search audit events by description, actor, or target ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs text-[#1C201C] focus:outline-none"
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
              className="px-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs text-[#1C201C] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success Only</option>
              <option value="BLOCKED">Blocked / Lockouts</option>
              <option value="FAILED">Failures</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-[#DDD8CE] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#DDD8CE] text-[10px] uppercase font-bold tracking-wider text-[#6E6D66]">
                  <th className="py-3 px-4">Event Ref / Time</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Module & Action</th>
                  <th className="py-3 px-4">Event Description</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#6E6D66]">
                      No audit events found for current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F8F6F2] transition-colors">
                      {/* Ref & Time */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6D66]">
                        <span className="font-semibold text-[#1C201C]">{log.id}</span>
                        <p className="text-[10px] text-[#8E8B82] mt-0.5">{log.timestamp}</p>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1C201C]">{log.actorName}</p>
                        <span className="inline-block text-[10px] uppercase tracking-wider text-[#B49A70] font-bold">
                          {log.actorRole}
                        </span>
                      </td>

                      {/* Module & Action */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-2xs bg-[#B49A70]/15 text-[#B49A70] mb-0.5">
                          {log.module}
                        </span>
                        <p className="font-mono text-[11px] text-[#1C201C] font-semibold">{log.action}</p>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="text-[11px] text-[#1C201C] leading-snug">{log.description}</p>
                        {log.target && (
                          <p className="text-[10px] text-[#8E8B82] mt-0.5">Target: {log.target}</p>
                        )}
                      </td>

                      {/* IP */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6D66]">
                        {log.ip || '103.25.14.92'}
                      </td>

                      {/* Result */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'BLOCKED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
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
