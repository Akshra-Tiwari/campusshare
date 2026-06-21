import { useState, useEffect } from 'react';
import clsx from 'clsx';

const sizeClasses = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-16 h-16 text-2xl',
};

export default function Avatar({ src, name, size = 'sm', rounded = 'full', className = '' }) {
  const [imgError, setImgError] = useState(false);

  // Reset error state if the src changes (e.g. user updates their photo)
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initial = (name || 'U').trim()[0]?.toUpperCase() || 'U';
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-xl';

  const showImage = src && !imgError;
  const hasCustomBg = className.includes('bg-gradient') || className.includes('bg-');

  return (
    <div
      className={clsx(
        sizeClasses[size],
        roundedClass,
        'flex-shrink-0 flex items-center justify-center overflow-hidden',
        !showImage && !hasCustomBg && 'bg-primary-100 border-2 border-primary-200',
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={clsx('font-bold', hasCustomBg ? 'text-white' : 'text-primary-700')}>{initial}</span>
      )}
    </div>
  );
}
