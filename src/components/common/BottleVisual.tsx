import React, { useEffect, useState } from 'react';
import { Product } from '../../types';

interface BottleVisualProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showAromaMist?: boolean;
}

export const BottleVisual: React.FC<BottleVisualProps> = ({
  product,
  size = 'md',
  className = '',
  showAromaMist = false,
}) => {
  const bottleStyle = product.bottleStyle || 'obsidian';

  // Sizing definitions
  const dimensions = {
    sm: { w: 120, h: 160 },
    md: { w: 190, h: 250 },
    lg: { w: 260, h: 340 },
    xl: { w: 320, h: 420 },
  }[size];

  // Color schemes based on bottleStyle
  const getGradients = () => {
    switch (bottleStyle) {
      case 'amber':
        return {
          glassStart: '#301806',
          glassMid: '#7A400B',
          glassEnd: '#1A0C03',
          liquid: 'url(#amberLiquidGlow)',
          cap: 'url(#goldCapGrad)',
          accent: '#D4AF37',
          shadow: 'rgba(212, 175, 55, 0.18)',
        };
      case 'rose_frost':
        return {
          glassStart: '#2A1820',
          glassMid: '#4D2436',
          glassEnd: '#180B12',
          liquid: 'url(#roseLiquidGlow)',
          cap: 'url(#roseGoldCapGrad)',
          accent: '#E5A5B5',
          shadow: 'rgba(229, 165, 181, 0.15)',
        };
      case 'royal_leather':
        return {
          glassStart: '#141416',
          glassMid: '#24201E',
          glassEnd: '#0D0D0E',
          liquid: 'url(#darkCognacLiquidGlow)',
          cap: 'url(#bronzeCapGrad)',
          accent: '#C5A059',
          shadow: 'rgba(197, 160, 89, 0.12)',
        };
      case 'crystal':
        return {
          glassStart: '#16191E',
          glassMid: '#2C3440',
          glassEnd: '#0E1014',
          liquid: 'url(#pureOudGlow)',
          cap: 'url(#goldCapGrad)',
          accent: '#D4AF37',
          shadow: 'rgba(212, 175, 55, 0.25)',
        };
      case 'obsidian':
      default:
        return {
          glassStart: '#111111',
          glassMid: '#1A1A1A',
          glassEnd: '#080808',
          liquid: 'url(#obsidianLiquidGlow)',
          cap: 'url(#goldCapGrad)',
          accent: '#C5A059',
          shadow: 'rgba(197, 160, 89, 0.15)',
        };
    }
  };

  const colors = getGradients();
  const productImage = product.images?.find((image) => typeof image === 'string' && image.trim());
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => { setImageFailed(false); }, [productImage]);

  if (productImage && !imageFailed) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ width: dimensions.w, height: dimensions.h }}>
        <img src={productImage} alt={product.nameAr || product.name || 'صورة العطر'} loading="lazy" referrerPolicy="no-referrer"
          className="h-full w-full object-contain transition-transform duration-500 ease-out hover:scale-[1.03]"
          onError={() => setImageFailed(true)} />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        filter: `drop-shadow(0 20px 30px ${colors.shadow})`,
      }}
    >
      {/* Background Ambient Incense Mist (Optional for Hero / PDP) */}
      {showAromaMist && (
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          <div className="absolute w-44 h-44 rounded-full bg-[#C5A059]/20 blur-3xl -top-4 left-1/4 animate-pulse" />
          <div className="absolute w-52 h-52 rounded-full bg-amber-600/15 blur-3xl bottom-0 right-1/4" />
        </div>
      )}

      {/* Luxury Bottle SVG Vector */}
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out hover:scale-[1.03]"
      >
        <defs>
          {/* Gold Cap Gradient */}
          <linearGradient id="goldCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6623" />
            <stop offset="30%" stopColor="#FFF2D6" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#735216" />
          </linearGradient>

          {/* Rose Gold Cap Gradient */}
          <linearGradient id="roseGoldCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9C6B75" />
            <stop offset="30%" stopColor="#FFE6EC" />
            <stop offset="60%" stopColor="#E5A5B5" />
            <stop offset="100%" stopColor="#7E4E59" />
          </linearGradient>

          {/* Bronze Cap Gradient */}
          <linearGradient id="bronzeCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A3B2C" />
            <stop offset="40%" stopColor="#C4A482" />
            <stop offset="70%" stopColor="#8C6E4E" />
            <stop offset="100%" stopColor="#3B2E21" />
          </linearGradient>

          {/* Glass Bottle Body Gradients */}
          <linearGradient id="amberLiquidGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#944E0E" />
            <stop offset="45%" stopColor="#D97706" />
            <stop offset="80%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id="roseLiquidGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5E1B31" />
            <stop offset="50%" stopColor="#831843" />
            <stop offset="85%" stopColor="#BE185D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#330A19" />
          </linearGradient>

          <linearGradient id="obsidianLiquidGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C1917" />
            <stop offset="40%" stopColor="#292524" />
            <stop offset="75%" stopColor="#12100E" />
            <stop offset="100%" stopColor="#080706" />
          </linearGradient>

          <linearGradient id="darkCognacLiquidGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#24140D" />
            <stop offset="50%" stopColor="#43281C" />
            <stop offset="100%" stopColor="#150B07" />
          </linearGradient>

          <linearGradient id="pureOudGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D1B0D" />
            <stop offset="50%" stopColor="#58310C" />
            <stop offset="100%" stopColor="#1F130B" />
          </linearGradient>

          {/* Surface Glass Highlight */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. Base Pedestal Shadow */}
        <ellipse cx="150" cy="375" rx="90" ry="14" fill="#000000" fillOpacity="0.6" />

        {/* 2. Heavy Faceted Glass Bottom */}
        <rect
          x="75"
          y="150"
          width="150"
          height="215"
          rx="18"
          fill={colors.liquid}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.5"
        />

        {/* Bottle Shoulders & Taper */}
        <path
          d="M 75 160 C 75 135, 115 125, 128 120 L 172 120 C 185 125, 225 135, 225 160 Z"
          fill={colors.glassMid}
        />

        {/* Outer Glass Thickness Rim (Luxury Heavy Base) */}
        <path
          d="M 75 330 C 75 355, 100 365, 150 365 C 200 365, 225 355, 225 330 L 225 365 L 75 365 Z"
          fill="#000000"
          fillOpacity="0.45"
        />

        {/* Vertical Specular Glass Sheen */}
        <rect
          x="88"
          y="135"
          width="26"
          height="220"
          fill="url(#glassReflection)"
          rx="6"
          opacity="0.8"
        />

        {/* 3. Gold Neck Collar & Ring */}
        <rect x="126" y="95" width="48" height="26" rx="3" fill={colors.cap} />
        <line x1="124" y1="110" x2="176" y2="110" stroke="#FFF2D6" strokeWidth="1.2" opacity="0.6" />

        {/* 4. Luxury Heavy Crown Cap */}
        <rect x="115" y="40" width="70" height="58" rx="6" fill={colors.cap} />
        <rect x="110" y="32" width="80" height="12" rx="4" fill={colors.cap} />
        {/* Subtle Cap Engravings */}
        <line x1="122" y1="46" x2="178" y2="46" stroke="#5A4014" strokeWidth="1.5" opacity="0.4" />
        <line x1="122" y1="88" x2="178" y2="88" stroke="#5A4014" strokeWidth="1.5" opacity="0.4" />
        <circle cx="150" cy="38" r="3" fill="#FFF2D6" opacity="0.8" />

        {/* 5. Center Luxury Label Medallion with Diwani Calligraphy */}
        <rect
          x="95"
          y="180"
          width="110"
          height="130"
          rx="8"
          fill="#0B0B0B"
          stroke="url(#goldCapGrad)"
          strokeWidth="1.4"
        />
        {/* Inner Label Border */}
        <rect
          x="99"
          y="184"
          width="102"
          height="122"
          rx="6"
          fill="none"
          stroke="url(#goldCapGrad)"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />

        {/* Diwani Arabic Calligraphy "حُرّ" */}
        <g transform="translate(150, 235) scale(0.65)">
          <path
            d="M 15 -18 C 8 -23, -2 -22, -12 -19 C -24 -15, -34 -4, -35 6 C -36 14, -29 18, -20 17 C -5 14, 8 7, 15 -2 C 17 -5, 14 -6, 12 -5 C 3 1, -11 7, -22 5 C -27 4, -26 -3, -19 -9 C -10 -15, 3 -17, 14 -16 Z"
            fill="url(#goldCapGrad)"
          />
          <path
            d="M -20 13 C -14 20, -6 25, 6 27 C 12 28, 17 27, 22 22 C 23 21, 21 20, 19 21 C 12 24, 3 23, -5 20 C -12 16, -17 12, -20 13 Z"
            fill="url(#goldCapGrad)"
          />
          {/* Shaddah & Dammah */}
          <circle cx="-16" cy="-28" r="2.5" fill="url(#goldCapGrad)" />
          <path d="M 0 -30 C 0 -33, 3 -34, 5 -33 C 7 -32, 8 -34, 11 -32 C 10 -27, 2 -27, 0 -30 Z" fill="url(#goldCapGrad)" />
        </g>

        {/* Perfume Arabic Name on Label */}
        <text
          x="150"
          y="272"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="600"
          fontFamily="Amiri, serif"
        >
          {product.nameAr}
        </text>

        {/* Perfume Concentration Tag */}
        <text
          x="150"
          y="290"
          textAnchor="middle"
          fill="#C5A059"
          fontSize="7.5"
          letterSpacing="1"
          fontFamily="Cinzel, serif"
        >
          EXTRAIT DE PARFUM
        </text>

        {/* Volume & Cairo Signoff */}
        <text
          x="150"
          y="300"
          textAnchor="middle"
          fill="#8A8275"
          fontSize="6"
          letterSpacing="0.8"
          fontFamily="Alexandria, sans-serif"
        >
          100 ML · CAIRO
        </text>
      </svg>
    </div>
  );
};
