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
  Download,
  Plus,
  X
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Leads = () => {
  const { leads, updateLeadStatus, deleteLead, addLead } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    propertyTitle: '',
    message: '',
    status: 'New'
  });

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
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Central Inquiries Matrix</h2>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Real-time feed of all buyer acquisition inquiries generated across the portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#1C201C] hover:bg-[#2C302C] text-[#FAF8F5] rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Plus size={15} className="text-[#B49A70]" />
              <span>Log Inquiry</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-white border border-[#E8E3D8] hover:bg-[#FAF8F5] text-[#1C201C] rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Download size={15} className="text-[#B49A70]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Filter by buyer name, email, or property title..."
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
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Ref / Date</th>
                  <th className="py-4 px-5">Prospective Client</th>
                  <th className="py-4 px-5">Target Property</th>
                  <th className="py-4 px-5">Enquiry Brief</th>
                  <th className="py-4 px-5">Pipeline Stage</th>
                  <th className="py-4 px-5 text-right">Actions</th>
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
                          No inquiries matched your search criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Ref & Date */}
                      <td className="py-4 px-5 font-mono text-xs text-[#6E6D66]">
                        <span className="font-semibold text-[#1C201C]">{lead.id}</span>
                        <p className="text-[10px] text-[#8A887F] mt-0.5">{lead.date}</p>
                      </td>

                      {/* Buyer */}
                      <td className="py-4 px-5">
                        <p className="font-serif text-sm font-semibold text-[#1C201C]">{lead.buyerName}</p>
                        <div className="flex flex-col text-[11px] text-[#6E6D66] mt-1 space-y-0.5">
                          <span className="flex items-center gap-1.5">
                            <Mail size={11} className="text-[#8A887F]" />
                            {lead.buyerEmail}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone size={11} className="text-[#8A887F]" />
                            {lead.buyerPhone}
                          </span>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="py-4 px-5">
                        <p className="font-medium text-xs text-[#B49A70] truncate max-w-xs">{lead.propertyTitle}</p>
                        <p className="text-[11px] text-[#8A887F] mt-0.5">
                          Agent: <strong className="text-[#1C201C]">{lead.agentName || 'Michael Sharma'}</strong>
                        </p>
                      </td>

                      {/* Message */}
                      <td className="py-4 px-5 max-w-xs">
                        <p className="text-xs text-[#6E6D66] line-clamp-2 italic font-light">
                          "{lead.message}"
                        </p>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-5">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="h-8 px-2.5 text-[11px] font-semibold rounded-full border border-[#DDD8CE] bg-[#FBFAF7] text-[#1C201C] focus:outline-none focus:border-[#B49A70] cursor-pointer"
                        >
                          <option value="New">🟢 New Inquiry</option>
                          <option value="Contacted">🔵 Contacted</option>
                          <option value="In Progress">🟡 In Progress</option>
                          <option value="Scheduled Viewing">🟣 Scheduled Viewing</option>
                          <option value="Closed">⚫ Closed Deal</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Archive inquiry from ${lead.buyerName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          className="p-1.5 text-[#8A887F] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Archive Lead"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Log Inquiry Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D8] bg-[#FAF8F5]">
                <h3 className="font-serif text-lg text-[#1C201C] font-semibold">Log Inward Client Inquiry</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#8A887F] hover:text-[#1C201C] rounded-lg hover:bg-[#EAE6DE] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formData.buyerName.trim()) return;
                  await addLead(formData);
                  setFormData({
                    buyerName: '',
                    buyerEmail: '',
                    buyerPhone: '',
                    propertyTitle: '',
                    message: '',
                    status: 'New'
                  });
                  setIsModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Prospective Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    placeholder="e.g. Rahul Kapoor"
                    className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.buyerEmail}
                      onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                      placeholder="client@example.com"
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.buyerPhone}
                      onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Target Property</label>
                  <input
                    type="text"
                    value={formData.propertyTitle}
                    onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                    placeholder="e.g. Royal Greens Penthouse"
                    className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Inquiry / Requirements Brief</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Buyer looking for high floor with park view..."
                    className="w-full p-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Initial Pipeline Stage</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  >
                    <option value="New">🟢 New Inquiry</option>
                    <option value="Contacted">🔵 Contacted</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Scheduled Viewing">🟣 Scheduled Viewing</option>
                    <option value="Closed">⚫ Closed Deal</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E3D8]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#6E6D66] hover:bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#1C201C] text-[#FAF8F5] rounded-xl hover:bg-[#2C302C] transition-colors cursor-pointer"
                  >
                    Save Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default Leads;
