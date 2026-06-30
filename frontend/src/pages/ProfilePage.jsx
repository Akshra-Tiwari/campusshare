import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/firestore';
import { BRANCHES, SEMESTERS } from '../config/constants';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineSave, HiOutlineMail } from 'react-icons/hi';

const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.07,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.07}} };
const selectStyle = { appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E632E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'16px', paddingRight:'40px' };

export default function ProfilePage() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [form, setForm] = useState({ displayName:userProfile?.displayName||'', branch:userProfile?.branch||'', semester:userProfile?.semester?String(userProfile.semester):'' });
  const [saving, setSaving] = useState(false);
  const up = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.displayName.trim()) return toast.error('Name cannot be empty.');
    setSaving(true);
    try { await updateUserProfile(currentUser.uid, { displayName:form.displayName.trim(), branch:form.branch, semester:Number(form.semester) }); await refreshUserProfile(); toast.success('Profile updated!'); }
    catch { toast.error('Update failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.25) 50%,rgba(171,190,237,0.18) 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div custom={0} variants={fadeUp} className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">Edit Profile</h1>
            <p className="text-sm mt-1" style={{ color:'#6B6344' }}>Update your personal information and preferences.</p>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="glass-card p-6 mb-5 flex items-center gap-5"
            style={{ background:'linear-gradient(135deg,rgba(237,232,208,0.85) 0%,rgba(219,209,237,0.40) 100%)' }}>
            <Avatar src={userProfile?.photoURL} name={userProfile?.displayName||currentUser?.email} size="xl" rounded="xl" className="flex-shrink-0" />
            <div>
              <p className="font-bold text-[#2C2A1E] text-lg">{userProfile?.displayName||'Your Name'}</p>
              <p className="text-sm flex items-center gap-1.5 mt-0.5" style={{ color:'#6B6344' }}><HiOutlineMail className="w-3.5 h-3.5"/>{currentUser?.email}</p>
              <div className="flex gap-1.5 mt-2">
                {userProfile?.role==='admin' && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-red-700 border" style={{background:'rgba(220,80,80,0.10)',borderColor:'rgba(220,80,80,0.25)'}}>Admin</span>}
                {userProfile?.branch && <span className="badge-olive">{userProfile.branch}</span>}
                {userProfile?.semester && <span className="badge-warm">Sem {userProfile.semester}</span>}
              </div>
            </div>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} className="glass-card p-6 mb-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="field-label">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'#9A8F5A'}} />
                  <input type="text" className="input-field pl-10" value={form.displayName} onChange={e=>up('displayName',e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="field-label">Email address</label>
                <input type="email" className="input-field opacity-60 cursor-not-allowed" value={currentUser?.email||''} disabled />
                <p className="text-xs mt-1" style={{ color:'#9A8F5A' }}>Email cannot be changed.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Branch</label>
                  <select className="input-field" style={selectStyle} value={form.branch} onChange={e=>up('branch',e.target.value)}>
                    <option value="">Select branch</option>
                    {BRANCHES.map(b=><option key={b.value} value={b.value}>{b.value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Semester</label>
                  <select className="input-field" style={selectStyle} value={form.semester} onChange={e=>up('semester',e.target.value)}>
                    <option value="">Select semester</option>
                    {SEMESTERS.map(s=><option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-olive py-3 text-sm" disabled={saving}>
                <HiOutlineSave className="w-4 h-4" /> {saving?'Saving...':'Save Changes'}
              </button>
            </form>
          </motion.div>

          <motion.div custom={3} variants={fadeUp} className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 text-center" style={{ background:'linear-gradient(135deg,rgba(171,190,237,0.40),rgba(237,232,208,0.85))' }}>
              <p className="text-3xl font-extrabold" style={{ color:'#6E632E' }}>{userProfile?.uploadCount||0}</p>
              <p className="text-sm mt-1" style={{ color:'#6B6344' }}>Resources Uploaded</p>
            </div>
            <div className="glass-card p-5 text-center" style={{ background:'linear-gradient(135deg,rgba(219,209,237,0.45),rgba(237,232,208,0.85))' }}>
              <p className="text-3xl font-extrabold text-emerald-600">{userProfile?.downloadCount||0}</p>
              <p className="text-sm mt-1" style={{ color:'#6B6344' }}>Resources Downloaded</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
