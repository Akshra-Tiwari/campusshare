import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookmarks } from '../services/bookmarks';
import { getResourceById } from '../services/resources';
import ResourceCard from '../components/common/ResourceCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { HiOutlineBookmark } from 'react-icons/hi';

export default function BookmarksPage() {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const resourceIds = await getUserBookmarks(currentUser.uid);
        const results = await Promise.all(
          resourceIds.map((id) => getResourceById(id).catch(() => null))
        );
        setResources(results.filter(Boolean));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="page-header">
        <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
          <HiOutlineBookmark className="w-8 h-8 text-accent-500" />
          Saved Resources
        </h1>
        <p className="text-slate-500 mt-1">
          {loading ? 'Loading your bookmarks...' : `${resources.length} resource${resources.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={HiOutlineBookmark}
          title="No saved resources yet"
          description="Bookmark resources while browsing to quickly find them again later."
          actionLabel="Browse Resources"
          actionTo="/browse"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}
