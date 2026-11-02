import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PROPERTIES } from '../data/propertiesData';
import { CATEGORIES } from '../data/categoriesData';
import { AGENTS, TESTIMONIALS, STATS, FAQS } from '../data/testimonialsData';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState(PROPERTIES);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_favorites');
      return saved ? JSON.parse(saved) : [1, 3]; // default favorites for rich initial experience
    } catch {
      return [1, 3];
    }
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    const newUser = {
      id: userData.id || `PLP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name || userData.fullName || 'Valued Client',
      email: userData.email || 'client@plutoplat.com',
      phone: userData.phone || '+91 9956346155',
      role: userData.role || 'Purchaser',
      tier: 'Sovereign Private Member',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      memberSince: userData.memberSince || '2026',
      city: userData.city || 'Kanpur, Uttar Pradesh',
    };
    setUser(newUser);
    try {
      localStorage.setItem('plutoplat_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome, ${newUser.name}! Authenticated to private portal.`, 'success');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('plutoplat_user');
    } catch (e) {
      console.error(e);
    }
    showToast('You have been securely signed out.', 'info');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...updatedFields };
      try {
        localStorage.setItem('plutoplat_user', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('Client dossier updated successfully.', 'success');
  };

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const exists = prev.includes(propertyId);
      if (exists) {
        showToast('Property removed from your private collection.', 'info');
        return prev.filter(id => id !== propertyId);
      } else {
        showToast('Property saved to your private collection.', 'success');
        return [...prev, propertyId];
      }
    });
  };

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  const favoriteProperties = useMemo(() => {
    return properties.filter(p => favorites.includes(p.id));
  }, [properties, favorites]);

  const featuredProperties = useMemo(() => {
    return properties.filter(p => p.featured);
  }, [properties]);

  const getPropertyById = (id) => {
    const numericId = parseInt(id, 10);
    return properties.find(p => p.id === numericId) || null;
  };

  const submitEnquiry = (enquiryData) => {
    console.log('Submitted Enquiry:', enquiryData);
    showToast(`Thank you, ${enquiryData.name || 'valued guest'}! A Senior Advisor will contact you within 2 hours.`, 'success');
    return true;
  };

  const scheduleTour = (tourData) => {
    console.log('Scheduled Tour:', tourData);
    showToast(`Private tour request confirmed for ${tourData.date || 'the requested date'}. Our concierge has emailed your itinerary.`, 'success');
    return true;
  };

  const formatPrice = (numericVal) => {
    if (!numericVal) return 'Price on Request';
    if (currency === 'INR') {
      const inrValue = Math.round(numericVal * 83.5);
      return `₹${inrValue.toLocaleString('en-IN')}`;
    }
    if (currency === 'AED') {
      const aedValue = Math.round(numericVal * 3.67);
      return `AED ${aedValue.toLocaleString('en-US')}`;
    }
    return `$${numericVal.toLocaleString('en-US')}`;
  };

  const value = {
    properties,
    categories: CATEGORIES,
    agents: AGENTS,
    testimonials: TESTIMONIALS,
    stats: STATS,
    faqs: FAQS,
    favorites,
    favoriteProperties,
    featuredProperties,
    toggleFavorite,
    isFavorite,
    getPropertyById,
    submitEnquiry,
    scheduleTour,
    showToast,
    toast,
    currency,
    setCurrency,
    formatPrice,
    user,
    login,
    logout,
    updateUser
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
      {/* Global Luxury Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1C201C] text-[#F7F5F0] border border-[#B49A70]/50 px-5 py-4 rounded-sm shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B49A70] animate-pulse" />
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      )}
    </PropertyContext.Provider>
  );
};

export const usePropertyStore = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyStore must be used within a PropertyProvider');
  }
  return context;
};
