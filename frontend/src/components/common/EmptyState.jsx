import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineInbox, HiOutlineUpload } from 'react-icons/hi';

export default function EmptyState({ title, description, actionLabel, actionTo, icon: Icon = HiOutlineInbox }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full blur-2xl opacity-50"
             style={{ background: 'radial-gradient(circle, rgba(219,209,237,0.8), transparent)', transform: 'scale(2)' }} />
        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center border"
             style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.90) 0%, rgba(219,209,237,0.50) 100%)', borderColor: 'rgba(110,99,46,0.14)', boxShadow: '0 4px 16px rgba(110,99,46,0.08)' }}>
          <Icon className="w-7 h-7" style={{ color: 'rgba(110,99,46,0.40)' }} />
        </div>
      </div>
      <h3 className="text-base font-semibold text-[#2C2A1E] mb-2">{title}</h3>
      {description && <p className="text-sm max-w-xs mb-6 leading-relaxed" style={{ color: '#6B6344' }}>{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-olive text-sm">
          <HiOutlineUpload className="w-4 h-4" /> {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
