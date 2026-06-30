import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserResources, deleteResource } from '../services/firestore';
import { deleteResourceViaBackend } from '../services/api';
import { SkeletonRow } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Avatar from '../components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { HiOutlineUpload, HiOutlineDownload, HiOutlineDocumentText, HiOutlineTrash, HiOutlinePencil, HiOutlineEye, HiOutlineBookmark, HiOutlineStar } from 'react-icons/hi';
import { BRANCHES, RESOURCE_TYPES } from '../config/constants';

const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.08,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.08}} };

const StatCard = ({ icon: Icon, value, label, grad }) => (
  <div className="rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-0.5"
       style={{ background: grad, borderColor:'rgba(110,99,46,0.13)', boxShadow:'0 2px 12px rgba(110,99,46,0.06)', backdropFilter:'blur(12px)' }}>
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border"
         style={{ background:'rgba(237,232,208,0.70)', borderColor:'rgba(110,99,46,0.15)' }}>
      <Icon className="w-5 h-5" style={{ color:'#6E632E' }} />
    </div>
    <p className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">{value}</p>
    <p className="text-xs mt-0.5 font-medium" style={{ color:'#9A8F5A' }}>{label}</p>
  </div>
);

export default function DashboardPage() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);

  const branchLabel = BRANCHES.find(b => b.value === userProfile?.branch)?.label;

  useEffect(() => {
    if (!currentUser) return;
    getUserResources(currentUser.uid).then(setResources).catch(console.error).finally(() => setLoading(false));
  }, [currentUser]);

  const handleDelete = async resource => {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;
    setDeleting(resource.id);
    try {
      try { await deleteResourceViaBackend(resource.id); }
      catch { await deleteResource(resource.id, resource.filePath, currentUser.uid); }
      setResources(p => p.filter(r => r.id !== resource.id));
      await refreshUserProfile();
      toast.success('Resource deleted.');
    } catch { toast.error('Delete failed.'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.20) 35%,rgba(237,232,208,0.95) 65%,rgba(171,190,237,0.15) 100%)' }}>
      <div className="blob-lavender w-[500px] h-[500px] top-0 right-0 opacity-25 fixed pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* Header */}
          <motion.div custom={0} variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">
                Welcome back, {userProfile?.displayName?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p className="text-sm mt-1" style={{ color:'#6B6344' }}>
                {branchLabel && `${branchLabel}`}{userProfile?.semester && ` · Semester ${userProfile.semester}`}
              </p>
            </div>
            <Link to="/upload" className="btn-olive">
              <HiOutlineUpload className="w-4 h-4" /> Upload Resource
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div custom={1} variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={HiOutlineDocumentText} value={userProfile?.uploadCount||0}   label="Total Uploads"   grad="linear-gradient(135deg,rgba(171,190,237,0.45) 0%,rgba(237,232,208,0.88) 100%)" />
            <StatCard icon={HiOutlineDownload}     value={userProfile?.downloadCount||0} label="Total Downloads" grad="linear-gradient(135deg,rgba(219,209,237,0.55) 0%,rgba(237,232,208,0.88) 100%)" />
            <StatCard icon={HiOutlineStar}         value={resources.filter(r=>r.averageRating>=4).length} label="Top Rated" grad="linear-gradient(135deg,rgba(237,232,208,0.90) 0%,rgba(219,209,237,0.45) 100%)" />
            <StatCard icon={HiOutlineBookmark}     value={userProfile?.role==='admin'?'Admin':'Student'} label="Account Role" grad="linear-gradient(135deg,rgba(171,190,237,0.35) 0%,rgba(219,209,237,0.40) 50%,rgba(237,232,208,0.88) 100%)" />
          </motion.div>

          {/* Profile card */}
          <motion.div custom={2} variants={fadeUp} className="rounded-3xl border p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background:'linear-gradient(135deg,rgba(237,232,208,0.85) 0%,rgba(219,209,237,0.40) 100%)', borderColor:'rgba(110,99,46,0.13)', backdropFilter:'blur(12px)', boxShadow:'0 2px 16px rgba(110,99,46,0.07)' }}>
            <Avatar src={userProfile?.photoURL} name={userProfile?.displayName||currentUser?.email}
              size="xl" rounded="xl" className="flex-shrink-0"
              style={{ background:'linear-gradient(135deg,rgba(219,209,237,0.8),rgba(171,190,237,0.6))' }} />
            <div className="flex-1">
              <h3 className="font-bold text-[#2C2A1E] text-lg">{userProfile?.displayName}</h3>
              <p className="text-sm mt-0.5" style={{ color:'#6B6344' }}>{currentUser?.email}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {userProfile?.branch && <span className="badge-olive">{userProfile.branch}</span>}
                {userProfile?.semester && <span className="badge-warm">Sem {userProfile.semester}</span>}
                {userProfile?.role==='admin' && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-red-700 border" style={{ background:'rgba(220,80,80,0.10)', borderColor:'rgba(220,80,80,0.25)' }}>Admin</span>}
              </div>
            </div>
            <Link to="/profile" className="btn-ghost text-sm flex-shrink-0">
              <HiOutlinePencil className="w-4 h-4" /> Edit Profile
            </Link>
          </motion.div>

          {/* Uploads table */}
          <motion.div custom={3} variants={fadeUp}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#2C2A1E]">
                My Uploads <span className="text-sm font-normal ml-1" style={{ color:'#9A8F5A' }}>({resources.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">{Array.from({length:3}).map((_,i) => <SkeletonRow key={i} />)}</div>
            ) : resources.length === 0 ? (
              <EmptyState title="No uploads yet" description="Share your notes and help fellow JNCT students." actionLabel="Upload Now" actionTo="/upload" />
            ) : (
              <div className="rounded-3xl border overflow-x-auto"
                   style={{ background:'linear-gradient(135deg,rgba(237,232,208,0.85) 0%,rgba(219,209,237,0.30) 100%)', borderColor:'rgba(110,99,46,0.12)', backdropFilter:'blur(12px)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {['Resource','Branch / Sem','Type','Downloads','Uploaded','Actions'].map(h => (
                        <th key={h} className="premium-th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map(r => (
                      <tr key={r.id} className="premium-tr">
                        <td className="premium-td">
                          <p className="font-semibold text-[#2C2A1E] line-clamp-1 max-w-[180px]">{r.title}</p>
                          <p className="text-xs mt-0.5 truncate max-w-[180px]" style={{ color:'#9A8F5A' }}>{r.subject}</p>
                        </td>
                        <td className="premium-td">
                          <span className="badge-olive mr-1">{r.branch}</span>
                          <span className="badge-warm">S{r.semester}</span>
                        </td>
                        <td className="premium-td">
                          <span className="badge-lavender">{RESOURCE_TYPES.find(t=>t.value===r.type)?.label||r.type}</span>
                        </td>
                        <td className="premium-td" style={{ color:'#6B6344' }}>{r.downloads||0}</td>
                        <td className="premium-td text-xs whitespace-nowrap" style={{ color:'#9A8F5A' }}>
                          {r.createdAt?.toDate ? formatDistanceToNow(r.createdAt.toDate(),{addSuffix:true}) : '—'}
                        </td>
                        <td className="premium-td">
                          <div className="flex items-center gap-1">
                            <Link to={`/resources/${r.id}`}
                              className="p-1.5 rounded-xl transition-all duration-150 hover:scale-110"
                              style={{ color:'#9A8F5A' }}
                              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(110,99,46,0.08)'; e.currentTarget.style.color='#6E632E'; }}
                              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#9A8F5A'; }}>
                              <HiOutlineEye className="w-4 h-4" />
                            </Link>
                            <button onClick={()=>handleDelete(r)} disabled={deleting===r.id}
                              className="p-1.5 rounded-xl transition-all duration-150 disabled:opacity-40"
                              style={{ color:'#9A8F5A' }}
                              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(220,80,80,0.08)'; e.currentTarget.style.color='#c53030'; }}
                              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#9A8F5A'; }}>
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
