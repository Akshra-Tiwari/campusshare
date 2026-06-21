import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getResourceById, incrementDownload, submitRating,
  getUserRating, deleteResource, getUserProfile
} from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import Avatar from '../components/common/Avatar';
import { RESOURCE_TYPES } from '../config/constants';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  HiOutlineDownload, HiOutlineArrowLeft, HiOutlineUser, HiOutlineCalendar,
  HiOutlineEye, HiOutlineTrash, HiOutlineDocumentText, HiOutlinePhotograph,
  HiOutlineStar
} from 'react-icons/hi';

const formatBytes = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { currentUser, isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getResourceById(id);
        if (!data) { navigate('/browse'); return; }
        setResource(data);
        if (data.uploadedBy) {
          const uploaderData = await getUserProfile(data.uploadedBy);
          setUploader(uploaderData);
        }
        if (currentUser) {
          const rating = await getUserRating(id, currentUser.uid);
          setUserRating(rating);
        }
      } catch (e) {
        console.error(e);
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, currentUser]);

  const handleDownload = async () => {
    if (!resource?.fileURL) return;
    setDownloading(true);
    try {
      await incrementDownload(id, currentUser?.uid);
      setResource((r) => ({ ...r, downloads: (r.downloads || 0) + 1 }));
      const link = document.createElement('a');
      link.href = resource.fileURL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = resource.fileName || resource.title;
      link.click();
      toast.success('Download started!');
    } catch (e) {
      toast.error('Download failed. Try opening directly.');
      window.open(resource.fileURL, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleRating = async (stars) => {
    if (!currentUser) return toast.error('Please log in to rate resources.');
    setRatingLoading(true);
    try {
      await submitRating(id, currentUser.uid, stars);
      setUserRating(stars);
      const updated = await getResourceById(id);
      setResource(updated);
      toast.success(`Rated ${stars} star${stars !== 1 ? 's' : ''}!`);
    } catch (e) {
      toast.error('Rating failed. Please try again.');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${resource.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteResource(id, resource.filePath, resource.uploadedBy);
      toast.success('Resource deleted.');
      navigate('/browse');
    } catch (e) {
      toast.error('Delete failed.');
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!resource) return null;

  const typeLabel = RESOURCE_TYPES.find((t) => t.value === resource.type)?.label || resource.type;
  const isPDF = resource.fileType === 'application/pdf';
  const isOwner = currentUser?.uid === resource.uploadedBy;
  const date = resource.createdAt?.toDate ? formatDistanceToNow(resource.createdAt.toDate(), { addSuffix: true }) : 'Recently';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      {/* Back */}
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-medium mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Preview */}
          <div className="card overflow-hidden mb-6">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 aspect-video flex flex-col items-center justify-center gap-3 relative">
              {isPDF ? (
                <div className="w-full h-full">
                  <iframe
                    src={`${resource.fileURL}#toolbar=0`}
                    className="w-full h-full"
                    title={resource.title}
                    style={{ minHeight: '400px' }}
                  />
                </div>
              ) : (
                <img
                  src={resource.fileURL}
                  alt={resource.title}
                  className="max-w-full max-h-full object-contain p-4"
                />
              )}
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="card p-6 mb-6">
              <h3 className="font-display font-semibold text-slate-800 mb-2">About this resource</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{resource.description}</p>
            </div>
          )}

          {/* Rating Section */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <HiOutlineStar className="w-5 h-5 text-accent-400" />
              Ratings
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-4xl font-display font-bold text-slate-800">
                  {resource.averageRating > 0 ? resource.averageRating.toFixed(1) : '—'}
                </p>
                <StarRating value={Math.round(resource.averageRating)} readonly size="md" />
                <p className="text-xs text-slate-400 mt-1">{resource.totalRatings} rating{resource.totalRatings !== 1 ? 's' : ''}</p>
              </div>
              {currentUser && !isOwner && (
                <div className="border-l border-slate-100 pl-4 flex-1">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    {userRating > 0 ? 'Your rating:' : 'Rate this resource:'}
                  </p>
                  <StarRating
                    value={userRating}
                    onChange={handleRating}
                    readonly={ratingLoading}
                    size="lg"
                  />
                  {userRating > 0 && (
                    <p className="text-xs text-slate-400 mt-1">Click to update your rating</p>
                  )}
                </div>
              )}
              {!currentUser && (
                <div className="border-l border-slate-100 pl-4">
                  <p className="text-sm text-slate-500">
                    <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link> to rate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="card p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPDF ? 'bg-red-50' : 'bg-blue-50'}`}>
                {isPDF
                  ? <HiOutlineDocumentText className="w-6 h-6 text-red-500" />
                  : <HiOutlinePhotograph className="w-6 h-6 text-blue-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-bold text-lg text-slate-800 leading-tight">{resource.title}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{resource.subject}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              <span className="badge-blue">{resource.branch}</span>
              <span className="badge-yellow">Sem {resource.semester}</span>
              <span className="badge bg-slate-100 text-slate-600">{typeLabel}</span>
              {resource.fileSize && (
                <span className="badge bg-slate-100 text-slate-500">{formatBytes(resource.fileSize)}</span>
              )}
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary w-full justify-center py-3 text-base mb-3"
            >
              <HiOutlineDownload className="w-5 h-5" />
              {downloading ? 'Starting...' : 'Download'}
            </button>

            <a
              href={resource.fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center py-2.5 text-sm"
            >
              <HiOutlineEye className="w-4 h-4" />
              Open in new tab
            </a>

            {/* Stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <HiOutlineDownload className="w-4 h-4" />
                {resource.downloads} downloads
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineCalendar className="w-4 h-4" />
                {date}
              </span>
            </div>
          </div>

          {/* Uploader info */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-3">Uploaded by</h3>
            <div className="flex items-center gap-3">
              <Avatar
                src={uploader?.photoURL}
                name={resource.uploaderName || 'A'}
                size="md"
                rounded="xl"
              />
              <div className="min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">{resource.uploaderName || 'Anonymous'}</p>
                {uploader?.branch && (
                  <p className="text-xs text-slate-400">{uploader.branch} · Sem {uploader.semester}</p>
                )}
              </div>
            </div>
          </div>

          {/* Admin/Owner delete */}
          {(isAdmin || isOwner) && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger w-full justify-center py-2.5 text-sm"
            >
              <HiOutlineTrash className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete Resource'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
