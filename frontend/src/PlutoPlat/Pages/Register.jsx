import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, ArrowRight, Building } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = usePropertyStore();

  const [role, setRole] = useState('Purchaser');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      name: fullName,
      email,
      phone,
      role,
      city: 'Kanpur, Uttar Pradesh'
    });
    navigate('/profile');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white border border-[#DDD8CE] rounded-sm p-8 sm:p-10 shadow-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Apply for Private Access
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Exclusive entry to private architectural portfolios and off-market releases.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs mb-6">
          {['Purchaser', 'Owner', 'Advisor'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all ${
                role === r
                  ? 'bg-[#1C201C] text-white shadow-2xs'
                  : 'text-[#6E6D66] hover:text-[#1C201C]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
              Full Legal Name / Representative
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
              <input
                type="text"
                required
                placeholder="e.g. Lord Julian Beaumont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Confidential Email
              </label>
              <input
                type="email"
                required
                placeholder="julian@beaumont.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Direct Mobile Telephone
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
              Desired Passcode
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
            </div>
          </div>

          <div className="text-[11px] text-[#77766E] leading-relaxed pt-1">
            By registering, you agree to execute our Standard Mutual Confidentiality and Non-Circumvention protocols.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Submit Application for Credentials</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#6E6D66]">
          <span>Already possess authenticated credentials? </span>
          <Link to="/login" className="text-[#1C201C] font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
