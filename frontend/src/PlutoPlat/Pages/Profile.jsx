import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, ShieldCheck, Heart, Phone, MapPin, Building,
  KeyRound, FileText, CheckCircle2, Edit3, Save, X,
  ExternalLink, Award, LogOut, Mail, Briefcase, ChevronRight,
  Camera, Upload
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';
import { WhatsAppIcon } from '../Components/RegisterInterestModal';

const TABS = [
  { id: 'dossier', label: 'Dossier', long: 'Client Dossier', icon: User },
  { id: 'mandate', label: 'Mandate', long: 'Acquisition Mandate', icon: Building },
  { id: 'saved', label: 'Saved', long: 'Saved Portfolio', icon: Heart },
  { id: 'security', label: 'Security', long: 'Security & Legal NDA', icon: ShieldCheck },
  { id: 'advisor', label: 'Advisor', long: 'Managing Desk', icon: Phone },
];

const inputCls =
  'w-full px-4 py-3 bg-white border border-[#DDD8CE] rounded-xl text-sm text-[#1C201C] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#B49A70]/50 focus:border-[#B49A70] ' +
  'disabled:bg-[#F3F0EA] disabled:text-[#555] disabled:cursor-not-allowed transition-colors';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-[#E6E1D6] rounded-2xl shadow-sm p-5 sm:p-8 ${className}`}>
    {children}
  </div>
);

const SectionHead = ({ kicker, title, children }) => (
  <div className="flex items-start justify-between gap-3 pb-5 mb-6 border-b border-[#EAE6DE]">
    <div className="min-w-0">
      <span className="text-[11px] font-semibold text-[#B49A70] block mb-1">{kicker}</span>
      <h3 className="font-serif text-xl sm:text-2xl text-[#1C201C] font-normal leading-snug">{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold text-[#6E6D66] mb-2">{label}</span>
    {children}
  </label>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, favorites, favoriteProperties, showToast } = usePropertyStore();

  const [activeTab, setActiveTab] = useState('dossier');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    entityName: 'Private Client Portfolio',
    title: 'Private Investor',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.location?.city || user?.city || '',
    memberSince: user?.memberSince || 'October 2024',
    tier: user?.tier || 'Sovereign Private Member',
    targetBudgetMin: '₹5,00,00,000',
    targetBudgetMax: '₹25,00,000,000',
    preferredLocations: ['Civil Lines Kanpur', 'Swaroop Nagar', 'VIP Road & Ganga', 'Tilak Nagar', 'Downtown Dubai'],
    preferredTypes: ['Palatial Mansions', 'Sky Penthouses', 'Waterfront Villas', 'Heritage Plots'],
    kycStatus: 'Accredited & Legally Verified',
    ndaStatus: 'Active Mutual NDA (#PLP-UP-2026-441)',
  });

  useEffect(() => {
    // If not authenticated and no token, redirect to login
    const token = localStorage.getItem('pluto_token');
    if (!user && !token) {
      navigate('/login', { replace: true, state: { from: '/profile' } });
      return;
    }

    if (token) {
      Api.getMe()
        .then((res) => {
          if (res?.data?.user) {
            const u = res.data.user;
            setFormData((prev) => ({
              ...prev,
              fullName: u.name || prev.fullName,
              email: u.email || prev.email,
              phone: u.phone || prev.phone,
              city: u.location?.city || prev.city,
            }));
            updateUser?.(u);
          }
        })
        .catch((err) => {
          if (err?.status === 401) {
            logout();
            navigate('/login');
          }
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.location?.city || user.city || prev.city,
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSaveProfile = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setIsEditing(false);

    try {
      const userId = user?._id || user?.id;
      if (userId && localStorage.getItem('pluto_token')) {
        await Api.updateUserProfile(userId, {
          name: formData.fullName,
          phone: formData.phone,
          location: { city: formData.city },
        });
      }

      if (updateUser) {
        updateUser({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          location: { ...(user?.location || {}), city: formData.city },
        });
      }
      showToast?.('Client dossier & acquisition preferences updated successfully.', 'success');
    } catch (err) {
      console.warn('Profile update error:', err);
      showToast?.(err.message || 'Failed to update profile.', 'error');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast?.('Please upload a valid image file (JPEG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showToast?.('Image size must be under 12MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Photo = reader.result;
      const userId = user?.id || user?._id;

      try {
        if (userId && localStorage.getItem('pluto_token')) {
          await Api.updateUserProfile(userId, {
            profileImage: base64Photo,
            avatar: base64Photo,
          });
        }
        if (updateUser) {
          updateUser({
            profileImage: base64Photo,
            avatar: base64Photo,
          });
        }
        showToast?.('Profile photo updated successfully!', 'success');
      } catch (err) {
        console.warn('Photo upload sync error:', err);
        showToast?.(err.message || 'Failed to update photo.', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // Header button: opens edit mode, or saves when already editing
  const handleHeaderEdit = () => {
    if (isEditing) handleSaveProfile();
    else {
      setActiveTab('dossier');
      setIsEditing(true);
    }
  };

  const tabLabel = (t) => (t.id === 'saved' ? `${t.label} (${favorites.length})` : t.label);

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ───────── Header banner ───────── */}
        <div className="bg-[#1C201C] text-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl border border-[#2E342E] mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#B49A70]/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-[#B49A70]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 sm:gap-6 min-w-0">
              <div className="relative shrink-0 group/avatar">
                {user?.avatar || user?.profileImage ? (
                  <img
                    src={user.avatar || user.profileImage}
                    alt={formData.fullName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#B49A70] shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#D4BE94] to-[#B49A70] text-[#1C201C] flex items-center justify-center font-serif text-4xl font-bold shadow-xl border-2 border-white/20">
                    {formData.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                
                {/* Hover overlay to change photo */}
                <label
                  htmlFor="avatar-file-input"
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-semibold tracking-wider"
                  title="Click to update photo"
                >
                  <Camera size={22} className="mb-0.5 text-[#E8D9BF]" />
                  <span>Update</span>
                </label>
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {/* Camera badge button */}
                <label
                  htmlFor="avatar-file-input"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#B49A70] hover:bg-[#9E865F] border-2 border-[#1C201C] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110"
                  title="Upload profile photo"
                >
                  <Camera size={14} className="text-white" />
                </label>
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#E8D9BF] bg-white/10 px-3 py-1 rounded-full mb-2 border border-[#B49A70]/40">
                  <Award size={12} className="text-[#B49A70]" />
                  <span>{formData.tier}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mb-1 break-words">
                  {formData.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-[#EBE7DF]/80 font-light mb-2 break-words">
                  {formData.entityName}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-[#A09D94]">
                  <span className="flex items-center gap-1 text-[#D4BE94]">
                    <MapPin size={12} /> {formData.city}
                  </span>
                  <span>Client code <strong className="text-white font-mono">{user?.id || '#PLP-8842'}</strong></span>
                  <span>Since {formData.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 lg:flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleHeaderEdit}
                className="px-5 py-3 bg-[#B49A70] hover:bg-[#9E865F] text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                <span>{isEditing ? 'Save changes' : 'Edit profile'}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-5 py-3 bg-white/10 hover:bg-[#C74747]/25 border border-white/20 hover:border-[#C74747]/60 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                title="Sign out"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Quick metrics */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
            <Link to="/favorites" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10">
              <Heart size={18} className="text-[#B49A70] mb-2" />
              <span className="block text-xl sm:text-2xl font-serif font-semibold">{favorites.length}</span>
              <span className="text-xs text-[#A09D94]">Saved properties</span>
            </Link>

            <Link to="/my-enquiries" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10">
              <FileText size={18} className="text-[#10B981] mb-2" />
              <span className="block text-xl sm:text-2xl font-serif font-semibold">3</span>
              <span className="text-xs text-[#A09D94]">Active enquiries</span>
            </Link>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <ShieldCheck size={18} className="text-[#B49A70] mb-2" />
              <span className="block text-sm sm:text-base font-semibold text-[#E8D9BF] leading-tight mt-1">NDA active</span>
              <span className="text-xs text-[#A09D94]">KYC verified</span>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Briefcase size={18} className="text-white/80 mb-2" />
              <span className="block text-sm sm:text-base font-semibold leading-tight mt-1">Aditya Srivastava</span>
              <span className="text-xs text-[#A09D94]">Your advisor, Kanpur</span>
            </div>
          </div>
        </div>

        {/* ───────── Body: sidebar (desktop) + content ───────── */}
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:items-start">

          {/* Mobile tab bar */}
          <div className="lg:hidden sticky top-[72px] z-20 -mx-4 px-4 py-3 mb-5 bg-[#F8F6F2]/95 backdrop-blur border-b border-[#DDD8CE]">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      active
                        ? 'bg-[#1C201C] text-white shadow'
                        : 'bg-white text-[#6E6D66] border border-[#DDD8CE]'
                    }`}
                  >
                    <Icon size={15} className={active ? 'text-[#B49A70]' : 'text-[#8E8B82]'} />
                    {tabLabel(t)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block sticky top-28">
            <nav className="bg-white border border-[#E6E1D6] rounded-2xl shadow-sm p-2">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-all ${
                      active
                        ? 'bg-[#1C201C] text-white'
                        : 'text-[#6E6D66] hover:bg-[#F8F6F2] hover:text-[#1C201C]'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-[#B49A70]' : 'text-[#8E8B82]'} />
                    <span className="flex-1">
                      {t.long}
                      {t.id === 'saved' ? ` (${favorites.length})` : ''}
                    </span>
                    <ChevronRight size={15} className={active ? 'text-[#B49A70]' : 'opacity-0'} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0">

            {/* Dossier */}
            {activeTab === 'dossier' && (
              <Card>
                <SectionHead kicker="Confidential record" title="Identity & verified details">
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-[#E8F8F3] text-[#00A884] border border-[#A7E6D1] px-3 py-1 rounded-full font-medium shrink-0">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </SectionHead>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full legal name">
                      <input type="text" disabled={!isEditing} value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Family office / entity name">
                      <input type="text" disabled={!isEditing} value={formData.entityName}
                        onChange={(e) => handleInputChange('entityName', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Email">
                      <input type="email" disabled={!isEditing} value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" disabled={!isEditing} value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Primary city / jurisdiction">
                      <input type="text" disabled={!isEditing} value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Acquisition role">
                      <input type="text" disabled readOnly value={user?.role || 'Principal Purchaser'} className={inputCls} />
                    </Field>
                  </div>

                  {isEditing ? (
                    <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-[#DDD8CE] rounded-xl text-sm font-semibold text-[#6E6D66] hover:bg-[#F8F6F2] flex items-center justify-center gap-2"
                      >
                        <X size={15} /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-[#B49A70] hover:bg-[#9E865F] text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                      >
                        <Save size={15} /> Save changes
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto px-6 py-3 border border-[#B49A70] text-[#8E7448] hover:bg-[#B49A70] hover:text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit3 size={15} /> Edit details
                    </button>
                  )}
                </form>
              </Card>
            )}

            {/* Mandate */}
            {activeTab === 'mandate' && (
              <Card className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold text-[#B49A70] block mb-1">Property criteria</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C201C] font-normal mb-2">
                    Acquisition mandate & investment parameters
                  </h3>
                  <p className="text-sm text-[#6E6D66] leading-relaxed max-w-2xl">
                    Your advisor curates off-market opportunities against these specifications across Kanpur, Uttar Pradesh and global markets.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-[#EAE6DE]">
                  <div className="p-5 bg-gradient-to-br from-[#1C201C] to-[#2B312B] rounded-2xl text-white">
                    <h4 className="text-xs text-[#A09D94] mb-2">Target investment allocation</h4>
                    <div className="font-serif text-lg sm:text-xl text-[#E8D9BF] font-semibold break-words">
                      {formData.targetBudgetMin} – {formData.targetBudgetMax}
                    </div>
                    <p className="text-xs text-[#A09D94] mt-2">Pre-cleared liquidity for immediate escrow dispatch.</p>
                  </div>

                  <div className="p-5 bg-[#F8F6F2] rounded-2xl border border-[#EAE6DE]">
                    <h4 className="text-xs text-[#6E6D66] mb-3">Preferred asset classes</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferredTypes.map((t) => (
                        <span key={t} className="px-3 py-1.5 bg-white border border-[#DDD8CE] text-[#1C201C] rounded-lg text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#F8F6F2] rounded-2xl border border-[#EAE6DE]">
                  <h4 className="text-xs text-[#6E6D66] mb-3">Preferred enclaves & territories</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredLocations.map((loc) => (
                      <span key={loc} className="px-3 py-1.5 bg-white border border-[#B49A70]/50 text-[#8E7448] rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#B49A70]" />
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Saved */}
            {activeTab === 'saved' && (
              <Card>
                <SectionHead kicker="Private collection" title="Your shortlisted estates">
                  <Link
                    to="/properties"
                    className="text-xs sm:text-sm font-semibold text-[#B49A70] hover:text-[#1C201C] flex items-center gap-1 shrink-0 pt-1"
                  >
                    <span>Browse all</span>
                    <ExternalLink size={13} />
                  </Link>
                </SectionHead>

                {favoriteProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {favoriteProperties.map((p) => (
                      <div key={p.id} className="border border-[#EAE6DE] rounded-2xl overflow-hidden bg-white flex flex-col group hover:border-[#B49A70] hover:shadow-md transition-all">
                        <div className="relative h-44 sm:h-48 overflow-hidden">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 left-3 bg-[#1C201C]/85 text-[#E8D9BF] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            {p.purpose}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-xs text-[#77766E] flex items-center gap-1 mb-1">
                              <MapPin size={12} className="text-[#B49A70]" /> {p.location}
                            </div>
                            <h4 className="font-serif text-base font-semibold text-[#1C201C] line-clamp-1 mb-1">{p.title}</h4>
                            <div className="text-base font-bold text-[#8E7448]">{p.price}</div>
                          </div>
                          <Link
                            to={`/property/${p.id}`}
                            className="mt-4 w-full py-2.5 bg-[#1C201C] hover:bg-black text-white text-sm font-semibold rounded-xl text-center block transition-colors"
                          >
                            View property
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#F3EEE3] flex items-center justify-center mx-auto mb-4">
                      <Heart size={28} className="text-[#B49A70]" />
                    </div>
                    <h4 className="font-serif text-lg text-[#1C201C] mb-1">No saved properties yet</h4>
                    <p className="text-sm text-[#6E6D66] max-w-sm mx-auto mb-6">
                      Tap the heart on any property to keep it here and share it with your advisor.
                    </p>
                    <Link
                      to="/properties"
                      className="inline-flex px-6 py-3 bg-[#B49A70] hover:bg-[#9E865F] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                    >
                      Explore properties
                    </Link>
                  </div>
                )}
              </Card>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <Card className="space-y-6">
                <div>
                  <span className="text-[11px] font-semibold text-[#B49A70] block mb-1">Institutional rigor</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C201C] font-normal mb-2">
                    Security credentials & escrow non-disclosure
                  </h3>
                  <p className="text-sm text-[#6E6D66] max-w-2xl">
                    PlutoPlat protects client identities and transaction terms under strict confidentiality protocols.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-[#EAE6DE]">
                  <div className="p-5 border border-[#DDD8CE] rounded-2xl bg-[#F8F6F2]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                        <ShieldCheck size={22} className="text-[#10B981]" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base text-[#1C201C] font-semibold">Institutional due diligence</h4>
                        <span className="text-xs text-[#10B981] font-semibold">Verified & accredited</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#6E6D66] font-light leading-relaxed">
                      Financial accreditation is on file with PlutoPlat Legal Escrow, giving you instant access to off-market dossiers.
                    </p>
                  </div>

                  <div className="p-5 border border-[#DDD8CE] rounded-2xl bg-[#F8F6F2]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[#B49A70]/15 flex items-center justify-center shrink-0">
                        <KeyRound size={22} className="text-[#B49A70]" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base text-[#1C201C] font-semibold">Mutual non-disclosure agreement</h4>
                        <span className="text-xs text-[#8E7448] font-semibold">Executed & active</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#6E6D66] font-light leading-relaxed break-words">
                      Reference: <span className="font-mono text-[#1C201C] text-xs">{formData.ndaStatus}</span>. Protects buyer and seller identities, floorplans and valuations.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#EAE6DE] flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="text-sm text-[#6E6D66]">
                    <strong className="text-[#1C201C] block mb-0.5">Password protection</strong>
                    <span>Last updated 14 days ago. Salted encryption active.</span>
                  </div>
                  <Link
                    to="/change-password"
                    className="px-6 py-3 bg-[#1C201C] hover:bg-[#B49A70] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <KeyRound size={15} className="text-[#B49A70]" />
                    <span>Change password</span>
                  </Link>
                </div>
              </Card>
            )}

            {/* Advisor */}
            {activeTab === 'advisor' && (
              <Card>
                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 mb-8 pb-8 border-b border-[#EAE6DE]">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
                    alt="Aditya Srivastava"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-[#B49A70] shadow-xl"
                  />
                  <div className="text-center md:text-left min-w-0">
                    <span className="text-xs font-semibold text-[#B49A70] block mb-1">Your dedicated senior managing director</span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1C201C] font-normal mb-1">Aditya Srivastava</h3>
                    <p className="text-sm text-[#77766E] mb-4">
                      Kanpur & UP Heritage Estates &bull; 16 years in prime markets
                    </p>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center md:items-start justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-[#555]">
                      <span className="flex items-center gap-2"><Phone size={14} className="text-[#B49A70]" /><strong className="text-[#1C201C]">+91 9956346155</strong></span>
                      <span className="flex items-center gap-2 break-all"><Mail size={14} className="text-[#B49A70]" /><strong className="text-[#1C201C]">kanpur@plutoplat.com</strong></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <a
                    href="tel:+919956346155"
                    className="p-4 bg-[#1C201C] text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone size={16} className="text-[#B49A70]" />
                    <span>Call advisor</span>
                  </a>

                  <a
                    href="https://wa.me/919956346155?text=Hello%20Aditya,%20I%20am%20reviewing%20my%20PlutoPlat%20Private%20Dossier%20and%20would%20like%20to%20consult%20on%20Kanpur%20estates."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-[#1EBE5A] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <WhatsAppIcon size={18} />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    to="/favorites"
                    className="p-4 border border-[#DDD8CE] text-[#1C201C] rounded-xl text-sm font-semibold hover:bg-[#F8F6F2] transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart size={16} className="text-[#C74747]" />
                    <span>Saved estates</span>
                  </Link>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;