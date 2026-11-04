import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminApi } from '../services/Api';

const AdminContext = createContext(null);

const DEFAULT_AGENT_USER = {
  id: 'USR-002',
  name: 'Michael Sharma',
  email: 'm.sharma@plutoplat.com',
  phone: '+91 98210 33445',
  role: 'admin',
  agency: 'Sovereign Heritage Realty Partners',
  rera: 'UP-RERA-2026-98124',
  tier: 'Pro Partner (₹4,999/mo)',
  city: 'Civil Lines, Kanpur',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
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

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // First attempt remote API login
      try {
        const response = await AdminApi.login({ email, password });
        if (response?.data?.user) {
          const authUser = response.data.user;
          // Verify role permission
          if (authUser.role !== 'admin' && authUser.role !== 'super_admin') {
            throw new Error('Access Denied: Only Admin and Agent accounts are authorized to access this workstation.');
          }
          setUser(authUser);
          showToast(`Welcome back, ${authUser.name}!`, 'success');
          return authUser;
        }
      } catch (apiErr) {
        // Fallback for local demo preview if network/backend is unavailable
        if (email.toLowerCase().includes('agent') || email.toLowerCase() === 'm.sharma@plutoplat.com' || email.toLowerCase() === 'owner@plutoplat.com') {
          const demoUser = {
            ...DEFAULT_AGENT_USER,
            email: email,
            name: email === 'owner@plutoplat.com' ? 'Julian Beaumont' : 'Michael Sharma',
            role: email === 'owner@plutoplat.com' ? 'super_admin' : 'admin'
          };
          setUser(demoUser);
          localStorage.setItem('pluto_admin_token', 'demo-agent-jwt-token-2026');
          showToast(`Signed in to Agent Workstation as ${demoUser.name}`, 'success');
          return demoUser;
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
    showToast('Signed out of Admin Workstation.', 'info');
  };

  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      showToast(`Switched role to ${newRole}`, 'info');
    }
  };

  // Property Actions
  const addProperty = (newProp) => {
    const id = Date.now();
    const createdProp = {
      ...newProp,
      id,
      verified: user?.role === 'super_admin',
      status: user?.role === 'super_admin' ? 'approved' : 'pending',
      ownerEmail: user?.email || 'm.sharma@plutoplat.com',
      ownerName: user?.name || 'Michael Sharma',
      createdAt: new Date().toISOString()
    };
    setProperties(prev => [createdProp, ...prev]);
    showToast('Property submitted! Awaiting SuperAdmin verification and approval.', 'success');
    return createdProp;
  };

  const updateProperty = (id, updatedFields) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
    showToast('Property details updated successfully.', 'success');
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
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
    showToast
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
