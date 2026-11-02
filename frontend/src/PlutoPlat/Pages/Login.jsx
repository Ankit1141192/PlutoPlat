import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = usePropertyStore();

  const [role, setRole] = useState('Purchaser'); // 'Purchaser' | 'Owner' | 'Advisor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    login({
      name: formattedName,
      email,
      role,
      city: 'Kanpur, Uttar Pradesh'
    });
    navigate('/profile');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-[#DDD8CE] rounded-sm p-8 sm:p-10 shadow-lg">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Private Client Portal
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Enter your authenticated credentials to access off-market portfolios.
          </p>
        </div>

        {/* Role Selector Tabs */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
              Personal or Family Office Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
              <input
                type="email"
                required
                placeholder="client@familyoffice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider">
                Access Passcode
              </label>
              <a href="#forgot" className="text-[11px] text-[#B49A70] hover:underline">
                Forgot?
              </a>
            </div>
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

          <div className="flex items-center justify-between text-xs text-[#6E6D66] pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded-xs text-[#B49A70] focus:ring-0" defaultChecked />
              <span>Remember workstation</span>
            </label>
            <span className="text-[11px] text-[#287A50] flex items-center gap-1 font-medium">
              <ShieldCheck size={13} /> 256-bit SSL
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Authenticate Session</span>
            <ArrowRight size={14} className="text-[#B49A70]" />
          </button>
        </form>

        {/* Alternate Social Auth */}
        <div className="mt-6 pt-6 border-t border-[#EAE6DE] space-y-3">
          <button
            type="button"
            onClick={() => {
              login({
                name: 'Julian Beaumont',
                email: 'j.beaumont@sovereigntrust.co.uk',
                role: 'Purchaser',
                city: 'Kanpur & London'
              });
              navigate('/profile');
            }}
            className="w-full py-2.5 border border-[#DDD8CE] hover:bg-[#F8F6F2] text-xs font-semibold text-[#1C201C] rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Demo VIP Client Access</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-[#6E6D66]">
          <span>Seeking representation? </span>
          <Link to="/register" className="text-[#B49A70] font-semibold hover:underline">
            Request Client Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
