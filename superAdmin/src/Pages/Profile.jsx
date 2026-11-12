import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Lock,
  Activity,
  Terminal,
  KeyRound,
  Loader2,
  Camera
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import ImageUploadOrLink from '../Components/ImageUploadOrLink';
import { useSuperAdminStore } from '../context/SuperAdminContext';
import { SuperAdminApi } from '../services/Api';

const Profile = () => {
  const { user, showToast, updateProfile } = useSuperAdminStore();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.location?.city || user?.city || 'Kanpur, Uttar Pradesh',
    tier: 'Platform Owner & Root Controller',
    profileImage: user?.profileImage || user?.avatar || '',
  });

  useEffect(() => {
    if (sessionStorage.getItem('pluto_superadmin_token')) {
      SuperAdminApi.getMe()
        .then((res) => {
          if (res?.data?.user) {
            const u = res.data.user;
            setFormData((prev) => ({
              ...prev,
              name: u.name || prev.name,
              email: u.email || prev.email,
              phone: u.phone || prev.phone,
              city: u.location?.city || prev.city,
              profileImage: u.profileImage || u.avatar || prev.profileImage,
            }));
          }
        })
        .catch((err) => console.warn('Could not refresh SuperAdmin profile:', err));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.location?.city || user.city || prev.city,
        profileImage: user.profileImage || user.avatar || prev.profileImage,
      }));
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile(formData);
      } else {
        const userId = user?._id || user?.id;
        if (userId) {
          await SuperAdminApi.updateProfile(userId, {
            name: formData.name,
            phone: formData.phone,
            location: { city: formData.city },
            profileImage: formData.profileImage,
            avatar: formData.profileImage,
          });
        }
        showToast('SuperAdmin profile credentials updated.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update credentials.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SuperAdminLayout title="SuperAdmin Executive Dossier">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Platform Owner Identity & Security Clearance</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Manage your verified root identity, executive telephone contact, and platform governance settings.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Header Identity Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6DE]">
              <div className="flex items-center gap-4">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt={formData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#B49A70] shadow-md ring-4 ring-[#B49A70]/30"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#121612] to-[#1F2620] text-[#D9C49B] flex items-center justify-center font-serif text-2xl font-bold shadow-md ring-4 ring-[#B49A70]/30">
                    {formData.name?.charAt(0) || 'Ω'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-serif font-medium text-[#1C201C]">{formData.name || 'SuperAdmin'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B49A70] bg-[#121612] px-2.5 py-0.5 rounded-full border border-[#B49A70]/40">
                      <ShieldCheck size={13} className="text-[#D9C49B]" />
                      Root Authority (Clearance Level 0)
                    </span>
                    <span className="text-xs text-[#8A887F]">•</span>
                    <span className="text-xs text-[#1C201C] font-semibold">{formData.tier}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Updating…</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Root Dossier</span>
                  </>
                )}
              </button>
            </div>

            {/* SuperAdmin Profile Photo (Link OR File Upload) */}
            <div className="rounded-xl border border-[#DDD8CE] bg-[#FAF8F5] p-4">
              <ImageUploadOrLink
                label="SuperAdmin Profile Avatar"
                value={formData.profileImage}
                onChange={(val) => setFormData({ ...formData, profileImage: val })}
                helperText="Upload an executive portrait or paste a hosted image URL."
              />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Platform Owner Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Root Controller Email
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
                  Direct Secure Telephone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 99563 46155"
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Platform HQ Operational City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Kanpur, Uttar Pradesh"
                  className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE6DE]">
              <div className="rounded-xl bg-[#F8F6F2] border border-[#DDD8CE] p-4 text-xs space-y-2 text-[#55574F]">
                <div className="flex items-center gap-2 text-[#1C201C] font-semibold">
                  <KeyRound size={15} className="text-[#B49A70]" />
                  <span>Security & Access Governance</span>
                </div>
                <p>
                  Zero-trust session authorization is enforced across all endpoints. To elevate or demote other users or agents, visit the Users & Agents Directory.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Profile;
