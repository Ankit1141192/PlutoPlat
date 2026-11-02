import React from 'react';
import { motion } from 'framer-motion';

const DEVELOPERS = [
  'Emaar Properties',
  'DAMAC',
  'Aldar',
  'Meraas',
  'Arada',
  'Nakheel'
];

const TrustedDevelopers = () => {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1C201C] font-normal mb-2"
        >
          Trusted by Leading Developers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs sm:text-sm text-[#6E6D66] font-light"
        >
          Partnered with the UAE's most respected property developers.
        </motion.p>
      </div>

      {/* Thin line divider above logos */}
      <div className="w-full border-t border-[#E5E0D8] mb-8" />

      {/* Developer Logos Grid (2 cols on mobile, flex row on desktop) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center items-center gap-4">
        {DEVELOPERS.map((dev, idx) => (
          <motion.div
            key={dev}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-xl py-4 px-6 text-sm font-bold text-[#1C201C] tracking-wide border border-[#E5E0D8] shadow-xs hover:border-[#B49A70] hover:text-[#B49A70] transition-all duration-300 text-center flex items-center justify-center cursor-default"
          >
            {dev}
          </motion.div>
        ))}
      </div>

      {/* Thin line divider below logos */}
      <div className="w-full border-b border-[#E5E0D8] mt-8" />
    </section>
  );
};

export default TrustedDevelopers;