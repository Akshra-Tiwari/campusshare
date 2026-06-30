import { HiOutlineClock, HiOutlineDocumentText, HiOutlinePhotograph } from 'react-icons/hi';
const formatBytes = b => { if(!b) return ''; const k=1024,s=['B','KB','MB']; const i=Math.floor(Math.log(b)/Math.log(k)); return `${(b/Math.pow(k,i)).toFixed(1)} ${s[i]}`; };

export default function VersionHistory({ resource }) {
  const prev = resource.previousVersions || [];
  if (prev.length===0) return null;
  return (
    <div className="glass-card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{color:'#9A8F5A'}}>
        <HiOutlineClock className="w-4 h-4" /> Version History
      </h3>
      <p className="text-xs mb-3" style={{color:'#9A8F5A'}}>Currently on version {resource.version||1}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl border" style={{background:'rgba(110,99,46,0.08)',borderColor:'rgba(110,99,46,0.18)'}}>
          {resource.fileType==='application/pdf' ? <HiOutlineDocumentText className="w-4 h-4 flex-shrink-0" style={{color:'#6E632E'}}/> : <HiOutlinePhotograph className="w-4 h-4 flex-shrink-0" style={{color:'#6E632E'}}/>}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold" style={{color:'#6E632E'}}>v{resource.version||1} (current)</p>
            <p className="text-xs truncate" style={{color:'#9A8F5A'}}>{resource.fileName} · {formatBytes(resource.fileSize)}</p>
          </div>
        </div>
        {[...prev].reverse().map(v => (
          <a key={v.version} href={v.fileURL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 rounded-2xl transition-colors" style={{background:'rgba(237,232,208,0.60)'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(219,209,237,0.30)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(237,232,208,0.60)'}>
            {v.fileType==='application/pdf' ? <HiOutlineDocumentText className="w-4 h-4 flex-shrink-0" style={{color:'#9A8F5A'}}/> : <HiOutlinePhotograph className="w-4 h-4 flex-shrink-0" style={{color:'#9A8F5A'}}/>}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold" style={{color:'#6B6344'}}>v{v.version}</p>
              <p className="text-xs truncate" style={{color:'#9A8F5A'}}>{v.fileName} · {formatBytes(v.fileSize)}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
