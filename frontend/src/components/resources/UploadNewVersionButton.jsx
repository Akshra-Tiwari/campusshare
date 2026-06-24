import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineRefresh, HiOutlineX, HiOutlineUpload } from 'react-icons/hi';
import { uploadNewVersion } from '../../services/resources';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../../config/constants';
import toast from 'react-hot-toast';

const formatBytes = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function UploadNewVersionButton({ resourceId, userId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error(`File too large. Max size is ${formatBytes(MAX_FILE_SIZE)}.`);
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

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadNewVersion(resourceId, file, userId, setProgress);
      toast.success('New version uploaded!');
      setOpen(false);
      setFile(null);
      setProgress(0);
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Failed to upload new version.');
    } finally {
      setUploading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary w-full justify-center py-2.5 text-sm">
        <HiOutlineRefresh className="w-4 h-4" />
        Upload New Version
      </button>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-700 text-sm">Upload New Version</h4>
        <button
          onClick={() => { setOpen(false); setFile(null); }}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
          disabled={uploading}
        >
          <HiOutlineX className="w-4 h-4" />
        </button>
      </div>

      {file ? (
        <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg mb-3">
          <span className="text-xs font-medium text-slate-700 truncate flex-1">{file.name}</span>
          <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
          {!uploading && (
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-slate-600">
              <HiOutlineX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-3 ${
            isDragActive ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-primary-300'
          }`}
        >
          <input {...getInputProps()} />
          <HiOutlineUpload className="w-6 h-6 mx-auto mb-2 text-slate-300" />
          <p className="text-xs text-slate-500">Drop file or click to browse</p>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
          <div
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="btn-primary w-full justify-center py-2 text-sm"
      >
        {uploading ? `Uploading ${progress}%...` : 'Replace with New Version'}
      </button>
    </div>
  );
}
