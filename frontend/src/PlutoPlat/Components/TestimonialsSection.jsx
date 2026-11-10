import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, MapPin, Plus, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const TestimonialsSection = () => {
  const { testimonials = [], addTestimonial, user, showToast } = usePropertyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState(user?.name || '');
  const [role, setRole] = useState('Private Client');
  const [property, setProperty] = useState('Kanpur Luxury Acquisition');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const average = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + (Number(t.rating) || 5), 0) / testimonials.length
    : 5.0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !message.trim()) {
      showToast?.('Please enter your name and review message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (addTestimonial) {
        await addTestimonial({
          name: clientName.trim(),
          client: clientName.trim(),
          role: role.trim() || 'Private Investor',
          company: property.trim() || 'Trophy Estate Acquisition',
          property: property.trim() || 'Trophy Estate Acquisition',
          message: message.trim(),
          content: message.trim(),
          rating: Number(rating) || 5,
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          imageUrl: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        });
      }
      setIsModalOpen(false);
      setMessage('');
    } catch (err) {
      console.warn('Testimonial submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-[#DDD8CE] bg-[#F1EEE6] py-16 sm:py-24 lg:py-28">
      {/* soft gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(600px 320px at 100% 0%, rgba(180,154,112,0.16), transparent 70%), radial-gradient(500px 300px at 0% 100%, rgba(180,154,112,0.10), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-sm font-medium text-[#9A7F52]">Client voices</p>
          <h2 className="font-serif text-[30px] font-normal leading-tight text-[#1C201C] sm:text-4xl md:text-5xl">
            Trusted by buyers who expect the best.
          </h2>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-[#6E6D66] sm:text-base">
            Reflections from collectors, developers and families who chose PlutoPlat for their most important
            acquisitions.
          </p>

          {/* Rating summary & Review CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#E2DCCE] bg-white px-5 py-2.5 shadow-sm">
              <span className="flex text-[#B49A70]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={i < Math.round(average) ? 'currentColor' : 'none'} />
                ))}
              </span>
              <span className="text-sm font-semibold text-[#1C201C]">{average.toFixed(1)}</span>
              <span className="text-sm text-[#77766E]">from {testimonials.length} reviews</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#1C201C] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-black active:scale-95 cursor-pointer"
            >
              <Plus size={14} className="text-[#B49A70]" />
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        {/* Cards: swipeable on phones, grid on larger screens */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-8 [&::-webkit-scrollbar]:hidden">
          {testimonials.map((t, idx) => {
            const author = t.client || t.name || 'Private Client';
            const body = t.content || t.message || '';
            const photo = t.avatar || t.imageUrl;
            const affiliation = t.property || t.company;
            const starCount = Number(t.rating) || 5;

            return (
              <motion.article
                key={t.id || t._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(idx, 3) * 0.12 }}
                className="group relative flex w-[86%] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-[#E4DFD4] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(28,32,28,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A70]/60 hover:shadow-[0_30px_60px_-25px_rgba(28,32,28,0.4)] sm:w-[60%] sm:p-8 md:w-auto"
              >
                {/* gold top accent */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C9B287] via-[#B49A70] to-transparent" />

                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex text-[#B49A70]" aria-label={`${starCount} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < starCount ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EDE3] text-[#B49A70] transition-colors group-hover:bg-[#B49A70] group-hover:text-white">
                      <Quote size={18} fill="currentColor" />
                    </span>
                  </div>

                  <p className="font-serif text-[17px] leading-relaxed text-[#2A2E2A] sm:text-lg">“{body}”</p>
                </div>

                <div className="mt-7 flex items-center gap-4 border-t border-[#EAE6DE] pt-5">
                  {photo ? (
                    <img
                      src={photo}
                      alt={author}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full border-2 border-[#E4D2AB] object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D9C49B] to-[#B49A70] font-semibold text-[#1C201C]">
                      {author?.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h4 className="truncate font-serif text-base font-semibold leading-tight text-[#1C201C]">{author}</h4>
                    <p className="truncate text-xs text-[#77766E]">{t.role || 'Verified Buyer'}</p>
                    {affiliation && (
                      <p className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full bg-[#F1EDE3] px-2.5 py-1 text-[11px] font-medium text-[#8C7146]">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{affiliation}</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-3 text-center text-xs text-[#9A978C] md:hidden">Swipe to read more</p>
      </div>

      {/* Testimonial Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-[#DDD8CE] bg-white p-6 shadow-2xl sm:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 rounded-full p-1 text-[#888] transition hover:bg-[#F1EDE3] hover:text-[#1C201C] cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B49A70]">
                  <Sparkles size={13} />
                  <span>Client Experience</span>
                </span>
                <h3 className="mt-1 font-serif text-2xl text-[#1C201C]">Share Your Experience</h3>
                <p className="text-xs text-[#6E6D66]">
                  Your review will be stored in our verified database and shared with prospective clients.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6E6D66] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-[#DDD8CE] px-4 py-2.5 text-sm text-[#1C201C] focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6D66] mb-1">Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Private Investor"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl border border-[#DDD8CE] px-4 py-2.5 text-sm text-[#1C201C] focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6D66] mb-1">Acquisition / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Civil Lines Estate"
                      value={property}
                      onChange={(e) => setProperty(e.target.value)}
                      className="w-full rounded-xl border border-[#DDD8CE] px-4 py-2.5 text-sm text-[#1C201C] focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E6D66] mb-1.5">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer p-1 text-[#B49A70] transition hover:scale-110"
                      >
                        <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E6D66] mb-1">Your Review / Testimonial</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your advisory experience, property verification, and transaction satisfaction..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-[#DDD8CE] px-4 py-2.5 text-sm text-[#1C201C] focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-[#DDD8CE] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#666] hover:bg-[#F8F6F2] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1C201C] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-black disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-[#B49A70]" />
                        <span>Submitting…</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} className="text-[#B49A70]" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TestimonialsSection;
