import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, ArrowUpRight, X, Hash, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { WhatsAppIcon } from './RegisterInterestModal';

// ─── MapTiler API key (env fallback to supplied key) ─────────────────────────
const MAPTILER_KEY = 'wbyPv8NSVlYAesaoNStK';

// ─── Suppress Leaflet's default icon ─────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '' });

const REGIONS = [
  { label: 'Kanpur & UP', center: [26.4740, 80.3350], zoom: 12 },
  { label: 'Global View', center: [28.5, -30.0], zoom: 3 },
  { label: 'Dubai & UAE', center: [25.18, 55.30], zoom: 11 },
  { label: 'California', center: [34.05, -118.45], zoom: 11 },
  { label: 'New York', center: [40.74, -73.98], zoom: 12 },
  { label: 'Miami Beach', center: [25.82, -80.13], zoom: 13 },
  { label: 'Aspen & Tahoe', center: [39.19, -106.82], zoom: 11 },
];

export const getPropertyCode = (id) =>
  `PP-${String(id).replace(/\D/g, '').padStart(4, '0')}`;

// ─── Custom Teardrop Drop-Pin Icon ───────────────────────────────────────────
const buildDropPin = (property, isActive) => {
  const bg = isActive ? '#B49A70' : '#1C201C';
  const border = isActive ? '#1C201C' : '#B49A70';
  const dot = property.purpose === 'Rent' ? '#38BDF8' : '#FFFFFF';
  const size = isActive ? 44 : 38;
  const half = size / 2;
  const r = half - 3;
  const svgW = size;
  const svgH = Math.round(size * 1.35);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
      <ellipse cx="${half}" cy="${svgH - 2}" rx="${half * 0.55}" ry="3" fill="rgba(0,0,0,0.28)" />
      <path d="M${half},${svgH - 4}
               C${half},${svgH - 4} ${3},${half + r * 0.55}
               ${3},${half}
               A${r + 0.5},${r + 0.5} 0 0 1 ${svgW - 3},${half}
               C${svgW - 3},${half + r * 0.55} ${half},${svgH - 4} ${half},${svgH - 4}Z"
            fill="${bg}" stroke="${border}" stroke-width="1.5"/>
      <circle cx="${half}" cy="${half}" r="${r * 0.38}" fill="${dot}" opacity="0.92"/>
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
const buildPopupHtml = (p) => `
  <div style="width:250px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
    <div style="position:relative;height:120px;overflow:hidden;border-radius:12px 12px 0 0;background:#e5e0d8;">
      <img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" />
      <div style="position:absolute;top:8px;left:8px;background:rgba(28,32,28,.88);color:#E8D9BF;
                  font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;
                  padding:3px 8px;border-radius:4px;border:1px solid rgba(180,154,112,.4);">
        ✦ Listed by PlutoPlat
      </div>
      <div style="position:absolute;bottom:8px;right:8px;background:#fff;color:#1C201C;
                  font-size:9px;font-weight:700;text-transform:uppercase;padding:2px 6px;border-radius:3px;">
        ${p.purpose || 'Exclusive'}
      </div>
    </div>
    <div style="padding:12px 14px;background:#fff;border-radius:0 0 12px 12px;">
      <div style="display:inline-block;background:#FAF6EE;color:#8E7448;
                  border:1px solid rgba(180,154,112,.35);border-radius:999px;
                  font-size:10px;font-weight:700;padding:2px 9px;margin-bottom:8px;">
        Property ID: ${getPropertyCode(p.id)}
      </div>
      <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;
                  color:#1C201C;line-height:1.25;margin-bottom:4px;
                  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
        ${p.title}
      </div>
      <div style="font-size:11px;color:#77766E;margin-bottom:6px;">📍 ${p.location}</div>
      <div style="font-size:11px;color:#B49A70;font-weight:600;margin-bottom:10px;">
        ${p.beds ? `${p.beds} Beds &bull; ` : ''}${p.sqft ? `${p.sqft} sq.ft` : ''}
      </div>
      <a href="/property/${p.id}"
         style="display:block;text-align:center;background:#1C201C;color:#fff;
                text-decoration:none;font-size:11px;font-weight:700;text-transform:uppercase;
                letter-spacing:.5px;padding:8px 0;border-radius:8px;">
        View Property &rarr;
      </a>
      <div style="text-align:center;font-size:9px;color:#9A998F;margin-top:8px;">
        Click pin again to close
      </div>
    </div>
  </div>`;

// ─── Main Component ──────────────────────────────────────────────────────────
const PlutoMapExplorer = ({
  selectedPropertyId = null,
  height = '640px',
  showControls = true,
  singlePropertyMode = false,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const activeIdRef = useRef(null);
  const navigate = useNavigate();

  const { properties } = usePropertyStore();
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [activeProperty, setActiveProperty] = useState(null);
  const [activeRegion, setActiveRegion] = useState('Global View');
  const [pinsVisible, setPinsVisible] = useState(true);
  const [listOpen, setListOpen] = useState(true); // Dropdown / collapse state of right sidebar

  const displayProperties = useMemo(
    () =>
      properties.filter((p) => {
        if (!p.coordinates?.lat || !p.coordinates?.lng) return false;
        if (singlePropertyMode && selectedPropertyId)
          return p.id === parseInt(selectedPropertyId, 10);
        if (purposeFilter === 'Buy') return p.purpose === 'Buy';
        if (purposeFilter === 'Rent') return p.purpose === 'Rent';
        if (purposeFilter === 'Off-Plan') return p.yearBuilt && p.yearBuilt >= 2026;
        return true;
      }),
    [properties, purposeFilter, singlePropertyMode, selectedPropertyId]
  );

  /* ── toggle popup when clicking a pin or list card ─────────────────────── */
  const togglePropertyPopup = (property) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // If same pin clicked while open -> close popup (do NOT delete marker)
    if (activeIdRef.current === property.id) {
      map.closePopup();
      return;
    }

    const { lat, lng } = property.coordinates;
    const popup = L.popup({
      maxWidth: 270,
      minWidth: 250,
      className: 'pp-popup',
      offset: [0, -4],
      closeButton: false,
      autoPan: true,
    })
      .setLatLng([lat, lng])
      .setContent(buildPopupHtml(property));

    popup.openOn(map);
    popupRef.current = popup;
    activeIdRef.current = property.id;
    setActiveProperty(property);
    map.flyTo([lat, lng], Math.max(map.getZoom(), 12), { duration: 0.8 });
  };

  /* ── Initialize Map & Layer Group ──────────────────────────────────────── */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let center = [28.5, -20.0];
    let zoom = 3;
    if (singlePropertyMode && selectedPropertyId) {
      const target = properties.find((p) => p.id === parseInt(selectedPropertyId, 10));
      if (target?.coordinates) {
        center = [target.coordinates.lat, target.coordinates.lng];
        zoom = 14;
      }
    }

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false, // We add custom left-side zoom control below
      scrollWheelZoom: !singlePropertyMode,
    });

    // MapTiler layer
    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
        tileSize: 256,
      }
    ).addTo(map);

    // Zoom control placed on top-left to avoid right sidebar overlap
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Layer group for all property pins
    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;

    map.on('popupclose', (e) => {
      if (e.popup === popupRef.current) {
        popupRef.current = null;
        activeIdRef.current = null;
        setActiveProperty(null);
      }
    });

    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singlePropertyMode, selectedPropertyId]);

  /* ── Build / update pins inside the LayerGroup ─────────────────────────── */
  useEffect(() => {
    const layerGroup = markersLayerRef.current;
    const map = mapInstanceRef.current;
    if (!layerGroup || !map) return;

    layerGroup.clearLayers();
    markersRef.current = {};

    displayProperties.forEach((property) => {
      const { lat, lng } = property.coordinates;
      const marker = L.marker([lat, lng], {
        icon: buildDropPin(property, activeProperty?.id === property.id),
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        togglePropertyPopup(property);
      });

      marker.addTo(layerGroup);
      markersRef.current[property.id] = marker;
    });

    if (!singlePropertyMode && displayProperties.length > 0 && activeRegion === 'Global View') {
      const bounds = L.latLngBounds(
        displayProperties.map((p) => [p.coordinates.lat, p.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayProperties, singlePropertyMode]);

  /* ── Handle show/hide pins toggling cleanly without destroying positions ── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    if (pinsVisible) {
      if (!map.hasLayer(layerGroup)) {
        map.addLayer(layerGroup);
      }
    } else {
      map.closePopup();
      if (map.hasLayer(layerGroup)) {
        map.removeLayer(layerGroup);
      }
    }
  }, [pinsVisible]);

  /* ── Highlight active pin ──────────────────────────────────────────────── */
  useEffect(() => {
    displayProperties.forEach((p) => {
      markersRef.current[p.id]?.setIcon(buildDropPin(p, activeProperty?.id === p.id));
    });
  }, [activeProperty, displayProperties]);

  const handleRegionSelect = (region) => {
    setActiveRegion(region.label);
    mapInstanceRef.current?.flyTo(region.center, region.zoom, { duration: 1.2 });
  };

  const handleTogglePins = () => {
    setPinsVisible((v) => !v);
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="relative w-full bg-[#F8F6F2] border border-[#E5E0D8] rounded-3xl overflow-hidden shadow-xl">
      <style>{`
        .pp-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          padding: 0;
          box-shadow: 0 22px 44px -12px rgba(0,0,0,.35);
          overflow: hidden;
          animation: ppFadeIn .2s ease-out;
        }
        .pp-popup .leaflet-popup-content { margin: 0; }
        .pp-popup .leaflet-popup-tip { background: #fff; }
        .pp-drop-pin { background: transparent !important; border: none !important; }
        @keyframes ppFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes ppListIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
        .pp-list-anim { animation: ppListIn .25s ease-out; }

        /* Zoom +/- : positioned neatly on the left side, unobstructed by right sidebar */
        .leaflet-top.leaflet-left .leaflet-control-zoom {
          margin-left: 18px;
          margin-top: 130px;
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 8px 24px -6px rgba(0,0,0,.35) !important;
        }
        @media (min-width: 768px) {
          .leaflet-top.leaflet-left .leaflet-control-zoom {
            margin-top: 86px;
          }
        }
        .leaflet-control-zoom a {
          background: #1C201C !important;
          color: #B49A70 !important;
          border-color: #2E342E !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all .2s;
        }
        .leaflet-control-zoom a:hover {
          background: #252A25 !important;
          color: #E8D9BF !important;
        }
      `}</style>

      {/* ── Top control bar ── */}
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
        <div className="absolute bottom-5 left-5 z-20 hidden sm:flex items-center gap-1 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] shadow-xl">
          {['All', 'Buy', 'Rent', 'Off-Plan'].map((type) => (
            <button
              key={type}
              onClick={() => setPurposeFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                purposeFilter === type
                  ? 'bg-[#1C201C] text-white'
                  : 'text-[#6E6D66] hover:text-[#1C201C]'
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

      {/* ── The map canvas ── */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full z-10 relative cursor-grab active:cursor-grabbing"
      />

      {/* ── Desktop sidebar (with Dropdown / Collapse '>' and Pin Hide/Show Button) ── */}
      {showControls && !singlePropertyMode && (
        <div
          className={`hidden lg:flex flex-col absolute top-20 right-5 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] shadow-2xl p-4 overflow-hidden transition-all duration-300 ${
            listOpen ? 'bottom-5' : 'max-h-[76px]'
          }`}
        >
          {/* Header with Title + Pin Toggle Button + Dropdown '>' Collapse Icon */}
          <div
            className={`flex items-center justify-between gap-2 select-none ${
              listOpen ? 'pb-3 border-b border-[#EAE6DE] mb-3' : ''
            }`}
          >
            <div
              onClick={() => setListOpen((v) => !v)}
              className="min-w-0 cursor-pointer flex-1"
              title={listOpen ? 'Click to collapse' : 'Click to expand'}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B49A70] block">
                PlutoPlat Listings &bull; {displayProperties.length}
              </span>
              <h4 className="font-serif text-sm font-semibold text-[#1C201C] truncate">
                Explore Verified Estates
              </h4>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Button: Hide Pin / Show Pin */}
              <button
                type="button"
                onClick={handleTogglePins}
                aria-pressed={pinsVisible}
                title={pinsVisible ? 'Click to hide map pins' : 'Click to show map pins'}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                  pinsVisible
                    ? 'bg-[#1C201C] text-white border-[#1C201C] hover:bg-black shadow-xs'
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

              {/* Drop / Collapse Icon button */}
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

          {/* List of properties (rendered when expanded) */}
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
                        togglePropertyPopup(p);
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
                          <span className="truncate">{p.location}</span>
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

      {/* ── Mobile bottom drawer ── */}
      {activeProperty && (
        <div className="lg:hidden absolute bottom-3 left-3 right-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E5E0D8] p-3 shadow-2xl flex gap-3 items-center">
          <img
            src={activeProperty.image}
            alt={activeProperty.title}
            className="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#B49A70] tracking-wider">
                Listed by PlutoPlat
              </span>
              <button onClick={() => mapInstanceRef.current?.closePopup()} className="text-[#6E6D66] p-1">
                <X size={15} />
              </button>
            </div>
            <h5 className="font-serif text-sm font-bold text-[#1C201C] truncate leading-tight">
              {activeProperty.title}
            </h5>
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
