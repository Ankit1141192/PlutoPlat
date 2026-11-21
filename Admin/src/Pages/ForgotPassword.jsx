import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { AdminApi } from '../services/Api';
import { useAdminStore } from '../context/AdminContext';
import logo from '../assets/logo1.png';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A70]';

const inputClass =
  'w-full rounded-xl border border-[#DEDAD1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#1C201C] placeholder:text-[#9E9B91] transition-colors focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/25';

const Brand = ({ dark = false }) => (
  <Link to="/login" className={`inline-flex items-center gap-2 rounded-lg ${focusRing}`}>
    <img src={logo} alt="" className="h-12 w-12 shrink-0 object-contain" />
    <span
      className={`whitespace-nowrap font-serif text-2xl font-semibold leading-none tracking-tight ${
        dark ? 'text-white' : 'text-[#1C201C]'
      }`}
    >
      Pluto<span className="text-[#B49A70]">Plat</span>
    </span>
  </Link>
);

const ForgotPassword = () => {
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
      const res = await AdminApi.forgotPassword({
        email: email.trim().toLowerCase(),
        origin: window.location.origin,
        portal: 'admin',
      });
      setResetToken(res?.data?.resetToken || '');
      setSubmitted(true);
      showToast('Reset email sent.', 'success');
    } catch (err) {
      setError(err.message || 'Could not send the reset email. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#F8F6F2] selection:bg-[#B49A70] selection:text-white lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#101411] p-12 text-[#F7F5F0] lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#B49A70_1px,transparent_1px)] [background-size:20px_20px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#B49A70]/20 blur-3xl"
        />

        <div className="relative">
          <Brand dark />
        </div>

        <div className="relative max-w-md">
          <h2 className="font-serif text-5xl font-normal leading-[1.1] tracking-tight">
            Locked out? We’ll get you back in.
          </h2>
          <ul className="mt-10 space-y-4 text-[#D5CFBF]">
            {['Reset link sent by email', 'Valid for 15 minutes', 'Takes under a minute'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-base">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#B49A70]" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-[#8E8B82]">© 2026 PlutoPlat</p>
      </aside>

      {/* Form */}
      <main className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>

          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1C201C]">
            {submitted ? 'Check your email' : 'Forgot password?'}
          </h1>
          {!submitted && (
            <p className="mt-2 text-base text-[#6E6D66]">Enter your email and we’ll send you a reset link.</p>
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {submitted ? (
            <div className="mt-8 space-y-6">
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p>
                  We sent reset instructions to <strong className="break-all font-semibold">{email}</strong>.
                </p>
              </div>

              {resetToken && (
                <div>
                  <p className="mb-2 text-sm font-medium text-[#1C201C]">Your reset token</p>
                  <div className="select-all break-all rounded-xl border border-[#DEDAD1] bg-white p-3 font-mono text-xs text-[#1C201C]">
                    {resetToken}
                  </div>
                </div>
              )}

              <Link
                to={resetToken ? `/reset-password?token=${resetToken}` : '/reset-password'}
                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C201C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#B49A70] hover:text-[#121612] ${focusRing}`}
              >
                Reset password
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={`mx-auto block cursor-pointer rounded text-sm text-[#8F7648] hover:underline ${focusRing}`}
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1C201C]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8B82]" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1C201C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#B49A70] hover:text-[#121612] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-[#6E6D66]">
            <ArrowLeft className="h-4 w-4" />
            <Link
              to="/login"
              className={`rounded font-semibold text-[#1C201C] underline decoration-[#B49A70] underline-offset-4 hover:text-[#8F7648] ${focusRing}`}
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;