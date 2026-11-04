import React, { useState } from 'react';

const BarMetricChart = ({
  data = [
    { city: 'Mumbai', value: 112.5, listings: 8, label: '₹112.5 Cr' },
    { city: 'New Delhi', value: 88.0, listings: 6, label: '₹88.0 Cr' },
    { city: 'Kanpur', value: 42.5, listings: 7, label: '₹42.5 Cr' },
    { city: 'Bengaluru', value: 54.2, listings: 5, label: '₹54.2 Cr' },
    { city: 'Hyderabad', value: 38.0, listings: 4, label: '₹38.0 Cr' }
  ],
  title = 'City-Wise Portfolio Valuation',
  subtitle = 'Gross asset value under management across major Indian real estate markets'
}) => {
  const [selectedCity, setSelectedCity] = useState(data[0]);

  const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className="bg-white border border-[#DDD8CE] rounded-sm p-6 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-base text-[#1C201C] font-normal">{title}</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B49A70] bg-[#B49A70]/15 px-2 py-0.5 rounded-2xs">
            Market Depth
          </span>
        </div>
        <p className="text-xs text-[#6E6D66] font-light mb-5">{subtitle}</p>

        {/* Bars List */}
        <div className="space-y-3.5">
          {data.map((item) => {
            const percentage = (item.value / maxVal) * 100;
            const isSelected = selectedCity.city === item.city;

            return (
              <div
                key={item.city}
                onClick={() => setSelectedCity(item)}
                className={`p-2.5 rounded-xs transition-all cursor-pointer ${
                  isSelected ? 'bg-[#F8F6F2] border border-[#DDD8CE]' : 'hover:bg-[#F8F6F2]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#1C201C]">{item.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#6E6D66]">{item.listings} Listings</span>
                    <strong className="text-xs text-[#B49A70] font-semibold">{item.label}</strong>
                  </div>
                </div>

                {/* Bar Track */}
                <div className="w-full h-2.5 bg-[#EAE6DE] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: isSelected ? '#B49A70' : '#1C201C'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected City Insight Footer */}
      <div className="mt-4 pt-3 border-t border-[#EAE6DE] flex items-center justify-between text-xs">
        <span className="text-[#6E6D66]">
          Selected Market: <strong className="text-[#1C201C]">{selectedCity.city}</strong>
        </span>
        <span className="text-[#287A50] font-medium">
          Average Ticket Size: ₹{(selectedCity.value / selectedCity.listings).toFixed(1)} Cr / Unit
        </span>
      </div>
    </div>
  );
};

export default BarMetricChart;
