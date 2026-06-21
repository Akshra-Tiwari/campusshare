import { Link } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { APP_NAME, COLLEGE_NAME } from '../../config/constants';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HiOutlineBookOpen className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-white text-lg">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed">
              {COLLEGE_NAME}'s centralized hub for study materials, PYQs, and academic resources.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-white transition-colors">Browse Resources</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/upload" className="hover:text-white transition-colors">Upload Material</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Institution</h4>
            <p className="text-sm">{COLLEGE_NAME}</p>
            <p className="text-sm mt-1">Bhopal, Madhya Pradesh</p>
            <p className="text-xs mt-3 text-slate-500">Affiliated to RGPV, Bhopal</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© {year} {APP_NAME} · {COLLEGE_NAME}</p>
          <p className="text-xs">Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}
