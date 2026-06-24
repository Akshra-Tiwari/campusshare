import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserResources, deleteResource } from '../services/firestore';
import { deleteResourceViaBackend } from '../services/api';
import ResourceCard from '../components/common/ResourceCard';
import { SkeletonRow } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Avatar from '../components/common/Avatar';
import { HiOutlineUpload, HiOutlineDownload, HiOutlineDocumentText, HiOutlineTrash, HiOutlineUser, HiOutlinePencil } from 'react-icons/hi';
import { BRANCHES } from '../config/constants';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const branchLabel = BRANCHES.find((b) => b.value === userProfile?.branch)?.label || userProfile?.branch;

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      try {
        const data = await getUserResources(currentUser.uid);
        setResources(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  const handleDelete = async (resource) => {
    if (!window.confirm(`Delete "${resource.title}"? This cannot be undone.`)) return;
    setDeleting(resource.id);
    try {
      try {
        // Preferred path: backend also cleans up the Cloudinary file.
        await deleteResourceViaBackend(resource.id);
      } catch (backendErr) {
        // Backend unreachable (e.g. running frontend-only locally) — still
        // remove the Firestore doc so the UI stays consistent.
        await deleteResource(resource.id, resource.filePath, currentUser.uid);
      }
      setResources((prev) => prev.filter((r) => r.id !== resource.id));
      await refreshUserProfile();
      toast.success('Resource deleted.');
    } catch (e) {
      toast.error('Failed to delete resource.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800">
            Welcome back, {userProfile?.displayName?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {branchLabel && `${branchLabel}`}
            {userProfile?.semester && ` · Semester ${userProfile.semester}`}
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          <HiOutlineUpload className="w-4 h-4" />
          Upload Resource
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard icon={HiOutlineDocumentText} value={userProfile?.uploadCount || 0}   label="Total Uploads"    color="bg-primary-50 text-primary-600" />
        <StatCard icon={HiOutlineDownload}     value={userProfile?.downloadCount || 0} label="Total Downloads"  color="bg-accent-50 text-accent-600" />
        <StatCard icon={HiOutlineUser}         value={userProfile?.role === 'admin' ? 'Admin' : 'Student'} label="Account Role" color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Profile card */}
      <div className="card p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Avatar
          src={userProfile?.photoURL}
          name={userProfile?.displayName || currentUser?.email}
          size="xl"
          rounded="xl"
          className="shadow-md bg-gradient-to-br from-primary-600 to-primary-800"
        />
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl text-slate-800">{userProfile?.displayName}</h3>
          <p className="text-slate-500 text-sm">{currentUser?.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {userProfile?.branch && <span className="badge-blue">{userProfile.branch}</span>}
            {userProfile?.semester && <span className="badge-yellow">Sem {userProfile.semester}</span>}
            {userProfile?.role === 'admin' && <span className="badge bg-red-100 text-red-700">Admin</span>}
          </div>
        </div>
        <Link to="/profile" className="btn-secondary text-sm gap-2">
          <HiOutlinePencil className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* My Uploads */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800 mb-5">My Uploads ({resources.length})</h2>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : resources.length === 0 ? (
          <EmptyState
            title="No uploads yet"
            description="Share your notes and help fellow JNCT students. Start by uploading your first resource."
            actionLabel="Upload Now"
            actionTo="/upload"
          />
        ) : (
          <div className="space-y-4">
            {resources.map((r) => (
              <div key={r.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{r.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{r.subject} · {r.branch} · Sem {r.semester}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">
                      {r.createdAt?.toDate ? formatDistanceToNow(r.createdAt.toDate(), { addSuffix: true }) : 'Recently'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <HiOutlineDownload className="w-3 h-3" />{r.downloads} downloads
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/resources/${r.id}`} className="btn-secondary text-sm py-1.5 px-3">View</Link>
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={deleting === r.id}
                    className="btn-danger text-sm py-1.5 px-3"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    {deleting === r.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
