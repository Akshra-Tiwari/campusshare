import { useState, useEffect } from 'react';
import clsx from 'clsx';

const sizes = { xs:'w-6 h-6 text-[10px]', sm:'w-8 h-8 text-xs', md:'w-10 h-10 text-sm', lg:'w-14 h-14 text-xl', xl:'w-16 h-16 text-2xl' };

export default function Avatar({ src, name, size = 'sm', rounded = 'full', className = '' }) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [src]);
  const initial = (name || 'U').trim()[0]?.toUpperCase() || 'U';
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';
  const showImage = src && !imgError;
  const hasCustomBg = className.includes('bg-gradient') || className.includes('bg-');

  return (
    <div className={clsx(sizes[size], roundedClass, 'flex-shrink-0 flex items-center justify-center overflow-hidden', className)}
         style={!showImage && !hasCustomBg ? { background: 'linear-gradient(135deg, rgba(219,209,237,0.8), rgba(171,190,237,0.6))', border: '1px solid rgba(110,99,46,0.15)' } : {}}>
      {showImage ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover"
             onError={() => setImgError(true)} referrerPolicy="no-referrer" />
      ) : (
        <span className="font-bold" style={{ color: hasCustomBg ? '#F5F0DC' : '#6E632E' }}>{initial}</span>
      )}
    </div>
  );
}
