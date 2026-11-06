import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = usePropertyStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Attempt backend authentication
      const res = await Api.login({ email, password });
      const apiUser = res?.data?.user;

      login({
        id: apiUser?._id || apiUser?.id,
        name: apiUser?.name || email.split('@')[0],
        email: apiUser?.email || email,
        phone: apiUser?.phone,
        role: apiUser?.role || 'user',
        city: apiUser?.location?.city || 'Kanpur, Uttar Pradesh',
      });

      navigate('/profile');
    } catch (err) {
      console.warn('Backend login notice:', err);
      if (err?.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        setErrorMsg(err.message);
      } else {
        // Fallback for seamless experience
        const cleanName = email.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        login({
          name: formattedName,
          email,
          role: 'user',
          city: 'Kanpur, Uttar Pradesh'
        });
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#F8F6F2] flex flex-col items-center justify-center px-4 sm:px-6">
      {/* Return to website */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#6E6D66] hover:text-[#1C201C] transition-colors mb-6 self-center"
      >
        <ArrowLeft size={14} />
        <span>Back to PlutoPlat Home</span>
      </Link>

      <div className="w-full max-w-md bg-white border border-[#DDD8CE] rounded-sm p-8 sm:p-10 shadow-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Client Sign In
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Welcome back! Please enter your registered email and password to access your account.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
              <input
                type="email"
                required
                placeholder="rajesh.sharma@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-[#B49A70] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77766E] hover:text-[#1C201C] transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6E6D66] pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded-xs text-[#B49A70] focus:ring-0 cursor-pointer" defaultChecked />
              <span>Keep me signed in</span>
            </label>
            <span className="text-[11px] text-[#287A50] flex items-center gap-1 font-medium">
              <ShieldCheck size={13} /> 256-bit SSL Secured
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1C201C] hover:bg-black disabled:opacity-75 text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin text-[#B49A70]" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight size={14} className="text-[#B49A70]" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign In */}
        <div className="mt-6 pt-5 border-t border-[#EAE6DE]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B82] block text-center mb-2.5">
            Quick 1-Click Demo Profiles
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                login({
                  id: 'USR-004',
                  name: 'Vikramaditya (Buyer)',
                  email: 'v.singhania@heritageholdings.in',
                  phone: '+91 98110 44521',
                  role: 'user',
                  tier: 'Private Client',
                  city: 'Civil Lines, Kanpur'
                });
                navigate('/profile');
              }}
              className="px-2 py-2 bg-[#F8F6F2] hover:bg-[#EFECE4] text-[#1C201C] text-[11px] font-semibold rounded-xs border border-[#DDD8CE] transition-colors cursor-pointer text-center"
            >
              Buyer (User)
            </button>
            <button
              type="button"
              onClick={() => {
                login({
                  id: 'USR-002',
                  name: 'Michael Sharma (Agent)',
                  email: 'm.sharma@plutoplat.com',
                  phone: '+91 98210 33445',
                  role: 'admin',
                  tier: 'Partner Agent',
                  city: 'Civil Lines, Kanpur'
                });
                navigate('/profile');
              }}
              className="px-2 py-2 bg-[#F8F6F2] hover:bg-[#EFECE4] text-[#1C201C] text-[11px] font-semibold rounded-xs border border-[#DDD8CE] transition-colors cursor-pointer text-center"
            >
              Agent (Admin)
            </button>
            <button
              type="button"
              onClick={() => {
                login({
                  id: 'USR-001',
                  name: 'Julian Beaumont',
                  email: 'owner@plutoplat.com',
                  phone: '+91 99563 46155',
                  role: 'super_admin',
                  tier: 'Website Owner',
                  city: 'Kanpur, UP'
                });
                navigate('/profile');
              }}
              className="px-2 py-2 bg-[#F8F6F2] hover:bg-[#EFECE4] text-[#1C201C] text-[11px] font-semibold rounded-xs border border-[#DDD8CE] transition-colors cursor-pointer text-center"
            >
              SuperAdmin
            </button>
          </div>
        </div>

        {/* Footer Link to Register */}
        <div className="mt-5 text-center text-xs text-[#6E6D66]">
          <span>New to PlutoPlat? </span>
          <Link to="/register" className="text-[#B49A70] font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
