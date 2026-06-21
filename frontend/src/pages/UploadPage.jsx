import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadResource } from '../services/firestore';
import {
  BRANCHES, SEMESTERS, RESOURCE_TYPES, getAllSubjects, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE
} from '../config/constants';
import toast from 'react-hot-toast';
import {
  HiOutlineUpload, HiOutlineDocumentText, HiOutlinePhotograph,
  HiOutlineX, HiOutlineCheckCircle
} from 'react-icons/hi';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function UploadPage() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    branch: userProfile?.branch || '',
    semester: userProfile?.semester ? String(userProfile.semester) : '',
    type: 'notes',
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    if (form.branch && form.semester) {
      setSubjects(getAllSubjects(form.branch, Number(form.semester)));
      update('subject', '');
    } else {
      setSubjects([]);
    }
  }, [form.branch, form.semester]);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const reason = rejected[0].errors[0]?.code === 'file-too-large'
        ? `File too large. Max size is ${formatBytes(MAX_FILE_SIZE)}.`
        : 'File type not supported.';
      toast.error(reason);
      return;
    }
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file to upload.');
    if (!form.title.trim()) return toast.error('Please enter a title.');
    if (!form.branch) return toast.error('Please select a branch.');
    if (!form.semester) return toast.error('Please select a semester.');
    if (!form.subject) return toast.error('Please select a subject.');

    setUploading(true);
    setProgress(0);

    try {
      await uploadResource(
        file,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          subject: form.subject,
          branch: form.branch,
          semester: Number(form.semester),
          type: form.type,
          uploaderName: userProfile?.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
          uploaderEmail: currentUser.email,
        },
        currentUser.uid,
        setProgress
      );

      setDone(true);
      await refreshUserProfile();
      toast.success('Resource uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
      setUploading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-slide-up">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <HiOutlineCheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">Upload complete!</h2>
        <p className="text-slate-500 mb-6">Your resource is now available to all JNCT students.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setDone(false); setFile(null); setProgress(0); setForm({ title: '', description: '', subject: '', branch: userProfile?.branch || '', semester: userProfile?.semester ? String(userProfile.semester) : '', type: 'notes' }); }} className="btn-secondary">
            Upload Another
          </button>
          <button onClick={() => navigate('/browse')} className="btn-primary">
            Browse Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      <div className="page-header">
        <h1 className="font-display font-bold text-3xl text-slate-800">Upload Resource</h1>
        <p className="text-slate-500 mt-1">Share study material with your fellow JNCT students.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Free plan notice */}
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-accent-800 leading-relaxed">
            Files are limited to <strong>700KB</strong> on the free plan. For larger PDFs, try compressing them first (e.g. <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer" className="underline font-medium">ilovepdf.com/compress_pdf</a>).
          </p>
        </div>

        {/* File Drop Zone */}
        <div>
          <label className="label">File (PDF or Image)</label>
          {file ? (
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                {file.type === 'application/pdf'
                  ? <HiOutlineDocumentText className="w-5 h-5 text-red-500" />
                  : <HiOutlinePhotograph className="w-5 h-5 text-blue-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
              }`}
            >
              <input {...getInputProps()} />
              <HiOutlineUpload className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? 'text-primary-500' : 'text-slate-300'}`} />
              <p className="font-semibold text-slate-600 text-sm">
                {isDragActive ? 'Drop the file here...' : 'Drag & drop your file here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">or click to browse — PDF, JPG, PNG, WEBP · Max 700KB</p>
            </div>
          )}
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Uploading...</span>
              <span className="text-sm font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            placeholder="e.g., Operating Systems Unit 3 Notes"
            className="input-field"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            maxLength={120}
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            placeholder="Briefly describe what this resource covers..."
            className="input-field resize-none"
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            maxLength={500}
          />
        </div>

        {/* Branch + Semester */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Branch</label>
            <select className="input-field" value={form.branch} onChange={(e) => update('branch', e.target.value)} required>
              <option value="">Select branch</option>
              {BRANCHES.map((b) => <option key={b.value} value={b.value}>{b.value} — {b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Semester</label>
            <select className="input-field" value={form.semester} onChange={(e) => update('semester', e.target.value)} required>
              <option value="">Select semester</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>

        {/* Subject + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Subject</label>
            <select
              className="input-field"
              value={form.subject}
              onChange={(e) => update('subject', e.target.value)}
              required
              disabled={subjects.length === 0}
            >
              <option value="">{subjects.length > 0 ? 'Select subject' : 'Select branch & semester first'}</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Resource Type</label>
            <select className="input-field" value={form.type} onChange={(e) => update('type', e.target.value)} required>
              {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base" disabled={uploading}>
          <HiOutlineUpload className="w-5 h-5" />
          {uploading ? `Uploading ${progress}%...` : 'Upload Resource'}
        </button>
      </form>
    </div>
  );
}
