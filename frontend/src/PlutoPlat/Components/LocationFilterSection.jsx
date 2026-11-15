import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

/* ─────────────────────────────────────────────
   Single location card with alternating up/down stagger
───────────────────────────────────────────── */
const LocationCard = ({ loc, count, offset, onClick }) => (
  <div
    onClick={onClick}
    className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl md:rounded-[20px] shadow-md hover:shadow-2xl transition-all duration-300 w-[170px] h-[230px] sm:w-[210px] sm:h-[280px] md:w-[240px] md:h-[320px] select-none ${
      offset ? 'mt-7 sm:mt-9 md:mt-12' : 'mt-0'
    }`}
  >
    {/* Photo */}
    <img
      src={loc.image}
      alt={loc.city}
      loading="lazy"
      draggable={false}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
    />

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300 pointer-events-none" />

    {/* Gold shimmer top accent on hover */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* Bottom content */}
    <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4 flex items-end justify-between pointer-events-none">
      <div className="min-w-0 pr-2">
        <h3 className="font-serif text-base sm:text-xl font-semibold text-white leading-tight truncate group-hover:text-[#E8D9BF] transition-colors duration-300">
          {loc.city}
        </h3>
        <span className="text-[10px] sm:text-xs text-white/75 font-light tracking-wide block mt-0.5 truncate">
          {count} {count === 1 ? 'Property' : 'Properties'}
        </span>
      </div>

      {/* Arrow CTA */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#B49A70] group-hover:scale-110 transition-all duration-300 shrink-0">
        <ArrowRight size={14} />
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

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  // Drag / touch gesture tracking
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startPosRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const gestureAxisRef = useRef(null); // 'x' | 'y' | null

  const SPEED = 0.55;

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

  /* Helper to normalize position across seamless infinite loop */
  const normalizePos = useCallback((pos) => {
    const track = trackRef.current;
    if (!track) return pos;
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return pos;

    let p = pos % halfWidth;
    if (p > 0) p -= halfWidth;
    return p;
  }, []);

  /* Infinite marquee animation tick */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || locations.length === 0) return;

    const tick = () => {
      if (!pausedRef.current && !isDraggingRef.current && track) {
        // If there's residual momentum from a finger flick
        if (Math.abs(velocityRef.current) > 0.05) {
          posRef.current += velocityRef.current;
          velocityRef.current *= 0.92; // smooth friction
        } else {
          velocityRef.current = 0;
          posRef.current -= SPEED;
        }

        posRef.current = normalizePos(posRef.current);
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [locations, normalizePos]);

  /* Schedule auto-scroll resume after user interaction */
  const scheduleResume = (delayMs = 2000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      isDraggingRef.current = false;
    }, delayMs);
  };

  /* ─────────────────────────────────────────────
     Touch & Drag Event Handlers for Mobile & Desktop
  ───────────────────────────────────────────── */
  const handlePointerDown = (clientX, clientY) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = clientX;
    startYRef.current = clientY;
    startPosRef.current = posRef.current;
    lastXRef.current = clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
    gestureAxisRef.current = null;
  };

  const handlePointerMove = (clientX, clientY, e) => {
    if (!isDraggingRef.current) return;

    const deltaX = clientX - startXRef.current;
    const deltaY = clientY - startYRef.current;
    const totalDist = Math.hypot(deltaX, deltaY);

    if (totalDist > 4) {
      dragDistanceRef.current = totalDist;
    }

    // Determine gesture direction on first moves
    if (!gestureAxisRef.current && totalDist > 6) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        gestureAxisRef.current = 'x';
      } else {
        gestureAxisRef.current = 'y';
      }
    }

    // If scrolling vertically, let the browser handle page scroll
    if (gestureAxisRef.current === 'y') {
      return;
    }

    // Horizontal finger swipe on carousel: prevent vertical page jumping
    if (gestureAxisRef.current === 'x' && e && e.cancelable) {
      e.preventDefault();
    }

    const now = Date.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dx = clientX - lastXRef.current;
    velocityRef.current = (dx / dt) * 12; // velocity boost for natural flick glide
    lastXRef.current = clientX;
    lastTimeRef.current = now;

    posRef.current = normalizePos(startPosRef.current + deltaX);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${posRef.current}px)`;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    gestureAxisRef.current = null;

    // Limit maximum flick velocity for elegance
    velocityRef.current = Math.max(-18, Math.min(18, velocityRef.current));
    scheduleResume(2200);
  };

  // Touch event handlers
  const onTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }
  };

  const onTouchEnd = () => handlePointerUp();
  const onTouchCancel = () => handlePointerUp();

  // Mouse event handlers for desktop click-drag
  const onMouseDown = (e) => {
    if (e.button === 0) { // left button only
      handlePointerDown(e.clientX, e.clientY);
    }
  };

  const onMouseMove = (e) => {
    handlePointerMove(e.clientX, e.clientY, e);
  };

  const onMouseUp = () => handlePointerUp();
  const onMouseLeave = () => {
    if (isDraggingRef.current) handlePointerUp();
    else pausedRef.current = false;
  };

  const handleCardClick = (loc) => {
    // If the user was swiping or dragging, ignore the click to avoid unintended navigation
    if (dragDistanceRef.current > 7) {
      return;
    }
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
    <section className="py-8 sm:py-14 md:py-20 overflow-hidden bg-transparent">
      {/* ── Header (clean headline & description, no extra buttons) ── */}
      <div className="px-3.5 sm:px-6 max-w-7xl mx-auto mb-4 sm:mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#B49A70] uppercase tracking-widest mb-1.5"
            >
              <MapPin size={12} className="sm:w-[13px] sm:h-[13px]" />
              Browse by Destination
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight"
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
            className="text-xs sm:text-sm text-[#6E6D66] max-w-sm font-light leading-relaxed hidden sm:block"
          >
            Verified destinations populated directly from platform listings submitted by authorized agents.
          </motion.p>
        </div>
      </div>

      {/* ── Dynamic Locations Carousel with alternating up/down cards ── */}
      {locations.length === 0 ? (
        <div className="max-w-xl mx-auto px-5 py-8 text-center bg-white border border-[#E7E3DA] rounded-2xl shadow-sm space-y-2.5">
          <Building2 size={32} className="mx-auto text-[#B49A70]" />
          <h4 className="font-serif text-lg font-semibold text-[#1C201C]">
            Awaiting Location Listings
          </h4>
          <p className="text-xs text-[#6E6D66] font-light">
            When properties are added to the platform, their locations will appear dynamically in this destination carousel.
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full cursor-grab active:cursor-grabbing touch-pan-y select-none"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          }}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        >
          <div
            ref={trackRef}
            className="flex items-start gap-3 sm:gap-5 md:gap-6 pb-6 sm:pb-10 md:pb-14 will-change-transform"
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
