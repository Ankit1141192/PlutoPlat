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
  BarChart3,
  CalendarCheck
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
        {/* Compliance Notice Banner - Luxury Style */}
        <div className="p-5 bg-[#FDFBF7] border border-[#E8DFC9] rounded-2xl flex items-start gap-3.5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#B49A70]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#B49A70]">
            <Clock size={16} />
          </div>
          <div className="text-xs text-[#5D5545] leading-relaxed">
            <span className="font-semibold text-[#1C201C] font-serif text-sm block mb-0.5">
              SuperAdmin Moderation Policy Active
            </span>
            As a licensed Agent & Seller, all new property listings submitted through this portal are held in{' '}
            <span className="font-semibold text-[#B49A70]">Pending Verification</span> status until verified and approved by the
            SuperAdmin Platform Desk. Once approved, your residence is automatically featured on the public marketplace.
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total My Properties */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                My Portfolio
              </span>
              <div className="w-9 h-9 rounded-full bg-[#B49A70]/15 text-[#B49A70] flex items-center justify-center">
                <Building2 size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{myProperties.length}</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp size={11} /> {approvedProperties.length} Live
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>In Review:</span>
              <strong className={pendingProperties.length > 0 ? 'text-[#B49A70] font-medium' : 'text-emerald-700'}>
                {pendingProperties.length} listings
              </strong>
            </div>
          </div>

          {/* Client Leads Received */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Buyer Inquiries
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Inbox size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{myLeads.length}</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                {newLeads.length} Unread
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>Response SLA:</span>
              <strong className="text-[#1C201C]">Under 2 Hours</strong>
            </div>
          </div>

          {/* Listing Views */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Portfolio Impressions
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <Eye size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">14,820</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                +18.4% MoM
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>HNW Accredited:</span>
              <strong className="text-emerald-700">92% Qualified</strong>
            </div>
          </div>

          {/* Partner Status */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Licensing & Badge
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-serif text-[#1C201C]">Pro Partner</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>RERA ID:</span>
              <strong className="text-[#1C201C] font-mono text-[11px]">UP-RERA-2026-981</strong>
            </div>
          </div>
        </div>

        {/* Agent Analytics & Performance Charts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-[#1C201C]">Listing Traffic & Lead Conversion</h2>
              <p className="text-xs text-[#6E6D66]">Track weekly client impressions, site visit appointments, and portfolio depth</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <BarChart3 size={14} className="text-emerald-600" />
              <span>Live Agent Telemetry</span>
            </div>
          </div>

          {/* Weekly Traffic Wave Chart */}
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
            <AreaTrendChart
              data={weeklyViewsData}
              title="Weekly Inquiries & Physical Site Visits (Last 7 Days)"
              subtitle="Comparing inquiries received against confirmed site visit inspections scheduled on your listings"
              metric1Name="Buyer Inquiries"
              metric1Key="inquiries"
              metric2Name="Site Visits Scheduled"
              metric2Key="visits"
            />
          </div>

          {/* Dual Charts: Locality Valuation & Source Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
              <BarMetricChart
                data={localityValuationData}
                title="My Listings by Locality Valuation"
                subtitle="Asset value distributed across prime residential clusters"
              />
            </div>
            <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
              <DonutDistributionChart
                data={inquirySourceData}
                title="Client Inquiry Acquisition Channels"
                subtitle="Where your prospective property buyers are finding your listings"
                centerLabel="My Portfolio"
                centerValue="₹143 Cr"
              />
            </div>
          </div>
        </div>

        {/* Dual Section: My Recent Properties & Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Recent Properties */}
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">My Properties Catalogue</h3>
                  <p className="text-xs text-[#6E6D66]">Listings managed under your agent profile</p>
                </div>
                <Link
                  to="/admin/properties"
                  className="text-xs text-[#B49A70] hover:text-[#1C201C] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View All ({myProperties.length})</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="divide-y divide-[#EAE6DE] border border-[#EAE6DE] rounded-xl overflow-hidden">
                {myProperties.slice(0, 3).map((prop) => (
                  <div key={prop.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                        alt={prop.title}
                        className="w-12 h-12 object-cover rounded-lg border border-[#DDD8CE] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#1C201C] truncate">{prop.title}</p>
                        <p className="text-[11px] text-[#6E6D66]">{prop.price} • {prop.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!prop.verified || prop.status === 'pending' ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          In Review
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Live
                        </span>
                      )}

                      <Link
                        to={`/properties`}
                        className="p-1.5 text-[#8A887F] hover:text-[#1C201C] transition-colors"
                        title="Inspect property"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/properties"
                className="w-full py-3 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <PlusCircle size={15} />
                <span>Submit New Property Listing</span>
              </Link>
            </div>
          </div>

          {/* Inquiries On My Properties */}
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">Buyer Leads on Your Properties</h3>
                  <p className="text-xs text-[#6E6D66]">Direct client inquiries routed to you</p>
                </div>
                <Link to="/leads" className="text-xs text-[#B49A70] hover:underline font-semibold">
                  Manage Inquiries ({myLeads.length})
                </Link>
              </div>

              <div className="space-y-3">
                {myLeads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-xs hover:border-[#DDD8CE] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#1C201C]">{lead.buyerName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1C201C] text-white">
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#B49A70] font-medium">{lead.propertyTitle}</p>
                    <p className="text-[11px] text-[#6E6D66] line-clamp-1 mt-1 font-light italic">"{lead.message}"</p>
                    <div className="mt-2.5 pt-2 border-t border-[#EAE6DE] flex items-center justify-between text-[10px] text-[#8A887F]">
                      <span>{lead.buyerPhone} • {lead.buyerEmail}</span>
                      <span>{lead.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/leads"
                className="w-full py-3 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#1C201C] border border-[#E8E3D8] text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Open Lead Management Desk</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
