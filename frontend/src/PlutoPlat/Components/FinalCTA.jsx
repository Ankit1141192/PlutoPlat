import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <section className="relative w-full min-h-[400px] sm:min-h-[480px] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background Image with Slow Ken Burns Zoom (1.0 to 1.08 over 12s alternate infinite) */}
      <motion.img
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
        alt="Luxury Property Architecture"
        animate={{ scale: [1, 1.08] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Dark Overlay (bg-black/55) */}
      <div className="absolute inset-0 bg-black/55 backdrop-brightness-95" />

      {/* Centered Content */}
      <div className="relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Heading */}
          <h2 className="text-white font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-tight mb-4">
            Find Your Next Address
          </h2>

          {/* Subtitle */}
          <p className="text-white/80 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10">
            Discover exceptional homes, riverside sanctuaries, and high-growth developments across Kanpur, Uttar Pradesh and prime global destinations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-8 py-4 bg-[#B49A70] hover:bg-[#9E865F] text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl text-center"
            >
              Explore Properties
            </Link>
            <a
              href="https://wa.me/919956346155?text=Hello%20PlutoPlat,%20I%20am%20interested%20in%20luxury%20properties%20in%20Kanpur,%20Uttar%20Pradesh."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
            >
              <span>WhatsApp: +91 9956346155</span>
            </a>
            <Link
              to="/contact?subject=List+Your+Property"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#1C201C] rounded-xl font-semibold text-sm transition-all text-center"
            >
              List Your Property
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;