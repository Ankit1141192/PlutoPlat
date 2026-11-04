import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAdminStore } from '../context/AdminContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your registered agent email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setLockoutRemaining(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 423 || err.data?.isLocked) {
        setLockoutRemaining(err.data?.remainingMinutes || 30);
        setError(`Security Lockout: Account temporarily locked due to multiple failed login attempts. Please wait ${err.data?.remainingMinutes || 30} minutes.`);
      } else {
        setError(err.message || 'Invalid agent email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass = 'Password@123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col justify-between selection:bg-[#B49A70] selection:text-white">
      {/* Top Header */}
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
              Agent & Partner Portal
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBE7DF]/60 border border-[#DEDAD1] text-xs font-medium text-[#6E6D66]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          Subdomain: <code className="text-[#1C201C] font-mono font-semibold">admin.plutoplat.com</code>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl bg-white border border-[#DEDAD1] rounded-xs shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Column */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#1C201C] text-[#F7F5F0] p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#B49A70_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B49A70]/15 border border-[#B49A70]/40 text-[#B49A70] text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Licensed Brokers & Partners
              </div>
              <h2 className="font-serif text-3xl font-normal leading-tight text-[#F7F5F0] mb-4">
                Exclusive Workstation for Luxury Real Estate Brokers
              </h2>
              <p className="text-sm text-[#D5CFBF] leading-relaxed">
                Manage high-value portfolio listings, respond to verified high-net-worth inquiries, track property verification status, and monitor site visit bookings.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-[#2D332D]">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#D5CFBF]">
                  <CheckCircle2 className="w-4 h-4 text-[#B49A70]" />
                  Direct site-visit scheduling with pre-qualified buyers
                </div>
                <div className="flex items-center gap-3 text-xs text-[#D5CFBF]">
                  <CheckCircle2 className="w-4 h-4 text-[#B49A70]" />
                  Real-time property moderation status alerts
                </div>
                <div className="flex items-center gap-3 text-xs text-[#D5CFBF]">
                  <CheckCircle2 className="w-4 h-4 text-[#B49A70]" />
                  Role-based access security with session encryption
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C201C]">
                Sign In to Agent Portal
              </h1>
              <p className="text-sm text-[#6E6D66] mt-2">
                Enter your licensed agent credentials to access your listings and inquiries dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xs bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div className="flex-grow">
                  <p className="font-medium">{error}</p>
                  {lockoutRemaining && (
                    <p className="text-xs text-red-700 mt-1">
                      Account lockout protection is active. Attempting further logins will be blocked until the timer expires.
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-2">
                  Agent Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@plutoplat.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-sm text-[#1C201C] placeholder:text-[#9E9B91] focus:bg-white focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C]">
                    Security Password
                  </label>
                  <span className="text-xs text-[#6E6D66]">
                    Min. 8 characters
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-sm text-[#1C201C] placeholder:text-[#9E9B91] focus:bg-white focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6D66] hover:text-[#1C201C]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6E6D66]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-xs border-[#DEDAD1] text-[#B49A70] focus:ring-[#B49A70]"
                  />
                  Remember workstation device
                </label>
                <span className="text-xs text-[#B49A70] hover:underline cursor-pointer">
                  Security Assistance
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-[#1C201C] hover:bg-[#2D332D] text-[#F7F5F0] rounded-xs text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Workstation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Sign-in for immediate testing */}
            <div className="mt-8 pt-6 border-t border-[#DEDAD1]/70">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6D66] mb-3">
                Quick Demo Credentials (One-Click)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('m.sharma@plutoplat.com')}
                  className="px-3.5 py-2.5 bg-[#F8F6F2] hover:bg-[#EBE7DF] border border-[#DEDAD1] rounded-xs text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-[#1C201C]">Michael Sharma</div>
                  <div className="text-[11px] text-[#6E6D66]">Senior Agent (Pro Partner)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('p.patel@plutoplat.com')}
                  className="px-3.5 py-2.5 bg-[#F8F6F2] hover:bg-[#EBE7DF] border border-[#DEDAD1] rounded-xs text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-[#1C201C]">Priya Patel</div>
                  <div className="text-[11px] text-[#6E6D66]">Verified Broker (Mumbai)</div>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-[#6E6D66] border-t border-[#DEDAD1]/60">
        © 2026 PlutoPlat Global Real Estate Network. Authorized agent access only. All activities are audited.
      </footer>
    </div>
  );
};

export default Login;
