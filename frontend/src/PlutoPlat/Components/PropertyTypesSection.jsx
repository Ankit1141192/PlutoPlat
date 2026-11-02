import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const PROPERTY_TYPES = [
  {
    id: 'apartments',
    name: 'Apartments',
    count: '1,240',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    link: '/properties?type=Apartments'
  },
  {
    id: 'villas',
    name: 'Villas',
    count: '486',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    link: '/properties?type=Villas'
  },
  {
    id: 'penthouses',
    name: 'Penthouses',
    count: '128',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    link: '/properties?type=Apartments&purpose=Buy'
  },
  {
    id: 'townhouses',
    name: 'Townhouses',
    count: '342',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    link: '/properties?type=Homes'
  },
  {
    id: 'offplan',
    name: 'Off-Plan',
    count: '890',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    link: '#off-plan-showcase'
  },
  {
    id: 'plots',
    name: 'Land & Plots',
    count: '215',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    link: '/properties?type=Plots'
  },
  {
    id: 'luxury',
    name: 'Luxury Homes',
    count: '94',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
    link: '/properties?type=Homes&purpose=Buy'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    count: '167',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    link: '/properties'
  }
];

const PropertyTypesSection = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const handleCardClick = (link) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight mb-3"
        >
          Explore Properties
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm sm:text-base text-[#6E6D66] font-light leading-relaxed"
        >
          Discover exceptional residences, waterfront plots, and prime investments across Kanpur, Uttar Pradesh & premier global enclaves.
        </motion.p>
      </div>

      {/* Grid on md+ / Carousel on mobile */}
      <div className="relative">
        {/* Mobile-Only Carousel Navigation Buttons */}
        <button
          onClick={() => scrollCarousel('left')}
          aria-label="Previous property types"
          className="md:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#1C201C] shadow-lg flex items-center justify-center border border-[#E5E0D8] active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scrollCarousel('right')}
          aria-label="Next property types"
          className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#1C201C] shadow-lg flex items-center justify-center border border-[#E5E0D8] active:scale-95 transition-transform"
        >
          <ChevronRight size={20} />
        </button>

        {/* Cards Container: flex scroll on mobile, grid on md+ */}
        <div
          ref={carouselRef}
          className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scroll-smooth"
        >
          {PROPERTY_TYPES.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              whileHover={{ y: -8 }}
              onClick={() => handleCardClick(item.link)}
              className="group relative shrink-0 w-[200px] sm:w-[240px] md:w-full snap-start h-56 sm:h-64 md:h-72 aspect-[3/4] rounded-2xl border-0 overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white flex items-end justify-between z-10">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight text-white group-hover:text-[#E8D9BF] transition-colors mb-0.5">
                    {item.name}
                  </h3>
                  <span className="text-xs text-[#E5E0D8]/80 font-light block">
                    {item.count} Listings
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#B49A70] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shrink-0">
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypesSection;