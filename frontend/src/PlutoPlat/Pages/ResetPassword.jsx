import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';
import { Api } from '../Services/Api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const { showToast } = usePropertyStore();

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
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token.trim()) {
      setErrorMsg('A valid reset verification token is required.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);

    try {
      await Api.resetPassword({
        token: token.trim(),
        newPassword: password,
      });

      setSubmitted(true);
      showToast('Your new password has been updated successfully. Please sign in.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. The token may be expired or invalid.');
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
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Set New Password
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Please choose a secure password with at least 8 characters.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-xl text-[#1C201C]">Password Updated Successfully</h3>
            <p className="text-xs text-[#6E6D66] font-light">
              Your password has been changed. Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Reset Verification Token
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type="text"
                  required
                  placeholder="Paste your 64-character token here"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] font-mono text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div> */}

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                New Password (Min. 8 characters)
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77766E] hover:text-[#1C201C] p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 bg-[#F8F6F2] border text-xs rounded-xs focus:outline-none ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#DDD8CE] focus:border-[#B49A70]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77766E] hover:text-[#1C201C] p-1 cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] text-red-600">Passwords do not match.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1C201C] hover:bg-black disabled:opacity-75 text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight size={14} className="text-[#B49A70]" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#EAE6DE] text-center text-xs text-[#6E6D66]">
          <Link to="/login" className="text-[#B49A70] font-semibold hover:underline">
            Cancel and Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
