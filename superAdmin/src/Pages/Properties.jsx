import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  AlertCircle,
  X,
  Sparkles,
  MapPin,
  BedDouble,
  Ruler
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const getLocationText = (loc) => {
  if (!loc) return 'Kanpur, Uttar Pradesh';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.address, loc.city, loc.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : (loc.city || 'Kanpur, Uttar Pradesh');
  }
  return String(loc);
};

const getPriceText = (price, numPrice) => {
  if (typeof price === 'string' && price.length > 0 && isNaN(Number(price))) {
    return price;
  }
  const val = Number(numPrice || price) || 0;
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const Properties = () => {
  const { properties, approveProperty, rejectProperty, deleteProperty, addProperty } = useSuperAdminStore();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    subtitle: '',
    location: 'Civil Lines, Kanpur, UP',
    address: '',
    price: '',
    numericPrice: 12000000,
    purpose: 'Buy',
    type: 'Villas',
    featured: true,
    beds: 4,
    baths: 5,
    sqft: '6,500',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    description: '',
  });

  const pendingCount = properties.filter(p => !p.verified || p.status === 'pending').length;
  const approvedCount = properties.filter(p => p.verified && p.status !== 'rejected').length;
  const rejectedCount = properties.filter(p => p.status === 'rejected').length;

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Tab filter
      if (activeTab === 'pending' && (p.verified && p.status !== 'pending')) return false;
      if (activeTab === 'approved' && (!p.verified || p.status === 'rejected')) return false;
      if (activeTab === 'rejected' && p.status !== 'rejected') return false;

      // Type filter
      if (selectedType !== 'all' && p.type !== selectedType) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (p.title || '').toLowerCase().includes(q);
        const locString = getLocationText(p.location).toLowerCase();
        const matchesLoc = locString.includes(q);
        const ownerString = (p.ownerName || p.owner?.name || '').toLowerCase();
        const emailString = (p.ownerEmail || p.owner?.email || '').toLowerCase();
        if (!matchesTitle && !matchesLoc && !ownerString.includes(q) && !emailString.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [properties, activeTab, selectedType, searchQuery]);

  const handleCreateProperty = (e) => {
    e.preventDefault();
    if (!newProp.title) return;

    const numPrice = Number(newProp.numericPrice) || 8500000;
    const formattedPrice = numPrice >= 10000000 
      ? `₹${(numPrice / 10000000).toFixed(2)} Cr` 
      : `₹${(numPrice / 100000).toFixed(2)} Lac`;

    addProperty({
      ...newProp,
      numericPrice: numPrice,
      price: formattedPrice,
      images: [newProp.image],
    });

    setModalOpen(false);
    setNewProp({
      title: '',
      subtitle: '',
      location: 'Civil Lines, Kanpur, UP',
      address: '',
      price: '',
      numericPrice: 12000000,
      purpose: 'Buy',
      type: 'Villas',
      featured: true,
      beds: 4,
      baths: 5,
      sqft: '6,500',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      description: '',
    });
  };

  return (
    <SuperAdminLayout title="Properties Moderation & Registry">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Platform Property Moderation</h2>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Review, approve, or reject listings submitted by agents across the platform network.
            </p>
          </div>

          {/* Add Property Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Create Verified Property</span>
          </button>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3.5 border border-[#E8E3D8] rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F1EDE3] rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all' ? 'bg-white text-[#1C201C] shadow-sm' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'pending' ? 'bg-white text-[#1C201C] shadow-sm' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="text-[10px] bg-[#B49A70] text-[#121612] px-2 py-0.2 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'approved' ? 'bg-white text-[#1C201C] shadow-sm' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'rejected' ? 'bg-white text-[#1C201C] shadow-sm' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
              <input
                type="text"
                placeholder="Search by title, location or agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full pl-10 pr-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 text-[#1C201C] placeholder:text-[#A9A69B]"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 px-3.5 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl text-[#1C201C] focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Architectural Types</option>
              <option value="Villas">Villas</option>
              <option value="Penthouses">Penthouses</option>
              <option value="Apartments">Apartments</option>
              <option value="Townhouses">Townhouses</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">Listing</th>
                  <th className="py-4 px-5">Price & Location</th>
                  <th className="py-4 px-5">Submitter Agent</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#6E6D66]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Building2 size={28} className="mx-auto text-[#B49A70]/50" />
                        <p className="font-serif text-base text-[#1C201C]">No properties found</p>
                        <p className="text-[11px] text-[#8A887F]">
                          No listings matched your active filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((prop) => {
                    const propId = prop._id || prop.id;
                    const isPending = !prop.verified || prop.status === 'pending';
                    const isApproved = prop.verified && prop.status !== 'rejected';
                    const isRejected = prop.status === 'rejected';

                    return (
                      <tr key={propId} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* Listing */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.title}
                              className="w-14 h-14 object-cover rounded-xl border border-[#DDD8CE] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-[#1C201C] truncate max-w-xs font-serif">{prop.title}</p>
                              <div className="flex items-center gap-2 text-[11px] text-[#8A887F] mt-0.5">
                                <span className="text-[#B49A70] font-medium">{prop.type}</span>
                                <span>•</span>
                                <span>{prop.beds || 3} Beds / {prop.baths || 3} Baths</span>
                                <span>•</span>
                                <span>{prop.sqft ? (typeof prop.sqft === 'number' ? `${prop.sqft} sqft` : prop.sqft) : '4,500 sqft'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price & Location */}
                        <td className="py-4 px-5">
                          <p className="font-serif text-sm font-semibold text-[#1C201C]">
                            {getPriceText(prop.formattedPrice || prop.price, prop.numericPrice || prop.price)}
                          </p>
                          <p className="text-xs text-[#6E6D66] truncate flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-[#8A887F] shrink-0" />
                            <span>{getLocationText(prop.location)}</span>
                          </p>
                        </td>

                        {/* Submitter */}
                        <td className="py-4 px-5">
                          <p className="font-medium text-xs text-[#1C201C]">{prop.ownerName || prop.owner?.name || 'Julian Beaumont'}</p>
                          <p className="text-[11px] text-[#8A887F] mt-0.5">{prop.ownerEmail || prop.owner?.email || 'agent@plutoplat.com'}</p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              Pending Review
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={11} /> Approved
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
                              <XCircle size={11} /> Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => approveProperty(propId)}
                                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer"
                                  title="Approve for public view"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectProperty(propId, 'Non-compliant documents')}
                                  className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Reject listing"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => rejectProperty(propId, 'Unpublished by SuperAdmin')}
                                className="px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                                title="Unpublish / Suspend"
                              >
                                Revoke
                              </button>
                            )}

                            {isRejected && (
                              <button
                                onClick={() => approveProperty(propId)}
                                className="px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                              >
                                Re-Approve
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete property "${prop.title}" permanently?`)) {
                                  deleteProperty(propId);
                                }
                              }}
                              className="p-1.5 text-[#8A887F] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Property"
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

        {/* Modal: Add Property */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE] mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E3D8] text-[10px] font-semibold uppercase tracking-wider text-[#B49A70] mb-1">
                    <Sparkles size={11} /> Executive Root Creation
                  </div>
                  <h3 className="font-serif text-xl text-[#1C201C] font-normal">Create Verified Property</h3>
                  <p className="text-xs text-[#6E6D66]">Direct SuperAdmin listing publishes live to marketplace.</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#8A887F] hover:text-[#1C201C] p-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Imperial Residence"
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newProp.type}
                      onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    >
                      <option value="Villas">Villas</option>
                      <option value="Penthouses">Penthouses</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Townhouses">Townhouses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      Numeric Price (INR ₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 12000000"
                      value={newProp.numericPrice}
                      onChange={(e) => setNewProp({ ...newProp, numericPrice: Number(e.target.value) })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      City, State/Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. South Mumbai, India"
                      value={newProp.location}
                      onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                      Square Feet
                    </label>
                    <input
                      type="text"
                      placeholder="7,500"
                      value={newProp.sqft}
                      onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
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
                    value={newProp.image}
                    onChange={(e) => setNewProp({ ...newProp, image: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] px-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#3F433E] mb-1.5">
                    Description & Provenance
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Architectural provenance and bespoke features..."
                    value={newProp.description}
                    onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
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
                    Publish Property
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

export default Properties;
