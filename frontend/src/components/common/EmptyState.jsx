import { Link } from 'react-router-dom';
import { HiOutlineInbox, HiOutlineUpload } from 'react-icons/hi';

export default function EmptyState({ title, description, actionLabel, actionTo, icon: Icon = HiOutlineInbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="relative mb-6">
        {/* Decorative background blob */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full blur-2xl opacity-60 scale-150" />

        {/* Floating accent dots */}
        <div className="absolute -top-2 -right-3 w-3 h-3 bg-accent-300 rounded-full animate-pulse" />
        <div className="absolute -bottom-1 -left-3 w-2 h-2 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />

        <div className="relative w-20 h-20 bg-white shadow-card rounded-2xl flex items-center justify-center border border-slate-100">
          <Icon className="w-10 h-10 text-primary-400" />
        </div>
      </div>
      <h3 className="text-xl font-display font-semibold text-slate-700 mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          <HiOutlineUpload className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
