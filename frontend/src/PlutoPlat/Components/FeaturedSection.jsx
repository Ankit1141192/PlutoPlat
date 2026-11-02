import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { usePropertyStore } from '../../context/PropertyContext';

const FeaturedSection = () => {
  const { properties } = usePropertyStore();
  const [filterType, setFilterType] = useState('All');

  const filteredProperties = properties.filter((p) => {
    if (!p.featured) return false;
    if (filterType === 'All') return true;
    return p.type === filterType;
  });

  const categoriesList = ['All', 'Villas', 'Homes', 'Apartments', 'Plots'];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#EFECE4] border-y border-[#DDD8CE]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B49A70] mb-3"
          >
            <Sparkles size={14} />
            <span>Curated Collection</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal mb-3"
          >
            Featured Properties
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm sm:text-base text-[#6E6D66] font-light leading-relaxed"
          >
            Exceptional homes and investments, handpicked for you.
          </motion.p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center items-center gap-2 mb-12 flex-wrap">
          {categoriesList.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                filterType === type
                  ? 'bg-[#1C201C] text-[#EBE7DF] shadow-md'
                  : 'bg-white/80 text-[#6E6D66] border border-[#DDD8CE] hover:bg-white hover:text-[#1C201C]'
              }`}
            >
              {type === 'All' ? 'All Collections' : type}
            </button>
          ))}
        </div>

        {/* Properties Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center">
          <Link
            to="/properties"
            className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C201C] text-white rounded-xl font-semibold text-sm hover:bg-[#B49A70] transition-colors"
          >
            View All Properties <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;