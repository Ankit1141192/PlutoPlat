import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, ArrowUp, Clock } from 'lucide-react';
import logo from '../../assets/websitelogo1.png';

// Clean SVG social icons matching Lucide styling
const XTwitterIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);
const InstagramIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const LinkedinIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const FacebookIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const socials = [
  { label: 'Twitter/X', href: 'https://twitter.com', Icon: XTwitterIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
];

const exploreLinks = [
  { to: '/properties', label: 'All properties' },
  { to: '/properties?purpose=Buy', label: 'Buy' },
  { to: '/properties?purpose=Rent', label: 'Rent' },
  { to: '/properties?purpose=Off-Plan', label: 'Off-plan' },
];

const companyLinks = [
  { to: '/about', label: 'About us' },
  { to: '/testimonials', label: 'Client Testimonials' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/more', label: 'Platform Extras & More' },
];

const legalLinks = [
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms of service' },
];

const OFFICE_QUERY = 'Civil Lines Kanpur';
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_QUERY)}`;

const linkClass =
  'group inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#A09D94] transition-colors hover:text-white';

const contactItems = [
  { Icon: Phone, label: 'Call us', value: '+91 99563 46155', href: 'tel:+919956346155' },
  { Icon: Mail, label: 'Email us', value: 'kanpur@plutoplat.com', href: 'mailto:kanpur@plutoplat.com' },
  { Icon: MapPin, label: 'Visit us', value: 'Civil Lines, Kanpur, UP', href: MAP_DIRECTIONS_URL },
  { Icon: Clock, label: 'Office hours', value: 'Mon – Sat, 10 AM – 7 PM' },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden bg-[#121512] text-[#D8D4CA]">
      {/* soft gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 360px at 85% 0%, rgba(180,154,112,0.12), transparent 70%), radial-gradient(500px 300px at 0% 60%, rgba(180,154,112,0.06), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-5 sm:pt-8 lg:pt-10 pb-4 sm:pb-6">
        {/* ───────── Main Columns ───────── */}
        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-5 sm:gap-y-8 pb-5 sm:pb-8 lg:grid-cols-12 lg:gap-8 lg:pb-8">
          {/* Brand: Logo + Para + Verified */}
          <div className="col-span-2 lg:col-span-4 lg:pr-4">
            {/* Header row: on mobile, logo on left and verified badge on right; on desktop, stacked */}
            <div className="flex items-center justify-between gap-3 sm:block">
              <Link
                to="/"
                className="shrink-0 focus:outline-none flex items-center w-28 sm:w-auto"
                aria-label="PlutoPlat Home"
              >
                <img
                  src={logo}
                  alt="PlutoPlat Logo"
                  className="h-13 w-auto scale-270 origin-left object-contain"
                />
              </Link>
              <div className="sm:hidden inline-flex items-center gap-1.5 rounded-full border border-[#2F352F] bg-[#171B17] px-2.5 py-1 text-[11px] text-[#B9B5AA] shrink-0">
                <ShieldCheck size={13} className="text-[#C9B287]" />
                Verified integrity
              </div>
            </div>

            <p className="mt-2.5 sm:mt-4 max-w-sm text-xs sm:text-sm font-light leading-relaxed text-[#A09D94]">
              Prime real estate across Kanpur, Uttar Pradesh and beyond. Landmark architecture, luxury residences and high-yield investments, handled with discretion.
            </p>

            <div className="hidden sm:inline-flex mt-4 items-center gap-2 rounded-full border border-[#2F352F] bg-[#171B17] px-3 py-1.5 text-xs text-[#B9B5AA]">
              <ShieldCheck size={14} className="text-[#C9B287]" />
              Verified legal integrity
            </div>
          </div>

          {/* Explore */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-2 sm:mb-3.5 font-serif text-sm sm:text-base font-normal text-white">Explore</h4>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {exploreLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className={linkClass}>
                    <span className="h-px w-0 bg-[#C9B287] transition-all duration-300 group-hover:w-2.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-2 sm:mb-3.5 font-serif text-sm sm:text-base font-normal text-white">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {companyLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className={linkClass}>
                    <span className="h-px w-0 bg-[#C9B287] transition-all duration-300 group-hover:w-2.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-2 sm:mb-3.5 font-serif text-sm sm:text-base font-normal text-white">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2.5">
              {legalLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className={linkClass}>
                    <span className="h-px w-0 bg-[#C9B287] transition-all duration-300 group-hover:w-2.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Office */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-2 sm:mb-3.5 font-serif text-sm sm:text-base font-normal text-white">Visit office</h4>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-[#A09D94]">
              <li>
                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 transition-colors hover:text-white"
                >
                  <MapPin size={13} className="mt-0.5 shrink-0 text-[#C9B287]" />
                  <span>Civil Lines, Kanpur</span>
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-[#77766E]">
                <Clock size={13} className="shrink-0 text-[#B49A70]" />
                <span>Mon – Sat, 10am – 7pm</span>
              </li>
              <li className="pt-0.5">
                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#B49A70]/15 border border-[#B49A70]/30 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-[#C9B287] transition hover:bg-[#B49A70] hover:text-[#161916]"
                >
                  Directions <ArrowUpRight size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ───────── Contact strip ───────── */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 border-t border-[#262B26] py-3.5 sm:py-5 lg:grid-cols-4">
          {contactItems.map(({ Icon, label, value, href }) => {
            const body = (
              <>
                <span className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-[#B49A70]/30 bg-[#B49A70]/10 text-[#C9B287]">
                  <Icon size={13} className="sm:w-4 sm:h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] sm:text-xs text-[#77766E]">{label}</span>
                  <span className="block truncate text-xs sm:text-sm leading-tight text-[#E4E0D6]">{value}</span>
                </span>
              </>
            );
            const cls =
              'flex items-center gap-2 sm:gap-3 rounded-xl border border-[#262B26] bg-[#161A16] p-2 sm:p-3 transition-colors';
            return href ? (
              <a key={label} href={href} className={`${cls} hover:border-[#B49A70]/50`}>
                {body}
              </a>
            ) : (
              <div key={label} className={cls}>
                {body}
              </div>
            );
          })}
        </div>

        {/* ───────── Bottom bar ───────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-[#262B26] py-3.5 sm:py-4 text-xs text-[#706D65]">
          <p className="text-center sm:text-left text-[11px] sm:text-xs order-2 sm:order-1">
            &copy; {new Date().getFullYear()} PlutoPlat International Real Estate Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`PlutoPlat on ${label}`}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#2F352F] text-[#A09D94] transition hover:border-[#B49A70] hover:bg-[#B49A70] hover:text-[#161916]"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex h-7 sm:h-8 items-center gap-1.5 rounded-full border border-[#2F352F] px-2.5 sm:px-3 text-[11px] sm:text-xs text-[#C9B287] transition hover:border-[#B49A70] hover:text-white order-3"
            title="Return to top"
          >
            Back to top <ArrowUp size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
