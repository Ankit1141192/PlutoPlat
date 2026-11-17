import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Phone,
  Mail,
  Calendar,
  Building2,
  Trash2,
  Edit2,
  Eye,
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
  const { leads, updateLeadStatus, updateLead, deleteLead, addLead } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    propertyTitle: '',
    budget: '',
    message: '',
    status: 'Incompleted'
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    propertyTitle: '',
    budget: '',
    message: '',
    status: 'Incompleted'
  });

  // Normalize leads to Completed / Incompleted
  const normalizedLeads = useMemo(() => {
    return (leads || []).map((l) => {
      const isCompleted = String(l.status).toLowerCase() === 'completed';
      return {
        ...l,
        status: isCompleted ? 'Completed' : 'Incompleted',
      };
    });
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return normalizedLeads.filter((l) => {
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
  }, [normalizedLeads, statusFilter, searchQuery]);

  const totalCount = normalizedLeads.length;
  const incompletedCount = normalizedLeads.filter((l) => l.status === 'Incompleted').length;
  const completedCount = normalizedLeads.filter((l) => l.status === 'Completed').length;

  const handleToggleStatus = (lead) => {
    const nextStatus = lead.status === 'Completed' ? 'Incompleted' : 'Completed';
    updateLeadStatus(lead.id || lead._id, nextStatus);
    if (selectedLead && (selectedLead.id === lead.id || selectedLead._id === lead._id)) {
      setSelectedLead((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  const handleOpenEdit = (lead) => {
    setEditFormData({
      id: lead.id || lead._id,
      name: lead.buyerName || lead.name || '',
      email: lead.buyerEmail || lead.email || '',
      phone: lead.buyerPhone || lead.phone || '',
      propertyTitle: lead.propertyTitle || '',
      budget: lead.budget || lead.propertyPrice || '',
      message: lead.message || '',
      status: lead.status === 'Completed' ? 'Completed' : 'Incompleted',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.name.trim()) return;

    await updateLead(editFormData.id, {
      name: editFormData.name.trim(),
      buyerName: editFormData.name.trim(),
      email: editFormData.email.trim(),
      buyerEmail: editFormData.email.trim(),
      phone: editFormData.phone.trim(),
      buyerPhone: editFormData.phone.trim(),
      propertyTitle: editFormData.propertyTitle.trim(),
      budget: editFormData.budget.trim(),
      message: editFormData.message.trim(),
      status: editFormData.status,
    });

    setIsEditModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Client Name,Email,Phone,Subject / Property,Status,Date']
        .concat(
          normalizedLeads.map(
            (l) =>
              `"${l.id || l._id}","${l.buyerName || l.name}","${l.buyerEmail || l.email}","${l.buyerPhone || l.phone}","${l.propertyTitle}","${l.status}","${l.date}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PlutoPlat_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SuperAdminLayout title="Global Leads & Enquiry Management">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Platform Inquiries & Leads Matrix</h2>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Comprehensive feed of all enquiries generated across PlutoPlat with full CRUD control.
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

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or property..."
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

        {/* Leads Table */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Ref / Date</th>
                  <th className="py-4 px-5">Prospective Client</th>
                  <th className="py-4 px-5">Target Property / Subject</th>
                  <th className="py-4 px-5">Enquiry Brief</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-right">CRUD Actions</th>
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
                  filteredLeads.map((lead) => {
                    const isDone = lead.status === 'Completed';
                    return (
                      <tr key={lead.id || lead._id} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* Ref & Date */}
                        <td className="py-4 px-5 font-mono text-xs text-[#6E6D66]">
                          <span className="font-semibold text-[#1C201C]">{lead.id || lead._id}</span>
                          <p className="text-[10px] text-[#8A887F] mt-0.5">{lead.date}</p>
                        </td>

                        {/* Buyer */}
                        <td className="py-4 px-5">
                          <p className="font-serif text-sm font-semibold text-[#1C201C]">{lead.buyerName || lead.name}</p>
                          <div className="flex flex-col text-[11px] text-[#6E6D66] mt-1 space-y-0.5">
                            {(lead.buyerEmail || lead.email) && (
                              <span className="flex items-center gap-1.5">
                                <Mail size={11} className="text-[#8A887F]" />
                                {lead.buyerEmail || lead.email}
                              </span>
                            )}
                            {(lead.buyerPhone || lead.phone) && (
                              <span className="flex items-center gap-1.5">
                                <Phone size={11} className="text-[#8A887F]" />
                                {lead.buyerPhone || lead.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Property */}
                        <td className="py-4 px-5">
                          <p className="font-medium text-xs text-[#B49A70] truncate max-w-xs">{lead.propertyTitle || 'General Contact Enquiry'}</p>
                          {lead.budget && (
                            <span className="text-[10px] text-[#8A887F] block mt-0.5">Budget: {lead.budget}</span>
                          )}
                        </td>

                        {/* Message */}
                        <td className="py-4 px-5 max-w-xs">
                          <p className="text-xs text-[#6E6D66] line-clamp-2 italic font-light">
                            "{lead.message}"
                          </p>
                        </td>

                        {/* Status Toggle & Badge */}
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => handleToggleStatus(lead)}
                            className="cursor-pointer transition-transform hover:scale-105"
                            title="Click to toggle Complete / Incomplete"
                          >
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                                <CheckCircle2 size={12} className="text-emerald-600" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-xs">
                                <Clock size={12} className="text-amber-600" />
                                Incompleted
                              </span>
                            )}
                          </button>
                        </td>

                        {/* Full CRUD Actions: View (R), Edit (U), Delete (D) */}
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View Details */}
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 text-[#8A887F] hover:text-[#1C201C] hover:bg-[#FAF8F5] rounded-lg border border-[#E8E3D8] transition-colors cursor-pointer"
                              title="View full enquiry"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit Inquiry (CRUD: Update) */}
                            <button
                              onClick={() => handleOpenEdit(lead)}
                              className="p-1.5 text-[#8A887F] hover:text-[#B49A70] hover:bg-[#FAF8F5] rounded-lg border border-[#E8E3D8] transition-colors cursor-pointer"
                              title="Edit Inquiry Details"
                            >
                              <Edit2 size={14} />
                            </button>

                            {/* Delete Inquiry (CRUD: Delete) */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Permanently delete inquiry from ${lead.buyerName || lead.name}?`)) {
                                  deleteLead(lead.id || lead._id);
                                }
                              }}
                              className="p-1.5 text-[#8A887F] hover:text-red-600 hover:bg-red-50 rounded-lg border border-[#E8E3D8] transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
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
                  <h3 className="font-serif text-lg text-[#1C201C] font-semibold">Enquiry Dossier</h3>
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
                    Client Information
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
                    Subject / Target Property
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
                    Client Requirements / Message
                  </label>
                  <div className="bg-[#FBFAF7] p-3 rounded-xl border border-[#DDD8CE]">
                    <p className="text-[#1C201C] whitespace-pre-wrap leading-relaxed">"{selectedLead.message}"</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[11px] text-[#8A887F] block mb-0.5">Status</span>
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedLead(null);
                        handleOpenEdit(selectedLead);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#DDD8CE] text-[#1C201C] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleToggleStatus(selectedLead)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                        selectedLead.status === 'Completed'
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800'
                      }`}
                    >
                      {selectedLead.status === 'Completed' ? 'Mark Incompleted' : 'Mark Completed'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log Inquiry Modal (CRUD: Create) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D8] bg-[#FAF8F5]">
                <h3 className="font-serif text-lg text-[#1C201C] font-semibold">Log Inward Client Inquiry</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#8A887F] hover:text-[#1C201C] rounded-lg hover:bg-[#EAE6DE] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formData.buyerName.trim()) return;
                  await addLead({
                    ...formData,
                    name: formData.buyerName,
                    email: formData.buyerEmail,
                    phone: formData.buyerPhone,
                  });
                  setFormData({
                    buyerName: '',
                    buyerEmail: '',
                    buyerPhone: '',
                    propertyTitle: '',
                    budget: '',
                    message: '',
                    status: 'Incompleted'
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
                    placeholder="e.g. Eleanor Roosevelt"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Target Property / Subject</label>
                    <input
                      type="text"
                      value={formData.propertyTitle}
                      onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                      placeholder="e.g. The Imperial Villa / Acquisition"
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Budget Range</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. ₹5 Cr - ₹10 Cr"
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Inquiry / Requirements Brief</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Buyer requirements or inquiry details..."
                    className="w-full p-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] cursor-pointer"
                  >
                    <option value="Incompleted">⏳ Incompleted</option>
                    <option value="Completed">✓ Completed</option>
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

        {/* Edit Inquiry Modal (CRUD: Update) */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3D8] bg-[#FAF8F5]">
                <h3 className="font-serif text-lg text-[#1C201C] font-semibold">Edit Inquiry Details</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-[#8A887F] hover:text-[#1C201C] rounded-lg hover:bg-[#EAE6DE] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Prospective Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Phone</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Target Property / Subject</label>
                    <input
                      type="text"
                      value={editFormData.propertyTitle}
                      onChange={(e) => setEditFormData({ ...editFormData, propertyTitle: e.target.value })}
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C201C] mb-1">Budget</label>
                    <input
                      type="text"
                      value={editFormData.budget}
                      onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                      className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Message / Requirements Brief</label>
                  <textarea
                    rows={3}
                    value={editFormData.message}
                    onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                    className="w-full p-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C201C] mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full h-10 px-3 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] cursor-pointer"
                  >
                    <option value="Incompleted">⏳ Incompleted</option>
                    <option value="Completed">✓ Completed</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E3D8]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#6E6D66] hover:bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#1C201C] text-[#FAF8F5] rounded-xl hover:bg-[#2C302C] transition-colors cursor-pointer"
                  >
                    Update Inquiry
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
