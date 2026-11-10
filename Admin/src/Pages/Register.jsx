import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { AdminApi } from '../services/Api';
import { useAdminStore } from '../context/AdminContext';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useAdminStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Civil Lines, Kanpur',
    agency: '',
    rera: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await AdminApi.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'admin',
        location: { city: formData.city.trim(), state: 'Uttar Pradesh', country: 'India' },
      });

      setSuccess('Agent account registered successfully! You can now sign in to your workstation.');
      showToast('Agent account registered! Redirecting to sign in…', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col justify-between selection:bg-[#B49A70] selection:text-white">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#DEDAD1]/60 bg-[#F8F6F2]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#1C201C] flex items-center justify-center text-[#B49A70] font-serif font-bold text-xl shadow-md">
            P
          </div>
          <div>
            <div className="font-serif text-lg tracking-[0.2em] font-bold text-[#1C201C] leading-none uppercase">
              PlutoPlat
            </div>
            <div className="text-[10px] tracking-[0.25em] font-sans text-[#B49A70] font-semibold uppercase mt-0.5">
              Agent Onboarding Desk
            </div>
          </div>
        </div>
        <Link to="/login" className="text-xs font-semibold text-[#1C201C] hover:text-[#B49A70]">
          Already registered? Sign In
        </Link>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-white border border-[#DEDAD1] rounded-xs shadow-xl p-8 sm:p-10">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-semibold text-[#1C201C]">
              Apply for Broker Workstation Access
            </h1>
            <p className="text-xs text-[#6E6D66] mt-1.5 leading-relaxed">
              Register your details to submit verified property listings and receive pre-qualified buyer inquiries.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xs bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xs bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Michael Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="broker@agency.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98210 33445"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                  Operating City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Kanpur, UP"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                  Realty Agency / Firm
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="text"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    placeholder="e.g. Heritage Realty"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                  Password (Min. 8)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs text-[#1C201C] focus:bg-white focus:outline-none focus:border-[#B49A70]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 bg-[#1C201C] hover:bg-[#B49A70] hover:text-[#121612] text-white rounded-xs text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#6E6D66]">
            Already have verified broker access?{' '}
            <Link to="/login" className="font-semibold text-[#1C201C] underline hover:text-[#B49A70]">
              Sign in to Workstation
            </Link>
          </p>
        </div>
      </div>

      <footer className="px-6 py-4 text-center text-xs text-[#6E6D66] border-t border-[#DEDAD1]/60">
        © 2026 PlutoPlat Global Real Estate Network. Authorized agent access only.
      </footer>
    </div>
  );
};

export default Register;
