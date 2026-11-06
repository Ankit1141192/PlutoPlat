import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Phone, Mail, CheckCircle2, 
  XCircle, AlertCircle, ArrowRight, Plus, ExternalLink, ShieldCheck, Car, Video, MessageCircle
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import ScheduleTourModal from '../Components/ScheduleTourModal';

const ScheduledVisits = () => {
  const { scheduledVisits, updateVisitStatus, properties, user, showToast } = usePropertyStore();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredVisits = scheduledVisits.filter((visit) => {
    if (filterStatus === 'All') return true;
    return visit.status === filterStatus;
  });

  const handleOpenBooking = () => {
    if (properties && properties.length > 0) {
      setSelectedPropertyForModal(properties[0]);
      setIsBookingModalOpen(true);
    } else {
      showToast('Select a property from the archive to schedule a visit.', 'info');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Viewing Confirmed</span>
          </span>
        );
      case 'Pending Confirmation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={13} className="text-amber-600" />
            <span>Pending Concierge Review</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Car size={13} className="text-blue-600" />
            <span>Chauffeur En Route</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
            <CheckCircle2 size={13} className="text-gray-600" />
            <span>Tour Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={13} className="text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
              <Calendar size={14} />
              <span>Private Viewing Dossier</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal">
              Scheduled Property Visits
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 font-light">
              Manage your upcoming chauffeured estate inspections and private 4K virtual tours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenBooking}
              className="px-5 py-3 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Schedule New Visit</span>
            </button>

            <Link
              to="/deals"
              className="px-5 py-3 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2"
            >
              <span>View Deal Process &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-xl border border-[#DDD8CE] shadow-2xs">
          {['All', 'Confirmed', 'Pending Confirmation', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === tab
                  ? 'bg-[#1C201C] text-white shadow-xs'
                  : 'text-[#6E6D66] hover:bg-[#F8F6F2] hover:text-[#1C201C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Visits Listing */}
        {filteredVisits.length === 0 ? (
          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#B49A70]/10 text-[#B49A70] flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2 font-normal">No Visits Found</h3>
            <p className="text-xs text-[#6E6D66] mb-6 leading-relaxed">
              You do not have any scheduled viewings under the selected status filter.
            </p>
            <button
              onClick={handleOpenBooking}
              className="px-6 py-3 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-sm hover:bg-[#9E865F]"
            >
              Schedule a Visit Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  {/* Left: Property Preview & Details */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-grow">
                    <img
                      src={visit.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'}
                      alt={visit.propertyTitle}
                      className="w-full sm:w-44 h-32 rounded-xl object-cover border border-[#DDD8CE] shadow-2xs"
                    />

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase bg-[#1C201C] text-white px-2 py-0.5 rounded-sm">
                          {visit.id}
                        </span>
                        {getStatusBadge(visit.status)}
                        <span className="text-xs font-semibold text-[#B49A70] bg-[#B49A70]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          {visit.visitType === 'Chauffeured On-Site' ? <Car size={12} /> : <Video size={12} />}
                          <span>{visit.visitType}</span>
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-[#1C201C] font-semibold">
                        {visit.propertyTitle}
                      </h3>

                      <p className="text-xs text-[#6E6D66] flex items-center gap-1">
                        <MapPin size={13} className="text-[#B49A70]" />
                        <span>{visit.propertyLocation}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#1C201C] font-medium pt-1">
                        <span className="flex items-center gap-1 text-[#1C201C]">
                          <Calendar size={14} className="text-[#B49A70]" />
                          <span>{visit.date}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-[#1C201C]">
                          <Clock size={14} className="text-[#B49A70]" />
                          <span>{visit.timeSlot}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="font-serif text-sm font-bold text-[#B49A70]">
                          {visit.propertyPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Advisor Info & Actions */}
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#EAE6DE]">
                    {/* Advisor Details */}
                    <div className="flex items-center gap-3">
                      <img
                        src={visit.agentAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'}
                        alt={visit.agentName}
                        className="w-10 h-10 rounded-full object-cover border border-[#B49A70]"
                      />
                      <div className="text-left">
                        <p className="text-[10px] uppercase tracking-wider text-[#8E8B82] font-semibold">
                          Assigned Advisor
                        </p>
                        <p className="font-serif text-sm text-[#1C201C] font-semibold">
                          {visit.agentName || 'Michael Sharma'}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${visit.agentPhone || '+919821033445'}`}
                        className="p-2.5 bg-[#F8F6F2] hover:bg-[#EFECE4] text-[#1C201C] rounded-lg border border-[#DDD8CE] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Call Senior Advisor"
                      >
                        <Phone size={13} className="text-[#B49A70]" />
                        <span className="hidden sm:inline">Call</span>
                      </a>

                      <a
                        href={`https://wa.me/919956346155?text=Hello,%20I%20am%20inquiring%20about%20my%20scheduled%20visit%20${visit.id}%20for%20${encodeURIComponent(visit.propertyTitle)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-[#E8F8F3] hover:bg-[#d4f2e8] text-[#00A884] rounded-lg border border-[#A7E6D1] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="WhatsApp Concierge"
                      >
                        <MessageCircle size={13} />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      {visit.status === 'Pending Confirmation' && (
                        <button
                          onClick={() => updateVisitStatus(visit.id, 'Confirmed')}
                          className="px-3 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}

                      {visit.status !== 'Cancelled' && visit.status !== 'Completed' && (
                        <button
                          onClick={() => updateVisitStatus(visit.id, 'Cancelled')}
                          className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 rounded-lg border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes Box if present */}
                {visit.notes && (
                  <div className="mt-4 pt-3 border-t border-[#EAE6DE] text-xs text-[#6E6D66] bg-[#F8F6F2] p-3 rounded-xl flex items-center gap-2">
                    <ShieldCheck size={15} className="text-[#B49A70] shrink-0" />
                    <span><strong>Protocol Note:</strong> {visit.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal for Booking New Tour */}
        {isBookingModalOpen && selectedPropertyForModal && (
          <ScheduleTourModal
            property={selectedPropertyForModal}
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ScheduledVisits;
