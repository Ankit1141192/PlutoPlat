import React from 'react';
import HeroSection from '../Components/HeroSection';
import RentOrPropertyBanner from '../Components/RentOrPropertyBanner';
import CategorySection from '../Components/CategorySection';
import LocationFilterSection from '../Components/LocationFilterSection';
import FeaturedSection from '../Components/FeaturedSection';
import UserJourneyWorkflow from '../Components/UserJourneyWorkflow';
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
 * 5. Workflow      — 5-step user journey interactive pipeline
 * 6. Why Us        — 5 trust pillars
 * 7. Testimonials  — client reviews
 * 8. Final CTA     — action banner
 * 9. Footer
 *
 * NOTE: <Navbar /> is rendered globally in App.jsx — not here.
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <HeroSection />
      <RentOrPropertyBanner />
      <CategorySection />
      <LocationFilterSection />
      <FeaturedSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <UserJourneyWorkflow />
      </div>
      <WhyChooseUs />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default HomePage;
