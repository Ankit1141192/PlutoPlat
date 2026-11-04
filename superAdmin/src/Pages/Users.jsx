import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Unlock,
  Lock,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const UsersPage = () => {
  const { usersList, updateUserRole, toggleUserStatus, unlockUser, updateUserSubscription } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name?.toLowerCase().includes(q);
        const matchesEmail = u.email?.toLowerCase().includes(q);
        const matchesPhone = u.phone?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [usersList, roleFilter, searchQuery]);

  return (
    <SuperAdminLayout title="User & Administrator Governance">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div>
          <h2 className="font-serif text-lg text-[#1C201C]">Accounts, Roles & Subscriptions Directory</h2>
          <p className="text-xs text-[#6E6D66]">
            Configure role access levels, promote broker agents, manage membership subscriptions, and release locked credentials.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 border border-[#DDD8CE] rounded-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766E]" />
            <input
              type="text"
              placeholder="Search users by name, confidential email, or telephone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs focus:outline-none focus:border-[#B49A70]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs text-[#1C201C] focus:outline-none"
            >
              <option value="all">All Roles ({usersList.length})</option>
              <option value="super_admin">SuperAdmin (Owner)</option>
              <option value="admin">Admin (Seller/Agent)</option>
              <option value="user">User (Buyer)</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-[#DDD8CE] rounded-sm shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F6F2] border-b border-[#DDD8CE] text-[10px] uppercase font-bold tracking-wider text-[#6E6D66]">
                  <th className="py-3 px-4">User Dossier</th>
                  <th className="py-3 px-4">Role Classification</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Security Status</th>
                  <th className="py-3 px-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#6E6D66]">
                      No user accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSuperAdmin = u.role === 'super_admin';
                    const isAdmin = u.role === 'admin';
                    const isUser = u.role === 'user';
                    const isLocked = u.status === 'locked';

                    return (
                      <tr key={u.id} className="hover:bg-[#F8F6F2] transition-colors">
                        {/* User Dossier */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1C201C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1C201C]">{u.name}</p>
                              <p className="text-[10px] text-[#6E6D66]">{u.email} • {u.phone}</p>
                              <p className="text-[10px] text-[#8E8B82]">{u.city}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            disabled={u.id === 'USR-001'} // protect primary root account
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs border focus:outline-none ${
                              isSuperAdmin
                                ? 'bg-[#1C201C] text-white border-black'
                                : isAdmin
                                ? 'bg-[#B49A70]/15 text-[#B49A70] border-[#B49A70]'
                                : 'bg-[#F8F6F2] text-[#1C201C] border-[#DDD8CE]'
                            }`}
                          >
                            <option value="user">User (Buyer)</option>
                            <option value="admin">Admin (Seller/Agent)</option>
                            <option value="super_admin">SuperAdmin (Owner)</option>
                          </select>
                        </td>

                        {/* Subscription Tier */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.subscriptionTier || 'Standard Buyer (Free)'}
                            onChange={(e) => updateUserSubscription(u.id, e.target.value)}
                            className="px-2.5 py-1 text-[11px] rounded-xs border border-[#DDD8CE] bg-white text-[#1C201C] focus:outline-none"
                          >
                            <option value="Standard Buyer (Free)">Standard Buyer (Free)</option>
                            <option value="Pro Premier Partner">Pro Premier Partner (₹4,999/mo)</option>
                            <option value="Private Sovereign Member">Private Sovereign Member (₹19,999/mo)</option>
                            <option value="Sovereign Website Owner">Sovereign Website Owner</option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                              <Lock size={10} /> Locked (5 Attempts)
                            </span>
                          ) : u.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isLocked && (
                              <button
                                onClick={() => unlockUser(u.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                                title="Unlock Account (Clear Lockout)"
                              >
                                <Unlock size={11} />
                                <span>Unlock</span>
                              </button>
                            )}

                            {u.id !== 'USR-001' && (
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded-xs border transition-colors cursor-pointer ${
                                  u.status === 'active'
                                    ? 'border-red-300 text-red-700 hover:bg-red-50'
                                    : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default UsersPage;
