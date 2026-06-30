import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineAdjustments, HiX } from 'react-icons/hi';
import { BRANCHES, SEMESTERS, RESOURCE_TYPES, getAllSubjects } from '../../config/constants';

export default function SearchFilters({ onSearch, onFilter, initialFilters = {}, searchValue = '' }) {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ branch:'', semester:'', type:'', subject:'', ...initialFilters });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => { setSearchTerm(searchValue); }, [searchValue]);

  useEffect(() => {
    if (filters.branch && filters.semester) {
      setSubjects(getAllSubjects(filters.branch, Number(filters.semester)));
    } else { setSubjects([]); setFilters(f => ({ ...f, subject: '' })); }
  }, [filters.branch, filters.semester]);

  const handleSearchChange = val => { setSearchTerm(val); onSearch?.(val); };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    if (key === 'branch' || key === 'semester') updated.subject = '';
    setFilters(updated); onFilter?.(updated);
  };

  const clearAll = () => {
    const cleared = { branch:'', semester:'', type:'', subject:'' };
    setFilters(cleared); setSearchTerm('');
    onSearch?.(''); onFilter?.(cleared);
  };

  const activeCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <div className="rounded-3xl border p-4 mb-6"
         style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.85) 0%, rgba(219,209,237,0.35) 100%)', borderColor: 'rgba(110,99,46,0.13)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 12px rgba(110,99,46,0.06)' }}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9A8F5A' }} />
          <input type="text" placeholder="Search by title, subject, uploader..."
            value={searchTerm} onChange={e => handleSearchChange(e.target.value)}
            className="input-field pl-10 pr-12" />
          <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center px-1.5 py-0.5 rounded text-[10px] font-semibold"
               style={{ background: 'rgba(110,99,46,0.10)', color: '#9A8F5A', border: '1px solid rgba(110,99,46,0.15)' }}>
            /
          </kbd>
        </div>

        <button onClick={() => setShowFilters(p => !p)}
          className="btn-ghost px-4 gap-2 relative text-sm"
          style={showFilters ? { background: 'rgba(110,99,46,0.12)', borderColor: 'rgba(110,99,46,0.30)' } : {}}>
          <HiOutlineAdjustments className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-[#F5F0DC]"
                  style={{ background: 'linear-gradient(135deg, #7A6F35, #6E632E)' }}>
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button onClick={clearAll} className="p-2.5 rounded-2xl border transition-all duration-200 hover:bg-red-50"
                  style={{ background: 'rgba(237,232,208,0.70)', borderColor: 'rgba(110,99,46,0.18)', color: '#9A8F5A' }}>
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4"
             style={{ borderTop: '1px solid rgba(110,99,46,0.10)' }}>
          {[
            { key:'branch',   label:'Branch',   options:[{value:'',label:'All Branches'},   ...BRANCHES.map(b=>({value:b.value,label:b.value}))]},
            { key:'semester', label:'Semester',  options:[{value:'',label:'All Semesters'}, ...SEMESTERS.map(s=>({value:s,label:`Sem ${s}`}))]},
            { key:'type',     label:'Type',      options:[{value:'',label:'All Types'},      ...RESOURCE_TYPES.map(t=>({value:t.value,label:t.label}))]},
            { key:'subject',  label:'Subject',   options:[{value:'',label:subjects.length?'All Subjects':'Select branch & sem'}, ...subjects.map(s=>({value:s,label:s}))], disabled:subjects.length===0},
          ].map(({ key, label, options, disabled }) => (
            <div key={key}>
              <label className="field-label text-[10px]">{label}</label>
              <select className="input-field text-xs py-2" style={{ appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E632E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', backgroundSize:'14px', paddingRight:'32px' }}
                value={filters[key]} onChange={e => handleFilterChange(key, e.target.value)} disabled={disabled}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
