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
  ChevronDown,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useAdminStore } from '../context/AdminContext';

const AdminLayout = ({ children, title = 'Agent & Partner Workstation' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole, properties, leads } = useAdminStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Filter properties owned by this agent
  const myProperties = (properties || []).filter(
    (p) => p.ownerEmail === user?.email || p.ownerName === user?.name || user?.role === 'admin' || user?.role === 'super_admin'
  );
  const myPendingCount = myProperties.filter((p) => !p.verified || p.status === 'pending').length;

  // Filter leads on this agent's properties
  const myLeads = (leads || []).filter(
    (l) => l.agentEmail === user?.email || l.agentName === user?.name || user?.role === 'admin' || user?.role === 'super_admin'
  );
  const newLeadsCount = myLeads.filter((l) => l.status === 'New').length;

  const navLinks = [
    {
      name: 'Agent Dashboard',
      path: '/',
      altPath: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'My Listed Properties',
      path: '/properties',
      altPath: '/admin/properties',
      icon: Building2,
      badge: myPendingCount > 0 ? `${myPendingCount} under review` : null,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      name: 'Client Inquiries',
      path: '/leads',
      altPath: '/admin/leads',
      icon: Inbox,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      name: 'Notifications',
      path: '/notifications',
      altPath: '/admin/notifications',
      icon: Bell,
    },
    {
      name: 'My Agent Profile',
      path: '/profile',
      altPath: '/admin/profile',
      icon: User,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'MS';

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col md:flex-row text-[#1C201C]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1E231E] text-[#E8E5DF] shrink-0 border-r border-[#2C332C]">
        {/* Brand */}
        <div className="p-6 border-b border-[#2C332C]">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-light text-white tracking-tight">
              Pluto<span className="text-[#B49A70] font-normal">Plat</span>.
            </span>
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49A70] bg-[#B49A70]/15 px-2 py-0.5 rounded-2xs border border-[#B49A70]/30">
              Partner Desk
            </span>
            <span className="text-[10px] text-[#8E8B82]">Seller / Agent</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isHome = item.path === '/';
            const isActive = isHome
              ? location.pathname === '/' || location.pathname === '/admin' || location.pathname === '/admin/dashboard'
              : location.pathname === item.path || location.pathname === item.altPath || location.pathname.startsWith(item.path + '/');

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#B49A70] text-[#141714] font-semibold shadow-xs'
                    : 'text-[#B0ACA2] hover:bg-[#282F28] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-[#141714]' : 'text-[#8E8B82]'} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-[#3A443A] text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Links & Portals */}
        <div className="p-3 border-t border-[#2C332C] space-y-1">
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#B0ACA2] hover:text-white hover:bg-[#282F28] rounded-xs transition-colors"
          >
            <ArrowRightLeft size={14} className="text-[#B49A70]" />
            <span>SuperAdmin Portal (5175)</span>
          </a>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#B0ACA2] hover:text-white hover:bg-[#282F28] rounded-xs transition-colors"
          >
            <ExternalLink size={14} className="text-[#B49A70]" />
            <span>Buyer Website (5173)</span>
          </a>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-[#2C332C] bg-[#161A16] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#B49A70] text-[#141714] font-serif font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Michael Sharma'}</p>
              <p className="text-[10px] text-[#B49A70] truncate">Verified Agent / Broker</p>
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
      <header className="md:hidden bg-[#1E231E] text-white p-4 flex items-center justify-between border-b border-[#2C332C]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl">Pluto<span className="text-[#B49A70]">Plat</span></span>
          <span className="text-[10px] bg-[#B49A70] text-[#141714] px-1.5 py-0.5 font-bold rounded-2xs">Admin Desk</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-1 hover:text-[#B49A70]"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E231E] text-white p-4 border-b border-[#2C332C] space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded-xs text-sm hover:bg-[#282F28]"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#B49A70] text-black font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 text-sm text-red-400 hover:bg-[#282F28] rounded-xs pt-4 border-t border-[#2C332C]"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#DDD8CE] px-6 py-3.5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl text-[#1C201C] font-normal">{title}</h1>
            <p className="text-[11px] text-[#6E6D66]">Seller & Broker Listing Management Workstation</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Add Listing */}
            <Link
              to="/properties"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#B49A70] text-white hover:bg-[#9E865F] rounded-xs transition-colors shadow-2xs"
            >
              <PlusCircle size={14} />
              <span>Submit Property</span>
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

export default AdminLayout;
