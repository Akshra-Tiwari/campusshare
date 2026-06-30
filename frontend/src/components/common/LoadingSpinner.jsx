import clsx from 'clsx';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' };
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className={clsx(sizes[size], 'rounded-full animate-spin')}
           style={{ borderColor: 'rgba(110,99,46,0.15)', borderTopColor: '#6E632E' }} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
         style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.5) 0%, rgba(219,209,237,0.3) 100%)' }}>
      <div className="w-12 h-12 rounded-full border-[3px] animate-spin"
           style={{ borderColor: 'rgba(110,99,46,0.15)', borderTopColor: '#6E632E' }} />
      <p className="text-sm font-medium" style={{ color: '#9A8F5A' }}>Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-3xl border p-5 animate-pulse"
         style={{ background: 'rgba(237,232,208,0.70)', borderColor: 'rgba(110,99,46,0.10)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-2xl skeleton" />
        <div className="w-16 h-5 rounded-full skeleton" />
      </div>
      <div className="w-3/4 h-4 rounded skeleton mb-2" />
      <div className="w-1/2 h-3 rounded skeleton mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="w-14 h-5 rounded-full skeleton" />
        <div className="w-12 h-5 rounded-full skeleton" />
      </div>
      <div className="w-24 h-3 rounded skeleton mb-4" />
      <div className="flex justify-between pt-3" style={{ borderTop: '1px solid rgba(110,99,46,0.08)' }}>
        <div className="w-20 h-3 rounded skeleton" />
        <div className="w-12 h-3 rounded skeleton" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="rounded-2xl border p-4 flex items-center gap-4 animate-pulse"
         style={{ background: 'rgba(237,232,208,0.70)', borderColor: 'rgba(110,99,46,0.10)' }}>
      <div className="w-10 h-10 rounded-2xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-1/2 h-4 rounded skeleton" />
        <div className="w-1/3 h-3 rounded skeleton" />
      </div>
      <div className="w-16 h-8 rounded-xl skeleton flex-shrink-0" />
    </div>
  );
}
