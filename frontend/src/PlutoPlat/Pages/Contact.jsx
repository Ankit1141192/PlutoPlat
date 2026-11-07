import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle, User, Wallet,
  MessageSquare, ArrowUpRight, Building2, Loader2,
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const inquiryTypes = ['Acquisition Inquiry', 'Listing Concierge', 'Off-Market Portfolio'];
const budgets = ['$2M – $5M', '$5M – $10M', '$10M – $25M', '$25M+ Ultra-Prime'];

const offices = [
  {
    city: 'Kanpur Flagship',
    country: 'Uttar Pradesh, India',
    address: 'PlutoPlat Heritage Suite, Civil Lines & Swaroop Nagar, Kanpur, UP 208001',
    phone: '+91 9956346155',
    hours: 'Mon – Sat: 09:00 – 20:00 IST',
    flagship: true,
  },
  {
    city: 'Beverly Hills',
    country: 'United States',
    address: '9460 Wilshire Boulevard, Penthouse Suite, Beverly Hills, CA 90212',
    phone: '+1 (310) 849-2210',
    hours: 'Mon – Sat: 08:00 – 20:00 PST',
  },
  {
    city: 'Manhattan',
    country: 'United States',
    address: '220 Central Park South, 42nd Floor, New York, NY 10019',
    phone: '+1 (212) 555-0199',
    hours: 'Mon – Sat: 08:00 – 20:00 EST',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    address: '14 Berkeley Square, Mayfair, London W1J 6BL',
    phone: '+44 20 7946 0912',
    hours: 'Mon – Fri: 09:00 – 19:00 GMT',
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Gate Precinct 4, Level 5, DIFC, Dubai',
    phone: '+971 4 362 7500',
    hours: 'Sun – Thu: 09:00 – 18:00 GST',
  },
];

const inputBase =
  'h-12 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] pl-11 pr-4 text-base text-[#1C201C] placeholder:text-[#A9A69B] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20 sm:text-sm';

const Field = ({ id, label, icon: Icon, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#3F433E]">
      {label}
    </label>
    <div className="relative">
      <Icon size={17} className="pointer-events-none absolute left-3.5 top-3.5 text-[#8A887F]" />
      {children}
    </div>
  </div>
);

const Contact = () => {
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get('subject') || 'Acquisition Inquiry';

  const { submitEnquiry } = usePropertyStore();

  const [inquiryType, setInquiryType] = useState(subjectParam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('$5M – $10M');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (subjectParam) setInquiryType(subjectParam);
  }, [subjectParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitEnquiry({ inquiryType, name, email, phone, budget, message });
    } finally {
      setSending(false);
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setSubmitted(false);
  };

  const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const telHref = (p) => `tel:${p.replace(/[^\d+]/g, '')}`;

  return (
    <div className="min-h-screen bg-[#F6F3EC] pb-20 lg:pb-28">
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F130F] via-[#1B211B] to-[#252A1F] px-4 pb-28 pt-28 text-white sm:px-6 lg:pb-36 lg:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(520px 360px at 90% 0%, rgba(201,178,135,0.28), transparent 70%), radial-gradient(420px 300px at 0% 100%, rgba(201,178,135,0.14), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-medium text-[#C9B287]">Private client concierge</p>
          <h1 className="max-w-3xl font-serif text-[34px] font-normal leading-[1.1] sm:text-5xl lg:text-6xl">
            Talk to our senior advisory desk.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/70 sm:text-base">
            Buying a residence, requesting a confidential valuation or asking about off-market homes — our partners
            respond promptly.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {[
              { Icon: Phone, text: '+91 99563 46155', href: 'tel:+919956346155' },
              { Icon: Mail, text: 'concierge@plutoplat.com', href: 'mailto:concierge@plutoplat.com' },
              { Icon: Clock, text: 'Mon – Sat, 9 AM – 8 PM IST' },
            ].map(({ Icon, text, href }) => {
              const inner = (
                <>
                  <Icon size={16} className="text-[#C9B287]" />
                  <span>{text}</span>
                </>
              );
              const cls =
                'inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90 backdrop-blur transition';
              return href ? (
                <a key={text} href={href} className={`${cls} hover:border-[#C9B287]/60 hover:bg-white/10`}>
                  {inner}
                </a>
              ) : (
                <span key={text} className={cls}>
                  {inner}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:-mt-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ───────── Form ───────── */}
          <div className="rounded-3xl border border-[#E8E3D8] bg-white p-5 shadow-[0_30px_70px_-30px_rgba(28,32,28,0.35)] sm:p-9 lg:col-span-7">
            {submitted ? (
              <div className="py-14 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#287A50]/10 text-[#287A50]">
                  <CheckCircle size={40} />
                </div>
                <h3 className="font-serif text-3xl font-normal text-[#1C201C]">Inquiry sent</h3>
                <p className="mx-auto mb-7 mt-3 max-w-md text-sm font-light leading-relaxed text-[#6E6D66]">
                  Thank you, {name}. A senior managing director has been assigned to your enquiry and will review it
                  under strict confidentiality.
                </p>
                <button
                  onClick={resetForm}
                  className="h-12 rounded-xl bg-[#1C201C] px-7 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-[#1C201C] sm:text-[28px]">Send an inquiry</h2>
                <p className="mb-7 mt-1.5 text-sm font-light text-[#6E6D66]">
                  Tell us what you are looking for. All fields are required.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Intent */}
                  <fieldset>
                    <legend className="mb-2 text-[13px] font-medium text-[#3F433E]">What can we help with?</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInquiryType(type)}
                          aria-pressed={inquiryType === type}
                          className={`flex min-h-12 items-center justify-center rounded-xl border px-3 text-center text-sm font-semibold transition-colors ${
                            inquiryType === type
                              ? 'border-[#1C201C] bg-[#1C201C] text-white shadow-md'
                              : 'border-[#DDD8CE] bg-white text-[#6E6D66] hover:border-[#B49A70]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field id="c-name" label="Full name" icon={User}>
                      <input
                        id="c-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Eleanor Roosevelt"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputBase}
                      />
                    </Field>
                    <Field id="c-email" label="Email address" icon={Mail}>
                      <input
                        id="c-email"
                        type="email"
                        inputMode="email"
                        required
                        autoComplete="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputBase}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field id="c-phone" label="Phone number" icon={Phone}>
                      <input
                        id="c-phone"
                        type="tel"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputBase}
                      />
                    </Field>
                    <Field id="c-budget" label="Budget range" icon={Wallet}>
                      <select
                        id="c-budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className={`${inputBase} cursor-pointer appearance-none`}
                      >
                        {budgets.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field id="c-message" label="Your requirements" icon={MessageSquare}>
                    <textarea
                      id="c-message"
                      rows={5}
                      required
                      placeholder="Preferred style, location, privacy needs or timeframe…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputBase} h-auto resize-none py-3`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={sending}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9B287] to-[#B49A70] text-sm font-semibold text-[#161916] shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
                  >
                    {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                    <span>{sending ? 'Sending…' : 'Send inquiry'}</span>
                  </button>

                  <p className="flex items-center justify-center gap-2 text-xs text-[#77766E]">
                    <ShieldCheck size={14} className="text-[#B49A70]" />
                    Encrypted and handled in strict confidence
                  </p>
                </form>
              </>
            )}
          </div>

          {/* ───────── Side cards ───────── */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-br from-[#161916] to-[#2B3029] p-6 text-white shadow-[0_30px_70px_-30px_rgba(28,32,28,0.6)] sm:p-9">
              <p className="mb-2 text-sm font-medium text-[#C9B287]">International concierge desk</p>
              <h3 className="font-serif text-2xl font-normal">Need an immediate reply?</h3>
              <p className="mb-7 mt-3 text-sm font-light leading-relaxed text-white/65">
                For time-sensitive off-market tenders or urgent escrow confirmations, reach our international desk
                directly.
              </p>

              <div className="space-y-3">
                {[
                  { Icon: Phone, label: 'Toll-free worldwide', value: '+1 (800) 758-8675', href: 'tel:+18007588675' },
                  { Icon: Mail, label: 'Email', value: 'concierge@plutoplat.com', href: 'mailto:concierge@plutoplat.com' },
                  { Icon: Clock, label: 'Availability', value: '24/7 escrow monitoring' },
                ].map(({ Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#B49A70]/40 bg-[#B49A70]/10 text-[#C9B287]">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-white/50">{label}</span>
                        <span className="block truncate text-sm text-white">{value}</span>
                      </span>
                    </>
                  );
                  const cls = 'flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-colors';
                  return href ? (
                    <a key={label} href={href} className={`${cls} hover:border-[#C9B287]/50 hover:bg-white/10`}>
                      {inner}
                    </a>
                  ) : (
                    <div key={label} className={cls}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E8E3D8] bg-white p-6 sm:p-8">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F1EDE3] text-[#9A7F52]">
                <ShieldCheck size={20} />
              </span>
              <h4 className="font-serif text-xl font-normal text-[#1C201C]">Discreet representation</h4>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#6E6D66]">
                We work with family offices, private bankers and legal counsel. Non-disclosure agreements can be signed
                before any document is shared.
              </p>
            </div>
          </div>
        </div>

        {/* ───────── Offices ───────── */}
        <section className="mt-20 lg:mt-28">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-sm font-medium text-[#9A7F52]">Find us</p>
            <h2 className="font-serif text-3xl font-normal text-[#1C201C] sm:text-4xl">Our global offices</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offices.map((off) => (
              <article
                key={off.city}
                className={`flex flex-col rounded-3xl border p-6 transition-all hover:-translate-y-0.5 sm:p-8 ${
                  off.flagship
                    ? 'bg-gradient-to-br from-[#161916] to-[#2B3029] text-white md:col-span-2 lg:col-span-2 border-[#2F352F] shadow-[0_30px_70px_-30px_rgba(28,32,28,0.6)]'
                    : 'border-[#E8E3D8] bg-white hover:border-[#B49A70] hover:shadow-lg'
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`font-serif text-2xl font-normal ${off.flagship ? 'text-white' : 'text-[#1C201C]'}`}>
                      {off.city}
                    </h3>
                    <p className={`mt-1 text-xs ${off.flagship ? 'text-[#C9B287]' : 'text-[#9A7F52]'}`}>{off.country}</p>
                  </div>
                  {off.flagship ? (
                    <span className="shrink-0 rounded-full bg-[#C9B287] px-3 py-1 text-xs font-semibold text-[#161916]">
                      Head office
                    </span>
                  ) : (
                    <Building2 size={20} className="shrink-0 text-[#C9B287]" />
                  )}
                </div>

                <p className={`flex items-start gap-2.5 text-sm font-light leading-relaxed ${off.flagship ? 'text-white/75' : 'text-[#6E6D66]'}`}>
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[#B49A70]" />
                  {off.address}
                </p>

                <div className={`mt-5 space-y-2 border-t pt-4 text-sm ${off.flagship ? 'border-white/10' : 'border-[#EAE6DE]'}`}>
                  <a
                    href={telHref(off.phone)}
                    className={`flex items-center gap-2.5 font-medium ${off.flagship ? 'text-white hover:text-[#E4D2AB]' : 'text-[#1C201C] hover:text-[#9A7F52]'}`}
                  >
                    <Phone size={15} className="text-[#B49A70]" /> {off.phone}
                  </a>
                  <p className={`flex items-center gap-2.5 text-[13px] ${off.flagship ? 'text-white/60' : 'text-[#77766E]'}`}>
                    <Clock size={15} className="text-[#B49A70]" /> {off.hours}
                  </p>
                </div>

                <a
                  href={mapsUrl(off.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold ${
                    off.flagship ? 'text-[#E4D2AB] hover:text-white' : 'text-[#9A7F52] hover:text-[#1C201C]'
                  }`}
                >
                  Get directions <ArrowUpRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;