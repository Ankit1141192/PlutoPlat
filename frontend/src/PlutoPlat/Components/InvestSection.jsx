import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Building, Sparkles } from 'lucide-react';
import { OFF_PLAN_PROJECTS } from '../../data/offPlanData';
import RegisterInterestModal from './RegisterInterestModal';

const InvestSection = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  // Take the first 3 projects (id: 'off-1', 'off-2', 'off-3')
  const featuredProjects = OFF_PLAN_PROJECTS.slice(0, 3);

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-[#B49A70]/30 text-[#8E7448] px-3.5 py-1 rounded-full text-[11px] uppercase tracking-widest font-semibold mb-3"
        >
          <Sparkles size={13} className="text-[#B49A70]" />
          <span>Prime High-Yield Portfolios</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight mb-3"
        >
          Invest in Tomorrow's Address
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm sm:text-base text-[#6E6D66] font-light leading-relaxed"
        >
          Explore high-growth off-plan developments across the UAE.
        </motion.p>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            onClick={() => handleCardClick(project)}
            className="group relative bg-white rounded-2xl overflow-hidden border border-[#E5E0D8] shadow-[0_4px_20px_rgba(28,32,28,0.05)] hover:shadow-[0_20px_40px_rgba(28,32,28,0.12)] hover:border-[#B49A70]/60 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Image Container with aspect-[16/10] */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#1C201C]">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Dark Gradient Bottom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Top-Left Badge: "OFF-PLAN" */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#1C201C]/90 backdrop-blur-md text-[#E8D9BF] border border-[#B49A70]/40 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  OFF-PLAN
                </span>
              </div>

              {/* Top-Right City Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-white/90 backdrop-blur-md text-[#1C201C] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  {project.city}
                </span>
              </div>

              {/* Bottom Image Overlay Details */}
              <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                <div className="flex items-center text-xs text-[#E8D9BF] mb-1 font-medium">
                  <Building size={12} className="mr-1.5 text-[#B49A70] shrink-0" />
                  <span className="truncate">{project.developer}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-white group-hover:text-[#E8D9BF] transition-colors leading-snug truncate">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Bottom Card Body */}
            <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-white">
              <div>
                {/* Location */}
                <div className="flex items-center text-xs text-[#6E6D66] mb-4">
                  <MapPin size={13} className="text-[#B49A70] mr-1.5 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>

                {/* Specs Box: Starting Price & Handover Date */}
                <div className="grid grid-cols-2 gap-3 bg-[#F8F6F2] p-3.5 rounded-xl border border-[#EAE6DE] mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8E8B82] tracking-wider block mb-0.5">
                      Starting Price
                    </span>
                    <span className="font-serif text-base sm:text-lg font-semibold text-[#1C201C]">
                      {project.launchPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8E8B82] tracking-wider block mb-0.5">
                      Handover
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1C201C] flex items-center gap-1 mt-1">
                      <Calendar size={13} className="text-[#B49A70]" />
                      <span>{project.handover}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button: Explore Development */}
              <button
                type="button"
                className="w-full py-3 px-4 bg-[#1C201C] hover:bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm group-hover:shadow-md cursor-pointer"
              >
                <span>Explore Development</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Project Inquiries */}
      <RegisterInterestModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default InvestSection;