import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  RentBuildingIsometric, 
  SaleHouseIsometric, 
  OffPlanConstructionIsometric 
} from './IsometricIcons';

const INTENT_CARDS = [
  {
    id: 'rent',
    line1: 'Property for',
    line2: 'Rent',
    link: '/properties?purpose=Rent',
    component: RentBuildingIsometric,
    accentBorder: 'hover:border-sky-300'
  },
  {
    id: 'sale',
    line1: 'Property for',
    line2: 'Sale',
    link: '/properties?purpose=Buy',
    component: SaleHouseIsometric,
    accentBorder: 'hover:border-rose-300'
  },
  {
    id: 'off-plan',
    line1: 'Off-Plan',
    line2: 'Properties',
    link: '#off-plan-showcase',
    component: OffPlanConstructionIsometric,
    accentBorder: 'hover:border-amber-300'
  }
];

const PurposeCardsSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    if (card.link.startsWith('#')) {
      const element = document.getElementById(card.link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/properties?type=Off-Plan');
      }
    } else {
      navigate(card.link);
    }
  };

  return (
    <section className="relative py-6 sm:py-10 px-3 sm:px-6 max-w-4xl mx-auto z-20">
      {/* 3 Intent Cards Side-by-Side: Matching Image 1 for Mobile & Desktop */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
        {INTENT_CARDS.map((card, idx) => {
          const IconComponent = card.component;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(card)}
              className={`group bg-white rounded-2xl sm:rounded-3xl border border-[#E7E2D8] p-3 sm:p-6 md:p-8 flex flex-col items-center justify-between text-center shadow-[0_8px_30px_rgba(28,32,28,0.06)] hover:shadow-[0_20px_40px_rgba(28,32,28,0.12)] ${card.accentBorder} transition-all duration-300 cursor-pointer select-none`}
            >
              {/* Centered Isometric 3D Graphic */}
              <div className="w-full flex items-center justify-center my-1 sm:my-3">
                <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center transform group-hover:scale-108 transition-transform duration-300">
                  <IconComponent className="w-full h-full object-contain drop-shadow-xs" />
                </div>
              </div>

              {/* Title Matching Image 1 (Centered two-line clean typography) */}
              <div className="mt-2 sm:mt-4 text-[#1C201C] group-hover:text-[#B49A70] transition-colors leading-tight">
                <div className="font-sans text-xs sm:text-base md:text-xl font-medium tracking-tight">
                  {card.line1}
                </div>
                <div className="font-sans text-xs sm:text-base md:text-xl font-semibold tracking-tight">
                  {card.line2}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PurposeCardsSection;
