import React from 'react';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#6E6D66] hover:text-[#1C201C] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="bg-white border border-[#DDD8CE] p-8 sm:p-12 rounded-sm shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B49A70] mb-3">
            <ShieldCheck size={16} />
            <span>Fiduciary Discretion Protocol</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal mb-4">
            Confidentiality & Privacy Policy
          </h1>
          <p className="text-xs text-[#77766E] mb-8 font-mono">
            Effective Date: January 1, 2026 &bull; Sovereign Compliance Group
          </p>

          <div className="space-y-8 text-xs sm:text-sm text-[#555] font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                1. Institutional Commitment to Client Discretion
              </h2>
              <p>
                PlutoPlat International Real Estate Inc. operates under strict fiduciary discretion standards. We recognize that high-profile individuals, single-family offices, and sovereign wealth entities require absolute confidentiality when reviewing or executing transactions in prime real estate.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                2. Data Ingestion & Security Protocols
              </h2>
              <p>
                Any personal dossier, proof of funds, or entity structuring documentation submitted to PlutoPlat is encrypted using bank-grade AES-256 standards. We never sell, lease, syndicate, or broker client data to third-party ad networks or marketing registries.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                3. Non-Disclosure & Off-Market Listings
              </h2>
              <p>
                Prospective buyers requesting access to confidential off-market archives agree to hold all property specifications, architectural blueprints, and owner identities in strict confidence. Violation of non-disclosure terms is subject to injunctive relief under California and Delaware state law.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                4. Direct Inquiries & Data Rights
              </h2>
              <p>
                Clients may request the discrete deletion of their inquiry archives, scheduled itinerary records, or authenticated accounts at any time by contacting our Senior Compliance Desk at <span className="text-[#1C201C] font-mono">compliance@plutoplat.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
