import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../config/constants';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';
import {
  HiOutlineBookOpen,
  HiOutlineUpload,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiMenu,
  HiX,
  HiOutlineViewGrid,
  HiOutlineBookmark,
} from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2';

export default function Navbar() {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const navLink = 'text-slate-600 hover:text-primary-700 font-medium text-sm transition-colors duration-150 px-1 py-0.5';
  const activeNavLink = 'text-primary-700 font-semibold text-sm';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <HiOutlineBookOpen className="text-white w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-primary-700">{APP_NAME}</span>
              <span className="block text-[10px] font-medium text-slate-500 leading-none -mt-0.5">JNCT, Bhopal</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/browse" className={({ isActive }) => isActive ? activeNavLink : navLink}>
              Browse
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? activeNavLink : navLink}>
              Leaderboard
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                  Dashboard
                </NavLink>
                <NavLink to="/upload" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                  Upload
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? activeNavLink : navLink}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Avatar
                    src={userProfile?.photoURL}
                    name={userProfile?.displayName || currentUser.email}
                    size="sm"
                    className="border-2 border-primary-200"
                  />
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {userProfile?.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {userProfile?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      {isAdmin && (
                        <span className="badge-blue mt-1">Admin</span>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <HiOutlineUser className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <HiOutlineViewGrid className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <HiOutlineBookmark className="w-4 h-4" /> Saved Resources
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <HiOutlineCog className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <HiOutlineLogout className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2 animate-fade-in">
          <nav className="flex flex-col gap-1">
            <NavLink to="/browse" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
              <HiOutlineSearch className="w-4 h-4" /> Browse Resources
            </NavLink>
            <NavLink to="/leaderboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
              <HiOutlineTrophy className="w-4 h-4" /> Leaderboard
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                  <HiOutlineViewGrid className="w-4 h-4" /> Dashboard
                </NavLink>
                <NavLink to="/upload" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                  <HiOutlineUpload className="w-4 h-4" /> Upload Resource
                </NavLink>
                <NavLink to="/bookmarks" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                  <HiOutlineBookmark className="w-4 h-4" /> Saved Resources
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
                <HiOutlineCog className="w-4 h-4" /> Admin Panel
              </NavLink>
            )}
            {!currentUser && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Overlay for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
