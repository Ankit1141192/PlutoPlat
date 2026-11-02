import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '../../context/PropertyContext';

const FAQ = () => {
  const { faqs } = usePropertyStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(1);

  const categories = ['All', 'Buying', 'Listing', 'Tours', 'Privacy'];

  const filteredFaqs = faqs.filter((faq) => {
    if (activeCategory === 'All') return true;
    return faq.category === activeCategory;
  });

  const toggleAccordion = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-2">
            Acquisition Protocols
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C201C] font-normal mb-4">
            Frequently Addressed Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6D66] font-light leading-relaxed">
            Essential information regarding forensic title auditing, private representation, cross-border settlement, and discretionary listings.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex justify-center items-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1C201C] text-white shadow-xs'
                  : 'bg-white text-[#6E6D66] border border-[#DDD8CE] hover:bg-[#EAE6DE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-20">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-[#DDD8CE] rounded-xs overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FDFCFB] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F8F6F2] text-[#B49A70] text-xs font-mono flex items-center justify-center shrink-0">
                      0{faq.id}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg text-[#1C201C] font-normal">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[#B49A70] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#F0ECE2] text-xs sm:text-sm text-[#6E6D66] leading-relaxed font-light">
                    <p>{faq.answer}</p>
                    <div className="mt-4 pt-3 border-t border-[#F8F6F2] flex items-center gap-2 text-[11px] text-[#B49A70]">
                      <ShieldCheck size={13} />
                      <span>PlutoPlat Fiduciary Compliance Protocol</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Callout */}
        <div className="bg-[#EFECE4] border border-[#DDD8CE] p-8 sm:p-12 rounded-sm text-center">
          <HelpCircle size={32} className="text-[#B49A70] mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-[#1C201C] mb-2 font-normal">
            Have a Specific Jurisdictional Question?
          </h3>
          <p className="text-xs text-[#6E6D66] max-w-md mx-auto mb-6 font-light leading-relaxed">
            Our Private Client Group coordinates directly with cross-border tax attorneys, escrow officers, and title guarantors.
          </p>
          <Link
            to="/contact?subject=Legal+and+Compliance"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs"
          >
            <span>Consult Our Legal Advisory Desk</span>
            <ArrowRight size={14} className="text-[#B49A70]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
