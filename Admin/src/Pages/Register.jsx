import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { AdminApi } from '../services/Api';
import { useAdminStore } from '../context/AdminContext';
import logo from '../assets/logo1.png';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A70]';

const inputClass =
  'w-full rounded-xl border border-[#DEDAD1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#1C201C] placeholder:text-[#9E9B91] transition-colors focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/25';

const labelClass = 'mb-2 block text-sm font-medium text-[#1C201C]';
const iconClass = 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8B82]';

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

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useAdminStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Civil Lines, Kanpur',
    agency: '',
    rera: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await AdminApi.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'admin',
        location: { city: formData.city.trim(), state: 'Uttar Pradesh', country: 'India' },
      });

      setSuccess('Account created. Taking you to sign in…');
      showToast('Account created. Redirecting to sign in…', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Could not create your account. Check your details and try again.');
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
            List your properties and meet serious buyers.
          </h2>
          <ul className="mt-10 space-y-4 text-[#D5CFBF]">
            {['Free to apply', 'Add listings in minutes', 'Get inquiries directly'].map((t) => (
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
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>

          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1C201C]">Create your account</h1>
          <p className="mt-2 text-base text-[#6E6D66]">Apply for a partner account.</p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>Full name</label>
              <div className="relative">
                <User className={iconClass} />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={set('name')}
                  placeholder="Michael Sharma"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className={iconClass} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Mobile number</label>
                <div className="relative">
                  <Phone className={iconClass} />
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={set('phone')}
                    placeholder="+91 98210 33445"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={set('city')}
                    placeholder="Kanpur, UP"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="agency" className={labelClass}>Agency (optional)</label>
                <div className="relative">
                  <Building2 className={iconClass} />
                  <input
                    id="agency"
                    type="text"
                    value={formData.agency}
                    onChange={set('agency')}
                    placeholder="Heritage Realty"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className={iconClass} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={set('password')}
                    placeholder="At least 8 characters"
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

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                <div className="relative">
                  <Lock className={iconClass} />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Re-enter password"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8E8B82] hover:text-[#1C201C] ${focusRing}`}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6E6D66]">
            Already have an account?{' '}
            <Link
              to="/login"
              className={`rounded font-semibold text-[#1C201C] underline decoration-[#B49A70] underline-offset-4 hover:text-[#8F7648] ${focusRing}`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;