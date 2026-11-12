import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  Users,
  User,
  ShieldCheck,
  CreditCard,
  History,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import { useSuperAdminStore } from '../context/SuperAdminContext';

// Set these in .env (VITE_AGENT_URL, VITE_BUYER_SITE_URL); the localhost values are dev fallbacks
const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:5174';
const BUYER_SITE_URL = import.meta.env.VITE_BUYER_SITE_URL || 'http://localhost:5173';

const SuperAdminLayout = ({ children, title = 'SuperAdmin Control Panel' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, properties, leads, notifications } = useSuperAdminStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = (properties || []).filter((p) => !p.verified || p.status === 'pending').length;
  const newLeadsCount = (leads || []).filter((l) => l.status === 'New').length;
  const unreadNotifsCount = (notifications || []).filter((n) => !n.read && n.isUnread !== false).length;

  const navLinks = [
    { name: 'Overview', path: '/', altPath: '/superadmin', icon: LayoutDashboard },
    {
      name: 'Property approvals',
      path: '/properties',
      altPath: '/superadmin/properties',
      icon: Building2,
      badge: pendingCount > 0 ? `${pendingCount} pending` : null,
      badgeColor: 'bg-[#B49A70]/20 text-[#D9C49B]'
    },
    {
      name: 'Inquiries',
      path: '/leads',
      altPath: '/superadmin/leads',
      icon: Inbox,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    { name: 'Users & agents', path: '/users', altPath: '/superadmin/users', icon: Users },
    {
      name: 'Notifications & Broadcast',
      path: '/notifications',
      altPath: '/superadmin/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null,
      badgeColor: 'bg-[#B49A70] text-[#121612]'
    },
    { name: 'Testimonials', path: '/testimonials', altPath: '/superadmin/testimonials', icon: MessageSquareQuote },
    { name: 'Membership plans', path: '/subscriptions', altPath: '/superadmin/subscriptions', icon: CreditCard },
    { name: 'More & Extensions', path: '/more', altPath: '/superadmin/more', icon: MoreHorizontal }
  ];

  const isActive = (item) => {
    const p = location.pathname;
    if (item.path === '/') return p === '/' || p === '/superadmin' || p === '/superadmin/dashboard';
    return p === item.path || p === item.altPath || p.startsWith(item.path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A70]';

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    const active = isActive(item);
    return (
      <Link
        to={item.path}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors ${focus} ${
          active ? 'bg-[#B49A70] font-semibold text-[#121612]' : 'text-[#C9C5BB] hover:bg-white/5 hover:text-white'
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon size={18} className={active ? 'text-[#121612]' : 'text-[#8E8B82]'} />
          {item.name}
        </span>
        {item.badge && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? 'bg-[#121612]/15 text-[#121612]' : item.badgeColor}`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F6F2] text-[#1C201C] selection:bg-[#B49A70] selection:text-white md:flex-row">
      {/* Desktop sidebar. The gold top edge and "SuperAdmin" tag tell it apart from the agent desk */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#262E27] border-t-4 border-t-[#B49A70] bg-[#101411] text-[#E8E5DF] md:flex">
        <div className="border-b border-white/10 p-6">
          <Link to="/" className={`inline-block rounded ${focus}`}>
            <span className="font-serif text-2xl tracking-tight text-white">
              Pluto<span className="text-[#D9C49B]">Plat</span>.
            </span>
          </Link>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#B49A70]/20 px-2.5 py-0.5 text-xs font-semibold text-[#D9C49B]">
            <ShieldCheck size={12} /> SuperAdmin
          </p>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navLinks.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <a
            href={AGENT_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-[#B8B4AA] transition-colors hover:bg-white/5 hover:text-white ${focus}`}
          >
            Agent portal <ExternalLink size={13} className="text-[#737068]" />
          </a>
          <a
            href={BUYER_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-[#B8B4AA] transition-colors hover:bg-white/5 hover:text-white ${focus}`}
          >
            View public site <ExternalLink size={13} className="text-[#737068]" />
          </a>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-[#0C0F0D] p-4">
          <Link to="/profile" className={`flex min-w-0 items-center gap-3 rounded-lg transition-opacity hover:opacity-80 ${focus}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B49A70] font-serif text-sm font-bold text-[#121612]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name || 'SuperAdmin'}</p>
              <p className="truncate text-xs text-[#D9C49B]">Platform owner</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className={`cursor-pointer rounded-lg p-2 text-[#8E8B82] transition-colors hover:bg-white/5 hover:text-red-400 ${focus}`}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Mobile header + drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#262E27] border-t-4 border-t-[#B49A70] bg-[#101411] p-4 text-white md:hidden">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl">
            Pluto<span className="text-[#D9C49B]">Plat</span>.
          </span>
          <span className="rounded-full bg-[#B49A70]/20 px-2 py-0.5 text-xs font-semibold text-[#D9C49B]">SuperAdmin</span>
        </div>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={`rounded-lg p-2 hover:bg-white/10 ${focus}`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <div className="space-y-1 border-b border-[#262E27] bg-[#101411] p-3 md:hidden">
          {navLinks.map((item) => (
            <NavItem key={item.name} item={item} onClick={() => setMenuOpen(false)} />
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-white/10 px-3.5 pt-3">
            <span className="text-sm text-[#8E8B82]">{user?.name || 'SuperAdmin'}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 hidden items-center justify-between gap-4 border-b border-[#E8E3D8] bg-white/90 px-8 py-4 backdrop-blur-md md:flex">
          <p className="font-serif text-lg text-[#1C201C]">{title}</p>
          <Link
            to="/properties"
            className={`inline-flex items-center gap-2 rounded-xl bg-[#1C201C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B49A70] hover:text-[#121612] ${focus}`}
          >
            <Building2 size={16} /> Review properties
            {pendingCount > 0 && (
              <span className="rounded-full bg-[#B49A70] px-2 py-0.5 text-xs font-bold text-[#121612]">{pendingCount}</span>
            )}
          </Link>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;