import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ScheduleTourModal = ({ property, isOpen, onClose }) => {
  const { scheduleTour } = usePropertyStore();
  const [tourType, setTourType] = useState('In-Person'); // 'In-Person' | 'Virtual'
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleTour({
      propertyId: property.id,
      propertyTitle: property.title,
      tourType,
      date,
      time,
      name,
      email,
      phone,
      notes
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F8F6F2] border border-[#DDD8CE] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6E6D66] hover:text-[#1C201C] p-1.5 rounded-full"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-[#287A50]/15 text-[#287A50] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} />
            </div>
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2">Tour Request Confirmed</h3>
            <p className="text-sm text-[#6E6D66] max-w-xs mx-auto">
              A private chauffeur or access link will be coordinated by {property.agent?.name || 'our Senior Advisor'}.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-[#DDD8CE]">
              <span className="text-[10px] font-semibold text-[#B49A70] uppercase tracking-widest block mb-1">
                Private Viewing Protocol
              </span>
              <h3 className="font-serif text-2xl text-[#1C201C] mb-1">Schedule a Visit</h3>
              <p className="text-xs text-[#6E6D66] flex items-center gap-1">
                <MapPin size={13} className="text-[#B49A70]" />
                <span>{property.title} &bull; {property.location}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tour Type Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-2">
                  Viewing Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTourType('In-Person')}
                    className={`py-2.5 text-xs font-semibold uppercase tracking-wider border rounded-xs transition-colors ${
                      tourType === 'In-Person'
                        ? 'bg-[#1C201C] text-white border-[#1C201C]'
                        : 'bg-white text-[#6E6D66] border-[#DDD8CE]'
                    }`}
                  >
                    Chauffeured On-Site
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourType('Virtual')}
                    className={`py-2.5 text-xs font-semibold uppercase tracking-wider border rounded-xs transition-colors ${
                      tourType === 'Virtual'
                        ? 'bg-[#1C201C] text-white border-[#1C201C]'
                        : 'bg-white text-[#6E6D66] border-[#DDD8CE]'
                    }`}
                  >
                    4K Virtual Guided
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                    Preferred Window
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                  >
                    <option>09:30 AM Morning Window</option>
                    <option>11:00 AM Mid-day Window</option>
                    <option>02:30 PM Afternoon Window</option>
                    <option>05:00 PM Golden Hour Sunset</option>
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                  Full Name / Principal
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Julian Beaumont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                    Confidential Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="julian@beaumont.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                  Private Accompaniments / Security Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Any particular security clearance or guest requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md cursor-pointer"
                >
                  Confirm Confidential Appointment
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#77766E] pt-1">
                <ShieldCheck size={13} className="text-[#B49A70]" />
                <span>All requests protected under strict Client Non-Disclosure protocol.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTourModal;
