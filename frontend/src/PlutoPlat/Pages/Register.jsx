import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';
import { AuthLayout, Field, PasswordToggle } from './AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const { login, showToast } = usePropertyStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kanpur, Uttar Pradesh');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const sanitizePhone = (val) => val.replace(/[^\d+]/g, '');
  const mismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const cleanPhone = sanitizePhone(phone);
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check both fields.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password,
        role: 'user',
        location: { city: city.trim() || 'Kanpur', state: 'Uttar Pradesh', country: 'India' },
      };

      const res = await Api.register(payload);
      const registeredUser = res?.data?.user;

      if (!registeredUser) {
        throw new Error(res?.message || 'Registration failed. Please try again.');
      }

      setSuccessMsg('Account created! Taking you to your profile…');
      showToast('Welcome to PlutoPlat! Your account is ready.', 'success');

      login(registeredUser);

      setTimeout(() => navigate('/profile'), 900);
    } catch (err) {
      console.warn('Backend registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      wide
      mode="register"
      heading="Your next address starts with a private account."
      subheading="Join PlutoPlat for privileged access to luxury residences, site visits and verified property listings."
    >
      <div className="mb-7">
        <h2 className="font-serif text-2xl text-[#1C201C] sm:text-[28px]">Create your account</h2>
        <p className="mt-1.5 text-sm font-light text-[#6E6D66]">It takes less than a minute.</p>
      </div>

      {errorMsg && (
        <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div role="status" className="mb-5 flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="reg-name"
          label="Full name"
          icon={User}
          required
          type="text"
          autoComplete="name"
          placeholder="e.g. Rahul Sharma"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Field
          id="reg-email"
          label="Email address"
          icon={Mail}
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="rahul.sharma@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="reg-phone"
            label="Mobile number"
            icon={Phone}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Field
            id="reg-city"
            label="City / preferred location"
            icon={MapPin}
            type="text"
            autoComplete="address-level2"
            placeholder="e.g. Kanpur, Uttar Pradesh"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="reg-password"
            label="Password (min. 8 characters)"
            icon={Lock}
            required
            minLength={8}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            right={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          />
          <Field
            id="reg-confirm"
            label="Confirm password"
            icon={Lock}
            required
            minLength={8}
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            invalid={!!mismatch}
            onChange={(e) => setConfirmPassword(e.target.value)}
            right={<PasswordToggle shown={showConfirmPassword} onToggle={() => setShowConfirmPassword((s) => !s)} />}
          />
        </div>

        {mismatch && <p className="-mt-1 text-[13px] text-red-600">Passwords do not match.</p>}

        <label className="flex cursor-pointer items-start gap-3 pt-1">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#CFC9BB] text-[#B49A70] focus:ring-[#B49A70]/30"
          />
          <span className="text-[13px] leading-relaxed text-[#6E6D66]">
            I agree to PlutoPlat's{' '}
            <Link to="/terms" target="_blank" className="font-medium text-[#1C201C] underline hover:text-[#9A7F52]">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" target="_blank" className="font-medium text-[#1C201C] underline hover:text-[#9A7F52]">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B49A70] text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-[#9E865F] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-[#287A50]">
        <ShieldCheck size={14} /> Secured with 256-bit encryption
      </p>

      <p className="mt-6 border-t border-[#EAE6DE] pt-5 text-center text-sm text-[#6E6D66]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#1C201C] underline decoration-[#B49A70] underline-offset-4 hover:text-[#9A7F52]">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
