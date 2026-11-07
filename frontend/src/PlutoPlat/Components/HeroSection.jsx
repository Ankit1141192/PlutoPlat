import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Volume2, VolumeX, Play, Pause, Sparkles, Building2, ShieldCheck, CalendarCheck, BadgeCheck } from 'lucide-react';
import heroVideo from '../../assets/HeroSection.mp4';

const purposes = ['Buy', 'Rent', 'Off-Plan'];
const trending = ['Civil Lines Kanpur', 'Swaroop Nagar', 'Tilak Nagar', 'VIP Road & Ganga', 'Dubai Marina', 'Palm Jumeirah'];

const HeroSection = () => {
  const navigate = useNavigate();

  const [locationQuery, setLocationQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [purpose, setPurpose] = useState('Buy'); // 'Buy' | 'Rent' | 'Off-Plan'
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (purpose === 'Off-Plan') {
      const el = document.getElementById('off-plan-showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      navigate('/properties?purpose=Off-Plan');
      return;
    }
    const params = new URLSearchParams();
    if (locationQuery.trim()) params.append('location', locationQuery.trim());
    if (selectedType !== 'All') params.append('type', selectedType);
    if (purpose) params.append('purpose', purpose);
    navigate(`/properties?${params.toString()}`);
  };

  const handlePurposeClick = (opt) => {
    setPurpose(opt);
    if (opt === 'Off-Plan') {
      const el = document.getElementById('off-plan-showcase');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/properties?location=${encodeURIComponent(tag)}`);
  };


  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#1C201C] pb-36 pt-28 sm:pb-44 lg:pb-48">
      {/* Background video */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full scale-105 object-cover brightness-90 contrast-105"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#121512]/80 via-[#121512]/35 to-[#121512]/95" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(700px 400px at 50% 40%, rgba(18,21,18,0.55), transparent 70%)' }}
        />
      </div>

      {/* Video controls */}
      <div className="absolute bottom-20 right-4 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-[#121512]/70 p-1 text-[#EBE7DF] shadow-lg backdrop-blur-md sm:bottom-24 sm:right-7 lg:bottom-28">
        <button
          onClick={togglePlayback}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-[#C9B287]"
          aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button
          onClick={toggleSound}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-[#C9B287]"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center text-white sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9B287]/40 bg-white/5 px-4 py-2 text-xs font-medium text-[#EBE7DF] shadow-xl backdrop-blur-md sm:text-[13px]"
        >
          <Sparkles size={14} className="text-[#C9B287]" />
          <span>Kanpur, Uttar Pradesh &middot; Sovereign Collection</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }}
          className="font-serif text-[38px] font-normal leading-[1.08] tracking-tight drop-shadow-md sm:text-6xl md:text-7xl lg:text-[84px]"
        >
          Find a place that
          <span className="block text-[#E8D9BF]">feels like home.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mb-9 mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-[#E5E1D8] drop-shadow sm:mb-12 sm:text-lg"
        >
          Colonial manors, quiet Ganges-side sanctuaries and prestigious estates across Kanpur, Uttar Pradesh and
          beyond.
        </motion.p>

        {/* Search console */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mx-auto max-w-4xl"
        >
          {/* Purpose tabs */}
          <div className="mx-auto mb-3 grid w-full max-w-sm grid-cols-3 gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-md sm:max-w-md">
            {purposes.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handlePurposeClick(opt)}
                className={`h-10 rounded-full text-sm font-semibold transition-all duration-200 ${
                  purpose === opt
                    ? 'bg-white text-[#1C201C] shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 rounded-3xl border border-white/30 bg-white/95 p-2.5 text-left text-[#222522] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl md:flex-row md:items-stretch md:gap-0 md:p-2"
          >
            {/* Location */}
            <label className="flex flex-1 cursor-text items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors hover:bg-[#F8F6F2] md:py-3">
              <MapPin size={20} className="shrink-0 text-[#B49A70]" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-[#6E6D66]">Location</span>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, neighbourhood or enclave"
                  className="mt-0.5 w-full bg-transparent text-base text-[#222522] placeholder:text-[#A09E96] focus:outline-none sm:text-sm"
                />
              </span>
            </label>

            <span className="hidden w-px self-stretch bg-[#E6E1D6] md:my-3 md:block" />

            {/* Category */}
            <label className="relative flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors hover:bg-[#F8F6F2] md:w-60 md:py-3">
              <Building2 size={20} className="shrink-0 text-[#B49A70]" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-[#6E6D66]">Property type</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent pr-6 text-base text-[#222522] focus:outline-none sm:text-sm"
                >
                  <option value="All">All categories</option>
                  <option value="Homes">Luxury homes</option>
                  <option value="Villas">Villas</option>
                  <option value="Apartments">Apartments / Penthouses</option>
                  <option value="Plots">Residential plots</option>
                </select>
              </span>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6D66]" />
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C9B287] to-[#B49A70] px-8 text-sm font-semibold text-[#161916] shadow-lg transition hover:brightness-110 active:scale-[0.99] md:ml-2 md:h-auto"
            >
              <Search size={18} />
              <span>{purpose === 'Off-Plan' ? 'View off-plan' : 'Search homes'}</span>
            </button>
          </form>

          {/* Trending – scrolls sideways on phones */}
          <div className="mt-5 flex items-center gap-3 text-xs text-white/75">
            <span className="hidden shrink-0 font-medium text-white sm:block">Trending:</span>
            <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-start sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
              {trending.map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => handleQuickTagClick(place)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md transition-colors hover:border-[#C9B287] hover:bg-[#C9B287] hover:text-[#161916]"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>

          {/* Trust row */}
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/70 sm:text-[13px]">
            {[
              { Icon: ShieldCheck, text: 'Legally verified listings' },
              { Icon: CalendarCheck, text: 'Private site visits' },
              { Icon: BadgeCheck, text: 'Dedicated advisor' },
            ].map(({ Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2">
                <Icon size={15} className="text-[#C9B287]" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Curved bottom edge: lower on the left, higher on the right.
          Change text-[#F8F6F2] to match the background of the section below. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] left-0 z-[5] h-14 w-full text-[#F8F6F2] sm:h-20 lg:h-28"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path fill="currentColor" d="M0 82C240 18 480 18 720 62C960 106 1200 106 1440 40V121H0Z" />
        <path
          fill="none"
          stroke="#C9B287"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          opacity="0.8"
          d="M0 82C240 18 480 18 720 62C960 106 1200 106 1440 40"
        />
      </svg>
    </section>
  );
};

export default HeroSection;