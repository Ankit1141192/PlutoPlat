import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Heart, Search, Bell, User, Globe, ShieldCheck, 
  ArrowUpRight, LogOut, FileText, ChevronDown, Sparkles 
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { favorites, currency, setCurrency, user, logout } = usePropertyStore();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Determine navbar styling depending on scroll position and route
  const isTransparent = isHome && !isScrolled;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'Buy', path: '/properties?purpose=Buy' },
    { label: 'Rent', path: '/properties?purpose=Rent' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent py-5 border-b border-white/10'
            : 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-[#DEDAD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 group focus:outline-none"
            aria-label="PlutoPlat Home"
          >
            <span
              className={`font-serif text-2xl md:text-3xl font-normal tracking-tight transition-colors ${
                isTransparent ? 'text-white' : 'text-[#1C201C]'
              }`}
            >
              Pluto<span className="text-[#B49A70] font-semibold">Plat</span>
              <span className="text-[#B49A70] text-xl">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => {
                  const active =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path.split('?')[0]) &&
                        (!item.path.includes('?') || location.search.includes(item.path.split('?')[1]));

                  if (isTransparent) {
                    return `text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#E8D9BF] ${
                      active ? 'text-[#E8D9BF] border-b border-[#B49A70] pb-1' : 'text-[#EBE7DF]'
                    }`;
                  } else {
                    return `text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#B49A70] ${
                      active ? 'text-[#1C201C] border-b-2 border-[#1C201C] pb-1 font-semibold' : 'text-[#6E6D66]'
                    }`;
                  }
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Elements */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Currency Selector */}
            <div className="flex items-center gap-1 text-xs">
              <Globe
                size={14}
                className={isTransparent ? 'text-white/60' : 'text-[#77766E]'}
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`bg-transparent text-xs uppercase font-medium focus:outline-none cursor-pointer pr-1 ${
                  isTransparent ? 'text-white' : 'text-[#222522]'
                }`}
                title="Select Currency"
              >
                <option value="INR" className="text-black bg-white">INR (₹)</option>
                <option value="AED" className="text-black bg-white">AED (د.إ)</option>
                <option value="USD" className="text-black bg-white">USD ($)</option>
              </select>
            </div>

            {/* Global Search Button */}
            <Link
              to="/search"
              className={`p-2 rounded-full transition-colors ${
                isTransparent
                  ? 'text-white hover:text-[#B49A70] hover:bg-white/10'
                  : 'text-[#222522] hover:text-[#B49A70] hover:bg-[#F8F6F2]'
              }`}
              title="Search Archive"
            >
              <Search size={17} />
            </Link>

            {/* Intelligence Briefings */}
            <Link
              to="/notifications"
              className={`relative p-2 rounded-full transition-colors ${
                isTransparent
                  ? 'text-white hover:text-[#B49A70] hover:bg-white/10'
                  : 'text-[#222522] hover:text-[#B49A70] hover:bg-[#F8F6F2]'
              }`}
              title="Intelligence Briefings"
            >
              <Bell size={17} />
              <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-[#B49A70] rounded-full ring-2 ring-white" />
            </Link>

            {/* Saved Properties / Favorites */}
            <Link
              to="/favorites"
              className={`relative p-2 rounded-full transition-colors ${
                isTransparent
                  ? 'text-white hover:text-[#B49A70] hover:bg-white/10'
                  : 'text-[#222522] hover:text-[#C74747] hover:bg-[#F8F6F2]'
              }`}
              title="Saved Properties"
            >
              <Heart size={17} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C74747] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Conditionally rendered User Account or Sign In + Let's Start */}
            {user ? (
              /* User Logo / Avatar Menu when logged in */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border transition-all cursor-pointer shadow-sm ${
                    isTransparent
                      ? 'bg-[#1C201C]/80 hover:bg-[#1C201C] border-[#B49A70]/50 text-white'
                      : 'bg-[#F8F6F2] hover:bg-white border-[#DDD8CE] text-[#1C201C]'
                  }`}
                  title="My Account"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#B49A70]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#B49A70] text-[#1C201C] flex items-center justify-center font-bold text-xs uppercase">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold max-w-[90px] truncate hidden md:inline">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-[#B49A70] transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DDD8CE] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2.5 border-b border-[#EAE6DE] mb-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#B49A70] flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>{user.tier || 'Private Member'}</span>
                      </div>
                      <div className="font-serif text-sm font-semibold text-[#1C201C] truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-[#77766E] truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C201C] hover:bg-[#F8F6F2] hover:text-[#B49A70] rounded-xl transition-colors"
                    >
                      <User size={15} className="text-[#B49A70]" />
                      <span>Profile & Dossier</span>
                    </Link>

                    <Link
                      to="/my-enquiries"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C201C] hover:bg-[#F8F6F2] hover:text-[#B49A70] rounded-xl transition-colors"
                    >
                      <FileText size={15} className="text-[#B49A70]" />
                      <span>My Enquiries</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#1C201C] hover:bg-[#F8F6F2] hover:text-[#B49A70] rounded-xl transition-colors"
                    >
                      <Heart size={15} className="text-[#B49A70]" />
                      <span>Saved Properties ({favorites.length})</span>
                    </Link>

                    <div className="border-t border-[#EAE6DE] my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C74747] hover:bg-[#FDF2F2] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out / Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* When not logged in: Sign In + Let's Start button */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                    isTransparent ? 'text-white hover:text-[#E8D9BF]' : 'text-[#222522] hover:text-[#B49A70]'
                  }`}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Let's Start</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/search"
              className={`p-2 ${isTransparent ? 'text-white' : 'text-[#1C201C]'}`}
            >
              <Search size={18} />
            </Link>

            <Link
              to="/favorites"
              className={`relative p-2 ${isTransparent ? 'text-white' : 'text-[#1C201C]'}`}
            >
              <Heart size={18} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#C74747] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xs focus:outline-none ${
                isTransparent ? 'text-white' : 'text-[#1C201C]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-[#F8F6F2] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#DEDAD1]">
                <span className="font-serif text-2xl font-normal text-[#1C201C]">
                  Pluto<span className="text-[#B49A70]">Plat</span>.
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#6E6D66] hover:text-[#1C201C]"
                >
                  <X size={22} />
                </button>
              </div>

              {/* User badge if logged in */}
              {user && (
                <div className="mt-4 p-3.5 bg-white border border-[#E5E0D8] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#B49A70] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif text-sm font-semibold text-[#1C201C] truncate">{user.name}</div>
                      <div className="text-[10px] text-[#8E8B82] truncate">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="p-1.5 text-[#C74747] hover:bg-[#FDF2F2] rounded-lg"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              <div className="flex flex-col py-4 space-y-3">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className="text-base font-serif text-[#1C201C] hover:text-[#B49A70] py-1 border-b border-[#EAE6DE]"
                  >
                    {item.label}
                  </NavLink>
                ))}

                <NavLink
                  to="/favorites"
                  className="text-base font-serif text-[#1C201C] hover:text-[#B49A70] py-1 border-b border-[#EAE6DE] flex items-center justify-between"
                >
                  <span>Saved Collection</span>
                  <span className="text-xs bg-[#B49A70] text-white px-2 py-0.5 rounded-full font-sans">
                    {favorites.length}
                  </span>
                </NavLink>

                <NavLink
                  to="/my-enquiries"
                  className="text-base font-serif text-[#1C201C] hover:text-[#B49A70] py-1 border-b border-[#EAE6DE] flex items-center justify-between"
                >
                  <span>Active Enquiries</span>
                  <span className="text-xs text-[#287A50] font-sans font-semibold">Active</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  className="text-base font-serif text-[#1C201C] hover:text-[#B49A70] py-1 border-b border-[#EAE6DE]"
                >
                  Client Dossier & Profile
                </NavLink>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#DEDAD1]">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-3 bg-[#1C201C] text-white text-xs uppercase tracking-wider font-semibold rounded-xl text-center"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full block text-center py-3 border border-[#1C201C] text-[#1C201C] text-xs uppercase tracking-wider font-semibold rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full block text-center py-3 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-sm"
                  >
                    Let's Start
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
