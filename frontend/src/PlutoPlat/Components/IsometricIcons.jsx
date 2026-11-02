import React from 'react';

/**
 * High-definition, beautifully detailed 3D isometric vector illustrations
 * matching the user's reference designs for:
 * 1. Property for Rent (Multi-tier building with rooftop pool)
 * 2. Property for Sale (Modern home with authentic 'FOR SALE' sign)
 * 3. Off-Plan Properties (Building under construction with tower crane and transport truck)
 */

export const RentBuildingIsometric = ({ className = "w-32 h-32" }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="rent-shadow" x="20" y="110" width="200" height="110" filterUnits="userSpaceOnUse">
        <ellipse cx="120" cy="165" rx="85" ry="38" fill="rgba(28, 32, 28, 0.18)" />
      </filter>
      <linearGradient id="wall-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2DDD5" />
      </linearGradient>
      <linearGradient id="wall-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B3ADA3" />
        <stop offset="100%" stopColor="#8C867D" />
      </linearGradient>
      <linearGradient id="pool-water" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.45" />
      </linearGradient>
    </defs>

    {/* Ground Soft Shadow */}
    <ellipse cx="120" cy="178" rx="85" ry="34" fill="#000000" fillOpacity="0.12" />

    {/* Base Foundation / Garden Platform */}
    <path d="M120 188 L185 150 L120 114 L55 150 Z" fill="#84987E" />
    <path d="M55 150 L120 188 L120 196 L55 158 Z" fill="#5F7359" />
    <path d="M120 188 L185 150 L185 158 L120 196 Z" fill="#4B5E46" />

    {/* Paver walkway */}
    <path d="M110 182 L130 171 L124 167 L104 179 Z" fill="#D5CEBF" />

    {/* Main Building Block */}
    {/* Right Wall (Darker shade) */}
    <path d="M120 162 L168 134 L168 76 L120 104 Z" fill="url(#wall-dark)" />
    {/* Left Wall (Lighter shade) */}
    <path d="M72 134 L120 162 L120 104 L72 76 Z" fill="url(#wall-light)" />
    {/* Roof Surface */}
    <path d="M120 104 L168 76 L120 48 L72 76 Z" fill="#242728" />

    {/* Floor Band Dividers */}
    <path d="M72 114 L120 142 L168 114" stroke="#5F5A52" strokeWidth="2.5" />
    <path d="M72 95 L120 123 L168 95" stroke="#5F5A52" strokeWidth="2.5" />

    {/* Balcony Floors & Railings - Floor 1 */}
    <path d="M80 137 L114 157 L114 152 L80 132 Z" fill="#FFFFFF" />
    <path d="M80 132 L114 152 L114 144 L80 124 Z" fill="url(#glass-grad)" stroke="#FFFFFF" strokeWidth="0.8" />

    <path d="M126 157 L160 137 L160 132 L126 152 Z" fill="#C2BCB2" />
    <path d="M126 152 L160 132 L160 124 L126 144 Z" fill="url(#glass-grad)" stroke="#FFFFFF" strokeWidth="0.8" />

    {/* Balcony Floors & Railings - Floor 2 */}
    <path d="M80 118 L114 138 L114 133 L80 113 Z" fill="#FFFFFF" />
    <path d="M80 113 L114 133 L114 125 L80 105 Z" fill="url(#glass-grad)" stroke="#FFFFFF" strokeWidth="0.8" />

    <path d="M126 138 L160 118 L160 113 L126 133 Z" fill="#C2BCB2" />
    <path d="M126 133 L160 113 L160 105 L126 125 Z" fill="url(#glass-grad)" stroke="#FFFFFF" strokeWidth="0.8" />

    {/* Windows with warm & cyan reflections */}
    <path d="M84 128 L96 135 L96 121 L84 114 Z" fill="#3B82F6" fillOpacity="0.85" />
    <path d="M99 137 L111 144 L111 130 L99 123 Z" fill="#E0F2FE" />
    <path d="M129 144 L141 137 L141 123 L129 130 Z" fill="#1E293B" />
    <path d="M144 135 L156 128 L156 114 L144 121 Z" fill="#0F172A" />

    {/* Red entrance door */}
    <path d="M112 157 L118 161 L118 149 L112 145 Z" fill="#DC2626" />
    <circle cx="114" cy="153" r="0.8" fill="#FCD34D" />

    {/* ROOFTOP AMENITY: Luxury Sky Pool */}
    {/* Pool recessed pit */}
    <path d="M96 74 L126 57 L144 68 L114 85 Z" fill="#0C4A6E" />
    {/* Water */}
    <path d="M98 73 L125 58 L142 68 L115 83 Z" fill="url(#pool-water)" />
    {/* Water caustics shimmer */}
    <path d="M106 72 L120 64 M116 75 L132 66" stroke="#BAE6FD" strokeWidth="1.2" strokeLinecap="round" />

    {/* Rooftop Lounge Sunbed & Parasol */}
    <path d="M126 83 L134 78 L138 80 L130 85 Z" fill="#F8FAFC" />
    <path d="M136 84 L142 80 L145 82 L139 86 Z" fill="#F8FAFC" />

    {/* Glass Safety Parapet on Roof */}
    <path d="M72 76 L120 104 L168 76" stroke="#93C5FD" strokeWidth="2.5" strokeOpacity="0.75" />

    {/* Isometric Tree & Landscape (Left side) */}
    {/* Trunk */}
    <path d="M58 148 L62 146 L62 135 L58 137 Z" fill="#78350F" />
    {/* Foliage Layers */}
    <circle cx="60" cy="130" r="14" fill="#15803D" />
    <circle cx="64" cy="126" r="12" fill="#22C55E" />
    <circle cx="58" cy="124" r="10" fill="#4ADE80" />
    <circle cx="62" cy="120" r="7" fill="#86EFAC" />

    {/* Additional small ornamental bush */}
    <circle cx="168" cy="144" r="7" fill="#15803D" />
    <circle cx="170" cy="142" r="5" fill="#4ADE80" />
  </svg>
);

export const SaleHouseIsometric = ({ className = "w-32 h-32" }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="house-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#EDE8DF" />
      </linearGradient>
      <linearGradient id="house-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C9C3B6" />
        <stop offset="100%" stopColor="#968F82" />
      </linearGradient>
      <linearGradient id="roof-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#71717A" />
        <stop offset="100%" stopColor="#3F3F46" />
      </linearGradient>
      <linearGradient id="roof-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3F3F46" />
        <stop offset="100%" stopColor="#18181B" />
      </linearGradient>
    </defs>

    {/* Ground Soft Shadow */}
    <ellipse cx="120" cy="178" rx="88" ry="34" fill="#000000" fillOpacity="0.12" />

    {/* Green Lawn Base */}
    <path d="M120 188 L190 148 L120 110 L50 150 Z" fill="#759367" />
    <path d="M50 150 L120 188 L120 196 L50 158 Z" fill="#58754C" />
    <path d="M120 188 L190 148 L190 156 L120 196 Z" fill="#445D3B" />

    {/* Stone pathway to front porch */}
    <path d="M112 182 L128 173 L122 168 L106 177 Z" fill="#D4CDC1" />

    {/* GARAGE WING (Right) */}
    {/* Garage Right Wall */}
    <path d="M152 148 L174 135 L174 105 L152 118 Z" fill="url(#house-dark)" />
    {/* Garage Front Door */}
    <path d="M154 145 L172 134 L172 114 L154 125 Z" fill="#27272A" />
    {/* Garage door panels */}
    <line x1="154" y1="137" x2="172" y2="126" stroke="#52525B" strokeWidth="1.2" />
    <line x1="154" y1="130" x2="172" y2="119" stroke="#52525B" strokeWidth="1.2" />
    {/* Garage Roof */}
    <path d="M136 109 L152 118 L174 105 L158 96 Z" fill="url(#roof-dark)" />

    {/* MAIN HOUSE STRUCTURE */}
    {/* Left Wall (Facade with door) */}
    <path d="M80 142 L132 172 L132 108 L80 78 Z" fill="url(#house-light)" />
    {/* Right Wall */}
    <path d="M132 172 L154 159 L154 95 L132 108 Z" fill="url(#house-dark)" />

    {/* Gabled Wall Peak (Triangle) */}
    <path d="M80 78 L106 50 L132 108 Z" fill="url(#house-light)" />

    {/* ROOF SURFACES */}
    {/* Left Sloped Roof */}
    <path d="M74 80 L106 44 L146 67 L114 103 Z" fill="url(#roof-light)" />
    {/* Right Sloped Roof */}
    <path d="M106 44 L146 67 L168 104 L128 81 Z" fill="url(#roof-dark)" />

    {/* Chimney */}
    <path d="M128 54 L136 50 L136 40 L128 44 Z" fill="#B91C1C" />
    <path d="M136 50 L142 53 L142 43 L136 40 Z" fill="#7F1D1D" />
    <path d="M128 44 L136 40 L142 43 L134 47 Z" fill="#450A0A" />

    {/* Red Front Door with canopy */}
    <path d="M110 167 L122 160 L122 135 L110 142 Z" fill="#DC2626" />
    <circle cx="112" cy="151" r="1.2" fill="#FEF08A" />
    {/* Glass transom above door */}
    <path d="M110 141 L122 134 L122 130 L110 137 Z" fill="#38BDF8" fillOpacity="0.8" />

    {/* Windows on House */}
    {/* Upper Attic Round Window */}
    <ellipse cx="106" cy="74" rx="6" ry="7" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
    {/* Ground floor window */}
    <path d="M88 135 L102 143 L102 125 L88 117 Z" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.2" />

    {/* Trees on Left Lawn */}
    <path d="M58 144 L61 142 L61 128 L58 130 Z" fill="#542B09" />
    <circle cx="60" cy="122" r="13" fill="#D97706" />
    <circle cx="63" cy="118" r="11" fill="#F59E0B" />
    <circle cx="58" cy="115" r="9" fill="#FBBF24" />

    {/* THE ICONIC 'FOR SALE' SIGNPOST (In the front lawn) */}
    {/* Wooden Post */}
    <path d="M136 158 L140 156 L140 115 L136 117 Z" fill="#FAFAFA" stroke="#D4D4D8" strokeWidth="0.5" />
    {/* Top Hanging Arm */}
    <path d="M136 117 L168 99 L168 96 L136 114 Z" fill="#FAFAFA" />

    {/* The Signboard */}
    <g filter="url(#sign-shadow)">
      {/* Signboard Plaque */}
      <path d="M140 126 L168 110 L168 92 L140 108 Z" fill="#DC2626" stroke="#B91C1C" strokeWidth="1" />
      {/* Signboard Inner White Border */}
      <path d="M142 124 L166 110 L166 94 L142 108 Z" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1" />

      {/* "FOR SALE" Bold White Typography (isometric slant) */}
      <text
        x="138"
        y="126"
        fill="#FFFFFF"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="8.5"
        letterSpacing="0.8"
        transform="rotate(-30 138 126) skewX(-15)"
      >
        FOR SALE
      </text>
    </g>
  </svg>
);

export const OffPlanConstructionIsometric = ({ className = "w-32 h-32" }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="concrete-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#D1D5DB" />
      </linearGradient>
      <linearGradient id="concrete-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <linearGradient id="crane-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    {/* Ground Soft Shadow */}
    <ellipse cx="120" cy="182" rx="90" ry="34" fill="#000000" fillOpacity="0.12" />

    {/* Construction Site Ground Base */}
    <path d="M120 192 L192 150 L120 110 L48 152 Z" fill="#9CA3AF" />
    <path d="M48 152 L120 192 L120 200 L48 160 Z" fill="#6B7280" />
    <path d="M120 192 L192 150 L192 158 L120 200 Z" fill="#4B5563" />

    {/* Dirt & Sand Mounds on Site */}
    <ellipse cx="78" cy="168" rx="16" ry="7" fill="#B49A70" />
    <ellipse cx="76" cy="166" rx="12" ry="5" fill="#D2B48C" />
    <ellipse cx="168" cy="164" rx="14" ry="6" fill="#A8926B" />

    {/* Safety Traffic Cones */}
    <path d="M60 162 L63 154 L66 162 Z" fill="#F97316" />
    <path d="M174 158 L177 150 L180 158 Z" fill="#F97316" />

    {/* BUILDING UNDER CONSTRUCTION */}
    {/* Floor Slabs and Concrete Columns */}
    {/* Ground Floor Slab */}
    <path d="M104 168 L152 140 L152 135 L104 163 Z" fill="url(#concrete-dark)" />
    <path d="M104 168 L60 143 L60 138 L104 163 Z" fill="url(#concrete-light)" />
    {/* Floor 1 Concrete Columns */}
    <path d="M64 140 L67 142 L67 122 L64 120 Z" fill="url(#concrete-light)" />
    <path d="M84 151 L87 153 L87 133 L84 131 Z" fill="url(#concrete-light)" />
    <path d="M103 162 L106 164 L106 144 L103 142 Z" fill="url(#concrete-light)" />
    <path d="M125 151 L128 149 L128 129 L125 131 Z" fill="url(#concrete-dark)" />
    <path d="M148 138 L151 136 L151 116 L148 118 Z" fill="url(#concrete-dark)" />

    {/* Level 2 Slab */}
    <path d="M104 144 L152 116 L114 94 L66 122 Z" fill="#E5E7EB" />
    <path d="M104 144 L152 116 L152 112 L104 140 Z" fill="url(#concrete-dark)" />
    <path d="M104 144 L66 122 L66 118 L104 140 Z" fill="url(#concrete-light)" />

    {/* Level 2 Concrete Columns & Partial Walls */}
    <path d="M72 120 L75 122 L75 102 L72 100 Z" fill="url(#concrete-light)" />
    <path d="M103 138 L106 140 L106 120 L103 118 Z" fill="url(#concrete-light)" />
    <path d="M145 114 L148 112 L148 92 L145 94 Z" fill="url(#concrete-dark)" />
    {/* Interior partition masonry blocks */}
    <path d="M80 123 L96 132 L96 114 L80 105 Z" fill="#CBD5E1" />

    {/* Level 3 Top Slab (Under active construction with rebar) */}
    <path d="M104 120 L148 94 L112 74 L68 100 Z" fill="#D1D5DB" />
    {/* Exposed vertical rebar steel rods sticking out of concrete */}
    <line x1="72" y1="98" x2="72" y2="88" stroke="#475569" strokeWidth="1.5" />
    <line x1="76" y1="96" x2="76" y2="86" stroke="#475569" strokeWidth="1.5" />
    <line x1="104" y1="116" x2="104" y2="106" stroke="#475569" strokeWidth="1.5" />
    <line x1="108" y1="114" x2="108" y2="104" stroke="#475569" strokeWidth="1.5" />
    <line x1="144" y1="92" x2="144" y2="82" stroke="#475569" strokeWidth="1.5" />

    {/* Green Safety Scaffolding & Netting (Right side) */}
    <path d="M136 148 L158 135 L158 98 L136 111 Z" fill="#10B981" fillOpacity="0.45" stroke="#059669" strokeWidth="0.8" />
    {/* Scaffolding steel cross-bracing */}
    <line x1="136" y1="148" x2="158" y2="120" stroke="#047857" strokeWidth="0.8" />
    <line x1="136" y1="120" x2="158" y2="148" stroke="#047857" strokeWidth="0.8" />
    <line x1="136" y1="124" x2="158" y2="98" stroke="#047857" strokeWidth="0.8" />

    {/* THE TOWER CRANE (Yellow construction giant) */}
    {/* Crane Vertical Mast (Tower) */}
    <path d="M50 144 L55 141 L55 36 L50 39 Z" fill="url(#crane-yellow)" />
    {/* Mast cross latticework */}
    <line x1="50" y1="130" x2="55" y2="120" stroke="#B45309" strokeWidth="0.8" />
    <line x1="50" y1="120" x2="55" y2="130" stroke="#B45309" strokeWidth="0.8" />
    <line x1="50" y1="100" x2="55" y2="90" stroke="#B45309" strokeWidth="0.8" />
    <line x1="50" y1="90" x2="55" y2="100" stroke="#B45309" strokeWidth="0.8" />
    <line x1="50" y1="70" x2="55" y2="60" stroke="#B45309" strokeWidth="0.8" />
    <line x1="50" y1="60" x2="55" y2="70" stroke="#B45309" strokeWidth="0.8" />

    {/* Crane Operator Cabin & Slewing Ring */}
    <path d="M48 40 L57 35 L57 30 L48 35 Z" fill="#F59E0B" />
    <path d="M51 37 L55 35 L55 32 L51 34 Z" fill="#0284C7" />

    {/* Crane Mast Peak (Apex) */}
    <path d="M52 32 L52 20 L55 31 Z" fill="#F59E0B" />

    {/* Crane Horizontal Jib (Long Arm extending over the building) */}
    <path d="M30 46 L130 20 L130 18 L30 44 Z" fill="url(#crane-yellow)" stroke="#D97706" strokeWidth="0.5" />
    {/* Jib Tie Cables */}
    <line x1="52" y1="20" x2="100" y2="28" stroke="#334155" strokeWidth="0.8" />
    <line x1="52" y1="20" x2="34" y2="44" stroke="#334155" strokeWidth="0.8" />

    {/* Counterweight Block on Crane Tail */}
    <path d="M30 46 L38 42 L38 36 L30 40 Z" fill="#475569" />

    {/* Trolley, Hoist Cable & Suspended Load Hook */}
    <rect x="94" y="27" width="5" height="3" fill="#1E293B" />
    <line x1="96" y1="30" x2="96" y2="62" stroke="#475569" strokeWidth="0.8" strokeDasharray="1.5 1" />
    {/* Suspended concrete bucket / load */}
    <path d="M92 62 L100 62 L98 68 L94 68 Z" fill="#EA580C" />

    {/* RED CONSTRUCTION DUMP TRUCK / AGGREGATE TRANSPORTER */}
    {/* Truck Positioned in Front */}
    {/* Red Cabin */}
    <path d="M124 178 L136 171 L136 160 L124 167 Z" fill="#DC2626" />
    <path d="M124 167 L130 163 L130 156 L124 160 Z" fill="#EF4444" />
    {/* Windshield */}
    <path d="M125 166 L129 163 L129 159 L125 162 Z" fill="#7DD3FC" />

    {/* Dump Bed / Tipper (Grey Metal) */}
    <path d="M136 172 L154 162 L154 152 L136 162 Z" fill="#94A3B8" />
    <path d="M136 162 L148 155 L154 158 L142 165 Z" fill="#64748B" />
    {/* Aggregate load inside dump bed */}
    <ellipse cx="145" cy="158" rx="6" ry="2.5" fill="#D97706" />

    {/* Truck Wheels */}
    <circle cx="127" cy="177" r="3.2" fill="#18181B" />
    <circle cx="138" cy="171" r="3.2" fill="#18181B" />
    <circle cx="147" cy="166" r="3.2" fill="#18181B" />
  </svg>
);
