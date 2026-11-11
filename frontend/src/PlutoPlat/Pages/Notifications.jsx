import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, CheckCheck, Trash2, ArrowUpRight, Sparkles, ShieldCheck,
  CalendarCheck, TrendingUp, Loader2, RefreshCw, MapPin, Eye, RotateCcw
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';

/* ------------------------------------------------------------------ */
/* Switch to false when your backend is ready.                         */
/* ------------------------------------------------------------------ */
const USE_DUMMY = false;

const IMG = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const CATEGORY_META = {
  'Off-Market':          { icon: Sparkles,      label: 'Off-market' },
  'Itineraries':         { icon: CalendarCheck, label: 'Viewing' },
  'Market Intelligence': { icon: TrendingUp,    label: 'Market update' },
  'Security Alerts':     { icon: ShieldCheck,   label: 'Security' },
};
const TABS = ['All', ...Object.keys(CATEGORY_META)];
const GROUP_ORDER = ['Today', 'Yesterday', 'Earlier'];

const DUMMY_NOTIFICATIONS = [
  {
    id: 'd1', category: 'Off-Market', group: 'Today', timestamp: '10 min ago', isUnread: true,
    title: 'A private Civil Lines estate just opened for review',
    description: 'A 14,000 sq.ft modern residence with a courtyard pool and staff wing is being offered quietly before public listing. Available to Sovereign Tier members only.',
    location: 'Civil Lines, Kanpur', price: '₹ 18.50 Cr',
    image: IMG('photo-1613490493576-7fde63acd811'),
    actionLabel: 'Review private briefing', actionLink: '/properties',
  },
  {
    id: 'd2', category: 'Itineraries', group: 'Today', timestamp: '2 hours ago', isUnread: true,
    title: 'Your visit to The Imperial Villa is confirmed',
    description: 'Saturday, 11:00 AM. Your advisor Aarav Mehta will meet you at the gate. A chauffeur will pick you up from your address at 10:15 AM.',
    location: 'Swaroop Nagar, Kanpur', price: '₹ 9.20 Cr',
    image: IMG('photo-1600596542815-ffad4c1539a9'),
    actionLabel: 'Open itinerary', actionLink: '/my-enquiries',
  },
  {
    id: 'd3', category: 'Market Intelligence', group: 'Today', timestamp: '5 hours ago', isUnread: true,
    title: 'Price drop of ₹ 1.2 Cr on a saved penthouse',
    description: 'The Central Park Penthouse you saved now lists at a lower valuation, aimed at closing before year-end.',
    location: 'Civil Lines, Kanpur', price: '₹ 7.80 Cr',
    image: IMG('photo-1512917774080-9991f1c4c750'),
    actionLabel: 'See new price', actionLink: '/properties',
  },
  {
    id: 'd4', category: 'Off-Market', group: 'Yesterday', timestamp: 'Yesterday, 6:40 PM', isUnread: false,
    title: 'Riverside villa matches your search',
    description: 'A 4-bedroom villa near the Ganga bank matches your saved filters: 3,800 sq.ft, private garden, ready to move in.',
    location: 'VIP Road, Kanpur', price: '₹ 5.35 Cr',
    image: IMG('photo-1600607687939-ce8a6c25118c'),
    actionLabel: 'View property', actionLink: '/properties',
  },
  {
    id: 'd5', category: 'Itineraries', group: 'Yesterday', timestamp: 'Yesterday, 11:05 AM', isUnread: false,
    title: 'Advisor message: documents ready for signing',
    description: 'Your sale agreement draft is ready. Review the terms and reply to your advisor with any changes.',
    actionLabel: 'Open enquiry', actionLink: '/my-enquiries',
  },
  {
    id: 'd6', category: 'Security Alerts', group: 'Earlier', timestamp: '3 days ago', isUnread: false,
    title: 'Your NDA has been renewed',
    description: 'Your non-disclosure agreement with PlutoPlat International Real Estate Inc. renewed automatically and is protected with 256-bit encryption.',
    actionLabel: 'View security', actionLink: '/profile',
  },
  {
    id: 'd7', category: 'Market Intelligence', group: 'Earlier', timestamp: '5 days ago', isUnread: false,
    title: 'Kanpur luxury market: Q4 snapshot',
    description: 'Premium villa prices in Civil Lines and Swaroop Nagar rose 6.4% this quarter, with fewer listings than last year.',
    actionLabel: 'Read the snapshot', actionLink: '/properties',
  },
  {
    id: 'd8', category: 'Security Alerts', group: 'Earlier', timestamp: '6 days ago', isUnread: false,
    title: 'New sign-in from Lucknow',
    description: 'We noticed a sign-in to your account from a new device. If this was you, no action is needed.',
    actionLabel: 'Review activity', actionLink: '/profile',
  },
];

const groupFor = (d) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  return days < 1 ? 'Today' : days < 2 ? 'Yesterday' : 'Earlier';
};

const mapApiNotification = (n) => ({
  id: n._id || n.id,
  category: CATEGORY_META[n.category] ? n.category : 'Market Intelligence',
  group: n.createdAt ? groupFor(n.createdAt) : 'Earlier',
  timestamp: n.createdAt
    ? new Date(n.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recent',
  isUnread: n.isUnread ?? !n.read,
  title: n.title,
  description: n.description || n.message,
  location: n.location,
  price: n.price,
  image: n.image,
  actionLabel: n.actionLabel || 'View details',
  actionLink: n.link || '/properties',
});

/* ------------------------------ pieces ------------------------------ */

const ActionLink = ({ to, className, children }) =>
  /^https?:\/\//.test(to)
    ? <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
    : <Link to={to} className={className}>{children}</Link>;

const Chips = ({ n, dark = false }) =>
  (n.location || n.price) ? (
    <div className="flex flex-wrap gap-2 mt-3">
      {n.location && (
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
          dark ? 'bg-white/10 text-white/90' : 'bg-[#F1ECE1] text-[#5C5033]'}`}>
          <MapPin size={12} /> {n.location}
        </span>
      )}
      {n.price && (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          dark ? 'bg-[#B49A70] text-[#1C201C]' : 'bg-[#1C201C] text-[#E8D9BF]'}`}>
          {n.price}
        </span>
      )}
    </div>
  ) : null;

const FeaturedCard = ({ n, onRead, onDelete }) => {
  const [imgOk, setImgOk] = useState(true);
  const meta = CATEGORY_META[n.category];
  const Icon = meta.icon;
  return (
    <article className="relative overflow-hidden rounded-xl bg-[#1C201C] text-white shadow-xl shadow-[#1C201C]/20 grid md:grid-cols-5">
      <div className="relative md:col-span-2 min-h-[220px] md:min-h-full bg-gradient-to-br from-[#2B3029] to-[#1C201C]">
        {imgOk && (
          <img
            src={n.image} alt="" loading="lazy" onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1C201C]/70 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-[#B49A70] text-[#1C201C] px-3 py-1.5 rounded-full">
          <Icon size={13} /> {meta.label}
        </span>
      </div>

      <div className="md:col-span-3 p-6 sm:p-8 flex flex-col">
        <div className="flex items-center justify-between text-xs text-[#CFC8B8]">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B49A70] animate-pulse" aria-hidden="true" />
            <span className="sr-only">Unread. </span>Latest · {n.timestamp}
          </span>
          <button
            onClick={() => onDelete(n.id)}
            aria-label={`Archive: ${n.title}`}
            className="p-2 -mr-2 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B49A70]"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl leading-tight mt-3">{n.title}</h3>
        <p className="text-[#CFC8B8] text-sm sm:text-base leading-relaxed mt-3 max-w-[56ch]">{n.description}</p>
        <Chips n={n} dark />

        <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
          <ActionLink
            to={n.actionLink}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#B49A70] text-[#1C201C] text-sm font-semibold hover:bg-[#C7AE83] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {n.actionLabel} <ArrowUpRight size={16} />
          </ActionLink>
          <button
            onClick={() => onRead(n.id)}
            className="px-4 py-3 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Mark as read
          </button>
        </div>
      </div>
    </article>
  );
};

const NotificationCard = ({ n, onRead, onDelete }) => {
  const [imgOk, setImgOk] = useState(true);
  const meta = CATEGORY_META[n.category] || CATEGORY_META['Market Intelligence'];
  const Icon = meta.icon;
  const showImg = n.image && imgOk;

  return (
    <article
      className={`group relative flex gap-4 sm:gap-5 p-5 sm:p-6 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1C201C]/8 ${
        n.isUnread ? 'bg-white border-[#B49A70]/60' : 'bg-white/70 border-[#DDD8CE]'
      }`}
    >
      {n.isUnread && (
        <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r bg-[#B49A70]" aria-hidden="true" />
      )}

      <div className={`shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
        n.isUnread ? 'bg-[#1C201C] text-[#E8D9BF]' : 'bg-[#F1ECE1] text-[#8A7348]'}`}>
        <Icon size={20} strokeWidth={1.6} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#6E6D66]">
            <span className="font-semibold text-[#8A7348]">{meta.label}</span>
            <span className="w-1 h-1 rounded-full bg-[#CFC8B8]" aria-hidden="true" />
            <span>{n.timestamp}</span>
            {n.isUnread && <span className="sr-only">Unread</span>}
          </div>
          <button
            onClick={() => onDelete(n.id)}
            aria-label={`Archive: ${n.title}`}
            title="Archive"
            className="-mr-2 p-2 rounded-md text-[#A8A59B] hover:text-[#C74747] hover:bg-[#C74747]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B49A70]"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <h3 className="font-serif text-xl sm:text-[1.35rem] leading-snug text-[#1C201C] mt-1.5">{n.title}</h3>
        <p className="text-sm text-[#555] leading-relaxed mt-2 max-w-[62ch]">{n.description}</p>
        <Chips n={n} />

        <div className="mt-4 flex items-center gap-5">
          <ActionLink
            to={n.actionLink}
            className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A7348] hover:text-[#1C201C] transition-colors"
          >
            {n.actionLabel}
            <ArrowUpRight size={15} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </ActionLink>
          {n.isUnread && (
            <button
              onClick={() => onRead(n.id)}
              className="inline-flex items-center gap-1.5 text-sm text-[#6E6D66] hover:text-[#287A50] transition-colors cursor-pointer"
            >
              <Eye size={14} /> Mark as read
            </button>
          )}
        </div>
      </div>

      {showImg && (
        <div className="hidden sm:block shrink-0 w-32 h-32 lg:w-36 lg:h-36 rounded-lg overflow-hidden self-center">
          <img
            src={n.image} alt="" loading="lazy" onError={() => setImgOk(false)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
    </article>
  );
};

/* ------------------------------- page ------------------------------- */

const Notifications = () => {
  const { showToast, notifications: storeNotifs } = usePropertyStore();

  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = async (isActive = () => true) => {
    setLoading(true);
    setError(false);
    try {
      const res = await Api.getNotifications();
      if (!isActive()) return;
      if (res?.data?.notifications && res.data.notifications.length > 0) {
        setNotifications(res.data.notifications.map(mapApiNotification));
      } else {
        setNotifications([]);
      }
    } catch {
      if (isActive()) setError(true);
    } finally {
      if (isActive()) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    load(() => active);
    return () => { active = false; };
  }, []);

  // Sync real-time socket notifications from store
  useEffect(() => {
    if (storeNotifs && storeNotifs.length > 0) {
      setNotifications(storeNotifs.map(mapApiNotification));
    }
  }, [storeNotifs]);

  const handleMarkRead = async (id) => {
    const prev = notifications;
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, isUnread: false } : n)));
    if (USE_DUMMY) return;
    try {
      await Api.markNotificationRead?.(id);
    } catch {
      setNotifications(prev);
      showToast('Could not mark as read. Try again.', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    const prev = notifications;
    setNotifications((p) => p.map((n) => ({ ...n, isUnread: false })));
    try {
      if (!USE_DUMMY) await Api.markAllNotificationsRead();
      showToast('All notifications marked as read.', 'success');
    } catch {
      setNotifications(prev);
      showToast('Could not mark notifications as read. Try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const prev = notifications;
    setNotifications((p) => p.filter((n) => n.id !== id));
    try {
      if (!USE_DUMMY) await Api.deleteNotification(id);
      showToast('Notification archived.', 'info');
    } catch {
      setNotifications(prev);
      showToast('Could not archive this notification. Try again.', 'error');
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;
  const viewings = notifications.filter((n) => n.category === 'Itineraries').length;
  const offMarket = notifications.filter((n) => n.category === 'Off-Market').length;

  const counts = useMemo(() => {
    const c = { All: notifications.length };
    Object.keys(CATEGORY_META).forEach((k) => {
      c[k] = notifications.filter((n) => n.category === k).length;
    });
    return c;
  }, [notifications]);

  const filtered = notifications.filter((n) => activeTab === 'All' || n.category === activeTab);
  const featured = filtered.find((n) => n.isUnread && n.image);
  const rest = filtered.filter((n) => n.id !== featured?.id);
  const grouped = GROUP_ORDER
    .map((g) => ({ name: g, items: rest.filter((n) => n.group === g) }))
    .filter((g) => g.items.length > 0);

  const stats = [
    { label: 'Unread', value: unreadCount, icon: Bell },
    { label: 'Viewings', value: viewings, icon: CalendarCheck },
    { label: 'Off-market alerts', value: offMarket, icon: Sparkles },
  ];

  return (
    <div className="bg-[#F8F6F2] min-h-screen">
      {/* Header */}
      <header className="relative bg-[#1C201C] pt-32 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 88% 10%, rgba(180,154,112,0.22) 0, transparent 42%), radial-gradient(circle at 5% 100%, rgba(180,154,112,0.10) 0, transparent 40%)' }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight">Your notifications</h1>
            <p className="mt-3 text-[#CFC8B8] text-base max-w-md leading-relaxed">
              Off-market alerts, viewing confirmations and price changes for the properties you follow.
            </p>
          </div>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="self-start md:self-auto px-5 py-3 rounded-md bg-[#B49A70] text-[#1C201C] text-sm font-semibold flex items-center gap-2 hover:bg-[#C7AE83] focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-14 pb-24 relative">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-[#DDD8CE] rounded-xl p-4 sm:p-5 shadow-lg shadow-[#1C201C]/10 flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex w-11 h-11 rounded-lg bg-[#F1ECE1] text-[#8A7348] items-center justify-center shrink-0">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <div className="font-serif text-3xl sm:text-4xl text-[#1C201C] leading-none">{value}</div>
                <div className="text-xs sm:text-sm text-[#6E6D66] mt-1">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          role="tablist"
          aria-label="Filter notifications"
          className="mt-6 flex gap-1.5 overflow-x-auto p-1.5 bg-white border border-[#DDD8CE] rounded-xl"
        >
          {TABS.map((cat) => {
            const selected = activeTab === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B49A70] ${
                  selected ? 'bg-[#1C201C] text-white' : 'text-[#6E6D66] hover:bg-[#F8F6F2] hover:text-[#1C201C]'
                }`}
              >
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  selected ? 'bg-white/15 text-[#E8D9BF]' : 'bg-[#F1ECE1] text-[#8A7348]'}`}>
                  {counts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-[#6E6D66]">
              <Loader2 className="animate-spin text-[#B49A70]" size={26} />
              <p className="text-sm mt-3">Loading your notifications…</p>
            </div>
          ) : error ? (
            <div className="bg-white border border-[#DDD8CE] rounded-xl p-12 text-center">
              <h3 className="font-serif text-2xl text-[#1C201C]">We couldn’t load your notifications</h3>
              <p className="text-sm text-[#6E6D66] mt-2">Check your connection and try again.</p>
              <button
                onClick={() => load()}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1C201C] text-white text-sm font-medium hover:bg-black transition-colors cursor-pointer"
              >
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-dashed border-[#DDD8CE] rounded-xl p-14 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F1ECE1] flex items-center justify-center mb-4">
                <Bell size={24} className="text-[#B49A70]" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C201C]">You’re all caught up</h3>
              <p className="text-sm text-[#6E6D66] mt-2 max-w-sm mx-auto">
                New alerts will appear here. Browse properties to start following listings.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#B49A70] text-[#1C201C] text-sm font-semibold hover:bg-[#C7AE83] transition-colors"
                >
                  Explore properties <ArrowUpRight size={15} />
                </Link>
                {USE_DUMMY && (
                  <button
                    onClick={() => { setNotifications(DUMMY_NOTIFICATIONS); setActiveTab('All'); }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md border border-[#DDD8CE] text-[#1C201C] text-sm font-medium hover:bg-[#F8F6F2] transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} /> Restore sample data
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {featured && <FeaturedCard n={featured} onRead={handleMarkRead} onDelete={handleDelete} />}

              {grouped.map((g) => (
                <section key={g.name} aria-label={g.name}>
                  <h2 className="flex items-center gap-4 text-sm font-semibold text-[#1C201C] mb-4">
                    {g.name}
                    <span className="flex-1 h-px bg-[#DDD8CE]" aria-hidden="true" />
                    <span className="text-xs font-normal text-[#6E6D66]">{g.items.length}</span>
                  </h2>
                  <div className="space-y-4">
                    {g.items.map((n) => (
                      <NotificationCard key={n.id} n={n} onRead={handleMarkRead} onDelete={handleDelete} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;