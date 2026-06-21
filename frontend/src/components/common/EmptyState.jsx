import { Link } from 'react-router-dom';
import { HiOutlineInbox, HiOutlineUpload } from 'react-icons/hi';

export default function EmptyState({ title, description, actionLabel, actionTo, icon: Icon = HiOutlineInbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-primary-300" />
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
