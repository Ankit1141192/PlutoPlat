import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Volume2, VolumeX, Play, Pause, 
  Sparkles 
} from 'lucide-react';
import heroVideo from '../../assets/HeroSection.mp4';
import { usePropertyStore } from '../../context/PropertyContext';

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

  const handleQuickTagClick = (tag) => {
    navigate(`/properties?location=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative min-h-[75vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#1C201C] pt-16 pb-8 sm:pt-24 sm:pb-20">
      {/* Background Video with Luxury Cinematic Overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover scale-105 transform filter brightness-90 contrast-105"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Layered Rich Gradient Overlays for maximum readability and prestige */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C201C] via-[#1C201C]/50 to-[#1C201C]/70" />
        <div className="absolute inset-0 bg-black/30 backdrop-contrast-[1.05]" />
      </div>

      {/* Floating Video Media Controls (bottom right) */}
      <div className="absolute bottom-19 right-7 z-20 hidden md:flex items-center gap-2 bg-[#1C201C]/75 backdrop-blur-md border border-[#B49A70]/30 rounded-full px-3 py-1.5 text-xs text-[#EBE7DF] shadow-lg">
        <button
          onClick={togglePlayback}
          className="p-1.5 hover:text-[#B49A70] transition-colors rounded-full"
          title={isPlaying ? 'Pause ambient video' : 'Play ambient video'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <span className="w-px h-3 bg-white/20" />
        <button
          onClick={toggleSound}
          className="p-1.5 hover:text-[#B49A70] transition-colors rounded-full flex items-center gap-1.5"
          title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span className="text-[11px] font-medium uppercase tracking-wider">{isMuted ? 'Muted' : 'Audio On'}</span>
        </button>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-3.5 sm:px-6 text-center text-white">
        {/* Prestige Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#C9B287]/40 bg-white/5 px-3 py-1 sm:px-4 sm:py-2 text-[11px] font-medium text-[#EBE7DF] shadow-xl backdrop-blur-md sm:text-[13px]"
          >
            <Sparkles size={12} className="text-[#C9B287] sm:w-[14px] sm:h-[14px]" />
            <span>Kanpur, Uttar Pradesh &middot; Sovereign Collection</span>
          </motion.div>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          style={{ fontSize: 'clamp(1.75rem, min(7vw, 7vh), 4.75rem)' }}
          className="font-serif font-normal leading-[1.1] tracking-tight mb-2 sm:mb-6 max-w-5xl mx-auto drop-shadow-md"
        >
          Find Your Dream Property With Pluto<span className="text-[#B49A70]">Plat</span><span className="text-[#B49A70]">.</span>
        </motion.h1>

        {/* Updated Subtitle & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mb-5 mt-2 sm:mb-10 sm:mt-4 max-w-2xl px-2 space-y-1.5 sm:space-y-2 drop-shadow"
        >
          <p className="text-sm sm:text-xl lg:text-2xl font-semibold tracking-wide text-white flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3">
            <span>Buy</span>
            <span className="text-[#B49A70]">&bull;</span>
            <span>Sell</span>
            <span className="text-[#B49A70]">&bull;</span>
            <span>Rent</span>
            <span className="text-[#B49A70]">&bull;</span>
            <span>Verify</span>
            <span className="text-[#B49A70]">&bull;</span>
            <span>Design</span>
          </p>
          <p className="text-xs sm:text-base lg:text-lg font-light tracking-wide text-[#E5E1D8]">
            Smart Search. Trusted Deals. Better Living.
          </p>
        </motion.div>

        {/* Floating Search Console */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xl border border-white/20 mx-auto max-w-4xl text-[#222522]"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2.5 sm:gap-4 items-stretch md:items-end">
            {/* Location Input */}
            <div className="flex-1 text-left">
              <label className="block text-[10px] sm:text-[11px] font-semibold text-[#6E6D66] uppercase tracking-wider mb-1 sm:mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49A70] sm:w-[17px] sm:h-[17px]" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, Neighborhood or Enclave..."
                  className="w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2 sm:py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-lg sm:rounded-xl focus:outline-none focus:border-[#B49A70] text-xs sm:text-sm text-[#222522] placeholder:text-[#9A9890] transition-colors"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-48 text-left">
              <label className="block text-[10px] sm:text-[11px] font-semibold text-[#6E6D66] uppercase tracking-wider mb-1 sm:mb-2">
                Property Category
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-lg sm:rounded-xl focus:outline-none focus:border-[#B49A70] text-xs sm:text-sm text-[#222522] appearance-none pr-8 sm:pr-9 cursor-pointer transition-colors"
                >
                  <option value="All">All Categories</option>
                  <option value="Homes">Luxury Homes</option>
                  <option value="Villas">Villas</option>
                  <option value="Apartments">Apartments / Penthouses</option>
                  <option value="Plots">Residential Plots</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6D66] pointer-events-none sm:w-[16px] sm:h-[16px]" />
              </div>
            </div>

            {/* Purpose Selector with Sliding Pill (Buy / Rent / Off-Plan) */}
            <div className="w-full md:w-56 text-left">
              <label className="block text-[10px] sm:text-[11px] font-semibold text-[#6E6D66] uppercase tracking-wider mb-1 sm:mb-2">
                Acquisition
              </label>
              <div className="relative flex border border-[#DDD8CE] rounded-lg sm:rounded-xl bg-[#F8F6F2] p-1">
                {/* Animated Sliding Pill */}
                <div
                  className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-md sm:rounded-lg bg-[#1C201C] transition-transform duration-250 ease-out shadow-sm ${
                    purpose === 'Buy'
                      ? 'translate-x-0'
                      : purpose === 'Rent'
                      ? 'translate-x-full'
                      : 'translate-x-[200%]'
                  }`}
                />
                {['Buy', 'Rent', 'Off-Plan'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setPurpose(opt);
                      if (opt === 'Off-Plan') {
                        const el = document.getElementById('off-plan-showcase');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className={`relative z-10 flex-1 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-md sm:rounded-lg transition-colors duration-200 text-center ${
                      purpose === opt ? 'text-white' : 'text-[#6E6D66] hover:text-[#1C201C]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl shrink-0 cursor-pointer"
            >
              <Search size={15} />
              <span>Explore</span>
            </button>
          </form>

          {/* Quick Enclaves Suggestions (Hidden on small screen / mobile / Android) */}
          <div className="mt-4 pt-3 border-t border-[#EAE6DE] hidden sm:flex flex-wrap items-center justify-between text-xs text-[#77766E] gap-2">
            <span className="font-medium text-[#1C201C]">Trending Enclaves:</span>
            <div className="flex flex-wrap gap-2">
              {['Civil Lines Kanpur', 'Swaroop Nagar', 'Tilak Nagar', 'VIP Road & Ganga', 'Dubai Marina', 'Palm Jumeirah'].map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => handleQuickTagClick(place)}
                  className="px-2.5 py-1 bg-[#F8F6F2] hover:bg-[#EBE7DF] text-[#444] hover:text-[#1C201C] border border-[#DDD8CE] rounded-lg transition-colors cursor-pointer"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] left-0 z-[5] h-8 w-full text-[#F8F6F2] sm:h-16 lg:h-24"
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