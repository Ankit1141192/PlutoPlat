import React, { useState } from 'react';

const AreaTrendChart = ({
  data = [
    { label: 'Jun', inquiries: 24, visits: 12 },
    { label: 'Jul', inquiries: 38, visits: 22 },
    { label: 'Aug', inquiries: 42, visits: 28 },
    { label: 'Sep', inquiries: 56, visits: 34 },
    { label: 'Oct', inquiries: 68, visits: 45 },
    { label: 'Nov', inquiries: 84, visits: 58 }
  ],
  title = 'Inquiry & Site Visit Growth',
  subtitle = 'Monthly client inquiry volume and scheduled private site inspections',
  metric1Key = 'inquiries',
  metric1Name = 'Client Inquiries',
  metric1Color = '#B49A70', // PlutoPlat Gold
  metric2Key = 'visits',
  metric2Name = 'Confirmed Site Visits',
  metric2Color = '#287A50'  // Luxury Emerald
}) => {
  const [hoverIndex, setHoverIndex] = useState(data.length - 1);

  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => Math.max(d[metric1Key] || 0, d[metric2Key] || 0))) * 1.15 || 100;

  // Compute points
  const points1 = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d[metric1Key] || 0) / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const points2 = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d[metric2Key] || 0) / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  // SVG smooth path generator
  const getSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath1 = getSmoothPath(points1);
  const linePath2 = getSmoothPath(points2);

  const areaPath1 = `${linePath1} L ${points1[points1.length - 1].x} ${paddingTop + chartHeight} L ${points1[0].x} ${paddingTop + chartHeight} Z`;

  const hoveredData = data[hoverIndex] || data[data.length - 1];

  return (
    <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-serif text-base text-[#1C201C] font-normal">{title}</h3>
          <p className="text-xs text-[#6E6D66] font-light">{subtitle}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metric1Color }} />
            <span className="text-[#1C201C] font-medium">{metric1Name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metric2Color }} />
            <span className="text-[#1C201C] font-medium">{metric2Name}</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 md:h-56 select-none"
        >
          <defs>
            <linearGradient id="chartGradientGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metric1Color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={metric1Color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#EAE6DE"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill for primary metric */}
          <path d={areaPath1} fill="url(#chartGradientGold)" />

          {/* Metric 2 Line (Emerald) */}
          <path
            d={linePath2}
            fill="none"
            stroke={metric2Color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Metric 1 Line (Gold) */}
          <path
            d={linePath1}
            fill="none"
            stroke={metric1Color}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive vertical hover indicator */}
          {points1[hoverIndex] && (
            <g>
              <line
                x1={points1[hoverIndex].x}
                y1={paddingTop}
                x2={points1[hoverIndex].x}
                y2={paddingTop + chartHeight}
                stroke="#1C201C"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.6"
              />
              <circle
                cx={points1[hoverIndex].x}
                cy={points1[hoverIndex].y}
                r="4.5"
                fill="#FFFFFF"
                stroke={metric1Color}
                strokeWidth="3"
              />
              <circle
                cx={points2[hoverIndex].x}
                cy={points2[hoverIndex].y}
                r="4"
                fill="#FFFFFF"
                stroke={metric2Color}
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * chartWidth;
            const isHovered = i === hoverIndex;
            return (
              <text
                key={i}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill={isHovered ? '#1C201C' : '#8E8B82'}
                fontWeight={isHovered ? '600' : '400'}
                className="cursor-pointer transition-colors"
                onMouseEnter={() => setHoverIndex(i)}
              >
                {d.label}
              </text>
            );
          })}

          {/* Invisible interactive hover bars */}
          {data.map((d, i) => {
            const barWidth = chartWidth / data.length;
            const x = paddingX + (i / (data.length - 1)) * chartWidth - barWidth / 2;
            return (
              <rect
                key={i}
                x={x}
                y={paddingTop}
                width={barWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>

        {/* Hover Information Banner */}
        <div className="mt-3 pt-3 border-t border-[#EAE6DE] flex flex-wrap items-center justify-between text-xs">
          <span className="text-[#6E6D66]">
            Selected Month: <strong className="text-[#1C201C]">{hoveredData.label} 2026</strong>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#1C201C]">
              {metric1Name}: <strong className="text-[#B49A70]">{hoveredData[metric1Key]} Inquiries</strong>
            </span>
            <span className="text-[#1C201C]">
              {metric2Name}: <strong className="text-[#287A50]">{hoveredData[metric2Key]} Visits</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaTrendChart;
