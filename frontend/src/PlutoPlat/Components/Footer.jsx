import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, ArrowUp, Clock } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

// Clean SVG social icons matching Lucide styling
const XTwitterIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);
const InstagramIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const LinkedinIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const FacebookIcon = ({ size = 18, className = '' }) => (
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

const linkGroups = [
  {
    title: 'Explore',
    links: [
      { to: '/properties', label: 'All properties' },
      { to: '/properties?purpose=Buy', label: 'Buy' },
      { to: '/properties?purpose=Rent', label: 'Rent' },
      { to: '/properties?purpose=Off-Plan', label: 'Off-plan' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/testimonials', label: 'Client Testimonials' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact' },
      { to: '/more', label: 'Platform Extras & More' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy policy' },
      { to: '/terms', label: 'Terms of service' },
    ],
  },
];

// Change this to your exact address or business name to pin the map precisely.
const OFFICE_QUERY = 'Civil Lines Kanpur';
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(OFFICE_QUERY)}&z=14&output=embed`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_QUERY)}`;

const linkClass =
  'group inline-flex items-center gap-1.5 text-sm text-[#A09D94] transition-colors hover:text-white';

const contactItems = [
  { Icon: MapPin, label: 'Visit us', value: 'Civil Lines & Swaroop Nagar, Kanpur, Uttar Pradesh 208001' },
  { Icon: Phone, label: 'Call us', value: '+91 99563 46155', href: 'tel:+919956346155' },
  { Icon: Mail, label: 'Email us', value: 'kanpur@plutoplat.com', href: 'mailto:kanpur@plutoplat.com' },
  { Icon: Clock, label: 'Office hours', value: 'Mon – Sat, 10:00 AM – 7:00 PM' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = usePropertyStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('You have been enrolled in the Private Gazette digest.', 'success');
    setEmail('');
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden bg-[#121512] text-[#D8D4CA]">
      {/* soft gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 360px at 85% 0%, rgba(180,154,112,0.14), transparent 70%), radial-gradient(500px 300px at 0% 60%, rgba(180,154,112,0.07), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-6 lg:pt-24">
        {/* ───────── Newsletter panel ───────── */}
        <div className="rounded-3xl bg-gradient-to-br from-[#B49A70]/50 via-[#B49A70]/10 to-transparent p-px">
          <div className="grid grid-cols-1 items-center gap-6 rounded-3xl bg-[#191D19] p-6 sm:p-8 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-8">
            <div className="lg:col-span-8">
              <p className="mb-2 text-sm font-medium text-[#C9B287]">The Private Gazette</p>
              <h3 className="font-serif text-2xl font-normal leading-snug text-white xl:whitespace-nowrap xl:text-[28px]">
                Off-market homes, sent to you before they go public.
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#A09D94]">
                A twice-monthly digest of private acquisitions for collectors, family offices and developers. No spam, ever.
              </p>
            </div>

            <div className="lg:col-span-4">
              {subscribed ? (
                <div className="flex items-start gap-3 rounded-2xl border border-[#B49A70]/40 bg-[#202520] p-4 text-sm text-[#E8D9BF]">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#B49A70]" />
                  <span>Subscription confirmed. Confidential briefings will be delivered to your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#77766E]" />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Your email address"
                      aria-label="Email address"
                      className="w-full rounded-xl border border-[#353B35] bg-[#202520] py-3 pl-11 pr-4 text-base text-white placeholder:text-[#6E6D66] transition-colors focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9B287] to-[#B49A70] text-sm font-semibold text-[#161916] transition hover:brightness-110 active:scale-[0.99]"
                  >
                    Subscribe <ArrowUpRight size={16} />
                  </button>
                  <p className="flex items-center gap-1.5 text-xs text-[#6E6D66]">
                    <ShieldCheck size={13} className="text-[#B49A70]" />
                    We never share or sell subscriber details.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ───────── Link columns ───────── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-3 lg:pr-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-normal tracking-tight text-white">
                Pluto<span className="text-[#C9B287]">Plat</span>.
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-[#A09D94]">
              Prime real estate across Kanpur, Uttar Pradesh and beyond. Landmark architecture, luxury residences and
              high-yield investments, handled with discretion.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#2F352F] bg-[#171B17] px-3.5 py-2 text-xs text-[#B9B5AA]">
              <ShieldCheck size={15} className="text-[#C9B287]" />
              Verified legal integrity
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map(({ title, links }) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="mb-5 font-serif text-lg font-normal text-white">{title}</h4>
              <ul className="space-y-3.5">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className={linkClass}>
                      <span className="h-px w-0 bg-[#C9B287] transition-all duration-300 group-hover:w-3" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Mini map */}
          <div className="col-span-2 lg:col-span-3">
            <h4 className="mb-5 font-serif text-lg font-normal text-white">Visit our office</h4>

            <div className="overflow-hidden rounded-2xl border border-[#2F352F] bg-[#161A16]">
              <iframe
                title="PlutoPlat office location, Civil Lines, Kanpur"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-36 w-full border-0 opacity-90 [filter:grayscale(1)_invert(0.9)_contrast(0.9)]"
              />

              <div className="flex items-center justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#E4E0D6]">Civil Lines, Kanpur</p>
                  <p className="text-xs text-[#77766E]">Open Mon – Sat</p>
                </div>
                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#B49A70] px-3.5 text-xs font-semibold text-[#161916] transition hover:brightness-110"
                >
                  Directions <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Contact strip ───────── */}
        <div className="grid grid-cols-1 gap-3 border-t border-[#262B26] py-8 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map(({ Icon, label, value, href }) => {
            const body = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#B49A70]/30 bg-[#B49A70]/10 text-[#C9B287]">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-[#77766E]">{label}</span>
                  <span className="block text-sm leading-snug text-[#E4E0D6]">{value}</span>
                </span>
              </>
            );
            const cls =
              'flex items-center gap-3.5 rounded-2xl border border-[#262B26] bg-[#161A16] p-4 transition-colors';
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
        <div className="flex flex-col items-center gap-6 border-t border-[#262B26] py-8 text-xs text-[#706D65] md:flex-row md:justify-between">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} PlutoPlat International Real Estate Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2.5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`PlutoPlat on ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2F352F] text-[#A09D94] transition hover:border-[#B49A70] hover:bg-[#B49A70] hover:text-[#161916]"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex h-10 items-center gap-2 rounded-full border border-[#2F352F] px-4 text-[#C9B287] transition hover:border-[#B49A70] hover:text-white"
            title="Return to top"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;