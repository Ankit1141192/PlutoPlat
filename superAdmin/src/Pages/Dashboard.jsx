import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Inbox,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Sparkles,
  BarChart3
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';
import AreaTrendChart from '../Components/Charts/AreaTrendChart';
import BarMetricChart from '../Components/Charts/BarMetricChart';
import DonutDistributionChart from '../Components/Charts/DonutDistributionChart';

const Dashboard = () => {
  const { properties, leads, usersList, auditLogs, approveProperty, rejectProperty } = useSuperAdminStore();

  const pendingProperties = properties.filter(p => !p.verified || p.status === 'pending');
  const approvedProperties = properties.filter(p => p.verified && p.status !== 'rejected');
  const newLeads = leads.filter(l => l.status === 'New');

  return (
    <SuperAdminLayout title="Platform Overview & Governance">
      <div className="space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Properties Card */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Properties Catalog
              </span>
              <div className="w-8 h-8 rounded-full bg-[#B49A70]/15 text-[#B49A70] flex items-center justify-center">
                <Building2 size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{properties.length}</span>
              <span className="text-xs text-[#287A50] font-semibold flex items-center gap-0.5">
                <TrendingUp size={12} /> {approvedProperties.length} active
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>Pending Moderation:</span>
              <strong className={pendingProperties.length > 0 ? 'text-[#B49A70]' : 'text-emerald-700'}>
                {pendingProperties.length} listings
              </strong>
            </div>
          </div>

          {/* Leads Card */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Platform Inquiries
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Inbox size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{leads.length}</span>
              <span className="text-xs text-emerald-700 font-semibold">
                {newLeads.length} new
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>Conversion Rate:</span>
              <strong className="text-[#1C201C]">68.4% Qualified</strong>
            </div>
          </div>

          {/* Registered Users */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Users & Agents
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{usersList.length}</span>
              <span className="text-xs text-[#6E6D66]">
                {usersList.filter(u => u.role === 'admin').length} Agents
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>Active State:</span>
              <strong className="text-emerald-700">100% Operational</strong>
            </div>
          </div>

          {/* Security & Audit Pulse */}
          <div className="bg-white p-5 border border-[#DDD8CE] rounded-sm shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6D66]">
                Security Audit
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{auditLogs.length}</span>
              <span className="text-xs text-[#287A50] font-semibold">Events Logged</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-[11px] text-[#6E6D66]">
              <span>Lockout Protection:</span>
              <strong className="text-emerald-700">5-Attempt Active</strong>
            </div>
          </div>
        </div>

        {/* Analytics & Performance Charts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-[#1C201C]">Platform Analytics & Market Intelligence</h2>
              <p className="text-xs text-[#6E6D66]">Interactive inquiry volume trends, portfolio valuations, and segment distribution</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#287A50] font-medium bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
              <BarChart3 size={13} />
              <span>Real-Time Charts Active</span>
            </div>
          </div>

          {/* Main Area Wave Chart */}
          <AreaTrendChart
            title="Monthly Inquiries & Site Visits (Jan - Nov 2026)"
            subtitle="Comparing prospective buyer interest against scheduled in-person physical inspections"
            metric1Name="Client Inquiries"
            metric1Key="inquiries"
            metric2Name="Site Visits Completed"
            metric2Key="visits"
          />

          {/* Dual Charts: Bar Chart & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarMetricChart
              title="City-Wise Portfolio Valuation"
              subtitle="Asset depth under platform management across major Indian real estate markets"
            />
            <DonutDistributionChart
              title="Inventory by Architectural Segment"
              subtitle="Breakdown of verified active properties by category"
              centerLabel="Total Valuation"
              centerValue="₹335 Cr"
            />
          </div>
        </div>

        {/* Pending Property Approvals Queue */}
        <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg text-[#1C201C]">
                  Property Moderation & Approvals Queue
                </h2>
                {pendingProperties.length > 0 && (
                  <span className="text-[10px] font-bold bg-[#B49A70] text-white px-2 py-0.5 rounded-full">
                    {pendingProperties.length} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6E6D66]">
                Review listings submitted by Sellers and Agents before publishing to the public catalogue.
              </p>
            </div>
            <Link
              to="/superadmin/properties"
              className="text-xs font-semibold text-[#B49A70] hover:text-[#1C201C] flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Manage All Properties</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {pendingProperties.length === 0 ? (
            <div className="py-8 text-center bg-[#F8F6F2] rounded-xs border border-dashed border-[#DDD8CE]">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-2" />
              <p className="text-xs font-semibold text-[#1C201C]">Queue is clear</p>
              <p className="text-[11px] text-[#6E6D66]">All agent and seller submissions have been reviewed and verified.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAE6DE] border border-[#EAE6DE] rounded-xs overflow-hidden">
              {pendingProperties.slice(0, 4).map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F8F6F2] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                      alt={prop.title}
                      className="w-16 h-14 object-cover rounded-2xs border border-[#DDD8CE] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1C201C] truncate">{prop.title}</span>
                        <span className="text-[10px] bg-[#B49A70]/15 text-[#B49A70] px-1.5 py-0.5 rounded-2xs font-bold uppercase">
                          {prop.type || 'Villa'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E6D66] truncate">{prop.location} • {prop.price}</p>
                      <p className="text-[10px] text-[#8E8B82]">
                        Submitted by: <strong className="text-[#1C201C]">{prop.ownerName || 'Michael Sharma'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveProperty(prop.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-[#287A50] hover:bg-emerald-800 text-white rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => rejectProperty(prop.id, 'Documentation incomplete')}
                      className="px-3 py-1.5 text-xs font-semibold border border-red-300 text-red-700 hover:bg-red-50 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                    <Link
                      to={`/property/${prop.id}`}
                      target="_blank"
                      className="p-1.5 text-[#6E6D66] hover:text-[#1C201C] border border-[#DDD8CE] rounded-xs"
                      title="Preview Listing"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dual Grid: Recent Inquiries & Security Audits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries Stream */}
          <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base text-[#1C201C]">Central Inquiries & Leads</h3>
                <p className="text-[11px] text-[#6E6D66]">Cross-platform buyer communications</p>
              </div>
              <Link to="/leads" className="text-xs text-[#B49A70] hover:underline font-semibold">
                View All ({leads.length})
              </Link>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 3).map((lead) => (
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

          {/* Security & Audit Trail */}
          <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base text-[#1C201C]">Recent Security & Audit Logs</h3>
                <p className="text-[11px] text-[#6E6D66]">Real-time system telemetry & actor events</p>
              </div>
              <Link to="/audits" className="text-xs text-[#B49A70] hover:underline font-semibold">
                Full Logs ({auditLogs.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2.5 bg-[#F8F6F2] border border-[#EAE6DE] rounded-xs text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#8E8B82]">{log.id}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-2xs bg-[#B49A70]/15 text-[#B49A70]">
                        {log.module}
                      </span>
                      <strong className="text-[11px] text-[#1C201C]">{log.action}</strong>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-2xs ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6D66] mt-1 font-light">{log.description}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#8E8B82]">
                    <span>Actor: <strong>{log.actorName}</strong> ({log.actorRole})</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Dashboard;
