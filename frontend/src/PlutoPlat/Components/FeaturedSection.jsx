import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { usePropertyStore } from '../../context/PropertyContext';

const TABS = ['All', 'Villas', 'Homes', 'Apartments', 'Plots'];
const PER_PAGE = 4;

const FeaturedSection = () => {
  const { properties } = usePropertyStore();
  const [tab, setTab] = useState('All');
  const [page, setPage] = useState(0);

  const filtered = properties.filter(
    (p) => p.featured && (tab === 'All' || p.type === tab)
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // Reset page when tab changes
  const handleTab = (t) => {
    setTab(t);
    setPage(0);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto">

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B49A70] mb-2"
            >
              <Sparkles size={13} />
              Curated Collection
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.07 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight"
            >
              Featured Properties
            </motion.h2>
          </div>

          {/* Tab pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => handleTab(t)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  tab === t
                    ? 'bg-[#1C201C] text-[#EBE7DF]'
                    : 'bg-white text-[#6E6D66] border border-[#DDD8CE] hover:border-[#B49A70] hover:text-[#1C201C]'
                }`}
              >
                {t === 'All' ? 'All' : t}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Card grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tab}-${page}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
          >
            {visible.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer: pagination + CTA ── */}
        <div className="mt-10 flex items-center justify-between">
          {/* Pagination */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={page === 0}
              aria-label="Previous"
              className="w-10 h-10 rounded-full border border-[#DDD8CE] bg-white flex items-center justify-center text-[#1C201C] hover:bg-[#1C201C] hover:text-white hover:border-[#1C201C] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs text-[#6E6D66] font-medium tabular-nums">
              {page + 1} / {Math.max(totalPages, 1)}
            </span>
            <button
              onClick={next}
              disabled={page >= totalPages - 1}
              aria-label="Next"
              className="w-10 h-10 rounded-full border border-[#DDD8CE] bg-white flex items-center justify-center text-[#1C201C] hover:bg-[#1C201C] hover:text-white hover:border-[#1C201C] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View all CTA */}
          <Link
            to="/properties"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1C201C] hover:text-[#B49A70] transition-colors duration-200"
          >
            View all properties
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedSection;
