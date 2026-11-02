import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { EMIRATES, OFF_PLAN_PROJECTS } from '../../data/offPlanData';
import RegisterInterestModal, { WhatsAppIcon } from './RegisterInterestModal';

const OffPlanProjectsSection = () => {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState('Kanpur');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);
  const scrollContainerRef = useRef(null);

  // Filter projects by city
  const filteredProjects = OFF_PLAN_PROJECTS.filter((p) => p.city === activeCity);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = (e, project) => {
    e.stopPropagation();
    // Open Register Interest Modal
    setSelectedProjectForModal(project);
  };

  const handleCardClick = (project) => {
    // Open Register Interest Modal with full details
    setSelectedProjectForModal(project);
  };

  const handleViewAllInCity = () => {
    navigate(`/properties?location=${encodeURIComponent(activeCity)}`);
  };

  return (
    <section id="off-plan-showcase" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* City / Emirates Horizontal Filter Pills */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white border border-[#E5E0D8] rounded-2xl shadow-xs">
          {EMIRATES.map((city) => {
            const isActive = activeCity === city;
            return (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-[#1C201C] hover:bg-[#F3F4F6]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-11 h-11 bg-white text-[#1C201C] hover:text-[#0D9488] rounded-full flex items-center justify-center shadow-lg border border-[#E5E0D8] transition-all hover:scale-110 cursor-pointer hidden md:flex"
          aria-label="Previous Projects"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow Button (Matching Image 2) */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-11 h-11 bg-white text-[#1C201C] hover:text-[#0D9488] rounded-full flex items-center justify-center shadow-lg border border-[#E5E0D8] transition-all hover:scale-110 cursor-pointer flex"
          aria-label="Next Projects"
        >
          <ChevronRight size={22} />
        </button>

        {/* Scrollable Project Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
        >
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => handleCardClick(project)}
              className="w-[285px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/11] overflow-hidden bg-[#F0EBE1]">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                
                {/* Developer Pill */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 backdrop-blur-md text-[#1C201C] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs border border-black/5">
                    {project.city}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C201C] group-hover:text-[#0D9488] transition-colors leading-snug line-clamp-1 mb-1">
                    {project.title}
                  </h3>
                  
                  <p className="text-xs text-[#6B7280] font-medium mb-2">
                    {project.type}
                  </p>

                  <div className="flex items-center text-[#6B7280] text-xs mb-3">
                    <MapPin size={13} className="text-[#0D9488] mr-1 shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                </div>

                {/* Two-Column Specification Highlight Box (Matching Image 2) */}
                <div>
                  <div className="bg-[#F4F7F6] rounded-xl p-3 mb-4 grid grid-cols-2 text-center border border-[#E3ECE8]">
                    <div className="border-r border-[#E3ECE8] pr-2">
                      <span className="text-[10px] uppercase font-semibold text-[#667085] tracking-wider block mb-0.5">
                        Launch Price
                      </span>
                      <span className="text-sm font-extrabold text-[#0D9488] tracking-tight">
                        {project.launchPrice}
                      </span>
                    </div>
                    <div className="pl-2">
                      <span className="text-[10px] uppercase font-semibold text-[#667085] tracking-wider block mb-0.5">
                        Handover
                      </span>
                      <span className="text-sm font-extrabold text-[#1C201C] tracking-tight">
                        {project.handover}
                      </span>
                    </div>
                  </div>

                  {/* Register Interest WhatsApp Action Button (Matching Image 2) */}
                  <button
                    type="button"
                    onClick={(e) => handleWhatsAppClick(e, project)}
                    className="w-full py-2.5 px-4 bg-[#E8F8F3] hover:bg-[#00A884] text-[#00A884] hover:text-white border border-[#A7E6D1] rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-2xs group/btn cursor-pointer"
                  >
                    <WhatsAppIcon size={16} className="text-[#00A884] group-hover/btn:text-white transition-colors" />
                    <span>Register Interest</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action: View all projects in City (Matching Image 2) */}
      <div className="text-center mt-8">
        <button
          onClick={handleViewAllInCity}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E6F4F1] hover:bg-[#D5EFEA] text-[#0D9488] text-xs sm:text-sm font-semibold rounded-full border border-[#BCE4DB] transition-all hover:gap-3 cursor-pointer shadow-xs"
        >
          <span>View all projects in {activeCity}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Interactive Modal for Register Interest & WhatsApp */}
      <RegisterInterestModal
        project={selectedProjectForModal}
        isOpen={!!selectedProjectForModal}
        onClose={() => setSelectedProjectForModal(null)}
      />
    </section>
  );
};

export default OffPlanProjectsSection;
