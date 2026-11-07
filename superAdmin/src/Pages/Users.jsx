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
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Accounts, Roles & Subscriptions Directory</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Configure role access levels, promote broker agents, manage membership subscriptions, and release locked credentials.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
            <input
              type="text"
              placeholder="Search users by name, confidential email, or telephone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full pl-10 pr-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 text-[#1C201C] placeholder:text-[#A9A69B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 px-4 text-xs bg-[#FBFAF7] border border-[#DDD8CE] rounded-xl text-[#1C201C] focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20 cursor-pointer font-medium"
            >
              <option value="all">All Roles ({usersList.length})</option>
              <option value="super_admin">SuperAdmin (Owner)</option>
              <option value="admin">Admin (Seller/Agent)</option>
              <option value="user">User (Buyer)</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E3D8] text-[11px] uppercase font-semibold tracking-wider text-[#6E6D66]">
                  <th className="py-4 px-5">User Dossier</th>
                  <th className="py-4 px-5">Role Classification</th>
                  <th className="py-4 px-5">Subscription Plan</th>
                  <th className="py-4 px-5">Security Status</th>
                  <th className="py-4 px-5 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#6E6D66]">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users size={28} className="mx-auto text-[#B49A70]/50" />
                        <p className="font-serif text-base text-[#1C201C]">No users found</p>
                        <p className="text-[11px] text-[#8A887F]">
                          No user accounts matched your search criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSuperAdmin = u.role === 'super_admin';
                    const isAdmin = u.role === 'admin';
                    const isLocked = u.status === 'locked';

                    return (
                      <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                        {/* User Dossier */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#101411] to-[#1E251E] text-[#D9C49B] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ring-2 ring-[#B49A70]/20">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-[#1C201C] font-serif">{u.name}</p>
                              <p className="text-[11px] text-[#6E6D66] mt-0.5">{u.email} • {u.phone}</p>
                              <p className="text-[10px] text-[#8A887F]">{u.city}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="py-4 px-5">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            disabled={u.id === 'USR-001'} // protect primary root account
                            className={`h-8 px-3 text-[11px] font-semibold rounded-full border transition-all cursor-pointer focus:outline-none ${
                              isSuperAdmin
                                ? 'bg-[#1C201C] text-white border-black'
                                : isAdmin
                                ? 'bg-[#B49A70]/15 text-[#8A734D] border-[#B49A70]/40'
                                : 'bg-[#FBFAF7] text-[#1C201C] border-[#DDD8CE]'
                            }`}
                          >
                            <option value="user">User (Buyer)</option>
                            <option value="admin">Admin (Seller/Agent)</option>
                            <option value="super_admin">SuperAdmin (Owner)</option>
                          </select>
                        </td>

                        {/* Subscription Tier */}
                        <td className="py-4 px-5">
                          <select
                            value={u.subscriptionTier || 'Standard Buyer (Free)'}
                            onChange={(e) => updateUserSubscription(u.id, e.target.value)}
                            className="h-8 px-3 text-[11px] rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] text-[#1C201C] focus:outline-none focus:border-[#B49A70] cursor-pointer"
                          >
                            <option value="Standard Buyer (Free)">Standard Buyer (Free)</option>
                            <option value="Pro Premier Partner">Pro Premier Partner (₹4,999/mo)</option>
                            <option value="Private Sovereign Member">Private Sovereign Member (₹19,999/mo)</option>
                            <option value="Sovereign Website Owner">Sovereign Website Owner</option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
                              <Lock size={11} /> Locked
                            </span>
                          ) : u.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={11} /> Active
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isLocked && (
                              <button
                                onClick={() => unlockUser(u.id)}
                                className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                                title="Unlock Account (Clear Lockout)"
                              >
                                <Unlock size={12} />
                                <span>Unlock</span>
                              </button>
                            )}

                            {u.id !== 'USR-001' && (
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                  u.status === 'active'
                                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
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
