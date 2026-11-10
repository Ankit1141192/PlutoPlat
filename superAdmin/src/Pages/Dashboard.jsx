import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Inbox, Users, ShieldCheck, CheckCircle2, XCircle, ExternalLink, ArrowRight } from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { useSuperAdminStore } from '../context/SuperAdminContext';
import AreaTrendChart from '../Components/Charts/AreaTrendChart';
import BarMetricChart from '../Components/Charts/BarMetricChart';
import DonutDistributionChart from '../Components/Charts/DonutDistributionChart';
import { Band, GoldButton, GhostButton, StatStrip, Panel, Pill, EmptyState, LeadCard, PropertyRow } from '../Components/DashboardUI';

const linkCls = 'inline-flex items-center gap-1 text-sm font-semibold text-[#7D6741] hover:text-[#1C201C]';

const Dashboard = () => {
  const { properties, leads, usersList, auditLogs, approveProperty, rejectProperty } = useSuperAdminStore();

  const pending = properties.filter((p) => !p.verified || p.status === 'pending');
  const approved = properties.filter((p) => p.verified && p.status !== 'rejected');
  const newLeads = leads.filter((l) => l.status === 'New');
  const agents = usersList.filter((u) => u.role === 'admin').length;

  return (
    <SuperAdminLayout title="Platform Overview & Governance">
      <div className="space-y-8">
        <Band
          title={pending.length > 0 ? `${pending.length} ${pending.length === 1 ? 'listing needs' : 'listings need'} your review` : 'The approval queue is clear'}
          text={
            pending.length > 0
              ? 'Agents and sellers are waiting. Approved listings are published to the public catalogue right away.'
              : 'Every submission has been reviewed. New listings will appear here as agents submit them.'
          }
          actions={
            <>
              <GoldButton as="a" href="#queue">Review queue</GoldButton>
              <GhostButton as={Link} to="/audits">Audit ledger <ArrowRight size={15} /></GhostButton>
            </>
          }
          aside={
            <>
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> All systems running
              </div>
              <div className="mt-3 font-serif text-3xl">{auditLogs.length}</div>
              <div className="text-sm text-white/70">events in the audit log</div>
            </>
          }
        />

        <StatStrip
          items={[
            { label: 'Properties', icon: Building2, value: properties.length, note: `${approved.length} live · ${pending.length} pending`, noteTone: pending.length ? 'text-[#7D6741]' : 'text-emerald-700' },
            { label: 'Inquiries', icon: Inbox, value: leads.length, note: `${newLeads.length} new · 68.4% qualified` },
            { label: 'Users', icon: Users, value: usersList.length, note: `${agents} agents` },
            { label: 'Security', icon: ShieldCheck, value: auditLogs.length, note: 'Locks after 5 failed sign-ins', noteTone: 'text-emerald-700' }
          ]}
        />

        {/* Actionable work first */}
        <Panel
          id="queue"
          title="Approval queue"
          subtitle="Listings submitted by agents and sellers, waiting to be published"
          action={<Link to="/properties" className={linkCls}>All properties <ArrowRight size={14} /></Link>}
        >
          {pending.length === 0 ? (
            <EmptyState title="Nothing to review" text="All submissions have been verified." />
          ) : (
            <ul className="divide-y divide-[#EAE6DE]">
              {pending.slice(0, 4).map((prop) => (
                <PropertyRow
                  key={prop.id}
                  prop={{ ...prop, location: `${prop.location} · by ${prop.ownerName || 'Unknown seller'}` }}
                  right={
                    <>
                      <button
                        onClick={() => approveProperty(prop.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                      >
                        <CheckCircle2 size={15} /> Approve
                      </button>
                      <button
                        onClick={() => rejectProperty(prop.id, 'Documentation incomplete')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        <XCircle size={15} /> Reject
                      </button>
                      <Link to="/properties" title="Open listing" className="rounded-xl border border-[#DDD8CE] p-2 text-[#8A887F] hover:text-[#1C201C]">
                        <ExternalLink size={15} />
                      </Link>
                    </>
                  }
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Inquiries and site visits, Jan to Nov 2026"
          subtitle="Buyer interest compared with completed in-person visits"
          action={<Pill tone="green">Updated live</Pill>}
        >
          <AreaTrendChart title="" subtitle="" metric1Name="Client inquiries" metric1Key="inquiries" metric2Name="Site visits completed" metric2Key="visits" />
        </Panel>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Portfolio value by city" subtitle="Assets managed across major Indian markets">
            <BarMetricChart title="" subtitle="" />
          </Panel>
          <Panel title="Live inventory by category" subtitle="Verified properties only">
            <DonutDistributionChart title="" subtitle="" centerLabel="Total value" centerValue="₹335 Cr" />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title="Latest inquiries"
            subtitle="Across all agents"
            action={<Link to="/leads" className={linkCls}>View all ({leads.length}) <ArrowRight size={14} /></Link>}
          >
            {leads.length === 0 ? (
              <EmptyState title="No inquiries yet" text="Buyer messages will appear here." />
            ) : (
              <ul className="space-y-3">{leads.slice(0, 3).map((l) => <LeadCard key={l.id} lead={l} />)}</ul>
            )}
          </Panel>

          <Panel
            title="Recent activity"
            subtitle="Latest events in the audit ledger"
            action={<Link to="/audits" className={linkCls}>Full ledger ({auditLogs.length}) <ArrowRight size={14} /></Link>}
          >
            <ul className="divide-y divide-[#EAE6DE]">
              {auditLogs.slice(0, 4).map((log) => (
                <li key={log.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1C201C]">{log.action}</span>
                    <Pill tone={log.status === 'SUCCESS' ? 'green' : 'red'}>{log.status === 'SUCCESS' ? 'Success' : 'Failed'}</Pill>
                  </div>
                  <p className="mt-1 text-sm text-[#6E6D66]">{log.description}</p>
                  <p className="mt-1 text-xs text-[#8A887F]">{log.actorName} ({log.actorRole}) · {log.module} · {log.timestamp}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Dashboard;