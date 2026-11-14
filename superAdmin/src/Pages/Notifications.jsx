import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Inbox,
  Trash2,
  CheckCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import SuperAdminLayout from '../Components/SuperAdminLayout';
import { SuperAdminApi } from '../services/Api';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const NotificationsPage = () => {
  const { showToast, notifications: storeNotifications } = useSuperAdminStore();

  // Dispatch Form State
  const [recipientRole, setRecipientRole] = useState('both'); // 'user' | 'admin' | 'both'
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Platform Broadcast');
  const [type, setType] = useState('system');
  const [link, setLink] = useState('/properties');
  const [sending, setSending] = useState(false);

  // Live notifications feed
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await SuperAdminApi.getNotifications();
      if (res?.data?.notifications) {
        setNotificationsList(res.data.notifications);
      } else {
        setNotificationsList([]);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
      setNotificationsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Sync when new socket notification arrives
  useEffect(() => {
    if (storeNotifications) {
      setNotificationsList(storeNotifications);
    }
  }, [storeNotifications]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please provide both title and message.', 'error');
      return;
    }

    try {
      setSending(true);
      const payload = {
        title: title.trim(),
        message: message.trim(),
        recipientRole,
        category,
        type,
        link: link.trim(),
      };

      const res = await SuperAdminApi.broadcastNotification(payload);
      if (res?.success) {
        showToast(
          `Notification dispatched to [${
            recipientRole === 'both' ? 'Both Panels (Users & Admins)' : recipientRole === 'user' ? 'User Panel' : 'Admin Panel'
          }] and saved in database!`,
          'success'
        );
        // Prepend created notification to local list
        if (res.data?.notification) {
          const newNotif = res.data.notification;
          setNotificationsList((prev) => [
            newNotif,
            ...prev.filter((n) => (n._id || n.id) !== (newNotif._id || newNotif.id))
          ]);
        }
        // Reset form
        setTitle('');
        setMessage('');
        setLink('/properties');
      }
    } catch (err) {
      showToast(err.message || 'Failed to dispatch notification.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await SuperAdminApi.markAllNotificationsRead();
      setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true, isUnread: false })));
      showToast('All notifications marked as read.', 'success');
    } catch (err) {
      showToast('Failed to mark all as read.', 'error');
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await SuperAdminApi.markNotificationRead(id);
      setNotificationsList((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true, isUnread: false } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await SuperAdminApi.request
        ? await SuperAdminApi.request('DELETE', `/notifications/${id}`, { auth: true })
        : null;
      setNotificationsList((prev) => prev.filter((n) => n._id !== id && n.id !== id));
      showToast('Notification removed.', 'info');
    } catch (err) {
      setNotificationsList((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    }
  };

  const getRecipientBadge = (role) => {
    switch (role) {
      case 'user':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <Users size={11} /> Buyer / User Panel
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
            <Shield size={11} /> Agent / Admin Panel
          </span>
        );
      case 'both':
      case 'all':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#B49A70]/20 text-[#E8D9BF] border border-[#B49A70]/30">
            <Sparkles size={11} /> Both Panels (User & Admin)
          </span>
        );
    }
  };

  const unreadCount = notificationsList.filter((n) => !n.read && n.isUnread !== false).length;

  return (
    <SuperAdminLayout title="Notifications & Broadcast Center">
      <div className="space-y-8">
        {/* Header Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide">
              Real-Time Notification Dispatcher
            </h1>
            <p className="text-sm text-[#A8A59B] mt-1 font-light">
              Broadcast high-priority alerts directly to User showroom, Admin agent desk, or both panels.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#B49A70]/40 text-[#E8D9BF] hover:bg-[#B49A70]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCheck size={14} /> Mark All Read
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left Dispatch Form, Right Realtime Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dispatch Control Form */}
          <div className="lg:col-span-5 bg-[#171B17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#B49A70]/20 flex items-center justify-center text-[#B49A70]">
                <Send size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Dispatch New Broadcast</h3>
                <p className="text-xs text-[#8E8B82]">Instant platform notification delivery</p>
              </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-5">
              {/* Target Panel Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#C9C5BB] uppercase tracking-wider mb-2.5">
                  Select Target Panel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientRole('user')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      recipientRole === 'user'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10'
                        : 'border-white/10 bg-white/5 text-[#A8A59B] hover:bg-white/10'
                    }`}
                  >
                    <Users size={16} className={recipientRole === 'user' ? 'text-emerald-400 mb-1' : 'mb-1'} />
                    <span>User Panel</span>
                    <span className="text-[10px] font-normal opacity-70">Buyers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientRole('admin')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      recipientRole === 'admin'
                        ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                        : 'border-white/10 bg-white/5 text-[#A8A59B] hover:bg-white/10'
                    }`}
                  >
                    <Shield size={16} className={recipientRole === 'admin' ? 'text-blue-400 mb-1' : 'mb-1'} />
                    <span>Admin Panel</span>
                    <span className="text-[10px] font-normal opacity-70">Agents</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientRole('both')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      recipientRole === 'both'
                        ? 'border-[#B49A70] bg-[#B49A70]/20 text-[#E8D9BF] shadow-lg shadow-[#B49A70]/10'
                        : 'border-white/10 bg-white/5 text-[#A8A59B] hover:bg-white/10'
                    }`}
                  >
                    <Sparkles size={16} className={recipientRole === 'both' ? 'text-[#B49A70] mb-1' : 'mb-1'} />
                    <span>Both Panels</span>
                    <span className="text-[10px] font-normal opacity-70">Universal</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#C9C5BB] uppercase tracking-wider mb-2">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exclusive Off-Market Estate Released"
                  required
                  className="w-full bg-[#121612] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B49A70] transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#C9C5BB] uppercase tracking-wider mb-2">
                  Notification Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the message body to be broadcast across the selected platform audience..."
                  required
                  className="w-full bg-[#121612] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#B49A70] transition-colors resize-none"
                />
              </div>

              {/* Category & Type in 2 cols */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C9C5BB] uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121612] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B49A70]"
                  >
                    <option value="Platform Broadcast">Platform Broadcast</option>
                    <option value="Off-Market">Off-Market Opportunity</option>
                    <option value="Listing Updates">Listing Updates</option>
                    <option value="Security Alerts">Security Alerts</option>
                    <option value="Market Intelligence">Market Intelligence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C9C5BB] uppercase tracking-wider mb-2">
                    Alert Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#121612] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B49A70]"
                  >
                    <option value="system">System Advisory</option>
                    <option value="property">Property Release</option>
                    <option value="approval">Moderation Notice</option>
                    <option value="lead">VIP Buyer Action</option>
                  </select>
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-xs font-semibold text-[#C9C5BB] uppercase tracking-wider mb-2">
                  Destination Link
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/properties or /deal-process"
                  className="w-full bg-[#121612] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#B49A70]"
                />
              </div>

              {/* Dispatch Action */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B49A70] to-[#8E7448] text-[#121612] font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B49A70]/20 disabled:opacity-50 cursor-pointer"
              >
                <Send size={16} />
                {sending ? 'Broadcasting live notification...' : 'Dispatch Live Notification'}
              </button>
            </form>
          </div>

          {/* Realtime Stream & Sent Log */}
          <div className="lg:col-span-7 bg-[#171B17] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#E8D9BF]">
                  <Inbox size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Notification Feed & Ledger</h3>
                  <p className="text-xs text-[#8E8B82]">{notificationsList.length} total messages tracked</p>
                </div>
              </div>

              {unreadCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#B49A70] text-[#121612]">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-[#8E8B82]">
                Loading live notification ledger...
              </div>
            ) : notificationsList.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Bell size={32} className="mx-auto text-white/20" />
                <p className="text-sm text-[#8E8B82]">No notifications have been broadcast yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2">
                {notificationsList.map((item) => {
                  const id = item._id || item.id;
                  const isUnread = !item.read && item.isUnread !== false;

                  return (
                    <div
                      key={id}
                      className={`p-4 rounded-xl border transition-all ${
                        isUnread
                          ? 'bg-[#1C201C] border-[#B49A70]/40 shadow-sm'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {getRecipientBadge(item.recipientRole)}
                          <span className="text-[11px] text-[#8E8B82] flex items-center gap-1">
                            <Clock size={11} />
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Live'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isUnread && (
                            <button
                              onClick={() => handleMarkSingleRead(id)}
                              title="Mark as read"
                              className="p-1 rounded text-[#8E8B82] hover:text-emerald-400 hover:bg-white/5"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(id)}
                            title="Delete"
                            className="p-1 rounded text-[#8E8B82] hover:text-red-400 hover:bg-white/5"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-[#C9C5BB] font-light leading-relaxed mb-3">
                        {item.message || item.description}
                      </p>

                      {item.link && (
                        <div className="flex items-center gap-1 text-[11px] text-[#B49A70] hover:underline font-medium">
                          <span>Target: {item.link}</span>
                          <ExternalLink size={11} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default NotificationsPage;
