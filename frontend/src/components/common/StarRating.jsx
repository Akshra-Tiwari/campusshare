import { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import clsx from 'clsx';

export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={clsx(
              'transition-transform duration-100',
              !readonly && 'cursor-pointer hover:scale-110',
              readonly && 'cursor-default'
            )}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <HiStar
              className={clsx(
                sizes[size],
                filled ? 'text-accent-400' : 'text-slate-300',
                'transition-colors duration-150'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
