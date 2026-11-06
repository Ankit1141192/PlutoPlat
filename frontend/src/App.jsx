import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
// import TestApiPage from './PlutoPlat/Pages/testapi';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname, search]);

  return null;
};

// Global navbar helper: hide navbar on auth pages
const GlobalNavbar = () => {
  const { pathname } = useLocation();
  const authRoutes = ['/login', '/register', '/forgot-password', '/forget-password', '/reset-password'];
  if (authRoutes.includes(pathname)) {
    return null;
  }
  return <Navbar />;
};

// Global footer helper: hide on home and auth pages
const GlobalFooter = () => {
  const { pathname } = useLocation();
  const noFooterRoutes = ['/', '/login', '/register', '/forgot-password', '/forget-password', '/reset-password'];
  if (noFooterRoutes.includes(pathname)) {
    return null;
  }
  return <Footer />;
};

export default function App() {
  return (
    <PropertyProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#222522]">
          <GlobalNavbar />
          <main className="flex-grow">
            <Routes>
              {/* Primary Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<Property />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/favorites" element={<Favorites />} />

              {/* Private Client & Account Routes (Buyer / User) */}
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
              

              {/* Authentication & Security Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Legal & Compliance Routes */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <GlobalFooter />
        </div>
      </BrowserRouter>
    </PropertyProvider>
  );
}
