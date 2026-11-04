import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Phone,
  Mail,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';

const Leads = () => {
  const { user, leads, updateLeadStatus } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter leads to this agent's properties
  const myLeads = useMemo(() => {
    return leads.filter(
      (l) => l.agentEmail === user?.email || l.agentName === user?.name || user?.role === 'admin'
    );
  }, [leads, user]);

  const filteredLeads = useMemo(() => {
    return myLeads.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = l.buyerName?.toLowerCase().includes(q);
        const matchesProp = l.propertyTitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesProp) return false;
      }
      return true;
    });
  }, [myLeads, statusFilter, searchQuery]);

  return (
    <AdminLayout title="Buyer Inquiries & Leads">
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-lg text-[#1C201C]">Inquiries on Your Property Portfolio</h2>
          <p className="text-xs text-[#6E6D66]">
            Qualified private client inquiries routed directly to your agent desk.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 border border-[#DDD8CE] rounded-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766E]" />
            <input
              type="text"
              placeholder="Search by buyer name or property title..."
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
              <option value="all">All Stages ({myLeads.length})</option>
              <option value="New">New Inquiries</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled Viewing">Scheduled Viewing</option>
              <option value="Closed">Closed Deals</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#DDD8CE] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#DDD8CE] text-[10px] uppercase font-bold tracking-wider text-[#6E6D66]">
                  <th className="py-3 px-4">Ref / Date</th>
                  <th className="py-3 px-4">Prospective Buyer</th>
                  <th className="py-3 px-4">Property Inquired</th>
                  <th className="py-3 px-4">Message Brief</th>
                  <th className="py-3 px-4 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#6E6D66]">
                      No inquiries found for your listings.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F8F6F2] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6D66]">
                        <span className="font-semibold text-[#1C201C]">{lead.id}</span>
                        <p className="text-[10px] text-[#8E8B82] mt-0.5">{lead.date}</p>
                      </td>

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

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-[#1C201C]">{lead.propertyTitle}</p>
                        <p className="text-[10px] text-[#8E8B82]">{lead.propertyLocation}</p>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-[11px] text-[#6E6D66] line-clamp-2 italic">
                          "{lead.message}"
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-xs border border-[#DDD8CE] bg-white focus:outline-none"
                        >
                          <option value="New">🟢 New</option>
                          <option value="Contacted">🔵 Contacted</option>
                          <option value="In Progress">🟡 In Progress</option>
                          <option value="Scheduled Viewing">🟣 Scheduled Viewing</option>
                          <option value="Closed">⚫ Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Leads;
