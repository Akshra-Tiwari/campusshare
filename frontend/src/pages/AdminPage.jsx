import { useEffect, useState } from 'react';
import { getAllUsers, getResources, deleteResource, updateUserProfile, getFlaggedResources } from '../services/firestore';
import { deleteResourceViaBackend } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import Avatar from '../components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import {
  HiOutlineUsers, HiOutlineDocumentText, HiOutlineTrash,
  HiOutlineShieldCheck, HiOutlineDownload, HiOutlineStar,
  HiOutlineRefresh, HiOutlineBan, HiOutlineFlag
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const TAB_RESOURCES = 'resources';
const TAB_USERS     = 'users';
const TAB_FLAGGED   = 'flagged';

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
      const [{ resources: res }, allUsers, flaggedRes] = await Promise.all([
        getResources({}, 100),
        getAllUsers(),
        getFlaggedResources(),
      ]);
      setResources(res);
      setUsers(allUsers);
      setFlagged(flaggedRes);
    } catch (e) {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDeleteResource = async (resource) => {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;
    setDeletingId(resource.id);
    try {
      try {
        await deleteResourceViaBackend(resource.id);
      } catch (backendErr) {
        await deleteResource(resource.id, resource.filePath, resource.uploadedBy);
      }
      setResources((prev) => prev.filter((r) => r.id !== resource.id));
      toast.success('Resource deleted.');
    } catch (e) {
      toast.error('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAdmin = async (user) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Make ${user.displayName || user.email} a ${newRole}?`)) return;
    try {
      await updateUserProfile(user.id, { role: newRole });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}.`);
    } catch (e) {
      toast.error('Failed to update role.');
    }
  };

  if (loading) return <PageLoader />;

  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 flex items-center gap-2">
            <HiOutlineShieldCheck className="w-8 h-8 text-primary-600" />
            Admin Panel
          </h1>
          <p className="text-slate-500 mt-1">Manage resources and users across CampusShare.</p>
        </div>
        <button onClick={loadData} className="btn-secondary gap-2">
          <HiOutlineRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: HiOutlineDocumentText, value: resources.length, label: 'Total Resources', color: 'bg-primary-50 text-primary-600' },
          { icon: HiOutlineUsers,        value: users.length,     label: 'Total Users',     color: 'bg-accent-50 text-accent-600' },
          { icon: HiOutlineDownload,     value: totalDownloads,   label: 'Total Downloads', color: 'bg-emerald-50 text-emerald-600' },
          { icon: HiOutlineShieldCheck,  value: users.filter((u) => u.role === 'admin').length, label: 'Admins', color: 'bg-purple-50 text-purple-600' },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-display font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        {[
          { key: TAB_RESOURCES, label: `Resources (${resources.length})` },
          { key: TAB_USERS,     label: `Users (${users.length})` },
          { key: TAB_FLAGGED,   label: `Flagged (${flagged.length})`, alert: flagged.length > 0 },
        ].map(({ key, label, alert }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              tab === key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
            {alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Resources Table */}
      {tab === TAB_RESOURCES && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Branch/Sem</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Uploader</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Stats</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/resources/${r.id}`} className="font-medium text-slate-800 hover:text-primary-600 line-clamp-1 max-w-[200px] block">
                        {r.title}
                      </Link>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{r.subject}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge-blue mr-1">{r.branch}</span>
                      <span className="badge-yellow">S{r.semester}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-500 text-xs">
                      {r.uploaderName || '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <HiOutlineDownload className="w-3.5 h-3.5" />{r.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineStar className="w-3.5 h-3.5 text-accent-400" />
                          {r.averageRating > 0 ? r.averageRating.toFixed(1) : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-400">
                      {r.createdAt?.toDate ? formatDistanceToNow(r.createdAt.toDate(), { addSuffix: true }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteResource(r)}
                        disabled={deletingId === r.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                        {deletingId === r.id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">No resources found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Table */}
      {tab === TAB_USERS && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Branch/Sem</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Uploads</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={u.photoURL} name={u.displayName || u.email} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[140px]">{u.displayName || '—'}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {u.branch ? <span className="badge-blue mr-1">{u.branch}</span> : '—'}
                      {u.semester ? <span className="badge-yellow">S{u.semester}</span> : ''}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{u.uploadCount || 0}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-400">
                      {u.createdAt?.toDate ? formatDistanceToNow(u.createdAt.toDate(), { addSuffix: true }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role || 'student'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== currentUser?.uid && (
                        <button
                          onClick={() => handleToggleAdmin(u)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          {u.role === 'admin'
                            ? <><HiOutlineBan className="w-3.5 h-3.5" /> Demote</>
                            : <><HiOutlineShieldCheck className="w-3.5 h-3.5" /> Make Admin</>
                          }
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flagged Resources */}
      {tab === TAB_FLAGGED && (
        <div className="card overflow-hidden">
          {flagged.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <HiOutlineFlag className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No flagged resources.</p>
              <p className="text-sm mt-1">Reported resources will appear here for review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Resource</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Branch/Sem</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Reports</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {flagged.map((r) => (
                    <tr key={r.id} className="hover:bg-red-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/resources/${r.id}`} className="font-medium text-slate-800 hover:text-primary-600 line-clamp-1 max-w-[200px] block">
                          {r.title}
                        </Link>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{r.subject}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge-blue mr-1">{r.branch}</span>
                        <span className="badge-yellow">S{r.semester}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="badge bg-red-100 text-red-700">{r.flagCount} report{r.flagCount !== 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteResource(r)}
                          disabled={deletingId === r.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HiOutlineTrash className="w-3.5 h-3.5" />
                          {deletingId === r.id ? '...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
