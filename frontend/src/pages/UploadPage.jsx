import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { uploadResource } from '../services/firestore';
import { BRANCHES, SEMESTERS, RESOURCE_TYPES, getAllSubjects, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../config/constants';
import toast from 'react-hot-toast';
import { HiOutlineUpload, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineX, HiOutlineCheckCircle } from 'react-icons/hi';

const formatBytes = b => { if(!b) return ''; const k=1024,s=['B','KB','MB']; const i=Math.floor(Math.log(b)/Math.log(k)); return `${(b/Math.pow(k,i)).toFixed(1)} ${s[i]}`; };
const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.06,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.06}} };
const selectStyle = { appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E632E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'16px', paddingRight:'40px' };

export default function UploadPage() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', subject:'', branch:userProfile?.branch||'', semester:userProfile?.semester?String(userProfile.semester):'', type:'notes' });
  const up = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    if (form.branch && form.semester) { setSubjects(getAllSubjects(form.branch, Number(form.semester))); up('subject',''); }
    else setSubjects([]);
  }, [form.branch, form.semester]);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length>0) { toast.error(rejected[0].errors[0]?.code==='file-too-large'?`File too large. Max ${formatBytes(MAX_FILE_SIZE)}.`:'File type not supported.'); return; }
    if (accepted.length>0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ACCEPTED_FILE_TYPES, maxSize: MAX_FILE_SIZE, maxFiles: 1 });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file.');
    if (!form.title.trim()) return toast.error('Please enter a title.');
    if (!form.branch) return toast.error('Please select a branch.');
    if (!form.semester) return toast.error('Please select a semester.');
    if (!form.subject) return toast.error('Please select a subject.');
    setUploading(true); setProgress(0);
    try {
      await uploadResource(file, { ...form, title:form.title.trim(), description:form.description.trim(), semester:Number(form.semester), uploaderName:userProfile?.displayName||currentUser.email?.split('@')[0]||'Anonymous', uploaderEmail:currentUser.email }, currentUser.uid, setProgress);
      setDone(true); await refreshUserProfile(); toast.success('Resource uploaded!');
    } catch (err) { toast.error(err.message||'Upload failed.'); setUploading(false); }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background:'linear-gradient(135deg,rgba(171,190,237,0.30) 0%,rgba(237,232,208,0.95) 50%,rgba(219,209,237,0.25) 100%)' }}>
      <motion.div initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} transition={{duration:0.4,ease:[0.34,1.56,0.64,1]}}
        className="glass-card p-12 text-center max-w-md w-full" style={{ background:'linear-gradient(135deg,rgba(237,232,208,0.92) 0%,rgba(219,209,237,0.45) 100%)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background:'rgba(80,180,120,0.15)' }}>
          <HiOutlineCheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-[#2C2A1E] mb-2">Upload complete!</h2>
        <p className="text-sm mb-8" style={{ color:'#6B6344' }}>Your resource is now live and searchable by all JNCT students.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={()=>{ setDone(false); setFile(null); setProgress(0); setForm({title:'',description:'',subject:'',branch:userProfile?.branch||'',semester:userProfile?.semester?String(userProfile.semester):'',type:'notes'}); }} className="btn-ghost">Upload Another</button>
          <button onClick={()=>navigate('/browse')} className="btn-olive">Browse Resources</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.95) 0%,rgba(219,209,237,0.22) 40%,rgba(171,190,237,0.18) 80%,rgba(237,232,208,0.95) 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div custom={0} variants={fadeUp} className="mb-8">
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">Upload Resource</h1>
            <p className="text-sm mt-1" style={{ color:'#6B6344' }}>Share study material with JNCT students. Up to {formatBytes(MAX_FILE_SIZE)} per file.</p>
          </motion.div>

          <motion.form variants={stagger} onSubmit={handleSubmit} className="space-y-5">
            <motion.div custom={1} variants={fadeUp}>
              <label className="field-label">File (PDF or Image)</label>
              {file ? (
                <div className="glass-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(237,232,208,0.70)', border:'1px solid rgba(110,99,46,0.14)' }}>
                    {file.type==='application/pdf' ? <HiOutlineDocumentText className="w-5 h-5" style={{color:'#6E632E'}}/> : <HiOutlinePhotograph className="w-5 h-5" style={{color:'#6E632E'}}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C2A1E] truncate">{file.name}</p>
                    <p className="text-xs" style={{ color:'#9A8F5A' }}>{formatBytes(file.size)}</p>
                  </div>
                  <button type="button" onClick={()=>setFile(null)} className="p-1.5 rounded-xl" style={{ color:'#9A8F5A' }}><HiOutlineX className="w-4 h-4"/></button>
                </div>
              ) : (
                <div {...getRootProps()} className="border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300"
                  style={isDragActive ? { borderColor:'rgba(110,99,46,0.45)', background:'rgba(219,209,237,0.30)' } : { borderColor:'rgba(110,99,46,0.20)', background:'rgba(237,232,208,0.50)' }}>
                  <input {...getInputProps()} />
                  <HiOutlineUpload className="w-8 h-8 mx-auto mb-3" style={{ color: isDragActive ? '#6E632E' : '#C9BDA0' }} />
                  <p className="text-sm font-medium" style={{ color:'#4A4030' }}>{isDragActive?'Drop here...':'Drag & drop or click to browse'}</p>
                  <p className="text-xs mt-1" style={{ color:'#9A8F5A' }}>PDF, JPG, PNG, WEBP · Max {formatBytes(MAX_FILE_SIZE)}</p>
                </div>
              )}
            </motion.div>

            {uploading && (
              <motion.div custom={2} variants={fadeUp} className="glass-card p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color:'#4A4030' }}>Uploading...</span>
                  <span className="font-bold" style={{ color:'#6E632E' }}>{progress}%</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background:'rgba(110,99,46,0.12)' }}>
                  <div className="h-1.5 rounded-full transition-all duration-300" style={{ width:`${progress}%`, background:'linear-gradient(90deg,#7A6F35,#6E632E)' }} />
                </div>
              </motion.div>
            )}

            <motion.div custom={3} variants={fadeUp}>
              <label className="field-label">Title</label>
              <input type="text" placeholder="e.g., OS Unit 3 Notes — Deadlock" className="input-field" value={form.title} onChange={e=>up('title',e.target.value)} required maxLength={120} />
            </motion.div>

            <motion.div custom={4} variants={fadeUp}>
              <label className="field-label">Description <span className="font-normal" style={{color:'#9A8F5A'}}>(optional)</span></label>
              <textarea placeholder="Briefly describe what this covers..." className="input-field resize-none" rows={3} value={form.description} onChange={e=>up('description',e.target.value)} maxLength={500} />
            </motion.div>

            <motion.div custom={5} variants={fadeUp} className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Branch</label>
                <select className="input-field" style={selectStyle} value={form.branch} onChange={e=>up('branch',e.target.value)} required>
                  <option value="">Select branch</option>
                  {BRANCHES.map(b=><option key={b.value} value={b.value}>{b.value} — {b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Semester</label>
                <select className="input-field" style={selectStyle} value={form.semester} onChange={e=>up('semester',e.target.value)} required>
                  <option value="">Select semester</option>
                  {SEMESTERS.map(s=><option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </motion.div>

            <motion.div custom={6} variants={fadeUp} className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Subject</label>
                <select className="input-field" style={selectStyle} value={form.subject} onChange={e=>up('subject',e.target.value)} required disabled={subjects.length===0}>
                  <option value="">{subjects.length>0?'Select subject':'Choose branch & semester first'}</option>
                  {subjects.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Resource Type</label>
                <select className="input-field" style={selectStyle} value={form.type} onChange={e=>up('type',e.target.value)} required>
                  {RESOURCE_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </motion.div>

            <motion.button custom={7} variants={fadeUp} type="submit" disabled={uploading} className="btn-olive w-full py-3.5 text-sm">
              <HiOutlineUpload className="w-4 h-4" /> {uploading?`Uploading ${progress}%...`:'Upload Resource'}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
