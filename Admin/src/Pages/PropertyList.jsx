import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  AlertCircle
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

    addProperty({
      ...form,
      price: `₹${(Number(form.numericPrice || 5000000) * 83.5).toLocaleString('en-IN')}`,
      images: [form.image],
      ownerEmail: user?.email || 'm.harrison@plutoplat.com',
      ownerName: user?.name || 'Michael Harrison',
      verified: false,
      status: 'pending'
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
            <h2 className="font-serif text-lg text-[#1C201C]">Agent Property Listings</h2>
            <p className="text-xs text-[#6E6D66]">
              Add, update, and manage your property inventory. New submissions undergo SuperAdmin review before live publishing.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs font-semibold rounded-xs shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>Submit Property Listing</span>
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 border border-[#DDD8CE] rounded-sm">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F8F6F2] rounded-xs border border-[#DDD8CE]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-[#1C201C] text-white shadow-2xs' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              All ({myProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending' ? 'bg-[#B49A70] text-white shadow-2xs' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              <span>In Review</span>
              {pendingCount > 0 && (
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'approved' ? 'bg-[#287A50] text-white shadow-2xs' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              Live & Published ({approvedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766E]" />
            <input
              type="text"
              placeholder="Search your listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
            />
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white border border-[#DDD8CE] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#DDD8CE] text-[10px] uppercase font-bold tracking-wider text-[#6E6D66]">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Price / Location</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4">Verification State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#6E6D66]">
                      No properties found in this category. Click "Submit Property Listing" to add your first estate.
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((prop) => {
                    const isPending = !prop.verified || prop.status === 'pending';

                    return (
                      <tr key={prop.id} className="hover:bg-[#F8F6F2] transition-colors">
                        {/* Title & Image */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.title}
                              className="w-14 h-12 object-cover rounded-2xs border border-[#DDD8CE] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#1C201C] truncate max-w-xs">{prop.title}</p>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B49A70]">
                                {prop.type}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price & Location */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#1C201C]">{prop.price}</p>
                          <p className="text-[11px] text-[#6E6D66] truncate">{prop.location}</p>
                        </td>

                        {/* Specs */}
                        <td className="py-3.5 px-4 text-[11px] text-[#6E6D66]">
                          <p>{prop.beds} Beds • {prop.baths} Baths</p>
                          <p className="text-[10px] text-[#8E8B82]">{prop.sqft} sqft</p>
                        </td>

                        {/* State */}
                        <td className="py-3.5 px-4">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              <Clock size={10} /> Pending Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 size={10} /> Live on Marketplace
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/property/${prop.id}`}
                              target="_blank"
                              className="p-1.5 text-[#6E6D66] hover:text-[#1C201C] rounded-xs border border-[#DDD8CE]"
                              title="Preview Listing"
                            >
                              <ExternalLink size={13} />
                            </Link>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${prop.title}" listing?`)) {
                                  deleteProperty(prop.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 size={13} />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-[#DDD8CE] rounded-sm max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DE] mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">Submit Property for Moderation</h3>
                  <p className="text-[11px] text-[#6E6D66]">
                    Your listing will be reviewed by the SuperAdmin team before going live.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#8E8B82] hover:text-[#1C201C] p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Mirage Villa"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Architectural Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    >
                      <option value="Villas">Villas</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Penthouses">Penthouses</option>
                      <option value="Townhouses">Townhouses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Expected Price (Numeric) *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.numericPrice}
                      onChange={(e) => setForm({ ...form, numericPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      City, State *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Square Feet
                    </label>
                    <input
                      type="text"
                      value={form.sqft}
                      onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Description & Provenance
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe amenities, architectural highlights, and proximity..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                  />
                </div>

                <div className="pt-3 border-t border-[#EAE6DE] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#DDD8CE] rounded-xs text-[#6E6D66] hover:bg-[#F8F6F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#B49A70] hover:bg-[#9E865F] text-white font-semibold rounded-xs shadow-xs"
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
