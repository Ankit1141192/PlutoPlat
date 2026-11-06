import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle, Calendar, ArrowRight, 
  MapPin, Phone, Mail, Download, ShieldCheck, Sparkles 
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const MyEnquiries = () => {
  const { showToast } = usePropertyStore();
  const [filterStatus, setFilterStatus] = useState('All');

  const mockEnquiries = [
    {
      id: 'PLP-ENQ-9041',
      propertyId: 1,
      propertyTitle: 'The Sapphire Estate',
      location: 'Beverly Hills, CA',
      price: '$8,500,000',
      type: 'Villas',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      submittedDate: 'October 26, 2026',
      status: 'Tour Scheduled',
      statusLabel: 'Chauffeured Viewing Confirmed',
      statusColor: 'emerald',
      appointmentDate: 'Tomorrow at 02:30 PM PST',
      advisor: {
        name: 'Michael Harrison',
        title: 'Managing Director, Private Client Group',
        phone: '+1 (310) 849-2210',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
      },
      notes: 'Private Rolls-Royce chauffeur pickup coordinated at The Peninsula Beverly Hills. Dual security detail approved.'
    },
    {
      id: 'PLP-ENQ-8922',
      propertyId: 2,
      propertyTitle: 'Modern Cliffside Haven',
      location: 'Malibu, CA',
      price: '$12,400,000',
      type: 'Homes',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      submittedDate: 'October 24, 2026',
      status: 'Active Review',
      statusLabel: 'Under Lead Partner Review',
      statusColor: 'gold',
      appointmentDate: null,
      advisor: {
        name: 'Victoria Vance',
        title: 'Partner, Coastal Luxury Estates',
        phone: '+1 (310) 902-7711',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
      },
      notes: 'Architectural engineering reports and tide easement documents requested for family office counsel review.'
    },
    {
      id: 'PLP-ENQ-8610',
      propertyId: 3,
      propertyTitle: 'Central Park Penthouse',
      location: 'Manhattan, NY',
      price: '$18,900,000',
      type: 'Apartments',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80',
      submittedDate: 'October 15, 2026',
      status: 'Prospectus Dispatched',
      statusLabel: 'Confidential Dossier Received',
      statusColor: 'slate',
      appointmentDate: null,
      advisor: {
        name: 'Alexander Sterling',
        title: 'Senior Vice President, Manhattan Flagship',
        phone: '+1 (212) 555-0199',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      notes: 'Full floorplan CAD package and building co-op rules dispatched to client personal email.'
    }
  ];

  const filtered = mockEnquiries.filter((item) => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  const handleDownloadProspectus = (refId) => {
    showToast(`Downloading certified architectural prospectus for inquiry ${refId}...`, 'info');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
              <FileText size={14} />
              <span>Acquisition Tracker</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal">
              My Active Enquiries & Escrow
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 font-light">
              Real-time monitoring of your scheduled itineraries, private dossiers, and advisor communications.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            <Link
              to="/scheduled-visits"
              className="px-4 py-2 bg-white text-[#1C201C] border border-[#DDD8CE] hover:bg-[#F8F6F2] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Calendar size={13} className="text-[#B49A70]" />
              <span>Scheduled Visits</span>
            </Link>

            <Link
              to="/deals"
              className="px-4 py-2 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-[#B49A70]" />
              <span>Track 7-Stage Deal Process &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Tour Scheduled', 'Active Review', 'Prospectus Dispatched'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#B49A70] text-white shadow-xs'
                  : 'bg-white text-[#6E6D66] border border-[#DDD8CE] hover:text-[#1C201C]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        <div className="space-y-6">
          {filtered.map((enq) => (
            <div
              key={enq.id}
              className="bg-white border border-[#DDD8CE] rounded-sm p-6 sm:p-8 shadow-xs hover:border-[#B49A70] transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-[#EAE6DE] pb-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <img
                    src={enq.image}
                    alt={enq.propertyTitle}
                    className="w-28 h-20 sm:w-36 sm:h-24 object-cover rounded-xs border border-[#DDD8CE] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-[#B49A70] font-semibold">{enq.id}</span>
                      <span className="text-[#DDD8CE]">&bull;</span>
                      <span className="text-xs text-[#77766E]">Submitted {enq.submittedDate}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1C201C] font-normal leading-snug">
                      {enq.propertyTitle}
                    </h3>
                    <p className="text-xs text-[#6E6D66] flex items-center gap-1 mt-0.5">
                      <MapPin size={13} className="text-[#B49A70]" />
                      <span>{enq.location} &bull; <strong className="text-[#1C201C]">{enq.price}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="text-left lg:text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      enq.status === 'Tour Scheduled'
                        ? 'bg-[#287A50]/15 text-[#287A50] border border-[#287A50]/30'
                        : enq.status === 'Active Review'
                        ? 'bg-[#B49A70]/15 text-[#8C7146] border border-[#B49A70]/30'
                        : 'bg-[#1C201C]/10 text-[#1C201C] border border-[#1C201C]/20'
                    }`}
                  >
                    <CheckCircle size={13} />
                    <span>{enq.statusLabel}</span>
                  </span>
                  {enq.appointmentDate && (
                    <div className="text-xs font-semibold text-[#1C201C] mt-2 flex items-center lg:justify-end gap-1.5">
                      <Calendar size={13} className="text-[#B49A70]" />
                      <span>{enq.appointmentDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Notes & Assigned Advisor */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 bg-[#F8F6F2] p-4 rounded-xs border border-[#DDD8CE] text-xs text-[#555] font-light leading-relaxed">
                  <strong className="font-medium text-[#1C201C] block mb-1">Status Dossier Notes:</strong>
                  {enq.notes}
                </div>

                <div className="md:col-span-4 flex items-center gap-3">
                  <img
                    src={enq.advisor.avatar}
                    alt={enq.advisor.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#B49A70]/40 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8E8B82] block">Assigned Advisor</span>
                    <h4 className="font-serif text-sm font-semibold text-[#1C201C] leading-snug">{enq.advisor.name}</h4>
                    <span className="text-[11px] text-[#77766E]">{enq.advisor.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 pt-4 border-t border-[#EAE6DE] flex flex-wrap gap-3 justify-end items-center">
                <button
                  type="button"
                  onClick={() => handleDownloadProspectus(enq.id)}
                  className="px-4 py-2 border border-[#DDD8CE] text-[#1C201C] hover:bg-[#F8F6F2] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Dossier</span>
                </button>

                <a
                  href={`tel:${enq.advisor.phone}`}
                  className="px-4 py-2 border border-[#DDD8CE] text-[#1C201C] hover:bg-[#F8F6F2] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={13} className="text-[#B49A70]" />
                  <span>Direct Hotline</span>
                </a>

                <Link
                  to={`/property/${enq.propertyId}`}
                  className="px-5 py-2 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Review Estate Page</span>
                  <ArrowRight size={13} className="text-[#B49A70]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Helper */}
        <div className="mt-12 text-center text-xs text-[#77766E]">
          <span>Need immediate assistance with an ongoing transaction? Contact the </span>
          <Link to="/contact" className="text-[#1C201C] font-semibold underline">
            Private Client Escrow Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyEnquiries;
