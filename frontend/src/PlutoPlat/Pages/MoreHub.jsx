import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
  Users,
  Heart,
  Clock,
  Sparkles,
  HelpCircle,
  FileText,
  Mail,
  ArrowUpRight,
  Compass,
  Building,
  KeyRound,
  Award
} from 'lucide-react';

const EXTRA_MODULES = [
  {
    title: 'Interactive Map Explorer',
    description: 'Explore verified trophy estates on the interactive geospatial map with satellite layers and real-time neighborhood metrics.',
    icon: Compass,
    link: '/properties#map',
    badge: 'Geospatial Radar',
    actionText: 'Launch Map Explorer',
    color: 'from-[#B49A70]/20 to-transparent',
  },
  {
    title: 'VIP Acquisition Pipeline & Deals',
    description: 'Track each milestone of your acquisition from initial viewing and letter of intent to legal due diligence and deed execution.',
    icon: TrendingUp,
    link: '/deals',
    badge: 'Deal Telemetry',
    actionText: 'Track Active Deals',
    color: 'from-emerald-500/15 to-transparent',
  },
  {
    title: 'Schedule Chauffeured Property Tours',
    description: 'Arrange discreet chauffeured viewings with certified estate advisors, executive security clearance, and physical deed reviews.',
    icon: CalendarCheck,
    link: '/scheduled-visits',
    badge: 'Concierge Viewing',
    actionText: 'Book Private Visit',
    color: 'from-amber-500/15 to-transparent',
  },
  {
    title: 'Private Wealth Advisors & Brokers',
    description: 'Directly contact verified RERA-accredited agents, legal counsel, and portfolio managers representing premium enclaves.',
    icon: Users,
    link: '/contact-agents',
    badge: 'Verified Advisors',
    actionText: 'Connect with Agents',
    color: 'from-blue-500/15 to-transparent',
  },
  {
    title: 'Confidential Inquiries & Offers',
    description: 'Review your submitted purchase inquiries, status updates from estate representatives, and private dossiers.',
    icon: FileText,
    link: '/my-enquiries',
    badge: 'Client Dossier',
    actionText: 'Review Enquiries',
    color: 'from-purple-500/15 to-transparent',
  },
  {
    title: 'Curated Saved Residences',
    description: 'Access your private portfolio of bookmarked penthouses, colonial villas, and waterfront sanctuaries.',
    icon: Heart,
    link: '/favorites',
    badge: 'Wishlist',
    actionText: 'View Saved Properties',
    color: 'from-rose-500/15 to-transparent',
  },
  {
    title: 'Recently Viewed Estates',
    description: 'Quickly revisit residences you recently inspected with pricing history and architectural floor plans.',
    icon: Clock,
    link: '/recently-viewed',
    badge: 'Recent History',
    actionText: 'Browse Viewed Homes',
    color: 'from-cyan-500/15 to-transparent',
  },
  {
    title: 'Institutional FAQ & Legal Guidelines',
    description: 'Clear answers on freehold registry procedures, stamp duty calculations, NRI repatriation rules, and escrow security.',
    icon: HelpCircle,
    link: '/faq',
    badge: 'Knowledge Base',
    actionText: 'Read FAQ & Legalities',
    color: 'from-stone-500/15 to-transparent',
  },
  {
    title: 'Heritage Brand Story & Heritage',
    description: 'Discover the architectural ethos behind PlutoPlat and our bespoke representation of India’s most prestigious estates.',
    icon: Award,
    link: '/about',
    badge: 'Our Legacy',
    actionText: 'Explore Brand Ethos',
    color: 'from-[#B49A70]/20 to-transparent',
  },
  {
    title: 'Direct VIP Concierge & Helpdesk',
    description: 'Reach our executive advisory desk directly for confidential off-market mandates, valuations, and bespoke acquisitions.',
    icon: Mail,
    link: '/contact',
    badge: '24/7 Concierge',
    actionText: 'Contact Concierge',
    color: 'from-emerald-500/15 to-transparent',
  },
];

const MoreHub = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C201C] pt-28 pb-24">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B49A70]/15 text-[#8E7448] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={13} />
            <span>Platform Services & Discovery Hub</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1C201C] font-normal tracking-tight leading-tight mb-6">
            Everything Extra, <br className="hidden sm:inline" />
            <span className="italic text-[#B49A70]">Curated in One Place.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#6E6D66] font-light leading-relaxed">
            Access our complete suite of institutional tools: interactive map navigation, deal progression milestones, chauffeured property tours, verified advisory contacts, and confidential portfolio management.
          </p>
        </div>
      </div>

      {/* Grid of Extra Services & Modules */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXTRA_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                to={mod.link}
                className="group relative bg-white border border-[#E7E3DA] rounded-2xl p-7 shadow-sm hover:shadow-xl hover:border-[#B49A70]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                {/* Subtle Glow */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${mod.color} rounded-bl-full pointer-events-none transition-transform group-hover:scale-125 duration-500`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#1C201C] text-[#E8D9BF] flex items-center justify-center shadow-md group-hover:bg-[#B49A70] group-hover:text-[#1C201C] transition-colors duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#F1ECE1] text-[#7A6B4C]">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-[#1C201C] font-semibold group-hover:text-[#8E7448] transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6E6D66] font-light leading-relaxed mt-2">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-[#F0ECE3] flex items-center justify-between text-xs font-semibold text-[#8E7448] group-hover:text-[#1C201C] transition-colors">
                  <span>{mod.actionText}</span>
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-[#1C201C] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70]">
              Need Bespoke Portfolio Curation?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-white leading-snug">
              Consult with Senior Real Estate Directors on High-Value Mandates
            </h2>
            <p className="text-sm text-[#C9C5BB] font-light leading-relaxed">
              Our private advisory unit coordinates off-market portfolio transfers, family office allocations, and legal clearance across all key metropolitan corridors.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-[#B49A70] text-[#1C201C] font-semibold text-xs uppercase tracking-wider hover:bg-[#C7AE83] transition-colors inline-flex items-center gap-2"
              >
                <span>Request Private Consultation</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link
                to="/properties"
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Browse All Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreHub;
