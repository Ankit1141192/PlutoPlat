import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Inbox,
  Clock,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  Eye,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BarChart3
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';
import AreaTrendChart from '../Components/Charts/AreaTrendChart';
import BarMetricChart from '../Components/Charts/BarMetricChart';
import DonutDistributionChart from '../Components/Charts/DonutDistributionChart';

const Dashboard = () => {
  const { user, properties, leads } = useAdminStore();

  const myProperties = properties.filter(
    (p) => p.ownerEmail === user?.email || p.ownerName === user?.name || user?.role === 'admin'
  );

  const pendingProperties = myProperties.filter((p) => !p.verified || p.status === 'pending');
  const approvedProperties = myProperties.filter((p) => p.verified && p.status !== 'rejected');

  const myLeads = leads.filter(
    (l) => l.agentEmail === user?.email || l.agentName === user?.name || user?.role === 'admin'
  );
  const newLeads = myLeads.filter((l) => l.status === 'New');

  // Weekly performance data for agent
  const weeklyViewsData = [
    { label: 'Mon', inquiries: 18, visits: 8 },
    { label: 'Tue', inquiries: 24, visits: 11 },
    { label: 'Wed', inquiries: 28, visits: 14 },
    { label: 'Thu', inquiries: 32, visits: 16 },
    { label: 'Fri', inquiries: 45, visits: 24 },
    { label: 'Sat', inquiries: 62, visits: 38 },
    { label: 'Sun', inquiries: 54, visits: 32 }
  ];

  const localityValuationData = [
    { city: 'Civil Lines, Kanpur', value: 34.5, listings: 4, label: '₹34.5 Cr' },
    { city: 'Mall Road, Kanpur', value: 22.0, listings: 3, label: '₹22.0 Cr' },
    { city: 'Golf Links, Delhi', value: 48.0, listings: 2, label: '₹48.0 Cr' },
    { city: 'Worli, Mumbai', value: 38.5, listings: 2, label: '₹38.5 Cr' }
  ];

  const inquirySourceData = [
    { label: 'Direct Web Portal', percentage: 54, count: 18, color: '#B49A70' },
    { label: 'Mobile App Users', percentage: 28, count: 9, color: '#287A50' },
    { label: 'HNW Client Referral', percentage: 18, count: 6, color: '#1C201C' }
  ];

  return (
    <AdminLayout title="Agent & Broker Operations Desk">
      <div className="space-y-8">
        {/* Compliance Notice Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-3">
          <Clock size={18} className="text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-semibold">SuperAdmin Moderation Policy Active:</strong>{' '}
            As a licensed Agent / Seller, all new property listings submitted through this portal are held in{' '}
            <span className="font-semibold underline">Pending Review</span> status until verified and approved by the
            Website Owner (SuperAdmin). Once approved, your listing is automatically published to the public marketplace.
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total My Properties */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                My Portfolio
              </span>
              <div className="w-8 h-8 rounded-full bg-[#B49A70]/15 text-[#B49A70] flex items-center justify-center">
                <Building2 size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{myProperties.length}</span>
              <span className="text-xs text-[#287A50] font-semibold flex items-center gap-0.5">
                <TrendingUp size={12} /> {approvedProperties.length} Live
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>In SuperAdmin Review:</span>
              <strong className={pendingProperties.length > 0 ? 'text-[#B49A70]' : 'text-emerald-700'}>
                {pendingProperties.length} listings
              </strong>
            </div>
          </div>

          {/* Client Leads Received */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Buyer Inquiries
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Inbox size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{myLeads.length}</span>
              <span className="text-xs text-emerald-700 font-semibold">
                {newLeads.length} Unread
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>Follow-up SLA:</span>
              <strong className="text-[#1C201C]">Under 2 Hours</strong>
            </div>
          </div>

          {/* Listing Views */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Portfolio Impressions
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <Eye size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">14,820</span>
              <span className="text-xs text-emerald-700 font-semibold">+18.4% MoM</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>Verified High Net Worth:</span>
              <strong className="text-emerald-700">92% Qualified</strong>
            </div>
          </div>

          {/* Partner Status */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Licensing & Badge
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-serif text-[#1C201C]">Pro Partner</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>RERA ID:</span>
              <strong className="text-[#1C201C] font-mono">UP-RERA-2026-981</strong>
            </div>
          </div>
        </div>

        {/* Agent Analytics & Performance Charts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-[#1C201C]">Listing Traffic & Lead Conversion Analytics</h2>
              <p className="text-xs text-[#6E6D66]">Track weekly client impressions, site visit appointments, and portfolio depth</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#287A50] font-medium bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
              <BarChart3 size={13} />
              <span>Live Agent Telemetry</span>
            </div>
          </div>

          {/* Weekly Traffic Wave Chart */}
          <AreaTrendChart
            data={weeklyViewsData}
            title="Weekly Inquiries & Physical Site Visits (Last 7 Days)"
            subtitle="Comparing inquiries received against confirmed site visit inspections scheduled on your listings"
            metric1Name="Buyer Inquiries"
            metric1Key="inquiries"
            metric2Name="Site Visits Scheduled"
            metric2Key="visits"
          />

          {/* Dual Charts: Locality Valuation & Source Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarMetricChart
              data={localityValuationData}
              title="My Listings by Locality Valuation"
              subtitle="Asset value distributed across prime residential clusters"
            />
            <DonutDistributionChart
              data={inquirySourceData}
              title="Client Inquiry Acquisition Channels"
              subtitle="Where your prospective property buyers are finding your listings"
              centerLabel="My Portfolio"
              centerValue="₹143 Cr"
            />
          </div>
        </div>

        {/* Dual Section: My Recent Properties & Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Recent Properties */}
          <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base text-[#1C201C]">My Properties Catalogue</h3>
                <p className="text-[11px] text-[#6E6D66]">Listings managed under your agent profile</p>
              </div>
              <Link
                to="/admin/properties"
                className="text-xs text-[#B49A70] hover:text-[#1C201C] font-semibold flex items-center gap-1"
              >
                <span>View All ({myProperties.length})</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-[#EAE6DE] border border-[#EAE6DE] rounded-xs overflow-hidden">
              {myProperties.slice(0, 3).map((prop) => (
                <div key={prop.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8F6F2]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                      alt={prop.title}
                      className="w-12 h-12 object-cover rounded-2xs border border-[#DDD8CE] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-[#1C201C] truncate">{prop.title}</p>
                      <p className="text-[11px] text-[#6E6D66]">{prop.price} • {prop.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!prop.verified || prop.status === 'pending' ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        In Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Live
                      </span>
                    )}

                    <Link
                      to={`/property/${prop.id}`}
                      target="_blank"
                      className="p-1 text-[#6E6D66] hover:text-[#1C201C]"
                    >
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                to="/properties"
                className="w-full py-2.5 bg-[#1C201C] hover:bg-black text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle size={14} className="text-[#B49A70]" />
                <span>Submit New Property Listing</span>
              </Link>
            </div>
          </div>

          {/* Inquiries On My Properties */}
          <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base text-[#1C201C]">Buyer Leads on Your Properties</h3>
                <p className="text-[11px] text-[#6E6D66]">Direct client leads routed to you</p>
              </div>
              <Link to="/leads" className="text-xs text-[#B49A70] hover:underline font-semibold">
                Manage Inquiries ({myLeads.length})
              </Link>
            </div>

            <div className="space-y-3">
              {myLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="p-3 bg-[#F8F6F2] border border-[#EAE6DE] rounded-xs text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#1C201C]">{lead.buyerName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1C201C] text-white">
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#B49A70] font-medium">{lead.propertyTitle}</p>
                  <p className="text-[11px] text-[#6E6D66] line-clamp-1 mt-1 font-light italic">"{lead.message}"</p>
                  <div className="mt-2 pt-2 border-t border-[#DDD8CE] flex items-center justify-between text-[10px] text-[#8E8B82]">
                    <span>{lead.buyerPhone} • {lead.buyerEmail}</span>
                    <span>{lead.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
