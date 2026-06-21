import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HiOutlineUpload, HiOutlineSearch, HiOutlineDownload, HiOutlineBookOpen, HiArrowRight, HiOutlineAcademicCap, HiOutlineDocumentText, HiOutlineStar } from 'react-icons/hi';
import { getResources, getStats } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/common/ResourceCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import { APP_NAME, COLLEGE_NAME, BRANCHES } from '../config/constants';

const StatBox = ({ icon: Icon, value, label, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

export default function HomePage() {
  const { currentUser } = useAuth();
  const [recentResources, setRecentResources] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalResources: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ resources }, siteStats] = await Promise.all([
          getResources({}, 6),
          getStats(),
        ]);
        setRecentResources(resources);
        setStats(siteStats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-accent-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              <HiOutlineAcademicCap className="w-4 h-4 text-accent-300" />
              <span className="text-white/90">{COLLEGE_NAME}</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              Study smarter,{' '}
              <span className="text-accent-300">share better.</span>
            </h1>
            <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">
              One place for all JNCT notes, PYQs, lab manuals and assignments — uploaded by students, for students. No more scattered WhatsApp groups.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/browse" className="btn-accent text-base px-6 py-3">
                <HiOutlineSearch className="w-5 h-5" />
                Browse Resources
              </Link>
              {!currentUser ? (
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/30 transition-all text-base backdrop-blur-sm">
                  <HiOutlineUpload className="w-5 h-5" />
                  Get Started
                </Link>
              ) : (
                <Link to="/upload" className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/30 transition-all text-base backdrop-blur-sm">
                  <HiOutlineUpload className="w-5 h-5" />
                  Upload Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox icon={HiOutlineDocumentText} value={stats.totalResources} label="Resources" color="bg-primary-50 text-primary-600" />
          <StatBox icon={HiOutlineAcademicCap} value={stats.totalUsers} label="Students" color="bg-accent-50 text-accent-600" />
          <StatBox icon={HiOutlineBookOpen} value={5} label="Branches" color="bg-emerald-50 text-emerald-600" />
          <StatBox icon={HiOutlineStar} value={8} label="Semesters" color="bg-purple-50 text-purple-600" />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">How CampusShare works</h2>
          <p className="text-slate-500 mt-2">Three simple steps to access or contribute knowledge.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: HiOutlineAcademicCap, step: '01', title: 'Create your account', desc: 'Sign up with your college email or Google account in seconds.' },
            { icon: HiOutlineUpload, step: '02', title: 'Upload resources', desc: 'Share your notes, PYQs, and lab manuals with your branch & semester.' },
            { icon: HiOutlineDownload, step: '03', title: 'Access anything', desc: 'Search, filter, preview, and download resources from fellow students.' },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="card card-hover p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary-600" />
              </div>
              <div className="text-xs font-bold text-accent-500 mb-2 tracking-widest">{step}</div>
              <h3 className="font-display font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="bg-gradient-to-r from-primary-50 via-white to-accent-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-8">Browse by Branch</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {BRANCHES.map((b) => (
              <Link
                key={b.value}
                to={`/browse?branch=${b.value}`}
                className="card px-5 py-3 flex items-center gap-2 hover:shadow-gold-glow hover:border-accent-300 transition-all group"
              >
                <span className="font-bold text-primary-700">{b.value}</span>
                <span className="text-xs text-slate-500 hidden sm:block">{b.label}</span>
                <HiArrowRight className="w-3 h-3 text-accent-500 group-hover:translate-x-0.5 transition-transform ml-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Latest Resources</h2>
          <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
            View all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : recentResources.map((r) => <ResourceCard key={r.id} resource={r} />)
          }
        </div>
        {!loading && recentResources.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <HiOutlineBookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No resources yet.</p>
            <p className="text-sm mt-1">Be the first to upload something!</p>
            <Link to="/upload" className="btn-primary mt-4">Upload Resource</Link>
          </div>
        )}
      </section>

      {/* CTA */}
      {!currentUser && (
        <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to share your knowledge?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Join hundreds of JNCT students helping each other ace exams.
            </p>
            <Link to="/register" className="btn-accent text-base px-8 py-3">
              Create Free Account
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
