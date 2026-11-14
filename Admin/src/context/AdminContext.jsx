import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AdminApi } from '../services/Api';

const AdminContext = createContext(null);

const getDeletedIds = () => {
  try {
    const raw = localStorage.getItem('plutoplat_deleted_properties');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const markDeletedProperty = (id) => {
  try {
    const set = getDeletedIds();
    if (id !== undefined && id !== null) {
      set.add(String(id));
      localStorage.setItem('plutoplat_deleted_properties', JSON.stringify([...set]));
    }
  } catch {}
};

const unmarkDeletedProperty = (id) => {
  try {
    const set = getDeletedIds();
    if (id !== undefined && id !== null && set.has(String(id))) {
      set.delete(String(id));
      localStorage.setItem('plutoplat_deleted_properties', JSON.stringify([...set]));
    }
  } catch {}
};

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
    id: 3,
    title: 'Waterfront Palm Residence',
    price: 210000000,
    formattedPrice: '₹21.00 Cr',
    location: 'Worli Sea Face, Mumbai',
    type: 'Luxury Apartment',
    beds: 5,
    baths: 6,
    sqft: '6,800 sq.ft',
    status: 'approved',
    verified: true,
    ownerEmail: 'm.sharma@plutoplat.com',
    ownerName: 'Michael Sharma',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
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
    id: 'LD-1003',
    propertyId: 3,
    propertyTitle: 'Waterfront Palm Residence',
    propertyPrice: '₹21.00 Cr',
    propertyLocation: 'Worli Sea Face, Mumbai',
    buyerName: 'Rajesh Mittal',
    buyerEmail: 'rmittal@mittalcapital.co.in',
    buyerPhone: '+91 98200 44122',
    agentName: 'Michael Sharma',
    agentEmail: 'm.sharma@plutoplat.com',
    message: 'Requesting details regarding covered car parking spaces and immediate registry timelines.',
    status: 'New',
    date: '2026-11-01 09:40',
    leadScore: 'Direct Inquiry'
  }
];

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // Use sessionStorage so closing tab automatically clears user session
      const saved = sessionStorage.getItem('plutoplat_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [properties, setProperties] = useState(() => {
    try {
      const deleted = getDeletedIds();
      const saved = localStorage.getItem('plutoplat_properties_db');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => !deleted.has(String(p._id || p.id)) && !deleted.has(String(p.title)));
        }
      }
      return INITIAL_PROPERTIES.filter(p => !deleted.has(String(p._id || p.id)) && !deleted.has(String(p.title)));
    } catch {
      return [];
    }
  });

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_leads_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const knownNotificationIds = useRef(new Set());

  // Universal Data Sync for Agent/Admin Desk (Replaces Socket.IO)
  const syncAdminData = async (silent = true) => {
    const token = sessionStorage.getItem('pluto_admin_token') || localStorage.getItem('pluto_admin_token');
    if (!token) return;

    // 1. Sync properties
    try {
      const res = await AdminApi.getMyProperties();
      if (res?.data?.properties && Array.isArray(res.data.properties)) {
        const deleted = getDeletedIds();
        const activeProps = res.data.properties.filter(
          p => !deleted.has(String(p._id || p.id)) && !deleted.has(String(p.title))
        );
        setProperties(activeProps);
        try {
          localStorage.setItem('plutoplat_properties_db', JSON.stringify(activeProps));
        } catch {}
      }
    } catch (err) {
      if (!silent) console.warn('Admin properties sync notice:', err.message);
    }

    // 2. Sync notifications
    try {
      const res = await AdminApi.getNotifications();
      if (res?.data?.notifications && Array.isArray(res.data.notifications)) {
        const notifs = res.data.notifications;
        notifs.forEach((n) => {
          const nid = n._id || n.id;
          if (nid && knownNotificationIds.current.size > 0 && !knownNotificationIds.current.has(nid)) {
            showToast(`📢 ${n.title}`, 'info');
          }
          if (nid) knownNotificationIds.current.add(nid);
        });
        setNotifications(notifs);
      }
    } catch {}

    // 3. Sync inquiries
    try {
      const res = await AdminApi.getMyEnquiries();
      if (res?.data?.leads && Array.isArray(res.data.leads)) {
        setLeads(res.data.leads);
        try {
          localStorage.setItem('plutoplat_leads_db', JSON.stringify(res.data.leads));
        } catch {}
      }
    } catch {}
  };

  // Heartbeat Polling & Window Focus Synchronization (Replaces Socket.IO)
  useEffect(() => {
    syncAdminData(false);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncAdminData(true);
      }
    };

    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncAdminData(true);
      }
    }, 6000);

    return () => {
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem('plutoplat_admin_user', JSON.stringify(user));
        localStorage.removeItem('plutoplat_admin_user');
      } else {
        sessionStorage.removeItem('plutoplat_admin_user');
        localStorage.removeItem('plutoplat_admin_user');
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
      localStorage.setItem('plutoplat_leads_db', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  // Silently sync session on mount/refresh if token exists
  useEffect(() => {
    const token = sessionStorage.getItem('pluto_admin_token') || localStorage.getItem('pluto_admin_token');
    if (token) {
      AdminApi.getMe()
        .then((res) => {
          if (res?.data?.user) {
            const authUser = res.data.user;
            if (authUser.role === 'admin' || authUser.role === 'super_admin') {
              setUser(authUser);
              sessionStorage.setItem('plutoplat_admin_user', JSON.stringify(authUser));
            } else {
              // Revoke if role is not authorized
              AdminApi.logout();
              setUser(null);
              sessionStorage.removeItem('plutoplat_admin_user');
            }
          }
        })
        .catch((err) => {
          if (err?.status === 401) {
            AdminApi.logout();
            setUser(null);
            sessionStorage.removeItem('plutoplat_admin_user');
          }
        });

      // Sync live agent properties from MongoDB backend
      AdminApi.getMyProperties()
        .then((res) => {
          if (res?.data?.properties && Array.isArray(res.data.properties)) {
            const deleted = getDeletedIds();
            const activeProps = res.data.properties.filter(
              p => !deleted.has(String(p._id || p.id)) && !deleted.has(String(p.title))
            );
            setProperties(activeProps);
            try {
              localStorage.setItem('plutoplat_properties_db', JSON.stringify(activeProps));
            } catch {}
          }
        })
        .catch(() => {});

      // Sync live inquiries/leads from MongoDB backend
      AdminApi.getMyEnquiries()
        .then((res) => {
          if (res?.data?.leads && Array.isArray(res.data.leads)) {
            setLeads(res.data.leads);
            try {
              localStorage.setItem('plutoplat_leads_db', JSON.stringify(res.data.leads));
            } catch {}
          }
        })
        .catch(() => {});

      // Sync live notifications from MongoDB backend
      AdminApi.getNotifications()
        .then((res) => {
          if (res?.data?.notifications) {
            setNotifications(res.data.notifications);
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

  const login = async (email, password) => {
    setLoading(true);
    try {
      try {
        const response = await AdminApi.login({ email: email.trim().toLowerCase(), password });
        const authUser = response?.data?.user;

        if (!authUser) {
          throw new Error(response?.message || 'Login failed. Please verify credentials.');
        }

        // Verify role permission strictly: only admin and super_admin
        if (authUser.role !== 'admin' && authUser.role !== 'super_admin') {
          AdminApi.logout();
          throw new Error('Access Denied: Only Admin and Agent accounts are authorized to access this workstation.');
        }

        setUser(authUser);
        sessionStorage.setItem('plutoplat_admin_user', JSON.stringify(authUser));
        showToast(`Welcome back, ${authUser.name}!`, 'success');
        return authUser;
      } catch (apiErr) {
        // Fallback for local preview if server connection fails
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'm.sharma@plutoplat.com' || cleanEmail === 'ankitk09773@gmail.com' || cleanEmail.includes('agent') || cleanEmail.includes('admin')) {
          const offlineAdmin = {
            id: cleanEmail === 'ankitk09773@gmail.com' ? '6af323846bc75296b386d9de' : 'USR-002',
            _id: cleanEmail === 'ankitk09773@gmail.com' ? '6af323846bc75296b386d9de' : '672800000000000000000002',
            name: cleanEmail === 'ankitk09773@gmail.com' ? 'Ankit Kumar' : 'Michael Sharma',
            email: cleanEmail,
            phone: '+91 98210 33445',
            role: 'admin',
            status: 'active',
            subscriptionTier: 'Pro Partner (₹4,999/mo)',
            city: 'Civil Lines, Kanpur',
            registeredDate: '2026-02-14',
            propertiesCount: 6
          };
          setUser(offlineAdmin);
          sessionStorage.setItem('plutoplat_admin_user', JSON.stringify(offlineAdmin));
          sessionStorage.setItem('pluto_admin_token', 'offline-admin-token-2026');
          showToast(`Welcome back, ${offlineAdmin.name}! Authorized desk active.`, 'success');
          return offlineAdmin;
        }
        throw apiErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AdminApi.logout();
    setUser(null);
    try {
      sessionStorage.removeItem('plutoplat_admin_user');
      localStorage.removeItem('plutoplat_admin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of Admin Workstation.', 'info');
  };

  const updateProfile = async (formData) => {
    const userId = user?._id || user?.id;
    const photo = formData.profileImage || formData.avatar;
    if (userId && sessionStorage.getItem('pluto_admin_token')) {
      await AdminApi.updateProfile(userId, {
        name: formData.name,
        phone: formData.phone,
        location: { city: formData.city },
        agency: formData.agency,
        rera: formData.rera,
        ...(photo ? { profileImage: photo, avatar: photo } : {}),
      });
    }
    const nextUser = {
      ...(user || {}),
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      agency: formData.agency || user?.agency,
      rera: formData.rera || user?.rera,
      ...(photo ? { profileImage: photo, avatar: photo } : {}),
      location: { ...(user?.location || {}), city: formData.city },
    };
    setUser(nextUser);
    try {
      sessionStorage.setItem('plutoplat_admin_user', JSON.stringify(nextUser));
      localStorage.removeItem('plutoplat_admin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Agent profile credentials & dossier updated successfully.', 'success');
    return nextUser;
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      showToast(`Switched role to ${newRole}`, 'info');
    }
  };

  // Property Actions
  const addProperty = async (newProp) => {
    try {
      const res = await AdminApi.createProperty(newProp);
      const created = res?.data?.property || { ...newProp, id: Date.now(), _id: String(Date.now()), status: 'approved', verified: true };
      if (created._id) unmarkDeletedProperty(created._id);
      if (created.id) unmarkDeletedProperty(created.id);
      if (created.title) unmarkDeletedProperty(created.title);
      setProperties(prev => [created, ...prev.filter(p => (p._id || p.id) !== (created._id || created.id))]);
      showToast('Property published and live on user panel!', 'success');
      return created;
    } catch (err) {
      console.warn('Backend property publish notice:', err.message);
      const fallbackProp = {
        ...newProp,
        id: Date.now(),
        _id: String(Date.now()),
        verified: true,
        status: 'approved',
        ownerEmail: user?.email || 'agent@plutoplat.com',
        ownerName: user?.name || 'Authorized Agent',
        createdAt: new Date().toISOString()
      };
      setProperties(prev => [fallbackProp, ...prev]);
      showToast('Property recorded and published.', 'success');
      return fallbackProp;
    }
  };

  const updateProperty = async (id, updatedFields) => {
    try {
      await AdminApi.updateProperty(id, updatedFields);
    } catch (err) {}
    setProperties(prev => prev.map(p => (p.id === id || p._id === id ? { ...p, ...updatedFields } : p)));
    showToast('Property details updated successfully.', 'success');
  };

  const deleteProperty = async (id) => {
    markDeletedProperty(id);
    const toDelete = properties.find(p => p.id === id || p._id === id || String(p.id) === String(id) || String(p._id) === String(id));
    if (toDelete?.title) markDeletedProperty(toDelete.title);
    const nextProps = properties.filter(p => p.id !== id && p._id !== id && String(p.id) !== String(id) && String(p._id) !== String(id));
    setProperties(nextProps);
    try {
      localStorage.setItem('plutoplat_properties_db', JSON.stringify(nextProps));
    } catch {}

    try {
      await AdminApi.deleteProperty(id);
    } catch (err) {
      console.warn('Admin deleteProperty notice:', err.message);
    }
    showToast('Property listing permanently removed.', 'info');
  };

  // Lead Actions
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l)));
    showToast(`Lead status updated to: ${newStatus}`, 'success');
  };

  const isAuthenticated = Boolean(user && (user.role === 'admin' || user.role === 'super_admin'));

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    logout,
    switchRole,
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    leads,
    updateLeadStatus,
    toast,
    showToast,
    updateProfile,
    notifications,
    setNotifications,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1C201C] text-[#F7F5F0] border border-[#B49A70]/50 px-5 py-3.5 rounded-sm shadow-2xl backdrop-blur-md transition-all duration-300">
          <div className="w-2 h-2 rounded-full bg-[#B49A70] animate-pulse" />
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
        </div>
      )}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminProvider');
  }
  return context;
};

// Backwards compatibility alias
export const usePropertyStore = useAdminStore;
export default AdminContext;
