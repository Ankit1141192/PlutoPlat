import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  Users,
  ShieldCheck,
  CreditCard,
  History,
  ExternalLink,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const SuperAdminLayout = ({ children, title = 'SuperAdmin Control Panel' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, properties, leads } = useSuperAdminStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingApprovalsCount = (properties || []).filter(p => !p.verified || p.status === 'pending').length;
  const newLeadsCount = (leads || []).filter(l => l.status === 'New').length;

  const navLinks = [
    {
      name: 'Platform Overview',
      path: '/',
      altPath: '/superadmin',
      icon: LayoutDashboard,
    },
    {
      name: 'Property Verifications',
      path: '/properties',
      altPath: '/superadmin/properties',
      icon: Building2,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pending` : null,
      badgeColor: 'bg-[#B49A70] text-[#121612]',
    },
    {
      name: 'Client Inquiries',
      path: '/leads',
      altPath: '/superadmin/leads',
      icon: Inbox,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      name: 'Users & Agents Directory',
      path: '/users',
      altPath: '/superadmin/users',
      icon: Users,
    },
    {
      name: 'Membership Plans',
      path: '/subscriptions',
      altPath: '/superadmin/subscriptions',
      icon: CreditCard,
    },
    {
      name: 'Security & Audit Logs',
      path: '/audits',
      altPath: '/superadmin/audits',
      icon: History,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'JB';

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col md:flex-row text-[#1C201C] selection:bg-[#B49A70] selection:text-white">
      {/* Desktop Luxury Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[#101411] to-[#161B16] text-[#E8E5DF] shrink-0 border-r border-[#262E27] relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#B49A70]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="p-6 border-b border-[#262E27]/80 relative z-10">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl text-white tracking-tight">
              Pluto<span className="text-[#D9C49B]">Plat</span>.
            </span>
          </Link>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9C49B] bg-[#B49A70]/20 px-2.5 py-0.5 rounded-full border border-[#B49A70]/30">
              SuperAdmin HQ
            </span>
            <span className="text-[11px] text-[#8E8B82]">Root Control</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto relative z-10">
          <div className="px-3 mb-2 text-[10px] uppercase font-semibold tracking-wider text-[#737068]">
            Governance
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isHome = item.path === '/';
            const isActive = isHome
              ? location.pathname === '/' || location.pathname === '/superadmin' || location.pathname === '/superadmin/dashboard'
              : location.pathname === item.path || location.pathname === item.altPath || location.pathname.startsWith(item.path + '/');

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#B49A70] text-[#121612] font-semibold shadow-sm'
                    : 'text-[#B8B4AA] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-[#121612]' : 'text-[#8E8B82]'} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-white/10 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Portals Switcher */}
        <div className="p-3 border-t border-[#262E27]/80 space-y-1 relative z-10">
          <div className="px-3 mb-1 text-[10px] uppercase font-semibold tracking-wider text-[#737068]">
            Cross Platform
          </div>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#B8B4AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ArrowRightLeft size={14} className="text-[#B49A70]" />
              <span>Agent Portal (5174)</span>
            </div>
            <ExternalLink size={12} className="text-[#737068]" />
          </a>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#B8B4AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink size={14} className="text-[#B49A70]" />
              <span>Buyer Website (5173)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Live</span>
          </a>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-[#262E27] bg-[#0E120F] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#B49A70] text-[#121612] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ring-2 ring-[#B49A70]/30">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Julian Beaumont'}</p>
              <p className="text-[10px] text-[#B49A70] truncate flex items-center gap-1">
                <ShieldCheck size={11} /> SuperAdmin Owner
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-[#8E8B82] hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#101411] text-white p-4 flex items-center justify-between border-b border-[#262E27]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl">Pluto<span className="text-[#D9C49B]">Plat</span>.</span>
          <span className="text-[10px] bg-[#B49A70] text-[#121612] px-2 py-0.5 font-bold rounded-full">
            SuperAdmin HQ
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-1.5 rounded-lg hover:bg-white/10"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101411] text-white p-4 border-b border-[#262E27] space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl text-sm hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#B49A70] text-[#121612] font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#262E27] flex items-center justify-between">
            <div className="text-xs text-[#8E8B82]">Owner: {user?.name || 'Julian Beaumont'}</div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-[#E8E3D8] px-6 md:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl md:text-2xl text-[#1C201C] font-normal tracking-tight">{title}</h1>
            <p className="text-xs text-[#6E6D66] mt-0.5">Global Platform Governance, Moderation & Security Authority</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E3D8] text-xs text-[#6E6D66]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platform Active</span>
            </div>

            {/* Quick Moderation link */}
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#1C201C] text-white hover:bg-[#B49A70] hover:text-[#121612] rounded-xl transition-all duration-200 shadow-sm"
            >
              <Building2 size={15} />
              <span>Review Properties</span>
              {pendingApprovalsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#B49A70] text-[#121612] rounded-full text-[10px] font-bold">
                  {pendingApprovalsCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
