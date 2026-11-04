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
  X
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Properties = () => {
  const { properties, approveProperty, rejectProperty, deleteProperty, addProperty, formatPrice } = useSuperAdminStore();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    subtitle: '',
    location: 'Beverly Hills, CA',
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
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesLoc = p.location?.toLowerCase().includes(q);
        const matchesOwner = p.ownerName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesOwner) return false;
      }

      return true;
    });
  }, [properties, activeTab, selectedType, searchQuery]);

  const handleCreateProperty = (e) => {
    e.preventDefault();
    if (!newProp.title) return;

    addProperty({
      ...newProp,
      price: `$${Number(newProp.numericPrice || 5000000).toLocaleString()}`,
      images: [newProp.image],
    });

    setModalOpen(false);
    setNewProp({
      title: '',
      subtitle: '',
      location: 'Beverly Hills, CA',
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
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#DDD8CE] rounded-xs self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-[#1C201C] text-white shadow-2xs' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending' ? 'bg-[#B49A70] text-white shadow-2xs' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              <span>Pending Review</span>
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
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'rejected' ? 'bg-red-700 text-white shadow-2xs' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Add Property Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C201C] hover:bg-black text-white text-xs font-semibold rounded-xs transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} className="text-[#B49A70]" />
            <span>Create Verified Property</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 border border-[#DDD8CE] rounded-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766E]" />
            <input
              type="text"
              placeholder="Search properties by title, city, or submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs text-[#1C201C] focus:outline-none"
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
        <div className="bg-white border border-[#DDD8CE] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#DDD8CE] text-[10px] uppercase font-bold tracking-wider text-[#6E6D66]">
                  <th className="py-3 px-4">Listing</th>
                  <th className="py-3 px-4">Price / Location</th>
                  <th className="py-3 px-4">Submitter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#6E6D66]">
                      No properties found matching your current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((prop) => {
                    const isPending = !prop.verified || prop.status === 'pending';
                    const isApproved = prop.verified && prop.status !== 'rejected';
                    const isRejected = prop.status === 'rejected';

                    return (
                      <tr key={prop.id} className="hover:bg-[#F8F6F2] transition-colors">
                        {/* Listing */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.title}
                              className="w-14 h-12 object-cover rounded-2xs border border-[#DDD8CE] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#1C201C] truncate max-w-xs">{prop.title}</p>
                              <div className="flex items-center gap-2 text-[10px] text-[#6E6D66] mt-0.5">
                                <span>{prop.type}</span>
                                <span>•</span>
                                <span>{prop.beds} Beds / {prop.baths} Baths</span>
                                <span>•</span>
                                <span>{prop.sqft} sqft</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price & Location */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-[#1C201C]">{prop.price}</p>
                          <p className="text-[11px] text-[#6E6D66] truncate">{prop.location}</p>
                        </td>

                        {/* Submitter */}
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-[#1C201C]">{prop.ownerName || 'Julian Beaumont'}</p>
                          <p className="text-[10px] text-[#8E8B82]">{prop.ownerEmail || 'agent@plutoplat.com'}</p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Pending Approval
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 size={11} /> Approved
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                              <XCircle size={11} /> Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => approveProperty(prop.id)}
                                  className="px-2.5 py-1 text-xs font-semibold bg-[#287A50] hover:bg-emerald-800 text-white rounded-xs transition-colors cursor-pointer"
                                  title="Approve for public view"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectProperty(prop.id, 'Non-compliant documents')}
                                  className="px-2 py-1 text-xs font-semibold border border-red-300 text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                                  title="Reject listing"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => rejectProperty(prop.id, 'Unpublished by SuperAdmin')}
                                className="px-2 py-1 text-[11px] font-medium text-amber-800 hover:bg-amber-50 rounded-xs border border-amber-200 cursor-pointer"
                                title="Unpublish / Suspend"
                              >
                                Revoke
                              </button>
                            )}

                            {isRejected && (
                              <button
                                onClick={() => approveProperty(prop.id)}
                                className="px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50 rounded-xs border border-emerald-200 cursor-pointer"
                              >
                                Re-Approve
                              </button>
                            )}

                            <Link
                              to={`/property/${prop.id}`}
                              target="_blank"
                              className="p-1.5 text-[#6E6D66] hover:text-[#1C201C] rounded-xs border border-[#DDD8CE]"
                              title="View on Live Site"
                            >
                              <ExternalLink size={13} />
                            </Link>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete property "${prop.title}" permanently?`)) {
                                  deleteProperty(prop.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs cursor-pointer"
                              title="Delete Property"
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

        {/* Modal: Add Property */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-[#DDD8CE] rounded-sm max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DE] mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">Create Verified Property</h3>
                  <p className="text-[11px] text-[#6E6D66]">Direct SuperAdmin listing bypasses queue and publishes live.</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#8E8B82] hover:text-[#1C201C] p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Imperial Residence"
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Type *
                    </label>
                    <select
                      value={newProp.type}
                      onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    >
                      <option value="Villas">Villas</option>
                      <option value="Penthouses">Penthouses</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Townhouses">Townhouses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Numeric Price (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProp.numericPrice}
                      onChange={(e) => setNewProp({ ...newProp, numericPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      City, State/Country *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. South Mumbai, India"
                      value={newProp.location}
                      onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Square Feet
                    </label>
                    <input
                      type="text"
                      placeholder="7,500"
                      value={newProp.sqft}
                      onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
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
                    value={newProp.image}
                    onChange={(e) => setNewProp({ ...newProp, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Architectural provenance and bespoke features..."
                    value={newProp.description}
                    onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
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
                    className="px-4 py-2 bg-[#1C201C] hover:bg-black text-white font-semibold rounded-xs shadow-xs"
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
