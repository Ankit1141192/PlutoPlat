import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Globe, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '../../context/PropertyContext';

const About = () => {
  const { agents, stats } = usePropertyStore();

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2]">
      {/* Hero Headline */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-3">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1C201C] font-normal leading-[1.15] mb-6">
            We Curate Not Just Buildings, But <span className="italic text-[#B49A70]">Enduring Legacies</span>.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6D66] font-light leading-relaxed">
            Founded with an uncompromising belief that exceptional architecture is a transformative art form, PlutoPlat connects discerning individuals with the finest residences across the world’s most sought-after enclaves.
          </p>
        </div>
      </section>

      {/* Dual Image & Mission Section */}
      <section className="px-6 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
              alt="PlutoPlat Architecture"
              className="w-full aspect-[16/10] object-cover rounded-sm shadow-xl"
            />
            <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-[#1C201C] p-6 sm:p-8 rounded-sm text-white max-w-xs shadow-2xl hidden sm:block">
              <span className="font-serif text-4xl text-[#B49A70] block mb-1">15+</span>
              <span className="text-xs uppercase tracking-widest text-[#E8D9BF] font-semibold block mb-2">
                Years of Institutional Focus
              </span>
              <p className="text-[11px] text-[#A09D94] font-light">
                Serving single-family offices, collectors, and architectural patrons worldwide.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal leading-snug">
              An Elevated Benchmark for Luxury Real Estate
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6D66] font-light leading-relaxed">
              At PlutoPlat, a home is far more than an asset transaction; it is a profound canvas for personal sanctuary, family memories, and lasting wealth preservation.
            </p>
            <p className="text-xs sm:text-sm text-[#6E6D66] font-light leading-relaxed">
              Our firm eschews mass volume in favor of rigorous curation. We intentionally list a limited collection of trophy assets, ensuring each receives bespoke cinematic marketing, forensic title auditing, and senior partner representation.
            </p>
            <div className="pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1C201C] hover:text-[#B49A70] transition-colors border-b-2 border-[#1C201C] pb-1"
              >
                <span>Browse The Collection</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Metrics Bar */}
      <section className="bg-[#1C201C] text-white py-16 px-6 mb-28 border-y border-[#333]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#E8D9BF]">
                {s.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/70 mt-2 font-light">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Leadership */}
      <section className="px-6 max-w-7xl mx-auto mb-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-2">
            Managing Partners
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal mb-3">
            The Advisors Behind The Acquisitions
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6D66] font-light leading-relaxed">
            Our Senior Advisory Group blends deep market forensics, architectural acumen, and unmatched discretion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white border border-[#DDD8CE] rounded-sm overflow-hidden p-6 text-center shadow-xs"
            >
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-[#B49A70]/40"
              />
              <h3 className="font-serif text-xl text-[#1C201C] mb-1 font-semibold">{agent.name}</h3>
              <p className="text-xs text-[#B49A70] font-sans uppercase tracking-wider mb-2">{agent.title}</p>
              <p className="text-xs text-[#77766E] font-light mb-4">{agent.specialty}</p>

              <div className="pt-4 border-t border-[#EAE6DE] flex justify-between items-center text-xs text-[#555]">
                <span>Volume: <strong className="text-[#1C201C]">{agent.salesVolume}</strong></span>
                <span>Rating: <strong className="text-[#1C201C]">{agent.rating} ★</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-6 max-w-5xl mx-auto text-center">
        <div className="bg-[#EFECE4] border border-[#DDD8CE] p-12 sm:p-16 rounded-sm">
          <h3 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal mb-4">
            Ready to Begin Your Private Search?
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6D66] max-w-lg mx-auto mb-8 font-light leading-relaxed">
            Connect directly with our Senior Client Group to receive an off-market prospectus tailored to your exact acquisition profile.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/properties"
              className="px-8 py-3.5 bg-[#1C201C] text-white text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-black transition-colors"
            >
              Explore Portfolios
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-[#B49A70] text-white text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#9E865F] transition-colors"
            >
              Contact Advisory Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
