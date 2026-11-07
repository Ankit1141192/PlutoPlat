import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  MapPin,
  Save,
  CheckCircle2,
  Award,
  Sparkles,
  FileCheck,
  Calendar
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';

const Profile = () => {
  const { user, showToast } = useAdminStore();

  const [formData, setFormData] = useState({
    name: user?.name || 'Michael Sharma',
    email: user?.email || 'm.sharma@plutoplat.com',
    phone: user?.phone || '+91 98210 33445',
    agency: 'Sovereign Heritage Realty Partners',
    rera: 'UP-RERA-2026-98124',
    city: user?.city || 'Civil Lines, Kanpur, Uttar Pradesh',
    tier: 'Senior Partner Agent',
    bio: 'Senior property advisor specializing in luxury trophy estates, ancestral villas, and off-market residential acquisitions across Uttar Pradesh and prime metropolitan hubs.',
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Agent profile credentials & dossier updated successfully.', 'success');
  };

  return (
    <AdminLayout title="Agent & Partner Profile">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Broker Dossier & Representation Details</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Configure your professional contact details, verified RERA accreditation, and buyer-facing credentials.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Header Identity Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DE]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#101411] to-[#1E251E] text-[#D9C49B] flex items-center justify-center font-serif text-2xl font-bold shadow-md ring-4 ring-[#B49A70]/20">
                  {formData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-medium text-[#1C201C]">{formData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      Verified Broker Accreditation
                    </span>
                    <span className="text-xs text-[#8A887F]">•</span>
                    <span className="text-xs text-[#B49A70] font-medium">{formData.tier}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto"
              >
                <Save size={15} />
                <span>Save Dossier</span>
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Confidential Broker Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#EAE6DE]/50 px-3.5 text-xs text-[#6E6D66] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Direct Mobile Telephone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  RERA Registration Number
                </label>
                <input
                  type="text"
                  value={formData.rera}
                  onChange={(e) => setFormData({ ...formData, rera: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] font-mono transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Realty Agency / Firm
                </label>
                <input
                  type="text"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Primary Operating Territory
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                Broker Biography & Credentials
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] p-3 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
              />
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
