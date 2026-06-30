import { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import clsx from 'clsx';

export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hover, setHover] = useState(0);
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => {
        const filled = star <= (hover || value);
        return (
          <button key={star} type="button" disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={clsx('transition-all duration-100', !readonly && 'cursor-pointer hover:scale-110', readonly && 'cursor-default')}>
            <HiStar className={clsx(sizes[size], 'transition-colors duration-100')}
              style={{ color: filled ? '#6E632E' : 'rgba(110,99,46,0.20)' }} />
          </button>
        );
      })}
    </div>
  );
}