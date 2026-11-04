import React, { useState } from 'react';

const DonutDistributionChart = ({
  data = [
    { label: 'Villas & Bungalows', percentage: 42, count: 12, color: '#B49A70' },
    { label: 'Luxury Penthouses', percentage: 28, count: 8, color: '#1C201C' },
    { label: 'Prime Apartments', percentage: 18, count: 5, color: '#287A50' },
    { label: 'Commercial & Plots', percentage: 12, count: 3, color: '#8E8B82' }
  ],
  title = 'Inventory Classification',
  subtitle = 'Portfolio asset allocation by architectural segment',
  centerLabel = 'Total Value',
  centerValue = '₹335 Cr'
}) => {
  const [activeSegment, setActiveSegment] = useState(data[0]);

  // Compute SVG arc coordinates
  let cumulativePercentage = 0;
  const radius = 68;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-base text-[#1C201C] font-normal">{title}</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#287A50] bg-emerald-50 px-2 py-0.5 rounded-2xs">
            100% RERA
          </span>
        </div>
        <p className="text-xs text-[#6E6D66] font-light mb-4">{subtitle}</p>

        {/* Circular Donut & Center Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90 transform">
              {data.map((item, index) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
                cumulativePercentage += item.percentage;
                const isHovered = activeSegment.label === item.label;

                return (
                  <circle
                    key={index}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setActiveSegment(item)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E8B82]">
                {centerLabel}
              </span>
              <span className="text-lg font-serif font-bold text-[#1C201C] mt-0.5">
                {centerValue}
              </span>
            </div>
          </div>

          {/* Segment Details Legend */}
          <div className="flex-1 w-full space-y-2">
            {data.map((item) => {
              const isSelected = activeSegment.label === item.label;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setActiveSegment(item)}
                  className={`p-2 rounded-xs flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#F8F6F2] font-semibold' : 'text-[#6E6D66] hover:bg-[#F8F6F2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#1C201C]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8E8B82]">{item.count} Units</span>
                    <strong className="text-[#1C201C]">{item.percentage}%</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs">
        <span className="text-[#6E6D66]">
          Active Segment: <strong className="text-[#1C201C]">{activeSegment.label}</strong>
        </span>
        <strong className="text-[#B49A70]">{activeSegment.percentage}% of Total Portfolio</strong>
      </div>
    </div>
  );
};

export default DonutDistributionChart;
