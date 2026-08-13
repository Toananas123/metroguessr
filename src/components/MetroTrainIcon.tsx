import React from 'react';

export const MetroTrainIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wheels */}
    <circle cx="45" cy="56" r="5" fill="#3F4349" />
    <circle cx="65" cy="56" r="5" fill="#3F4349" />
    <circle cx="105" cy="56" r="5" fill="#3F4349" />
    <circle cx="135" cy="56" r="5" fill="#3F4349" />
    <circle cx="175" cy="56" r="5" fill="#3F4349" />
    <circle cx="195" cy="56" r="5" fill="#3F4349" />
    
    {/* Underbody */}
    <rect x="35" y="50" width="170" height="6" fill="#3F4349" />

    {/* Body */}
    <rect x="20" y="16" width="200" height="36" rx="6" fill="#FFFFFF" stroke="#3F4349" strokeWidth="4" />
    
    {/* Teal Strip */}
    <path d="M 22 22 C 22 19 24 18 26 18 L 214 18 C 216 18 218 19 218 22 L 218 34 L 22 34 Z" fill="#59C2B2" />
    
    {/* Left Cab Window */}
    <path d="M 24 22 C 24 19 26 18 28 18 L 32 18 L 32 32 L 24 32 Z" fill="#6B7280" />
    
    {/* Right Cab Window */}
    <path d="M 216 22 C 216 19 214 18 212 18 L 208 18 L 208 32 L 216 32 Z" fill="#6B7280" />

    {/* Door 1 */}
    <rect x="40" y="16" width="18" height="36" fill="#FFFFFF" stroke="#3F4349" strokeWidth="3" />
    <line x1="49" y1="16" x2="49" y2="52" stroke="#3F4349" strokeWidth="1.5" />
    <rect x="43" y="20" width="4" height="12" rx="1" fill="#3F4349" />
    <rect x="51" y="20" width="4" height="12" rx="1" fill="#3F4349" />

    {/* Windows 1 */}
    <rect x="63" y="20" width="8" height="12" rx="1.5" fill="#6B7280" />
    <rect x="73" y="20" width="8" height="12" rx="1.5" fill="#6B7280" />

    {/* Door 2 */}
    <rect x="86" y="16" width="18" height="36" fill="#FFFFFF" stroke="#3F4349" strokeWidth="3" />
    <line x1="95" y1="16" x2="95" y2="52" stroke="#3F4349" strokeWidth="1.5" />
    <rect x="89" y="20" width="4" height="12" rx="1" fill="#3F4349" />
    <rect x="97" y="20" width="4" height="12" rx="1" fill="#3F4349" />

    {/* Center Window */}
    <rect x="110" y="20" width="20" height="12" rx="1.5" fill="#6B7280" />
    {/* Logo below center window */}
    <circle cx="120" cy="42" r="3.5" stroke="#59C2B2" strokeWidth="1.5" fill="none" />
    <path d="M 118 42 L 122 42" stroke="#59C2B2" strokeWidth="1" strokeLinecap="round" />

    {/* Door 3 */}
    <rect x="136" y="16" width="18" height="36" fill="#FFFFFF" stroke="#3F4349" strokeWidth="3" />
    <line x1="145" y1="16" x2="145" y2="52" stroke="#3F4349" strokeWidth="1.5" />
    <rect x="139" y="20" width="4" height="12" rx="1" fill="#3F4349" />
    <rect x="147" y="20" width="4" height="12" rx="1" fill="#3F4349" />

    {/* Windows 2 */}
    <rect x="159" y="20" width="8" height="12" rx="1.5" fill="#6B7280" />
    <rect x="169" y="20" width="8" height="12" rx="1.5" fill="#6B7280" />

    {/* Door 4 */}
    <rect x="182" y="16" width="18" height="36" fill="#FFFFFF" stroke="#3F4349" strokeWidth="3" />
    <line x1="191" y1="16" x2="191" y2="52" stroke="#3F4349" strokeWidth="1.5" />
    <rect x="185" y="20" width="4" height="12" rx="1" fill="#3F4349" />
    <rect x="193" y="20" width="4" height="12" rx="1" fill="#3F4349" />

    {/* Headlights */}
    <circle cx="24" cy="44" r="1.5" fill="#59C2B2" />
    <circle cx="216" cy="44" r="1.5" fill="#59C2B2" />
  </svg>
);
