import React from 'react';
import HeroSection from '../Components/HeroSection';
import CategorySection from '../Components/CategorySection';
import LocationFilterSection from '../Components/LocationFilterSection';
import FeaturedSection from '../Components/FeaturedSection';
import WhyChooseUs from '../Components/WhyChooseUs';
import TestimonialsSection from '../Components/TestimonialsSection';
import FinalCTA from '../Components/FinalCTA';
import Footer from '../Components/Footer';

/**
 * HomePage layout — clean & professional
 * ─────────────────────────────────────────
 * 1. Hero          — full-screen video + search bar
 * 2. Category      — browse by type (Villas, Apartments…)
 * 3. Location      — auto-scrolling location carousel
 * 4. Featured      — 4 cards per page with ‹ › pagination
 * 5. Why Us        — 5 trust pillars
 * 6. Testimonials  — client reviews
 * 7. Final CTA     — action banner
 * 8. Footer
 *
 * NOTE: <Navbar /> is rendered globally in App.jsx — not here.
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <HeroSection />
      <CategorySection />
      <LocationFilterSection />
      <FeaturedSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default HomePage;
