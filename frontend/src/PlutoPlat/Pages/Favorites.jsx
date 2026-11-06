import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import PropertyCard from '../Components/PropertyCard';
import { usePropertyStore } from '../../context/PropertyContext';

const Favorites = () => {
  const { favoriteProperties, favorites, toggleFavorite, showToast } = usePropertyStore();

  const handleClearAll = () => {
    if (window.confirm('Clear all properties from your saved collection?')) {
      favorites.forEach((id) => toggleFavorite(id));
      showToast('All properties removed from your collection.', 'info');
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
            <Sparkles size={13} />
            <span>Private Curation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal">
            Your Saved Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 font-light">
            {favoriteProperties.length} architectural estates saved to your private watchlist.
          </p>
        </div>

        {favoriteProperties.length > 0 && (
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <button
              onClick={handleClearAll}
              className="text-xs uppercase tracking-wider font-semibold text-[#C74747] hover:text-[#9E2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear Collection</span>
            </button>
            <Link
              to="/contact?subject=Portfolio+Inquiry"
              className="px-5 py-2.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors shadow-xs"
            >
              Request Group Dossier
            </Link>
          </div>
        )}
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="bg-white border border-[#DDD8CE] rounded-sm p-16 text-center max-w-xl mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F8F6F2] flex items-center justify-center text-[#B49A70] mx-auto mb-4 border border-[#DDD8CE]">
            <Heart size={28} />
          </div>
          <h2 className="font-serif text-2xl text-[#1C201C] mb-2 font-normal">
            Your Collection is Currently Empty
          </h2>
          <p className="text-xs text-[#6E6D66] max-w-sm mx-auto mb-8 font-light leading-relaxed">
            Click the heart icon on any estate card across our portfolios to save properties for comparative evaluation or group viewing itineraries.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md"
          >
            <span>Discover Properties</span>
            <ArrowRight size={14} className="text-[#B49A70]" />
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {favoriteProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>

          {/* Bottom Concierge Action Box */}
          <div className="mt-16 bg-[#EFECE4] border border-[#DDD8CE] p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
                Coordinate a Multi-Estate Tour Itinerary
              </h3>
              <p className="text-xs text-[#6E6D66] font-light">
                Our Private Client Group can organize chauffeured viewings across all {favoriteProperties.length} saved properties in a seamless itinerary.
              </p>
            </div>
            <Link
              to="/contact?subject=Multi-Estate+Tour+Itinerary"
              className="px-6 py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs shrink-0 transition-colors shadow-xs"
            >
              Plan Private Tour
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
