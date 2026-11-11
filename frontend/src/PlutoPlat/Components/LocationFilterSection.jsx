import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Building2, PlusCircle } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

/* ─────────────────────────────────────────────
   Single location card
───────────────────────────────────────────── */
const LocationCard = ({ loc, count, offset, onClick }) => (
  <div
    onClick={onClick}
    className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[20px] shadow-lg hover:shadow-2xl transition-shadow duration-300"
    style={{
      width: '240px',
      height: '320px',
      marginTop: offset ? '48px' : '0px', // alternating vertical offset
    }}
  >
    {/* Photo */}
    <img
      src={loc.image}
      alt={loc.city}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

    {/* Gold shimmer top accent on hover */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Bottom content */}
    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 flex items-end justify-between">
      <div>
        <h3 className="font-serif text-xl font-semibold text-white leading-tight group-hover:text-[#E8D9BF] transition-colors duration-300">
          {loc.city}
        </h3>
        <span className="text-xs text-white/70 font-light tracking-wide block mt-0.5">
          {count} {count === 1 ? 'Property' : 'Properties'}
        </span>
      </div>

      {/* Arrow CTA */}
      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#B49A70] group-hover:scale-110 transition-all duration-300 shrink-0">
        <ArrowRight size={15} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
const LocationFilterSection = () => {
  const navigate = useNavigate();
  const { properties } = usePropertyStore();
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const SPEED = 0.6;

  /* Derive locations dynamically from real properties added by SuperAdmin or Admin */
  const locations = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    const cityMap = new Map();

    properties.forEach((p) => {
      let city = '';
      let region = '';

      if (p.locationDetails && typeof p.locationDetails === 'object') {
        city = p.locationDetails.city || '';
        region = [p.locationDetails.state, p.locationDetails.country].filter(Boolean).join(', ');
      }
      if (!city && typeof p.location === 'string') {
        const parts = p.location.split(',').map((s) => s.trim());
        city = parts[0] || 'Prime Enclave';
        region = parts.slice(1).join(', ') || 'Metropolitan';
      }
      if (!city) city = 'Prime Corridor';

      const key = city.trim();
      const normKey = key.toLowerCase();

      if (!cityMap.has(normKey)) {
        cityMap.set(normKey, {
          id: normKey.replace(/\s+/g, '-'),
          city: key,
          region: region || 'Exclusive Enclave',
          locationKey: key,
          image:
            p.image ||
            (p.images && p.images[0]) ||
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
          count: 1,
        });
      } else {
        const item = cityMap.get(normKey);
        item.count += 1;
      }
    });

    return Array.from(cityMap.values());
  }, [properties]);

  /* Infinite marquee loop */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || locations.length === 0) return;

    const getHalfWidth = () => track.scrollWidth / 2;

    const tick = () => {
      if (!pausedRef.current && track) {
        posRef.current -= SPEED;
        if (Math.abs(posRef.current) >= getHalfWidth()) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [locations]);

  const handleCardClick = (loc) => {
    navigate(`/properties?location=${encodeURIComponent(loc.locationKey)}`);
  };

  /* Duplicate locations for continuous loop */
  const loopedLocations = useMemo(() => {
    if (locations.length === 0) return [];
    if (locations.length < 5) {
      return [...locations, ...locations, ...locations, ...locations];
    }
    return [...locations, ...locations];
  }, [locations]);

  return (
    <section className="py-20 overflow-hidden bg-transparent">
      {/* ── Header ── */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B49A70] uppercase tracking-widest mb-2"
            >
              <MapPin size={13} />
              Browse by Destination
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight"
            >
              Explore Properties
              <span className="italic text-[#B49A70]"> by Location</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-sm text-[#6E6D66] max-w-sm font-light leading-relaxed"
          >
            Real-time verified destinations populated directly from platform listings submitted by authorized agents and platform administration.
          </motion.p>
        </div>
      </div>

      {/* ── Dynamic Locations Marquee or Empty State ── */}
      {locations.length === 0 ? (
        <div className="max-w-xl mx-auto px-6 py-12 text-center bg-white border border-[#E7E3DA] rounded-2xl shadow-sm space-y-3">
          <Building2 size={36} className="mx-auto text-[#B49A70]" />
          <h4 className="font-serif text-xl font-semibold text-[#1C201C]">
            Awaiting Location Listings
          </h4>
          <p className="text-xs sm:text-sm text-[#6E6D66] font-light">
            When SuperAdmin or Admin adds properties to the platform, their locations and photography will appear dynamically in this destination carousel.
          </p>
        </div>
      ) : (
        <div
          className="relative w-full"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          <div
            ref={trackRef}
            className="flex items-start gap-6 pb-12 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {loopedLocations.map((loc, index) => (
              <LocationCard
                key={`${loc.id}-${index}`}
                loc={loc}
                count={loc.count}
                offset={index % 2 === 1}
                onClick={() => handleCardClick(loc)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LocationFilterSection;
