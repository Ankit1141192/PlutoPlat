import React, { createContext, useContext, useState, useEffect } from 'react';
import { SuperAdminApi } from '../services/Api';

const SuperAdminContext = createContext(null);

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: 'The Imperial Villa, Civil Lines',
    price: 85000000,
    formattedPrice: '₹8.50 Cr',
    location: 'Civil Lines, Kanpur, UP',
    type: 'Villa',
    beds: 6,
    baths: 7,
    sqft: '8,400 sq.ft',
    status: 'approved',
    verified: true,
    ownerEmail: 'm.sharma@plutoplat.com',
    ownerName: 'Michael Sharma',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Bungalow at Golf Links',
    price: 240000000,
    formattedPrice: '₹24.00 Cr',
    location: 'Golf Links, New Delhi',
    type: 'Bungalow',
    beds: 5,
    baths: 6,
    sqft: '10,200 sq.ft',
    status: 'approved',
    verified: true,
    ownerEmail: 'p.patel@plutoplat.com',
    ownerName: 'Priya Patel',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Sea View Penthouse, Worli',
    price: 185000000,
    formattedPrice: '₹18.50 Cr',
    location: 'Worli Sea Face, Mumbai',
    type: 'Penthouse',
    beds: 4,
    baths: 5,
    sqft: '5,800 sq.ft',
    status: 'approved',
    verified: true,
    ownerEmail: 'm.sharma@plutoplat.com',
    ownerName: 'Michael Sharma',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Green Park Sky Penthouse',
    price: 145000000,
    formattedPrice: '₹14.50 Cr',
    location: 'Green Park, New Delhi',
    type: 'Penthouse',
    beds: 4,
    baths: 5,
    sqft: '5,200 sq.ft',
    status: 'pending',
    verified: false,
    ownerEmail: 'm.sharma@plutoplat.com',
    ownerName: 'Michael Sharma',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 5,
    title: 'The Royal Crescent Estate',
    price: 110000000,
    formattedPrice: '₹11.00 Cr',
    location: 'Swaroop Nagar, Kanpur',
    type: 'Villa',
    beds: 5,
    baths: 5,
    sqft: '7,100 sq.ft',
    status: 'pending',
    verified: false,
    ownerEmail: 'p.patel@plutoplat.com',
    ownerName: 'Priya Patel',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
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
    message: 'Interested in booking a private site visit this weekend. Please share freehold registry documents.',
    status: 'In Progress',
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
    message: 'Looking for a residential property with clear title and private garden.',
    status: 'Scheduled Viewing',
    date: '2026-11-02 18:15',
    leadScore: 'Site Visit Confirmed'
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
  }
];

export const SuperAdminProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_superadmin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [properties, setProperties] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_properties_db');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
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

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_leads_db');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('plutoplat_superadmin_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('plutoplat_superadmin_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_properties_db', JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_users_db', JSON.stringify(usersList));
    } catch (e) {
      console.error(e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_leads_db', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('plutoplat_audits_db', JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  // Sync SuperAdmin session on mount/refresh if token exists
  useEffect(() => {
    const token = localStorage.getItem('pluto_superadmin_token');
    if (token) {
      SuperAdminApi.getMe()
        .then((res) => {
          if (res?.data?.user) {
            const authUser = res.data.user;
            if (authUser.role === 'super_admin') {
              setUser(authUser);
              localStorage.setItem('plutoplat_superadmin_user', JSON.stringify(authUser));
            } else {
              SuperAdminApi.logout();
              setUser(null);
              localStorage.removeItem('plutoplat_superadmin_user');
            }
          }
        })
        .catch((err) => {
          if (err?.status === 401) {
            SuperAdminApi.logout();
            setUser(null);
            localStorage.removeItem('plutoplat_superadmin_user');
          }
        });

      // Sync platform properties from MongoDB backend
      SuperAdminApi.getProperties()
        .then((res) => {
          if (res?.data?.properties && res.data.properties.length > 0) {
            setProperties(res.data.properties);
          }
        })
        .catch(() => {});

      // Sync platform leads from MongoDB backend
      SuperAdminApi.getAllEnquiries()
        .then((res) => {
          if (res?.data?.leads && res.data.leads.length > 0) {
            setLeads(res.data.leads);
          }
        })
        .catch(() => {});

      // Sync platform users from MongoDB backend
      SuperAdminApi.getAllUsers()
        .then((res) => {
          if (res?.data?.users && res.data.users.length > 0) {
            setUsersList(res.data.users);
          }
        })
        .catch(() => {});

      // Sync audit telemetry from MongoDB backend
      SuperAdminApi.getAuditLogs()
        .then((res) => {
          if (res?.data?.audits && res.data.audits.length > 0) {
            setAuditLogs(res.data.audits);
          }
        })
        .catch(() => {});
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const addAuditLog = ({ actorName, actorRole, module, action, target, status = 'SUCCESS', description }) => {
    const newEntry = {
      id: `AUD-${Math.floor(800 + Math.random() * 200)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: actorName || user?.name || 'SuperAdmin',
      actorRole: actorRole || user?.role || 'super_admin',
      module: module || 'SYSTEM',
      action: action || 'ACTION',
      target: target || 'Platform',
      status,
      ip: '103.25.14.92',
      description: description || ''
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await SuperAdminApi.login({ email: email.trim().toLowerCase(), password });
      const authUser = response?.data?.user;

      if (!authUser) {
        throw new Error(response?.message || 'Authentication failed.');
      }

      // Strictly verify SuperAdmin role
      if (authUser.role !== 'super_admin') {
        SuperAdminApi.logout();
        throw new Error('Access Denied: Only SuperAdmin accounts are authorized to access Platform Control.');
      }

      setUser(authUser);
      localStorage.setItem('plutoplat_superadmin_user', JSON.stringify(authUser));

      addAuditLog({
        actorName: authUser.name,
        actorRole: 'super_admin',
        module: 'AUTH',
        action: 'LOGIN',
        target: 'SuperAdmin Control Console',
        description: `SuperAdmin ${authUser.email} successfully logged in.`
      });

      showToast(`Welcome, ${authUser.name}! SuperAdmin access verified.`, 'success');
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    SuperAdminApi.logout();
    addAuditLog({
      actorName: user?.name || 'SuperAdmin',
      actorRole: 'super_admin',
      module: 'AUTH',
      action: 'LOGOUT',
      target: 'SuperAdmin Console',
      description: 'SuperAdmin signed out of platform control console.'
    });
    setUser(null);
    try {
      localStorage.removeItem('plutoplat_superadmin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of SuperAdmin Console.', 'info');
  };

  const updateProfile = async (formData) => {
    const userId = user?._id || user?.id;
    if (userId && localStorage.getItem('pluto_superadmin_token')) {
      await SuperAdminApi.updateProfile(userId, {
        name: formData.name,
        phone: formData.phone,
        location: { city: formData.city },
      });
    }

    const nextUser = {
      ...(user || {}),
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      location: { ...(user?.location || {}), city: formData.city },
    };
    setUser(nextUser);
    try {
      localStorage.setItem('plutoplat_superadmin_user', JSON.stringify(nextUser));
    } catch (e) {
      console.error(e);
    }

    addAuditLog({
      module: 'USER',
      action: 'UPDATE_PROFILE',
      target: 'SuperAdmin Profile',
      description: `SuperAdmin updated identity credentials.`
    });

    showToast('SuperAdmin profile updated successfully.', 'success');
    return nextUser;
  };

  // Property Moderation
  const approveProperty = async (id) => {
    try {
      await SuperAdminApi.moderateProperty(id, { action: 'approve' });
    } catch (err) {}
    const prop = properties.find(p => p.id === id || p._id === id);
    setProperties(prev =>
      prev.map(p => (p.id === id || p._id === id ? { ...p, verified: true, status: 'approved' } : p))
    );
    addAuditLog({
      module: 'PROPERTY',
      action: 'APPROVE',
      target: prop?.title || `ID: ${id}`,
      description: `SuperAdmin approved listing "${prop?.title || id}" for public catalog.`
    });
    showToast(`Property "${prop?.title || id}" is now approved and live on user panel!`, 'success');
  };

  const rejectProperty = async (id, reason = 'Document verification pending') => {
    try {
      await SuperAdminApi.moderateProperty(id, { action: 'reject', reason });
    } catch (err) {}
    const prop = properties.find(p => p.id === id || p._id === id);
    setProperties(prev =>
      prev.map(p => (p.id === id || p._id === id ? { ...p, verified: false, status: 'rejected', rejectReason: reason } : p))
    );
    addAuditLog({
      module: 'PROPERTY',
      action: 'REJECT',
      target: prop?.title || `ID: ${id}`,
      description: `SuperAdmin rejected listing "${prop?.title || id}". Reason: ${reason}`
    });
    showToast(`Property "${prop?.title || id}" has been rejected.`, 'info');
  };

  const deleteProperty = async (id) => {
    try {
      await SuperAdminApi.deleteProperty(id);
    } catch (err) {}
    const toDelete = properties.find(p => p.id === id || p._id === id);
    setProperties(prev => prev.filter(p => p.id !== id && p._id !== id));
    addAuditLog({
      module: 'PROPERTY',
      action: 'DELETE',
      target: toDelete?.title || `ID: ${id}`,
      description: `SuperAdmin deleted property listing: ${toDelete?.title || id}`
    });
    showToast('Property listing removed from platform.', 'info');
  };

  const addProperty = async (newProp) => {
    try {
      const res = await SuperAdminApi.createProperty({
        ...newProp,
        verified: true,
        status: 'approved',
      });
      const createdProp = res?.data?.property || {
        ...newProp,
        id: Date.now(),
        verified: true,
        status: 'approved',
        ownerEmail: user?.email || 'owner@plutoplat.com',
        ownerName: user?.name || 'Platform Director',
        createdAt: new Date().toISOString()
      };
      setProperties(prev => [createdProp, ...prev]);
      addAuditLog({
        module: 'PROPERTY',
        action: 'CREATE',
        target: createdProp.title,
        description: `SuperAdmin created verified direct listing: ${createdProp.title}`
      });
      showToast('Verified property created and published live on user panel!', 'success');
      return createdProp;
    } catch (err) {
      console.warn('Backend property publish notice:', err.message);
      const fallbackProp = {
        ...newProp,
        id: Date.now(),
        verified: true,
        status: 'approved',
        ownerEmail: user?.email || 'owner@plutoplat.com',
        ownerName: user?.name || 'Platform Director',
        createdAt: new Date().toISOString()
      };
      setProperties(prev => [fallbackProp, ...prev]);
      showToast('Verified property created and published live!', 'success');
      return fallbackProp;
    }
  };

  const updateProperty = async (id, updatedFields) => {
    try {
      await SuperAdminApi.updateProperty(id, updatedFields);
    } catch (err) {}
    setProperties(prev => prev.map(p => (p.id === id || p._id === id ? { ...p, ...updatedFields } : p)));
    addAuditLog({
      module: 'PROPERTY',
      action: 'UPDATE',
      target: `ID: ${id}`,
      description: `SuperAdmin updated property details for ID: ${id}`
    });
    showToast('Property details updated successfully.', 'success');
  };

  // Lead Actions
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l)));
    addAuditLog({
      module: 'ENQUIRY',
      action: 'STATUS_UPDATE',
      target: `Lead ID: ${leadId}`,
      description: `SuperAdmin updated lead status to ${newStatus}`
    });
    showToast(`Lead status updated to: ${newStatus}`, 'success');
  };

  // User Management
  const updateUserRole = (userId, newRole) => {
    setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    addAuditLog({
      module: 'USER',
      action: 'ROLE_UPDATE',
      target: `User ID: ${userId}`,
      description: `SuperAdmin changed user role to ${newRole}`
    });
    showToast(`User role updated to ${newRole}`, 'success');
  };

  const toggleUserStatus = (userId) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          addAuditLog({
            module: 'USER',
            action: nextStatus === 'active' ? 'ACTIVATE' : 'SUSPEND',
            target: u.name,
            description: `SuperAdmin changed account status of ${u.email} to ${nextStatus}`
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    showToast('User account status updated.', 'info');
  };

  const unlockUser = (userId) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          addAuditLog({
            module: 'SECURITY',
            action: 'UNLOCK',
            target: u.email,
            description: `SuperAdmin cleared brute-force lockout on ${u.email}`
          });
          return { ...u, status: 'active', loginAttempts: 0 };
        }
        return u;
      })
    );
    showToast('Account lockout lifted.', 'success');
  };

  const updateUserSubscription = (userId, newTier) => {
    setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, subscriptionTier: newTier } : u)));
    addAuditLog({
      module: 'BILLING',
      action: 'SUBSCRIPTION_UPDATE',
      target: `User ID: ${userId}`,
      description: `SuperAdmin updated subscription tier to ${newTier}`
    });
    showToast('Subscription tier updated.', 'success');
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  const switchRole = (newRole) => {
    showToast(`Role switching active persona: ${newRole}`, 'info');
  };

  const isAuthenticated = Boolean(user && user.role === 'super_admin');

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    logout,
    switchRole,
    properties,
    approveProperty,
    rejectProperty,
    deleteProperty,
    addProperty,
    updateProperty,
    leads,
    updateLeadStatus,
    usersList,
    updateUserRole,
    toggleUserStatus,
    unlockUser,
    updateUserSubscription,
    auditLogs,
    addAuditLog,
    formatPrice,
    toast,
    showToast,
    updateProfile
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#151916] text-[#F7F5F0] border border-[#B49A70]/50 px-5 py-3.5 rounded-sm shadow-2xl backdrop-blur-md transition-all duration-300">
          <div className="w-2 h-2 rounded-full bg-[#B49A70] animate-pulse" />
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
        </div>
      )}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdminStore = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdminStore must be used within a SuperAdminProvider');
  }
  return context;
};

// Backwards compatibility alias
export const usePropertyStore = useSuperAdminStore;
export default SuperAdminContext;
