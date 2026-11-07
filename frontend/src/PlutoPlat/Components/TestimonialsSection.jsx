import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const TestimonialsSection = () => {
  const { testimonials = [] } = usePropertyStore();

  if (!testimonials.length) return null;

  const average = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length;

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

          {/* Rating summary (calculated from the testimonials) */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#E2DCCE] bg-white px-5 py-2.5 shadow-sm">
            <span className="flex text-[#B49A70]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill={i < Math.round(average) ? 'currentColor' : 'none'} />
              ))}
            </span>
            <span className="text-sm font-semibold text-[#1C201C]">{average.toFixed(1)}</span>
            <span className="text-sm text-[#77766E]">from {testimonials.length} reviews</span>
          </div>
        </div>

        {/* Cards: swipeable on phones, grid on larger screens */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-8 [&::-webkit-scrollbar]:hidden">
          {testimonials.map((t, idx) => (
            <motion.article
              key={t.id}
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
                  <div className="flex text-[#B49A70]" aria-label={`${t.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < t.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EDE3] text-[#B49A70] transition-colors group-hover:bg-[#B49A70] group-hover:text-white">
                    <Quote size={18} fill="currentColor" />
                  </span>
                </div>

                <p className="font-serif text-[17px] leading-relaxed text-[#2A2E2A] sm:text-lg">“{t.content}”</p>
              </div>

              <div className="mt-7 flex items-center gap-4 border-t border-[#EAE6DE] pt-5">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.client}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-full border-2 border-[#E4D2AB] object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D9C49B] to-[#B49A70] font-semibold text-[#1C201C]">
                    {t.client?.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <h4 className="truncate font-serif text-base font-semibold leading-tight text-[#1C201C]">{t.client}</h4>
                  <p className="truncate text-xs text-[#77766E]">{t.role}</p>
                  {t.property && (
                    <p className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full bg-[#F1EDE3] px-2.5 py-1 text-[11px] font-medium text-[#8C7146]">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{t.property}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-[#9A978C] md:hidden">Swipe to read more</p>
      </div>
    </section>
  );
};

export default TestimonialsSection;