import React from 'react';
import {
  CreditCard,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Star,
  Users,
  Building2,
  Sparkles
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Subscriptions = () => {
  const { usersList } = useSuperAdminStore();

  const proUsers = usersList.filter(u => u.subscriptionTier?.includes('Pro Premier'));
  const sovereignUsers = usersList.filter(u => u.subscriptionTier?.includes('Sovereign'));
  const freeUsers = usersList.filter(u => !u.subscriptionTier || u.subscriptionTier?.includes('Free'));

  return (
    <SuperAdminLayout title="Subscription Tiers & Monetization">
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Platform Membership & Partner Tiers</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Manage subscription plans, recurring broker partner licensing, and private family office entitlements.
          </p>
        </div>

        {/* Tier Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Buyer Tier */}
          <div className="bg-white p-6 sm:p-8 border border-[#E8E3D8] rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6D66]">Buyer Access</span>
                <span className="text-[10px] bg-[#FAF8F5] text-[#6E6D66] border border-[#E8E3D8] px-2.5 py-0.5 rounded-full font-semibold">Standard</span>
              </div>
              <h3 className="font-serif text-3xl text-[#1C201C] font-normal">Complimentary</h3>
              <p className="text-xs text-[#8E8B82] mt-1">For accredited private purchasers</p>

              <ul className="mt-6 space-y-3 text-xs text-[#6E6D66]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Search & Filter Global Portfolios</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Submit Confidential Inquiries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Personal Favorites & Saved Searches</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EAE6DE] flex items-center justify-between text-xs">
              <span className="text-[#6E6D66]">Active Subscribers:</span>
              <strong className="text-[#1C201C]">{freeUsers.length} Users</strong>
            </div>
          </div>

          {/* Agent Pro Tier */}
          <div className="bg-white p-6 sm:p-8 border-2 border-[#B49A70] rounded-2xl shadow-md relative flex flex-col justify-between hover:shadow-lg transition-all duration-200">
            <div className="absolute -top-3 right-6 bg-[#B49A70] text-[#121612] text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
              Most Popular Partner
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B49A70]">Broker & Developer</span>
                <span className="text-[10px] bg-[#B49A70]/15 text-[#8A734D] px-2.5 py-0.5 rounded-full font-bold">Pro Partner</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="font-serif text-3xl text-[#1C201C] font-normal">₹4,999</h3>
                <span className="text-xs text-[#8E8B82]">/ month</span>
              </div>
              <p className="text-xs text-[#8E8B82] mt-1">For verified agents & estate sellers</p>

              <ul className="mt-6 space-y-3 text-xs text-[#1C201C]">
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#B49A70] shrink-0" />
                  <span>Publish Unlimited Property Listings</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#B49A70] shrink-0" />
                  <span>Receive Direct Buyer Leads & Inquiries</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#B49A70] shrink-0" />
                  <span>Partner Badge & CRM Inquiries Matrix</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#B49A70] shrink-0" />
                  <span>SuperAdmin Priority Review</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#EAE6DE] flex items-center justify-between text-xs">
              <span className="text-[#6E6D66]">Active Subscribers:</span>
              <strong className="text-[#B49A70] font-bold">{proUsers.length} Active Partners</strong>
            </div>
          </div>

          {/* Sovereign Member */}
          <div className="bg-gradient-to-b from-[#101411] to-[#161B16] text-white p-6 sm:p-8 border border-[#262E27] rounded-2xl shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D9C49B]">Family Office</span>
                <span className="text-[10px] bg-[#B49A70] text-[#121612] px-2.5 py-0.5 rounded-full font-bold">VIP Concierge</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="font-serif text-3xl text-white font-normal">₹19,999</h3>
                <span className="text-xs text-[#B0ACA2]">/ month</span>
              </div>
              <p className="text-xs text-[#B0ACA2] mt-1">Exclusive sovereign wealth portfolio access</p>

              <ul className="mt-6 space-y-3 text-xs text-[#E8E5DF]">
                <li className="flex items-center gap-2.5">
                  <Sparkles size={15} className="text-[#D9C49B] shrink-0" />
                  <span>Off-Market Trophy Estates Unlocked</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles size={15} className="text-[#D9C49B] shrink-0" />
                  <span>Dedicated Fiduciary Advisory Desk</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles size={15} className="text-[#D9C49B] shrink-0" />
                  <span>Helicopter / Private Chauffeur Viewings</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles size={15} className="text-[#D9C49B] shrink-0" />
                  <span>Bespoke Cryptographic Escrow Support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#262E27] flex items-center justify-between text-xs">
              <span className="text-[#B0ACA2]">Active VIP Clients:</span>
              <strong className="text-white font-bold">{sovereignUsers.length} Clients</strong>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Subscriptions;
