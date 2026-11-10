import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, MapPin, SlidersHorizontal, ArrowLeft, 
  Map, LayoutGrid, RotateCcw, Sparkles 
} from 'lucide-react';
import PropertyCard from '../Components/PropertyCard';
import PlutoMapExplorer from '../Components/PlutoMapExplorer';
import { usePropertyStore } from '../../context/PropertyContext';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties } = usePropertyStore();

  const queryParam = searchParams.get('q') || searchParams.get('location') || '';
  const typeParam = searchParams.get('type') || 'All';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || searchParams.get('location') || '');
    setSelectedType(searchParams.get('type') || 'All');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedType !== 'All') params.set('type', selectedType);
    setSearchParams(params);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const locStr = (
          typeof p.location === 'string'
            ? p.location
            : `${p.location?.city || ''} ${p.location?.state || ''} ${p.location?.address || ''}`
        ).toLowerCase();
        const addrStr = (
          typeof p.address === 'string'
            ? p.address
            : (p.location?.address || '')
        ).toLowerCase();
        const matches =
          (p.title || '').toLowerCase().includes(q) ||
          locStr.includes(q) ||
          addrStr.includes(q) ||
          (p.type || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedType !== 'All' && p.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [properties, searchQuery, selectedType]);

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#6E6D66] hover:text-[#1C201C] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Complete Archive</span>
          </Link>
        </div>

        {/* Search Console Header */}
        <div className="bg-white border border-[#DDD8CE] p-6 sm:p-8 rounded-sm shadow-xs mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-3">
            <Sparkles size={13} />
            <span>Global Architectural Query Engine</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B49A70]" />
              <input
                type="text"
                placeholder="Search by city, neighborhood, architectural style, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#F8F6F2] border border-[#DDD8CE] text-sm text-[#1C201C] rounded-xs focus:outline-none focus:border-[#B49A70] transition-colors"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3.5 bg-[#F8F6F2] border border-[#DDD8CE] text-xs uppercase font-semibold tracking-wider text-[#1C201C] rounded-xs focus:outline-none pr-8 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Homes">Homes</option>
              <option value="Villas">Villas</option>
              <option value="Apartments">Apartments</option>
              <option value="Plots">Plots</option>
            </select>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              Search Archive
            </button>
          </form>

          {/* Quick Enclaves Suggestions */}
          <div className="mt-4 pt-3 border-t border-[#F0ECE2] flex flex-wrap items-center gap-2 text-xs text-[#77766E]">
            <span className="font-semibold text-[#1C201C]">Direct Suggestions:</span>
            {['Beverly Hills', 'Malibu', 'Manhattan', 'Aspen', 'Lake Tahoe', 'Villas', 'Plots'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  const params = new URLSearchParams();
                  params.set('q', tag);
                  setSearchParams(params);
                }}
                className="px-2.5 py-1 bg-[#F8F6F2] hover:bg-[#EAE6DE] text-[#444] rounded-xs border border-[#DDD8CE] transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Architectural Discoveries'}
            </h2>
            <p className="text-xs text-[#77766E] mt-0.5">
              Found {filteredProperties.length} verified trophy estates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMapView(false)}
              className={`p-2 border rounded-xs text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                !isMapView
                  ? 'bg-[#1C201C] text-white border-[#1C201C]'
                  : 'bg-white text-[#6E6D66] border-[#DDD8CE] hover:text-[#1C201C]'
              }`}
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Grid View</span>
            </button>

            <button
              onClick={() => setIsMapView(true)}
              className={`p-2 border rounded-xs text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isMapView
                  ? 'bg-[#1C201C] text-white border-[#1C201C]'
                  : 'bg-white text-[#6E6D66] border-[#DDD8CE] hover:text-[#1C201C]'
              }`}
            >
              <Map size={15} />
              <span className="hidden sm:inline">Satellite Map</span>
            </button>
          </div>
        </div>

        {/* Map View or Grid View */}
        {isMapView ? (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#E5E0D8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span className="text-xs font-semibold text-[#1C201C]">
                  Live Interactive Map Radar &bull; Showing properties matching search
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#B49A70] uppercase tracking-wider">
                ★ Listed by PlutoPlat Direct
              </span>
            </div>
            <PlutoMapExplorer height="620px" showControls={true} />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white border border-[#DDD8CE] p-12 text-center rounded-sm">
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2 font-normal">
              No Direct Matches Found for "{searchQuery}"
            </h3>
            <p className="text-xs text-[#6E6D66] max-w-sm mx-auto mb-6 font-light">
              We recommend broadening your search keyword or requesting an off-market search directly from our Private Client Desk.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSearchParams(new URLSearchParams());
              }}
              className="px-6 py-2.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
