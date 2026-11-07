import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, BedDouble, CalendarCheck, MapPin, Ruler } from 'lucide-react';

/**
 * Split layout for Login / Register.
 * props: mode ('login' | 'register'), heading, subheading, wide, image (optional photo URL)
 * Desktop: left showcase panel + right form. Mobile: compact banner + form card.
 */

const css = `
.au-shell{min-height:100vh;background:#F6F3EC}
.au-aside{position:relative;overflow:hidden;color:#fff;background:linear-gradient(160deg,#0F130F 0%,#1B211B 55%,#252A1F 100%)}
.au-aside::before{content:"";position:absolute;inset:0;background:
  radial-gradient(520px 420px at 90% 0%,rgba(201,178,135,.30),transparent 70%),
  radial-gradient(420px 360px at 0% 100%,rgba(201,178,135,.16),transparent 70%);}
.au-aside::after{content:"";position:absolute;inset:0;opacity:.5;
  background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:22px 22px;
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 40%,transparent);mask-image:linear-gradient(to bottom,transparent,#000 40%,transparent);}
.au-bg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}
.au-inner{position:relative;z-index:2;display:flex;flex-direction:column;padding:20px 20px 44px}
.au-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.au-logo{font-family:inherit;font-size:30px;letter-spacing:-.01em;color:#fff}
.au-logo b{font-weight:400;color:#D9C49B}
.au-back{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;color:rgba(255,255,255,.85);
  border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);padding:8px 14px;border-radius:999px;transition:.2s}
.au-back:hover{background:rgba(255,255,255,.14);color:#fff}
.au-copy{margin-top:28px;max-width:30rem}
.au-copy h1{font-size:27px;line-height:1.18;font-weight:400}
.au-copy p{margin-top:12px;font-size:14px;line-height:1.65;font-weight:300;color:rgba(255,255,255,.72)}
.au-showcase{display:none}
.au-form{position:relative;z-index:3;margin-top:-22px;border-radius:24px 24px 0 0;background:#F6F3EC;
  display:flex;justify-content:center;align-items:flex-start;padding:28px 14px 40px}
.au-card{width:100%;background:#fff;border:1px solid #E8E3D8;border-radius:20px;padding:24px 20px;
  box-shadow:0 30px 60px -30px rgba(28,32,28,.30)}
.au-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;margin-bottom:26px;background:#F1EDE3;border-radius:12px}
.au-tabs a{text-align:center;padding:11px 8px;border-radius:9px;font-size:14px;font-weight:600;color:#7A786F;transition:.2s}
.au-tabs a.on{background:#fff;color:#1C201C;box-shadow:0 2px 8px rgba(28,32,28,.10)}

/* glass property card */
.au-prop{width:100%;max-width:26rem;border-radius:20px;overflow:hidden;background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:0 30px 60px -20px rgba(0,0,0,.55)}
.au-prop-img{position:relative;height:150px;background:linear-gradient(180deg,#E9D9B4 0%,#C9B287 45%,#7C6A47 100%)}
.au-prop-img svg{position:absolute;left:0;bottom:0;width:100%;height:100%}
.au-badge{position:absolute;top:12px;left:12px;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;
  color:#1C201C;background:rgba(255,255,255,.92);padding:5px 10px;border-radius:999px}
.au-prop-body{padding:16px 18px 18px}
.au-prop-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.au-prop h3{font-size:19px;font-weight:400;line-height:1.2}
.au-loc{display:flex;align-items:center;gap:5px;margin-top:5px;font-size:12px;color:rgba(255,255,255,.65)}
.au-price{font-size:19px;color:#E4D2AB;white-space:nowrap}
.au-meta{display:flex;gap:18px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.14);font-size:12.5px;color:rgba(255,255,255,.8)}
.au-meta span{display:inline-flex;align-items:center;gap:6px}
.au-chip{display:inline-flex;align-items:center;gap:10px;margin:-18px 0 0 auto;position:relative;z-index:2;
  background:#fff;color:#1C201C;border-radius:14px;padding:10px 14px;font-size:12px;box-shadow:0 18px 40px -12px rgba(0,0,0,.5)}
.au-chip i{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#F1EAD8;color:#9A7F52}
.au-chip small{display:block;color:#7A786F;font-size:11px}

@media (min-width:640px){
  .au-inner{padding:32px 40px 48px}
  .au-copy h1{font-size:32px}
  .au-form{padding:32px 28px 48px}
  .au-card{padding:34px}
}
@media (min-width:1024px){
  .au-shell{display:flex;align-items:stretch}
  .au-aside{flex:0 0 50%;position:sticky;top:0;height:100vh}
  .au-inner{height:100%;padding:40px 56px 44px}
  .au-copy{margin-top:auto}
  .au-copy h1{font-size:42px;line-height:1.12}
  .au-copy p{font-size:16px}
  .au-showcase{display:flex;flex-direction:column;margin-top:32px}
  .au-form{flex:1;margin-top:0;border-radius:0;align-items:center;min-height:100vh;padding:48px 32px;
    background:radial-gradient(600px 400px at 100% 0%,rgba(201,178,135,.18),transparent 70%),#F6F3EC}
}
@media (min-width:1024px) and (max-height:720px){
  .au-showcase{display:none}
}
`;

export const AuthLayout = ({ children, mode = 'login', image, heading, subheading, wide = false }) => (
  <div className="au-shell">
    <style>{css}</style>

    <aside className="au-aside">
      {image && <img className="au-bg-img" src={image} alt="" />}

      <div className="au-inner">
        <div className="au-top">
          <Link to="/" className="au-logo font-serif">
            Pluto<b>Plat</b>.
          </Link>
          <Link to="/" className="au-back">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>

        <div className="au-copy">
          <h1 className="font-serif">{heading}</h1>
          <p>{subheading}</p>
        </div>

        {/* Sample listing card – replace with a real featured property if you like */}
        <div className="au-showcase" aria-hidden="true">
          <div className="au-prop">
            <div className="au-prop-img">
              <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMax slice">
                <circle cx="320" cy="42" r="22" fill="#FFF3D6" opacity=".9" />
                <path d="M0 150V96h40V70h46v26h30V52h58v44h36V80h50v16h40V62h44v34h56v54z" fill="#4B4230" opacity=".55" />
                <path d="M70 150V92l60-34 60 34v58z" fill="#1C201C" />
                <path d="M130 150V58M70 92h120" stroke="#C9B287" strokeWidth="1.2" fill="none" />
                <path d="M92 112h22v20H92zM146 112h22v20h-22zM118 150v-26h24v26z" fill="#E9D9B4" opacity=".85" />
                <path d="M230 150V84h80v66z" fill="#2A2F28" />
                <path d="M246 100h14v14h-14zM278 100h14v14h-14zM246 126h14v14h-14zM278 126h14v14h-14z" fill="#E9D9B4" opacity=".8" />
              </svg>
              <span className="au-badge"><BadgeCheck size={13} /> Verified listing</span>
            </div>
            <div className="au-prop-body">
              <div className="au-prop-row">
                <div>
                  <h3 className="font-serif">The Heritage Residence</h3>
                  <div className="au-loc"><MapPin size={12} /> Civil Lines, Kanpur</div>
                </div>
                <div className="au-price font-serif">₹4.8 Cr</div>
              </div>
              <div className="au-meta">
                <span><BedDouble size={14} /> 4 BHK</span>
                <span><Ruler size={14} /> 3,200 sq ft</span>
              </div>
            </div>
          </div>
          <div className="au-chip" style={{ maxWidth: '15rem' }}>
            <i><CalendarCheck size={15} /></i>
            <span>
              Site visit confirmed
              <small>Saturday, 11:00 AM</small>
            </span>
          </div>
        </div>
      </div>
    </aside>

    <main className="au-form">
      <div className="au-card" style={{ maxWidth: wide ? '36rem' : '28rem' }}>
        <nav className="au-tabs" aria-label="Account">
          <Link to="/login" className={mode === 'login' ? 'on' : ''}>Sign in</Link>
          <Link to="/register" className={mode === 'register' ? 'on' : ''}>Register</Link>
        </nav>
        {children}
      </div>
    </main>
  </div>
);

/** Reusable input with left icon, optional right slot (e.g. show/hide button) */
export const Field = ({ id, label, icon: Icon, required, right, invalid, ...inputProps }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#3F433E]">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <div className="relative">
      <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A887F]" />
      <input
        id={id}
        required={required}
        {...inputProps}
        className={`h-12 w-full rounded-md border bg-[#FBFAF7] pl-11 ${right ? 'pr-12' : 'pr-4'} text-base text-[#1C201C] placeholder:text-[#A9A69B] transition focus:outline-none focus:ring-2 sm:text-sm ${
          invalid
            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
            : 'border-[#DDD8CE] focus:border-[#B49A70] focus:ring-[#B49A70]/20'
        }`}
      />
      {right}
    </div>
  </div>
);

export const PasswordToggle = ({ shown, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-[#8A887F] transition hover:text-[#1C201C]"
    aria-label={shown ? 'Hide password' : 'Show password'}
    title={shown ? 'Hide password' : 'Show password'}
  >
    {shown ? <EyeOffIcon /> : <EyeIcon />}
  </button>
);

// tiny inline icons so this file needs no extra imports
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.9 10.9 0 0112 19c-6.5 0-10-7-10-7a18.5 18.5 0 015.06-5.94M9.9 5.1A10.9 10.9 0 0112 5c6.5 0 10 7 10 7a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
    <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
  </svg>
);

export default AuthLayout;