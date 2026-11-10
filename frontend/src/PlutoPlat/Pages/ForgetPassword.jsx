import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = usePropertyStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await Api.forgotPassword({
        email: email.trim().toLowerCase(),
        origin: window.location.origin,
        portal: 'client',
      });
      const token = res?.data?.resetToken || '';
      setResetToken(token);
      setSubmitted(true);
      showToast('Password reset email dispatched successfully.', 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to request password reset. Please verify your email.');
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
        {/* Brand Link */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Forgot Password?
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Enter your registered email address and we will send you a link to reset your password.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="font-serif text-xl text-[#1C201C]">Reset Link Generated</h3>
            <p className="text-xs text-[#6E6D66] leading-relaxed font-light">
              Password reset instructions have been generated for <strong className="text-[#1C201C] font-mono">{email}</strong>.
            </p>

            {resetToken && (
              <div className="p-3 bg-[#F8F6F2] border border-[#DDD8CE] rounded-xs text-left">
                <div className="text-[10px] uppercase font-semibold text-[#6E6D66] tracking-wider mb-1">
                  Active Reset Token (15m validity):
                </div>
                <div className="text-[11px] font-mono text-[#1C201C] break-all select-all bg-white p-2 border border-[#EAE6DE]">
                  {resetToken}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Link
                to={resetToken ? `/reset-password?token=${resetToken}` : '/reset-password'}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs text-center"
              >
                <span>Reset Password</span>
                <ArrowRight size={14} className="text-[#B49A70]" />
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#B49A70] hover:underline cursor-pointer"
              >
                Need another token? Request again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type="email"
                  required
                  placeholder="rahul.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] disabled:opacity-75 text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Return to login link */}
        <div className="mt-8 pt-5 border-t border-[#EAE6DE] text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#1C201C] font-semibold hover:text-[#B49A70] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
