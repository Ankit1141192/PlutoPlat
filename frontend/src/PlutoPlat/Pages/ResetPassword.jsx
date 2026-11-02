import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'PLP-ACTIVE-TOKEN';

  const { showToast } = usePropertyStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passcodes do not match. Please verify both fields.', 'error');
      return;
    }
    if (!hasMinLength) {
      showToast('Passcode must contain at least 8 characters.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your security passcode has been updated successfully.', 'success');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-[#DDD8CE] rounded-sm p-8 sm:p-10 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#287A50] bg-[#287A50]/10 px-2.5 py-1 rounded-xs mb-2">
            <ShieldCheck size={12} />
            <span>Cryptographic Session Validated</span>
          </div>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Establish New Passcode
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Token reference: <span className="font-mono text-[#1C201C]">{token}</span>
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-[#287A50]/15 text-[#287A50] rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-xl text-[#1C201C]">Security Passcode Updated</h3>
            <p className="text-xs text-[#6E6D66] font-light">
              Your credentials have been securely provisioned. Redirecting to client portal authentication...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                New Security Passcode
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77766E] hover:text-[#1C201C]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Confirm Security Passcode
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div>

            {/* Passcode Complexity Checklist */}
            <div className="p-3 bg-[#F8F6F2] rounded-xs border border-[#DDD8CE] text-[11px] space-y-1.5">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#287A50]' : 'text-[#8E8B82]'}`}>
                <span>{hasMinLength ? '✓' : '○'}</span>
                <span>Minimum 8 characters in length</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-[#287A50]' : 'text-[#8E8B82]'}`}>
                <span>{hasUpper ? '✓' : '○'}</span>
                <span>Contains uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber && hasSpecial ? 'text-[#287A50]' : 'text-[#8E8B82]'}`}>
                <span>{hasNumber && hasSpecial ? '✓' : '○'}</span>
                <span>Includes numeral and special character</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Update Security Passcode</span>
              <ArrowRight size={14} className="text-[#B49A70]" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-[#6E6D66]">
          <Link to="/login" className="text-[#B49A70] font-semibold hover:underline">
            Cancel and Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
