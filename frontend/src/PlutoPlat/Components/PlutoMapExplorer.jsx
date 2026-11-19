import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // REQUIRED for Leaflet map tiles and controls
import { MapPin, ArrowUpRight, X, Hash, Eye, EyeOff, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { WhatsAppIcon } from './RegisterInterestModal';

// ─── Free, Zero-Key, Reliable Tile Providers (No Watermarks, No API Key Required) ─
export const TILE_LAYERS = {
  streets: {
    id: 'streets',
    label: 'Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    },
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics',
      maxZoom: 19,
    },
  },
  terrain: {
    id: 'terrain',
    label: 'Terrain',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    },
  },
};

// Suppress Leaflet default marker icon asset lookup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '' });

const REGIONS = [
  { label: 'Kanpur & UP', center: [26.474, 80.335], zoom: 12 },
  { label: 'Global View', center: [28.5, -30.0], zoom: 3 },
  { label: 'Dubai & UAE', center: [25.18, 55.3], zoom: 11 },
  { label: 'California', center: [34.05, -118.45], zoom: 11 },
  { label: 'New York', center: [40.74, -73.98], zoom: 12 },
  { label: 'Miami Beach', center: [25.82, -80.13], zoom: 13 },
  { label: 'Aspen & Tahoe', center: [39.19, -106.82], zoom: 11 },
];

export const getPropertyCode = (id) => {
  if (!id) return 'PP-0001';
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '');
  return `PP-${clean.slice(-4).toUpperCase()}`;
};

const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

// ─── Teardrop drop-pin icon ──────────────────────────────────────────────────
const buildDropPin = (property, isActive) => {
  const bg = isActive ? '#B49A70' : '#1C201C';
  const border = isActive ? '#FFFFFF' : '#B49A70';
  const dot = property?.purpose === 'Rent' ? '#38BDF8' : '#B49A70';
  const size = isActive ? 44 : 38;
  const half = size / 2;
  const r = half - 3;
  const svgW = size;
  const svgH = Math.round(size * 1.35);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block;overflow:visible">
      <ellipse cx="${half}" cy="${svgH - 2}" rx="${half * 0.55}" ry="3" fill="rgba(0,0,0,0.35)" />
      <path d="M${half},${svgH - 4}
               C${half},${svgH - 4} ${3},${half + r * 0.55}
               ${3},${half}
               A${r + 0.5},${r + 0.5} 0 0 1 ${svgW - 3},${half}
               C${svgW - 3},${half + r * 0.55} ${half},${svgH - 4} ${half},${svgH - 4}Z"
            fill="${bg}" stroke="${border}" stroke-width="2"/>
      <circle cx="${half}" cy="${half}" r="${r * 0.38}" fill="${dot}" opacity="0.95"/>
    </svg>`;

  return L.divIcon({
    className: 'pp-drop-pin',
    html: svg,
    iconSize: [svgW, svgH],
    iconAnchor: [half, svgH - 3],
    popupAnchor: [0, -(svgH - 4)],
  });
};

// ─── Popup HTML ──────────────────────────────────────────────────────────────
const buildPopupHtml = (p) => {
  const pId = p._id || p.id;
  const title = escapeHtml(p.title);
  const location = escapeHtml(typeof p.location === 'string' ? p.location : p.location?.city || '');
  const img = escapeHtml(p.image || p.images?.[0]);
  const meta = [p.beds ? `${escapeHtml(p.beds)} Beds` : '', p.sqft ? `${escapeHtml(p.sqft)} sq.ft` : '']
    .filter(Boolean)
    .join(' &bull; ');

  return `
  <div class="pp-card">
    <div class="pp-card-img">
      <img src="${img}" alt="${title}" onerror="this.style.display='none'" />
      <span class="pp-badge">✦ Listed by PlutoPlat</span>
      <span class="pp-purpose">${escapeHtml(p.purpose || 'Exclusive')}</span>
      <button type="button" class="pp-close" data-pp-close aria-label="Close">✕</button>
    </div>
    <div class="pp-card-body">
      <div class="pp-id">Property ID: ${getPropertyCode(pId)}</div>
      <div class="pp-title" title="${title}">${title}</div>
      <div class="pp-loc">📍 ${location}</div>
      ${meta ? `<div class="pp-meta">${meta}</div>` : ''}
      <a class="pp-cta" href="/property/${encodeURIComponent(pId)}" data-pp-nav="/property/${encodeURIComponent(pId)}">
        View Property &rarr;
      </a>
    </div>
  </div>`;
};

// ─── Main Component ──────────────────────────────────────────────────────────
const PlutoMapExplorer = ({
  property = null,
  selectedPropertyId = null,
  height = '640px',
  showControls = true,
  singlePropertyMode = false,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const activeIdRef = useRef(null);
  const toggleRef = useRef(null);
  const listOpenRef = useRef(true);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const { properties } = usePropertyStore();
  const [mapStyle, setMapStyle] = useState('streets'); // 'streets' | 'satellite'
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [activeProperty, setActiveProperty] = useState(null);
  const [activeRegion, setActiveRegion] = useState('Kanpur & UP');
  const [pinsVisible, setPinsVisible] = useState(true);
  const [listOpen, setListOpen] = useState(true);
  listOpenRef.current = listOpen;

  const displayProperties = useMemo(() => {
    // 1. If explicit property object is passed (e.g. PropertyDetail)
    if (singlePropertyMode && property) {
      let lat = Number(property.latitude ?? property.coordinates?.lat ?? property.coordinates?.latitude);
      let lng = Number(property.longitude ?? property.langitude ?? property.coordinates?.lng ?? property.coordinates?.longitude);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        lat = 26.474;
        lng = 80.335;
      }
      return [{ ...property, id: property.id || property._id || '1', coordinates: { lat, lng } }];
    }

    // 2. Regular properties collection
    return properties
      .map((p) => {
        let lat = Number(p.latitude ?? p.coordinates?.lat ?? p.coordinates?.latitude);
        let lng = Number(p.longitude ?? p.langitude ?? p.coordinates?.lng ?? p.coordinates?.longitude);
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          const locStr = (
            typeof p.location === 'string' ? p.location : `${p.location?.city || ''}`
          ).toLowerCase();
          if (locStr.includes('swaroop')) { lat = 26.482; lng = 80.315; }
          else if (locStr.includes('civil')) { lat = 26.474; lng = 80.335; }
          else if (locStr.includes('vip')) { lat = 26.479; lng = 80.342; }
          else if (locStr.includes('delhi')) { lat = 28.6139; lng = 77.209; }
          else if (locStr.includes('mumbai')) { lat = 19.076; lng = 72.8777; }
          else if (locStr.includes('dubai')) { lat = 25.2048; lng = 55.2708; }
          else { lat = 26.474; lng = 80.335; }
        }
        return { ...p, id: p.id || p._id, coordinates: { lat, lng } };
      })
      .filter((p) => {
        const propId = String(p.id || p._id);
        if (singlePropertyMode && selectedPropertyId) {
          return propId === String(selectedPropertyId);
        }
        if (purposeFilter === 'Buy') return p.purpose === 'Buy';
        if (purposeFilter === 'Rent') return p.purpose === 'Rent';
        if (purposeFilter === 'Off-Plan') return p.yearBuilt && p.yearBuilt >= 2026;
        return true;
      });
  }, [properties, property, purposeFilter, singlePropertyMode, selectedPropertyId]);

  /* ── close whatever is open (popup on desktop, drawer on mobile) ───────── */
  const closeActive = () => {
    mapInstanceRef.current?.closePopup();
    popupRef.current = null;
    activeIdRef.current = null;
    setActiveProperty(null);
  };

  /* ── open / close popup for a property ─────────────────────────────────── */
  const togglePropertyPopup = (propItem) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeIdRef.current === propItem.id) {
      closeActive();
      return;
    }

    const { lat, lng } = propItem.coordinates;
    const targetZoom = Math.max(map.getZoom(), 14);

    const desktop = isDesktop();
    const pt = map.project([lat, lng], targetZoom);
    pt.y -= desktop ? 120 : 35;
    if (desktop && listOpenRef.current && !singlePropertyMode) pt.x += 160;
    const center = map.unproject(pt, targetZoom);

    if (desktop) {
      const popup = L.popup({
        maxWidth: 270,
        minWidth: 250,
        className: 'pp-popup',
        offset: [0, -4],
        closeButton: false,
        autoPan: false,
      })
        .setLatLng([lat, lng])
        .setContent(buildPopupHtml(propItem));

      popup.openOn(map);
      popupRef.current = popup;
    } else {
      map.closePopup();
      popupRef.current = null;
    }

    activeIdRef.current = propItem.id;
    setActiveProperty(propItem);
    map.flyTo(center, targetZoom, { duration: 0.8 });
  };
  toggleRef.current = togglePropertyPopup;

  /* ── Switch tile layers (Street / Satellite) ─────────────────────────────── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layerCfg = TILE_LAYERS[mapStyle] || TILE_LAYERS.streets;
    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch (e) {}
    }

    const newTileLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.options.attribution,
      maxZoom: layerCfg.options.maxZoom || 19,
      subdomains: layerCfg.options.subdomains || ['a', 'b', 'c'],
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapStyle]);

  /* ── Initialize map ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.stop();
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      mapContainerRef.current._leaflet_id = null;
    }

    let center = [26.474, 80.335];
    let zoom = 14;

    if (singlePropertyMode) {
      const target = displayProperties[0];
      if (target?.coordinates?.lat && target?.coordinates?.lng) {
        center = [target.coordinates.lat, target.coordinates.lng];
        zoom = 15;
      }
    } else if (displayProperties.length > 0) {
      center = [displayProperties[0].coordinates.lat, displayProperties[0].coordinates.lng];
      zoom = 13;
    }

    let map;
    try {
      map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        scrollWheelZoom: !singlePropertyMode,
      });
    } catch (err) {
      console.warn('Leaflet map creation notice:', err);
      return;
    }

    // Mount initial clean tile layer
    const initialLayerCfg = TILE_LAYERS[mapStyle] || TILE_LAYERS.streets;
    const baseTileLayer = L.tileLayer(initialLayerCfg.url, {
      attribution: initialLayerCfg.options.attribution,
      maxZoom: initialLayerCfg.options.maxZoom || 19,
      subdomains: initialLayerCfg.options.subdomains || ['a', 'b', 'c'],
    });
    baseTileLayer.addTo(map);
    tileLayerRef.current = baseTileLayer;

    // Zoom control
    L.control.zoom({ position: 'topleft' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;

    map.on('popupclose', (e) => {
      if (e.popup === popupRef.current) {
        popupRef.current = null;
        activeIdRef.current = null;
        setActiveProperty(null);
      }
    });

    map.on('popupopen', (e) => {
      const el = e.popup?.getElement();
      if (!el) return;
      const nav = el.querySelector('[data-pp-nav]');
      const close = el.querySelector('[data-pp-close]');
      if (nav) {
        nav.addEventListener('click', (ev) => {
          ev.preventDefault();
          const targetUrl = nav.getAttribute('data-pp-nav');
          if (targetUrl) navigateRef.current(targetUrl);
        });
      }
      if (close) {
        close.addEventListener('click', (ev) => {
          ev.preventDefault();
          try {
            map.closePopup();
          } catch (e) {}
        });
      }
    });

    mapInstanceRef.current = map;

    const invalidate = () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      } catch (e) {}
    };
    const timers = [100, 350, 800, 1500].map((ms) => setTimeout(invalidate, ms));

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      ro = new ResizeObserver(invalidate);
      ro.observe(mapContainerRef.current);
    }

    return () => {
      timers.forEach(clearTimeout);
      try {
        ro?.disconnect();
      } catch (e) {}
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        }
      } catch (e) {
        console.warn('Leaflet cleanup notice:', e);
      } finally {
        if (mapContainerRef.current) {
          mapContainerRef.current._leaflet_id = null;
        }
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        markersLayerRef.current = null;
        markersRef.current = {};
        popupRef.current = null;
        activeIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singlePropertyMode, selectedPropertyId, property]);

  /* ── Build / update pins ───────────────────────────────────────────────── */
  useEffect(() => {
    const layerGroup = markersLayerRef.current;
    const map = mapInstanceRef.current;
    if (!layerGroup || !map) return;

    layerGroup.clearLayers();
    markersRef.current = {};

    displayProperties.forEach((propItem) => {
      const { lat, lng } = propItem.coordinates;
      const marker = L.marker([lat, lng], {
        icon: buildDropPin(propItem, activeIdRef.current === propItem.id || singlePropertyMode),
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        toggleRef.current?.(propItem);
      });

      marker.addTo(layerGroup);
      markersRef.current[propItem.id] = marker;
    });

    if (singlePropertyMode && displayProperties.length > 0) {
      const target = displayProperties[0];
      map.setView([target.coordinates.lat, target.coordinates.lng], 15);
    } else if (displayProperties.length > 0 && activeRegion === 'Global View') {
      try {
        const bounds = L.latLngBounds(displayProperties.map((p) => [p.coordinates.lat, p.coordinates.lng]));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
        }
      } catch (e) {}
    }
  }, [displayProperties, singlePropertyMode, activeRegion]);

  /* ── Show / hide pins ──────────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    if (pinsVisible) {
      if (!map.hasLayer(layerGroup)) map.addLayer(layerGroup);
    } else {
      closeActive();
      if (map.hasLayer(layerGroup)) map.removeLayer(layerGroup);
    }
  }, [pinsVisible]);

  /* ── Highlight active pin ──────────────────────────────────────────────── */
  useEffect(() => {
    displayProperties.forEach((p) => {
      markersRef.current[p.id]?.setIcon(
        buildDropPin(p, activeProperty?.id === p.id || singlePropertyMode)
      );
    });
  }, [activeProperty, displayProperties, singlePropertyMode]);

  const handleRegionSelect = (region) => {
    closeActive();
    setActiveRegion(region.label);
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo(region.center, region.zoom, { duration: 1.2 });
  };

  const handleTogglePins = () => {
    setPinsVisible((v) => !v);
  };

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#F4F1EA]">
      <style>{`
        /* ---------- Popup shell ---------- */
        .pp-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          padding: 0;
          background: #fff;
          box-shadow: 0 22px 44px -12px rgba(0,0,0,.35);
          overflow: hidden;
          animation: ppFadeIn .2s ease-out;
        }
        .pp-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 250px !important;
          line-height: 1.3;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .pp-popup .leaflet-popup-tip { background: #fff; }

        /* ---------- Popup card ---------- */
        .pp-card { width: 250px; background: #fff; }
        .pp-card-img { position: relative; height: 120px; overflow: hidden; background: #e5e0d8; }
        .pp-card-img img {
          display: block; width: 100% !important; height: 100% !important;
          max-width: none !important; object-fit: cover;
        }
        .pp-badge {
          position: absolute; top: 8px; left: 8px;
          background: rgba(28,32,28,.9); color: #E8D9BF;
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px;
          padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(180,154,112,.4);
        }
        .pp-purpose {
          position: absolute; bottom: 8px; left: 8px;
          background: #fff; color: #1C201C;
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          padding: 2px 6px; border-radius: 3px;
        }
        .pp-close {
          position: absolute; top: 6px; right: 6px;
          width: 24px; height: 24px; border-radius: 999px; border: none; cursor: pointer;
          background: rgba(255,255,255,.92); color: #1C201C; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .pp-close:hover { background: #fff; }
        .pp-card-body { padding: 12px 14px 14px; }
        .pp-id {
          display: inline-block; background: #FAF6EE; color: #8E7448;
          border: 1px solid rgba(180,154,112,.35); border-radius: 999px;
          font-size: 10px; font-weight: 700; padding: 2px 9px; margin-bottom: 8px;
        }
        .pp-title {
          font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 600;
          color: #1C201C; line-height: 1.25; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pp-loc { font-size: 11px; color: #77766E; margin-bottom: 6px; }
        .pp-meta { font-size: 11px; color: #B49A70; font-weight: 600; margin-bottom: 10px; }
        .leaflet-container a.pp-cta {
          display: block; text-align: center; background: #1C201C; color: #fff !important;
          text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .5px; padding: 9px 0; border-radius: 8px; margin-top: 10px;
        }
        .leaflet-container a.pp-cta:hover { background: #000; }

        /* ---------- Pins ---------- */
        .pp-drop-pin { background: transparent !important; border: none !important; }
        .pp-drop-pin svg { transition: transform .15s ease; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
        .pp-drop-pin:hover svg { transform: translateY(-3px) scale(1.05); }

        @keyframes ppFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes ppListIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
        .pp-list-anim { animation: ppListIn .25s ease-out; }

        /* ---------- Zoom control (positioned cleanly) ---------- */
        .leaflet-top.leaflet-left .leaflet-control-zoom {
          margin-left: 14px;
          margin-top: ${showControls ? '110px' : '14px'} !important;
          border: none !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0,0,0,0.25) !important;
        }
        @media (min-width: 768px) {
          .leaflet-top.leaflet-left .leaflet-control-zoom {
            margin-top: ${showControls ? '80px' : '16px'} !important;
          }
        }
        .leaflet-control-zoom a {
          background: #1C201C !important;
          color: #B49A70 !important;
          border-color: #2E342E !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all .2s;
        }
        .leaflet-control-zoom a:hover {
          background: #252A25 !important;
          color: #E8D9BF !important;
        }

        .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,0.85) !important;
          backdrop-filter: blur(4px);
        }
      `}</style>

      {/* ── Street vs Satellite Layer Switcher Pill ── */}
      <div className={`absolute z-[400] flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1 border border-[#DDD8CE] shadow-lg ${
        singlePropertyMode ? 'top-3 right-3' : 'bottom-6 sm:bottom-8 right-4'
      }`}>
        <button
          type="button"
          onClick={() => setMapStyle('streets')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            mapStyle === 'streets'
              ? 'bg-[#1C201C] text-white shadow-sm'
              : 'text-[#6E6D66] hover:text-[#1C201C] hover:bg-[#F8F6F2]'
          }`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            mapStyle === 'satellite'
              ? 'bg-[#1C201C] text-white shadow-sm'
              : 'text-[#6E6D66] hover:text-[#1C201C] hover:bg-[#F8F6F2]'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* ── Top control bar (Multi-property mode) ── */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none">
          <div className="pointer-events-auto bg-[#1C201C]/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-[#B49A70]/40 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-serif font-medium tracking-wide">PlutoPlat Global Radar</span>
            </div>
            <span className="text-[10px] bg-[#B49A70]/30 text-[#E8D9BF] font-mono px-2 py-0.5 rounded-full border border-[#B49A70]/30">
              {displayProperties.length} Properties
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E5E0D8] shadow-lg">
            {REGIONS.map((r) => (
              <button
                key={r.label}
                onClick={() => handleRegionSelect(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeRegion === r.label
                    ? 'bg-[#1C201C] text-white'
                    : 'text-[#6E6D66] hover:text-[#1C201C] hover:bg-[#F8F6F2]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Purpose filter (bottom-left) ── */}
      {showControls && !singlePropertyMode && (
        <div className="absolute bottom-8 left-5 z-20 hidden sm:flex items-center gap-1 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] shadow-xl">
          {['All', 'Buy', 'Rent', 'Off-Plan'].map((type) => (
            <button
              key={type}
              onClick={() => setPurposeFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                purposeFilter === type ? 'bg-[#1C201C] text-white' : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              {type === 'All' ? 'All Portfolios' : type}
            </button>
          ))}
        </div>
      )}

      {/* ── Mobile pin toggle ── */}
      {showControls && !singlePropertyMode && (
        <button
          onClick={handleTogglePins}
          className="lg:hidden absolute top-40 md:top-24 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E5E0D8] shadow-lg text-[11px] font-semibold text-[#1C201C] cursor-pointer"
        >
          {pinsVisible ? <Eye size={14} className="text-[#B49A70]" /> : <EyeOff size={14} className="text-[#8E8B82]" />}
          <span>{pinsVisible ? 'Hide pins' : 'Show pins'}</span>
        </button>
      )}

      {/* ── Map canvas ── */}
      <div
        ref={mapContainerRef}
        style={{ height: height || '620px', minHeight: '320px', width: '100%' }}
        className="w-full z-10 relative cursor-grab active:cursor-grabbing bg-[#EDE9DF]"
      />

      {/* ── Desktop sidebar ── */}
      {showControls && !singlePropertyMode && (
        <div
          className={`hidden lg:flex flex-col absolute top-20 right-5 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] shadow-2xl p-4 overflow-hidden transition-all duration-300 ${
            listOpen ? 'bottom-8' : 'max-h-[76px]'
          }`}
        >
          <div className={`flex items-center justify-between gap-2 select-none ${listOpen ? 'pb-3 border-b border-[#EAE6DE] mb-3' : ''}`}>
            <div
              onClick={() => setListOpen((v) => !v)}
              className="min-w-0 cursor-pointer flex-1"
              title={listOpen ? 'Click to collapse' : 'Click to expand'}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B49A70] block">
                PlutoPlat Listings &bull; {displayProperties.length}
              </span>
              <h4 className="font-serif text-sm font-semibold text-[#1C201C] truncate">Explore Verified Estates</h4>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleTogglePins}
                aria-pressed={pinsVisible}
                title={pinsVisible ? 'Click to hide map pins' : 'Click to show map pins'}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                  pinsVisible
                    ? 'bg-[#1C201C] text-white border-[#1C201C] hover:bg-black'
                    : 'bg-[#F8F6F2] text-[#8E7448] border-[#B49A70]/50 hover:bg-white'
                }`}
              >
                {pinsVisible ? (
                  <>
                    <Eye size={13} className="text-[#B49A70]" />
                    <span>Hide Pins</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={13} className="text-[#8E8B82]" />
                    <span>Show Pins</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setListOpen((v) => !v)}
                title={listOpen ? 'Collapse list' : 'Expand list'}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#B49A70]/30 text-[#8E7448] hover:bg-[#B49A70] hover:text-white transition-colors cursor-pointer"
              >
                {listOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {listOpen && (
            <>
              <div className="pp-list-anim flex-1 overflow-y-auto space-y-2.5 pr-1">
                {displayProperties.map((p) => {
                  const isSelected = activeProperty?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (!pinsVisible) setPinsVisible(true);
                        setTimeout(() => toggleRef.current?.(p), pinsVisible ? 0 : 50);
                      }}
                      className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-center ${
                        isSelected
                          ? 'bg-[#FAF7F0] border-[#B49A70] shadow-sm'
                          : 'bg-white border-[#E5E0D8] hover:border-[#B49A70]/60'
                      }`}
                    >
                      <img src={p.image} alt={p.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] text-[#77766E] truncate">
                          <MapPin size={11} className="text-[#B49A70] shrink-0" />
                          <span className="truncate">
                            {typeof p.location === 'string' ? p.location : p.location?.city}
                          </span>
                        </div>
                        <h5 className="font-serif text-xs font-bold text-[#1C201C] truncate mb-0.5">{p.title}</h5>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-0.5 font-bold text-[#8E7448]">
                            <Hash size={11} />
                            {getPropertyCode(p.id)}
                          </span>
                          <span className="text-[10px] font-semibold text-[#B49A70] uppercase">{p.purpose}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#EAE6DE]">
                <button
                  onClick={() => navigate('/properties')}
                  className="w-full py-2 bg-[#1C201C] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Complete Archive</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Mobile bottom drawer (popup is desktop-only) ── */}
      {activeProperty && !singlePropertyMode && (
        <div className="lg:hidden absolute bottom-3 left-3 right-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] p-3 shadow-2xl flex gap-3 items-center">
          <img src={activeProperty.image} alt={activeProperty.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#B49A70] tracking-wider">Listed by PlutoPlat</span>
              <button onClick={closeActive} className="text-[#6E6D66] p-1" aria-label="Close">
                <X size={15} />
              </button>
            </div>
            <h5 className="font-serif text-sm font-bold text-[#1C201C] truncate leading-tight">{activeProperty.title}</h5>
            <div className="text-xs font-bold text-[#8E7448] mt-0.5">
              Property ID: {getPropertyCode(activeProperty.id)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => navigate(`/property/${activeProperty.id}`)}
                className="flex-1 py-1 px-2.5 bg-[#1C201C] text-white text-[11px] font-semibold rounded-lg text-center"
              >
                View Property
              </button>
              <a
                href={`https://wa.me/919956346155?text=Hi%20PlutoPlat,%20I%20am%20viewing%20${encodeURIComponent(
                  activeProperty.title
                )}%20(${getPropertyCode(activeProperty.id)})%20on%20the%20map.`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-[#E8F8F3] text-[#00A884] rounded-lg border border-[#A7E6D1]"
                title="WhatsApp Inquiry: +91 9956346155"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlutoMapExplorer;
