import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchResources } from '../services/firestore';
import ResourceCard from '../components/common/ResourceCard';
import SearchFilters from '../components/resources/SearchFilters';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { HiOutlineSearch } from 'react-icons/hi';

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    branch: searchParams.get('branch') || '',
    semester: searchParams.get('semester') || '',
    type: searchParams.get('type') || '',
    subject: '',
  });

  const load = useCallback(async (term = '', activeFilters = {}) => {
    setLoading(true);
    try {
      const results = await searchResources(term, activeFilters);
      setResources(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(searchTerm, filters);
  }, []);

  const handleSearch = (term, activeFilters) => {
    setSearchTerm(term);
    setFilters(activeFilters);
    load(term, activeFilters);
  };

  const handleFilter = (activeFilters) => {
    setFilters(activeFilters);
    load(searchTerm, activeFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="page-header">
        <h1 className="font-display font-bold text-3xl text-slate-800">Browse Resources</h1>
        <p className="text-slate-500 mt-1">
          {resources.length > 0 && !loading ? `${resources.length} resource${resources.length !== 1 ? 's' : ''} found` : 'Find notes, PYQs, assignments and more.'}
        </p>
      </div>

      <SearchFilters
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialFilters={filters}
      />

      {loading ? (
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
