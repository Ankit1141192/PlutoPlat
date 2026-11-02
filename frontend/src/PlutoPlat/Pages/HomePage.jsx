import React from 'react';
import HeroSection from '../Components/HeroSection';
import PropertyTypesSection from '../Components/PropertyTypesSection';
import OffPlanProjectsSection from '../Components/OffPlanProjectsSection';
import FeaturedSection from '../Components/FeaturedSection';
import MapExplorerSection from '../Components/MapExplorerSection';
import CategorySection from '../Components/CategorySection';
import InvestSection from '../Components/InvestSection';
import TrustedDevelopers from '../Components/TrustedDevelopers';
import LuxuryShowcase from '../Components/LuxuryShowcase';
import WhyChooseUs from '../Components/WhyChooseUs';
import HowItWorks from '../Components/HowItWorks';
import TestimonialsSection from '../Components/TestimonialsSection';
import FinalCTA from '../Components/FinalCTA';
import Footer from '../Components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* 1. HeroSection */}
      <HeroSection />

      {/* 2. PropertyTypesSection */}
      <PropertyTypesSection />

      {/* 3. OffPlanProjectsSection */}
      <OffPlanProjectsSection />

      {/* 4. FeaturedSection */}
      <FeaturedSection />

      {/* 5. MapExplorerSection */}
      <MapExplorerSection />

      {/* 6. CategorySection */}
      <CategorySection />

      {/* 7. InvestSection */}
      <InvestSection />

      {/* 8. TrustedDevelopers */}
      <TrustedDevelopers />

      {/* 9. LuxuryShowcase */}
      <LuxuryShowcase />

      {/* 10. WhyChooseUs */}
      <WhyChooseUs />

      {/* 11. HowItWorks */}
      <HowItWorks />

      {/* 12. TestimonialsSection */}
      <TestimonialsSection />

      {/* 13. FinalCTA */}
      <FinalCTA />

      {/* 14. Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;