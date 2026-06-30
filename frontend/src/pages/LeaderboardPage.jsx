import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTopUploaders, getTopDownloaders } from '../services/users';
import Avatar from '../components/common/Avatar';
import { PageLoader } from '../components/common/LoadingSpinner';
import { HiOutlineStar, HiOutlineUpload, HiOutlineDownload } from 'react-icons/hi';

const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.06,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.06}} };
const PODIUM = [
  { grad:'linear-gradient(135deg,#D4AF37,#B8941F)', label:'🥇' },
  { grad:'linear-gradient(135deg,#C0C0C0,#A0A0A0)', label:'🥈' },
  { grad:'linear-gradient(135deg,#A87741,#8B6332)', label:'🥉' },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState('uploads');
  const [uploaders, setUploaders]   = useState([]);
  const [downloaders, setDownloaders] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getTopUploaders(20), getTopDownloaders(20)]).then(([u,d])=>{setUploaders(u);setDownloaders(d);}).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  const list = tab==='uploads'?uploaders:downloaders;
  const metricKey = tab==='uploads'?'uploadCount':'downloadCount';
  const metricLabel = tab==='uploads'?'uploads':'downloads';
  const top3 = list.slice(0,3), rest = list.slice(3);

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.25) 40%,rgba(171,190,237,0.18) 80%,rgba(237,232,208,0.95) 100%)' }}>
      <div className="blob-lavender w-[400px] h-[400px] top-0 left-0 opacity-20 fixed pointer-events-none" />
      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div custom={0} variants={fadeUp} className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,#D4AF37,#B8941F)',boxShadow:'0 4px 20px rgba(184,148,31,0.35)'}}>
              <HiOutlineStar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">Leaderboard</h1>
            <p className="text-sm mt-1" style={{color:'#6B6344'}}>Top JNCT students contributing to CampusShare.</p>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="flex justify-center mb-10">
            <div className="flex gap-1 p-1 rounded-2xl" style={{background:'rgba(110,99,46,0.08)'}}>
              {[{key:'uploads',label:'Top Uploaders',icon:HiOutlineUpload},{key:'downloads',label:'Most Downloads',icon:HiOutlineDownload}].map(({key,label,icon:Icon}) => (
                <button key={key} onClick={()=>setTab(key)} className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                  style={tab===key?{background:'rgba(237,232,208,0.95)',color:'#2C2A1E',boxShadow:'0 2px 8px rgba(110,99,46,0.10)'}:{color:'#9A8F5A'}}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </motion.div>

          {list.length===0 ? (
            <div className="text-center py-16" style={{color:'#9A8F5A'}}>
              <HiOutlineStar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No activity yet.</p>
            </div>
          ) : (
            <>
              <motion.div custom={2} variants={fadeUp} className="grid grid-cols-3 gap-3 mb-6">
                {top3.map((user,i) => (
                  <div key={user.id} className="glass-card p-5 text-center flex flex-col items-center gap-3"
                    style={i===0 ? {background:'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(237,232,208,0.90))',border:'2px solid rgba(212,175,55,0.30)'} : {background:'linear-gradient(135deg,rgba(237,232,208,0.85),rgba(219,209,237,0.30))'}}>
                    <span className="text-2xl">{PODIUM[i].label}</span>
                    <Avatar src={user.photoURL} name={user.displayName||user.email} size="lg" />
                    <div>
                      <p className="text-sm font-semibold text-[#2C2A1E] line-clamp-1">{user.displayName||'Anonymous'}</p>
                      {user.branch && <p className="text-xs mt-0.5" style={{color:'#9A8F5A'}}>{user.branch}{user.semester?` · S${user.semester}`:''}</p>}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{background:PODIUM[i].grad}}>{user[metricKey]||0} {metricLabel}</span>
                  </div>
                ))}
              </motion.div>

              {rest.length>0 && (
                <motion.div custom={3} variants={fadeUp} className="glass-card" style={{background:'linear-gradient(135deg,rgba(237,232,208,0.85),rgba(219,209,237,0.25))'}}>
                  {rest.map((user,i) => (
                    <div key={user.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150" style={{borderTop: i===0?'none':'1px solid rgba(110,99,46,0.08)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(219,209,237,0.15)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span className="w-6 text-sm font-bold text-center flex-shrink-0" style={{color:'#9A8F5A'}}>{i+4}</span>
                      <Avatar src={user.photoURL} name={user.displayName||user.email} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2C2A1E] truncate">{user.displayName||'Anonymous'}</p>
                        {user.branch && <p className="text-xs" style={{color:'#9A8F5A'}}>{user.branch}{user.semester?` · S${user.semester}`:''}</p>}
                      </div>
                      <span className="text-sm font-bold flex-shrink-0" style={{color:'#6E632E'}}>{user[metricKey]||0}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
