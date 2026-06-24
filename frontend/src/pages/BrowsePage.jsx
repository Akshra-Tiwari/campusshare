import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subscribeToResources } from '../services/resources';
import ResourceCard from '../components/common/ResourceCard';
import SearchFilters from '../components/resources/SearchFilters';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { HiOutlineSearch } from 'react-icons/hi';

const SEARCH_DEBOUNCE_MS = 300;

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    branch: searchParams.get('branch') || '',
    semester: searchParams.get('semester') || '',
    type: searchParams.get('type') || '',
    subject: '',
  });

  const debounceTimer = useRef(null);

  // Debounce search input — avoids re-filtering on every keystroke.
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput]);

  // Real-time subscription — re-subscribes whenever field filters change.
  // Text search is applied client-side on top of this live snapshot below.
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToResources(filters, 60, (resources, err) => {
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      setAllResources(resources);
      setLoading(false);
    });

    return unsubscribe;
  }, [filters.branch, filters.semester, filters.type, filters.subject]);

  const resources = useMemo(() => {
    if (!debouncedSearch.trim()) return allResources;
    const term = debouncedSearch.toLowerCase();
    return allResources.filter(
      (r) =>
        r.title?.toLowerCase().includes(term) ||
        r.subject?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.uploaderName?.toLowerCase().includes(term)
    );
  }, [allResources, debouncedSearch]);

  const handleSearch = (term) => {
    setSearchInput(term);
  };

  const handleFilter = (activeFilters) => {
    setFilters(activeFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="page-header">
        <h1 className="font-display font-bold text-3xl text-slate-800">Browse Resources</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          {resources.length > 0 && !loading ? (
            <>
              {resources.length} resource{resources.length !== 1 ? 's' : ''} found
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </>
          ) : (
            'Find notes, PYQs, assignments and more.'
          )}
        </p>
      </div>

      <SearchFilters
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialFilters={filters}
      />

      {error ? (
        <ErrorState
          title="Couldn't load resources"
          description="We had trouble connecting to the server. Check your connection and try again."
          onRetry={() => setFilters((f) => ({ ...f }))}
        />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={HiOutlineSearch}
          title="No resources found"
          description="Try adjusting your search or filters, or be the first to upload something for this criteria."
          actionLabel="Upload Resource"
          actionTo="/upload"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}
