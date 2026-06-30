import { useEffect, useState } from 'react';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { addBookmark, removeBookmark, subscribeToBookmark } from '../../services/bookmarks';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function BookmarkButton({ resourceId, size = 'md', variant = 'icon' }) {
  const { currentUser } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [pending, setPending]       = useState(false);

  useEffect(() => {
    if (!currentUser) { setBookmarked(false); return; }
    const unsub = subscribeToBookmark(currentUser.uid, resourceId, setBookmarked);
    return unsub;
  }, [currentUser, resourceId]);

  const handleToggle = async e => {
    e.preventDefault(); e.stopPropagation();
    if (!currentUser) { toast.error('Sign in to bookmark.'); return; }
    if (pending) return;
    const next = !bookmarked;
    setBookmarked(next); setPending(true);
    try {
      next ? await addBookmark(currentUser.uid, resourceId) : await removeBookmark(currentUser.uid, resourceId);
    } catch { setBookmarked(!next); toast.error('Could not update bookmark.'); }
    finally { setPending(false); }
  };

  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  if (variant === 'button') {
    return (
      <button onClick={handleToggle}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95"
        style={bookmarked
          ? { background: 'rgba(110,99,46,0.12)', borderColor: 'rgba(110,99,46,0.25)', color: '#6E632E' }
          : { background: 'rgba(237,232,208,0.70)', borderColor: 'rgba(110,99,46,0.18)', color: '#9A8F5A' }}>
        {bookmarked ? <HiBookmark className={sizeMap[size]} /> : <HiOutlineBookmark className={sizeMap[size]} />}
        {bookmarked ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button onClick={handleToggle}
      className="p-1.5 rounded-xl transition-all duration-200 active:scale-90"
      style={bookmarked
        ? { color: '#6E632E', background: 'rgba(110,99,46,0.10)' }
        : { color: 'rgba(110,99,46,0.30)' }}
      onMouseEnter={e => { if (!bookmarked) e.currentTarget.style.background = 'rgba(110,99,46,0.08)'; }}
      onMouseLeave={e => { if (!bookmarked) e.currentTarget.style.background = 'transparent'; }}>
      {bookmarked ? <HiBookmark className={sizeMap[size]} /> : <HiOutlineBookmark className={sizeMap[size]} />}
    </button>
  );
}
