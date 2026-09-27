import React from 'react';
import Image from 'next/image';

interface SynroLogoProps {
  /**
   * 'full': Logo mark + 'synro' wordmark
   * 'mark': Double-chevron icon mark only
   * 'badge': Red rounded badge with white double-chevron mark (matching the Clay design)
   */
  variant?: 'full' | 'mark' | 'badge';
  /**
   * 'dark': dark slate mark (for light backgrounds)
   * 'light': white mark (for dark backgrounds)
   * 'red': white mark on brand red badge
   */
  color?: 'dark' | 'light' | 'red';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const SynroLogo: React.FC<SynroLogoProps> = ({
  variant = 'mark',
  color = 'dark',
  size = 'md',
  className = '',
  onClick,
  title = 'Synro Autonomous Fleet',
}) => {
  // Size mappings
  const badgeSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-[22px]',
  };

  const markSizes = {
    sm: 20,
    md: 26,
    lg: 34,
    xl: 48,
  };

  const fullSizes = {
    sm: { width: 90, height: 25 },
    md: { width: 120, height: 34 },
    lg: { width: 150, height: 42 },
    xl: { width: 200, height: 56 },
  };

  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        title={title}
        className={`bg-[#ff334b] hover:bg-[#eb283f] flex items-center justify-center shadow-sm cursor-pointer transition-all active:scale-95 group flex-shrink-0 ${badgeSizes[size]} ${className}`}
      >
        <Image
          src="/synro-mark-white.png"
          alt="Synro"
          width={markSizes[size]}
          height={markSizes[size]}
          className="transition-transform group-hover:scale-105 object-contain"
          priority
        />
      </div>
    );
  }

  if (variant === 'full') {
    const src = color === 'light' ? '/synro-logo-white.png' : '/synro-logo.png';
    const dims = fullSizes[size];
    return (
      <div
        onClick={onClick}
        title={title}
        className={`inline-flex items-center cursor-pointer transition-opacity hover:opacity-90 ${className}`}
      >
        <Image
          src={src}
          alt="Synro"
          width={dims.width}
          height={dims.height}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  // Variant: 'mark'
  const markSrc = color === 'light' ? '/synro-mark-white.png' : '/synro-mark.png';
  const px = markSizes[size];

  return (
    <div
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Image
        src={markSrc}
        alt="Synro"
        width={px}
        height={px}
        className="object-contain"
        priority
      />
    </div>
  );
};
