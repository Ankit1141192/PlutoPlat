import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, ArrowUp } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

// Clean SVG Social Icons matching Lucide standard styling
const XTwitterIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#161916] text-[#D8D4CA] border-t border-[#2A2E2A] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Newsletter & Advisory Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2A2E2A]">
          <div className="lg:col-span-6">
            <span className="text-xs font-semibold text-[#B49A70] uppercase tracking-widest block mb-3">
              The Private Gazette &bull; Confidential Digest
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-white font-normal mb-4 leading-snug">
              Receive Off-Market Architectural Acquisitions Directly to Your Inbox.
            </h3>
            <p className="text-sm text-[#A09D94] max-w-lg leading-relaxed font-light">
              Join over 24,000 qualified collectors, family offices, and developers who review our bi-weekly private acquisitions before global release.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            {subscribed ? (
              <div className="p-4 bg-[#202520] border border-[#B49A70]/40 rounded-xl text-[#E8D9BF] text-sm flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#B49A70] shrink-0" />
                <span>Subscription confirmed. Confidential briefings will be delivered to your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77766E]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your personal or family office email..."
                    className="w-full pl-11 pr-4 py-3.5 bg-[#202520] border border-[#353B35] rounded-xl text-white text-sm placeholder:text-[#6E6D66] focus:outline-none focus:border-[#B49A70] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowUpRight size={15} />
                </button>
              </form>
            )}
            <span className="text-[11px] text-[#6E6D66] mt-3">
              Strict privacy guaranteed. We never broker or distribute subscriber credentials.
            </span>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 py-16 border-b border-[#2A2E2A]">
          {/* Brand Intro */}
          <div className="lg:col-span-2 pr-4">
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-normal text-white tracking-tight">
                Pluto<span className="text-[#B49A70]">Plat</span>.
              </span>
            </Link>
            <p className="text-sm text-[#A09D94] leading-relaxed mb-6 font-light">
              PlutoPlat is the benchmark in prime real estate across the UAE and worldwide. We represent landmark architecture, luxury residences, and high-yield investments with unmatched discretion.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#8E8B82]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#B49A70]" />
                <span>Verified Legal Integrity</span>
              </div>
              <span>&bull;</span>
              <span>Dubai &bull; Abu Dhabi &bull; London</span>
            </div>
          </div>

          {/* Column: EXPLORE */}
          <div>
            <h4 className="font-serif text-base text-white mb-5 uppercase tracking-wider font-semibold">
              Explore
            </h4>
            <ul className="space-y-3 text-xs text-[#A09D94] uppercase tracking-wider">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=Buy" className="hover:text-white transition-colors">
                  Buy
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=Rent" className="hover:text-white transition-colors">
                  Rent
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=Off-Plan" className="hover:text-white transition-colors">
                  Off-Plan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: COMPANY */}
          <div>
            <h4 className="font-serif text-base text-white mb-5 uppercase tracking-wider font-semibold">
              Company
            </h4>
            <ul className="space-y-3 text-xs text-[#A09D94] uppercase tracking-wider">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: LEGAL */}
          <div>
            <h4 className="font-serif text-base text-white mb-5 uppercase tracking-wider font-semibold">
              Legal
            </h4>
            <ul className="space-y-3 text-xs text-[#A09D94] uppercase tracking-wider">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Concierge Desk */}
          <div>
            <h4 className="font-serif text-base text-white mb-5 uppercase tracking-wider font-semibold">
              Kanpur & Global Desk
            </h4>
            <div className="space-y-3.5 text-xs text-[#A09D94]">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#B49A70] shrink-0 mt-0.5" />
                <p>Civil Lines & Swaroop Nagar, Kanpur, Uttar Pradesh 208001, India</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#B49A70] shrink-0" />
                <a href="tel:+919956346155" className="hover:text-white transition-colors font-medium text-white">
                  +91 9956346155
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#B49A70] shrink-0" />
                <span>kanpur@plutoplat.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright + Social Icons */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#706D65] gap-4">
          <p>&copy; {new Date().getFullYear()} PlutoPlat International Real Estate Inc. All rights reserved.</p>

          {/* Social Icons (Twitter/X, Instagram, LinkedIn, Facebook) */}
          <div className="flex items-center gap-5 text-[#A09D94]">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PlutoPlat on Twitter/X"
              className="hover:text-[#B49A70] transition-colors"
            >
              <XTwitterIcon size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PlutoPlat on Instagram"
              className="hover:text-[#B49A70] transition-colors"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PlutoPlat on LinkedIn"
              className="hover:text-[#B49A70] transition-colors"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PlutoPlat on Facebook"
              className="hover:text-[#B49A70] transition-colors"
            >
              <FacebookIcon size={18} />
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#B49A70] hover:text-white transition-colors cursor-pointer ml-2"
              title="Return to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;