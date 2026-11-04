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
  const { user, logout, switchRole, properties, leads } = useSuperAdminStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
      badgeColor: 'bg-[#B49A70] text-white',
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
      name: 'Security & Activity Logs',
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
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row text-[#1C201C]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#141714] text-[#E8E5DF] shrink-0 border-r border-[#262B26]">
        {/* Brand */}
        <div className="p-6 border-b border-[#262B26]">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-light text-white tracking-tight">
              Pluto<span className="text-[#B49A70] font-normal">Plat</span>.
            </span>
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49A70] bg-[#B49A70]/15 px-2 py-0.5 rounded-2xs border border-[#B49A70]/30">
              SuperAdmin HQ
            </span>
            <span className="text-[10px] text-[#8E8B82]">Owner Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
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
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xs transition-colors ${
                  isActive
                    ? 'bg-[#B49A70] text-[#141714] font-semibold shadow-xs'
                    : 'text-[#B0ACA2] hover:bg-[#1E231E] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#141714] text-[#B49A70]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cross-Portals */}
        <div className="p-3 border-t border-[#262B26] space-y-1">
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#B0ACA2] hover:text-white hover:bg-[#1E231E] rounded-xs transition-colors"
          >
            <ArrowRightLeft size={14} className="text-[#B49A70]" />
            <span>Agent Desk (5174)</span>
          </a>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#B0ACA2] hover:text-white hover:bg-[#1E231E] rounded-xs transition-colors"
          >
            <ExternalLink size={14} className="text-[#B49A70]" />
            <span>Buyer Website (5173)</span>
          </a>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-[#262B26] bg-[#0E110E] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#B49A70] text-[#141714] font-serif font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Julian Beaumont'}</p>
              <p className="text-[10px] text-[#B49A70] truncate">Website Owner & SuperAdmin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-[#8E8B82] hover:text-red-400 p-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#141714] text-white p-4 flex items-center justify-between border-b border-[#262B26]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl">Pluto<span className="text-[#B49A70]">Plat</span></span>
          <span className="text-[10px] bg-[#B49A70] text-[#141714] px-1.5 py-0.5 font-bold rounded-2xs">SuperAdmin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-1 hover:text-[#B49A70]"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141714] text-white p-4 border-b border-[#262B26] space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs rounded-xs text-[#B0ACA2] hover:bg-[#1E231E]"
            >
              <span>{item.name}</span>
              {item.badge && <span className="text-[10px] bg-[#B49A70] text-black px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#262B26] flex justify-between text-xs text-[#B0ACA2]">
            <a href="http://localhost:5174" target="_blank" rel="noreferrer">Agent Desk</a>
            <a href="http://localhost:5173" target="_blank" rel="noreferrer">Buyer Website</a>
            <button onClick={handleLogout} className="text-red-400">Logout</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#DDD8CE] px-6 py-3.5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl text-[#1C201C] font-normal">{title}</h1>
            <p className="text-[11px] text-[#6E6D66]">PlutoPlat Platform Governance & Master Controls</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Approvals Button */}
            {pendingApprovalsCount > 0 && (
              <Link
                to="/properties"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1C201C] text-white hover:bg-black rounded-xs transition-colors shadow-2xs"
              >
                <Clock size={13} className="text-[#B49A70]" />
                <span>Verify {pendingApprovalsCount} Listings</span>
              </Link>
            )}
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
