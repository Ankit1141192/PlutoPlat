import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, MapPin, SlidersHorizontal, LayoutGrid, List, Map, 
  RotateCcw, ChevronDown, Check, Sparkles 
} from 'lucide-react';
import PropertyCard from '../Components/PropertyCard';
import PlutoMapExplorer from '../Components/PlutoMapExplorer';
import { usePropertyStore } from '../../context/PropertyContext';

const Property = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, formatPrice } = usePropertyStore();

  // URL search query initial states
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || 'All';
  const initialPurpose = searchParams.get('purpose') || 'All';

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedPurpose, setSelectedPurpose] = useState(initialPurpose);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBeds, setSelectedBeds] = useState('Any');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'beds'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if searchParams change externally
  useEffect(() => {
    setLocationInput(searchParams.get('location') || '');
    setSelectedType(searchParams.get('type') || 'All');
    setSelectedPurpose(searchParams.get('purpose') || 'All');
  }, [searchParams]);

  // Update query params when key filters change
  const applyFilterUpdates = (newLocation, newType, newPurpose) => {
    const params = new URLSearchParams();
    if (newLocation) params.set('location', newLocation);
    if (newType && newType !== 'All') params.set('type', newType);
    if (newPurpose && newPurpose !== 'All') params.set('purpose', newPurpose);
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setLocationInput('');
    setSelectedType('All');
    setSelectedPurpose('All');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBeds('Any');
    setSortBy('featured');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Filtered & Sorted Properties computation
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Location filter (handles string or object location safely)
        if (locationInput.trim()) {
          const loc = locationInput.toLowerCase();
          const locStr = (
            typeof p.location === 'string'
              ? p.location
              : `${p.location?.city || ''} ${p.location?.state || ''} ${p.location?.address || ''}`
          ).toLowerCase();
          const titleStr = (p.title || '').toLowerCase();
          const addrStr = (
            typeof p.address === 'string'
              ? p.address
              : (p.location?.address || '')
          ).toLowerCase();
          const matchLoc = locStr.includes(loc) || titleStr.includes(loc) || addrStr.includes(loc);
          if (!matchLoc) return false;
        }

        // Type / Category filter
        if (selectedType !== 'All' && p.type !== selectedType) {
          return false;
        }

        // Purpose filter (Buy / Rent)
        if (selectedPurpose !== 'All' && p.purpose !== selectedPurpose) {
          return false;
        }

        // Price range filter
        const priceNum = typeof p.numericPrice === 'number' ? p.numericPrice : (typeof p.price === 'number' ? p.price : 0);
        if (minPrice && priceNum < parseInt(minPrice, 10)) {
          return false;
        }
        if (maxPrice && priceNum > parseInt(maxPrice, 10)) {
          return false;
        }

        // Bedrooms filter
        if (selectedBeds !== 'Any') {
          const target = parseInt(selectedBeds, 10);
          if (selectedBeds === '4+') {
            if (p.beds < 4) return false;
          } else {
            if (p.beds !== target) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = typeof a.numericPrice === 'number' ? a.numericPrice : (typeof a.price === 'number' ? a.price : 0);
        const priceB = typeof b.numericPrice === 'number' ? b.numericPrice : (typeof b.price === 'number' ? b.price : 0);
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'beds') return (b.beds || 0) - (a.beds || 0);
        // Default: featured first
        return ((b.featured || b.isFeatured) ? 1 : 0) - ((a.featured || a.isFeatured) ? 1 : 0);
      });
  }, [
    properties,
    locationInput,
    selectedType,
    selectedPurpose,
    minPrice,
    maxPrice,
    selectedBeds,
    sortBy
  ]);

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
            <Sparkles size={13} />
            <span>Archive Index</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal">
            Prime Residences & Acreage
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 font-light">
            Showing {filteredProperties.length} vetted architectural estates matching your criteria.
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-4 py-2 bg-white border border-[#DDD8CE] rounded-xs text-xs font-semibold uppercase flex items-center gap-2 text-[#1C201C]"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#DDD8CE] text-xs uppercase font-semibold tracking-wider text-[#1C201C] rounded-xs focus:outline-none pr-8 cursor-pointer shadow-xs"
            >
              <option value="featured">Sort by: Curated First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="beds">Most Bedrooms</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77766E] pointer-events-none" />
          </div>

          {/* Grid / List / Map View Toggle */}
          <div className="flex items-center border border-[#DDD8CE] bg-white rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#1C201C] text-white shadow-xs' : 'text-[#77766E] hover:text-[#1C201C]'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#1C201C] text-white shadow-xs' : 'text-[#77766E] hover:text-[#1C201C]'
              }`}
              title="List View"
            >
              <List size={15} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'map' ? 'bg-[#B49A70] text-[#1C201C] font-bold shadow-xs' : 'text-[#77766E] hover:text-[#1C201C]'
              }`}
              title="Interactive Map View"
            >
              <Map size={15} />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:w-1/4 ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-white border border-[#DDD8CE] p-6 rounded-sm sticky top-28 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DE]">
              <h3 className="font-serif text-lg text-[#1C201C] font-normal flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#B49A70]" />
                <span>Refine Search</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#B49A70] hover:text-[#1C201C] flex items-center gap-1 uppercase tracking-wider font-semibold cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword / Location */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-2 tracking-wider">
                Location or Keyword
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49A70]" />
                <input
                  type="text"
                  placeholder="e.g. Beverly Hills, Malibu..."
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    applyFilterUpdates(e.target.value, selectedType, selectedPurpose);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div>

            {/* Category / Type */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-2 tracking-wider">
                Category
              </label>
              <div className="space-y-1.5">
                {['All', 'Homes', 'Villas', 'Apartments', 'Plots'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedType(t);
                      applyFilterUpdates(locationInput, t, selectedPurpose);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xs flex items-center justify-between transition-colors ${
                      selectedType === t
                        ? 'bg-[#1C201C] text-white font-semibold'
                        : 'text-[#6E6D66] hover:bg-[#F8F6F2] hover:text-[#1C201C]'
                    }`}
                  >
                    <span>{t === 'All' ? 'All Portfolios' : t}</span>
                    {selectedType === t && <Check size={14} className="text-[#B49A70]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Acquisition Purpose */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-2 tracking-wider">
                Acquisition Model
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs">
                {['All', 'Buy', 'Rent'].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPurpose(p);
                      applyFilterUpdates(locationInput, selectedType, p);
                    }}
                    className={`py-1.5 text-xs uppercase font-semibold tracking-wider rounded-xs transition-all ${
                      selectedPurpose === p
                        ? 'bg-[#1C201C] text-white shadow-xs'
                        : 'text-[#6E6D66] hover:text-[#1C201C]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-2 tracking-wider">
                Bedrooms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Any', '2', '3', '4', '4+'].map((beds) => (
                  <button
                    key={beds}
                    type="button"
                    onClick={() => setSelectedBeds(beds)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors ${
                      selectedBeds === beds
                        ? 'bg-[#1C201C] text-white border-[#1C201C]'
                        : 'bg-white border-[#DDD8CE] text-[#6E6D66] hover:border-[#1C201C]'
                    }`}
                  >
                    {beds}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-2 tracking-wider">
                Price Cap (USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Property Grid / List / Map Section */}
        <div className="lg:w-3/4">
          {viewMode === 'map' ? (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#E5E0D8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span className="text-xs font-semibold text-[#1C201C]">
                    Geospatial Map Radar &bull; Showing {filteredProperties.length} Vetted Listings
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#B49A70] uppercase tracking-wider">
                  ★ Listed by PlutoPlat Direct
                </span>
              </div>
              <PlutoMapExplorer height="680px" showControls={true} />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white border border-[#DDD8CE] rounded-sm p-12 text-center my-8">
              <h3 className="font-serif text-2xl text-[#1C201C] mb-2">No Properties Matched Your Criteria</h3>
              <p className="text-xs text-[#6E6D66] max-w-md mx-auto mb-6">
                Try widening your price range, clearing specific filters, or consulting directly with our Private Client Group for off-market estates.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#9E865F] cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:gap-6'
                  : 'space-y-6'
              }
            >
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop._id || prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;
