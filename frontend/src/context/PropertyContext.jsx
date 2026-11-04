import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PROPERTIES } from '../data/propertiesData';
import { CATEGORIES } from '../data/categoriesData';
import { AGENTS, TESTIMONIALS, STATS, FAQS } from '../data/testimonialsData';

const PropertyContext = createContext(null);

const INITIAL_LEADS = [
  {
    id: 'LD-1001',
    propertyId: 1,
    propertyTitle: 'The Imperial Villa, Civil Lines',
    propertyPrice: '₹8.50 Cr',
    propertyLocation: 'Civil Lines, Kanpur, UP',
    buyerName: 'Vikramaditya Singhania',
    buyerEmail: 'v.singhania@heritageholdings.in',
    buyerPhone: '+91 98110 44521',
    agentName: 'Michael Sharma',
    agentEmail: 'm.sharma@plutoplat.com',
    message: 'Interested in booking a private site visit this weekend. Please share freehold registry documents and approved layout plan.',
    status: 'In Progress', // 'New', 'Contacted', 'In Progress', 'Scheduled Viewing', 'Closed'
    date: '2026-11-03 14:32',
    leadScore: 'High Intent'
  },
  {
    id: 'LD-1002',
    propertyId: 2,
    propertyTitle: 'Bungalow at Golf Links',
    propertyPrice: '₹24.00 Cr',
    propertyLocation: 'Golf Links, New Delhi',
    buyerName: 'Dr. Ananya Sen',
    buyerEmail: 'ananya.sen@oxfordalumni.org',
    buyerPhone: '+91 97170 88200',
    agentName: 'Priya Patel',
    agentEmail: 'p.patel@plutoplat.com',
    message: 'Looking for a residential property with clear title and private garden. Please connect regarding site inspection.',
    status: 'Scheduled Viewing',
    date: '2026-11-02 18:15',
    leadScore: 'Site Visit Confirmed'
  },
  {
    id: 'LD-1003',
    propertyId: 3,
    propertyTitle: 'Sea View Penthouse, Worli',
    propertyPrice: '₹18.50 Cr',
    propertyLocation: 'Worli Sea Face, Mumbai',
    buyerName: 'Rajesh Mittal',
    buyerEmail: 'rmittal@mittalcapital.co.in',
    buyerPhone: '+91 98200 44122',
    agentName: 'Michael Sharma',
    agentEmail: 'm.sharma@plutoplat.com',
    message: 'Requesting details regarding covered car parking spaces, maintenance charges, and immediate registry timelines.',
    status: 'New',
    date: '2026-11-01 09:40',
    leadScore: 'Direct Inquiry'
  },
  {
    id: 'LD-1004',
    propertyId: 4,
    propertyTitle: 'Luxury Estate at Jubilee Hills',
    propertyPrice: '₹12.75 Cr',
    propertyLocation: 'Jubilee Hills, Hyderabad',
    buyerName: 'Meera Kapoor',
    buyerEmail: 'meera.k@kapoordesigns.com',
    buyerPhone: '+91 99200 12890',
    agentName: 'Priya Patel',
    agentEmail: 'p.patel@plutoplat.com',
    message: 'Kindly share RERA registration copy, floor plan, and bank loan pre-approval list for this property.',
    status: 'Contacted',
    date: '2026-10-30 11:20',
    leadScore: 'Verified Buyer'
  }
];

const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Julian Beaumont',
    email: 'owner@plutoplat.com',
    phone: '+91 99563 46155',
    role: 'super_admin',
    status: 'active',
    subscriptionTier: 'Website Owner',
    city: 'Kanpur, Uttar Pradesh',
    registeredDate: '2026-01-10',
    propertiesCount: 12
  },
  {
    id: 'USR-002',
    name: 'Michael Sharma',
    email: 'm.sharma@plutoplat.com',
    phone: '+91 98210 33445',
    role: 'admin',
    status: 'active',
    subscriptionTier: 'Pro Partner (₹4,999/mo)',
    city: 'Civil Lines, Kanpur',
    registeredDate: '2026-02-14',
    propertiesCount: 6
  },
  {
    id: 'USR-003',
    name: 'Priya Patel',
    email: 'p.patel@plutoplat.com',
    phone: '+91 97120 55678',
    role: 'admin',
    status: 'active',
    subscriptionTier: 'Pro Partner (₹4,999/mo)',
    city: 'South Mumbai',
    registeredDate: '2026-03-20',
    propertiesCount: 4
  },
  {
    id: 'USR-004',
    name: 'Vikramaditya Singhania',
    email: 'v.singhania@heritageholdings.in',
    phone: '+91 98110 44521',
    role: 'user',
    status: 'active',
    subscriptionTier: 'VIP Concierge (₹19,999/mo)',
    city: 'New Delhi',
    registeredDate: '2026-04-05',
    propertiesCount: 0
  },
  {
    id: 'USR-005',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@fintechventures.io',
    phone: '+91 98200 99400',
    role: 'user',
    status: 'locked',
    subscriptionTier: 'Standard Buyer (Free)',
    city: 'Mumbai',
    registeredDate: '2026-05-12',
    propertiesCount: 0
  }
];

const INITIAL_AUDITS = [
  {
    id: 'AUD-892',
    timestamp: '2026-11-03 21:05:12',
    actorName: 'Julian Beaumont',
    actorRole: 'super_admin',
    module: 'PROPERTY',
    action: 'APPROVE',
    target: 'Imperial Villa, Civil Lines (ID: 1)',
    status: 'SUCCESS',
    ip: '103.25.14.92',
    description: 'SuperAdmin verified RERA documents and approved property for live public search.'
  },
  {
    id: 'AUD-891',
    timestamp: '2026-11-03 19:40:05',
    actorName: 'Michael Sharma',
    actorRole: 'admin',
    module: 'PROPERTY',
    action: 'CREATE',
    target: 'Green Park Penthouse (Under Review)',
    status: 'SUCCESS',
    ip: '103.44.120.8',
    description: 'Agent submitted new luxury listing. Sent to SuperAdmin for verification.'
  },
  {
    id: 'AUD-890',
    timestamp: '2026-11-03 18:22:30',
    actorName: 'Security Watchdog',
    actorRole: 'system',
    module: 'AUTH',
    action: 'LOCKOUT',
    target: 'aarav.mehta@fintechventures.io',
    status: 'BLOCKED',
    ip: '185.220.101.5',
    description: 'Account temporarily locked for 30 minutes following 5 consecutive incorrect password entries.'
  },
  {
    id: 'AUD-889',
    timestamp: '2026-11-03 16:11:44',
    actorName: 'Vikramaditya Singhania',
    actorRole: 'user',
    module: 'ENQUIRY',
    action: 'CREATE',
    target: 'Imperial Villa, Civil Lines',
    status: 'SUCCESS',
    ip: '122.161.45.18',
    description: 'Buyer submitted direct inquiry requesting a weekend site visit.'
  },
  {
    id: 'AUD-888',
    timestamp: '2026-11-03 12:00:22',
    actorName: 'Julian Beaumont',
    actorRole: 'super_admin',
    module: 'USER',
    action: 'UPDATE_ROLE',
    target: 'Priya Patel (Promoted to Agent)',
    status: 'SUCCESS',
    ip: '103.25.14.92',
    description: 'SuperAdmin promoted verified broker account to Agent / Seller role.'
  }
];

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_properties_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PROPERTIES.map((p, idx) => ({
      ...p,
      verified: idx !== 4 && idx !== 5,
      status: idx === 4 || idx === 5 ? 'pending' : 'approved',
      ownerEmail: idx === 1 ? 'm.sharma@plutoplat.com' : 'owner@plutoplat.com',
      ownerName: idx === 1 ? 'Michael Sharma' : 'Julian Beaumont',
    }));
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_favorites');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_leads_db');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_users_db');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_audits_db');
      return saved ? JSON.parse(saved) : INITIAL_AUDITS;
    } catch {
      return INITIAL_AUDITS;
    }
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [currency, setCurrency] = useState('INR');

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_user');
      return saved ? JSON.parse(saved) : {
        id: 'USR-001',
        name: 'Julian Beaumont',
        email: 'owner@plutoplat.com',
        phone: '+91 99563 46155',
        role: 'super_admin',
        tier: 'Website Owner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        city: 'Kanpur, Uttar Pradesh'
      };
    } catch {
      return {
        id: 'USR-001',
        name: 'Julian Beaumont',
        email: 'owner@plutoplat.com',
        role: 'super_admin',
        city: 'Kanpur, Uttar Pradesh'
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_properties_db', JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_leads_db', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_users_db', JSON.stringify(usersList));
    } catch (e) {
      console.error(e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_audits_db', JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const login = (userData) => {
    const roleLabels = {
      super_admin: 'Website Owner',
      admin: 'Agent / Broker',
      user: 'Client'
    };

    const newUser = {
      id: userData.id || `PLP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name || userData.fullName || 'Valued User',
      email: userData.email || 'user@plutoplat.com',
      phone: userData.phone || '+91 99563 46155',
      role: userData.role || 'user',
      tier: roleLabels[userData.role] || 'Registered Client',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      city: userData.city || 'Kanpur, Uttar Pradesh',
    };
    setUser(newUser);
    try {
      localStorage.setItem('plutoplat_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome, ${newUser.name}! Logged in as ${roleLabels[newUser.role] || 'User'}.`, 'success');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('plutoplat_user');
      localStorage.removeItem('pluto_token');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out successfully.', 'info');
  };

  // Switch Role helper for testing Buyer, Admin, and SuperAdmin
  const switchRole = (newRole) => {
    const profiles = {
      user: {
        name: 'Vikramaditya (Buyer)',
        email: 'v.singhania@heritageholdings.in',
        label: 'Client (Buyer)'
      },
      admin: {
        name: 'Michael Sharma (Agent / Broker)',
        email: 'm.sharma@plutoplat.com',
        label: 'Agent / Seller'
      },
      super_admin: {
        name: 'Julian Beaumont (SuperAdmin)',
        email: 'owner@plutoplat.com',
        label: 'SuperAdmin (Owner)'
      }
    };

    const targetProfile = profiles[newRole] || profiles.user;
    const updated = {
      ...(user || {}),
      role: newRole,
      name: targetProfile.name,
      email: targetProfile.email
    };

    setUser(updated);
    try {
      localStorage.setItem('plutoplat_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    addAuditLog({
      actorName: updated.name,
      actorRole: newRole,
      module: 'AUTH',
      action: 'SWITCH_ROLE',
      target: `Active Role changed to ${targetProfile.label}`,
      status: 'SUCCESS',
      description: `Active preview switched to ${targetProfile.label}`
    });

    showToast(`Switched active view to: ${targetProfile.label}`, 'info');
  };

  // Property Actions (CRUD & Moderation)
  const addProperty = (newProp) => {
    const id = Date.now();
    const isSuperAdmin = user?.role === 'super_admin';

    const createdProp = {
      ...newProp,
      id,
      verified: isSuperAdmin,
      status: isSuperAdmin ? 'approved' : 'pending',
      ownerEmail: user?.email || 'm.sharma@plutoplat.com',
      ownerName: user?.name || 'Michael Sharma',
      createdAt: new Date().toISOString()
    };

    setProperties(prev => [createdProp, ...prev]);

    addAuditLog({
      actorName: user?.name || 'Agent',
      actorRole: user?.role || 'admin',
      module: 'PROPERTY',
      action: 'CREATE',
      target: createdProp.title,
      status: 'SUCCESS',
      description: isSuperAdmin
        ? `SuperAdmin published verified property: ${createdProp.title}`
        : `Agent submitted property for SuperAdmin review: ${createdProp.title}`
    });

    showToast(
      isSuperAdmin
        ? 'Property listing verified and published live successfully!'
        : 'Property submitted! Awaiting SuperAdmin verification and approval.',
      'success'
    );
    return createdProp;
  };

  const updateProperty = (id, updatedFields) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));

    addAuditLog({
      actorName: user?.name || 'Admin',
      actorRole: user?.role || 'admin',
      module: 'PROPERTY',
      action: 'UPDATE',
      target: `Property ID: ${id}`,
      status: 'SUCCESS',
      description: `Updated property listing details for ID ${id}`
    });

    showToast('Property details updated successfully.', 'success');
  };

  const deleteProperty = (id) => {
    const toDelete = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));

    addAuditLog({
      actorName: user?.name || 'Admin',
      actorRole: user?.role || 'admin',
      module: 'PROPERTY',
      action: 'DELETE',
      target: toDelete?.title || `ID: ${id}`,
      status: 'SUCCESS',
      description: `Removed property listing: ${toDelete?.title || id}`
    });

    showToast('Property listing removed.', 'info');
  };

  const approveProperty = (id) => {
    const prop = properties.find(p => p.id === id);
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, verified: true, status: 'approved' } : p))
    );

    addAuditLog({
      actorName: user?.name || 'SuperAdmin',
      actorRole: 'super_admin',
      module: 'PROPERTY',
      action: 'APPROVE',
      target: prop?.title || `ID: ${id}`,
      status: 'SUCCESS',
      description: `SuperAdmin approved listing "${prop?.title || id}" for public catalog.`
    });

    showToast(`Property "${prop?.title || id}" is now approved and live!`, 'success');
  };

  const rejectProperty = (id, reason = 'Document verification pending') => {
    const prop = properties.find(p => p.id === id);
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, verified: false, status: 'rejected', rejectReason: reason } : p))
    );

    addAuditLog({
      actorName: user?.name || 'SuperAdmin',
      actorRole: 'super_admin',
      module: 'PROPERTY',
      action: 'REJECT',
      target: prop?.title || `ID: ${id}`,
      status: 'SUCCESS',
      description: `SuperAdmin rejected listing "${prop?.title || id}". Reason: ${reason}`
    });

    showToast(`Property "${prop?.title || id}" has been rejected.`, 'info');
  };

  // Lead / Enquiry Actions
  const addLead = (leadData) => {
    const newLead = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'New',
      leadScore: 'Direct Inquiry',
      ...leadData
    };
    setLeads(prev => [newLead, ...prev]);

    addAuditLog({
      actorName: leadData.buyerName || user?.name || 'Guest',
      actorRole: user?.role || 'user',
      module: 'ENQUIRY',
      action: 'CREATE',
      target: leadData.propertyTitle || 'Property',
      status: 'SUCCESS',
      description: `New inquiry submitted by ${leadData.buyerName || 'Buyer'} for ${leadData.propertyTitle}`
    });

    showToast('Enquiry submitted! A dedicated advisor will connect with you shortly.', 'success');
    return newLead;
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l)));
    showToast(`Lead status updated to: ${newStatus}`, 'success');
  };

  const deleteLead = (leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    showToast('Inquiry archived.', 'info');
  };

  // User Management Actions
  const updateUserRole = (userId, newRole) => {
    setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));

    addAuditLog({
      actorName: user?.name || 'SuperAdmin',
      actorRole: 'super_admin',
      module: 'USER',
      action: 'UPDATE_ROLE',
      target: `User ID: ${userId} to ${newRole}`,
      status: 'SUCCESS',
      description: `SuperAdmin updated role for user ${userId} to ${newRole.toUpperCase()}`
    });

    showToast(`User role updated to ${newRole.toUpperCase()}`, 'success');
  };

  const toggleUserStatus = (userId) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    showToast('User account status updated.', 'info');
  };

  const unlockUser = (userId) => {
    setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, status: 'active', loginAttempts: 0 } : u)));

    addAuditLog({
      actorName: user?.name || 'SuperAdmin',
      actorRole: 'super_admin',
      module: 'ADMIN',
      action: 'UNBLOCK',
      target: `User ID: ${userId}`,
      status: 'SUCCESS',
      description: `SuperAdmin released account lockout for user ${userId}`
    });

    showToast('Account unlocked successfully.', 'success');
  };

  const updateUserSubscription = (userId, tier) => {
    setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, subscriptionTier: tier } : u)));
    showToast(`Membership plan updated to: ${tier}`, 'success');
  };

  const addAuditLog = ({ actorName, actorRole, module, action, target, status = 'SUCCESS', description }) => {
    const newLog = {
      id: `AUD-${Math.floor(800 + Math.random() * 200)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: actorName || user?.name || 'System',
      actorRole: actorRole || user?.role || 'system',
      module: module || 'GENERAL',
      action: action || 'EVENT',
      target: target || 'N/A',
      status,
      ip: '103.25.14.92',
      description: description || 'Audit event captured'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const exists = prev.includes(propertyId);
      if (exists) {
        showToast('Property removed from your saved list.', 'info');
        return prev.filter(id => id !== propertyId);
      } else {
        showToast('Property saved to your collection!', 'success');
        return [...prev, propertyId];
      }
    });
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  const favoriteProperties = useMemo(
    () => properties.filter(p => favorites.includes(p.id)),
    [properties, favorites]
  );

  const featuredProperties = useMemo(
    () => properties.filter(p => p.featured && p.verified !== false),
    [properties]
  );

  const getPropertyById = (id) => {
    const numericId = parseInt(id, 10);
    return properties.find(p => p.id === numericId) || null;
  };

  // Indian Real Estate Price Formatter (Crores & Lakhs)
  const formatPrice = (numericVal) => {
    if (!numericVal) return 'Price on Request';
    if (currency === 'INR') {
      const inrValue = Math.round(numericVal * 83.5);
      if (inrValue >= 10000000) {
        return `₹${(inrValue / 10000000).toFixed(2)} Cr`;
      }
      if (inrValue >= 100000) {
        return `₹${(inrValue / 100000).toFixed(2)} Lakh`;
      }
      return `₹${inrValue.toLocaleString('en-IN')}`;
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
    addProperty,
    updateProperty,
    deleteProperty,
    approveProperty,
    rejectProperty,
    leads,
    addLead,
    updateLeadStatus,
    deleteLead,
    usersList,
    updateUserRole,
    toggleUserStatus,
    unlockUser,
    updateUserSubscription,
    auditLogs,
    addAuditLog,
    toast,
    showToast,
    currency,
    setCurrency,
    formatPrice,
    user,
    login,
    logout,
    switchRole
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1C201C] text-[#F7F5F0] border border-[#B49A70]/50 px-5 py-3.5 rounded-xs shadow-2xl backdrop-blur-md transition-all duration-300">
          <div className="w-2 h-2 rounded-full bg-[#B49A70] animate-pulse" />
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
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
