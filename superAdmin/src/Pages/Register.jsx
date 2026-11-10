import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  KeyRound
} from 'lucide-react';
import { SuperAdminApi } from '../services/Api';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useSuperAdminStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Kanpur, Uttar Pradesh',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setError('Passwords do not match. Please verify both entries.');
      return;
    }

    setLoading(true);

    try {
      await SuperAdminApi.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'super_admin',
        location: { city: formData.city.trim(), state: 'Uttar Pradesh', country: 'India' },
      });

      setSuccess('SuperAdmin Master Account registered successfully! Redirecting to sign in…');
      showToast('SuperAdmin registered! Please sign in with your credentials.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D0B] text-[#F7F5F0] flex flex-col justify-between selection:bg-[#B49A70] selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-6 border-b border-[#202722] bg-[#0E120F]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#B49A70] flex items-center justify-center text-[#0A0D0B] font-serif font-bold text-xl shadow-lg shadow-[#B49A70]/10">
            Ω
          </div>
          <div>
            <div className="font-serif text-lg tracking-[0.2em] font-bold text-white leading-none uppercase">
              PlutoPlat
            </div>
            <div className="text-[10px] tracking-[0.25em] font-sans text-[#B49A70] font-semibold uppercase mt-0.5">
              SuperAdmin Executive Setup
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D5CFBF] hover:text-[#B49A70] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Root Sign In
        </Link>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-[#121613] border border-[#263028] rounded-xs shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Security Protocols */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#0C0F0D] p-10 flex-col justify-between border-r border-[#263028] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B49A70]/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B49A70]/15 border border-[#B49A70]/40 text-[#B49A70] text-xs font-medium mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                Root Authority Onboarding
              </div>
              <h2 className="font-serif text-2xl font-normal leading-snug text-white mb-4">
                Platform Master Admin Setup
              </h2>
              <p className="text-xs text-[#9B988E] leading-relaxed">
                Creates the supreme administrative entity with full rights to property moderation, broker commission tiers, user account locks, and telemetry ledgers.
              </p>
            </div>

            <div className="pt-8 border-t border-[#1F2621] space-y-3.5 text-xs text-[#9B988E]">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A70]" />
                Unrestricted system moderation rights
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A70]" />
                Direct override on user account security lockouts
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A70]" />
                Encrypted JWT with role: super_admin verification
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                Initialize SuperAdmin
              </h1>
              <p className="text-xs text-[#9B988E] mt-1.5">
                Configure platform owner identity and supreme access credentials.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xs bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xs bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-1.5">
                  Full Name / Title
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Julian Beaumont (Platform Director)"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#181F1A] border border-[#2B382F] rounded-xs text-xs text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-1.5">
                    Root Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="owner@plutoplat.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#181F1A] border border-[#2B382F] rounded-xs text-xs text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-1.5">
                    Phone (10-15 Digits)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99563 46155"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#181F1A] border border-[#2B382F] rounded-xs text-xs text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-1.5">
                  Operating Headquarters Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Kanpur, Uttar Pradesh"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#181F1A] border border-[#2B382F] rounded-xs text-xs text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-1.5">
                    Root Passkey (Min. 8)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#181F1A] border border-[#2B382F] rounded-xs text-xs text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6D66] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-1.5">
                    Confirm Root Passkey
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#181F1A] border border-[#2B382F] rounded-xs text-xs text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6D66] hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-[#B49A70] hover:bg-[#C5AC83] text-[#0A0D0B] font-semibold text-xs uppercase tracking-widest rounded-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A0D0B]" />
                    <span>Registering Master Account...</span>
                  </>
                ) : (
                  <>
                    Initialize SuperAdmin Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#263028] text-center">
              <span className="text-xs text-[#6E6D66]">Already established? </span>
              <Link to="/login" className="text-xs text-[#B49A70] font-semibold hover:underline">
                Sign in to Platform Control
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-[11px] text-[#6E6D66] border-t border-[#202722]">
        All administrative sessions are logged with client IP and hardware fingerprint under ISO 27001 compliance standards.
      </footer>
    </div>
  );
};

export default Register;