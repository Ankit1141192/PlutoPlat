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
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-white border-b border-[#DDD8CE]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-2"
          >
            The PlutoPlat Standard
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight mb-3"
          >
            Why Choose PlutoPlat
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm sm:text-base text-[#6E6D66] font-light leading-relaxed"
          >
            Your trusted partner in discovering extraordinary properties across the UAE.
          </motion.p>
        </div>

        {/* 5 Cards with 100ms Stagger Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 border border-[#E5E0D8] hover:border-[#B49A70] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#B49A70]/20 flex items-center justify-center mb-5">
                  {pillar.icon}
                </div>

                {/* Card Title */}
                <h3 className="font-serif text-lg sm:text-xl text-[#1C201C] font-bold mb-2.5">
                  {pillar.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs sm:text-sm text-[#6E6D66] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Number footer */}
              <div className="mt-6 pt-4 border-t border-[#F0ECE4] text-[11px] font-mono text-[#B49A70] uppercase">
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