import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  MapPin,
  Save,
  CheckCircle2
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';

const Profile = () => {
  const { user, showToast } = useAdminStore();

  const [formData, setFormData] = useState({
    name: user?.name || 'Michael Harrison',
    email: user?.email || 'm.harrison@plutoplat.com',
    phone: user?.phone || '+1 (310) 849-2210',
    agency: 'Sovereign Heritage Realty Partners',
    rera: 'UP-RERA-2026-98124',
    city: user?.city || 'Kanpur & Beverly Hills',
    bio: 'Senior broker specializing in trophy estate acquisitions and private off-market dispositions.',
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Agent profile credentials updated successfully.', 'success');
  };

  return (
    <AdminLayout title="Agent & Broker Profile">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="font-serif text-lg text-[#1C201C]">Broker Dossier & Representation Details</h2>
          <p className="text-xs text-[#6E6D66]">
            Configure your professional contact details, verified RERA accreditation, and buyer-facing credentials.
          </p>
        </div>

        <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-6 border-b border-[#EAE6DE]">
              <div className="w-16 h-16 rounded-full bg-[#1C201C] text-white flex items-center justify-center font-serif text-2xl font-bold">
                {formData.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C201C]">{formData.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-[#287A50] mt-0.5">
                  <ShieldCheck size={14} />
                  <span>Verified Agent Accreditation</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  Confidential Broker Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 bg-[#EAE6DE] border border-[#DDD8CE] rounded-xs text-[#6E6D66] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  Direct Mobile Telephone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  RERA Registration Number
                </label>
                <input
                  type="text"
                  value={formData.rera}
                  onChange={(e) => setFormData({ ...formData, rera: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  Agency / Brokerage Firm
                </label>
                <input
                  type="text"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  Primary Market Jurisdiction
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                Professional Bio & Specialties
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
              />
            </div>

            <div className="pt-4 border-t border-[#EAE6DE] flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C201C] hover:bg-black text-white font-semibold rounded-xs transition-colors shadow-2xs cursor-pointer"
              >
                <Save size={14} className="text-[#B49A70]" />
                <span>Save Dossier Updates</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
