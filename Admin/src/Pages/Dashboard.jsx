import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Inbox, Eye, ShieldCheck, PlusCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { useAdminStore } from '../context/AdminContext';
import AreaTrendChart from '../Components/Charts/AreaTrendChart';
import BarMetricChart from '../Components/Charts/BarMetricChart';
import DonutDistributionChart from '../Components/Charts/DonutDistributionChart';
import { Band, GoldButton, GhostButton, StatStrip, Panel, Pill, EmptyState, LeadCard, PropertyRow } from '../Components/DashboardUI.jsx';

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
  { label: 'Direct web portal', percentage: 54, count: 18, color: '#B49A70' },
  { label: 'Mobile app users', percentage: 28, count: 9, color: '#287A50' },
  { label: 'Client referral', percentage: 18, count: 6, color: '#1C201C' }
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const Dashboard = () => {
  const { user, properties, leads } = useAdminStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const matchedProperties = properties.filter(
    (p) => p.ownerEmail === user?.email || p.ownerName === user?.name || isAdmin
  );
  const myProperties = matchedProperties.length > 0 ? matchedProperties : properties;
  const pending = myProperties.filter((p) => !p.verified || p.status === 'pending');
  const approved = myProperties.filter((p) => p.verified && p.status !== 'rejected');

  const matchedLeads = leads.filter(
    (l) => l.agentEmail === user?.email || l.agentName === user?.name || isAdmin
  );
  const myLeads = matchedLeads.length > 0 ? matchedLeads : leads;
  const newLeads = myLeads.filter((l) => l.status === 'New');

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <AdminLayout title="Agent & Broker Operations Desk">
      <div className="space-y-8">
        <Band
          title={`${greeting()}, ${firstName}`}
          text={
            pending.length > 0
              ? `${pending.length} of your listings are waiting for SuperAdmin approval. They go live on the public site as soon as they are approved.`
              : 'All your listings are live. New submissions are reviewed by the SuperAdmin team before they appear publicly.'
          }
          actions={
            <>
              <GoldButton as={Link} to="/properties">
                <PlusCircle size={16} /> Add a property
              </GoldButton>
              <GhostButton as={Link} to="/leads">
                Open inquiries <ArrowRight size={15} />
              </GhostButton>
            </>
          }
          aside={
            <>
              <div className="font-serif text-4xl">{newLeads.length}</div>
              <div className="mt-1 text-sm text-white/70">unread buyer inquiries</div>
              <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/50">Reply target: within 2 hours</div>
            </>
          }
        />

        <StatStrip
          items={[
            { label: 'My portfolio', icon: Building2, value: myProperties.length, note: `${approved.length} live · ${pending.length} in review`, noteTone: pending.length ? 'text-[#7D6741]' : 'text-emerald-700' },
            { label: 'Buyer inquiries', icon: Inbox, value: myLeads.length, note: `${newLeads.length} unread` , noteTone: newLeads.length ? 'text-[#7D6741]' : 'text-emerald-700' },
            { label: 'Listing views', icon: Eye, value: '14,820', note: '+18.4% vs last month', noteTone: 'text-emerald-700' },
            { label: 'Partner status', icon: ShieldCheck, value: 'Pro', note: 'RERA ID UP-RERA-2026-981' }
          ]}
        />

        <Panel
          title="Inquiries and site visits this week"
          subtitle="Buyer inquiries compared with confirmed site visits on your listings"
          action={<Pill tone="green">Updated live</Pill>}
        >
          <AreaTrendChart
            data={weeklyViewsData}
            title=""
            subtitle=""
            metric1Name="Buyer inquiries"
            metric1Key="inquiries"
            metric2Name="Site visits scheduled"
            metric2Key="visits"
          />
        </Panel>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Listing value by locality" subtitle="Where your portfolio value sits">
            <BarMetricChart data={localityValuationData} title="" subtitle="" />
          </Panel>
          <Panel title="Where buyers find you" subtitle="Inquiry sources, last 30 days">
            <DonutDistributionChart
              data={inquirySourceData}
              title=""
              subtitle=""
              centerLabel="Portfolio"
              centerValue="₹143 Cr"
            />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title="My properties"
            subtitle="Latest listings under your profile"
            action={
              <Link to="/admin/properties" className="inline-flex items-center gap-1 text-sm font-semibold text-[#7D6741] hover:text-[#1C201C]">
                View all ({myProperties.length}) <ArrowRight size={14} />
              </Link>
            }
          >
            {myProperties.length === 0 ? (
              <EmptyState title="No listings yet" text="Add your first property to start receiving inquiries." />
            ) : (
              <ul className="divide-y divide-[#EAE6DE]">
                {myProperties.slice(0, 3).map((prop) => (
                  <PropertyRow
                    key={prop.id}
                    prop={prop}
                    right={
                      !prop.verified || prop.status === 'pending' ? (
                        <Pill tone="amber"><Clock size={12} /> In review</Pill>
                      ) : (
                        <Pill tone="green"><CheckCircle2 size={12} /> Live</Pill>
                      )
                    }
                  />
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Latest buyer inquiries"
            subtitle="Sent directly to you"
            action={
              <Link to="/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-[#7D6741] hover:text-[#1C201C]">
                Manage ({myLeads.length}) <ArrowRight size={14} />
              </Link>
            }
          >
            {myLeads.length === 0 ? (
              <EmptyState title="No inquiries yet" text="Buyer messages about your listings will show up here." />
            ) : (
              <ul className="space-y-3">
                {myLeads.slice(0, 3).map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;