import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineRefresh, HiOutlineX, HiOutlineUpload } from 'react-icons/hi';
import { uploadNewVersion } from '../../services/resources';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../../config/constants';
import toast from 'react-hot-toast';
const formatBytes = b => { if(!b) return ''; const k=1024,s=['B','KB','MB']; const i=Math.floor(Math.log(b)/Math.log(k)); return `${(b/Math.pow(k,i)).toFixed(1)} ${s[i]}`; };

export default function UploadNewVersionButton({ resourceId, userId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length>0) { toast.error(`Max size is ${formatBytes(MAX_FILE_SIZE)}.`); return; }
    if (accepted.length>0) setFile(accepted[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ACCEPTED_FILE_TYPES, maxSize: MAX_FILE_SIZE, maxFiles: 1 });

  const handleUpload = async () => {
    if (!file) return; setUploading(true);
    try { await uploadNewVersion(resourceId, file, userId, setProgress); toast.success('New version uploaded!'); setOpen(false); setFile(null); setProgress(0); onSuccess?.(); }
    catch (err) { toast.error(err.message||'Upload failed.'); }
    finally { setUploading(false); }
  };

  if (!open) return (
    <button onClick={()=>setOpen(true)} className="btn-ghost w-full justify-center py-2.5 text-sm">
      <HiOutlineRefresh className="w-4 h-4" /> Upload New Version
    </button>
  );

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[#2C2A1E]">New Version</h4>
        <button onClick={()=>{setOpen(false);setFile(null);}} disabled={uploading} className="p-1 rounded" style={{color:'#9A8F5A'}}><HiOutlineX className="w-4 h-4"/></button>
      </div>
      {file ? (
        <div className="flex items-center gap-2 p-2.5 rounded-2xl mb-3" style={{background:'rgba(237,232,208,0.60)'}}>
          <span className="text-xs font-medium truncate flex-1" style={{color:'#4A4030'}}>{file.name}</span>
          <span className="text-xs" style={{color:'#9A8F5A'}}>{formatBytes(file.size)}</span>
          {!uploading && <button onClick={()=>setFile(null)} style={{color:'#9A8F5A'}}><HiOutlineX className="w-3.5 h-3.5"/></button>}
        </div>
      ) : (
        <div {...getRootProps()} className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all mb-3"
          style={isDragActive?{borderColor:'rgba(110,99,46,0.40)',background:'rgba(219,209,237,0.25)'}:{borderColor:'rgba(110,99,46,0.18)'}}>
          <input {...getInputProps()} />
          <HiOutlineUpload className="w-5 h-5 mx-auto mb-1.5" style={{color:'#C9BDA0'}} />
          <p className="text-xs" style={{color:'#9A8F5A'}}>Drop file or click to browse</p>
        </div>
      )}
      {uploading && (
        <div className="w-full rounded-full h-1 mb-3" style={{background:'rgba(110,99,46,0.12)'}}>
          <div className="h-1 rounded-full transition-all" style={{width:`${progress}%`,background:'#6E632E'}} />
        </div>
      )}
      <button onClick={handleUpload} disabled={!file||uploading} className="btn-olive w-full justify-center py-2 text-sm">
        {uploading?`Uploading ${progress}%...`:'Replace with New Version'}
      </button>
    </div>
  );
}
