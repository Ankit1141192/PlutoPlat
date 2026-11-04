import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = usePropertyStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast(`Password reset link has been sent to ${email}.`, 'success');
    }, 700);
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

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="font-serif text-xl text-[#1C201C]">Reset Link Sent Successfully</h3>
            <p className="text-xs text-[#6E6D66] leading-relaxed font-light">
              We have sent password reset instructions to <strong className="text-[#1C201C] font-mono">{email}</strong>. Please check your inbox.
            </p>

            <div className="pt-4 space-y-3">
              <Link
                to="/reset-password?token=PLP-DEMO-TOKEN"
                className="w-full block py-3 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs text-center"
              >
                Proceed to Set New Password
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#B49A70] hover:underline cursor-pointer"
              >
                Didn't receive the email? Resend link
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
