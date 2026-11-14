import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  ShieldCheck,
  Building2,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import AdminLayout from '../Components/AdminLayout';
import { AdminApi } from '../services/Api';
import { useAdminStore } from '../context/AdminContext';

const Notifications = () => {
  const { showToast, notifications: storeNotifs } = useAdminStore();
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        setLoading(true);
        const res = await AdminApi.getNotifications();
        if (res?.data?.notifications) {
          const mapped = res.data.notifications.map((n) => ({
            id: n._id || n.id,
            type: n.type || 'lead',
            title: n.title,
            message: n.message || n.description,
            time: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
            read: n.read !== undefined ? n.read : !n.isUnread,
          }));
          setNotificationsList(mapped);
        } else {
          setNotificationsList([]);
        }
      } catch (err) {
        setNotificationsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, []);

  // Sync real-time notifications
  useEffect(() => {
    if (storeNotifs) {
      const mapped = storeNotifs.map((n) => ({
        id: n._id || n.id,
        type: n.type || 'lead',
        title: n.title,
        message: n.message || n.description,
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
        read: n.read !== undefined ? n.read : !n.isUnread,
      }));
      setNotificationsList(mapped);
    }
  }, [storeNotifs]);

  const handleMarkAllRead = async () => {
    try {
      await AdminApi.markAllNotificationsRead();
    } catch (e) {}
    setNotificationsList((prev) => prev.map((item) => ({ ...item, read: true })));
    showToast('All agent notifications marked as read.', 'success');
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await AdminApi.markNotificationRead(id);
    } catch (e) {}
    setNotificationsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  return (
    <AdminLayout title="Agent Notifications & Alerts">
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#1C201C] font-normal">Platform Dispatch & Moderation Alerts</h2>
            <p className="text-xs text-[#6E6D66] mt-0.5">
              Real-time notifications regarding listing approvals, buyer inquiries, and policy directives.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#1C201C] text-white text-xs font-semibold hover:bg-black transition-colors self-start cursor-pointer"
            >
              <CheckCheck size={14} className="text-[#B49A70]" />
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-14 text-center shadow-sm text-sm text-[#6E6D66]">
            Loading agent notifications...
          </div>
        ) : notificationsList.length === 0 ? (
          <div className="bg-white border border-[#E8E3D8] rounded-2xl p-14 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-3 text-[#B49A70]">
              <Bell size={22} />
            </div>
            <h3 className="font-serif text-lg text-[#1C201C] font-medium">No Notifications Yet</h3>
            <p className="text-xs text-[#6E6D66] mt-1 max-w-sm mx-auto">
              Real-time listing approvals, buyer inquiries, and SuperAdmin platform directives will appear here once dispatched.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E3D8] rounded-2xl divide-y divide-[#EAE6DE] shadow-sm overflow-hidden">
            {notificationsList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkSingleRead(item.id)}
                className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
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
        )}
      </div>
    </AdminLayout>
  );
};

export default Notifications;
