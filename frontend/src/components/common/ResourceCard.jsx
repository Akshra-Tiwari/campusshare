import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { HiOutlineDownload, HiOutlineDocumentText, HiOutlinePhotograph } from 'react-icons/hi';
import StarRating from './StarRating';
import BookmarkButton from './BookmarkButton';
import { RESOURCE_TYPES } from '../../config/constants';

const TYPE_GRAD = {
  notes:      'linear-gradient(135deg, rgba(171,190,237,0.45) 0%, rgba(237,232,208,0.88) 100%)',
  pyq:        'linear-gradient(135deg, rgba(219,209,237,0.55) 0%, rgba(237,232,208,0.88) 100%)',
  assignment: 'linear-gradient(135deg, rgba(171,190,237,0.35) 0%, rgba(219,209,237,0.40) 50%, rgba(237,232,208,0.88) 100%)',
  lab:        'linear-gradient(135deg, rgba(237,232,208,0.90) 0%, rgba(219,209,237,0.50) 100%)',
  syllabus:   'linear-gradient(135deg, rgba(219,209,237,0.50) 0%, rgba(237,232,208,0.88) 100%)',
  other:      'linear-gradient(135deg, rgba(237,232,208,0.85) 0%, rgba(171,190,237,0.30) 100%)',
};

const TYPE_BADGE = {
  notes:      { bg: 'rgba(171,190,237,0.40)', border: 'rgba(171,190,237,0.65)', color: '#3A5A9A' },
  pyq:        { bg: 'rgba(219,209,237,0.50)', border: 'rgba(219,209,237,0.80)', color: '#5A4E8A' },
  assignment: { bg: 'rgba(110,99,46,0.10)',   border: 'rgba(110,99,46,0.22)',   color: '#6E632E' },
  lab:        { bg: 'rgba(171,190,237,0.35)', border: 'rgba(171,190,237,0.60)', color: '#3A5A9A' },
  syllabus:   { bg: 'rgba(219,209,237,0.45)', border: 'rgba(219,209,237,0.70)', color: '#5A4E8A' },
  other:      { bg: 'rgba(237,232,208,0.80)', border: 'rgba(110,99,46,0.18)',   color: '#6B6344' },
};

export default function ResourceCard({ resource }) {
  const { id, title, subject, branch, semester, type, fileType,
          downloads = 0, averageRating = 0, totalRatings = 0,
          uploaderName, createdAt } = resource;

  const typeLabel = RESOURCE_TYPES.find(t => t.value === type)?.label || type;
  const isPDF     = fileType === 'application/pdf';
  const badge = TYPE_BADGE[type] || TYPE_BADGE.other;
  const grad  = TYPE_GRAD[type]  || TYPE_GRAD.other;

  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}>
      <Link to={`/resources/${id}`}
        className="flex flex-col h-full rounded-3xl border overflow-hidden group transition-all duration-300"
        style={{
          background: grad,
          borderColor: 'rgba(110,99,46,0.12)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 4px rgba(110,99,46,0.06), 0 4px 16px rgba(110,99,46,0.04)',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 8px rgba(110,99,46,0.08), 0 12px 36px rgba(110,99,46,0.10)'; e.currentTarget.style.borderColor = 'rgba(110,99,46,0.20)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(110,99,46,0.06), 0 4px 16px rgba(110,99,46,0.04)'; e.currentTarget.style.borderColor = 'rgba(110,99,46,0.12)'; }}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(237,232,208,0.70)', border: '1px solid rgba(110,99,46,0.14)' }}>
              {isPDF
                ? <HiOutlineDocumentText className="w-5 h-5" style={{ color: '#6E632E' }} />
                : <HiOutlinePhotograph   className="w-5 h-5" style={{ color: '#6E632E' }} />
              }
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{ background: badge.bg, borderColor: badge.border, color: badge.color }}>
                {typeLabel}
              </span>
              <div onClick={e => e.preventDefault()}>
                <BookmarkButton resourceId={id} size="sm" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-[#2C2A1E] leading-snug mb-1 line-clamp-2
                         group-hover:text-[#6E632E] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs mb-4 truncate" style={{ color: '#9A8F5A' }}>{subject}</p>

          {/* Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{ background: 'rgba(110,99,46,0.10)', borderColor: 'rgba(110,99,46,0.20)', color: '#6E632E' }}>
              {branch}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{ background: 'rgba(237,232,208,0.70)', borderColor: 'rgba(110,99,46,0.15)', color: '#6B6344' }}>
              Sem {semester}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <StarRating value={Math.round(averageRating)} readonly size="sm" />
            <span className="text-[10px]" style={{ color: '#9A8F5A' }}>
              {averageRating > 0 ? `${averageRating.toFixed(1)} (${totalRatings})` : 'No ratings'}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 flex items-center justify-between"
               style={{ borderTop: '1px solid rgba(110,99,46,0.10)' }}>
            <p className="text-[10px] truncate max-w-[110px]" style={{ color: '#9A8F5A' }}>
              {uploaderName || 'Anonymous'}
            </p>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: '#9A8F5A' }}>
              <HiOutlineDownload className="w-3 h-3" /> {downloads}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
