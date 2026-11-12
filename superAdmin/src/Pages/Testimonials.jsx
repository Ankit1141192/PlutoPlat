import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
  User,
  Building2,
  Loader2,
  X,
  AlertCircle,
  Pencil
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import ImageUploadOrLink from '../Components/ImageUploadOrLink';
import { SuperAdminApi } from '../services/Api';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Testimonials = () => {
  const { showToast } = useSuperAdminStore();

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const cached = localStorage.getItem('pluto_superadmin_testimonials_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    client: '',
    role: 'Private Investor',
    company: 'Trophy Estate Acquisition',
    rating: 5,
    message: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminApi.getTestimonials();
      if (res?.data && Array.isArray(res.data)) {
        setTestimonials(res.data);
        try {
          localStorage.setItem('pluto_superadmin_testimonials_cache', JSON.stringify(res.data));
        } catch {}
      }
    } catch (err) {
      console.warn('Testimonials load notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormError('');
    setForm({
      client: '',
      role: 'Private Investor',
      company: 'Trophy Estate Acquisition',
      rating: 5,
      message: '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id || item.id);
    setFormError('');
    setForm({
      client: item.client || item.name || '',
      role: item.role || 'Private Investor',
      company: item.property || item.company || 'Trophy Estate Acquisition',
      rating: Number(item.rating) || 5,
      message: item.content || item.message || '',
      avatar: item.avatar || item.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.client.trim() || !form.message.trim()) {
      setFormError('Client name and review message are required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        client: form.client.trim(),
        name: form.client.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        property: form.company.trim(),
        rating: Number(form.rating) || 5,
        content: form.message.trim(),
        message: form.message.trim(),
        avatar: form.avatar.trim(),
        imageUrl: form.avatar.trim(),
      };

      if (editingId) {
        // UPDATE
        const res = await SuperAdminApi.updateTestimonial(editingId, payload);
        const updated = res?.data || { ...payload, id: editingId, _id: editingId };
        setTestimonials((prev) => {
          const next = prev.map((t) => (t._id === editingId || t.id === editingId ? { ...t, ...updated } : t));
          try {
            localStorage.setItem('pluto_superadmin_testimonials_cache', JSON.stringify(next));
          } catch {}
          return next;
        });
        showToast('Testimonial updated successfully in database!', 'success');
      } else {
        // CREATE
        const res = await SuperAdminApi.createTestimonial(payload);
        const created = res?.data || {
          ...payload,
          id: Date.now(),
          client: form.client,
          content: form.message,
        };
        setTestimonials((prev) => {
          const next = [created, ...prev.filter((t) => (t._id || t.id) !== (created._id || created.id))];
          try {
            localStorage.setItem('pluto_superadmin_testimonials_cache', JSON.stringify(next));
          } catch {}
          return next;
        });
        showToast('Verified testimonial saved to database and live in User panel!', 'success');
      }

      setModalOpen(false);
      setEditingId(null);
      // Re-fetch to guarantee database sync
      fetchTestimonials();
    } catch (err) {
      setFormError(err.message || 'Failed to submit testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this client review?')) return;
    try {
      await SuperAdminApi.deleteTestimonial(id);
      setTestimonials((prev) => {
        const next = prev.filter((t) => t._id !== id && t.id !== id);
        try {
          localStorage.setItem('pluto_superadmin_testimonials_cache', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('Testimonial removed from database.', 'info');
      fetchTestimonials();
    } catch (err) {
      showToast(err.message || 'Failed to delete testimonial.', 'error');
    }
  };

  const filtered = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (t.client || t.name || '').toLowerCase().includes(q);
    const contentMatch = (t.content || t.message || '').toLowerCase().includes(q);
    const roleMatch = (t.role || t.company || '').toLowerCase().includes(q);
    return nameMatch || contentMatch || roleMatch;
  });

  return (
    <SuperAdminLayout title="Platform Testimonials & Client Endorsements">
      <div className="space-y-6 max-w-6xl">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Client Testimonials & Public Social Proof</h2>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Manage verified reviews that display on the public User panel homepage and brand showcase.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            Add Verified Review
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-[#E8E3D8] rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A887F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, transaction, or quote..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs text-[#1C201C] placeholder:text-[#999] focus:outline-none focus:border-[#B49A70]"
            />
          </div>

          <span className="text-xs text-[#8A887F] font-mono">
            {filtered.length} total review(s)
          </span>
        </div>

        {/* Grid of Testimonials */}
        {loading ? (
          <div className="p-12 text-center bg-white border border-[#E8E3D8] rounded-2xl">
            <Loader2 className="w-6 h-6 animate-spin text-[#B49A70] mx-auto mb-2" />
            <p className="text-xs text-[#6E6D66]">Loading platform testimonials from MongoDB...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E8E3D8] rounded-2xl">
            <MessageSquareQuote className="w-10 h-10 text-[#DDD8CE] mx-auto mb-3" />
            <h3 className="font-serif text-lg text-[#1C201C]">No Testimonials Found</h3>
            <p className="text-xs text-[#6E6D66] mt-1">Click "Add Verified Review" to publish the first client review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => {
              const id = item._id || item.id;
              const author = item.client || item.name || 'Private Client';
              const text = item.content || item.message || '';
              const photo = item.avatar || item.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              const role = item.role || 'Private Investor';
              const prop = item.property || item.company || 'Trophy Acquisition';
              const rating = Number(item.rating) || 5;

              return (
                <div
                  key={id}
                  className="bg-white border border-[#E8E3D8] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    {/* Stars, edit & delete */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating ? 'text-[#B49A70] fill-[#B49A70]' : 'text-gray-200'}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 text-[#999] hover:text-[#B49A70] transition-colors cursor-pointer"
                          title="Edit Testimonial"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1 text-[#999] hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Testimonial"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#333] italic leading-relaxed mb-4">
                      "{text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE2] flex items-center gap-3">
                    <img
                      src={photo}
                      alt={author}
                      className="w-10 h-10 rounded-full object-cover border border-[#DDD8CE]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#1C201C] truncate">{author}</h4>
                      <p className="text-[11px] text-[#B49A70] font-medium truncate">{role}</p>
                      <p className="text-[10px] text-[#8A887F] truncate">{prop}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add Testimonial */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DE] mb-5">
                <div>
                  <h3 className="font-serif text-xl font-normal text-[#1C201C]">
                    {editingId ? 'Edit Verified Client Review' : 'Add Verified Client Review'}
                  </h3>
                  <p className="text-xs text-[#6E6D66] mt-0.5">
                    {editingId
                      ? 'Updates this testimonial in MongoDB and syncs with the live User panel.'
                      : 'Saves to MongoDB and displays on User panel homepage and reviews portal.'}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#8A887F] hover:bg-[#FAF8F5] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-[#3F433E] mb-1">
                    Client Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs text-[#1C201C] focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#3F433E] mb-1">
                      Client Designation / Role
                    </label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Managing Director"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs text-[#1C201C] focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3F433E] mb-1">
                      Acquisition / Firm
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Civil Lines Trophy Estate"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs text-[#1C201C] focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#3F433E] mb-1">
                      Rating (1 - 5 Stars)
                    </label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs text-[#1C201C] focus:outline-none focus:border-[#B49A70]"
                    >
                      <option value={5}>5 Stars (Exceptional)</option>
                      <option value={4}>4 Stars (Very Good)</option>
                      <option value={3}>3 Stars (Good)</option>
                    </select>
                  </div>

                  <div>
                    <ImageUploadOrLink
                      label="Client Avatar Photo"
                      value={form.avatar}
                      onChange={(val) => setForm({ ...form, avatar: val })}
                      helperText="Paste client photo URL or upload an image file."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#3F433E] mb-1">
                    Endorsement Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Enter the client's detailed testimonial statement regarding service discretion, legal escrow, or property quality..."
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg text-xs text-[#1C201C] focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div className="pt-3 border-t border-[#EAE6DE] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-transparent text-[#6E6D66] hover:bg-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C201C] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{editingId ? 'Updating...' : 'Publishing to Database...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} className="text-[#B49A70]" />
                        <span>{editingId ? 'Save Changes' : 'Publish Testimonial'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default Testimonials;
