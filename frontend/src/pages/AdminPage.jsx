import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllUsers, getResources, deleteResource, updateUserProfile, getFlaggedResources } from '../services/firestore';
import { deleteResourceViaBackend } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import Avatar from '../components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { HiOutlineUsers, HiOutlineDocumentText, HiOutlineTrash, HiOutlineShieldCheck, HiOutlineDownload, HiOutlineStar, HiOutlineRefresh, HiOutlineBan, HiOutlineFlag } from 'react-icons/hi';

const TAB_RESOURCES='resources', TAB_USERS='users', TAB_FLAGGED='flagged';
const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.05,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.05}} };

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState(TAB_RESOURCES);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{resources:res}, allUsers, flaggedRes] = await Promise.all([getResources({},100), getAllUsers(), getFlaggedResources()]);
      setResources(res); setUsers(allUsers); setFlagged(flaggedRes);
    } catch { toast.error('Failed to load.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDeleteResource = async resource => {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;
    setDeletingId(resource.id);
    try {
      try { await deleteResourceViaBackend(resource.id); } catch { await deleteResource(resource.id, resource.filePath, resource.uploadedBy); }
      setResources(p=>p.filter(r=>r.id!==resource.id)); setFlagged(p=>p.filter(r=>r.id!==resource.id));
      toast.success('Deleted.');
    } catch { toast.error('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  const handleToggleAdmin = async user => {
    const role = user.role==='admin' ? 'student' : 'admin';
    if (!window.confirm(`Make ${user.displayName||user.email} a ${role}?`)) return;
    try { await updateUserProfile(user.id, { role }); setUsers(p=>p.map(u=>u.id===user.id?{...u,role}:u)); toast.success(`Role updated to ${role}.`); }
    catch { toast.error('Failed.'); }
  };

  if (loading) return <PageLoader />;
  const totalDownloads = resources.reduce((s,r)=>s+(r.downloads||0),0);
  const TABS = [
    { key:TAB_RESOURCES, label:`Resources (${resources.length})` },
    { key:TAB_USERS, label:`Users (${users.length})` },
    { key:TAB_FLAGGED, label:'Flagged', count:flagged.length },
  ];

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.20) 50%,rgba(171,190,237,0.15) 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          <motion.div custom={0} variants={fadeUp} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight flex items-center gap-2">
                <HiOutlineShieldCheck className="w-6 h-6" style={{color:'#6E632E'}} /> Admin Panel
              </h1>
              <p className="text-sm mt-1" style={{ color:'#6B6344' }}>Manage resources and users across CampusShare.</p>
            </div>
            <button onClick={loadData} className="btn-ghost gap-2"><HiOutlineRefresh className="w-4 h-4" /> Refresh</button>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {icon:HiOutlineDocumentText,val:resources.length,label:'Resources',grad:'linear-gradient(135deg,rgba(171,190,237,0.40),rgba(237,232,208,0.85))'},
              {icon:HiOutlineUsers,val:users.length,label:'Users',grad:'linear-gradient(135deg,rgba(219,209,237,0.50),rgba(237,232,208,0.85))'},
              {icon:HiOutlineDownload,val:totalDownloads,label:'Downloads',grad:'linear-gradient(135deg,rgba(237,232,208,0.90),rgba(219,209,237,0.40))'},
              {icon:HiOutlineFlag,val:flagged.length,label:'Flagged',grad:'linear-gradient(135deg,rgba(255,200,200,0.30),rgba(237,232,208,0.85))'},
            ].map(({icon:Icon,val,label,grad}) => (
              <div key={label} className="glass-card p-5 flex items-center gap-4" style={{background:grad}}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:'rgba(237,232,208,0.70)',border:'1px solid rgba(110,99,46,0.14)'}}>
                  <Icon className="w-5 h-5" style={{color:'#6E632E'}} />
                </div>
                <div><p className="text-xl font-extrabold text-[#2C2A1E]">{val}</p><p className="text-xs" style={{color:'#9A8F5A'}}>{label}</p></div>
              </div>
            ))}
          </motion.div>

          <motion.div custom={2} variants={fadeUp} className="flex gap-1 p-1 rounded-2xl w-fit mb-6" style={{background:'rgba(110,99,46,0.08)'}}>
            {TABS.map(({key,label,count}) => (
              <button key={key} onClick={()=>setTab(key)}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5"
                style={tab===key ? {background:'rgba(237,232,208,0.95)', color:'#2C2A1E', boxShadow:'0 2px 8px rgba(110,99,46,0.10)'} : {color:'#9A8F5A'}}>
                {label}
                {count>0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
              </button>
            ))}
          </motion.div>

          {tab===TAB_RESOURCES && (
            <motion.div custom={3} variants={fadeUp} className="glass-card overflow-x-auto" style={{background:'linear-gradient(135deg,rgba(237,232,208,0.85),rgba(219,209,237,0.30))'}}>
              <table className="premium-table w-full">
                <thead><tr>{['Title','Branch/Sem','Uploader','Stats','Date','Actions'].map(h=><th key={h} className="premium-th">{h}</th>)}</tr></thead>
                <tbody>
                  {resources.map(r => (
                    <tr key={r.id} className="premium-tr">
                      <td className="premium-td"><Link to={`/resources/${r.id}`} className="font-semibold text-[#2C2A1E] hover:text-[#6E632E] line-clamp-1 max-w-[180px] block">{r.title}</Link><p className="text-xs truncate max-w-[180px]" style={{color:'#9A8F5A'}}>{r.subject}</p></td>
                      <td className="premium-td"><span className="badge-olive mr-1">{r.branch}</span><span className="badge-warm">S{r.semester}</span></td>
                      <td className="premium-td text-xs" style={{color:'#6B6344'}}>{r.uploaderName||'—'}</td>
                      <td className="premium-td"><div className="flex gap-3 text-xs" style={{color:'#9A8F5A'}}><span className="flex items-center gap-1"><HiOutlineDownload className="w-3 h-3"/>{r.downloads}</span><span className="flex items-center gap-1"><HiOutlineStar className="w-3 h-3" style={{color:'#6E632E'}}/>{r.averageRating>0?r.averageRating.toFixed(1):'—'}</span></div></td>
                      <td className="premium-td text-xs whitespace-nowrap" style={{color:'#9A8F5A'}}>{r.createdAt?.toDate?formatDistanceToNow(r.createdAt.toDate(),{addSuffix:true}):'—'}</td>
                      <td className="premium-td"><button onClick={()=>handleDeleteResource(r)} disabled={deletingId===r.id} className="p-1.5 rounded-xl transition-colors disabled:opacity-40" style={{color:'#9A8F5A'}} onMouseEnter={e=>{e.currentTarget.style.color='#c53030';e.currentTarget.style.background='rgba(220,80,80,0.08)';}} onMouseLeave={e=>{e.currentTarget.style.color='#9A8F5A';e.currentTarget.style.background='transparent';}}><HiOutlineTrash className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                  {resources.length===0 && <tr><td colSpan={6} className="text-center py-12" style={{color:'#9A8F5A'}}>No resources found.</td></tr>}
                </tbody>
              </table>
            </motion.div>
          )}

          {tab===TAB_USERS && (
            <motion.div custom={3} variants={fadeUp} className="glass-card overflow-x-auto" style={{background:'linear-gradient(135deg,rgba(237,232,208,0.85),rgba(219,209,237,0.30))'}}>
              <table className="premium-table w-full">
                <thead><tr>{['User','Branch/Sem','Uploads','Joined','Role','Actions'].map(h=><th key={h} className="premium-th">{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="premium-tr">
                      <td className="premium-td"><div className="flex items-center gap-2.5"><Avatar src={u.photoURL} name={u.displayName||u.email} size="sm" /><div className="min-w-0"><p className="font-medium text-[#2C2A1E] truncate max-w-[130px]">{u.displayName||'—'}</p><p className="text-xs truncate max-w-[130px]" style={{color:'#9A8F5A'}}>{u.email}</p></div></div></td>
                      <td className="premium-td">{u.branch?<><span className="badge-olive mr-1">{u.branch}</span>{u.semester&&<span className="badge-warm">S{u.semester}</span>}</>:'—'}</td>
                      <td className="premium-td" style={{color:'#6B6344'}}>{u.uploadCount||0}</td>
                      <td className="premium-td text-xs whitespace-nowrap" style={{color:'#9A8F5A'}}>{u.createdAt?.toDate?formatDistanceToNow(u.createdAt.toDate(),{addSuffix:true}):'—'}</td>
                      <td className="premium-td">{u.role==='admin'?<span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-red-700 border" style={{background:'rgba(220,80,80,0.10)',borderColor:'rgba(220,80,80,0.25)'}}>admin</span>:<span className="badge-warm">student</span>}</td>
                      <td className="premium-td">
                        {u.id!==currentUser?.uid && (
                          <button onClick={()=>handleToggleAdmin(u)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors" style={{color:'#6E632E'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(110,99,46,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            {u.role==='admin' ? <><HiOutlineBan className="w-3.5 h-3.5"/> Demote</> : <><HiOutlineShieldCheck className="w-3.5 h-3.5"/> Make Admin</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length===0 && <tr><td colSpan={6} className="text-center py-12" style={{color:'#9A8F5A'}}>No users found.</td></tr>}
                </tbody>
              </table>
            </motion.div>
          )}

          {tab===TAB_FLAGGED && (
            <motion.div custom={3} variants={fadeUp}>
              {flagged.length===0 ? (
                <div className="glass-card p-16 text-center" style={{color:'#9A8F5A'}}>
                  <HiOutlineFlag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No flagged resources.</p>
                </div>
              ) : (
                <div className="glass-card overflow-x-auto" style={{background:'linear-gradient(135deg,rgba(255,235,235,0.6),rgba(237,232,208,0.85))'}}>
                  <table className="premium-table w-full">
                    <thead><tr>{['Resource','Branch/Sem','Reports','Actions'].map(h=><th key={h} className="premium-th">{h}</th>)}</tr></thead>
                    <tbody>
                      {flagged.map(r => (
                        <tr key={r.id} className="premium-tr">
                          <td className="premium-td"><Link to={`/resources/${r.id}`} className="font-semibold text-[#2C2A1E] hover:text-[#6E632E] line-clamp-1 max-w-[200px] block">{r.title}</Link></td>
                          <td className="premium-td"><span className="badge-olive mr-1">{r.branch}</span><span className="badge-warm">S{r.semester}</span></td>
                          <td className="premium-td"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-red-700 border" style={{background:'rgba(220,80,80,0.10)',borderColor:'rgba(220,80,80,0.25)'}}>{r.flagCount} report{r.flagCount!==1?'s':''}</span></td>
                          <td className="premium-td"><button onClick={()=>handleDeleteResource(r)} disabled={deletingId===r.id} className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
