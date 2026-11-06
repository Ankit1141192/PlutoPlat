import React, { useState } from 'react';
import { 
  Users, Phone, Mail, MessageCircle, Star, ShieldCheck, 
  MapPin, Award, CheckCircle2, Send, X, Sparkles, ArrowRight 
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ContactAgents = () => {
  const { agents, showToast } = usePropertyStore();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    budget: '₹5 - ₹15 Cr'
  });

  const handleOpenContact = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(`Confidential brief sent to ${selectedAgent.name}. An advisor will reach out via phone.`, 'success');
    setIsModalOpen(false);
    setMessageForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      budget: '₹5 - ₹15 Cr'
    });
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="border-b border-[#DDD8CE] pb-8 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
            <Users size={14} />
            <span>Fiduciary Advisory Directory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal">
            Connect with Senior Advisors & Agents
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 max-w-2xl font-light leading-relaxed">
            Every PlutoPlat partner agent is an accredited specialist bound by strict non-disclosure mandates, providing discreet representation for prime and super-prime acquisitions.
          </p>
        </div>

        {/* Advisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Advisor Avatar & Rating */}
                <div className="flex items-start justify-between mb-5">
                  <div className="relative">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#B49A70] shadow-md"
                    />
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#10B981] border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">
                      ✓
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F8F6F2] px-2.5 py-1 rounded-full border border-[#DDD8CE] text-xs font-semibold text-[#1C201C]">
                    <Star size={13} className="text-[#B49A70] fill-[#B49A70]" />
                    <span>{agent.rating}</span>
                    <span className="text-[10px] text-[#8E8B82]">({agent.reviews})</span>
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="font-serif text-2xl text-[#1C201C] font-semibold mb-1">
                  {agent.name}
                </h3>
                <p className="text-xs text-[#B49A70] font-medium uppercase tracking-wider mb-3">
                  {agent.title}
                </p>

                <p className="text-xs text-[#6E6D66] flex items-center gap-1.5 mb-4 font-light">
                  <MapPin size={13} className="text-[#B49A70] shrink-0" />
                  <span>{agent.specialty}</span>
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F6F2] rounded-xl border border-[#EAE6DE] mb-6 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8E8B82] block">Closed Volume</span>
                    <span className="font-serif text-sm font-bold text-[#1C201C]">{agent.salesVolume}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8E8B82] block">Accreditation</span>
                    <span className="font-serif text-xs font-bold text-[#10B981] flex items-center justify-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="space-y-2.5 pt-4 border-t border-[#EAE6DE]">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="py-2.5 bg-[#F8F6F2] hover:bg-[#EFECE4] text-[#1C201C] text-xs font-semibold rounded-lg border border-[#DDD8CE] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone size={13} className="text-[#B49A70]" />
                    <span>Call Direct</span>
                  </a>

                  <a
                    href={`https://wa.me/919956346155?text=Hello%20${encodeURIComponent(agent.name)},%20I%20am%20inquiring%20about%20super-prime%20property%20opportunities%20on%20PlutoPlat.`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-[#E8F8F3] hover:bg-[#d4f2e8] text-[#00A884] text-xs font-semibold rounded-lg border border-[#A7E6D1] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => handleOpenContact(agent)}
                  className="w-full py-3 bg-[#1C201C] hover:bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send size={13} />
                  <span>Send Acquisition Brief</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Send Brief Modal */}
        {isModalOpen && selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#F8F6F2] border border-[#DDD8CE] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-[#6E6D66] hover:text-[#1C201C] p-1.5 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="mb-6 pb-4 border-b border-[#DDD8CE]">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#B49A70] mb-1">
                  <Sparkles size={12} />
                  <span>Direct Advisor Channel</span>
                </div>
                <h3 className="font-serif text-2xl text-[#1C201C]">
                  Contact {selectedAgent.name}
                </h3>
                <p className="text-xs text-[#6E6D66]">
                  {selectedAgent.title} &bull; {selectedAgent.specialty}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={messageForm.name}
                    onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-lg focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={messageForm.email}
                      onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                      placeholder="client@heritageholdings.in"
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-lg focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={messageForm.phone}
                      onChange={(e) => setMessageForm({ ...messageForm, phone: e.target.value })}
                      placeholder="+91 98110 44521"
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-lg focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Target Budget Window
                  </label>
                  <select
                    value={messageForm.budget}
                    onChange={(e) => setMessageForm({ ...messageForm, budget: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-lg focus:outline-none focus:border-[#B49A70]"
                  >
                    <option>₹5 - ₹10 Cr</option>
                    <option>₹10 - ₹25 Cr</option>
                    <option>₹25 - ₹50 Cr</option>
                    <option>Ultra Prime (₹50 Cr+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1">
                    Confidential Acquisition Brief
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    placeholder="Briefly state your preferred architectural style, locality in Kanpur/Mumbai/Delhi, or specific estate requirements..."
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-lg focus:outline-none focus:border-[#B49A70]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Dispatch Confidential Brief</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactAgents;
