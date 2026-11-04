import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Building2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Leads = () => {
  const { leads, updateLeadStatus, deleteLead } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = l.buyerName?.toLowerCase().includes(q);
        const matchesEmail = l.buyerEmail?.toLowerCase().includes(q);
        const matchesProp = l.propertyTitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesProp) return false;
      }
      return true;
    });
  }, [leads, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Buyer Name,Email,Phone,Property,Status,Date']
        .concat(
          leads.map(
            (l) =>
              `"${l.id}","${l.buyerName}","${l.buyerEmail}","${l.buyerPhone}","${l.propertyTitle}","${l.status}","${l.date}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PlutoPlat_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SuperAdminLayout title="Global Leads & Enquiry Pipeline">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg text-[#1C201C]">Central Inquiries Matrix</h2>
            <p className="text-xs text-[#6E6D66]">
              Real-time feed of all buyer acquisition inquiries generated across the portfolio.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-[#DDD8CE] hover:bg-[#F8F6F2] text-[#1C201C] rounded-xs shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Download size={14} className="text-[#B49A70]" />
            <span>Export Pipeline (CSV)</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 border border-[#DDD8CE] rounded-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766E]" />
            <input
              type="text"
              placeholder="Filter by buyer name, email, or property title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs text-[#1C201C] focus:outline-none"
            >
              <option value="all">All Stages ({leads.length})</option>
              <option value="New">New Inquiries</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled Viewing">Scheduled Viewing</option>
              <option value="Closed">Closed Deals</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white border border-[#DDD8CE] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#DDD8CE] text-[10px] uppercase font-bold tracking-wider text-[#6E6D66]">
                  <th className="py-3 px-4">Ref / Date</th>
                  <th className="py-3 px-4">Prospective Client</th>
                  <th className="py-3 px-4">Target Property</th>
                  <th className="py-3 px-4">Enquiry Brief</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#6E6D66]">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F8F6F2] transition-colors">
                      {/* Ref & Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6D66]">
                        <span className="font-semibold text-[#1C201C]">{lead.id}</span>
                        <p className="text-[10px] text-[#8E8B82] mt-0.5">{lead.date}</p>
                      </td>

                      {/* Buyer */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#1C201C]">{lead.buyerName}</p>
                        <div className="flex flex-col text-[10px] text-[#6E6D66] mt-0.5 space-y-0.5">
                          <span className="flex items-center gap-1">
                            <Mail size={10} className="text-[#B49A70]" />
                            {lead.buyerEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={10} className="text-[#287A50]" />
                            {lead.buyerPhone}
                          </span>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-[#1C201C] truncate max-w-xs">{lead.propertyTitle}</p>
                        <p className="text-[10px] text-[#8E8B82]">
                          Agent: <strong className="text-[#1C201C]">{lead.agentName || 'Michael Harrison'}</strong>
                        </p>
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-[11px] text-[#6E6D66] line-clamp-2 italic font-light">
                          "{lead.message}"
                        </p>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-xs border border-[#DDD8CE] bg-white focus:outline-none focus:border-[#B49A70]"
                        >
                          <option value="New">🟢 New Inquiry</option>
                          <option value="Contacted">🔵 Contacted</option>
                          <option value="In Progress">🟡 In Progress</option>
                          <option value="Scheduled Viewing">🟣 Scheduled Viewing</option>
                          <option value="Closed">⚫ Closed Deal</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Archive inquiry from ${lead.buyerName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs cursor-pointer"
                          title="Archive Lead"
                        >
                          <Trash2 size={13} />
                        </button>
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

export default Leads;
