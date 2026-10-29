import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'gold' | 'light' | 'monochrome';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'gold',
}) => {
  // Dimensions scale
  const sizeMap = {
    sm: { icon: 34, text: 'text-base', sub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 44, text: 'text-xl', sub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 62, text: 'text-2xl', sub: 'text-xs', gap: 'gap-3' },
    xl: { icon: 84, text: 'text-4xl', sub: 'text-sm', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  // Colors
  const strokeColor = variant === 'light' ? '#FFFFFF' : '#C5A059';
  const textColor = variant === 'light' ? 'text-white' : 'text-[#EDE8DC]';

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Royal Seal Calligraphic Crest Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_12px_rgba(197,160,89,0.3)] transition-transform duration-500 hover:rotate-3"
        >
          <defs>
            <linearGradient id="hurrGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#8A6623" />
            </linearGradient>
            <linearGradient id="hurrDarkBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1E1E" />
              <stop offset="100%" stopColor="#0B0B0B" />
            </linearGradient>
          </defs>

          {/* Octagonal Royal Geometric Medallion / Star Seal */}
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="12"
            transform="rotate(0 50 50)"
            fill="url(#hurrDarkBase)"
            stroke="url(#hurrGoldGradient)"
            strokeWidth="1.6"
          />
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="12"
            transform="rotate(45 50 50)"
            fill="none"
            stroke="url(#hurrGoldGradient)"
            strokeWidth="1.2"
            strokeOpacity="0.65"
          />

          {/* Ornate Arabic Diwani Calligraphy for "حُـــرّ" */}
          {/* Main sweeping Kashida letter "ح" curving into dynamic "ر" */}
          <path
            d="M 68 36 C 63 32, 57 33, 50 35 C 41 38, 33 46, 32 54 C 31 60, 36 63, 43 62 C 54 60, 64 54, 69 47 C 70 45, 68 44, 66 45 C 59 50, 48 55, 39 53 C 35 52, 36 47, 41 42 C 48 37, 58 36, 67 37 Z"
            fill="url(#hurrGoldGradient)"
          />
          {/* Sweeping lower letter tail & flourish */}
          <path
            d="M 43 59 C 47 64, 53 68, 62 70 C 67 71, 71 70, 75 66 C 76 65, 74 64, 73 65 C 67 68, 60 67, 54 64 C 48 61, 45 58, 43 59 Z"
            fill="url(#hurrGoldGradient)"
          />

          {/* Arabic Shaddah (ّ) and Dammah (ُ) Diacritics in fine Diwani script */}
          {/* Shaddah */}
          <path
            d="M 49 26 C 49 23, 51 22, 53 23 C 54 24, 55 24, 56 22 C 58 21, 60 23, 59 25 C 57 28, 51 28, 49 26 Z"
            fill="url(#hurrGoldGradient)"
          />
          {/* Dammah */}
          <circle cx="38" cy="27" r="2.2" fill="url(#hurrGoldGradient)" />
          <path
            d="M 39 27 C 42 27, 43 31, 40 33 C 38 34, 37 32, 38 29 Z"
            fill="url(#hurrGoldGradient)"
          />

          {/* Subtle Royal Accent Diamond Marks */}
          <polygon points="50,6 52,9 50,12 48,9" fill="url(#hurrGoldGradient)" />
          <polygon points="50,88 52,91 50,94 48,91" fill="url(#hurrGoldGradient)" />
          <polygon points="6,50 9,52 12,50 9,48" fill="url(#hurrGoldGradient)" />
          <polygon points="88,50 91,52 94,50 91,48" fill="url(#hurrGoldGradient)" />
        </svg>
      </div>

      {/* Typography: Luxury Wordmark */}
      <div className="flex flex-col text-right justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`font-serif font-bold tracking-normal ${currentSize.text} leading-none gold-gradient-text`}
          >
            حُـــــرّ
          </span>
          <span
            className={`font-cinzel tracking-[0.25em] font-semibold text-xs text-[#C5A059] opacity-90 hidden sm:inline`}
          >
            HURR
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-sans tracking-wide text-[#A69F90] ${currentSize.sub} leading-tight mt-0.5`}
          >
            دار العطور الشرقية الفاخرة · القاهرة
          </span>
        )}
      </div>
    </div>
  );
};
