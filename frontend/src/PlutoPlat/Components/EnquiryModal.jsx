import React, { useState } from 'react';
import { X, Send, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const EnquiryModal = ({ property, isOpen, onClose }) => {
  const { submitEnquiry } = usePropertyStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    property ? `I am interested in acquiring ${property.title} (${property.price}) and would like to review the complete architectural prospectus.` : ''
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEnquiry({
      propertyId: property?.id,
      propertyTitle: property?.title,
      name,
      email,
      phone,
      message
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F8F6F2] border border-[#DDD8CE] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6E6D66] hover:text-[#1C201C] p-1.5"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <div className="w-14 h-14 bg-[#287A50]/15 text-[#287A50] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2">Enquiry Transmitted</h3>
            <p className="text-xs text-[#6E6D66] max-w-xs mx-auto">
              {property?.agent?.name || 'A Senior Advisor'} has been assigned to your request and will contact you discretely.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-[#DDD8CE]">
              <span className="text-[10px] font-semibold text-[#B49A70] uppercase tracking-widest block mb-1">
                Direct Advisor Dispatch
              </span>
              <h3 className="font-serif text-2xl text-[#1C201C] mb-1">Request Private Prospectus</h3>
              {property && (
                <p className="text-xs text-[#6E6D66]">
                  Regarding: <span className="text-[#1C201C] font-semibold">{property.title}</span> &bull; {property.location}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                  <input
                    type="text"
                    required
                    placeholder="Principal or Representative Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                    <input
                      type="email"
                      required
                      placeholder="email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                    Direct Telephone
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 99563 46155"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                  Message / Particular Questions
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Send size={14} className="text-[#B49A70]" />
                <span>Transmit Inquiry to Lead Advisor</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#77766E] pt-1">
                <ShieldCheck size={13} className="text-[#B49A70]" />
                <span>Encrypted transmission. No third-party syndication.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
