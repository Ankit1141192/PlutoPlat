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
  BarChart3,
  Activity
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
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Properties Catalog
              </span>
              <div className="w-9 h-9 rounded-full bg-[#B49A70]/15 text-[#B49A70] flex items-center justify-center">
                <Building2 size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{properties.length}</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp size={11} /> {approvedProperties.length} active
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>Pending Review:</span>
              <strong className={pendingProperties.length > 0 ? 'text-[#B49A70]' : 'text-emerald-700'}>
                {pendingProperties.length} listings
              </strong>
            </div>
          </div>

          {/* Leads Card */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Platform Inquiries
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Inbox size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{leads.length}</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                {newLeads.length} new
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>Conversion Rate:</span>
              <strong className="text-[#1C201C]">68.4% Qualified</strong>
            </div>
          </div>

          {/* Registered Users */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Users & Agents
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{usersList.length}</span>
              <span className="text-xs text-[#6E6D66]">
                {usersList.filter(u => u.role === 'admin').length} Agents
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>System State:</span>
              <strong className="text-emerald-700">100% Operational</strong>
            </div>
          </div>

          {/* Security & Audit Pulse */}
          <div className="bg-white p-6 border border-[#E8E3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6D66]">
                Security Audit
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck size={17} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif text-[#1C201C]">{auditLogs.length}</span>
              <span className="text-xs text-[#287A50] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Events Logged</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs text-[#6E6D66]">
              <span>Lockout Protocol:</span>
              <strong className="text-emerald-700">5-Attempt Active</strong>
            </div>
          </div>
        </div>

        {/* Analytics & Performance Charts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl text-[#1C201C]">Platform Analytics & Market Intelligence</h2>
              <p className="text-xs text-[#6E6D66]">Inquiry volume trends, portfolio valuations, and segment distribution</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <BarChart3 size={14} className="text-emerald-600" />
              <span>Real-Time Charts Active</span>
            </div>
          </div>

          {/* Main Area Wave Chart */}
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
            <AreaTrendChart
              title="Monthly Inquiries & Site Visits (Jan - Nov 2026)"
              subtitle="Comparing prospective buyer interest against scheduled in-person physical inspections"
              metric1Name="Client Inquiries"
              metric1Key="inquiries"
              metric2Name="Site Visits Completed"
              metric2Key="visits"
            />
          </div>

          {/* Dual Charts: Bar Chart & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
              <BarMetricChart
                title="City-Wise Portfolio Valuation"
                subtitle="Asset depth under platform management across major Indian real estate markets"
              />
            </div>
            <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
              <DonutDistributionChart
                title="Inventory by Architectural Segment"
                subtitle="Breakdown of verified active properties by category"
                centerLabel="Total Valuation"
                centerValue="₹335 Cr"
              />
            </div>
          </div>
        </div>

        {/* Pending Property Approvals Queue */}
        <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl text-[#1C201C]">
                  Property Moderation & Approvals Queue
                </h2>
                {pendingProperties.length > 0 && (
                  <span className="text-[10px] font-bold bg-[#B49A70] text-[#121612] px-2.5 py-0.5 rounded-full">
                    {pendingProperties.length} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6E6D66] mt-0.5">
                Review listings submitted by Sellers and Agents before publishing to the public catalogue.
              </p>
            </div>
            <Link
              to="/properties"
              className="text-xs font-semibold text-[#B49A70] hover:text-[#1C201C] flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>Manage All Properties</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {pendingProperties.length === 0 ? (
            <div className="py-12 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#DDD8CE]">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-2" />
              <p className="font-serif text-base text-[#1C201C]">Moderation queue is clear</p>
              <p className="text-xs text-[#6E6D66] mt-0.5">All agent and seller submissions have been reviewed and verified.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAE6DE] border border-[#EAE6DE] rounded-xl overflow-hidden">
              {pendingProperties.slice(0, 4).map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                      alt={prop.title}
                      className="w-16 h-14 object-cover rounded-xl border border-[#DDD8CE] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1C201C] truncate font-serif">{prop.title}</span>
                        <span className="text-[10px] bg-[#B49A70]/15 text-[#B49A70] px-2 py-0.5 rounded-full font-bold uppercase">
                          {prop.type || 'Villa'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6D66] truncate mt-0.5">{prop.location} • {prop.price}</p>
                      <p className="text-[11px] text-[#8A887F]">
                        Submitted by: <strong className="text-[#1C201C]">{prop.ownerName || 'Michael Sharma'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveProperty(prop.id)}
                      className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => rejectProperty(prop.id, 'Documentation incomplete')}
                      className="px-3.5 py-2 text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                    <Link
                      to={`/properties`}
                      className="p-2 text-[#8A887F] hover:text-[#1C201C] border border-[#DDD8CE] rounded-xl transition-colors"
                      title="Inspect Listing"
                    >
                      <ExternalLink size={15} />
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
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">Central Inquiries & Leads</h3>
                  <p className="text-xs text-[#6E6D66]">Cross-platform prospective buyer inquiries</p>
                </div>
                <Link to="/leads" className="text-xs text-[#B49A70] hover:underline font-semibold">
                  View All ({leads.length})
                </Link>
              </div>

              <div className="space-y-3">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-xs hover:border-[#DDD8CE] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[#1C201C] font-serif">{lead.buyerName}</span>
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
                <span>Open Lead Management Center</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Security & Audit Trail */}
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1C201C]">Security & Audit Trail</h3>
                  <p className="text-xs text-[#6E6D66]">Real-time platform events & root ledger</p>
                </div>
                <Link to="/audits" className="text-xs text-[#B49A70] hover:underline font-semibold">
                  Full Ledger ({auditLogs.length})
                </Link>
              </div>

              <div className="space-y-2.5">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3 bg-[#FAF8F5] border border-[#EAE6DE] rounded-xl text-xs hover:border-[#DDD8CE] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#8A887F]">{log.id}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B49A70]/15 text-[#B49A70]">
                          {log.module}
                        </span>
                        <strong className="text-xs text-[#1C201C]">{log.action}</strong>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E6D66] mt-1 font-light">{log.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[#8A887F]">
                      <span>Actor: <strong className="text-[#1C201C]">{log.actorName}</strong> ({log.actorRole})</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/audits"
                className="w-full py-3 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>View Complete Audit Ledger</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Dashboard;
