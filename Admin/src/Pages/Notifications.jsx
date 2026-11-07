import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  ShieldCheck,
  Building2,
  Sparkles
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
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Platform Dispatch & Moderation Alerts</h2>
          <p className="text-xs text-[#6E6D66] mt-0.5">
            Real-time notifications regarding listing approvals, buyer inquiries, and policy directives.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3D8] rounded-2xl divide-y divide-[#EAE6DE] shadow-sm overflow-hidden">
          {notificationsList.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex items-start gap-4 transition-colors ${
                !item.read ? 'bg-[#FAF8F5]' : 'hover:bg-[#FAF8F5]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'approval'
                    ? 'bg-emerald-50 text-emerald-700'
                    : item.type === 'lead'
                    ? 'bg-[#B49A70]/15 text-[#B49A70]'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {item.type === 'approval' ? (
                  <CheckCircle2 size={17} />
                ) : item.type === 'lead' ? (
                  <Inbox size={17} />
                ) : (
                  <Bell size={17} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1C201C] font-serif">{item.title}</p>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#B49A70]" title="Unread" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#8A887F]">{item.time}</span>
                </div>
                <p className="text-xs text-[#6E6D66] mt-1 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
