import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Users, Eye, Lock } from 'lucide-react';

const PILLARS = [
  {
    icon: <ShieldCheck size={28} className="text-[#B49A70]" />,
    title: 'Verified Properties',
    description: 'Every listing is carefully reviewed for accuracy and authenticity.'
  },
  {
    icon: <MapPin size={28} className="text-[#B49A70]" />,
    title: 'Prime Locations',
    description: "Discover exceptional properties in Kanpur (Civil Lines, Swaroop Nagar, VIP Road) and premier destinations worldwide."
  },
  {
    icon: <Users size={28} className="text-[#B49A70]" />,
    title: 'Expert Guidance',
    description: 'Our senior advisors guide your acquisition with local Kanpur heritage expertise and global institutional rigor.'
  },
  {
    icon: <Eye size={28} className="text-[#B49A70]" />,
    title: 'Transparent Experience',
    description: 'A clear, straightforward property discovery journey from search to completion.'
  },
  {
    icon: <Lock size={28} className="text-[#B49A70]" />,
    title: 'Secure Transactions',
    description: 'Built around trust, reliability, and your complete peace of mind.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-8 sm:py-16 md:py-24 px-3 sm:px-6 bg-white border-b border-[#DDD8CE]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-1.5"
          >
            The PlutoPlat Standard
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight mb-2 sm:mb-3"
          >
            Why Choose PlutoPlat
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xs sm:text-base text-[#6E6D66] font-light leading-relaxed"
          >
            Your trusted partner in discovering extraordinary properties across Kanpur and premier global destinations.
          </motion.p>
        </div>

        {/* 5 Cards with responsive grid (2 columns on mobile, last spans 2 for clean look) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-5 md:gap-6">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className={`bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 border border-[#E5E0D8] hover:border-[#B49A70] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                idx === PILLARS.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div>
                {/* Icon Container */}
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FAF6EE] border border-[#B49A70]/20 flex items-center justify-center mb-2.5 sm:mb-4">
                  {React.cloneElement(pillar.icon, {
                    size: 20,
                    className: 'text-[#B49A70] sm:w-7 sm:h-7',
                  })}
                </div>

                {/* Card Title */}
                <h3 className="font-serif text-xs sm:text-lg text-[#1C201C] font-bold mb-1 sm:mb-2 leading-snug">
                  {pillar.title}
                </h3>

                {/* Card Description */}
                <p className="text-[11px] sm:text-xs text-[#6E6D66] font-light leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {pillar.description}
                </p>
              </div>

              {/* Number footer */}
              <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-[#F0ECE4] text-[9px] sm:text-[11px] font-mono text-[#B49A70] uppercase">
                0{idx + 1} / Standard
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;