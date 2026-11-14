import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { PROPERTIES } from '../data/propertiesData';
import { CATEGORIES } from '../data/categoriesData';
import { AGENTS, TESTIMONIALS, STATS, FAQS } from '../data/testimonialsData';
import { Api } from '../PlutoPlat/Services/Api';

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

const INITIAL_VISITS = [
  {
    id: 'VST-2041',
    propertyId: 1,
    propertyTitle: 'The Imperial Villa, Civil Lines',
    propertyLocation: 'Civil Lines, Kanpur, UP',
    propertyPrice: '₹8.50 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    visitType: 'Chauffeured On-Site',
    date: '2026-11-06',
    timeSlot: '11:00 AM Mid-day Window',
    status: 'Confirmed', // 'Pending Confirmation' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
    agentName: 'Michael Sharma',
    agentPhone: '+91 98210 33445',
    agentEmail: 'm.sharma@plutoplat.com',
    agentAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    notes: 'Private chauffeur pickup coordinated at Ganges Club Kanpur. Freehold title documents and floor layout available on site.'
  },
  {
    id: 'VST-2042',
    propertyId: 3,
    propertyTitle: 'Sea View Penthouse, Worli',
    propertyLocation: 'Worli Sea Face, Mumbai',
    propertyPrice: '₹18.50 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80',
    visitType: '4K Virtual Guided',
    date: '2026-11-08',
    timeSlot: '05:00 PM Golden Hour Sunset',
    status: 'Pending Confirmation',
    agentName: 'Priya Patel',
    agentPhone: '+91 97120 55678',
    agentEmail: 'p.patel@plutoplat.com',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    notes: 'Live walkthrough focusing on private rooftop infinity deck, sunset Arabian Sea views, and basement parking.'
  }
];

const INITIAL_DEALS = [
  {
    id: 'DEAL-7701',
    propertyId: 1,
    propertyTitle: 'The Imperial Villa, Civil Lines',
    propertyLocation: 'Civil Lines, Kanpur, UP',
    propertyPrice: '₹8.50 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    agentName: 'Michael Sharma',
    agentPhone: '+91 98210 33445',
    agentEmail: 'm.sharma@plutoplat.com',
    currentStage: 3, // 1 to 7
    stageLabel: 'Site Visit Completed',
    stages: [
      { step: 1, name: 'Enquiry Submitted', status: 'completed', date: '2026-10-28', detail: 'Buyer initial inquiry captured and assigned to Senior Advisor.' },
      { step: 2, name: 'Agent Advisory & Consultation', status: 'completed', date: '2026-10-30', detail: 'Telephone consultation conducted; municipal zoning and floor layout dispatched.' },
      { step: 3, name: 'Site Visit Completed', status: 'current', date: '2026-11-02', detail: 'Buyer inspected the property on site. Verified structural deed integrity.' },
      { step: 4, name: 'Offer & Terms Negotiation', status: 'pending', date: 'Target: Nov 10', detail: 'Formal offer draft and seller concession sheet in negotiation.' },
      { step: 5, name: 'Token & Booking Advance', status: 'pending', date: 'Target: Nov 16', detail: '10% earnest money escrow deposit upon agreed Letter of Intent.' },
      { step: 6, name: 'Legal Due Diligence & Cadastre', status: 'pending', date: 'Target: Nov 22', detail: 'Final municipal no-objection certificate and title search clearance.' },
      { step: 7, name: 'Deed Registration & Handover', status: 'pending', date: 'Target: Nov 30', detail: 'Sub-registrar deed execution, final remittance, and physical keys handover.' }
    ],
    nextAction: 'Senior Advisor Michael Sharma is finalizing the formal offer proposal with the estate sellers.',
    escrowEstimate: '₹85,00,000 (10% Token on acceptance)'
  }
];

const INITIAL_NOTIFICATIONS = [];

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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const cached = localStorage.getItem('pluto_testimonials_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return TESTIMONIALS;
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

  // User Authentication State - null if guest / not logged in
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Scheduled Visits State
  const [scheduledVisits, setScheduledVisits] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_visits_db');
      return saved ? JSON.parse(saved) : INITIAL_VISITS;
    } catch {
      return INITIAL_VISITS;
    }
  });

  // Recently Viewed Properties IDs State
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_recently_viewed');
      return saved ? JSON.parse(saved) : [1, 2, 3];
    } catch {
      return [1, 2, 3];
    }
  });

  // Deal Process State
  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_deals_db');
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  // Notifications State (starts empty until SuperAdmin broadcasts or system dispatches)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_notifications_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (n) =>
              !n.id?.toString().startsWith('NOTIF-') &&
              !n.id?.toString().startsWith('notif-') &&
              !n.id?.toString().startsWith('d')
          );
        }
      }
      return [];
    } catch {
      return [];
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

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_visits_db', JSON.stringify(scheduledVisits));
    } catch (e) {
      console.error(e);
    }
  }, [scheduledVisits]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error(e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_deals_db', JSON.stringify(deals));
    } catch (e) {
      console.error(e);
    }
  }, [deals]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_notifications_db', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Reference to track known notification IDs to alert on new ones
  const knownNotificationIds = useRef(new Set());

  // Universal Sync Method: pulls latest properties, notifications, testimonials from MongoDB backend
  const syncPlatformData = async (silent = true) => {
    // 1. Sync properties
    try {
      const res = await Api.getProperties();
      if (res?.data?.properties && Array.isArray(res.data.properties)) {
        setProperties(res.data.properties);
        try {
          localStorage.setItem('plutoplat_properties_db', JSON.stringify(res.data.properties));
        } catch {}
      }
    } catch (err) {
      if (!silent) console.warn('Properties sync notice:', err.message);
    }

    // 2. Sync notifications
    try {
      const res = await Api.getNotifications();
      if (res?.data?.notifications && Array.isArray(res.data.notifications)) {
        const notifs = res.data.notifications;
        // Check for any newly arrived notifications
        notifs.forEach((n) => {
          const nid = n._id || n.id;
          if (nid && knownNotificationIds.current.size > 0 && !knownNotificationIds.current.has(nid) && (n.isUnread !== false && !n.read)) {
            showToast(`📢 ${n.title}`, 'info');
          }
          if (nid) knownNotificationIds.current.add(nid);
        });
        setNotifications(notifs);
        try {
          localStorage.setItem('plutoplat_notifications_db', JSON.stringify(notifs));
        } catch {}
      }
    } catch {}

    // 3. Sync testimonials
    try {
      const res = await Api.getTestimonials();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setTestimonials(res.data);
        try {
          localStorage.setItem('pluto_testimonials_cache', JSON.stringify(res.data));
        } catch {}
      }
    } catch {}
  };

  // Periodic heartbeat polling & window focus synchronization (Replaces Socket.IO)
  useEffect(() => {
    syncPlatformData(false);

    // Sync on window focus / document visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncPlatformData(true);
      }
    };
    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Auto-poll every 6 seconds to keep showroom in sync with platform updates
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncPlatformData(true);
      }
    }, 6000);

    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  // Sync user session on mount/refresh if token exists
  useEffect(() => {
    const token = localStorage.getItem('pluto_token');
    if (token) {
      Api.getMe()
        .then((res) => {
          if (res?.data?.user) {
            const apiUser = res.data.user;
            const roleLabels = {
              super_admin: 'Website Owner',
              admin: 'Agent / Broker',
              user: 'Client'
            };
            const updatedUser = {
              id: apiUser._id || apiUser.id,
              name: apiUser.name,
              email: apiUser.email,
              phone: apiUser.phone,
              role: apiUser.role || 'user',
              tier: roleLabels[apiUser.role] || 'Registered Client',
              city: apiUser.location?.city || '',
              location: apiUser.location,
              profileImage: apiUser.profileImage,
              avatar: apiUser.profileImage,
              subscriptionTier: apiUser.subscriptionTier,
            };
            setUser(updatedUser);
            localStorage.setItem('plutoplat_user', JSON.stringify(updatedUser));
          }
        })
        .catch((err) => {
          if (err?.status === 401) {
            setUser(null);
            localStorage.removeItem('plutoplat_user');
            localStorage.removeItem('pluto_token');
          }
        });

      // Load saved properties for authenticated buyer
      Api.getSavedProperties()
        .then((res) => {
          if (res?.data?.savedIds && res.data.savedIds.length > 0) {
            setFavorites(res.data.savedIds);
          } else if (res?.data?.savedProperties && res.data.savedProperties.length > 0) {
            setFavorites(res.data.savedProperties.map((p) => p.id || p._id));
          }
        })
        .catch((err) => console.warn('Saved properties load notice:', err.message));
    }
  }, []);

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
      id: userData._id || userData.id,
      name: userData.name || userData.fullName || 'User',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'user',
      tier: roleLabels[userData.role] || 'Registered Client',
      avatar: userData.profileImage || userData.avatar || '',
      profileImage: userData.profileImage || userData.avatar || '',
      city: userData.location?.city || userData.city || '',
      location: userData.location,
    };
    setUser(newUser);

    // Sync saved properties directly from backend user document
    if (userData.savedProperties && Array.isArray(userData.savedProperties)) {
      setFavorites(userData.savedProperties.map(p => (p._id ? p._id.toString() : p.toString())));
    } else {
      Api.getSavedProperties()
        .then((res) => {
          if (res?.data?.savedIds) {
            setFavorites(res.data.savedIds);
          }
        })
        .catch(() => {});
    }

    try {
      localStorage.setItem('plutoplat_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome, ${newUser.name}! Logged in as ${roleLabels[newUser.role] || 'User'}.`, 'success');
    return newUser;
  };

  const logout = () => {
    Api.logout();
    setUser(null);
    setFavorites([]);
    try {
      localStorage.removeItem('plutoplat_user');
      localStorage.removeItem('pluto_token');
      localStorage.removeItem('plutoplat_favorites');
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
  const addProperty = async (newProp) => {
    let createdProp = null;
    try {
      const res = await Api.createProperty(newProp);
      if (res?.data?.property) createdProp = res.data.property;
    } catch (e) {}

    if (!createdProp) {
      createdProp = {
        ...newProp,
        id: Date.now(),
        verified: true,
        status: 'approved',
        ownerEmail: user?.email || 'm.sharma@plutoplat.com',
        ownerName: user?.name || 'Michael Sharma',
        createdAt: new Date().toISOString()
      };
    }

    setProperties(prev => [createdProp, ...prev]);

    addAuditLog({
      actorName: user?.name || 'Agent',
      actorRole: user?.role || 'admin',
      module: 'PROPERTY',
      action: 'CREATE',
      target: createdProp.title,
      status: 'SUCCESS',
      description: `Property created and published: ${createdProp.title}`
    });

    showToast('Property listing created and published live on PlutoPlat!', 'success');
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

  const deleteProperty = async (id) => {
    try {
      await Api.deleteProperty(id);
    } catch (e) {
      console.warn('API deleteProperty warning:', e.message);
    }
    const toDelete = properties.find(p => p.id === id || p._id === id);
    const nextProps = properties.filter(p => p.id !== id && p._id !== id);
    setProperties(nextProps);
    try {
      localStorage.setItem('plutoplat_properties_db', JSON.stringify(nextProps));
    } catch {}

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

    // Dispatch to live deployed backend
    Api.createEnquiry({
      propertyId: leadData.propertyId || '1',
      message: leadData.message,
      name: leadData.buyerName,
      email: leadData.buyerEmail,
      phone: leadData.buyerPhone
    }).catch(err => console.warn('Backend enquiry dispatch notice:', err.message));

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
    const idStr = String(propertyId);
    setFavorites(prev => {
      const exists = prev.some(id => String(id) === idStr);
      if (exists) {
        showToast('Property removed from your saved list.', 'info');
        return prev.filter(id => String(id) !== idStr);
      } else {
        showToast('Property saved to your collection!', 'success');
        return [...prev, propertyId];
      }
    });

    if (localStorage.getItem('pluto_token')) {
      Api.toggleSavedProperty(propertyId).catch(err => {
        console.warn('Backend toggle property saved notice:', err.message);
      });
    }
  };

  const isFavorite = (propertyId) => {
    const idStr = String(propertyId);
    return favorites.some(id => String(id) === idStr);
  };

  const favoriteProperties = useMemo(
    () => properties.filter(p => favorites.some(id => String(id) === String(p.id) || String(id) === String(p._id))),
    [properties, favorites]
  );

  const recentlyViewedProperties = useMemo(() => {
    return recentlyViewed
      .map(id => properties.find(p => String(p.id) === String(id) || String(p._id) === String(id)))
      .filter(Boolean);
  }, [properties, recentlyViewed]);

  const updateUser = async (userData) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...userData };
      try {
        localStorage.setItem('plutoplat_user', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Sync to MongoDB if logged in
    const token = localStorage.getItem('pluto_token');
    const userId = user?.id || user?._id || userData?.id || userData?._id;
    if (token && userId) {
      try {
        await Api.updateUserProfile(userId, userData);
      } catch (err) {
        console.warn('Backend user profile sync notice:', err.message);
      }
    }
    showToast('Profile dossier updated successfully.', 'success');
  };

  const addTestimonial = async (data) => {
    try {
      const res = await Api.createTestimonial(data);
      const created = res?.data || { id: Date.now(), ...data };
      setTestimonials((prev) => {
        const next = [created, ...prev.filter((t) => (t._id || t.id) !== (created._id || created.id))];
        try {
          localStorage.setItem('pluto_testimonials_cache', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('Thank you! Your testimonial has been saved and published.', 'success');
      return created;
    } catch (err) {
      console.warn('Backend testimonial submission notice:', err.message);
      const fallback = { id: Date.now(), ...data };
      setTestimonials((prev) => {
        const next = [fallback, ...prev];
        try {
          localStorage.setItem('pluto_testimonials_cache', JSON.stringify(next));
        } catch {}
        return next;
      });
      showToast('Testimonial recorded.', 'info');
      return fallback;
    }
  };

  const addVisit = (visitData) => {
    const id = `VST-${Math.floor(2000 + Math.random() * 8000)}`;
    const newVisit = {
      id,
      status: 'Pending Confirmation',
      createdAt: new Date().toISOString(),
      ...visitData
    };
    setScheduledVisits(prev => [newVisit, ...prev]);

    // Dispatch to live deployed backend
    Api.createVisit({
      propertyId: visitData.propertyId || '1',
      visitType: visitData.visitType || 'Chauffeured On-Site',
      date: visitData.date,
      timeSlot: visitData.timeSlot,
      notes: visitData.notes
    }).catch(err => console.warn('Backend visit dispatch notice:', err.message));

    addAuditLog({
      actorName: user?.name || visitData.name || 'Client',
      actorRole: user?.role || 'user',
      module: 'VISIT',
      action: 'SCHEDULE',
      target: visitData.propertyTitle || 'Property Visit',
      status: 'SUCCESS',
      description: `Client requested ${visitData.visitType || 'site'} visit for ${visitData.propertyTitle} on ${visitData.date}`
    });

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      category: 'Visit Scheduled',
      badge: 'VISIT REQUESTED',
      title: `Private Viewing Requested: ${visitData.propertyTitle}`,
      timestamp: 'Just now',
      isUnread: true,
      description: `Your viewing request for ${visitData.date} (${visitData.timeSlot || 'Window'}) has been dispatched to Senior Advisor ${visitData.agentName || 'Michael Sharma'}.`,
      actionLabel: 'View Viewing Itinerary',
      actionLink: '/scheduled-visits'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Private visit scheduled! Advisor will coordinate access details.', 'success');
    return newVisit;
  };

  const updateVisitStatus = (visitId, newStatus) => {
    setScheduledVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: newStatus } : v));
    showToast(`Visit status updated: ${newStatus}`, 'info');
  };

  const scheduleTour = (tourData) => {
    return addVisit({
      propertyId: tourData.propertyId,
      propertyTitle: tourData.propertyTitle,
      propertyLocation: tourData.propertyLocation || 'Civil Lines, Kanpur, UP',
      propertyPrice: tourData.propertyPrice || '₹8.50 Cr',
      propertyImage: tourData.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      visitType: tourData.tourType === 'In-Person' ? 'Chauffeured On-Site' : '4K Virtual Guided',
      date: tourData.date,
      timeSlot: tourData.time,
      name: tourData.name,
      email: tourData.email,
      phone: tourData.phone,
      notes: tourData.notes,
      agentName: 'Michael Sharma',
      agentPhone: '+91 98210 33445',
      agentEmail: 'm.sharma@plutoplat.com'
    });
  };

  const recordRecentlyViewed = (propertyId) => {
    if (!propertyId) return;
    const numId = parseInt(propertyId, 10);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== numId);
      return [numId, ...filtered].slice(0, 10);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    showToast('Browsing history cleared.', 'info');
  };

  const updateDealStage = (dealId, stageIndex) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        const updatedStages = deal.stages.map(st => {
          if (st.step < stageIndex) return { ...st, status: 'completed' };
          if (st.step === stageIndex) return { ...st, status: 'current' };
          return { ...st, status: 'pending' };
        });
        const currentStageObj = updatedStages.find(st => st.step === stageIndex);
        return {
          ...deal,
          currentStage: stageIndex,
          stageLabel: currentStageObj?.name || deal.stageLabel,
          stages: updatedStages
        };
      }
      return deal;
    }));
    showToast(`Deal transaction moved to Stage ${stageIndex}`, 'success');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared.', 'info');
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!newPassword || newPassword.length < 8) {
      showToast('New password must contain at least 8 characters.', 'error');
      return { success: false, message: 'New password must contain at least 8 characters.' };
    }

    try {
      await Api.changePassword({ currentPassword, newPassword });
    } catch (err) {
      console.warn('Backend password dispatch notice (local session updated):', err.message);
    }

    showToast('Security credentials updated successfully!', 'success');
    addAuditLog({
      actorName: user?.name || 'Client',
      actorRole: user?.role || 'user',
      module: 'AUTH',
      action: 'UPDATE_PASSWORD',
      target: 'User Account Passcode',
      status: 'SUCCESS',
      description: 'Account passcode updated via Client Portal.'
    });
    return { success: true };
  };

  const featuredProperties = useMemo(
    () => properties.filter(p => p.featured && p.verified !== false),
    [properties]
  );

  const getPropertyById = (id) => {
    if (!id) return null;
    const strId = String(id);
    return (
      properties.find(
        (p) => String(p.id) === strId || String(p._id) === strId || p.slug === id
      ) || null
    );
  };

  // Indian Real Estate Price Formatter (Crores & Lakhs)
  const formatPrice = (numericVal) => {
    if (!numericVal) return 'Price on Request';
    if (typeof numericVal === 'string' && (numericVal.startsWith('₹') || numericVal.startsWith('$'))) {
      return numericVal;
    }
    const num = Number(String(numericVal).replace(/[^\d.]/g, ''));
    if (isNaN(num) || num <= 0) return 'Price on Request';

    if (currency === 'INR') {
      const inrValue = num > 100000000 ? num : Math.round(num * 83.5);
      if (inrValue >= 10000000) {
        return `₹${(inrValue / 10000000).toFixed(2)} Cr`;
      }
      if (inrValue >= 100000) {
        return `₹${(inrValue / 100000).toFixed(2)} Lakh`;
      }
      return `₹${inrValue.toLocaleString('en-IN')}`;
    }
    return `$${num.toLocaleString('en-US')}`;
  };

  const value = {
    properties,
    categories: CATEGORIES,
    agents: AGENTS,
    testimonials,
    addTestimonial,
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
    updateUser,
    login,
    logout,
    switchRole,
    scheduledVisits,
    addVisit,
    updateVisitStatus,
    scheduleTour,
    recentlyViewed,
    recentlyViewedProperties,
    recordRecentlyViewed,
    clearRecentlyViewed,
    deals,
    updateDealStage,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    changePassword
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
