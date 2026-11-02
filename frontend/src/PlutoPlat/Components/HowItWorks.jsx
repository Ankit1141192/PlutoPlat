import React from 'react';
import { motion } from 'framer-motion';
import { Search, GitCompare, Phone } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Explore verified properties across the UAE.',
    icon: <Search size={24} className="text-[#B49A70]" />
  },
  {
    num: '02',
    title: 'Compare',
    desc: 'Compare locations, prices and property details.',
    icon: <GitCompare size={24} className="text-[#B49A70]" />
  },
  {
    num: '03',
    title: 'Connect',
    desc: 'Connect with property experts and take the next step.',
    icon: <Phone size={24} className="text-[#B49A70]" />
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal mb-3"
          >
            How PlutoPlat Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-[#6E6D66] font-light leading-relaxed"
          >
            Your straightforward path to finding the right property.
          </motion.p>
        </div>

        {/* 3 Numbered Cards in a Row (Desktop 3 cols, Mobile vertical stack) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white p-8 rounded-2xl border border-[#E5E0D8] shadow-xs hover:border-[#B49A70] hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                {/* Large step number & icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-5xl md:text-6xl font-light text-[#F0EBE1] select-none">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#B49A70]/20 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                {/* Step Heading */}
                <h3 className="font-serif text-2xl font-bold text-[#1C201C] mb-3">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-[#6E6D66] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Step indicator footer */}
              <div className="mt-8 pt-4 border-t border-[#F0ECE4] text-[11px] font-semibold uppercase tracking-wider text-[#B49A70]">
                Step {idx + 1} of 3
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;