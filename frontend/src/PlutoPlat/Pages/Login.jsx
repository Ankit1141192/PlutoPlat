import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';
import { AuthLayout, Field, PasswordToggle } from './AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const { login } = usePropertyStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await Api.login({ email: email.trim().toLowerCase(), password });
      const apiUser = res?.data?.user;

      if (!apiUser) {
        throw new Error(res?.message || 'Login failed. Please check your credentials.');
      }

      login(apiUser);
      navigate('/profile');
    } catch (err) {
      console.warn('Login error:', err);
      if (err.status === 423 || err.data?.isLocked) {
        setErrorMsg(`Account locked for ${err.data?.remainingMinutes || 30} minutes due to multiple failed login attempts.`);
      } else {
        setErrorMsg(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="login"
      heading="Welcome back to your private property desk."
      subheading="Sign in to track saved residences, manage site visits and talk to your advisor."
    >
      <div className="mb-7">
        <h2 className="font-serif text-2xl text-[#1C201C] sm:text-[28px]">Client sign in</h2>
        <p className="mt-1.5 text-sm font-light text-[#6E6D66]">
          Enter your registered email and password.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="login-email"
          label="Email address"
          icon={Mail}
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="rajesh.sharma@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <Field
            id="login-password"
            label="Password"
            icon={Lock}
            required
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            right={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-[13px] font-medium text-[#9A7F52] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-[#55574F]">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 cursor-pointer rounded border-[#CFC9BB] text-[#B49A70] focus:ring-[#B49A70]/30"
          />
          <span>Keep me signed in</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1C201C] text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-black active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin text-[#C9B287]" />
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight size={16} className="text-[#C9B287]" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-[#287A50]">
        <ShieldCheck size={14} /> Secured with 256-bit SSL
      </p>

      <p className="mt-6 text-center text-sm text-[#6E6D66]">
        New to PlutoPlat?{' '}
        <Link to="/register" className="font-semibold text-[#1C201C] underline decoration-[#B49A70] underline-offset-4 hover:text-[#9A7F52]">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
