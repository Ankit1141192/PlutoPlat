import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  MapPin,
  Plus,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  ArrowUpDown
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ITEMS_PER_PAGE = 6;

const Testimonials = () => {
  const { testimonials = [], addTestimonial, user, showToast } = usePropertyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('all'); // all, 5, 4
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form State
  const [clientName, setClientName] = useState(user?.name || '');
  const [role, setRole] = useState('Private Client');
  const [property, setProperty] = useState('Civil Lines Luxury Estate');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Average rating
  const averageRating = useMemo(() => {
    if (!testimonials.length) return 5.0;
    const total = testimonials.reduce((sum, t) => sum + (Number(t.rating) || 5), 0);
    return total / testimonials.length;
  }, [testimonials]);

  // Reset to page 1 when search or rating filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, ratingFilter]);

  // Filter ONLY by user name and paragraph as requested:
  // "user search user name and paragraph only"
  const filteredTestimonials = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return testimonials.filter((t) => {
      // Optional rating filter
      if (ratingFilter !== 'all') {
        const star = Number(t.rating) || 5;
        if (star !== Number(ratingFilter)) return false;
      }

      // If no search query, return all matching rating
      if (!query) return true;

      // STRICT USER REQUIREMENT: Search user name and paragraph only!
      const userName = (t.name || t.client || '').toLowerCase();
      const paragraph = (t.content || t.message || '').toLowerCase();

      return userName.includes(query) || paragraph.includes(query);
    });
  }, [testimonials, searchTerm, ratingFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setRatingFilter('all');
    setCurrentPage(1);
  };

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
      setCurrentPage(1);
    } catch (err) {
      console.warn('Testimonial submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-24 text-[#1C201C]">
      {/* Background soft gold ambience */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(700px 380px at 100% 0%, rgba(180,154,112,0.12), transparent 70%), radial-gradient(600px 340px at 0% 100%, rgba(180,154,112,0.08), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DDD8CE] bg-white px-4 py-1.5 shadow-xs">
            <Sparkles size={14} className="text-[#B49A70]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70]">
              Verified Client Voices
            </span>
          </div>

          <h1 className="font-serif text-3xl font-normal leading-tight text-[#1C201C] sm:text-5xl">
            Client Testimonials & Experiences
          </h1>

          <p className="mt-4 text-sm font-light leading-relaxed text-[#6E6D66] sm:text-base">
            Read firsthand accounts from collectors, developers, and private families who acquired their trophy residences and commercial parcels with PlutoPlat.
          </p>

          {/* Rating Summary & Write Review Button */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#DDD8CE] bg-white px-6 py-3 shadow-xs">
              <span className="flex text-[#B49A70]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(averageRating) ? 'currentColor' : 'none'} />
                ))}
              </span>
              <span className="font-serif text-base font-semibold text-[#1C201C]">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-[#77766E]">({testimonials.length} reviews)</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#1C201C] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-black active:scale-95 cursor-pointer"
            >
              <Plus size={15} className="text-[#B49A70]" />
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 rounded-2xl border border-[#DDD8CE] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input (Strictly searching User Name and Paragraph only) */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#9A978C]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client name or paragraph content..."
                className="w-full rounded-xl border border-[#DDD8CE] bg-[#FAF8F5] py-3 pr-10 pl-11 text-sm text-[#1C201C] placeholder-[#9A978C] transition focus:border-[#B49A70] focus:bg-white focus:ring-1 focus:ring-[#B49A70] outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9A978C] hover:text-[#1C201C] cursor-pointer"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Rating Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-medium text-[#77766E] shrink-0">Filter:</span>
              <button
                onClick={() => setRatingFilter('all')}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer shrink-0 ${
                  ratingFilter === 'all'
                    ? 'bg-[#1C201C] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#6E6D66] border border-[#DDD8CE] hover:bg-[#EAE6DE]'
                }`}
              >
                All Stars
              </button>
              <button
                onClick={() => setRatingFilter('5')}
                className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer shrink-0 ${
                  ratingFilter === '5'
                    ? 'bg-[#1C201C] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#6E6D66] border border-[#DDD8CE] hover:bg-[#EAE6DE]'
                }`}
              >
                <Star size={13} className="text-[#B49A70]" fill="currentColor" />
                <span>5 Stars</span>
              </button>
              <button
                onClick={() => setRatingFilter('4')}
                className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-medium transition cursor-pointer shrink-0 ${
                  ratingFilter === '4'
                    ? 'bg-[#1C201C] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#6E6D66] border border-[#DDD8CE] hover:bg-[#EAE6DE]'
                }`}
              >
                <Star size={13} className="text-[#B49A70]" fill="currentColor" />
                <span>4 Stars</span>
              </button>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0ECE2] pt-4 text-xs text-[#77766E]">
            <div className="flex items-center gap-2">
              <span>
                Showing <strong className="text-[#1C201C]">{filteredTestimonials.length}</strong> of{' '}
                <strong>{testimonials.length}</strong> client reviews
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#F1EDE3] px-2 py-0.5 text-[#8C7146]">
                  Search: &ldquo;{searchTerm}&rdquo;
                  <button onClick={() => setSearchTerm('')} className="hover:text-black">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <span className="text-[#8C7146] font-medium">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Testimonials Grid or Empty State */}
        {paginatedList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DDD8CE] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF8F5] text-[#B49A70]">
              <MessageSquare size={26} />
            </div>
            <h3 className="font-serif text-xl text-[#1C201C]">No testimonials matched your search</h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#6E6D66]">
              We couldn&apos;t find any review where the client name or paragraph matches &ldquo;{searchTerm}&rdquo;.
            </p>
            <div className="mt-6">
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 rounded-full bg-[#1C201C] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black cursor-pointer"
              >
                Clear Search & View All
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedList.map((t, idx) => {
              const author = t.client || t.name || 'Private Client';
              const paragraph = t.content || t.message || '';
              const photo = t.avatar || t.imageUrl;
              const affiliation = t.property || t.company;
              const starCount = Number(t.rating) || 5;

              return (
                <motion.article
                  key={t.id || t._id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E4DFD4] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A70]/60 hover:shadow-lg sm:p-8"
                >
                  {/* Top gold accent line */}
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C9B287] via-[#B49A70] to-transparent" />

                  <div>
                    {/* Header: Stars & Quote Icon */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex text-[#B49A70]" aria-label={`${starCount} out of 5 stars`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} fill={i < starCount ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EDE3] text-[#B49A70] transition-colors group-hover:bg-[#B49A70] group-hover:text-white">
                        <Quote size={17} fill="currentColor" />
                      </span>
                    </div>

                    {/* Review Paragraph */}
                    <p className="font-serif text-[15px] leading-relaxed text-[#2A2E2A] sm:text-base">
                      &ldquo;{paragraph}&rdquo;
                    </p>
                  </div>

                  {/* Author Meta */}
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
                        {author.charAt(0)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-serif text-base font-semibold leading-tight text-[#1C201C]">
                        {author}
                      </h4>
                      <p className="truncate text-xs text-[#77766E]">{t.role || 'Verified Buyer'}</p>
                      {affiliation && (
                        <p className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full bg-[#F1EDE3] px-2.5 py-0.5 text-[11px] font-medium text-[#8C7146]">
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{affiliation}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#DDD8CE] pt-8 sm:flex-row">
            <span className="text-xs text-[#77766E]">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredTestimonials.length)} of{' '}
              {filteredTestimonials.length} reviews
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#DDD8CE] bg-white px-3 text-xs font-medium text-[#1C201C] transition hover:bg-[#F1EDE3] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#1C201C] text-white shadow-xs'
                          : 'bg-white border border-[#DDD8CE] text-[#6E6D66] hover:bg-[#F1EDE3]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#DDD8CE] bg-white px-3 text-xs font-medium text-[#1C201C] transition hover:bg-[#F1EDE3] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Trust Assurance Badge */}
        <div className="mt-16 rounded-2xl border border-[#DDD8CE] bg-[#FAF8F5] p-6 sm:p-8 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE6DE] text-[#B49A70] mb-3">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-serif text-lg text-[#1C201C]">Fiduciary Compliance & Verified Testimonials</h4>
            <p className="mt-1 text-xs text-[#6E6D66] leading-relaxed">
              Every review displayed on PlutoPlat is authenticated against recorded deed registrations, verified transaction escrows, and client representation agreements.
            </p>
          </div>
        </div>
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
                  Your review will be authenticated and published across the PlutoPlat verified testimonials portal.
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
                    <label className="block text-xs font-semibold text-[#6E6D66] mb-1">Acquisition / Enclave</label>
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
    </div>
  );
};

export default Testimonials;