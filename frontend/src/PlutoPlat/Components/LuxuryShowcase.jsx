import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const LuxuryShowcase = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="relative rounded-sm overflow-hidden min-h-[580px] flex items-center justify-center p-8 md:p-16 shadow-2xl">
        {/* Architectural Background */}
        <img
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=2000&q=85"
          alt="Ultra Luxury Villa Architecture"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        {/* Obsidian Glass Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141714]/90 via-[#141714]/75 to-[#141714]/50" />

        <div className="relative z-10 max-w-3xl text-left text-white mr-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8D9BF] font-semibold mb-4 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
            <Sparkles size={13} className="text-[#B49A70]" />
            <span>Private Estates &bull; Worldwide Representation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.12] mb-6 text-white">
            Experience Living Beyond <span className="italic text-[#E8D9BF]">Every Expectation</span>.
          </h2>

          <p className="text-sm md:text-base text-[#DCD8CF] font-light leading-relaxed mb-10 max-w-xl">
            Whether securing an iconic cliffside sanctuary in Malibu or an expansive viticultural estate in Napa Valley, our advisors command unparalleled access to the world’s most coveted private addresses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Link
              to="/properties"
              className="px-8 py-4 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Explore The Archive</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/contact?subject=VIP+Advisory"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-xs uppercase tracking-widest font-semibold rounded-xs transition-all flex items-center justify-center cursor-pointer"
            >
              <span>Request Private Dossier</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryShowcase;
