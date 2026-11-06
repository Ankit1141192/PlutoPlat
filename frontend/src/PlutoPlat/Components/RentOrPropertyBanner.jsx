import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RentOrPropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6 sm:my-10">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#005A3E] via-[#026646] to-[#015237] shadow-xl border border-[#0A7B57]/30 text-white p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        
        {/* Left Side: Buildings Vector Illustration matching user design */}
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          <div className="relative shrink-0 flex items-end h-16 sm:h-20 w-28 sm:w-36 select-none pointer-events-none">
            {/* SVG Skyline Graphic */}
            <svg
              viewBox="0 0 160 90"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Teal low-rise building */}
              <rect x="5" y="55" width="22" height="35" rx="1.5" fill="#14B8A6" />
              <rect x="9" y="60" width="4" height="6" fill="#F0FDFA" opacity="0.8" />
              <rect x="17" y="60" width="4" height="6" fill="#F0FDFA" opacity="0.8" />
              <rect x="9" y="70" width="4" height="6" fill="#F0FDFA" opacity="0.8" />
              <rect x="17" y="70" width="4" height="6" fill="#F0FDFA" opacity="0.8" />

              {/* Orange Spire Building */}
              <path d="M37 25 L45 15 L53 25 V90 H37 Z" fill="#F97316" />
              <circle cx="45" cy="15" r="2" fill="#FEF08A" />
              <line x1="45" y1="28" x2="45" y2="85" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* White Minimalist House */}
              <rect x="55" y="62" width="20" height="28" fill="#FFFFFF" opacity="0.95" />
              <rect x="61" y="72" width="8" height="18" fill="#0D9488" />

              {/* Cyan Dome Skyscraper */}
              <path d="M80 30 Q90 10 100 30 V90 H80 Z" fill="#06B6D4" />
              <path d="M85 30 Q90 16 95 30 V90 H85 Z" fill="#0284C7" />
              <circle cx="90" cy="10" r="2.5" fill="#38BDF8" />

              {/* Blue Glass Highrise */}
              <rect x="103" y="38" width="28" height="52" rx="2" fill="#0284C7" />
              <line x1="110" y1="42" x2="110" y2="85" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="117" y1="42" x2="117" y2="85" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="124" y1="42" x2="124" y2="85" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="3 3" />

              {/* Modern White Office Block */}
              <rect x="133" y="50" width="24" height="40" rx="2" fill="#E2E8F0" />
              <rect x="139" y="57" width="12" height="16" rx="1" fill="#005A3E" opacity="0.3" />

              {/* Hanging Sale Tag */}
              <path d="M78 38 C75 22 100 18 103 35" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
              <g transform="translate(86, 20) rotate(-18)">
                <rect x="0" y="0" width="24" height="14" rx="3" fill="#84CC16" />
                <circle cx="4" cy="7" r="1.5" fill="#005A3E" />
                <text x="8" y="10.5" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Sale</text>
              </g>
            </svg>
          </div>

          {/* Heading and Subtext */}
          <div className="flex-1 text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
              <span className="text-[#FFDE59]">Rent room</span>{' '}
              <span className="text-white">or other property</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-normal mt-1 leading-relaxed">
              Connect with a trusted agent to secure the best deal, faster.
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="w-full md:w-auto shrink-0 flex justify-end">
          <button
            onClick={() => navigate('/contact-agents')}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-white hover:bg-[#F3F4F6] text-[#005A3E] font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Get Started</span>
            <ChevronRight size={18} className="text-[#005A3E] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default RentOrPropertyBanner;
