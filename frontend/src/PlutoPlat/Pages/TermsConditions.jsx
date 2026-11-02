import React from 'react';
import { FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
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
            <FileText size={16} />
            <span>Brokerage & Advisory Protocol</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201C] font-normal mb-4">
            Terms of Representation & Service
          </h1>
          <p className="text-xs text-[#77766E] mb-8 font-mono">
            Governed under international real estate standards &bull; Edition 2026
          </p>

          <div className="space-y-8 text-xs sm:text-sm text-[#555] font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                1. Brokerage Engagement & Agency
              </h2>
              <p>
                PlutoPlat International Real Estate Inc. provides luxury property brokerage, acquisitions advisory, and bespoke architectural marketing. Materials presented on this platform are for informational discovery and do not constitute an unconditional contractual conveyance until formal escrow documentation is fully executed by all parties.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                2. Representation & Pre-Qualification
              </h2>
              <p>
                To preserve owner privacy and ensure the highest security for trophy properties, private on-site viewings require preliminary financial verification or accredited agent representation.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                3. Intellectual Property & Architectural Imagery
              </h2>
              <p>
                All cinematography, floorplans, digital twins, and photography are proprietary to PlutoPlat or our represented estates. Unauthorized reproduction, commercial syndication, or AI harvesting is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-[#1C201C] font-normal mb-3">
                4. Equal Housing Opportunity
              </h2>
              <p>
                PlutoPlat conducts all operations in strict accordance with Federal, State, and International Equal Housing Opportunity standards, offering exceptional service without discrimination on the basis of race, color, religion, sex, handicap, familial status, or national origin.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
