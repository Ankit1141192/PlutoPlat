import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Building, Building2, Trees, ArrowRight } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const CategorySection = () => {
  const navigate = useNavigate();
  const { categories } = usePropertyStore();

  const getIcon = (type) => {
    const iconClass = "w-5 h-5 sm:w-7 sm:h-7";
    switch (type) {
      case 'Homes':
        return <Home className={iconClass} />;
      case 'Villas':
        return <Building className={iconClass} />;
      case 'Apartments':
        return <Building2 className={iconClass} />;
      case 'Plots':
        return <Trees className={iconClass} />;
      default:
        return <Home className={iconClass} />;
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/properties?type=${category.type}`);
  };

  return (
    <section className="py-8 sm:py-16 md:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-10 md:mb-14">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-[#B49A70] uppercase tracking-widest block mb-1.5">
            Popular Categories
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal leading-tight">
            Explore by Category
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            onClick={() => handleCategoryClick(cat)}
            className="group relative h-44 sm:h-72 md:h-88 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C201C] via-[#1C201C]/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

            {/* Top Pill */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-[#B49A70] bg-[#1C201C]/80 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-sm border border-[#B49A70]/30">
                {cat.type}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-5 md:p-6 text-white z-10 flex flex-col justify-end h-full">
              <div className="mb-1 sm:mb-3 text-[#B49A70] group-hover:scale-110 transition-transform origin-left">
                {getIcon(cat.type)}
              </div>

              <div className="flex items-baseline justify-between mb-0.5 sm:mb-1.5">
                <h3 className="font-serif text-sm sm:text-2xl font-normal group-hover:text-[#E8D9BF] transition-colors truncate">
                  {cat.plural}
                </h3>
                <span className="text-[9px] sm:text-xs font-mono text-[#B49A70] shrink-0 ml-1">
                  {cat.count} listings
                </span>
              </div>

              <p className="hidden sm:block text-xs text-[#D8D4CA] line-clamp-2 mb-4 font-light leading-relaxed">
                {cat.description}
              </p>

              <div className="text-[9px] sm:text-xs uppercase tracking-wider font-semibold text-[#B49A70] flex items-center gap-1 sm:gap-1.5 opacity-90 group-hover:translate-x-1 transition-transform">
                <span>View Collection</span>
                <ArrowRight size={12} className="sm:w-[13px] sm:h-[13px]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
