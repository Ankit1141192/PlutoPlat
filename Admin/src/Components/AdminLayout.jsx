import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  Bell,
  User,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAdminStore } from '../context/AdminContext';

// Set these in .env (VITE_SUPERADMIN_URL, VITE_BUYER_SITE_URL); the localhost values are dev fallbacks
const SUPERADMIN_URL = import.meta.env.VITE_SUPERADMIN_URL || 'http://localhost:5175';
const BUYER_SITE_URL = import.meta.env.VITE_BUYER_SITE_URL || 'http://localhost:5173';

const AdminLayout = ({ children, title = 'Agent & Partner Workstation' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, properties, leads, notifications } = useAdminStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const seesAll = user?.role === 'admin' || user?.role === 'super_admin';

  const myProperties = (properties || []).filter(
    (p) => p.ownerEmail === user?.email || p.ownerName === user?.name || seesAll
  );
  const pendingCount = myProperties.filter((p) => !p.verified || p.status === 'pending').length;

  const myLeads = (leads || []).filter(
    (l) => l.agentEmail === user?.email || l.agentName === user?.name || seesAll
  );
  const newLeadsCount = myLeads.filter((l) => l.status === 'New').length;
  const unreadNotifsCount = (notifications || []).filter((n) => !n.read && n.isUnread !== false).length;

  const navLinks = [
    { name: 'Dashboard', path: '/', altPath: '/admin', icon: LayoutDashboard },
    {
      name: 'My properties',
      path: '/properties',
      altPath: '/admin/properties',
      icon: Building2,
      badge: pendingCount > 0 ? `${pendingCount} in review` : null,
      badgeColor: 'bg-[#B49A70]/20 text-[#D9C49B]'
    },
    {
      name: 'Inquiries',
      path: '/leads',
      altPath: '/admin/leads',
      icon: Inbox,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      name: 'Notifications',
      path: '/notifications',
      altPath: '/admin/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null,
      badgeColor: 'bg-[#B49A70] text-[#121612]'
    },
    { name: 'My profile', path: '/profile', altPath: '/admin/profile', icon: User }
  ];

  const isActive = (item) => {
    const p = location.pathname;
    if (item.path === '/') return p === '/' || p === '/admin' || p === '/admin/dashboard';
    return p === item.path || p === item.altPath || p.startsWith(item.path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AG';

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
      {/* Desktop sidebar: stays in view while the page scrolls */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#262E27] bg-[#101411] text-[#E8E5DF] md:flex">
        <div className="border-b border-white/10 p-6">
          <Link to="/" className={`inline-block rounded ${focus}`}>
            <span className="font-serif text-2xl tracking-tight text-white">
              Pluto<span className="text-[#D9C49B]">Plat</span>.
            </span>
          </Link>
          <p className="mt-1.5 text-sm text-[#8E8B82]">Partner desk</p>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navLinks.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <a
            href={SUPERADMIN_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-[#B8B4AA] transition-colors hover:bg-white/5 hover:text-white ${focus}`}
          >
            SuperAdmin portal <ExternalLink size={13} className="text-[#737068]" />
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
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B49A70] font-serif text-sm font-bold text-[#121612]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name || 'Agent'}</p>
              <p className="flex items-center gap-1 truncate text-xs text-[#D9C49B]">
                <ShieldCheck size={12} /> Verified agent
              </p>
            </div>
          </div>
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
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#262E27] bg-[#101411] p-4 text-white md:hidden">
        <span className="font-serif text-xl">
          Pluto<span className="text-[#D9C49B]">Plat</span>.
        </span>
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
            <span className="text-sm text-[#8E8B82]">{user?.name || 'Agent'}</span>
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
            <PlusCircle size={16} /> Add a property
          </Link>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;