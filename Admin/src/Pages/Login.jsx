import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../context/AdminContext';
import logo from '../assets/logo1.png';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A70]';

const Brand = ({ dark = false }) => (
  <Link to="/" className={`inline-flex items-center`}>
    <img
    src={logo}
    alt="Pluto Plot"
    className="h-14 w-auto  object-contain"
  />
    <span
      className={`whitespace-nowrap font-serif text-2xl font-semibold tracking-tight ${
        dark ? 'text-white' : 'text-[#1C201C]'
      }`}
    >
      Pluto<span className="text-[#B49A70]">Plat</span>
    </span>
  </Link>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => location.state?.message || '');
  const [lockoutRemaining, setLockoutRemaining] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email and password.');
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
        const mins = err.data?.remainingMinutes || 30;
        setLockoutRemaining(mins);
        setError(`Account locked after too many failed attempts. Try again in ${mins} minutes.`);
      } else {
        setError(err.message || 'Incorrect email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[#DEDAD1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#1C201C] placeholder:text-[#9E9B91] transition-colors focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/25';

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
            Your listings and inquiries, in one place.
          </h2>
          <ul className="mt-10 space-y-4 text-[#D5CFBF]">
            {['Manage your properties', 'Reply to buyer inquiries', 'Track listing approval'].map((t) => (
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

          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1C201C]">Welcome back</h1>
          <p className="mt-2 text-base text-[#6E6D66]">Sign in to your partner account.</p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#1C201C]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className={`rounded text-sm text-[#8F7648] hover:underline ${focusRing}`}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8E8B82] hover:text-[#1C201C] ${focusRing}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#6E6D66]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#DEDAD1] text-[#B49A70] focus:ring-[#B49A70]"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading || lockoutRemaining !== null}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1C201C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#B49A70] hover:text-[#121612] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6E6D66]">
            New partner?{' '}
            <Link
              to="/register"
              className={`rounded font-semibold text-[#1C201C] underline decoration-[#B49A70] underline-offset-4 hover:text-[#8F7648] ${focusRing}`}
            >
              Request access
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;