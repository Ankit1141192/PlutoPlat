import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import Navbar from './PlutoPlat/Components/Navbar';
import Footer from './PlutoPlat/Components/Footer';

// Public & Client Pages
import HomePage from './PlutoPlat/Pages/HomePage';
import Property from './PlutoPlat/Pages/Property';
import PropertyDetail from './PlutoPlat/Pages/PropertyDetail';
import About from './PlutoPlat/Pages/About';
import Contact from './PlutoPlat/Pages/Contact';
import Favorites from './PlutoPlat/Pages/Favorites';
import FAQ from './PlutoPlat/Pages/FAQ';
import Login from './PlutoPlat/Pages/Login';
import Register from './PlutoPlat/Pages/Register';
import PrivacyPolicy from './PlutoPlat/Pages/PrivacyPolicy';
import TermsConditions from './PlutoPlat/Pages/TermsConditions';
import Profile from './PlutoPlat/Pages/Profile';
import MyEnquiries from './PlutoPlat/Pages/MyEnquiries';
import Notifications from './PlutoPlat/Pages/Notifications';
import SearchResults from './PlutoPlat/Pages/SearchResults';
import ForgetPassword from './PlutoPlat/Pages/ForgetPassword';
import ResetPassword from './PlutoPlat/Pages/ResetPassword';
import ScheduledVisits from './PlutoPlat/Pages/ScheduledVisits';
import RecentlyViewed from './PlutoPlat/Pages/RecentlyViewed';
import ContactAgents from './PlutoPlat/Pages/ContactAgents';
import ChangePassword from './PlutoPlat/Pages/ChangePassword';
import DealProcess from './PlutoPlat/Pages/DealProcess';
import MoreHub from './PlutoPlat/Pages/MoreHub';
import Testimonials from './PlutoPlat/Pages/Testimonials';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
  }, [pathname, search]);

  return null;
};

// Main layout for showroom & public pages using React Router nested Outlet
function MainLayout() {
  const { pathname } = useLocation();
  // Hide global footer on HomePage (since HomePage renders its own bottom footer)
  const hideFooter = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#222522]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

// Minimal layout for Auth routes (Login, Register, Password Reset)
function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#222522]">
      <ScrollToTop />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PropertyProvider>
      <Routes>
        {/* Main Application Routes using Nested Layout + Outlet */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<Property />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/reviews" element={<Testimonials />} />
          <Route path="/more" element={<MoreHub />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/favorites" element={<Favorites />} />

          {/* Account & Buyer Portal */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-enquiries" element={<MyEnquiries />} />
          <Route path="/enquiries" element={<MyEnquiries />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/scheduled-visits" element={<ScheduledVisits />} />
          <Route path="/recently-viewed" element={<RecentlyViewed />} />
          <Route path="/contact-agents" element={<ContactAgents />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/deals" element={<DealProcess />} />
          <Route path="/deal-process" element={<DealProcess />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* Dedicated Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </PropertyProvider>
  );
}
