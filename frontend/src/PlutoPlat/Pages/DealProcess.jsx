import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, MapPin, Phone, MessageCircle, 
  FileText, ShieldCheck, DollarSign, ArrowRight, Sparkles, Building, ChevronRight, AlertCircle
} from 'lucide-react';
import { usePropertyStore } from '../../context/PropertyContext';

const DealProcess = () => {
  const { deals, updateDealStage, showToast } = usePropertyStore();
  const [selectedDealId, setSelectedDealId] = useState(deals[0]?.id || 'DEAL-7701');

  const activeDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  return (
    <div className="pt-28 pb-24 bg-[#F8F6F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DDD8CE] pb-8 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B49A70] font-semibold mb-2">
              <ShieldCheck size={14} />
              <span>Escrow & Transaction Protocol</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C201C] font-normal">
              Active Deal Process Tracker
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6D66] mt-2 max-w-2xl font-light leading-relaxed">
              Transparent 7-stage acquisition ledger tracking legal due diligence, title deeds, escrow funds, and registry handovers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scheduled-visits"
              className="px-4 py-2.5 bg-white border border-[#DDD8CE] text-[#1C201C] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-2xs hover:bg-[#F8F6F2] transition-colors"
            >
              &larr; Scheduled Visits
            </Link>
            <Link
              to="/my-enquiries"
              className="px-4 py-2.5 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-sm hover:bg-[#9E865F] transition-colors"
            >
              My Enquiries
            </Link>
          </div>
        </div>

        {/* If no deals */}
        {!activeDeal ? (
          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#B49A70]/10 text-[#B49A70] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-serif text-2xl text-[#1C201C] mb-2 font-normal">No Active Deals</h3>
            <p className="text-xs text-[#6E6D66] mb-6 leading-relaxed">
              When you submit an enquiry and complete a site visit, your active transaction pipeline will appear here.
            </p>
            <Link
              to="/properties"
              className="px-6 py-3 bg-[#B49A70] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
            >
              Find a Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Deal Progress & Multi-Stage Pipeline */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Active Deal Summary Card */}
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pb-6 border-b border-[#EAE6DE]">
                  <div className="flex gap-4 items-center">
                    <img
                      src={activeDeal.propertyImage}
                      alt={activeDeal.propertyTitle}
                      className="w-24 h-24 rounded-xl object-cover border border-[#DDD8CE]"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase bg-[#1C201C] text-white px-2 py-0.5 rounded-sm">
                          {activeDeal.id}
                        </span>
                        <span className="text-xs font-semibold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
                          Stage {activeDeal.currentStage} of 7: {activeDeal.stageLabel}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl text-[#1C201C] font-semibold">
                        {activeDeal.propertyTitle}
                      </h2>
                      <p className="text-xs text-[#6E6D66] flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-[#B49A70]" />
                        <span>{activeDeal.propertyLocation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:self-auto self-start">
                    <span className="text-[10px] uppercase font-semibold text-[#8E8B82] block">Agreed Valuation</span>
                    <span className="font-serif text-2xl font-bold text-[#B49A70]">{activeDeal.propertyPrice}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-6">
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-[#1C201C]">Acquisition Milestone Progress</span>
                    <span className="text-[#B49A70]">{Math.round((activeDeal.currentStage / 7) * 100)}% Complete</span>
                  </div>
                  <div className="w-full h-3 bg-[#F8F6F2] rounded-full overflow-hidden border border-[#DDD8CE]">
                    <div
                      className="h-full bg-gradient-to-r from-[#B49A70] to-[#10B981] transition-all duration-500 rounded-full"
                      style={{ width: `${(activeDeal.currentStage / 7) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Next Action Callout */}
                <div className="mt-6 p-4 bg-[#F8F6F2] border border-[#B49A70]/30 rounded-xl flex items-start gap-3">
                  <Sparkles size={18} className="text-[#B49A70] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-[#1C201C] block mb-0.5">Immediate Next Action:</span>
                    <span className="text-[#6E6D66]">{activeDeal.nextAction}</span>
                  </div>
                </div>
              </div>

              {/* 7-Stage Detailed Pipeline Timeline */}
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-serif text-xl text-[#1C201C] font-semibold mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#B49A70]" />
                  <span>7-Stage Institutional Acquisition Journey</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-4 before:w-0.5 before:bg-[#EAE6DE]">
                  {activeDeal.stages.map((stage) => {
                    const isCompleted = stage.status === 'completed';
                    const isCurrent = stage.status === 'current';
                    const isPending = stage.status === 'pending';

                    return (
                      <div key={stage.step} className="relative flex items-start gap-4">
                        {/* Step Marker */}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-[#10B981] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-[#B49A70] text-[#1C201C] ring-4 ring-[#B49A70]/20 shadow-md animate-pulse'
                            : 'bg-white border-2 border-[#DDD8CE] text-[#8E8B82]'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : stage.step}
                        </div>

                        {/* Step Details */}
                        <div className={`flex-grow p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-[#FAF8F5] border-[#B49A70] shadow-xs'
                            : 'bg-[#FDFCFB] border-[#EAE6DE]'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className="font-serif text-base font-semibold text-[#1C201C]">
                              Stage {stage.step}: {stage.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#8E8B82] bg-white px-2 py-0.5 rounded border border-[#EAE6DE] w-fit">
                              {stage.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E6D66] font-light leading-relaxed">
                            {stage.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Escrow & Advisor Support */}
            <div className="space-y-6">
              
              {/* Escrow Deposit Summary */}
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-[#8E8B82] tracking-wider block mb-1">
                  Escrow Guarantee
                </span>
                <h4 className="font-serif text-xl text-[#1C201C] font-semibold mb-3">
                  Token Advance Structure
                </h4>
                <div className="p-4 bg-[#F8F6F2] rounded-xl border border-[#EAE6DE] space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#6E6D66]">Token Escrow:</span>
                    <strong className="text-[#1C201C]">{activeDeal.escrowEstimate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E6D66]">Escrow Agent:</span>
                    <strong className="text-[#1C201C]">PlutoPlat Trust Nominees Ltd.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E6D66]">Title Cadastre:</span>
                    <span className="text-[#10B981] font-semibold">100% Freehold Verified</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#8E8B82] leading-relaxed">
                  All transactions operate under tripartite escrow safeguards. Funds remain locked until Sub-Registrar biometric deed signing.
                </p>
              </div>

              {/* Dedicated Senior Advisor */}
              <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 shadow-sm">
                <span className="text-[10px] uppercase font-semibold text-[#8E8B82] tracking-wider block mb-3">
                  Dedicated Fiduciary Advisor
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
                    alt={activeDeal.agentName}
                    className="w-12 h-12 rounded-full object-cover border border-[#B49A70]"
                  />
                  <div>
                    <h5 className="font-serif text-base text-[#1C201C] font-semibold">{activeDeal.agentName}</h5>
                    <p className="text-xs text-[#6E6D66]">Senior Real Estate Advisor</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href={`tel:${activeDeal.agentPhone}`}
                    className="w-full py-2.5 bg-[#F8F6F2] hover:bg-[#EFECE4] text-[#1C201C] text-xs font-semibold rounded-lg border border-[#DDD8CE] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone size={13} className="text-[#B49A70]" />
                    <span>Call: {activeDeal.agentPhone}</span>
                  </a>

                  <a
                    href={`https://wa.me/919956346155?text=Hello%20${encodeURIComponent(activeDeal.agentName)},%20I%20am%20inquiring%20about%20my%20deal%20${activeDeal.id}%20for%20${encodeURIComponent(activeDeal.propertyTitle)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-[#E8F8F3] hover:bg-[#d4f2e8] text-[#00A884] text-xs font-semibold rounded-lg border border-[#A7E6D1] flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>

              {/* Advance Pipeline Test Helper */}
              <div className="bg-[#1C201C] text-white rounded-2xl p-5 shadow-sm text-xs">
                <span className="text-[10px] uppercase font-bold text-[#B49A70] block mb-1">
                  Interactive Simulator
                </span>
                <p className="text-[#A09D94] mb-3 leading-relaxed">
                  Test milestone progression across the 7 stages of the deal pipeline:
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateDealStage(activeDeal.id, num)}
                      className={`py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                        activeDeal.currentStage === num
                          ? 'bg-[#B49A70] text-[#1C201C]'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      S0{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DealProcess;
