import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, ArrowRight, Heart, MapPin, Eye, Building } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import PropertyCard from '../Components/PropertyCard';

const RecentlyViewed = () => {
  const { recentlyViewedProperties, clearRecentlyViewed, favorites } = usePropertyStore();

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
              <Clock size={14} />
              <span>Browsing Telemetry</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal">
              Recently Viewed Properties
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 font-light">
              Revisit luxury estates and penthouses you recently inspected on PlutoPlat.
            </p>
          </div>

          {recentlyViewedProperties.length > 0 && (
            <button
              onClick={clearRecentlyViewed}
              className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-[#DDD8CE] hover:border-rose-200 text-xs uppercase tracking-wider font-semibold rounded-xs shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Content */}
        {recentlyViewedProperties.length === 0 ? (
          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#B49A70]/10 text-[#B49A70] flex items-center justify-center mx-auto mb-4">
              <Eye size={28} />
            </div>
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2 font-normal">No Recent Properties</h3>
            <p className="text-xs text-[#6E6D66] mb-6 leading-relaxed">
              You haven't inspected any luxury listings yet. Explore our curated collections to build your browsing archive.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-md transition-colors"
            >
              <span>Explore Portfolio</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 text-xs text-[#6E6D66]">
              <span>Showing {recentlyViewedProperties.length} recently inspected portfolios</span>
              <Link to="/favorites" className="text-[#B49A70] hover:underline font-semibold flex items-center gap-1">
                <span>View Saved ({favorites.length}) &rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
              {recentlyViewedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
