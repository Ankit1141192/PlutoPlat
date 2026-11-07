import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Building2, ShieldCheck, Handshake } from 'lucide-react';

// Official WhatsApp glyph (self-contained, no extra import path needed)
const WhatsAppLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.003 3C8.83 3 3 8.83 3 16.003c0 2.29.6 4.52 1.74 6.49L3 29l6.68-1.72a12.94 12.94 0 0 0 6.32 1.62h.005C23.18 28.9 29 23.07 29 15.9 29 12.43 27.65 9.17 25.2 6.72A12.9 12.9 0 0 0 16.003 3Zm0 23.7h-.004a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.96 1.02 1.06-3.86-.25-.4a10.68 10.68 0 0 1-1.64-5.74c0-5.9 4.8-10.7 10.7-10.7 2.86 0 5.54 1.11 7.56 3.14a10.62 10.62 0 0 1 3.13 7.57c0 5.9-4.8 10.69-10.76 10.69Zm5.87-8c-.32-.16-1.9-.94-2.2-1.05-.29-.1-.5-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.22-.37.24-.7.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.32c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.52-.08-.14-.29-.22-.61-.38Z" />
  </svg>
);

const stats = [
  { icon: Building2, label: 'Curated estates', value: '500+' },
  { icon: ShieldCheck, label: 'Legally verified', value: '100%' },
  { icon: Handshake, label: 'Private advisory', value: '16 yrs' },
];

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

const FinalCTA = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-44">
      {/* Designed background (no photo) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0F130F] via-[#1B211B] to-[#262B20]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(620px 420px at 85% 0%, rgba(201,178,135,0.30), transparent 70%), radial-gradient(520px 380px at 0% 100%, rgba(201,178,135,0.16), transparent 70%)',
        }}
      />
      {/* dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 35%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, #000 35%, transparent)',
        }}
      />
      {/* gold rings */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] text-[#C9B287] opacity-[0.14]"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="200" cy="200" r="60" />
        <circle cx="200" cy="200" r="110" />
        <circle cx="200" cy="200" r="160" />
        <circle cx="200" cy="200" r="195" />
      </svg>
      {/* skyline line-art */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-full text-[#C9B287] opacity-[0.13] lg:w-3/5"
        viewBox="0 0 800 260"
        preserveAspectRatio="xMaxYMax meet"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 259h800" />
        <path d="M30 259V150h70v109M30 150l35-28 35 28M50 175h30M50 200h30M50 225h30" />
        <path d="M130 259V70h90v189M130 70h90M150 95h50M150 120h50M150 145h50M150 170h50M150 195h50M150 220h50" />
        <path d="M250 259V120h60v139M250 120l30-40 30 40M265 150h30M265 180h30M265 210h30" />
        <path d="M340 259V30h80v229M340 30l40-22 40 22M358 60h44M358 90h44M358 120h44M358 150h44M358 180h44M358 210h44" />
        <path d="M450 259V140h100v119M450 140h100M470 165h20M510 165h20M470 195h20M510 195h20M485 259v-30h30v30" />
        <path d="M580 259V90h70v169M580 90h70M598 115h34M598 145h34M598 175h34M598 205h34" />
        <path d="M680 259V160h90v99M680 160l45-30 45 30M700 190h50M700 220h50" />
      </svg>

      {/* Curved top edge – change text-[#F1EEE6] to match the section above */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[5] h-16 w-full text-[#F1EEE6] sm:h-24 lg:h-32"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path fill="currentColor" d="M0 0H1440V50C1200 118 960 118 720 72C480 26 240 26 0 86Z" />
        <path
          fill="none"
          stroke="#C9B287"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          opacity="0.8"
          d="M1440 50C1200 118 960 118 720 72C480 26 240 26 0 86"
        />
      </svg>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* ───────── Left: message + actions ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-white lg:col-span-7 lg:text-left"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9B287]/40 bg-white/5 px-4 py-2 text-xs font-medium text-[#E8D9BF] backdrop-blur-sm sm:text-[13px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9B287]" />
            Kanpur, Uttar Pradesh &amp; beyond
          </p>

          <h2 className="font-serif text-[34px] font-normal leading-[1.08] sm:text-5xl lg:text-6xl">
            Find your
            <span className="block text-[#E8D9BF]">next address.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/80 sm:text-lg lg:mx-0">
            Exceptional homes, riverside sanctuaries and high-growth developments across Kanpur and prime destinations
            worldwide.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-stretch lg:justify-start sm:justify-center">
            <Link
              to="/properties"
              className={`group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9B287] to-[#B49A70] px-8 text-sm font-semibold text-[#161916] shadow-lg transition hover:brightness-110 ${focusRing}`}
            >
              <span>Explore properties</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://wa.me/919956346155?text=Hello%20PlutoPlat,%20I%20am%20interested%20in%20luxury%20properties%20in%20Kanpur,%20Uttar%20Pradesh."
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-7 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1EBE5A] ${focusRing}`}
            >
              <WhatsAppLogo size={24} />
              <span className="text-left leading-tight">
                Chat on WhatsApp
                <span className="block text-[11px] font-normal text-white/90">+91 99563 46155</span>
              </span>
            </a>

            <Link
              to="/contact?subject=List+Your+Property"
              className={`group inline-flex min-h-14 items-center justify-center gap-1.5 rounded-xl border border-white/60 px-7 text-sm font-semibold text-white transition hover:bg-white hover:text-[#1C201C] ${focusRing}`}
            >
              List your property
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>

        {/* ───────── Right: trust panel ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-white shadow-2xl backdrop-blur-md sm:p-6 lg:p-8">
            {/* phones: 3 compact columns, desktop: stacked rows */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-white/10">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 text-center lg:flex-row lg:gap-5 lg:py-5 lg:text-left lg:first:pt-0 lg:last:pb-0"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B49A70]/40 bg-[#B49A70]/15 text-[#E4D2AB] lg:h-12 lg:w-12">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-2xl leading-none sm:text-3xl lg:text-4xl">{value}</span>
                    <span className="mt-1 block text-[11px] text-white/70 sm:text-xs lg:text-sm">{label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;