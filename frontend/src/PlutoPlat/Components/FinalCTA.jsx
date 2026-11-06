import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ShieldCheck, Handshake } from 'lucide-react';

// Official WhatsApp glyph (self-contained, no extra import path needed)
const WhatsAppLogo = ({ size = 22, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16.003 3C8.83 3 3 8.83 3 16.003c0 2.29.6 4.52 1.74 6.49L3 29l6.68-1.72a12.94 12.94 0 0 0 6.32 1.62h.005C23.18 28.9 29 23.07 29 15.9 29 12.43 27.65 9.17 25.2 6.72A12.9 12.9 0 0 0 16.003 3Zm0 23.7h-.004a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.96 1.02 1.06-3.86-.25-.4a10.68 10.68 0 0 1-1.64-5.74c0-5.9 4.8-10.7 10.7-10.7 2.86 0 5.54 1.11 7.56 3.14a10.62 10.62 0 0 1 3.13 7.57c0 5.9-4.8 10.69-10.76 10.69Zm5.87-8c-.32-.16-1.9-.94-2.2-1.05-.29-.1-.5-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.22-.37.24-.7.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.32c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.52-.08-.14-.29-.22-.61-.38Z" />
  </svg>
);

const stats = [
  { icon: Building2, label: 'Curated estates', value: '500+' },
  { icon: ShieldCheck, label: 'Legally verified', value: '100%' },
  { icon: Handshake, label: 'Private advisory', value: '16 yrs' },
];

const FinalCTA = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24 px-4 sm:px-6">
      {/* Background image with slow zoom */}
      <motion.img
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
        alt=""
        aria-hidden="true"
        animate={reduce ? undefined : { scale: [1, 1.08] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Layered overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#1C201C]/90" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-[#B49A70]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md shadow-2xl px-5 py-10 sm:px-12 sm:py-14 text-center"
        >
          <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent" />

          <h2 className="text-white font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-tight mb-4">
            Find your next address
          </h2>

          <p className="text-white/80 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10">
            Discover exceptional homes, riverside sanctuaries, and high-growth developments across
            Kanpur, Uttar Pradesh and prime global destinations.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/properties"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B49A70] hover:bg-[#9E865F] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Explore properties</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://wa.me/919956346155?text=Hello%20PlutoPlat,%20I%20am%20interested%20in%20luxury%20properties%20in%20Kanpur,%20Uttar%20Pradesh."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <WhatsAppLogo size={22} />
              <span className="text-left leading-tight">
                Chat on WhatsApp
                <span className="block text-[11px] font-normal text-white/90">+91 9956346155</span>
              </span>
            </a>

            <Link
              to="/contact?subject=List+Your+Property"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/70 text-white hover:bg-white hover:text-[#1C201C] rounded-xl font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              List your property
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-3 gap-3 sm:gap-6 text-white">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={18} className="text-[#B49A70]" />
                <span className="font-serif text-xl sm:text-3xl">{value}</span>
                <span className="text-[11px] sm:text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;