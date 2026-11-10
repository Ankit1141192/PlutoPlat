import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

/* ─────────────────────────────────────────────
   Location data — curated city images
───────────────────────────────────────────── */
const LOCATIONS = [
  {
    id: 'civil-lines',
    city: 'Civil Lines',
    region: 'Kanpur, Uttar Pradesh',
    locationKey: 'Civil Lines',
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'swaroop-nagar',
    city: 'Swaroop Nagar',
    region: 'Kanpur, Uttar Pradesh',
    locationKey: 'Swaroop Nagar',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'vip-road',
    city: 'VIP Road & Ganga',
    region: 'Kanpur, Uttar Pradesh',
    locationKey: 'VIP Road',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tilak-nagar',
    city: 'Tilak Nagar',
    region: 'Kanpur, Uttar Pradesh',
    locationKey: 'Tilak Nagar',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    region: 'UAE',
    locationKey: 'Dubai',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'palm-jumeirah',
    city: 'Palm Jumeirah',
    region: 'Dubai, UAE',
    locationKey: 'Palm Jumeirah',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beverly-hills',
    city: 'Beverly Hills',
    region: 'California, USA',
    locationKey: 'Beverly Hills',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'manhattan',
    city: 'Manhattan',
    region: 'New York, USA',
    locationKey: 'Manhattan',
    image:
      'https://images.unsplash.com/photo-1470723710355-95304d8aece4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'malibu',
    city: 'Malibu',
    region: 'California, USA',
    locationKey: 'Malibu',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'miami-beach',
    city: 'Miami Beach',
    region: 'Florida, USA',
    locationKey: 'Miami Beach',
    image:
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=800&q=80',
  },
];

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
  const posRef = useRef(0);        // current translateX (negative = scrolled left)
  const pausedRef = useRef(false);
  const SPEED = 0.6;               // px per frame

  /* Count properties per location */
  const countByLocation = useMemo(() => {
    const map = {};
    LOCATIONS.forEach(({ locationKey }) => {
      const key = locationKey.toLowerCase();
      map[locationKey] = properties.filter((p) => {
        const locStr = (
          typeof p.location === 'string'
            ? p.location
            : `${p.location?.city || ''} ${p.location?.state || ''} ${p.location?.address || ''}`
        ).toLowerCase();
        const titleStr = (p.title || '').toLowerCase();
        return locStr.includes(key) || titleStr.includes(key);
      }).length;
    });
    return map;
  }, [properties]);

  /* Infinite marquee loop */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Width of one set of cards (half the total duplicated track)
    const getHalfWidth = () => track.scrollWidth / 2;

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current -= SPEED;
        // Reset seamlessly when the first copy has fully scrolled off
        if (Math.abs(posRef.current) >= getHalfWidth()) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleCardClick = (loc) => {
    navigate(`/properties?location=${encodeURIComponent(loc.locationKey)}`);
  };

  /* Duplicate locations for seamless infinite loop */
  const loopedLocations = [...LOCATIONS, ...LOCATIONS];

  return (
    <section className="py-20 overflow-hidden">
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
            From Kanpur&apos;s royal enclaves and Dubai&apos;s iconic skyline to
            California&apos;s coastal estates — filter by prime destination.
          </motion.p>
        </div>
      </div>

      {/* ── Marquee carousel ── */}
      {/*
        Outer wrapper: clips overflow, fades edges with mask
        pb accounts for the 48px vertical card offset at the bottom
      */}
      <div
        className="relative w-full"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* pb-12 = space for the down-shifted cards */}
        <div className="pb-12 pt-2">
          {/* Moving track — duplicated for seamless loop */}
          <div
            ref={trackRef}
            className="flex gap-5 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {loopedLocations.map((loc, idx) => {
              // Every odd index is shifted DOWN — creates the staggered up/down look
              const isDown = idx % 2 !== 0;
              const count = countByLocation[loc.locationKey] ?? 0;
              return (
                <LocationCard
                  key={`${loc.id}-${idx}`}
                  loc={loc}
                  count={count}
                  offset={isDown}
                  onClick={() => handleCardClick(loc)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── View all link ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={() => navigate('/properties')}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#B49A70] hover:text-[#1C201C] transition-colors duration-200"
        >
          <span className="underline underline-offset-4 decoration-[#B49A70]/40 group-hover:decoration-[#1C201C]/40 transition-colors duration-200">
            View all properties
          </span>
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </motion.div>
    </section>
  );
};

export default LocationFilterSection;
