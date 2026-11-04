import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useSuperAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide SuperAdmin root credentials.');
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
        setError(`Access Blocked: Account is locked out for ${err.data?.remainingMinutes || 30} minutes due to 5 consecutive failed authentication attempts.`);
      } else {
        setError(err.message || 'Unauthorized: Invalid SuperAdmin credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('owner@plutoplat.com');
    setPassword('MasterOwnerPass@2026');
    setError('');
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
              SuperAdmin Executive Control
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151A16] border border-[#263028] text-xs font-medium text-[#9B988E]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Subdomain: <code className="text-white font-mono font-semibold">superadmin.plutoplat.com</code>
        </div>
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
                Root Authority Portal
              </div>
              <h2 className="font-serif text-2xl font-normal leading-snug text-white mb-4">
                Executive Governance & Platform Control
              </h2>
              <p className="text-xs text-[#9B988E] leading-relaxed">
                SuperAdmin root console for luxury property approvals, licensed agent moderation, RBAC authorization, and real-time security audit trails.
              </p>
            </div>

            <div className="pt-8 border-t border-[#1F2621] space-y-3.5 text-xs text-[#9B988E]">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#B49A70]" />
                <span>Zero-trust JWT authentication architecture</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#B49A70]" />
                <span>Automated immutable audit logging</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#B49A70]" />
                <span>Brute-force account lockout (5-attempt SLA)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B49A70] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Security Clearance Level 0
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                SuperAdmin Authentication
              </h1>
              <p className="text-xs text-[#9B988E] mt-1.5">
                Restricted to authorized platform owners and executive controllers.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xs bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <div>
                  <p className="font-semibold">{error}</p>
                  {lockoutRemaining && (
                    <p className="text-[11px] text-red-300 mt-1">
                      Account locked out for {lockoutRemaining} minutes to mitigate unauthorized brute-force attempts.
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-2">
                  SuperAdmin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@plutoplat.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#181F1A] border border-[#2B382F] rounded-xs text-sm text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF]">
                    Root Access Passkey
                  </label>
                  <span className="text-[11px] text-[#8E8B82]">
                    High-Entropy Secret
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-[#181F1A] border border-[#2B382F] rounded-xs text-sm text-white placeholder:text-[#5E6860] focus:bg-[#1D2520] focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6D66] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-[#B49A70] hover:bg-[#C5AC83] text-[#0A0D0B] font-semibold text-xs uppercase tracking-widest rounded-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Access Platform Control
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Sign-in */}
            <div className="mt-8 pt-6 border-t border-[#202722]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8B82]">
                  Authorized Quick Access
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">ENCRYPTED</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full p-3 bg-[#181F1A] hover:bg-[#202922] border border-[#2B382F] rounded-xs text-left text-xs transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">Julian Beaumont (Platform Owner)</div>
                  <div className="text-[11px] text-[#B49A70]">owner@plutoplat.com</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#B49A70]/15 text-[#B49A70] border border-[#B49A70]/30 rounded-2xs">
                  Fill Credentials
                </span>
              </button>
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

export default Login;
