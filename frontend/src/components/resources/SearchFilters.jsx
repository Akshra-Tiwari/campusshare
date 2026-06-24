import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineFilter, HiX } from 'react-icons/hi';
import { BRANCHES, SEMESTERS, RESOURCE_TYPES, getAllSubjects } from '../../config/constants';

export default function SearchFilters({ onSearch, onFilter, initialFilters = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    type: '',
    subject: '',
    ...initialFilters,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (filters.branch && filters.semester) {
      setSubjects(getAllSubjects(filters.branch, Number(filters.semester)));
    } else {
      setSubjects([]);
      setFilters((f) => ({ ...f, subject: '' }));
    }
  }, [filters.branch, filters.semester]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    onSearch?.(value); // parent debounces this
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    if (key === 'branch' || key === 'semester') {
      updated.subject = '';
    }
    setFilters(updated);
    onFilter?.(updated);
  };

  const clearFilters = () => {
    const cleared = { branch: '', semester: '', type: '', subject: '' };
    setFilters(cleared);
    setSearchTerm('');
    onSearch?.('');
    onFilter?.(cleared);
  };

  const hasActiveFilters = filters.branch || filters.semester || filters.type || filters.subject || searchTerm;

  return (
    <div className="card p-4 mb-6">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, subject, uploader..."
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="input-field pl-9 pr-12"
          />
          <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            /
          </kbd>
        </div>
        <button type="submit" className="btn-primary px-4">Search</button>
        <button
          type="button"
          onClick={() => setShowFilters((p) => !p)}
          className={`btn-secondary px-4 gap-2 ${showFilters ? 'bg-primary-50 border-primary-300' : ''}`}
        >
          <HiOutlineFilter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </button>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="btn-secondary px-3">
            <HiX className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 animate-fade-in">
          <div>
            <label className="label text-xs">Branch</label>
            <select
              className="input-field text-xs py-2"
              value={filters.branch}
              onChange={(e) => handleFilterChange('branch', e.target.value)}
            >
              <option value="">All Branches</option>
              {BRANCHES.map((b) => (
                <option key={b.value} value={b.value}>{b.value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">Semester</label>
            <select
              className="input-field text-xs py-2"
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">Type</label>
            <select
              className="input-field text-xs py-2"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-xs">Subject</label>
            <select
              className="input-field text-xs py-2"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              disabled={subjects.length === 0}
            >
              <option value="">{subjects.length > 0 ? 'All Subjects' : 'Select branch & sem'}</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
