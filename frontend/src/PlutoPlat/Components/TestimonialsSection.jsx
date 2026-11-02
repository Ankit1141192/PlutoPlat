import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const TestimonialsSection = () => {
  const { testimonials } = usePropertyStore();

  return (
    <section className="py-28 px-6 bg-[#EFECE4] border-t border-[#DDD8CE]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B49A70] block mb-2">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal mb-4">
            Trusted by Connoisseurs Worldwide
          </h2>
          <p className="text-sm text-[#6E6D66] font-light leading-relaxed">
            Read reflections from international collectors, developers, and principals who selected PlutoPlat for their landmark acquisitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white p-8 border border-[#DDD8CE] rounded-sm flex flex-col justify-between shadow-xs relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex text-[#B49A70]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={24} className="text-[#DDD8CE]" />
                </div>

                <p className="text-xs sm:text-sm text-[#444] leading-relaxed mb-8 font-light italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAE6DE] flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.client}
                  className="w-12 h-12 rounded-full object-cover border border-[#B49A70]/40 shrink-0"
                />
                <div>
                  <h4 className="font-serif text-base text-[#1C201C] font-semibold leading-tight">
                    {t.client}
                  </h4>
                  <p className="text-[11px] text-[#77766E] font-sans">{t.role}</p>
                  <p className="text-[10px] text-[#B49A70] font-mono mt-0.5">{t.property}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
