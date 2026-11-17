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
  Eye,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';

const Leads = () => {
  const { user, leads, updateLeadStatus } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  // Filter leads to this agent's properties or general enquiries
  const myLeads = useMemo(() => {
    return (leads || []).map((l) => {
      const isCompleted = String(l.status).toLowerCase() === 'completed';
      return {
        ...l,
        status: isCompleted ? 'Completed' : 'Incompleted',
      };
    });
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return myLeads.filter((l) => {
      if (statusFilter === 'completed' && l.status !== 'Completed') return false;
      if (statusFilter === 'incompleted' && l.status !== 'Incompleted') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (l.buyerName || l.name || '').toLowerCase().includes(q);
        const matchesEmail = (l.buyerEmail || l.email || '').toLowerCase().includes(q);
        const matchesPhone = (l.buyerPhone || l.phone || '').toLowerCase().includes(q);
        const matchesProp = (l.propertyTitle || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesProp) return false;
      }
      return true;
    });
  }, [myLeads, statusFilter, searchQuery]);

  const totalCount = myLeads.length;
  const incompletedCount = myLeads.filter((l) => l.status === 'Incompleted').length;
  const completedCount = myLeads.filter((l) => l.status === 'Completed').length;

  const handleToggleStatus = (lead) => {
    const nextStatus = lead.status === 'Completed' ? 'Incompleted' : 'Completed';
    updateLeadStatus(lead.id || lead._id, nextStatus);
    if (selectedLead && (selectedLead.id === lead.id || selectedLead._id === lead._id)) {
      setSelectedLead((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  return (
    <AdminLayout title="Client Inquiries & Consultations">
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Client Inquiries & Contact Requests</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Check enquiries from website clients. Review incoming requests and mark them as Completed or Incompleted.
          </p>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#1C201C] text-white border-[#1C201C] shadow-md'
                : 'bg-white border-[#E8E3D8] hover:border-[#B49A70]'
            }`}
          >
            <p className={`text-xs font-medium ${statusFilter === 'all' ? 'text-white/70' : 'text-[#6E6D66]'}`}>
              Total Inquiries
            </p>
            <p className="font-serif text-2xl font-bold mt-1">{totalCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter('incompleted')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'incompleted'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                : 'bg-white border-[#E8E3D8] hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs font-medium ${statusFilter === 'incompleted' ? 'text-white/80' : 'text-[#6E6D66]'}`}>
                Incompleted (Pending)
              </p>
              <Clock size={16} className={statusFilter === 'incompleted' ? 'text-white' : 'text-amber-600'} />
            </div>
            <p className="font-serif text-2xl font-bold mt-1">{incompletedCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter('completed')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                : 'bg-white border-[#E8E3D8] hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs font-medium ${statusFilter === 'completed' ? 'text-white/80' : 'text-[#6E6D66]'}`}>
                Completed
              </p>
              <CheckCircle2 size={16} className={statusFilter === 'completed' ? 'text-white' : 'text-emerald-600'} />
            </div>
            <p className="font-serif text-2xl font-bold mt-1">{completedCount}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or subject..."
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
              <option value="all">All Inquiries ({totalCount})</option>
              <option value="incompleted">Incompleted ({incompletedCount})</option>
              <option value="completed">Completed ({completedCount})</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Ref / Date</th>
                  <th className="py-4 px-5">Prospective Client</th>
                  <th className="py-4 px-5">Subject / Property</th>
                  <th className="py-4 px-5">Message Brief</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#6E6D66]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Inbox size={28} className="mx-auto text-[#B49A70]/50" />
                        <p className="font-serif text-base text-[#1C201C]">No inquiries found</p>
                        <p className="text-[11px] text-[#8A887F]">
                          When clients submit inquiries or contact messages, they will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isDone = lead.status === 'Completed';
                    return (
                      <tr key={lead.id || lead._id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-4 px-5 text-xs text-[#6E6D66]">
                          <p className="font-mono text-[11px] font-semibold text-[#1C201C]">{lead.id || lead._id}</p>
                          <p className="text-[10px] text-[#8A887F] mt-0.5">{lead.date}</p>
                        </td>

                        <td className="py-4 px-5">
                          <p className="font-semibold text-sm text-[#1C201C] font-serif">{lead.buyerName || lead.name}</p>
                          <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-[#6E6D66]">
                            {(lead.buyerPhone || lead.phone) && (
                              <span className="flex items-center gap-1">
                                <Phone size={11} className="text-[#8A887F]" />
                                {lead.buyerPhone || lead.phone}
                              </span>
                            )}
                            {(lead.buyerEmail || lead.email) && (
                              <span className="flex items-center gap-1">
                                <Mail size={11} className="text-[#8A887F]" />
                                {lead.buyerEmail || lead.email}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <p className="font-medium text-xs text-[#B49A70] flex items-center gap-1">
                            <Building2 size={13} className="shrink-0" />
                            <span>{lead.propertyTitle || 'General Contact Enquiry'}</span>
                          </p>
                          {lead.budget && (
                            <span className="text-[10px] text-[#8A887F] block mt-0.5">Budget: {lead.budget}</span>
                          )}
                        </td>

                        <td className="py-4 px-5 max-w-xs text-xs text-[#6E6D66]">
                          <p className="line-clamp-2 italic font-light">"{lead.message}"</p>
                        </td>

                        {/* Status Display: Completed vs Incompleted */}
                        <td className="py-4 px-5 text-center">
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock size={12} className="text-amber-600" />
                              Incompleted
                            </span>
                          )}
                        </td>

                        {/* Action: Toggle Completed / Incompleted + View */}
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 text-[#8A887F] hover:text-[#1C201C] hover:bg-[#FAF8F5] rounded-lg border border-[#E8E3D8] transition-colors cursor-pointer"
                              title="View full enquiry"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(lead)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                                isDone
                                  ? 'bg-white border border-[#DDD8CE] text-[#6E6D66] hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                                  : 'bg-[#1C201C] text-white hover:bg-[#2C302C] hover:shadow'
                              }`}
                              title={isDone ? 'Mark as Incompleted' : 'Mark as Completed'}
                            >
                              {isDone ? 'Mark Incompleted' : 'Complete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Enquiry Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D8] bg-[#FAF8F5]">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C] font-semibold">Enquiry Details</h3>
                  <p className="text-[11px] font-mono text-[#8A887F]">{selectedLead.id || selectedLead._id} • {selectedLead.date}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 text-[#8A887F] hover:text-[#1C201C] rounded-lg hover:bg-[#EAE6DE] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A887F] tracking-wider block mb-1">
                    Client Details
                  </label>
                  <div className="bg-[#FBFAF7] p-3 rounded-xl border border-[#DDD8CE] space-y-1">
                    <p className="font-semibold text-sm text-[#1C201C] font-serif">{selectedLead.buyerName || selectedLead.name}</p>
                    <p className="flex items-center gap-2 text-[#6E6D66]">
                      <Mail size={13} className="text-[#8A887F]" />
                      <span>{selectedLead.buyerEmail || selectedLead.email || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2 text-[#6E6D66]">
                      <Phone size={13} className="text-[#8A887F]" />
                      <span>{selectedLead.buyerPhone || selectedLead.phone || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A887F] tracking-wider block mb-1">
                    Property / Inquiry Subject
                  </label>
                  <div className="bg-[#FBFAF7] p-3 rounded-xl border border-[#DDD8CE]">
                    <p className="font-medium text-[#1C201C]">{selectedLead.propertyTitle || 'General Contact Enquiry'}</p>
                    {selectedLead.budget && (
                      <p className="text-[11px] text-[#8A887F] mt-0.5">Budget: {selectedLead.budget}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8A887F] tracking-wider block mb-1">
                    Message / Client Requirements
                  </label>
                  <div className="bg-[#FBFAF7] p-3 rounded-xl border border-[#DDD8CE]">
                    <p className="text-[#1C201C] whitespace-pre-wrap leading-relaxed">"{selectedLead.message}"</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[11px] text-[#8A887F] block mb-0.5">Current Status</span>
                    {selectedLead.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock size={13} /> Incompleted
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleStatus(selectedLead)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                      selectedLead.status === 'Completed'
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {selectedLead.status === 'Completed' ? 'Mark as Incompleted' : 'Mark as Completed'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Leads;
