import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, Search, Send, PhoneCall, Calendar, 
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building, ChevronRight
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Open Website & Explore',
    subtitle: 'Browse Archival Portfolios',
    description: 'Explore verified luxury mansions, sea-view penthouses, and heritage plots without barrier.',
    icon: Compass,
    link: '/properties',
    linkText: 'Explore Catalog',
    tag: 'Guest Accessible'
  },
  {
    step: 2,
    title: 'Find Dream Property',
    subtitle: 'Intelligent Spatial Search',
    description: 'Filter by budget in Crores/USD, architectural category, GPS cadastre, and verified titles.',
    icon: Search,
    link: '/search',
    linkText: 'Start Search',
    tag: 'Instant Filter'
  },
  {
    step: 3,
    title: 'Contact Seller / Agents',
    subtitle: 'Confidential Inquiry',
    description: 'Submit an acquisition brief or request full certified prospectus under discrete NDA protocol.',
    icon: Send,
    link: '/contact-agents',
    linkText: 'Meet Advisors',
    tag: 'Fiduciary Duty'
  },
  {
    step: 4,
    title: 'Schedule Property Visit',
    subtitle: 'Chauffeured or 4K Virtual',
    description: 'Coordinate private on-site inspection or guided 4K walkthrough with assigned senior advisors.',
    icon: Calendar,
    link: '/scheduled-visits',
    linkText: 'View Itineraries',
    tag: 'Chauffeured Service'
  },
  {
    step: 5,
    title: 'Complete Deal Process',
    subtitle: '7-Stage Secure Escrow',
    description: 'Track offer negotiation, token escrow advance, legal due diligence, title registration, and handover.',
    icon: CheckCircle2,
    link: '/deals',
    linkText: 'Track Active Deals',
    tag: 'Escrow Protected'
  }
];

const UserJourneyWorkflow = ({ compact = false }) => {
  const [activeStep, setActiveStep] = useState(1);
  const { user } = usePropertyStore();

  return (
    <div className={`w-full ${compact ? 'py-4' : 'py-5 sm:py-12'} bg-[#1C201C] text-white rounded-2xl sm:rounded-3xl border border-[#2E342E] shadow-xl sm:shadow-2xl relative overflow-hidden my-4 sm:my-10`}>
      {/* Subtle gold glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B49A70]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B49A70]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-4 sm:mb-10 border-b border-white/10 pb-3 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-[#B49A70] bg-white/5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full mb-1.5 sm:mb-3 border border-[#B49A70]/20">
              <Sparkles size={11} className="sm:w-[13px] sm:h-[13px]" />
              <span>Institutional Acquisition Protocol</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-white font-normal tracking-tight">
              The PlutoPlat Client Journey
            </h2>
            <p className="text-[11px] sm:text-sm text-[#A09D94] mt-1 sm:mt-2 max-w-2xl font-light leading-relaxed">
              From open public browsing to bespoke agent advisory, private chauffeured site visits, and multi-stage deal escrow closure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] text-[#A09D94]">Account Status:</span>
            {user ? (
              <span className="text-[11px] sm:text-xs font-semibold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#10B981]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Logged In as {user.name?.split(' ')[0]}</span>
              </span>
            ) : (
              <Link
                to="/login"
                className="text-[11px] sm:text-xs font-semibold text-[#B49A70] hover:text-white bg-[#B49A70]/20 hover:bg-[#B49A70]/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#B49A70]/40 transition-colors"
              >
                Guest Mode &bull; Sign In &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* 5 Steps Interactive Grid (2 cards per row on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
          {WORKFLOW_STEPS.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeStep === item.step;
            const isLastOnMobile = index === WORKFLOW_STEPS.length - 1;

            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isLastOnMobile ? 'col-span-2 md:col-span-1' : ''
                } ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#2A312A] to-[#1F251F] border-[#B49A70] shadow-xl scale-[1.01]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div>
                  {/* Step Number & Tag */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-serif text-[11px] sm:text-sm font-bold ${
                      isSelected ? 'bg-[#B49A70] text-[#1C201C]' : 'bg-white/10 text-white'
                    }`}>
                      0{item.step}
                    </span>
                    <span className="text-[7px] sm:text-[9px] uppercase tracking-wider font-semibold text-[#B49A70] bg-[#B49A70]/10 px-1 py-0.5 rounded-xs sm:rounded-sm">
                      {item.tag}
                    </span>
                  </div>

                  <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl w-fit mb-1.5 sm:mb-2.5 ${
                    isSelected ? 'bg-[#B49A70]/20 text-[#E8D9BF]' : 'bg-white/5 text-[#A09D94]'
                  }`}>
                    <Icon size={16} className="sm:w-[22px] sm:h-[22px]" />
                  </div>

                  <h3 className="font-serif text-xs sm:text-base text-white font-medium mb-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[9px] sm:text-[11px] text-[#B49A70] font-sans font-medium mb-1 sm:mb-1.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                  <p className="text-[9px] sm:text-[11px] text-[#A09D94] font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-2 sm:mt-4 pt-1.5 sm:pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={item.link}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[9px] sm:text-[11px] uppercase font-semibold text-[#E8D9BF] hover:text-white inline-flex items-center gap-1 group"
                  >
                    <span>{item.linkText}</span>
                    <ChevronRight size={11} className="transition-transform group-hover:translate-x-1 text-[#B49A70] sm:w-3 sm:h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserJourneyWorkflow;
