import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/firestore';
import { BRANCHES, SEMESTERS } from '../config/constants';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineSave, HiOutlineMail } from 'react-icons/hi';
import Avatar from '../components/common/Avatar';

export default function ProfilePage() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [form, setForm] = useState({
    displayName: userProfile?.displayName || '',
    branch: userProfile?.branch || '',
    semester: userProfile?.semester ? String(userProfile.semester) : '',
  });
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.displayName.trim()) return toast.error('Name cannot be empty.');
    setSaving(true);
    try {
      await updateUserProfile(currentUser.uid, {
        displayName: form.displayName.trim(),
        branch: form.branch,
        semester: Number(form.semester),
      });
      await refreshUserProfile();
      toast.success('Profile updated!');
    } catch (e) {
      toast.error('Update failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      <div className="page-header">
        <h1 className="font-display font-bold text-3xl text-slate-800">Edit Profile</h1>
        <p className="text-slate-500 mt-1">Update your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-6 flex items-center gap-4">
        <Avatar
          src={userProfile?.photoURL}
          name={userProfile?.displayName || currentUser?.email}
          size="xl"
          rounded="xl"
          className="shadow-md bg-gradient-to-br from-primary-600 to-primary-800"
        />
        <div>
          <p className="font-bold text-slate-800 text-lg">{userProfile?.displayName || 'Your Name'}</p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            <HiOutlineMail className="w-4 h-4" />{currentUser?.email}
          </p>
          <div className="flex gap-1.5 mt-1.5">
            {userProfile?.role === 'admin' && <span className="badge bg-red-100 text-red-700">Admin</span>}
            {userProfile?.branch && <span className="badge-blue">{userProfile.branch}</span>}
            {userProfile?.semester && <span className="badge-yellow">Sem {userProfile.semester}</span>}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="input-field pl-9"
                value={form.displayName}
                onChange={(e) => update('displayName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              className="input-field bg-slate-50 cursor-not-allowed"
              value={currentUser?.email || ''}
              disabled
            />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Branch</label>
              <select className="input-field" value={form.branch} onChange={(e) => update('branch', e.target.value)}>
                <option value="">Select branch</option>
                {BRANCHES.map((b) => <option key={b.value} value={b.value}>{b.value}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Semester</label>
              <select className="input-field" value={form.semester} onChange={(e) => update('semester', e.target.value)}>
                <option value="">Select semester</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3" disabled={saving}>
            <HiOutlineSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="card p-5 mt-4">
        <h3 className="font-semibold text-slate-700 text-sm mb-3">Your Activity</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-primary-50 rounded-xl">
            <p className="text-2xl font-display font-bold text-primary-700">{userProfile?.uploadCount || 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Resources Uploaded</p>
          </div>
          <div className="text-center p-3 bg-accent-50 rounded-xl">
            <p className="text-2xl font-display font-bold text-accent-600">{userProfile?.downloadCount || 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Resources Downloaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
