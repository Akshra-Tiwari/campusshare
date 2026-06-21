import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineDownload, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineClock, HiOutlineUser } from 'react-icons/hi';
import StarRating from './StarRating';
import { RESOURCE_TYPES } from '../../config/constants';
import clsx from 'clsx';

const typeColors = {
  notes:      'badge-blue',
  pyq:        'badge-yellow',
  assignment: 'badge bg-emerald-100 text-emerald-700',
  lab:        'badge bg-primary-100 text-primary-800',
  syllabus:   'badge bg-accent-100 text-accent-800',
  other:      'badge bg-slate-100 text-slate-600',
};

export default function ResourceCard({ resource }) {
  const {
    id, title, subject, branch, semester, type, fileType,
    downloads = 0, averageRating = 0, totalRatings = 0,
    uploaderName, createdAt,
  } = resource;

  const typeLabel = RESOURCE_TYPES.find((t) => t.value === type)?.label || type;
  const isPDF = fileType === 'application/pdf';
  const date = createdAt?.toDate ? formatDistanceToNow(createdAt.toDate(), { addSuffix: true }) : 'Recently';

  return (
    <Link to={`/resources/${id}`} className="card card-hover flex flex-col p-5 group cursor-pointer animate-fade-in">
      {/* Icon + Type Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className={clsx(
          'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
          isPDF ? 'bg-red-50' : 'bg-blue-50'
        )}>
          {isPDF
            ? <HiOutlineDocumentText className="w-6 h-6 text-red-500" />
            : <HiOutlinePhotograph className="w-6 h-6 text-blue-500" />
          }
        </div>
        <span className={typeColors[type] || typeColors.other}>{typeLabel}</span>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-slate-800 text-base leading-snug group-hover:text-primary-700 transition-colors mb-1 line-clamp-2">
        {title}
      </h3>

      {/* Subject */}
      <p className="text-xs text-slate-500 mb-3 truncate">{subject}</p>

      {/* Metadata chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="badge bg-primary-50 text-primary-600">{branch}</span>
        <span className="badge bg-accent-50 text-accent-600">Sem {semester}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <StarRating value={Math.round(averageRating)} readonly size="sm" />
        <span className="text-xs text-slate-500">
          {averageRating > 0 ? `${averageRating.toFixed(1)} (${totalRatings})` : 'No ratings yet'}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <HiOutlineUser className="w-3.5 h-3.5" />
          <span className="truncate max-w-[100px]">{uploaderName || 'Anonymous'}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <HiOutlineClock className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <HiOutlineDownload className="w-3.5 h-3.5" />
            <span>{downloads}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
