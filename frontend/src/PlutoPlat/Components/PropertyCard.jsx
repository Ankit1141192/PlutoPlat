import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Square, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, formatPrice } = usePropertyStore();
  const favorited = isFavorite(property.id);

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group bg-white border border-[#E5E0D8] rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(28,32,28,0.04)] hover:shadow-[0_20px_40px_rgba(28,32,28,0.12)] hover:border-[#B49A70]/60 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE6DE]">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 flex flex-wrap items-center gap-1 sm:gap-1.5">
          {property.verified && (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-[#1C201C]/90 backdrop-blur-md text-[#E8D9BF] text-[8px] sm:text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#B49A70]/40 shadow-sm">
              <ShieldCheck size={11} className="text-[#B49A70]" />
              <span className="hidden sm:inline">Listed by</span> PlutoPlat
            </span>
          )}
          <span className="inline-block bg-white/95 backdrop-blur-md text-[#1C201C] text-[8px] sm:text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
            {property.purpose || 'Buy'}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleHeartClick}
          className={`absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            favorited
              ? 'bg-[#C74747] text-white scale-105'
              : 'bg-white/90 backdrop-blur-md text-[#555] hover:text-[#C74747] hover:bg-white hover:scale-110'
          }`}
        >
          <Heart size={14} className="sm:w-4 sm:h-4" fill={favorited ? 'currentColor' : 'none'} />
        </button>

        {/* Type Tag at bottom-left of image */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3.5">
          <span className="bg-[#B49A70] text-white text-[8px] sm:text-[10px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-sm sm:rounded-md shadow-sm">
            {property.type}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center text-[#77766E] text-[10px] sm:text-xs font-medium mb-1">
            <MapPin size={11} className="mr-1 text-[#B49A70] shrink-0 sm:w-3.5 sm:h-3.5" />
            <span className="truncate">{property.location}</span>
          </div>

          <h3 className="font-serif text-sm sm:text-xl md:text-2xl text-[#1C201C] group-hover:text-[#B49A70] transition-colors leading-snug line-clamp-1 mb-0.5 sm:mb-1 font-normal">
            {property.title}
          </h3>

          <p className="hidden sm:block text-xs text-[#77766E] line-clamp-1 mb-3 sm:mb-4 font-light">
            {property.subtitle || property.description}
          </p>
        </div>

        <div>
          {/* Price & Action Row */}
          <div className="flex items-baseline justify-between mb-2 sm:mb-4">
            <div>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#77766E] block font-semibold">
                Valuation
              </span>
              <span className="text-sm sm:text-xl md:text-2xl font-serif text-[#1C201C] font-semibold">
                {property.numericPrice ? formatPrice(property.numericPrice) : property.price}
              </span>
            </div>
            <span className="w-6 h-6 sm:w-9 sm:h-9 rounded-full border border-[#DEDAD1] flex items-center justify-center text-[#77766E] group-hover:bg-[#1C201C] group-hover:text-[#B49A70] group-hover:border-[#1C201C] transition-all duration-300 shadow-2xs">
              <ArrowUpRight size={13} className="sm:w-4 sm:h-4" />
            </span>
          </div>

          {/* Specs Footer */}
          <div className="flex items-center justify-between border-t border-[#F0ECE4] pt-2 sm:pt-3 text-[10px] sm:text-xs text-[#6E6D66] font-medium">
            {property.type !== 'Plots' && (
              <>
                <span className="flex items-center gap-1 sm:gap-1.5" title="Bedrooms">
                  <BedDouble size={12} className="text-[#B49A70] sm:w-3.5 sm:h-3.5" />
                  <span>{property.beds} <span className="hidden xs:inline">{property.beds === 1 ? 'Bed' : 'Beds'}</span></span>
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5" title="Bathrooms">
                  <Bath size={12} className="text-[#B49A70] sm:w-3.5 sm:h-3.5" />
                  <span>{property.baths} <span className="hidden xs:inline">{property.baths === 1 ? 'Bath' : 'Baths'}</span></span>
                </span>
              </>
            )}
            <span className="flex items-center gap-1 sm:gap-1.5" title="Total Area">
              <Square size={12} className="text-[#B49A70] sm:w-3.5 sm:h-3.5" />
              <span>{property.sqft} <span className="hidden xs:inline">sq.ft</span></span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
