import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, BedDouble, Bath, Square, Calendar, Car, ShieldCheck, 
  Heart, ArrowLeft, Phone, Mail, Check, Share2, Sparkles, Home, Compass, Navigation 
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import PropertyCard from '../Components/PropertyCard';
import ScheduleTourModal from '../Components/ScheduleTourModal';
import EnquiryModal from '../Components/EnquiryModal';
import PlutoMapExplorer from '../Components/PlutoMapExplorer';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getPropertyById, properties, isFavorite, toggleFavorite, 
    formatPrice, showToast, recordRecentlyViewed 
  } = usePropertyStore();

  const property = getPropertyById(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    if (property?.id && recordRecentlyViewed) {
      recordRecentlyViewed(property.id);
    }
  }, [property?.id, recordRecentlyViewed]);

  if (!property) {
    return (
      <div className="pt-36 pb-24 text-center px-6 min-h-screen">
        <h2 className="font-serif text-3xl text-[#1C201C] mb-4">Property Not Found</h2>
        <p className="text-xs text-[#6E6D66] mb-6">
          The requested estate may have been acquired or privatized under off-market status.
        </p>
        <Link
          to="/properties"
          className="px-6 py-3 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(property.id);
  const galleryImages = property.images && property.images.length > 0 ? property.images : [property.image];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Confidential listing link copied to clipboard.', 'success');
    }
  };

  const similarProperties = properties
    .filter((p) => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-6 text-xs text-[#6E6D66]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 hover:text-[#1C201C] transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft size={15} />
          <span>Back to Archive</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2 bg-white border border-[#DDD8CE] rounded-xs hover:text-[#1C201C] transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Share Estate Link"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleFavorite(property.id)}
            className={`p-2 border rounded-xs transition-colors flex items-center gap-1.5 shadow-2xs ${
              favorited
                ? 'bg-[#C74747] text-white border-[#C74747]'
                : 'bg-white border-[#DDD8CE] hover:text-[#C74747]'
            }`}
          >
            <Heart size={14} fill={favorited ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Architectural Gallery */}
      <div className="mb-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-xs bg-[#EAE6DE] shadow-md mb-3">
          <img
            src={galleryImages[activeImageIndex]}
            alt={`${property.title} view ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute bottom-4 left-4 bg-[#1C201C]/80 backdrop-blur-md text-white text-[11px] uppercase tracking-widest px-3 py-1 rounded-xs">
            Image {activeImageIndex + 1} of {galleryImages.length}
          </div>
        </div>

        {/* Thumbnails Row */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-28 h-18 sm:w-32 sm:h-20 shrink-0 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-[#B49A70] scale-95 opacity-100 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Main Details & Sticky Agent Concierge Card */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Main Property Dossier */}
        <div className="lg:w-2/3 space-y-12">
          {/* Header & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-[#1C201C] text-[#E8D9BF] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs">
                {property.type}
              </span>
              <span className="bg-[#EFECE4] text-[#1C201C] text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-xs border border-[#DDD8CE]">
                For {property.purpose}
              </span>
              {property.verified && (
                <span className="text-[#287A50] text-xs font-semibold flex items-center gap-1 ml-2">
                  <ShieldCheck size={14} /> Title & Deed Verified
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight mb-2">
              {property.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#B49A70] uppercase tracking-wider font-medium mb-3">
              {property.subtitle}
            </p>
            <p className="flex items-center text-xs text-[#6E6D66]">
              <MapPin size={14} className="mr-1 text-[#B49A70]" />
              <span>{property.address || property.location}</span>
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-[#DDD8CE] rounded-sm shadow-xs">
            {property.type !== 'Plots' && (
              <>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-[#8E8B82] mb-1">Bedrooms</span>
                  <span className="font-serif text-2xl text-[#1C201C] flex items-center gap-2">
                    <BedDouble size={20} className="text-[#B49A70]" />
                    <span>{property.beds}</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-[#8E8B82] mb-1">Bathrooms</span>
                  <span className="font-serif text-2xl text-[#1C201C] flex items-center gap-2">
                    <Bath size={20} className="text-[#B49A70]" />
                    <span>{property.baths}</span>
                  </span>
                </div>
              </>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-[#8E8B82] mb-1">Living Area</span>
              <span className="font-serif text-2xl text-[#1C201C] flex items-center gap-2">
                <Square size={20} className="text-[#B49A70]" />
                <span>{property.sqft} sq.ft</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-[#8E8B82] mb-1">Lot Size</span>
              <span className="font-serif text-2xl text-[#1C201C] flex items-center gap-2">
                <Home size={20} className="text-[#B49A70]" />
                <span className="text-xl">{property.lotSize || 'Generous Lot'}</span>
              </span>
            </div>
          </div>

          {/* Architectural Narrative Description */}
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-4">
              Architectural Statement & Dossier
            </h2>
            <p className="text-xs sm:text-sm text-[#555] leading-relaxed font-light mb-4">
              {property.description}
            </p>
          </div>

          {/* Key Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="font-serif text-xl text-[#1C201C] font-normal mb-4">
                Exclusive Engineering Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#444] p-3 bg-white border border-[#EAE6DE] rounded-xs">
                    <Check size={15} className="text-[#B49A70] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities & Security */}
          {property.amenities && (
            <div>
              <h3 className="font-serif text-xl text-[#1C201C] font-normal mb-4">
                Amenities & Private Infrastructure
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-white border border-[#DDD8CE] text-xs font-medium text-[#222522] rounded-xs flex items-center gap-1.5"
                  >
                    <Sparkles size={12} className="text-[#B49A70]" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Geospatial Provenance & Interactive Property Location Map */}
          {property.coordinates && (
            <div className="pt-8 border-t border-[#EAE6DE]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B49A70] mb-1">
                    <Compass size={13} />
                    <span>Geospatial Radar &bull; Listed by PlutoPlat</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#1C201C] font-normal">
                    Location & Neighborhood Dossier
                  </h3>
                </div>
                <div className="text-xs text-[#77766E] font-mono bg-white px-3 py-1.5 rounded-md border border-[#DDD8CE]">
                  GPS: {property.coordinates.lat.toFixed(4)}° N, {property.coordinates.lng.toFixed(4)}° {property.coordinates.lng < 0 ? 'W' : 'E'}
                </div>
              </div>

              <p className="text-xs text-[#6E6D66] mb-4 font-light">
                Situated in prestigious <strong className="font-semibold text-[#1C201C]">{property.location}</strong> ({property.address}). Verified against municipal cadastre & land registry.
              </p>

              <div className="rounded-2xl overflow-hidden border border-[#E5E0D8] shadow-md">
                <PlutoMapExplorer
                  selectedPropertyId={property.id}
                  singlePropertyMode={true}
                  height="360px"
                  showControls={false}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E6D66] bg-white p-3 rounded-xl border border-[#EAE6DE]">
                <span className="flex items-center gap-1.5 font-medium text-[#1C201C]">
                  <ShieldCheck size={15} className="text-[#10B981]" />
                  <span>Cadastral Boundary Authenticated by PlutoPlat</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#B49A70] hover:text-[#1C201C] inline-flex items-center gap-1"
                >
                  <Navigation size={13} />
                  <span>Open in Navigation GPS &rarr;</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sticky Acquisition & Agent Concierge Box */}
        <div className="lg:w-1/3">
          <div className="bg-white border border-[#DDD8CE] p-6 sm:p-8 rounded-sm sticky top-28 shadow-sm space-y-6">
            {/* Guide Price */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#8E8B82] tracking-wider block mb-1">
                Offering Valuation
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-semibold">
                {property.numericPrice ? formatPrice(property.numericPrice) : property.price}
              </div>
              <p className="text-[11px] text-[#77766E] mt-1">
                Direct escrow terms available. Tax structures upon application.
              </p>
            </div>

            <div className="border-t border-[#EAE6DE] pt-6">
              {/* Assigned Senior Advisor Card */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={property.agent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                  alt={property.agent?.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#B49A70]/50"
                />
                <div>
                  <h4 className="font-serif text-base text-[#1C201C] font-semibold">
                    {property.agent?.name || 'Michael Harrison'}
                  </h4>
                  <p className="text-xs text-[#77766E] font-sans">
                    {property.agent?.title || 'Senior Real Estate Advisor'}
                  </p>
                  <p className="text-[10px] text-[#B49A70] font-mono mt-0.5">
                    Rating: {property.agent?.rating || '4.98'} &bull; {property.agent?.dealsClosed || '100+'} Closed
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsTourModalOpen(true)}
                  className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>Schedule Private Visit</span>
                </button>

                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail size={15} />
                  <span>Request Full Prospectus</span>
                </button>

                <a
                  href={`tel:${property.agent?.phone || '+919956346155'}`}
                  className="w-full py-3 border border-[#DDD8CE] text-[#1C201C] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#F8F6F2] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone size={14} className="text-[#B49A70]" />
                  <span>Call: {property.agent?.phone || '+91 9956346155'}</span>
                </a>

                <a
                  href={`https://wa.me/919956346155?text=Hello%20PlutoPlat,%20I%20am%20inquiring%20about%20*${encodeURIComponent(
                    property.title
                  )}*%20(${property.location}).%20Please%20share%20details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#E8F8F3] border border-[#A7E6D1] text-[#00A884] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#d6f4ea] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>WhatsApp Concierge (+91 9956346155)</span>
                </a>
              </div>
            </div>

            <div className="text-[11px] text-[#8E8B82] leading-relaxed pt-2 border-t border-[#EAE6DE] text-center">
              Confidentiality guaranteed. All viewings arranged under discrete protocol.
            </div>
          </div>
        </div>
      </div>

      {/* Similar Estates Section */}
      {similarProperties.length > 0 && (
        <div className="mt-24 pt-16 border-t border-[#DDD8CE]">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-1">
                Comparable Architecture
              </span>
              <h3 className="font-serif text-3xl text-[#1C201C] font-normal">
                Similar {property.type} Portfolios
              </h3>
            </div>
            <Link
              to={`/properties?type=${property.type}`}
              className="text-xs uppercase font-semibold tracking-wider text-[#B49A70] hover:text-[#1C201C] transition-colors"
            >
              View All {property.type} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Tour and Enquiry Modals */}
      <ScheduleTourModal
        property={property}
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />

      <EnquiryModal
        property={property}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
};

export default PropertyDetail;
