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
  Download,
  CalendarCheck
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
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Client Inquiries & Private Consultations</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Pre-qualified private client inquiries routed directly to your partner agent desk.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Search by buyer name or property title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full pl-10 pr-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 text-[#1C201C] placeholder:text-[#A9A69B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl text-[#1C201C] focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 cursor-pointer font-medium"
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
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Ref / Date</th>
                  <th className="py-4 px-5">Prospective Buyer</th>
                  <th className="py-4 px-5">Property Inquired</th>
                  <th className="py-4 px-5">Message Brief</th>
                  <th className="py-4 px-5 text-right">Stage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#6E6D66]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Inbox size={28} className="mx-auto text-[#B49A70]/50" />
                        <p className="font-serif text-base text-[#1C201C]">No inquiries in this category</p>
                        <p className="text-[11px] text-[#8A887F]">
                          When clients submit inquiries on your listed residences, they will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-4 px-5 text-xs text-[#6E6D66]">
                        <p className="font-mono text-[11px] font-semibold text-[#1C201C]">{lead.id}</p>
                        <p className="text-[10px] text-[#8A887F] mt-0.5">{lead.date}</p>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-semibold text-sm text-[#1C201C] font-serif">{lead.buyerName}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6E6D66]">
                          <span className="flex items-center gap-1"><Phone size={11} className="text-[#8A887F]" />{lead.buyerPhone}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Mail size={11} className="text-[#8A887F]" />{lead.buyerEmail}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <p className="font-medium text-xs text-[#B49A70] flex items-center gap-1">
                          <Building2 size={13} className="shrink-0" />
                          <span>{lead.propertyTitle}</span>
                        </p>
                      </td>

                      <td className="py-4 px-5 max-w-xs text-xs text-[#6E6D66]">
                        <p className="line-clamp-2 italic font-light">"{lead.message}"</p>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="h-8 px-2.5 text-[11px] font-semibold rounded-full border border-[#DDD8CE] bg-[#FBFAF7] text-[#1C201C] focus:outline-none focus:border-[#B49A70] cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Scheduled Viewing">Scheduled Viewing</option>
                          <option value="Closed">Closed</option>
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
