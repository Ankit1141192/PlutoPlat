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
  const { stats } = usePropertyStore();

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
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#1C201C] pt-24 pb-20">
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
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-2 bg-[#1C201C]/75 backdrop-blur-md border border-[#B49A70]/30 rounded-full px-3 py-1.5 text-xs text-[#EBE7DF] shadow-lg">
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center text-white">
        {/* Prestige Tag */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-[#252A24]/80 backdrop-blur-md border border-[#B49A70]/40 text-[#EBE7DF] px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold shadow-xl"
          >
            <Sparkles size={13} className="text-[#B49A70]" />
            <span>Kanpur &bull; Uttar Pradesh &bull; Sovereign Collection</span>
          </motion.div>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.08] tracking-tight mb-6 max-w-5xl mx-auto drop-shadow-md"
        >
          Find a Place That <span className="italic font-light text-[#E8D9BF]">Feels Like Home</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-[#E5E1D8] max-w-3xl mx-auto font-light leading-relaxed mb-10 drop-shadow"
        >
          Curating landmark colonial manors, tranquil waterfront sanctuaries along the holy Ganges, and prestigious residential estates across <span className="text-[#E8D9BF] font-normal">Kanpur, Uttar Pradesh</span> and premier global enclaves.
        </motion.p>

        {/* Floating Search Console */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 mx-auto max-w-4xl text-[#222522]"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            {/* Location Input */}
            <div className="flex-1 text-left">
              <label className="block text-[11px] font-semibold text-[#6E6D66] uppercase tracking-wider mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B49A70]" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, Neighborhood or Enclave..."
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] text-sm text-[#222522] placeholder:text-[#9A9890] transition-colors"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-48 text-left">
              <label className="block text-[11px] font-semibold text-[#6E6D66] uppercase tracking-wider mb-2">
                Property Category
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xl focus:outline-none focus:border-[#B49A70] text-sm text-[#222522] appearance-none pr-9 cursor-pointer transition-colors"
                >
                  <option value="All">All Categories</option>
                  <option value="Homes">Luxury Homes</option>
                  <option value="Villas">Villas</option>
                  <option value="Apartments">Apartments / Penthouses</option>
                  <option value="Plots">Residential Plots</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6D66] pointer-events-none" />
              </div>
            </div>

            {/* Purpose Selector with Sliding Pill (Buy / Rent / Off-Plan) */}
            <div className="w-full md:w-56 text-left">
              <label className="block text-[11px] font-semibold text-[#6E6D66] uppercase tracking-wider mb-2">
                Acquisition
              </label>
              <div className="relative flex border border-[#DDD8CE] rounded-xl bg-[#F8F6F2] p-1">
                {/* Animated Sliding Pill */}
                <div
                  className={`absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-lg bg-[#1C201C] transition-transform duration-250 ease-out shadow-sm ${
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
                    className={`relative z-10 flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors duration-200 text-center ${
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
              className="w-full md:w-auto px-8 py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-sm font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shrink-0 cursor-pointer"
            >
              <Search size={16} />
              <span>Explore</span>
            </button>
          </form>

          {/* Quick Enclaves Suggestions */}
          <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex flex-wrap items-center justify-between text-xs text-[#77766E] gap-2">
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

        {/* Live Metrics Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/15 pt-8 text-white/90"
        >
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#E8D9BF] tracking-tight">
                {s.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/70 mt-1 font-light">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;