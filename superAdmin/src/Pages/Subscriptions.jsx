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
          <h2 className="font-serif text-lg text-[#1C201C]">Platform Membership & Partner Tiers</h2>
          <p className="text-xs text-[#6E6D66]">
            Manage subscription plans, recurring broker partner licensing, and private family office entitlements.
          </p>
        </div>

        {/* Tier Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Buyer Tier */}
          <div className="bg-white p-6 border border-[#DDD8CE] rounded-sm shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E6D66]">Buyer Access</span>
                <span className="text-[10px] bg-gray-100 text-[#6E6D66] px-2 py-0.5 rounded-full font-bold">Standard</span>
              </div>
              <h3 className="font-serif text-2xl text-[#1C201C]">Complimentary</h3>
              <p className="text-xs text-[#8E8B82] mt-1">For qualified private purchasers</p>

              <ul className="mt-6 space-y-2.5 text-xs text-[#6E6D66]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#287A50]" />
                  <span>Search & Filter Global Portfolios</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#287A50]" />
                  <span>Submit Confidential Enquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#287A50]" />
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
          <div className="bg-white p-6 border-2 border-[#B49A70] rounded-sm shadow-lg relative flex flex-col justify-between">
            <div className="absolute -top-3 right-6 bg-[#B49A70] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
              Most Popular Partner
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B49A70]">Broker & Developer</span>
                <span className="text-[10px] bg-[#B49A70]/15 text-[#B49A70] px-2 py-0.5 rounded-full font-bold">Pro Partner</span>
              </div>
              <div className="flex items-baseline gap-1">
                <h3 className="font-serif text-2xl text-[#1C201C]">₹4,999</h3>
                <span className="text-xs text-[#8E8B82]">/ month</span>
              </div>
              <p className="text-xs text-[#8E8B82] mt-1">For verified agents & estate sellers</p>

              <ul className="mt-6 space-y-2.5 text-xs text-[#1C201C]">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-[#B49A70]" />
                  <span>Publish Unlimited Pending Listings</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-[#B49A70]" />
                  <span>Receive Direct Buyer Leads & Enquiries</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-[#B49A70]" />
                  <span>Partner Badge & CRM Inquiries Matrix</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} className="text-[#B49A70]" />
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
          <div className="bg-[#1C201C] text-white p-6 border border-[#2B302B] rounded-sm shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B49A70]">Family Office</span>
                <span className="text-[10px] bg-[#B49A70] text-[#1C201C] px-2 py-0.5 rounded-full font-bold">VIP Concierge</span>
              </div>
              <div className="flex items-baseline gap-1">
                <h3 className="font-serif text-2xl text-white">₹19,999</h3>
                <span className="text-xs text-[#B0ACA2]">/ month</span>
              </div>
              <p className="text-xs text-[#B0ACA2] mt-1">Exclusive sovereign wealth portfolio access</p>

              <ul className="mt-6 space-y-2.5 text-xs text-[#E8E5DF]">
                <li className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#B49A70]" />
                  <span>Off-Market Trophy Estates Unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#B49A70]" />
                  <span>Dedicated Fiduciary Advisory Desk</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#B49A70]" />
                  <span>Helicopter / Private Chauffeur Viewings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#B49A70]" />
                  <span>Bespoke Cryptographic Escrow Support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#333833] flex items-center justify-between text-xs">
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
