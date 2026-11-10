import React from 'react';

/* Tokens taken from the public site:
   ink #1C201C / #121612, gold #B49A70, emerald #287A50, cream #FAF8F5, line #E8E3D8 */

const tones = {
  gold: 'bg-[#B49A70]/15 text-[#7D6741]',
  green: 'bg-emerald-50 text-emerald-800',
  amber: 'bg-amber-50 text-amber-800',
  red: 'bg-red-50 text-red-700',
  ink: 'bg-[#1C201C] text-white'
};

export const Pill = ({ tone = 'gold', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]} ${className}`}>
    {children}
  </span>
);

/* Dark "briefing" band: the one bold element at the top of each dashboard */
export const Band = ({ title, text, actions, aside }) => (
  <section
    className="relative overflow-hidden rounded-3xl bg-[#161A16] text-white p-7 sm:p-9"
    style={{ backgroundImage: 'radial-gradient(60% 120% at 100% 0%, rgba(180,154,112,0.22), transparent 60%)' }}
  >
    <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{text}</p>
        <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
      </div>
      {aside && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 min-w-[220px] backdrop-blur-sm">
          {aside}
        </div>
      )}
    </div>
  </section>
);

export const GoldButton = ({ as: Tag = 'button', className = '', ...p }) => (
  <Tag
    className={`inline-flex items-center gap-2 rounded-xl bg-[#B49A70] px-5 py-2.5 text-sm font-semibold text-[#121612] transition-colors hover:bg-[#C8AF84] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A70] ${className}`}
    {...p}
  />
);

export const GhostButton = ({ as: Tag = 'button', className = '', ...p }) => (
  <Tag
    className={`inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    {...p}
  />
);

/* One connected strip instead of four identical floating cards */
export const StatStrip = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-[#E8E3D8] bg-[#E8E3D8]">
    {items.map(({ label, value, note, icon: Icon, noteTone = 'text-[#6E6D66]' }) => (
      <div key={label} className="bg-white p-6">
        <div className="flex items-center gap-2 text-sm text-[#6E6D66]">
          {Icon && <Icon size={16} className="text-[#B49A70]" />}
          {label}
        </div>
        <div className="mt-3 font-serif text-4xl text-[#1C201C]">{value}</div>
        <div className={`mt-2 text-xs ${noteTone}`}>{note}</div>
      </div>
    ))}
  </div>
);

export const Panel = ({ title, subtitle, action, children, className = '', id }) => (
  <section id={id} className={`rounded-3xl border border-[#E8E3D8] bg-white p-6 sm:p-7 ${className}`}>
    {(title || action) && (
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {title && <h2 className="font-serif text-xl text-[#1C201C]">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-[#6E6D66]">{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    {children}
  </section>
);

export const EmptyState = ({ title, text }) => (
  <div className="rounded-2xl border border-dashed border-[#DDD8CE] bg-[#FAF8F5] py-10 text-center">
    <p className="font-serif text-lg text-[#1C201C]">{title}</p>
    <p className="mt-1 text-sm text-[#6E6D66]">{text}</p>
  </div>
);

export const LeadCard = ({ lead }) => (
  <li className="rounded-2xl bg-[#FAF8F5] p-4">
    <div className="flex items-center justify-between gap-2">
      <span className="font-semibold text-[#1C201C]">{lead.buyerName}</span>
      <Pill tone={lead.status === 'New' ? 'gold' : 'ink'}>{lead.status}</Pill>
    </div>
    <p className="mt-0.5 text-sm text-[#7D6741]">{lead.propertyTitle}</p>
    <p className="mt-2 line-clamp-2 text-sm text-[#5D5545]">“{lead.message}”</p>
    <p className="mt-3 text-xs text-[#8A887F]">
      {lead.buyerPhone} · {lead.buyerEmail} · {lead.date}
    </p>
  </li>
);

export const PropertyRow = ({ prop, right }) => (
  <li className="flex items-center justify-between gap-3 py-3.5">
    <div className="flex min-w-0 items-center gap-3.5">
      <img
        src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
        alt=""
        className="h-14 w-16 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <p className="truncate font-serif text-base text-[#1C201C]">{prop.title}</p>
        <p className="truncate text-sm text-[#6E6D66]">{prop.price} · {prop.location}</p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">{right}</div>
  </li>
);