import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserBookmarks } from '../services/bookmarks';
import { getResourceById } from '../services/resources';
import ResourceCard from '../components/common/ResourceCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { HiOutlineBookmark } from 'react-icons/hi';

const fadeUp  = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.4,ease:[0.22,1,0.36,1]}} };
const stagger = { visible:{transition:{staggerChildren:0.05}} };

export default function BookmarksPage() {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    getUserBookmarks(currentUser.uid)
      .then(ids => Promise.all(ids.map(id => getResourceById(id).catch(()=>null))))
      .then(res => setResources(res.filter(Boolean)))
      .catch(console.error).finally(()=>setLoading(false));
  }, [currentUser]);

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.20) 40%,rgba(171,190,237,0.18) 80%,rgba(237,232,208,0.95) 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight flex items-center gap-2">
              <HiOutlineBookmark className="w-6 h-6" style={{color:'#6E632E'}} /> Saved Resources
            </h1>
            <p className="text-sm mt-1" style={{color:'#6B6344'}}>{loading?'Loading...':`${resources.length} resource${resources.length!==1?'s':''} saved`}</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)}</div>
          ) : resources.length===0 ? (
            <EmptyState icon={HiOutlineBookmark} title="No saved resources yet" description="Bookmark resources while browsing to find them quickly later." actionLabel="Browse Resources" actionTo="/browse" />
          ) : (
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map(r => <motion.div key={r.id} variants={fadeUp}><ResourceCard resource={r} /></motion.div>)}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
