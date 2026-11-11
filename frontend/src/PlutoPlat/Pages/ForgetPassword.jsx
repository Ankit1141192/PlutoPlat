import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, MailCheck, Loader2, AlertCircle } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';

const RESEND_SECONDS = 60;

const ForgetPassword = () => {
  const { showToast } = usePropertyStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Countdown for the "Resend email" button
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendResetLink = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // The reset token is sent only by email. It is never read or shown here.
      await Api.forgotPassword({
        email: email.trim().toLowerCase(),
        origin: window.location.origin,
        portal: 'client',
      });
      setSubmitted(true);
      setCooldown(RESEND_SECONDS);
      showToast('Check your inbox for the reset link.', 'success');
    } catch (err) {
      setErrorMsg(err?.message || 'We could not send the email. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    sendResetLink();
  };

  const handleResend = () => {
    if (cooldown > 0 || loading) return;
    sendResetLink();
  };

  const handleChangeEmail = () => {
    setSubmitted(false);
    setErrorMsg('');
    setCooldown(0);
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
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>

          {!submitted && (
            <>
              <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">Forgot password?</h2>
              <p className="text-xs text-[#6E6D66] font-light">
                Enter your registered email address and we will send you a link to reset your password.
              </p>
            </>
          )}
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2.5"
          >
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          /* ---------- Check your email ---------- */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#F1ECE1] text-[#8A7348] rounded-full flex items-center justify-center mx-auto border border-[#DDD8CE]">
              <MailCheck size={28} strokeWidth={1.6} />
            </div>

            <h3 className="font-serif text-2xl text-[#1C201C]">Check your email</h3>

            <p className="text-sm text-[#6E6D66] leading-relaxed">
              If an account exists for{' '}
              <strong className="text-[#1C201C] font-semibold break-all">{email}</strong>, we have sent a
              link to reset your password.
            </p>

            <ul className="text-xs text-[#6E6D66] bg-[#F8F6F2] border border-[#EAE6DE] rounded-xs p-3.5 text-left space-y-1.5">
              <li>• Open the email and tap the reset link.</li>
              <li>• The link expires in 15 minutes.</li>
              <li>• Can’t find it? Check your spam or promotions folder.</li>
            </ul>

            <div className="pt-2 space-y-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors text-center"
              >
                <ArrowLeft size={14} className="text-[#B49A70]" />
                <span>Back to sign in</span>
              </Link>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="w-full py-3 border border-[#DDD8CE] text-[#1C201C] hover:bg-[#F8F6F2] text-xs font-semibold rounded-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : cooldown > 0 ? (
                  <span>Resend email in {cooldown}s</span>
                ) : (
                  <span>Resend email</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-xs text-[#8A7348] hover:underline cursor-pointer"
              >
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          /* ---------- Email form ---------- */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5"
              >
                Registered email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="rahul.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-sm rounded-xs focus:outline-none focus:border-[#B49A70] focus:ring-2 focus:ring-[#B49A70]/20"
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
                  <span>Sending link…</span>
                </>
              ) : (
                <>
                  <span>Send reset link</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="mt-8 pt-5 border-t border-[#EAE6DE] text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#1C201C] font-semibold hover:text-[#B49A70] transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Return to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;