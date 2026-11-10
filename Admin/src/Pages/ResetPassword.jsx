import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const { showToast } = useAdminStore();

  const [token, setToken] = useState(tokenFromUrl);

  React.useEffect(() => {
    const t = searchParams.get('token');
    if (t) setToken(t);
  }, [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('A valid reset token is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);

    try {
      await AdminApi.resetPassword({
        token: token.trim(),
        newPassword: password,
      });

      setSubmitted(true);
      showToast('Workstation password reset successfully. Please sign in.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The recovery token may be expired or invalid.');
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
                Security Credentials Update
              </div>
              <h2 className="font-serif text-3xl font-normal leading-tight text-[#F7F5F0] mb-4">
                Set Workstation Security Key
              </h2>
              <p className="text-sm text-[#D5CFBF] leading-relaxed">
                Choose a strong password of at least 8 characters to safeguard your luxury portfolio listings and client communication data.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-[#2D332D]">
              <div className="flex items-center gap-3 text-xs text-[#D5CFBF]">
                <ShieldCheck className="w-4 h-4 text-[#B49A70]" />
                Argon2 / SHA-256 password hashing with lockout protection
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C201C]">
                Set New Password
              </h1>
              <p className="text-sm text-[#6E6D66] mt-2">
                Enter your recovery token and select a new secure password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xs bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {submitted ? (
              <div className="space-y-4 text-center py-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#1C201C]">Password Updated Successfully</h3>
                  <p className="text-sm text-[#6E6D66] mt-1">
                    Your password has been changed. Redirecting to sign in...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                    Recovery Token
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste recovery token"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-xs font-mono text-[#1C201C] placeholder:text-[#9E9B91] focus:bg-white focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                    New Password (Min. 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C201C] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6D66]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-[#F8F6F2]/50 border border-[#DEDAD1] rounded-xs text-sm text-[#1C201C] placeholder:text-[#9E9B91] focus:bg-white focus:outline-none focus:border-[#B49A70] focus:ring-1 focus:ring-[#B49A70] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6D66] hover:text-[#1C201C]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#1C201C] hover:bg-[#2D332D] text-[#F7F5F0] rounded-xs text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[#DEDAD1]/60 text-center">
              <Link to="/login" className="text-xs font-semibold text-[#1C201C] hover:text-[#B49A70]">
                Cancel and Return to Sign In
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

export default ResetPassword;