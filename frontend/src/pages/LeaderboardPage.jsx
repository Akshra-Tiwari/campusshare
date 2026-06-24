import { useEffect, useState } from 'react';
import { getTopUploaders, getTopDownloaders } from '../services/users';
import Avatar from '../components/common/Avatar';
import { PageLoader } from '../components/common/LoadingSpinner';
import { HiOutlineStar, HiOutlineUpload, HiOutlineDownload } from 'react-icons/hi';
import { BRANCHES } from '../config/constants';
import clsx from 'clsx';

const TAB_UPLOADS = 'uploads';
const TAB_DOWNLOADS = 'downloads';

const rankStyles = [
  { bg: 'bg-gradient-to-br from-accent-300 to-accent-500', text: 'text-white', label: '🥇' },
  { bg: 'bg-gradient-to-br from-slate-300 to-slate-400',   text: 'text-white', label: '🥈' },
  { bg: 'bg-gradient-to-br from-amber-600 to-amber-700',   text: 'text-white', label: '🥉' },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState(TAB_UPLOADS);
  const [uploaders, setUploaders] = useState([]);
  const [downloaders, setDownloaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [topUploaders, topDownloaders] = await Promise.all([
          getTopUploaders(20),
          getTopDownloaders(20),
        ]);
        setUploaders(topUploaders);
        setDownloaders(topDownloaders);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  const list = tab === TAB_UPLOADS ? uploaders : downloaders;
  const metricKey = tab === TAB_UPLOADS ? 'uploadCount' : 'downloadCount';
  const metricLabel = tab === TAB_UPLOADS ? 'uploads' : 'downloads';

  const top3 = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-accent-300 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
          <HiOutlineStar className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-slate-800">Leaderboard</h1>
        <p className="text-slate-500 mt-1">Top JNCT students contributing to CampusShare.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTab(TAB_UPLOADS)}
            className={clsx(
              'px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
              tab === TAB_UPLOADS ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <HiOutlineUpload className="w-4 h-4" /> Top Uploaders
          </button>
          <button
            onClick={() => setTab(TAB_DOWNLOADS)}
            className={clsx(
              'px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
              tab === TAB_DOWNLOADS ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <HiOutlineDownload className="w-4 h-4" /> Most Active Downloaders
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <HiOutlineStar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No activity yet.</p>
          <p className="text-sm mt-1">Be the first to climb the leaderboard!</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {top3.map((user, i) => (
              <div
                key={user.id}
                className={clsx(
                  'card p-5 text-center flex flex-col items-center',
                  i === 0 && 'sm:order-2 sm:-translate-y-3 ring-2 ring-accent-300',
                  i === 1 && 'sm:order-1',
                  i === 2 && 'sm:order-3'
                )}
              >
                <span className="text-2xl mb-2">{rankStyles[i].label}</span>
                <Avatar src={user.photoURL} name={user.displayName || user.email} size="lg" />
                <p className="font-display font-bold text-slate-800 mt-3 truncate w-full">
                  {user.displayName || 'Anonymous'}
                </p>
                {user.branch && (
                  <p className="text-xs text-slate-400">{user.branch}{user.semester ? ` · Sem ${user.semester}` : ''}</p>
                )}
                <div className={clsx('mt-3 px-3 py-1 rounded-full text-sm font-bold', rankStyles[i].bg, rankStyles[i].text)}>
                  {user[metricKey] || 0} {metricLabel}
                </div>
              </div>
            ))}
          </div>

          {/* Rest of the list */}
          {rest.length > 0 && (
            <div className="card divide-y divide-slate-50">
              {rest.map((user, i) => (
                <div key={user.id} className="flex items-center gap-4 p-4">
                  <span className="w-7 text-center font-display font-bold text-slate-400 text-sm flex-shrink-0">
                    {i + 4}
                  </span>
                  <Avatar src={user.photoURL} name={user.displayName || user.email} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{user.displayName || 'Anonymous'}</p>
                    {user.branch && (
                      <p className="text-xs text-slate-400">{user.branch}{user.semester ? ` · Sem ${user.semester}` : ''}</p>
                    )}
                  </div>
                  <span className="font-display font-bold text-primary-700 flex-shrink-0">
                    {user[metricKey] || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
