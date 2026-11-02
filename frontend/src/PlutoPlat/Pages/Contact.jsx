import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, CheckCircle } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const subjectParam = searchParams.get('subject') || 'Acquisition Inquiry';

  const { submitEnquiry } = usePropertyStore();

  const [inquiryType, setInquiryType] = useState(subjectParam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('$5M - $10M');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (subjectParam) {
      setInquiryType(subjectParam);
    }
  }, [subjectParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEnquiry({
      inquiryType,
      name,
      email,
      phone,
      budget,
      message
    });
    setSubmitted(true);
  };

  const offices = [
    {
      city: 'Kanpur Flagship',
      country: 'Uttar Pradesh, India',
      address: 'PlutoPlat Heritage Suite, Civil Lines & Swaroop Nagar, Kanpur, UP 208001',
      phone: '+91 9956346155',
      hours: 'Mon – Sat: 09:00 – 20:00 IST'
    },
    {
      city: 'Beverly Hills',
      country: 'United States',
      address: '9460 Wilshire Boulevard, Penthouse Suite, Beverly Hills, CA 90212',
      phone: '+1 (310) 849-2210',
      hours: 'Mon – Sat: 08:00 – 20:00 PST'
    },
    {
      city: 'Manhattan',
      country: 'United States',
      address: '220 Central Park South, 42nd Floor, New York, NY 10019',
      phone: '+1 (212) 555-0199',
      hours: 'Mon – Sat: 08:00 – 20:00 EST'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '14 Berkeley Square, Mayfair, London W1J 6BL',
      phone: '+44 20 7946 0912',
      hours: 'Mon – Fri: 09:00 – 19:00 GMT'
    },
    {
      city: 'Dubai',
      country: 'United Arab Emirates',
      address: 'Gate Precinct 4, Level 5, DIFC, Dubai',
      phone: '+971 4 362 7500',
      hours: 'Sun – Thu: 09:00 – 18:00 GST'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-2">
            Private Client Concierge
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1C201C] font-normal mb-4">
            Connect With Our Senior Advisory Desk
          </h1>
          <p className="text-sm text-[#6E6D66] font-light leading-relaxed">
            Whether seeking to acquire a trophy residence, commission a confidential valuation, or inquire about off-market collections, our partners respond promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-[#DDD8CE] p-8 sm:p-10 rounded-sm shadow-xs">
            {submitted ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-[#287A50]/15 text-[#287A50] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} />
                </div>
                <h3 className="font-serif text-3xl text-[#1C201C] mb-2 font-normal">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6D66] max-w-md mx-auto mb-6 font-light">
                  Thank you, {name}. A Senior Managing Director has been allocated to your profile and will review your parameters under strict NDA protocol.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#1C201C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-2">
                    Inquiry Intent
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Acquisition Inquiry', 'Listing Concierge', 'Off-Market Portfolio'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInquiryType(type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xs border text-center transition-colors ${
                          inquiryType === type
                            ? 'bg-[#1C201C] text-white border-[#1C201C]'
                            : 'bg-white border-[#DDD8CE] text-[#6E6D66] hover:border-[#1C201C]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                      Full Name / Principal
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Roosevelt"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="principal@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                      Direct Telephone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                      Target Valuation Bracket
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    >
                      <option>$2M – $5M</option>
                      <option>$5M – $10M</option>
                      <option>$10M – $25M</option>
                      <option>$25M+ Ultra-Prime</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                    Acquisition Objectives & Confidential Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe specific architectural style, geographic location, required privacy parameters or timeframe..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Transmit Confidential Inquiry</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#77766E] pt-2">
                  <ShieldCheck size={14} className="text-[#B49A70]" />
                  <span>Encrypted communication &bull; Bound by Fiduciary Discretion</span>
                </div>
              </form>
            )}
          </div>

          {/* Quick Contact & Direct Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1C201C] text-white p-8 rounded-sm shadow-md">
              <span className="text-xs font-semibold text-[#B49A70] uppercase tracking-widest block mb-2">
                International Concierge Desk
              </span>
              <h3 className="font-serif text-2xl font-normal mb-4">Immediate Partner Dispatch</h3>
              <p className="text-xs text-[#A09D94] font-light leading-relaxed mb-6">
                For time-sensitive off-market tenders or urgent wire escrow confirmations, connect directly with our international desk.
              </p>

              <div className="space-y-4 text-xs text-[#EBE7DF]">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#B49A70] shrink-0" />
                  <span>+1 (800) 758-8675 (Toll-Free Worldwide)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#B49A70] shrink-0" />
                  <span>concierge@plutoplat.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#B49A70] shrink-0" />
                  <span>24 Hours / 7 Days Active Escrow Monitoring</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DDD8CE] p-8 rounded-sm">
              <h4 className="font-serif text-xl text-[#1C201C] mb-2 font-normal">Discrete Representation</h4>
              <p className="text-xs text-[#6E6D66] font-light leading-relaxed">
                We regularly coordinate with family offices, private wealth bankers, and chartered legal councils. Non-disclosure agreements can be executed prior to any document release.
              </p>
            </div>
          </div>
        </div>

        {/* Global Enclaves & Offices Grid */}
        <div>
          <h2 className="font-serif text-3xl text-[#1C201C] font-normal mb-8 text-center">
            Our Flagship Global Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((off) => (
              <div
                key={off.city}
                className="bg-white border border-[#DDD8CE] p-6 rounded-sm shadow-2xs hover:border-[#B49A70] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl text-[#1C201C] font-semibold">{off.city}</h3>
                  <span className="text-[10px] uppercase font-mono text-[#B49A70]">{off.country}</span>
                </div>
                <p className="text-xs text-[#6E6D66] leading-relaxed mb-4 font-light">
                  {off.address}
                </p>
                <div className="border-t border-[#EAE6DE] pt-3 text-[11px] text-[#555] space-y-1">
                  <div><strong>Direct:</strong> {off.phone}</div>
                  <div className="text-[10px] text-[#77766E]">{off.hours}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
