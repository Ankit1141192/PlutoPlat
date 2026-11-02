import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft, ArrowRight, KeyRound, Clock, Phone } from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = usePropertyStore();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showToast(`Confidential recovery dispatch transmitted to ${email}.`, 'success');
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-[#DDD8CE] rounded-sm p-8 sm:p-10 shadow-lg">
        {/* Brand Link */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-serif text-3xl font-normal text-[#1C201C] tracking-tight">
              Pluto<span className="text-[#B49A70]">Plat</span>.
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#B49A70] bg-[#F8F6F2] px-2.5 py-1 rounded-xs mb-2 border border-[#DDD8CE]">
            <KeyRound size={12} />
            <span>Fiduciary Access Recovery</span>
          </div>
          <h2 className="font-serif text-2xl text-[#1C201C] font-normal mb-1">
            Passcode Recovery
          </h2>
          <p className="text-xs text-[#6E6D66] font-light">
            Enter your authenticated personal or family office email to receive a private cryptographic recovery token.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-[#287A50]/15 text-[#287A50] rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheck size={30} />
            </div>
            <h3 className="font-serif text-xl text-[#1C201C]">Recovery Token Dispatched</h3>
            <p className="text-xs text-[#6E6D66] leading-relaxed font-light">
              A private cryptographic magic link has been forwarded to <strong className="text-[#1C201C] font-mono">{email}</strong>. This token remains valid for 15 minutes.
            </p>

            <div className="pt-4 space-y-3">
              <Link
                to="/reset-password?token=PLP-SEC-DEMO"
                className="w-full block py-3 bg-[#1C201C] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs"
              >
                Proceed to Reset Passcode
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#B49A70] hover:underline"
              >
                Did not receive? Resend dispatch
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#6E6D66] tracking-wider mb-1.5">
                Authenticated Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766E]" />
                <input
                  type="email"
                  required
                  placeholder="principal@familyoffice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-[#F8F6F2] border border-[#DDD8CE] text-xs rounded-xs focus:outline-none focus:border-[#B49A70]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#B49A70] hover:bg-[#9E865F] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Transmit Recovery Link</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* Security Note */}
        <div className="mt-8 pt-6 border-t border-[#EAE6DE] space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#77766E]">
            <Phone size={13} className="text-[#B49A70]" />
            <span>VIP Concierge Recovery Desk: <strong>+1 (800) 758-8675</strong></span>
          </div>

          <div className="text-xs">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[#1C201C] font-semibold hover:text-[#B49A70] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Return to Client Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
