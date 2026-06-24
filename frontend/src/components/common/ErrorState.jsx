import { HiOutlineExclamation, HiOutlineRefresh } from 'react-icons/hi';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We had trouble loading this. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 scale-150" />
        <div className="relative w-20 h-20 bg-white shadow-card rounded-2xl flex items-center justify-center border border-red-100">
          <HiOutlineExclamation className="w-10 h-10 text-red-400" />
        </div>
      </div>
      <h3 className="text-xl font-display font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          <HiOutlineRefresh className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
