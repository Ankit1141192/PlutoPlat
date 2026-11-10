import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Mail,
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useSuperAdminStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await SuperAdminApi.forgotPassword({
        email: email.trim().toLowerCase(),
        origin: window.location.origin,
        portal: 'superadmin',
      });
      const token = res?.data?.resetToken || '';
      setResetToken(token);
      setSubmitted(true);
      showToast('Master key recovery email dispatched successfully.', 'success');
    } catch (err) {
      setError(err.message || 'Unable to generate reset token. Verify SuperAdmin email.');
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
              Root Authority Key Recovery
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
          
          {/* Left Column */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#0C0F0D] p-10 flex-col justify-between border-r border-[#263028] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B49A70]/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B49A70]/15 border border-[#B49A70]/40 text-[#B49A70] text-xs font-medium mb-6">
                <ShieldAlert className="w-3.5 h-3.5" />
                Root Passkey Reset Procedure
              </div>
              <h2 className="font-serif text-2xl font-normal leading-snug text-white mb-4">
                Emergency Authority Override
              </h2>
              <p className="text-xs text-[#9B988E] leading-relaxed">
                SuperAdmin root credential recovery issues an encrypted 32-byte cryptographic token with automated audit logging to prevent illicit platform takeovers.
              </p>
            </div>

            <div className="pt-8 border-t border-[#1F2621] space-y-3.5 text-xs text-[#9B988E]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B49A70]" />
                15-minute token TTL with automatic revocation
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B49A70]" />
                Instant lockout reset on successful recovery
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                Recover Root Access
              </h1>
              <p className="text-xs text-[#9B988E] mt-1.5">
                Enter your registered SuperAdmin email to generate an authorized reset token.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xs bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {submitted ? (
              <div className="space-y-5 text-center py-4">
                <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-700 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-white">Root Token Dispatched</h3>
                  <p className="text-xs text-[#9B988E] mt-1">
                    Security token generated for <strong className="text-white font-mono">{email}</strong>.
                  </p>
                </div>

                {resetToken && (
                  <div className="p-4 bg-[#181F1A] border border-[#2B382F] rounded-xs text-left">
                    <div className="text-[11px] uppercase font-semibold text-[#B49A70] tracking-wider mb-1">
                      SuperAdmin Reset Token (15m validity):
                    </div>
                    <div className="text-xs font-mono text-emerald-400 break-all select-all bg-[#0E120F] p-2.5 border border-[#263028]">
                      {resetToken}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Link
                    to={resetToken ? `/reset-password?token=${resetToken}` : '/reset-password'}
                    className="w-full py-3.5 px-6 bg-[#B49A70] hover:bg-[#C5AC83] text-[#0A0D0B] font-semibold text-xs uppercase tracking-widest rounded-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#B49A70] hover:underline cursor-pointer"
                  >
                    Resend or request new token
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#D5CFBF] mb-2">
                    SuperAdmin Registered Email
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#B49A70] hover:bg-[#C5AC83] text-[#0A0D0B] font-semibold text-xs uppercase tracking-widest rounded-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0A0D0B]" />
                      <span>Generating Root Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Reset Token</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[#263028] text-center">
              <Link to="/login" className="text-xs text-[#B49A70] font-semibold hover:underline">
                Return to Root Sign In
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

export default ForgotPassword;