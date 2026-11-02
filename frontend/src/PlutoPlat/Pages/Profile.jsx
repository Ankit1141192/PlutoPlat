import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, ShieldCheck, Heart, Mail, Phone, MapPin, Building, 
  KeyRound, Bell, FileText, CheckCircle2, Edit3, Save, Globe, 
  ExternalLink, Calendar, Award, LogOut, Sparkles, Clock, Check
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { WhatsAppIcon } from '../Components/RegisterInterestModal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, favorites, favoriteProperties, showToast, currency } = usePropertyStore();

  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'mandate' | 'saved' | 'security' | 'advisor'
  const [isEditing, setIsEditing] = useState(false);

  // Default / current profile data
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Lord Julian Beaumont',
    entityName: 'Beaumont Sovereign Capital & Family Trust',
    title: 'Managing Principal & Architectural Connoisseur',
    email: user?.email || 'client@plutoplat.com',
    phone: user?.phone || '+91 9956346155',
    city: user?.city || 'Civil Lines, Kanpur, Uttar Pradesh',
    memberSince: user?.memberSince || 'October 2024',
    tier: user?.tier || 'Sovereign Private Member',
    targetBudgetMin: '₹5,00,00,000',
    targetBudgetMax: '₹25,00,000,000',
    preferredLocations: ['Civil Lines Kanpur', 'Swaroop Nagar', 'VIP Road & Ganga', 'Tilak Nagar', 'Downtown Dubai'],
    preferredTypes: ['Palatial Mansions', 'Sky Penthouses', 'Waterfront Villas', 'Heritage Plots'],
    kycStatus: 'Accredited & Legally Verified',
    ndaStatus: 'Active Mutual NDA (#PLP-UP-2026-441)'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.city || prev.city,
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (updateUser) {
      updateUser({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city
      });
    } else {
      showToast('Client dossier & acquisition preferences updated successfully.', 'success');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Profile Header Banner */}
        <div className="bg-[#1C201C] text-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-[#2E342E] mb-8 relative overflow-hidden">
          {/* Subtle gold glow accent */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#B49A70]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={formData.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#B49A70] shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#B49A70] text-[#1C201C] flex items-center justify-center font-serif text-3xl font-bold shadow-xl border-2 border-white/20">
                    {formData.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-6 h-6 bg-[#10B981] border-2 border-[#1C201C] rounded-full flex items-center justify-center text-[10px] text-white" title="Active Verified Protocol">
                  ✓
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#B49A70] bg-white/10 px-3 py-1 rounded-full mb-2 border border-[#B49A70]/30">
                  <Award size={12} />
                  <span>{formData.tier}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1">
                  {formData.fullName}
                </h1>
                <p className="text-xs text-[#EBE7DF] font-light flex items-center gap-2">
                  <span>{formData.entityName}</span>
                  <span>&bull;</span>
                  <span className="text-[#B49A70] flex items-center gap-1">
                    <MapPin size={11} /> {formData.city}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A09D94] mt-2">
                  <span>Client Code: <strong className="text-white font-mono">{user?.id || '#PLP-8842'}</strong></span>
                  <span>&bull;</span>
                  <span>Member Since: {formData.memberSince}</span>
                  <span>&bull;</span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> KYC Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Edit & Logout */}
            <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-5 py-2.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                <span>{isEditing ? 'Save Dossier' : 'Edit Dossier'}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2.5 bg-white/10 hover:bg-[#C74747]/20 border border-white/20 hover:border-[#C74747]/50 text-white hover:text-[#C74747] text-xs uppercase tracking-wider font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Sign out of current workstation"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10 text-xs">
            <Link to="/favorites" className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
              <span className="text-[#A09D94] text-[11px] block mb-1">Saved Properties</span>
              <span className="text-xl font-serif text-white font-semibold flex items-center gap-2">
                <Heart size={16} className="text-[#B49A70]" />
                {favorites.length} Residences
              </span>
            </Link>

            <Link to="/my-enquiries" className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
              <span className="text-[#A09D94] text-[11px] block mb-1">Active Enquiries</span>
              <span className="text-xl font-serif text-white font-semibold flex items-center gap-2">
                <FileText size={16} className="text-[#10B981]" />
                3 Enquiries
              </span>
            </Link>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[#A09D94] text-[11px] block mb-1">Confidential NDA</span>
              <span className="text-sm font-semibold text-[#B49A70] flex items-center gap-1.5 truncate">
                <ShieldCheck size={16} className="text-[#B49A70] shrink-0" />
                Active Protocol
              </span>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[#A09D94] text-[11px] block mb-1">Dedicated Advisor</span>
              <span className="text-sm font-semibold text-white truncate block">
                Aditya Srivastava (Kanpur)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-[#DDD8CE]">
          {[
            { id: 'dossier', label: 'Client Dossier', icon: <User size={15} /> },
            { id: 'mandate', label: 'Acquisition Mandate', icon: <Building size={15} /> },
            { id: 'saved', label: `Saved Portfolio (${favorites.length})`, icon: <Heart size={15} /> },
            { id: 'security', label: 'Security & Legal NDA', icon: <ShieldCheck size={15} /> },
            { id: 'advisor', label: 'Assigned Managing Desk', icon: <Phone size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1C201C] text-white shadow-sm'
                  : 'bg-white text-[#6E6D66] border border-[#DDD8CE] hover:text-[#1C201C] hover:bg-[#FAF8F5]'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#B49A70]' : 'text-[#8E8B82]'}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Client Dossier */}
        {activeTab === 'dossier' && (
          <div className="bg-white border border-[#DDD8CE] p-6 sm:p-10 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-[#EAE6DE] mb-8">
              <div>
                <span className="text-[10px] font-bold text-[#B49A70] uppercase tracking-widest block mb-1">
                  Confidential Record
                </span>
                <h3 className="font-serif text-2xl text-[#1C201C] font-normal">
                  Executive Identity & Verified Details
                </h3>
              </div>
              <span className="text-xs bg-[#E8F8F3] text-[#00A884] border border-[#A7E6D1] px-3 py-1 rounded-full font-medium">
                Identity Verified
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl text-sm text-[#1C201C] disabled:bg-[#F3F0EA] disabled:text-[#444] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-2">
                    Family Office / Entity Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.entityName}
                    onChange={(e) => handleInputChange('entityName', e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl text-sm text-[#1C201C] disabled:bg-[#F3F0EA] disabled:text-[#444] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-2">
                    Confidential Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl text-sm text-[#1C201C] disabled:bg-[#F3F0EA] disabled:text-[#444] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-2">
                    Direct Telephone
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl text-sm text-[#1C201C] disabled:bg-[#F3F0EA] disabled:text-[#444] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-2">
                    Primary City / Jurisdiction
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl text-sm text-[#1C201C] disabled:bg-[#F3F0EA] disabled:text-[#444] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-2">
                    Acquisition Role
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={user?.role || 'Principal Purchaser'}
                    className="w-full px-4 py-3 bg-[#F3F0EA] border border-[#DDD8CE] rounded-xl text-sm text-[#444]"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-[#DDD8CE] rounded-xl text-xs uppercase font-semibold text-[#6E6D66] hover:bg-[#F8F6F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#B49A70] hover:bg-[#9E865F] text-white rounded-xl text-xs uppercase font-semibold tracking-wider shadow-md"
                  >
                    Save Dossier Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 2: Acquisition Mandate */}
        {activeTab === 'mandate' && (
          <div className="bg-white border border-[#DDD8CE] p-6 sm:p-10 rounded-2xl shadow-xs space-y-8">
            <div>
              <span className="text-[10px] font-bold text-[#B49A70] uppercase tracking-widest block mb-1">
                Property Criteria
              </span>
              <h3 className="font-serif text-2xl text-[#1C201C] font-normal mb-2">
                Acquisition Mandate & Investment Parameters
              </h3>
              <p className="text-xs text-[#6E6D66] leading-relaxed">
                Your designated advisory partner curates off-market opportunities based on these exact specifications across Kanpur, Uttar Pradesh and global markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EAE6DE]">
              <div className="p-5 bg-[#F8F6F2] rounded-xl border border-[#EAE6DE]">
                <h4 className="font-serif text-sm font-semibold text-[#1C201C] mb-2">Target Investment Allocation</h4>
                <div className="text-xl font-serif text-[#8E7448] font-bold">
                  {formData.targetBudgetMin} &mdash; {formData.targetBudgetMax}
                </div>
                <p className="text-[11px] text-[#77766E] mt-1">Pre-cleared liquidity for immediate escrow dispatch.</p>
              </div>

              <div className="p-5 bg-[#F8F6F2] rounded-xl border border-[#EAE6DE]">
                <h4 className="font-serif text-sm font-semibold text-[#1C201C] mb-2">Preferred Asset Classes</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {formData.preferredTypes.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-white border border-[#DDD8CE] text-[#1C201C] rounded-lg text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#F8F6F2] rounded-xl border border-[#EAE6DE]">
              <h4 className="font-serif text-sm font-semibold text-[#1C201C] mb-3">Preferred Enclaves & Territories</h4>
              <div className="flex flex-wrap gap-2">
                {formData.preferredLocations.map((loc) => (
                  <span key={loc} className="px-3 py-1.5 bg-white border border-[#B49A70]/50 text-[#8E7448] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                    <MapPin size={12} className="text-[#B49A70]" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Saved Portfolio */}
        {activeTab === 'saved' && (
          <div className="bg-white border border-[#DDD8CE] p-6 sm:p-10 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-[#EAE6DE] mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#B49A70] uppercase tracking-widest block mb-1">
                  Private Collection
                </span>
                <h3 className="font-serif text-2xl text-[#1C201C] font-normal">
                  Your Shortlisted Trophy Estates
                </h3>
              </div>
              <Link
                to="/properties"
                className="text-xs font-semibold text-[#B49A70] hover:text-[#1C201C] uppercase tracking-wider flex items-center gap-1"
              >
                <span>Browse All Estates</span>
                <ExternalLink size={13} />
              </Link>
            </div>

            {favoriteProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((p) => (
                  <div key={p.id} className="border border-[#EAE6DE] rounded-2xl overflow-hidden bg-[#FAF8F5] flex flex-col justify-between group hover:border-[#B49A70] transition-colors">
                    <div className="relative h-44 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-[#1C201C]/80 text-[#E8D9BF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {p.purpose}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-[#77766E] flex items-center gap-1 mb-1">
                          <MapPin size={11} className="text-[#B49A70]" /> {p.location}
                        </div>
                        <h4 className="font-serif text-base font-semibold text-[#1C201C] line-clamp-1 mb-2">
                          {p.title}
                        </h4>
                        <div className="text-sm font-bold text-[#8E7448]">{p.price}</div>
                      </div>
                      <Link
                        to={`/property/${p.id}`}
                        className="mt-4 w-full py-2 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xl text-center block transition-colors"
                      >
                        Open Dossier
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart size={36} className="text-[#DDD8CE] mx-auto mb-3" />
                <h4 className="font-serif text-lg text-[#1C201C] mb-1">No Saved Properties Yet</h4>
                <p className="text-xs text-[#6E6D66] max-w-sm mx-auto mb-6">
                  Save extraordinary properties to your private collection to review them anytime or share with your managing advisor.
                </p>
                <Link
                  to="/properties"
                  className="inline-flex px-6 py-3 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-sm"
                >
                  Explore Properties
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Security & Mutual NDA */}
        {activeTab === 'security' && (
          <div className="bg-white border border-[#DDD8CE] p-6 sm:p-10 rounded-2xl shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#B49A70] uppercase tracking-widest block mb-1">
                Institutional Rigor
              </span>
              <h3 className="font-serif text-2xl text-[#1C201C] font-normal mb-2">
                Security Credentials & Escrow Non-Disclosure
              </h3>
              <p className="text-xs text-[#6E6D66]">
                PlutoPlat operates under Swiss-standard confidentiality protocols, protecting high-profile client identities and transaction terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EAE6DE]">
              <div className="p-6 border border-[#DDD8CE] rounded-xl bg-[#F8F6F2]">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck size={26} className="text-[#10B981]" />
                  <div>
                    <h4 className="font-serif text-base text-[#1C201C] font-semibold">Institutional Due Diligence</h4>
                    <span className="text-[11px] text-[#10B981] font-mono font-bold">VERIFIED & ACCREDITED</span>
                  </div>
                </div>
                <p className="text-xs text-[#6E6D66] font-light leading-relaxed">
                  Financial accreditation on file with PlutoPlat Legal Escrow. Allows instantaneous access to sensitive off-market architectural dossiers.
                </p>
              </div>

              <div className="p-6 border border-[#DDD8CE] rounded-xl bg-[#F8F6F2]">
                <div className="flex items-center gap-3 mb-3">
                  <KeyRound size={26} className="text-[#B49A70]" />
                  <div>
                    <h4 className="font-serif text-base text-[#1C201C] font-semibold">Mutual Non-Disclosure Agreement</h4>
                    <span className="text-[11px] text-[#B49A70] font-mono font-bold">EXECUTED & ACTIVE</span>
                  </div>
                </div>
                <p className="text-xs text-[#6E6D66] font-light leading-relaxed">
                  Reference: <span className="font-mono text-[#1C201C]">{formData.ndaStatus}</span>. Protects buyer and seller identities, floorplans, and transaction valuations.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE6DE] flex flex-wrap gap-4 items-center justify-between">
              <div className="text-xs text-[#6E6D66]">
                Security passkey authenticated. 256-Bit SSL End-to-End Encryption active.
              </div>
              <Link
                to="/forgot-password"
                className="px-5 py-2.5 bg-white border border-[#1C201C] text-[#1C201C] text-xs uppercase tracking-wider font-semibold rounded-xl hover:bg-[#F8F6F2] transition-colors"
              >
                Rotate Security Passcode
              </Link>
            </div>
          </div>
        )}

        {/* Tab 5: Assigned Managing Desk */}
        {activeTab === 'advisor' && (
          <div className="bg-white border border-[#DDD8CE] p-6 sm:p-10 rounded-2xl shadow-xs">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-[#EAE6DE]">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
                alt="Aditya Srivastava"
                className="w-28 h-28 rounded-full object-cover border-2 border-[#B49A70] shadow-xl"
              />
              <div className="text-center md:text-left">
                <span className="text-xs font-semibold text-[#B49A70] uppercase tracking-widest block mb-1">
                  Your Dedicated Senior Managing Director
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1C201C] font-normal mb-1">
                  Aditya Srivastava
                </h3>
                <p className="text-xs text-[#77766E] mb-3">
                  Senior Managing Director, Kanpur & UP Heritage Estates &bull; 16 Years Prime Market Tenure
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-[#555]">
                  <span>Direct: <strong className="text-[#1C201C]">+91 9956346155</strong></span>
                  <span>&bull;</span>
                  <span>Email: <strong className="text-[#1C201C]">kanpur@plutoplat.com</strong></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="tel:+919956346155"
                className="p-4 bg-[#1C201C] text-white rounded-xl text-center text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone size={14} className="text-[#B49A70]" />
                <span>Call +91 9956346155</span>
              </a>

              <a
                href="https://wa.me/919956346155?text=Hello%20Aditya,%20I%20am%20reviewing%20my%20PlutoPlat%20Private%20Dossier%20and%20would%20like%20to%20consult%20on%20Kanpur%20estates."
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#00A884] text-white rounded-xl text-center text-xs uppercase tracking-wider font-semibold hover:bg-[#008f6f] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Advisor</span>
              </a>

              <Link
                to="/favorites"
                className="p-4 border border-[#DDD8CE] text-[#1C201C] rounded-xl text-center text-xs uppercase tracking-wider font-semibold hover:bg-[#F8F6F2] transition-colors flex items-center justify-center gap-2"
              >
                <Heart size={14} className="text-[#C74747]" />
                <span>Review Saved Estates</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
