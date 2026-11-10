import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, CheckCheck, Trash2, ArrowRight, Sparkles, 
  ShieldAlert, Calendar, DollarSign, ExternalLink, Loader2
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Off-Market',
    badge: 'EXCLUSIVE OFF-MARKET',
    title: 'Confidential Trophy Estate Available for Private Review',
    timestamp: 'Just now',
    isUnread: true,
    description: 'A 14,000 sq.ft modern architectural estate has entered discrete pre-market representation. Available exclusively to Sovereign Tier members.',
    actionLabel: 'Review Private Briefing',
    actionLink: '/properties'
  },
  {
    id: 'notif-2',
    category: 'Itineraries',
    badge: 'VIEWING CONFIRMED',
    title: 'Chauffeured Site Visit Scheduled for The Imperial Villa',
    timestamp: '2 hours ago',
    isUnread: true,
    description: 'Your scheduled private viewing has been logged with our senior concierge advisor. Direct agent coordination active.',
    actionLabel: 'Open Viewing Itinerary',
    actionLink: '/my-enquiries'
  },
  {
    id: 'notif-3',
    category: 'Market Intelligence',
    badge: 'VALUATION REVISION',
    title: 'Prime Civil Lines Luxury Penthouse Adjusted',
    timestamp: 'Yesterday',
    isUnread: false,
    description: 'Strategic valuation revision recorded to facilitate autumn escrow settlement before year-end.',
    actionLabel: 'Inspect Revised Pricing',
    actionLink: '/properties'
  },
  {
    id: 'notif-4',
    category: 'Security Alerts',
    badge: 'COMPLIANCE AUDIT',
    title: 'Fiduciary Non-Disclosure Agreement Renewed',
    timestamp: '3 days ago',
    isUnread: false,
    description: 'Your fiduciary NDA with PlutoPlat International Real Estate Inc. has been automatically renewed with 256-bit encryption safeguards.',
    actionLabel: 'View Profile Security',
    actionLink: '/profile'
  }
];

const Notifications = () => {
  const { showToast, user } = usePropertyStore();

  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        setLoading(true);
        const res = await Api.getNotifications();
        if (res?.data?.notifications && res.data.notifications.length > 0) {
          const mapped = res.data.notifications.map((n) => ({
            id: n._id || n.id,
            category: n.category || 'Off-Market',
            badge: (n.category || n.type || 'ADVISORY').toUpperCase(),
            title: n.title,
            timestamp: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
            isUnread: n.isUnread !== undefined ? n.isUnread : !n.read,
            description: n.description || n.message,
            actionLabel: n.actionLabel || 'View Details',
            actionLink: n.link || '/properties'
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        // Fallback to local intelligence stream
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await Api.markAllNotificationsRead();
    } catch (e) {}
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    showToast('All intelligence briefings marked as read.', 'success');
  };

  const handleDeleteNotification = async (id) => {
    try {
      await Api.deleteNotification(id);
    } catch (e) {}
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Briefing archived from your stream.', 'info');
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
              <Bell size={14} />
              <span>Intelligence Stream</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal">
              Private Executive Briefings
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 font-light">
              You have <strong className="text-[#1C201C] font-semibold">{unreadCount} unread</strong> priority dispatches requiring review.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 bg-white border border-[#DDD8CE] text-[#1C201C] hover:bg-[#F8F6F2] text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CheckCheck size={14} className="text-[#287A50]" />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['All', 'Off-Market', 'Itineraries', 'Market Intelligence', 'Security Alerts'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === cat
                  ? 'bg-[#1C201C] text-white shadow-2xs'
                  : 'bg-white text-[#6E6D66] border border-[#DDD8CE] hover:text-[#1C201C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#DDD8CE] p-12 text-center rounded-sm">
            <Bell size={28} className="text-[#DDD8CE] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#1C201C] mb-1">No Active Briefings</h3>
            <p className="text-xs text-[#6E6D66] font-light">You are fully caught up across this intelligence stream.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`p-6 bg-white border rounded-sm transition-all shadow-2xs ${
                  n.isUnread ? 'border-[#B49A70] bg-[#FFFDF9]' : 'border-[#DDD8CE]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-xs bg-[#1C201C] text-[#E8D9BF]">
                      {n.badge}
                    </span>
                    {n.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#B49A70] animate-pulse" />
                    )}
                    <span className="text-xs text-[#8E8B82]">{n.timestamp}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="text-[#999] hover:text-[#C74747] transition-colors p-1"
                    title="Archive Briefing"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <h3 className="font-serif text-xl text-[#1C201C] font-normal mb-2 leading-snug">
                  {n.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#555] font-light leading-relaxed mb-4">
                  {n.description}
                </p>

                <div className="pt-3 border-t border-[#F0ECE2] flex justify-end">
                  <Link
                    to={n.actionLink}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#B49A70] hover:text-[#1C201C] transition-colors"
                  >
                    <span>{n.actionLabel}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
