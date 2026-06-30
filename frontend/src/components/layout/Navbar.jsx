import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';
import {
  HiOutlineBookOpen, HiOutlineUpload, HiOutlineUser,
  HiOutlineCog, HiOutlineLogout, HiOutlineViewGrid,
  HiOutlineBookmark, HiOutlineX, HiMenu, HiChevronDown,
} from 'react-icons/hi';

const NAV_LINKS = [
  { label: 'Features',    href: '/#features' },
  { label: 'Resources',   href: '/browse' },
  { label: 'Departments', href: '/#departments' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export default function Navbar() {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    try { await logout(); toast.success('Signed out'); navigate('/'); }
    catch { toast.error('Sign out failed'); }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav border-b shadow-card'
          : 'bg-transparent border-b border-transparent'
      }`} style={{ borderColor: scrolled ? 'rgba(110,99,46,0.12)' : 'transparent' }}>
        <div className="container-xl">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300
                              group-hover:shadow-olive group-hover:scale-105"
                   style={{ background: 'linear-gradient(135deg, #7A6F35, #6E632E)' }}>
                <HiOutlineBookOpen className="w-4 h-4 text-[#F5F0DC]" />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-[#2C2A1E]">CampusShare</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) =>
                href.startsWith('/#') ? (
                  <a key={label} href={href}
                     className="nav-link px-3.5 py-2 rounded-xl hover:bg-[rgba(110,99,46,0.06)] transition-all duration-200">
                    {label}
                  </a>
                ) : (
                  <NavLink key={label} to={href}
                    className={({ isActive }) =>
                      `nav-link px-3.5 py-2 rounded-xl hover:bg-[rgba(110,99,46,0.06)] transition-all duration-200 ${isActive ? 'nav-link-active bg-[rgba(110,99,46,0.06)]' : ''}`
                    }>
                    {label}
                  </NavLink>
                )
              )}
              {isAdmin && (
                <NavLink to="/admin"
                  className={({ isActive }) =>
                    `nav-link px-3.5 py-2 rounded-xl hover:bg-[rgba(110,99,46,0.06)] transition-all duration-200 ${isActive ? 'nav-link-active' : ''}`
                  }>
                  Admin
                </NavLink>
              )}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200
                               hover:bg-[rgba(110,99,46,0.08)] border border-transparent
                               hover:border-[rgba(110,99,46,0.15)]">
                    <Avatar src={userProfile?.photoURL}
                      name={userProfile?.displayName || currentUser.email} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-[#2C2A1E] max-w-[110px] truncate">
                      {userProfile?.displayName || currentUser.email?.split('@')[0]}
                    </span>
                    <HiChevronDown className={`w-3.5 h-3.5 text-[#9A8F5A] transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border py-1.5 z-50"
                        style={{
                          background: 'linear-gradient(135deg, rgba(237,232,208,0.97) 0%, rgba(249,246,238,0.97) 100%)',
                          borderColor: 'rgba(110,99,46,0.14)',
                          boxShadow: '0 8px 40px rgba(110,99,46,0.15), 0 2px 8px rgba(110,99,46,0.08)',
                          backdropFilter: 'blur(20px)',
                        }}>
                        <div className="px-4 py-2.5 mb-1" style={{ borderBottom: '1px solid rgba(110,99,46,0.10)' }}>
                          <p className="text-sm font-semibold text-[#2C2A1E] truncate">{userProfile?.displayName || 'User'}</p>
                          <p className="text-xs text-[#9A8F5A] truncate mt-0.5">{currentUser.email}</p>
                        </div>
                        {[
                          { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
                          { to: '/profile',   icon: HiOutlineUser,     label: 'Profile' },
                          { to: '/bookmarks', icon: HiOutlineBookmark, label: 'Saved Resources' },
                          { to: '/upload',    icon: HiOutlineUpload,   label: 'Upload Resource' },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A4030]
                                       hover:bg-[rgba(110,99,46,0.07)] transition-colors duration-150">
                            <Icon className="w-4 h-4 text-[#9A8F5A]" />
                            {label}
                          </Link>
                        ))}
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A4030]
                                       hover:bg-[rgba(110,99,46,0.07)] transition-colors duration-150">
                            <HiOutlineCog className="w-4 h-4 text-[#9A8F5A]" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="pt-1 mt-1" style={{ borderTop: '1px solid rgba(110,99,46,0.10)' }}>
                          <button onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left
                                       text-red-600 hover:bg-red-50 transition-colors duration-150">
                            <HiOutlineLogout className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="nav-link px-4 py-2 rounded-xl hover:bg-[rgba(110,99,46,0.06)] transition-all">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-olive text-sm px-5 py-2.5">Get Started</Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(p => !p)}
                className="md:hidden p-2 rounded-xl hover:bg-[rgba(110,99,46,0.08)] transition-colors">
                {mobileOpen
                  ? <HiOutlineX className="w-5 h-5 text-[#6E632E]" />
                  : <HiMenu     className="w-5 h-5 text-[#6B6344]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
              style={{ background: 'rgba(237,232,208,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(110,99,46,0.10)' }}>
              <div className="px-5 py-4 space-y-1">
                {NAV_LINKS.map(({ label, href }) =>
                  href.startsWith('/#') ? (
                    <a key={label} href={href}
                       className="block px-4 py-2.5 text-sm font-medium text-[#4A4030] hover:bg-[rgba(110,99,46,0.08)] rounded-xl transition-colors">
                      {label}
                    </a>
                  ) : (
                    <Link key={label} to={href}
                      className="block px-4 py-2.5 text-sm font-medium text-[#4A4030] hover:bg-[rgba(110,99,46,0.08)] rounded-xl transition-colors">
                      {label}
                    </Link>
                  )
                )}
                {!currentUser && (
                  <div className="flex gap-2 pt-3 mt-2" style={{ borderTop: '1px solid rgba(110,99,46,0.10)' }}>
                    <Link to="/login"    className="btn-ghost flex-1 text-sm py-2.5">Sign In</Link>
                    <Link to="/register" className="btn-olive flex-1 text-sm py-2.5">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="h-16" />
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </>
  );
}
