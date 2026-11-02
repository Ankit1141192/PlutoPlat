import React, { useState } from 'react';
import { X, Send, ShieldCheck, Phone, Mail, User, Sparkles } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

// WhatsApp icon SVG component
export const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 7.66C8.88 7.66 8.62 7.72 8.4 7.96C8.18 8.2 7.56 8.78 7.56 9.96C7.56 11.14 8.42 12.28 8.54 12.44C8.66 12.6 10.22 15.01 12.61 16.04C13.18 16.28 13.62 16.43 13.97 16.54C14.54 16.72 15.06 16.69 15.47 16.63C15.93 16.56 16.89 16.05 17.09 15.49C17.29 14.92 17.29 14.44 17.23 14.34C17.17 14.24 17.01 14.18 16.77 14.06C16.53 13.94 15.35 13.36 15.13 13.28C14.91 13.2 14.75 13.16 14.59 13.4C14.43 13.64 13.97 14.18 13.83 14.34C13.69 14.5 13.55 14.52 13.31 14.4C13.07 14.28 12.3 14.03 11.38 13.21C10.66 12.57 10.17 11.78 10.03 11.54C9.89 11.3 10.01 11.17 10.13 11.05C10.24 10.94 10.38 10.76 10.5 10.62C10.62 10.48 10.66 10.38 10.74 10.22C10.82 10.06 10.78 9.92 10.72 9.8C10.66 9.68 10.2 8.54 10.01 8.08C9.82 7.63 9.63 7.69 9.49 7.68C9.36 7.67 9.2 7.66 9.04 7.66Z" />
  </svg>
);

const RegisterInterestModal = ({ project, isOpen, onClose }) => {
  const { showToast } = usePropertyStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !project) return null;

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello PlutoPlat,\n\nI would like to register my interest in *${project.title}* located in *${project.location}*.\n\n• Launch Price: ${project.launchPrice}\n• Handover: ${project.handover}\n• Type: ${project.type}\n\nPlease send me the official investor brochure, payment plan options, and unit floor plans.`
    );
    window.open(`https://wa.me/919956346155?text=${text}`, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(`Interest registered for ${project.title}. VIP allocation advisor assigned!`, 'success');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] border border-[#DDD8CE] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6E6D66] hover:text-[#1C201C] p-1.5 rounded-full hover:bg-[#F8F6F2] transition-colors"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <div className="w-14 h-14 bg-[#00A884]/15 text-[#00A884] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2">Priority Registration Received</h3>
            <p className="text-xs text-[#6E6D66] max-w-xs mx-auto">
              Our Dubai Private Development Desk has registered your allocation for <span className="font-semibold text-[#1C201C]">{project.title}</span>. An advisor will contact you within 15 minutes.
            </p>
          </div>
        ) : (
          <div>
            {/* Header info */}
            <div className="mb-6 pb-4 border-b border-[#EAE6DE]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-widest bg-[#E6F4F1] px-2 py-0.5 rounded-full">
                  Tier 1 Launch &bull; {project.city}
                </span>
                <span className="text-[10px] text-[#6E6D66] font-medium">
                  Handover: {project.handover}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#1C201C] mb-1 leading-snug">
                Register VIP Interest
              </h3>
              <p className="text-xs text-[#6E6D66] font-medium">
                {project.title} &bull; <span className="text-[#0D9488] font-bold">{project.launchPrice}</span>
              </p>
            </div>

            {/* Quick Action: Direct WhatsApp */}
            <div className="mb-6 p-4 bg-[#E8F8F3] border border-[#A7E6D1] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-10 h-10 rounded-full bg-[#00A884] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <WhatsAppIcon size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F5132]">Chat on WhatsApp Instantly</div>
                  <div className="text-[11px] text-[#4F776B]">Get instant brochure & unit availability on your phone</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-4 py-2 bg-[#00A884] hover:bg-[#008f6f] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
              >
                <WhatsAppIcon size={15} />
                <span>Open Chat</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#EAE6DE]"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-[#9A9890] tracking-wider">or request advisor callback</span>
              <div className="flex-grow border-t border-[#EAE6DE]"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                  <input
                    type="text"
                    required
                    placeholder="Principal Investor Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                    <input
                      type="email"
                      required
                      placeholder="investor@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#F8F6F2] border border-[#DDD8CE] rounded-lg focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send size={14} />
                <span>Submit Priority Allocation Request</span>
              </button>

              <p className="text-[10px] text-center text-[#8E8B82] pt-1">
                Zero spam. Direct developer allocation protocol managed by PlutoPlat.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterInterestModal;
