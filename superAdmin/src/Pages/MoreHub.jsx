import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  History,
  User,
  Bell,
  CreditCard,
  MessageSquareQuote,
  Database,
  ArrowUpRight,
  Plus,
  Sliders,
  Sparkles,
  Server,
  Activity,
  Layers,
  FileDown,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const DEFAULT_CORE_PAGES = [
  {
    id: 'core-audit',
    title: 'Audit Logs & Governance Ledger',
    category: 'Security & Compliance',
    description: 'Review tamper-proof audit trails for property approvals, user role changes, lockout incidents, and executive console logins.',
    path: '/audits',
    icon: History,
    badge: 'System Logs',
    badgeColor: 'bg-amber-500/10 text-amber-700 border border-amber-200',
    actionText: 'Open Audit Ledger',
  },
  {
    id: 'core-profile',
    title: 'SuperAdmin Executive Profile',
    category: 'Identity & Access',
    description: 'Manage root credentials, platform signature, phone number, executive headquarters location, and security settings.',
    path: '/profile',
    icon: User,
    badge: 'Owner Profile',
    badgeColor: 'bg-[#B49A70]/15 text-[#7D6741] border border-[#B49A70]/30',
    actionText: 'Manage Profile',
  },
  {
    id: 'core-notif',
    title: 'Notification & Broadcast Center',
    category: 'Real-Time Communications',
    description: 'Dispatch instant alerts, breaking off-market arrivals, and administrative notices to User, Admin, or Both panels via Socket.IO.',
    path: '/notifications',
    icon: Bell,
    badge: 'Socket.IO Engine',
    badgeColor: 'bg-blue-500/10 text-blue-700 border border-blue-200',
    actionText: 'Broadcast Notice',
  },
  {
    id: 'core-subscriptions',
    title: 'Agent Membership & Tiers',
    category: 'Monetization & Plans',
    description: 'Configure agent subscription pricing, verified partner privileges, featured listing allowances, and billing cycles.',
    path: '/subscriptions',
    icon: CreditCard,
    badge: 'Revenue Model',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200',
    actionText: 'Configure Plans',
  },
  {
    id: 'core-testimonials',
    title: 'Client Endorsements & Reviews',
    category: 'Social Proof',
    description: 'Moderate high-net-worth client reviews, homeowner testimonials, and buyer recommendations displayed across the public portal.',
    path: '/testimonials',
    icon: MessageSquareQuote,
    badge: 'Market Reputation',
    badgeColor: 'bg-purple-500/10 text-purple-700 border border-purple-200',
    actionText: 'Review Testimonials',
  },
];

const MoreHub = () => {
  const { properties, leads, usersList, auditLogs } = useSuperAdminStore();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Dynamic user-defined custom pages that can be added later
  const [customPages, setCustomPages] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_superadmin_custom_pages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newPage, setNewPage] = useState({
    title: '',
    description: '',
    path: '',
    category: 'Custom Extensions',
    badge: 'Beta Extension'
  });

  const handleAddPage = (e) => {
    e.preventDefault();
    if (!newPage.title || !newPage.path) return;

    const item = {
      id: `ext-${Date.now()}`,
      title: newPage.title.trim(),
      description: newPage.description.trim() || 'Custom extension page configured by SuperAdmin.',
      path: newPage.path.trim().startsWith('/') ? newPage.path.trim() : `/${newPage.path.trim()}`,
      category: newPage.category.trim() || 'Custom Modules',
      badge: newPage.badge.trim() || 'Active Slot',
      badgeColor: 'bg-[#B49A70]/15 text-[#7D6741] border border-[#B49A70]/30',
      actionText: 'Explore Module',
      isCustom: true
    };

    const updated = [...customPages, item];
    setCustomPages(updated);
    try {
      localStorage.setItem('plutoplat_superadmin_custom_pages', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setNewPage({
      title: '',
      description: '',
      path: '',
      category: 'Custom Extensions',
      badge: 'Beta Extension'
    });
    setModalOpen(false);
  };

  const handleDeleteCustomPage = (id) => {
    const updated = customPages.filter(p => p.id !== id);
    setCustomPages(updated);
    try {
      localStorage.setItem('plutoplat_superadmin_custom_pages', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportSystemData = () => {
    const dataDump = {
      exportedAt: new Date().toISOString(),
      platform: 'PlutoPlat Luxury Real Estate Ecosystem',
      governance: 'SuperAdmin Root Console',
      metrics: {
        totalProperties: properties.length,
        totalLeads: leads.length,
        totalUsers: usersList.length,
        totalAuditEvents: auditLogs.length,
      },
      properties,
      users: usersList.map(u => ({ ...u, password: '[REDACTED]' })),
      leads,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(dataDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plutoplat-system-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <SuperAdminLayout title="Platform Operations, Extensions & More">
      <div className="space-y-8 pb-12">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101411] via-[#1C201C] to-[#252C26] p-7 md:p-9 text-white border border-[#2E352F] shadow-lg">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B49A70]/20 border border-[#B49A70]/40 text-[#D9C49B] text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Platform Operations & Custom Hub</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-[#F3F0EA]">
              Extended Governance & Modular Page Controls
            </h1>
            <p className="text-xs md:text-sm text-[#C9C5BB] leading-relaxed">
              Consolidated suite for system telemetry, security audit ledgers, executive credentials, 
              and dynamic extension slots. Add or integrate new platform pages directly into your SuperAdmin hub anytime.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#D9C49B]">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Socket.IO Engine & MongoDB v3 API Online</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportSystemData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition border border-white/15 cursor-pointer"
              >
                <FileDown size={14} />
                <span>{downloadSuccess ? 'Backup Downloaded!' : 'Export Platform Data'}</span>
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#B49A70] hover:bg-[#C5AD85] text-[#121612] rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <Plus size={15} />
                <span>Add More Page / Slot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section: Platform Diagnostics & Health Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#8A887F] mb-1">
              <span>Catalog Assets</span>
              <Database size={15} className="text-[#B49A70]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#1C201C]">{properties.length}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Live sync enabled</p>
          </div>

          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#8A887F] mb-1">
              <span>Inquiries Tracked</span>
              <Activity size={15} className="text-[#B49A70]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#1C201C]">{leads.length}</p>
            <p className="text-[11px] text-[#7D6741] mt-0.5">Real-time buyer intake</p>
          </div>

          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#8A887F] mb-1">
              <span>Active Accounts</span>
              <Server size={15} className="text-[#B49A70]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#1C201C]">{usersList.length}</p>
            <p className="text-[11px] text-[#6E6D66] mt-0.5">Users & Verified Agents</p>
          </div>

          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#8A887F] mb-1">
              <span>Audit Ledger Events</span>
              <History size={15} className="text-[#B49A70]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#1C201C]">{auditLogs.length}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Tamper-proof telemetry</p>
          </div>
        </div>

        {/* Section: Core Platform Extensions (Moved from Sidebar + Added Modules) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl text-[#1C201C]">Platform Governance & Operation Pages</h2>
              <p className="text-xs text-[#6E6D66]">
                Core administrative modules including audit logs, executive profile, and real-time broadcast controls.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEFAULT_CORE_PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <div
                  key={page.id}
                  className="bg-white border border-[#E8E3D8] rounded-2xl p-5 shadow-sm hover:border-[#B49A70]/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] flex items-center justify-center text-[#B49A70] group-hover:bg-[#1C201C] group-hover:text-white transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${page.badgeColor}`}>
                        {page.badge}
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8A887F]">{page.category}</p>
                      <h3 className="font-serif text-base font-semibold text-[#1C201C] mt-0.5 group-hover:text-[#7D6741] transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-xs text-[#6E6D66] mt-1.5 line-clamp-3 leading-relaxed">
                        {page.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="text-[11px] text-[#A9A69B] font-mono">{page.path}</span>
                    <Link
                      to={page.path}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C201C] group-hover:text-[#B49A70] transition-colors"
                    >
                      <span>{page.actionText}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Dynamic Custom Pages Added by User */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl text-[#1C201C]">Custom Extensions & Future Pages</h2>
              <p className="text-xs text-[#6E6D66]">
                Slots configured for future panel features, analytics dashboards, or custom API tools.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD8CE] hover:border-[#B49A70] text-[#1C201C] text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Custom Page Slot</span>
            </button>
          </div>

          {customPages.length === 0 ? (
            <div className="bg-[#FAF8F5] border border-dashed border-[#DDD8CE] rounded-2xl p-8 text-center space-y-2">
              <Layers size={32} className="mx-auto text-[#B49A70]/60" />
              <p className="font-serif text-base text-[#1C201C]">No custom pages added yet</p>
              <p className="text-xs text-[#8A887F] max-w-md mx-auto">
                Need to mount an additional report, legal registry page, or external webhook tool? Click below to add your page link or route slot.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C201C] text-white text-xs font-semibold rounded-xl hover:bg-[#B49A70] hover:text-[#121612] transition cursor-pointer"
              >
                <Plus size={14} /> Create Page Slot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white border border-[#E8E3D8] rounded-2xl p-5 shadow-sm hover:border-[#B49A70]/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E3D8] flex items-center justify-center text-[#B49A70]">
                        <Sliders size={18} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B49A70]/15 text-[#7D6741] border border-[#B49A70]/30">
                          {page.badge}
                        </span>
                        <button
                          onClick={() => handleDeleteCustomPage(page.id)}
                          className="p-1 text-[#A9A69B] hover:text-red-600 rounded transition"
                          title="Remove custom page slot"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8A887F]">{page.category}</p>
                      <h3 className="font-serif text-base font-semibold text-[#1C201C] mt-0.5">
                        {page.title}
                      </h3>
                      <p className="text-xs text-[#6E6D66] mt-1.5 line-clamp-3 leading-relaxed">
                        {page.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="text-[11px] text-[#A9A69B] font-mono">{page.path}</span>
                    <Link
                      to={page.path}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D6741] hover:text-[#1C201C] transition-colors"
                    >
                      <span>{page.actionText || 'Open Page'}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Add More Page */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE6DE] mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">Add More Page Slot</h3>
                  <p className="text-xs text-[#6E6D66]">Register a new page route or custom platform module.</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#8A887F] hover:text-[#1C201C] p-1 rounded-lg hover:bg-[#FAF8F5] transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddPage} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3F433E] uppercase tracking-wider mb-1">
                    Page Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Legal Escrow Registry"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    className="h-10 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3 text-xs text-[#1C201C] focus:border-[#B49A70] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F433E] uppercase tracking-wider mb-1">
                    Route Path <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /escrow or /custom-reports"
                    value={newPage.path}
                    onChange={(e) => setNewPage({ ...newPage, path: e.target.value })}
                    className="h-10 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3 text-xs text-[#1C201C] focus:border-[#B49A70] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3F433E] uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Legal & Escrow"
                      value={newPage.category}
                      onChange={(e) => setNewPage({ ...newPage, category: e.target.value })}
                      className="h-10 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3 text-xs text-[#1C201C] focus:border-[#B49A70] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3F433E] uppercase tracking-wider mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Feature"
                      value={newPage.badge}
                      onChange={(e) => setNewPage({ ...newPage, badge: e.target.value })}
                      className="h-10 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3 text-xs text-[#1C201C] focus:border-[#B49A70] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F433E] uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of this extra page..."
                    value={newPage.description}
                    onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                    className="w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] p-2.5 text-xs text-[#1C201C] focus:border-[#B49A70] focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#EAE6DE] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-2 border border-[#DDD8CE] rounded-xl text-xs font-semibold text-[#6E6D66] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Save Page Slot
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

export default MoreHub;
