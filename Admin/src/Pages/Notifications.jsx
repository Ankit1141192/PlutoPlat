import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  ShieldCheck,
  Building2
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';

const Notifications = () => {
  const notificationsList = [
    {
      id: 1,
      type: 'approval',
      title: 'Property Listing Approved by SuperAdmin',
      message: 'Your listing "The Sapphire Estate" has been verified and published to the public portal.',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'lead',
      title: 'New VIP Buyer Inquiry Received',
      message: 'Vikramaditya Singhania requested a confidential prospectus on "Villa Bellissima".',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'system',
      title: 'SuperAdmin Policy Notice',
      message: 'Quarterly compliance update: Ensure all new land parcels include digital survey coordinates.',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 4,
      type: 'approval',
      title: 'Listing Under Moderation',
      message: 'Your newly submitted listing "Skyline Terrace Penthouse" is queued for SuperAdmin review.',
      time: '2 days ago',
      read: true,
    },
  ];

  return (
    <AdminLayout title="Agent Notifications & Alerts">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-serif text-lg text-[#1C201C]">Platform Dispatch & Moderation Alerts</h2>
          <p className="text-xs text-[#6E6D66]">
            Real-time notifications regarding listing approvals, buyer inquiries, and policy directives.
          </p>
        </div>

        <div className="bg-white border border-[#DDD8CE] rounded-sm divide-y divide-[#EAE6DE] shadow-2xs overflow-hidden">
          {notificationsList.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-start gap-3.5 transition-colors ${
                !item.read ? 'bg-[#F8F6F2]' : 'hover:bg-[#F8F6F2]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'approval'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.type === 'lead'
                    ? 'bg-[#B49A70]/20 text-[#B49A70]'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.type === 'approval' ? (
                  <CheckCircle2 size={16} />
                ) : item.type === 'lead' ? (
                  <Inbox size={16} />
                ) : (
                  <Bell size={16} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#1C201C]">{item.title}</p>
                  <span className="text-[10px] text-[#8E8B82]">{item.time}</span>
                </div>
                <p className="text-xs text-[#6E6D66] mt-0.5">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
