import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, MapPin, Globe2, BadgeCheck } from 'lucide-react';
import PlutoMapExplorer from './PlutoMapExplorer';
import { usePropertyStore } from '../../context/PropertyContext';

const MapExplorerSection = () => {
  const { properties } = usePropertyStore();
  const pinned = properties.filter((p) => p.coordinates?.lat && p.coordinates?.lng);

  const stats = [
    { icon: MapPin, label: 'Pins on map', value: pinned.length },
    { icon: Globe2, label: 'Regions', value: 5 },
    { icon: BadgeCheck, label: 'Vetted deeds', value: '100%' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6EE] to-[#FFFDF8]">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#B49A70]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#10B981]/10 blur-3xl" />

      <div className="relative py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-[#B49A70]/30 text-[#8E7448] px-3.5 py-1 rounded-full text-[11px] uppercase tracking-widest font-semibold mb-4 shadow-sm">
              <Compass size={13} className="text-[#B49A70]" />
              <span>Geospatial Intelligence &bull; PlutoPlat Radar</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight">
              Explore PlutoPlat Estates <span className="italic text-[#B49A70]">on the Map</span>
            </h2>
            <p className="text-sm text-[#6E6D66] mt-4 font-light leading-relaxed">
              Every estate undergoes strict deed provenance and architectural verification. Tap a pin to drop
              down its property card, tap it again to hide it.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 bg-white border border-[#DDD8CE] rounded-full px-3 py-1.5 font-medium text-[#1C201C] shadow-sm">
                <ShieldCheck size={15} className="text-[#10B981]" /> 100% Vetted Deeds
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-[#DDD8CE] rounded-full px-3 py-1.5 font-medium text-[#1C201C] shadow-sm">
                <Sparkles size={15} className="text-[#B49A70]" /> Direct Escrow Guaranteed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white border border-[#DDD8CE] rounded-2xl px-5 py-3 text-center shadow-sm">
                <Icon size={18} className="mx-auto text-[#B49A70] mb-1" />
                <div className="font-serif text-2xl text-[#1C201C]">{value}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#6E6D66]">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] p-2 bg-white border border-[#DDD8CE] shadow-[0_20px_60px_-20px_rgba(28,32,28,0.25)]"
        >
          <PlutoMapExplorer height="620px" showControls />
        </motion.div>
      </div>
    </section>
  );
};

export default MapExplorerSection;