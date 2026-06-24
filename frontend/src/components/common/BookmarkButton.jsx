import { useEffect, useState } from 'react';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { addBookmark, removeBookmark, subscribeToBookmark } from '../../services/bookmarks';
import toast from 'react-hot-toast';
import clsx from 'clsx';

/**
 * A bookmark toggle button. Uses optimistic UI: the icon flips instantly on
 * click, then syncs with Firestore in the background. If the write fails,
 * it reverts and shows an error toast.
 */
export default function BookmarkButton({ resourceId, size = 'md', variant = 'icon' }) {
  const { currentUser } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setBookmarked(false);
      return;
    }
    const unsubscribe = subscribeToBookmark(currentUser.uid, resourceId, setBookmarked);
    return unsubscribe;
  }, [currentUser, resourceId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error('Sign in to bookmark resources.');
      return;
    }
    if (pending) return;

    const next = !bookmarked;
    setBookmarked(next); // optimistic
    setPending(true);

    try {
      if (next) {
        await addBookmark(currentUser.uid, resourceId);
      } else {
        await removeBookmark(currentUser.uid, resourceId);
      }
    } catch (err) {
      setBookmarked(!next); // revert on failure
      toast.error('Could not update bookmark. Try again.');
    } finally {
      setPending(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95',
          bookmarked
            ? 'bg-accent-100 text-accent-700 hover:bg-accent-200'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        )}
      >
        {bookmarked ? <HiBookmark className={sizeClasses[size]} /> : <HiOutlineBookmark className={sizeClasses[size]} />}
        {bookmarked ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      className={clsx(
        'p-2 rounded-xl transition-all duration-150 active:scale-90',
        bookmarked ? 'text-accent-500 hover:bg-accent-50' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      )}
    >
      {bookmarked ? <HiBookmark className={sizeClasses[size]} /> : <HiOutlineBookmark className={sizeClasses[size]} />}
    </button>
  );
}
