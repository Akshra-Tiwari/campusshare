import { motion } from 'framer-motion';
import { HiOutlineExclamation, HiOutlineRefresh } from 'react-icons/hi';

export default function ErrorState({ title = 'Something went wrong', description = 'We had trouble loading this. Please try again.', onRetry }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full blur-2xl opacity-40"
             style={{ background: 'radial-gradient(circle, rgba(220,100,100,0.4), transparent)', transform: 'scale(2)' }} />
        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center border"
             style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.90) 0%, rgba(255,220,220,0.40) 100%)', borderColor: 'rgba(200,80,80,0.15)', boxShadow: '0 4px 16px rgba(200,80,80,0.08)' }}>
          <HiOutlineExclamation className="w-7 h-7 text-red-400" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-[#2C2A1E] mb-2">{title}</h3>
      <p className="text-sm max-w-xs mb-6 leading-relaxed" style={{ color: '#6B6344' }}>{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-sm gap-2">
          <HiOutlineRefresh className="w-4 h-4" /> Try Again
        </button>
      )}
    </motion.div>
  );
}
