import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  incrementDownload, submitRating, getUserRating,
  deleteResource, getUserProfile, subscribeToResource,
} from '../services/firestore';
import { deleteResourceViaBackend } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import Avatar from '../components/common/Avatar';
import BookmarkButton from '../components/common/BookmarkButton';
import VersionHistory from '../components/resources/VersionHistory';
import UploadNewVersionButton from '../components/resources/UploadNewVersionButton';
import { RESOURCE_TYPES } from '../config/constants';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineDownload, HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineEye, HiOutlineTrash, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineStar } from 'react-icons/hi';

const formatBytes = b => { if(!b) return ''; const k=1024,s=['B','KB','MB']; const i=Math.floor(Math.log(b)/Math.log(k)); return `${(b/Math.pow(k,i)).toFixed(1)} ${s[i]}`; };
const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.06,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.06}} };

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource]     = useState(null);
  const [uploader, setUploader]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [downloading, setDownloading]     = useState(false);
  const [deleting, setDeleting]           = useState(false);

  useEffect(() => {
    let uploaderLoaded=false, hasData=false;
    const unsub = subscribeToResource(id, async (data, err) => {
      if (err || !data) { if (!hasData) navigate('/browse'); setLoading(false); return; }
      hasData = true; setResource(data); setLoading(false);
      if (!uploaderLoaded && data.uploadedBy) { uploaderLoaded=true; getUserProfile(data.uploadedBy).then(setUploader).catch(()=>{}); }
    });
    return unsub;
  }, [id]);

  useEffect(() => { if (!currentUser) return; getUserRating(id, currentUser.uid).then(setUserRating).catch(()=>{}); }, [id, currentUser]);

  const handleDownload = async () => {
    if (!resource?.fileURL) return;
    setDownloading(true);
    try {
      await incrementDownload(id, currentUser?.uid);
      const a = document.createElement('a'); a.href = resource.fileURL; a.target='_blank'; a.download = resource.fileName || resource.title; a.click();
      toast.success('Download started!');
    } catch { window.open(resource.fileURL,'_blank'); }
    finally { setDownloading(false); }
  };

  const handleRating = async stars => {
    if (!currentUser) return toast.error('Please sign in to rate.');
    const prev = userRating; setUserRating(stars); setRatingLoading(true);
    try { await submitRating(id, currentUser.uid, stars); toast.success(`Rated ${stars} star${stars!==1?'s':''}!`); }
    catch { setUserRating(prev); toast.error('Rating failed.'); }
    finally { setRatingLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;
    setDeleting(true);
    try {
      try { await deleteResourceViaBackend(id); } catch { await deleteResource(id, resource.filePath, resource.uploadedBy); }
      toast.success('Deleted.'); navigate('/browse');
    } catch { toast.error('Delete failed.'); setDeleting(false); }
  };

  if (loading) return <PageLoader />;
  if (!resource) return null;

  const typeLabel = RESOURCE_TYPES.find(t=>t.value===resource.type)?.label || resource.type;
  const isPDF = resource.fileType === 'application/pdf';
  const isOwner = currentUser?.uid === resource.uploadedBy;
  const date = resource.createdAt?.toDate ? formatDistanceToNow(resource.createdAt.toDate(),{addSuffix:true}) : 'Recently';

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.20) 40%,rgba(171,190,237,0.18) 80%,rgba(237,232,208,0.95) 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        <Link to="/browse" className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-all group"
              style={{ color:'#6B6344' }}
              onMouseEnter={e=>e.currentTarget.style.color='#6E632E'} onMouseLeave={e=>e.currentTarget.style.color='#6B6344'}>
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Browse
        </Link>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div custom={0} variants={fadeUp} className="glass-card overflow-hidden"
              style={{ background:'linear-gradient(135deg,rgba(237,232,208,0.85) 0%,rgba(219,209,237,0.30) 100%)' }}>
              <div className="aspect-video flex items-center justify-center" style={{ background:'rgba(237,232,208,0.50)', borderBottom:'1px solid rgba(110,99,46,0.10)' }}>
                {isPDF
                  ? <iframe src={`${resource.fileURL}#toolbar=0`} className="w-full h-full" style={{minHeight:380}} title={resource.title} />
                  : <img src={resource.fileURL} alt={resource.title} className="max-w-full max-h-full object-contain p-6" />
                }
              </div>
            </motion.div>

            {resource.description && (
              <motion.div custom={1} variants={fadeUp} className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#2C2A1E] mb-2">About this resource</h3>
                <p className="text-sm leading-relaxed" style={{ color:'#6B6344' }}>{resource.description}</p>
              </motion.div>
            )}

            <motion.div custom={2} variants={fadeUp} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-[#2C2A1E] mb-5 flex items-center gap-2">
                <HiOutlineStar className="w-4 h-4" style={{ color:'#6E632E' }} /> Ratings
              </h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[#2C2A1E]">{resource.averageRating>0?resource.averageRating.toFixed(1):'—'}</p>
                  <StarRating value={Math.round(resource.averageRating)} readonly size="md" />
                  <p className="text-xs mt-1" style={{ color:'#9A8F5A' }}>{resource.totalRatings} rating{resource.totalRatings!==1?'s':''}</p>
                </div>
                {currentUser && !isOwner && (
                  <div className="pl-8" style={{ borderLeft:'1px solid rgba(110,99,46,0.12)' }}>
                    <p className="text-sm font-medium mb-2" style={{ color:'#4A4030' }}>{userRating>0?'Your rating':'Rate this resource'}</p>
                    <StarRating value={userRating} onChange={handleRating} readonly={ratingLoading} size="lg" />
                    {userRating>0 && <p className="text-xs mt-1.5" style={{ color:'#9A8F5A' }}>Tap to update</p>}
                  </div>
                )}
                {!currentUser && (
                  <p className="text-sm pl-8" style={{ color:'#6B6344', borderLeft:'1px solid rgba(110,99,46,0.12)' }}>
                    <Link to="/login" className="font-medium" style={{ color:'#6E632E' }}>Sign in</Link> to rate
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <motion.div custom={0} variants={fadeUp} className="glass-card p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                     style={{ background:'rgba(237,232,208,0.70)', border:'1px solid rgba(110,99,46,0.15)' }}>
                  {isPDF ? <HiOutlineDocumentText className="w-5 h-5" style={{color:'#6E632E'}}/> : <HiOutlinePhotograph className="w-5 h-5" style={{color:'#6E632E'}}/>}
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-[#2C2A1E] text-base leading-snug">{resource.title}</h1>
                  <p className="text-sm mt-0.5" style={{ color:'#9A8F5A' }}>{resource.subject}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="badge-olive">{resource.branch}</span>
                <span className="badge-warm">Sem {resource.semester}</span>
                <span className="badge-lavender">{typeLabel}</span>
                {resource.fileSize && <span className="badge-warm">{formatBytes(resource.fileSize)}</span>}
              </div>

              <div className="flex gap-2 mb-3">
                <button onClick={handleDownload} disabled={downloading} className="btn-olive flex-1 py-2.5 text-sm">
                  <HiOutlineDownload className="w-4 h-4" /> {downloading?'Starting...':'Download'}
                </button>
                <div className="rounded-xl border flex items-center justify-center px-1" style={{ borderColor:'rgba(110,99,46,0.18)' }}>
                  <BookmarkButton resourceId={id} size="md" />
                </div>
              </div>

              <a href={resource.fileURL} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full py-2.5 text-sm justify-center">
                <HiOutlineEye className="w-4 h-4" /> Open in new tab
              </a>

              <div className="flex items-center justify-between mt-5 pt-5 text-xs" style={{ borderTop:'1px solid rgba(110,99,46,0.10)', color:'#9A8F5A' }}>
                <span className="flex items-center gap-1"><HiOutlineDownload className="w-3.5 h-3.5"/> {resource.downloads} downloads</span>
                <span className="flex items-center gap-1"><HiOutlineCalendar className="w-3.5 h-3.5"/> {date}</span>
              </div>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} className="glass-card p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:'#9A8F5A' }}>Uploaded by</h3>
              <div className="flex items-center gap-3">
                <Avatar src={uploader?.photoURL} name={resource.uploaderName||'A'} size="md" rounded="xl" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#2C2A1E] truncate">{resource.uploaderName||'Anonymous'}</p>
                  {uploader?.branch && <p className="text-xs" style={{ color:'#9A8F5A' }}>{uploader.branch} · Sem {uploader.semester}</p>}
                </div>
              </div>
            </motion.div>

            <motion.div custom={2} variants={fadeUp}><VersionHistory resource={resource} /></motion.div>

            {(isAdmin || isOwner) && (
              <motion.div custom={3} variants={fadeUp} className="space-y-2">
                <UploadNewVersionButton resourceId={id} userId={resource.uploadedBy} onSuccess={()=>{}} />
                <button onClick={handleDelete} disabled={deleting} className="btn-danger w-full justify-center py-2.5 text-sm">
                  <HiOutlineTrash className="w-4 h-4" /> {deleting?'Deleting...':'Delete Resource'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
