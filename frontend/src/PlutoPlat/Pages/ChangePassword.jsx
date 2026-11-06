import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, KeyRound, ShieldCheck, Eye, EyeOff, 
  ArrowLeft, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword, user, showToast } = usePropertyStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('New passcode must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('The new passcode confirmation does not match.');
      return;
    }

    const res = changePassword({ currentPassword, newPassword });
    if (res.success) {
      setSuccessMsg('Your security passcode has been updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } else {
      setErrorMsg(res.message || 'Failed to update passcode.');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen flex flex-col justify-center px-4 sm:px-6">
      <div className="max-w-md mx-auto w-full">
        {/* Back Link */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs text-[#6E6D66] hover:text-[#1C201C] transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={14} />
          <span>Return to Profile & Dossier</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-[#DDD8CE] rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#B49A70]/10 text-[#B49A70] flex items-center justify-center mx-auto mb-3">
              <KeyRound size={26} />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C201C] font-normal mb-1">
              Change Passcode
            </h1>
            <p className="text-xs text-[#6E6D66] font-light">
              Update your account credentials to keep your acquisitions vault and client dossier secure.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                Current Passcode
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xl focus:outline-none focus:border-[#B49A70] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B82] hover:text-[#1C201C]"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                New Passcode (min 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xl focus:outline-none focus:border-[#B49A70] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B82] hover:text-[#1C201C]"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] mb-1.5">
                Confirm New Passcode
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xl focus:outline-none focus:border-[#B49A70] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B82] hover:text-[#1C201C]"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Criteria Info */}
            <div className="p-3 bg-[#F8F6F2] rounded-xl border border-[#EAE6DE] text-[11px] text-[#6E6D66] space-y-1">
              <span className="font-semibold text-[#1C201C] block">Security Standards:</span>
              <p className="flex items-center gap-1.5">
                <span className={newPassword.length >= 8 ? 'text-[#10B981]' : 'text-[#8E8B82]'}>&bull;</span>
                <span>Minimum 8 alphanumeric characters</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className={newPassword && newPassword === confirmPassword ? 'text-[#10B981]' : 'text-[#8E8B82]'}>&bull;</span>
                <span>Passcodes match identically</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck size={15} />
              <span>Update Security Passcode</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
