import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <span className="text-5xl font-display font-black text-primary-200">?</span>
      </div>
      <h1 className="font-display font-black text-7xl text-primary-600 mb-2">404</h1>
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-3">Page not found</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">
          <HiOutlineHome className="w-4 h-4" /> Go Home
        </Link>
        <Link to="/browse" className="btn-secondary">
          <HiOutlineSearch className="w-4 h-4" /> Browse Resources
        </Link>
      </div>
    </div>
  );
}
