import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subscribeToResources } from '../services/resources';
import ResourceCard from '../components/common/ResourceCard';
import SearchFilters from '../components/resources/SearchFilters';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { HiOutlineSearch, HiOutlineViewGrid, HiOutlineViewList } from 'react-icons/hi';

const fadeUp  = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.4,ease:[0.22,1,0.36,1]}} };
const stagger = { visible:{transition:{staggerChildren:0.04}} };

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [searchInput, setSearchInput]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    branch: searchParams.get('branch')||'', semester: searchParams.get('semester')||'',
    type: searchParams.get('type')||'', subject:'',
  });
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer.current);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true); setError(null);
    const unsub = subscribeToResources(filters, 60, (resources, err) => {
      if (err) { setError(err); setLoading(false); return; }
      setAllResources(resources); setLoading(false);
    });
    return unsub;
  }, [filters.branch, filters.semester, filters.type, filters.subject]);

  const resources = useMemo(() => {
    if (!debouncedSearch.trim()) return allResources;
    const t = debouncedSearch.toLowerCase();
    return allResources.filter(r =>
      r.title?.toLowerCase().includes(t) || r.subject?.toLowerCase().includes(t) ||
      r.description?.toLowerCase().includes(t) || r.uploaderName?.toLowerCase().includes(t)
    );
  }, [allResources, debouncedSearch]);

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(171,190,237,0.18) 35%,rgba(237,232,208,0.95) 65%,rgba(219,209,237,0.20) 100%)' }}>
      <div className="blob-pastel w-[450px] h-[450px] top-0 right-0 opacity-25 fixed pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">Browse Resources</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm" style={{ color:'#6B6344' }}>
                {loading ? 'Loading...' : `${resources.length} resource${resources.length!==1?'s':''}`}
              </p>
              {!loading && !error && (
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color:'#6E632E' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background:'#6E632E' }} /> Live
                </span>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <SearchFilters onSearch={setSearchInput} onFilter={setFilters} initialFilters={filters} searchValue={searchInput} />
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color:'#9A8F5A' }}>
              {debouncedSearch ? `Results for "${debouncedSearch}"` : 'All resources'}
            </p>
            <div className="flex items-center gap-1 p-1 rounded-2xl border"
                 style={{ background:'rgba(237,232,208,0.80)', borderColor:'rgba(110,99,46,0.15)' }}>
              {[['grid',HiOutlineViewGrid],['list',HiOutlineViewList]].map(([v,Icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className="p-1.5 rounded-xl transition-all duration-200"
                  style={view===v ? { background:'rgba(110,99,46,0.12)', color:'#6E632E' } : { color:'#9A8F5A' }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </motion.div>

          {error ? (
            <ErrorState onRetry={() => setFilters(f => ({...f}))} />
          ) : loading ? (
            <div className={`grid gap-4 ${view==='grid'?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
              {Array.from({length:9}).map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : resources.length === 0 ? (
            <EmptyState icon={HiOutlineSearch} title="No resources found"
              description="Try different filters or be the first to upload for this criteria."
              actionLabel="Upload Resource" actionTo="/upload" />
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className={`grid gap-4 ${view==='grid'?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3':'grid-cols-1'}`}>
              {resources.map(r => (
                <motion.div key={r.id} variants={fadeUp}><ResourceCard resource={r} /></motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
