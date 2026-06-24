import { HiOutlineClock, HiOutlineDocumentText, HiOutlinePhotograph } from 'react-icons/hi';

const formatBytes = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function VersionHistory({ resource }) {
  const previousVersions = resource.previousVersions || [];
  const currentVersion = resource.version || 1;

  if (previousVersions.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-700 text-sm mb-1 flex items-center gap-2">
        <HiOutlineClock className="w-4 h-4 text-slate-400" />
        Version History
      </h3>
      <p className="text-xs text-slate-400 mb-3">
        Currently viewing version {currentVersion}
      </p>

      <div className="space-y-2">
        {/* Current version */}
        <div className="flex items-center gap-2.5 p-2.5 bg-primary-50 rounded-lg border border-primary-100">
          {resource.fileType === 'application/pdf'
            ? <HiOutlineDocumentText className="w-4 h-4 text-primary-600 flex-shrink-0" />
            : <HiOutlinePhotograph className="w-4 h-4 text-primary-600 flex-shrink-0" />
          }
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary-800">Version {currentVersion} (current)</p>
            <p className="text-xs text-primary-600 truncate">{resource.fileName} · {formatBytes(resource.fileSize)}</p>
          </div>
        </div>

        {/* Previous versions, most recent first */}
        {[...previousVersions].reverse().map((v) => (
          <a
            key={v.version}
            href={v.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {v.fileType === 'application/pdf'
              ? <HiOutlineDocumentText className="w-4 h-4 text-slate-400 flex-shrink-0" />
              : <HiOutlinePhotograph className="w-4 h-4 text-slate-400 flex-shrink-0" />
            }
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-600">Version {v.version}</p>
              <p className="text-xs text-slate-400 truncate">{v.fileName} · {formatBytes(v.fileSize)}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
