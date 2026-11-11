import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  X,
  Sparkles,
  MapPin,
  BedDouble,
  Ruler,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';

const PropertyList = () => {
  const { user, properties, addProperty, deleteProperty } = useAdminStore();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    type: 'Villas',
    purpose: 'Buy',
    numericPrice: 8500000,
    location: 'Civil Lines, Kanpur',
    address: 'Mall Road, Civil Lines',
    beds: 4,
    baths: 4,
    sqft: '5,200',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    description: '',
  });

  // Filter to properties belonging to this agent
  const myProperties = useMemo(() => {
    return properties.filter(
      (p) => p.ownerEmail === user?.email || p.ownerName === user?.name || user?.role === 'admin'
    );
  }, [properties, user]);

  const pendingCount = myProperties.filter((p) => !p.verified || p.status === 'pending').length;
  const approvedCount = myProperties.filter((p) => p.verified && p.status !== 'rejected').length;

  const filteredProperties = useMemo(() => {
    return myProperties.filter((p) => {
      if (activeTab === 'pending' && (p.verified && p.status !== 'pending')) return false;
      if (activeTab === 'approved' && (!p.verified || p.status === 'rejected')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesLoc = p.location?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc) return false;
      }
      return true;
    });
  }, [myProperties, activeTab, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;

    const numPrice = Number(form.numericPrice) || 8500000;
    const formattedPrice = numPrice >= 10000000 
      ? `₹${(numPrice / 10000000).toFixed(2)} Cr` 
      : `₹${(numPrice / 100000).toFixed(2)} Lac`;

    addProperty({
      ...form,
      numericPrice: numPrice,
      price: formattedPrice,
      images: [form.image],
      ownerEmail: user?.email || 'm.sharma@plutoplat.com',
      ownerName: user?.name || 'Michael Sharma',
      verified: true,
      status: 'approved'
    });

    setModalOpen(false);
    setForm({
      title: '',
      type: 'Villas',
      purpose: 'Buy',
      numericPrice: 8500000,
      location: 'Civil Lines, Kanpur',
      address: 'Mall Road, Civil Lines',
      beds: 4,
      baths: 4,
      sqft: '5,200',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      description: '',
    });
  };

  return (
    <AdminLayout title="My Properties Portfolio">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Agent Property Listings</h2>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Add, update, and manage your property inventory. Submissions undergo SuperAdmin review before live publishing.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Submit Property Listing</span>
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 border border-[#E8E3D8] rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F1EDE3] rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#1C201C] shadow-sm'
                  : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              All ({myProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white text-[#1C201C] shadow-sm'
                  : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              <span>In Review</span>
              {pendingCount > 0 && (
                <span className="text-[10px] bg-[#B49A70] text-[#121612] px-2 py-0.2 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-white text-[#1C201C] shadow-sm'
                  : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              Live & Published ({approvedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Search by title, location or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full pl-10 pr-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 text-[#1C201C] placeholder:text-[#A9A69B]"
            />
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Residence</th>
                  <th className="py-4 px-5">Price & Cluster</th>
                  <th className="py-4 px-5">Dimensions</th>
                  <th className="py-4 px-5">Review State</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#6E6D66]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Building2 size={28} className="mx-auto text-[#B49A70]/50" />
                        <p className="font-serif text-base text-[#1C201C]">No listings found</p>
                        <p className="text-[11px] text-[#8A887F]">
                          Submit your first luxury property listing using the button above.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((prop) => {
                    const isPending = !prop.verified || prop.status === 'pending';

                    return (
                      <tr key={prop.id} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* Title & Image */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.title}
                              className="w-14 h-14 object-cover rounded-xl border border-[#DDD8CE] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-[#1C201C] truncate max-w-xs font-serif">{prop.title}</p>
                              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#B49A70] inline-block mt-0.5">
                                {prop.type}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price & Location */}
                        <td className="py-4 px-5">
                          <p className="font-serif text-sm font-semibold text-[#1C201C]">{prop.price}</p>
                          <p className="text-xs text-[#6E6D66] truncate flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-[#8A887F]" />
                            {prop.location}
                          </p>
                        </td>

                        {/* Specs */}
                        <td className="py-4 px-5 text-xs text-[#6E6D66]">
                          <p className="flex items-center gap-1 font-medium text-[#1C201C]">
                            <BedDouble size={13} className="text-[#8A887F]" />
                            {prop.beds} Beds • {prop.baths} Baths
                          </p>
                          <p className="text-[11px] text-[#8A887F] flex items-center gap-1 mt-0.5">
                            <Ruler size={12} className="text-[#8A887F]" />
                            {prop.sqft} sq ft
                          </p>
                        </td>

                        {/* State */}
                        <td className="py-4 px-5">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock size={11} /> Pending Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={11} /> Live Marketplace
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${prop.title}" listing?`)) {
                                  deleteProperty(prop.id);
                                }
                              }}
                              className="p-2 text-[#8A887F] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Listing Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE] mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E3D8] text-[10px] font-semibold uppercase tracking-wider text-[#B49A70] mb-1">
                    <Sparkles size={11} /> New Submission
                  </div>
                  <h3 className="font-serif text-xl text-[#1C201C] font-normal">Submit Property for Moderation</h3>
                  <p className="text-xs text-[#6E6D66]">
                    Your listing will be reviewed by the SuperAdmin team before going live.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#8A887F] hover:text-[#1C201C] p-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Mirage Palatial Estate"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] placeholder:text-[#A9A69B] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      Architectural Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    >
                      <option value="Villas">Villas</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Penthouses">Penthouses</option>
                      <option value="Townhouses">Townhouses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      Expected Price (Numeric) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.numericPrice}
                      onChange={(e) => setForm({ ...form, numericPrice: Number(e.target.value) })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      City, Locality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      Square Feet
                    </label>
                    <input
                      type="text"
                      value={form.sqft}
                      onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                    Description & Provenance
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe architectural provenance, private amenities, and bespoke finishes..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] p-3 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                  />
                </div>

                <div className="pt-4 border-t border-[#EAE6DE] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 border border-[#DDD8CE] rounded-xl text-xs font-semibold text-[#6E6D66] hover:bg-[#FAF8F5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PropertyList;
