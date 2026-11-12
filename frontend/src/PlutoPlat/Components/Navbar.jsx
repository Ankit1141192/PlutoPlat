import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Heart, Search, Bell, User, Globe, ArrowUpRight, LogOut, FileText,
  ChevronDown, Sparkles, Calendar, Clock, Users, KeyRound, TrendingUp, ChevronRight,
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Properties', path: '/properties' },
  { label: 'Buy', path: '/properties?purpose=Buy' },
  { label: 'Rent', path: '/properties?purpose=Rent' },
  { label: 'About', path: '/about' },
  // { label: 'Testimonials', path: '/testimonials' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

const currencies = [
  { code: 'INR', label: 'INR (₹)' },
  { code: 'AED', label: 'AED (د.إ)' },
  { code: 'USD', label: 'USD ($)' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { favorites, currency, setCurrency, user, logout, notifications } = usePropertyStore();
  const unreadNotifsCount = (notifications || []).filter((n) => n.isUnread !== false && !n.read).length;

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  /* scroll state */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close menus on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  /* close user menu on outside click / Escape */
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setUserMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  /* lock page scroll while the mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  const isActive = (item) => {
    if (item.path === '/') return location.pathname === '/';
    const [base, query] = item.path.split('?');
    if (!location.pathname.startsWith(base)) return false;
    if (query) return location.search.includes(query);
    // "Properties" shouldn't stay active when Buy / Rent filter is selected
    if (base === '/properties') return !/purpose=(Buy|Rent)/.test(location.search);
    return true;
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const accountItems = [
    { to: '/profile', label: 'My profile', icon: User },
    { to: '/my-enquiries', label: 'Enquiries', icon: FileText, badge: 'Track', tone: 'green' },
    { to: '/favorites', label: 'Saved properties', icon: Heart, count: favorites.length },
    { to: '/scheduled-visits', label: 'Property visits', icon: Calendar },
    { to: '/notifications', label: 'Notifications', icon: Bell, dot: unreadNotifsCount > 0 },
    { to: '/recently-viewed', label: 'Recently viewed', icon: Clock },
    { to: '/contact-agents', label: 'Contact agents', icon: Users },
    { to: '/deals', label: 'Deal tracker', icon: TrendingUp, badge: '7 steps', tone: 'gold' },
    { to: '/change-password', label: 'Change password', icon: KeyRound },
  ];

  const badgeTone = {
    green: 'bg-[#10B981]/15 text-[#0E8F63]',
    gold: 'bg-[#B49A70]/20 text-[#8C7146]',
  };

  const iconBtn = `relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
    isTransparent
      ? 'text-white hover:bg-white/15'
      : 'text-[#1C201C] hover:bg-[#F1EDE3] hover:text-[#9A7F52]'
  }`;

  const Avatar = ({ size = 'h-8 w-8', text = 'text-xs' }) =>
    user?.avatar ? (
      <img src={user.avatar} alt={user.name} className={`${size} rounded-full border border-[#B49A70] object-cover`} />
    ) : (
      <span className={`${size} ${text} flex items-center justify-center rounded-full bg-gradient-to-br from-[#D9C49B] to-[#B49A70] font-bold uppercase text-[#1C201C]`}>
        {user?.name?.charAt(0) || 'U'}
      </span>
    );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'border-b border-white/10 bg-gradient-to-b from-black/40 to-transparent py-3 lg:py-4'
            : 'border-b border-[#E4DFD4] bg-white/90 py-2.5 shadow-[0_8px_30px_-18px_rgba(28,32,28,0.35)] backdrop-blur-xl lg:py-3'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="shrink-0 focus:outline-none" aria-label="PlutoPlat Home">
            <span
              className={`font-serif text-[26px] font-normal tracking-tight transition-colors md:text-3xl ${
                isTransparent ? 'text-white' : 'text-[#1C201C]'
              }`}
            >
              Pluto<span className="text-[#B49A70]">Plat</span>
              <span className="text-[#B49A70]">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map((item) => {
              const active = isActive(item);
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={`group relative px-3.5 py-2 text-sm font-medium transition-colors ${
                    isTransparent
                      ? active
                        ? 'font-semibold text-white'
                        : 'text-white/80 hover:text-white'
                      : active
                      ? 'font-semibold text-[#1C201C]'
                      : 'text-[#6E6D66] hover:text-[#1C201C]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-gradient-to-r from-[#C9B287] to-[#B49A70] transition-all duration-300 ease-out origin-left ${
                      active
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-active:scale-x-100 group-active:opacity-100'
                    }`}
                  />
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {/* Currency */}
            <label
              className={`mr-1 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                isTransparent ? 'border-white/25 text-white' : 'border-[#E4DFD4] text-[#222522]'
              }`}
            >
              <Globe size={14} className={isTransparent ? 'text-white/70' : 'text-[#9A7F52]'} />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="cursor-pointer bg-transparent focus:outline-none"
                title="Select currency"
                aria-label="Select currency"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white text-black">
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <Link to="/search" className={iconBtn} title="Search" aria-label="Search">
              <Search size={18} />
            </Link>

            <Link to="/notifications" className={iconBtn} title="Notifications" aria-label="Notifications">
              <Bell size={18} />
              {unreadNotifsCount > 0 && (
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#B49A70] ring-2 ring-white/80" />
              )}
            </Link>

            <Link to="/favorites" className={iconBtn} title="Saved properties" aria-label="Saved properties">
              <Heart size={18} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C74747] px-1 text-[10px] font-bold text-white shadow">
                  {favorites.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors ${
                    isTransparent
                      ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#E4DFD4] bg-[#F8F6F2] text-[#1C201C] hover:bg-white'
                  }`}
                >
                  <Avatar />
                  <span className="hidden max-w-[90px] truncate text-sm font-semibold xl:inline">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 max-h-[calc(100vh-110px)] w-80 overflow-y-auto rounded-2xl border border-[#E4DFD4] bg-white p-2 shadow-[0_30px_70px_-20px_rgba(28,32,28,0.45)]"
                  >
                    <div className="mb-1.5 rounded-xl bg-gradient-to-br from-[#1C201C] to-[#2B3029] p-4 text-white">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-[#D9C49B]">
                          <Sparkles size={13} /> {user.tier || 'Private client'}
                        </span>
                        <span className="rounded-full bg-[#10B981]/20 px-2 py-0.5 text-[10px] font-semibold text-[#5EE0B0]">
                          Active
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Avatar size="h-11 w-11" text="text-base" />
                        <div className="min-w-0">
                          <div className="truncate font-serif text-base">{user.name}</div>
                          <div className="truncate text-xs text-white/60">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    {accountItems.map(({ to, label, icon: Icon, badge, tone, count, dot }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-[#1C201C] transition-colors hover:bg-[#F8F6F2]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EDE3] text-[#9A7F52] transition-colors group-hover:bg-[#B49A70] group-hover:text-white">
                          <Icon size={16} />
                        </span>
                        <span className="flex-1">{label}</span>
                        {badge && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeTone[tone]}`}>{badge}</span>
                        )}
                        {count > 0 && (
                          <span className="rounded-full bg-[#C74747] px-1.5 py-0.5 text-[10px] font-bold text-white">{count}</span>
                        )}
                        {dot && <span className="h-2 w-2 animate-pulse rounded-full bg-[#B49A70]" />}
                      </Link>
                    ))}

                    <div className="my-1.5 border-t border-[#EAE6DE]" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-[#C74747] transition-colors hover:bg-[#FDF2F2]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF2F2]">
                        <LogOut size={16} />
                      </span>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-1 flex items-center gap-2">
                <Link
                  to="/login"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isTransparent ? 'text-white hover:bg-white/15' : 'text-[#1C201C] hover:bg-[#F1EDE3]'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C9B287] to-[#B49A70] px-5 py-2.5 text-sm font-semibold text-[#161916] shadow-md transition hover:brightness-110"
                >
                  Let's start <ArrowUpRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile / tablet actions */}
          <div className="flex items-center lg:hidden">
            <Link to="/search" className={iconBtn} aria-label="Search">
              <Search size={20} />
            </Link>
            <Link to="/favorites" className={iconBtn} aria-label="Saved properties">
              <Heart size={20} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C74747] px-1 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={iconBtn}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── Mobile drawer ───────── */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${mobileMenuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* panel */}
        <aside
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-[#F8F6F2] shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* top bar */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-serif text-2xl text-[#1C201C]">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1C201C] shadow-sm"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {/* user card */}
            {user && (
              <div className="rounded-2xl bg-gradient-to-br from-[#1C201C] to-[#2B3029] p-4 text-white">
                <div className="flex items-center gap-3">
                  <Avatar size="h-12 w-12" text="text-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-base">{user.name}</div>
                    <div className="truncate text-xs text-white/60">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D9C49B]">
                  <Sparkles size={13} /> {user.tier || 'Private client'}
                </div>
              </div>
            )}

            {/* main links */}
            <nav className="mt-4 space-y-1" aria-label="Main">
              {navLinks.map((item) => {
                const active = isActive(item);
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex min-h-12 items-center justify-between rounded-xl px-4 font-serif text-lg transition-colors ${
                      active ? 'bg-white text-[#1C201C] shadow-sm' : 'text-[#3F433E] active:bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          active ? 'bg-gradient-to-r from-[#C9B287] to-[#B49A70]' : 'bg-transparent'
                        }`}
                      />
                      <span className="relative">
                        {item.label}
                        <span
                          className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#C9B287] to-[#B49A70] transition-all duration-300 ease-out origin-left ${
                            active
                              ? 'scale-x-100 opacity-100'
                              : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-active:scale-x-100 group-active:opacity-100'
                          }`}
                        />
                      </span>
                    </span>
                    <ChevronRight size={16} className="text-[#B9B4A6]" />
                  </NavLink>
                );
              })}
            </nav>

            {/* account shortcuts */}
            <div className="mt-5">
              <p className="mb-2 px-1 text-xs font-semibold text-[#9A7F52]">
                {user ? 'Your account' : 'Quick links'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(user
                  ? accountItems
                  : accountItems.filter((i) => i.to === '/favorites' || i.to === '/my-enquiries')
                ).map(({ to, label, icon: Icon, count, dot }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex min-h-[72px] flex-col justify-between rounded-xl border border-[#E4DFD4] bg-white p-3 text-[13px] font-medium leading-tight text-[#1C201C] transition-colors active:bg-[#F1EDE3]"
                  >
                    <Icon size={18} className="text-[#B49A70]" />
                    <span className="mt-2">{label}</span>
                    {count > 0 && (
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-[#C74747] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {count}
                      </span>
                    )}
                    {dot && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#B49A70]" />}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* currency */}
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold text-[#9A7F52]">
                <Globe size={13} /> Currency
              </p>
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#EDE8DC] p-1">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                      currency === c.code ? 'bg-white text-[#1C201C] shadow' : 'text-[#6E6D66]'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* bottom actions */}
          <div className="space-y-2.5 border-t border-[#E4DFD4] bg-[#F8F6F2] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#C74747]/30 bg-white text-sm font-semibold text-[#C74747]"
              >
                <LogOut size={16} /> Log out
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C9B287] to-[#B49A70] text-sm font-semibold text-[#161916] shadow-md"
                >
                  Let's start <ArrowUpRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-[#1C201C] text-sm font-semibold text-[#1C201C]"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;