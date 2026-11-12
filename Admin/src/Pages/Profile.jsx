import React, { useState, useEffect } from 'react';
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
  Calendar,
  Loader2,
  Camera
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import ImageUploadOrLink from '../Components/ImageUploadOrLink';
import { useAdminStore } from '../context/AdminContext';
import { AdminApi } from '../services/Api';

const Profile = () => {
  const { user, showToast, updateProfile } = useAdminStore();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    agency: user?.agency || 'Licensed Realty Partner',
    rera: user?.rera || '',
    city: user?.location?.city || user?.city || '',
    tier: user?.role === 'super_admin' ? 'SuperAdmin Executive' : 'Licensed Agent & Broker',
    bio: user?.bio || 'Authorized real estate representative for verified luxury properties and buyer advisory.',
    profileImage: user?.profileImage || user?.avatar || '',
  });

  useEffect(() => {
    if (sessionStorage.getItem('pluto_admin_token')) {
      AdminApi.getMe()
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
        .catch((err) => console.warn('Could not refresh agent profile:', err));
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
        agency: user.agency || prev.agency,
        rera: user.rera || prev.rera,
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
          await AdminApi.updateProfile(userId, {
            name: formData.name,
            phone: formData.phone,
            location: { city: formData.city },
            profileImage: formData.profileImage,
            avatar: formData.profileImage,
            agency: formData.agency,
            rera: formData.rera,
          });
        }
        showToast('Agent profile credentials & dossier updated successfully.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
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
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt={formData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#B49A70] shadow-md ring-4 ring-[#B49A70]/20"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#101411] to-[#1E251E] text-[#D9C49B] flex items-center justify-center font-serif text-2xl font-bold shadow-md ring-4 ring-[#B49A70]/20">
                    {formData.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-serif font-medium text-[#1C201C]">{formData.name || 'Agent'}</h3>
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
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Dossier</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile Avatar Photo Uploader / Link */}
            <div className="rounded-xl border border-[#DDD8CE] bg-[#FAF8F5] p-4">
              <ImageUploadOrLink
                label="Agent Profile Photo"
                value={formData.profileImage}
                onChange={(val) => setFormData({ ...formData, profileImage: val })}
                helperText="Upload your official agent photograph from your device or paste a hosted image URL."
              />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                  Full Legal Name
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
                  placeholder="e.g. UP-RERA-2026-98124"
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
