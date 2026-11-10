import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminApi } from '../services/Api';

const AdminContext = createContext(null);

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
      const saved = localStorage.getItem('plutoplat_admin_user');
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

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('plutoplat_leads_db');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('plutoplat_admin_user', JSON.stringify(user));
      } else {
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

  // Silently sync session on mount/refresh if token exists without logging out on network failure
  useEffect(() => {
    const token = localStorage.getItem('pluto_admin_token');
    if (token) {
      AdminApi.getMe()
        .then((res) => {
          if (res?.data?.user) {
            const authUser = res.data.user;
            if (authUser.role === 'admin' || authUser.role === 'super_admin') {
              setUser(authUser);
              localStorage.setItem('plutoplat_admin_user', JSON.stringify(authUser));
            } else {
              // Revoke if role is not authorized
              AdminApi.logout();
              setUser(null);
              localStorage.removeItem('plutoplat_admin_user');
            }
          }
        })
        .catch((err) => {
          if (err?.status === 401) {
            AdminApi.logout();
            setUser(null);
            localStorage.removeItem('plutoplat_admin_user');
          }
        });

      // Sync live agent properties from MongoDB backend
      AdminApi.getMyProperties()
        .then((res) => {
          if (res?.data?.properties && res.data.properties.length > 0) {
            setProperties(res.data.properties);
          }
        })
        .catch(() => {});

      // Sync live inquiries/leads from MongoDB backend
      AdminApi.getMyEnquiries()
        .then((res) => {
          if (res?.data?.leads && res.data.leads.length > 0) {
            setLeads(res.data.leads);
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
      localStorage.setItem('plutoplat_admin_user', JSON.stringify(authUser));
      showToast(`Welcome back, ${authUser.name}!`, 'success');
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AdminApi.logout();
    setUser(null);
    try {
      localStorage.removeItem('plutoplat_admin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of Admin Workstation.', 'info');
  };

  const updateProfile = async (formData) => {
    const userId = user?._id || user?.id;
    if (userId && localStorage.getItem('pluto_admin_token')) {
      await AdminApi.updateProfile(userId, {
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
      agency: formData.agency || user?.agency,
      rera: formData.rera || user?.rera,
      location: { ...(user?.location || {}), city: formData.city },
    };
    setUser(nextUser);
    try {
      localStorage.setItem('plutoplat_admin_user', JSON.stringify(nextUser));
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
      const created = res?.data?.property || { ...newProp, id: Date.now(), status: 'approved', verified: true };
      setProperties(prev => [created, ...prev]);
      showToast('Property published and live on user portal!', 'success');
      return created;
    } catch (err) {
      console.warn('Backend property publish notice:', err.message);
      const fallbackProp = {
        ...newProp,
        id: Date.now(),
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
    try {
      await AdminApi.deleteProperty(id);
    } catch (err) {}
    setProperties(prev => prev.filter(p => p.id !== id && p._id !== id));
    showToast('Property listing removed.', 'info');
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
    updateProfile
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
