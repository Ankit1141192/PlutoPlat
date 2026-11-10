import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { AdminApi } from '../services/Api';
import { useAdminStore } from '../context/AdminContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useAdminStore();

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
      const res = await AdminApi.forgotPassword({ email: email.trim().toLowerCase() });
      const token = res?.data?.resetToken || '';
      setResetToken(token);
      setSubmitted(true);
      showToast('Password recovery instructions generated successfully.', 'success');
    } catch (err) {
      setError(err.message || 'Unable to request password recovery. Please verify your email.');
    } finally {
      setLoading(false);
    }
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

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C201C] hover:text-[#B49A70] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </header>

      {/* Main Body */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white border border-[#DEDAD1] rounded-xs shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#1C201C] text-[#F7F5F0] p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#B49A70_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B49A70]/15 border border-[#B49A70]/40 text-[#B49A70] text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Security & Access Recovery
              </div>
              <h2 className="font-serif text-3xl font-normal leading-tight text-[#F7F5F0] mb-4">
                Workstation Access Recovery
              </h2>
              <p className="text-sm text-[#D5CFBF] leading-relaxed">
                Provide your registered broker or agent email to receive a cryptographically signed reset token and regain control of your listings dashboard.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-[#2D332D]">
              <div className="flex items-center gap-3 text-xs text-[#D5CFBF]">
                <ShieldCheck className="w-4 h-4 text-[#B49A70]" />
                Encrypted reset token with 15-minute validity window
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C201C]">
                Forgot Workstation Password
              </h1>
              <p className="text-sm text-[#6E6D66] mt-2">
                Enter your licensed agent email address to initiate password recovery.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xs bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {submitted ? (
              <div className="space-y-5 text-center py-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#1C201C]">Recovery Token Dispatched</h3>
                  <p className="text-sm text-[#6E6D66] mt-1">
                    Instructions dispatched for <strong className="text-[#1C201C] font-mono">{email}</strong>.
                  </p>
                </div>

                {resetToken && (
                  <div className="p-4 bg-[#F8F6F2] border border-[#DEDAD1] rounded-xs text-left">
                    <div className="text-xs uppercase font-semibold text-[#6E6D66] tracking-wider mb-1">
                      Agent Reset Token (15m validity):
                    </div>
                    <div className="text-xs font-mono text-[#1C201C] break-all select-all bg-white p-2.5 border border-[#DEDAD1]">
                      {resetToken}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Link
                    to={resetToken ? `/reset-password?token=${resetToken}` : '/reset-password'}
                    className="w-full py-3.5 px-6 bg-[#1C201C] hover:bg-[#2D332D] text-[#F7F5F0] rounded-xs text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    Proceed to Set New Password
                    <ArrowRight className="w-4 h-4 text-[#B49A70]" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#B49A70] hover:underline cursor-pointer"
                  >
                    Resend or use another email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-2">
                    Registered Agent Email
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#1C201C] hover:bg-[#2D332D] text-[#F7F5F0] rounded-xs text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Token</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[#DEDAD1]/60 text-center">
              <Link to="/login" className="text-xs font-semibold text-[#1C201C] hover:text-[#B49A70]">
                Remember password? Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-[#6E6D66] border-t border-[#DEDAD1]/60">
        © 2026 PlutoPlat Global Real Estate Network. Authorized agent access only.
      </footer>
    </div>
  );
};

export default ForgotPassword;