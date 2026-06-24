import clsx from 'clsx';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          sizes[size],
          'rounded-full border-primary-200 border-t-primary-600 animate-spin'
        )}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl shimmer" />
        <div className="w-20 h-5 rounded-full shimmer" />
      </div>
      <div className="w-3/4 h-4 rounded shimmer mb-2" />
      <div className="w-1/2 h-3 rounded shimmer mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="w-12 h-5 rounded-full shimmer" />
        <div className="w-12 h-5 rounded-full shimmer" />
      </div>
      <div className="w-24 h-4 rounded shimmer mb-4" />
      <div className="flex justify-between pt-3 border-t border-slate-100">
        <div className="w-20 h-3 rounded shimmer" />
        <div className="w-16 h-3 rounded shimmer" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="card p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl shimmer flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="w-1/2 h-4 rounded shimmer mb-2" />
        <div className="w-1/3 h-3 rounded shimmer" />
      </div>
      <div className="w-20 h-8 rounded-xl shimmer flex-shrink-0" />
    </div>
  );
}
