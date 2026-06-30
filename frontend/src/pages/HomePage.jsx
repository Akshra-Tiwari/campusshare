import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getStats } from '../services/users';
import {
  HiOutlineDocumentText, HiOutlineSearch, HiOutlineUpload,
  HiOutlineCheckCircle, HiOutlineUsers, HiOutlineLightningBolt,
  HiOutlineBookOpen, HiOutlineStar, HiOutlineArrowRight, HiOutlineCollection,
} from 'react-icons/hi';
import { BRANCHES, RESOURCE_TYPES } from '../config/constants';

const fadeUp  = { hidden: { opacity: 0, y: 32 }, visible: (i=0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: [0.22,1,0.36,1] } }) };
const fadeIn  = { hidden: { opacity: 0 },          visible: (i=0) => ({ opacity: 1, transition: { duration: 0.5, delay: i * 0.1 } }) };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const FEATURES = [
  { icon: HiOutlineDocumentText,  title: 'Notes Sharing',          desc: 'Upload and access lecture notes organized by subject, semester, and branch. Find exactly what you need instantly.',          grad: 'linear-gradient(135deg, rgba(171,190,237,0.4) 0%, rgba(237,232,208,0.85) 100%)' },
  { icon: HiOutlineStar,          title: 'Previous Year Papers',   desc: 'Access a comprehensive library of PYQs with semester-wise filtering to prepare smarter for exams.',                       grad: 'linear-gradient(135deg, rgba(219,209,237,0.55) 0%, rgba(237,232,208,0.85) 100%)' },
  { icon: HiOutlineCollection,    title: 'Assignments Repository', desc: 'Browse peer assignments, understand patterns, and submit with confidence. Never miss a deadline again.',                    grad: 'linear-gradient(135deg, rgba(171,190,237,0.35) 0%, rgba(219,209,237,0.4) 50%, rgba(237,232,208,0.85) 100%)' },
  { icon: HiOutlineBookOpen,      title: 'Lab Manuals',            desc: 'Complete lab manuals for every practical. Step-by-step guides uploaded by seniors who scored well.',                       grad: 'linear-gradient(135deg, rgba(237,232,208,0.9) 0%, rgba(219,209,237,0.5) 100%)' },
  { icon: HiOutlineSearch,        title: 'Smart Search',           desc: 'Real-time full-text search with instant results. Filter by branch, semester, subject, or resource type in seconds.',     grad: 'linear-gradient(135deg, rgba(219,209,237,0.5) 0%, rgba(171,190,237,0.4) 50%, rgba(237,232,208,0.85) 100%)' },
  { icon: HiOutlineCheckCircle,   title: 'Verified Resources',     desc: 'Community ratings and download counts surface the most trusted, highest-quality academic resources automatically.',       grad: 'linear-gradient(135deg, rgba(171,190,237,0.45) 0%, rgba(237,232,208,0.9) 100%)' },
];

const STEPS = [
  { step: '01', icon: HiOutlineUpload,       title: 'Upload Resources',           desc: 'Share your notes, PYQs, lab manuals, and assignments. Tag by subject, branch, and semester.' },
  { step: '02', icon: HiOutlineCheckCircle,  title: 'Organization & Discovery',   desc: 'Resources are instantly searchable. The community rates and surfaces the best material.' },
  { step: '03', icon: HiOutlineLightningBolt, title: 'Access & Collaborate',      desc: 'Download, preview, bookmark favourites, and build on each other\'s academic knowledge.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  dept: 'CSE — Semester 6', text: 'CampusShare saved my exams. Found three years of PYQs for every subject in minutes. The organization is brilliant.', rating: 5 },
  { name: 'Rahul Verma',   dept: 'ECE — Semester 4', text: 'Finally one platform for everything. No more digging through WhatsApp at midnight before exams.', rating: 5 },
  { name: 'Ananya Singh',  dept: 'ME — Semester 5',  text: 'I uploaded my notes and 200+ students downloaded them in a week. Feels incredible to actually help people.', rating: 5 },
];

const MOCK_RESOURCES = [
  { title: 'Data Structures Notes',   subject: 'DSA',  branch: 'CSE', type: 'notes',      downloads: 342, sem: 3 },
  { title: 'OS Previous Year Paper',  subject: 'OS',   branch: 'CSE', type: 'pyq',        downloads: 218, sem: 5 },
  { title: 'DBMS Lab Manual',         subject: 'DBMS', branch: 'CSE', type: 'lab',        downloads: 189, sem: 4 },
  { title: 'CN Assignment Unit 2',    subject: 'CN',   branch: 'ECE', type: 'assignment', downloads: 97,  sem: 6 },
];

export default function HomePage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalResources: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => { getStats().then(setStats).catch(() => {}); }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 130% 90% at 75% 15%, rgba(171,190,237,0.55) 0%, rgba(219,209,237,0.40) 25%, rgba(237,232,208,0.95) 55%, rgba(240,235,220,1) 100%)' }}>

        {/* Animated background blobs */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="blob-lavender w-[500px] h-[500px] -top-24 -right-24 opacity-70" />
          <div className="blob-pastel  w-[400px] h-[400px] top-1/2 -right-16 opacity-50" />
          <div className="blob-olive   w-[300px] h-[300px] bottom-0 left-1/4 opacity-40" />
          <div className="blob-ivory   w-[250px] h-[250px] top-1/4 left-0 opacity-60" />
          {/* Decorative floating orbs */}
          <motion.div animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(219,209,237,0.9), transparent)' }} />
          <motion.div animate={{ y: [6, -6, 6], rotate: [0, -3, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(171,190,237,0.9), transparent)' }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="container-xl relative z-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-xl">
              <motion.div custom={0} variants={fadeUp}>
                <span className="section-pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E632E] animate-pulse-soft" />
                  Jai Narain College of Technology, Bhopal
                </span>
              </motion.div>

              <motion.h1 custom={1} variants={fadeUp} className="heading-display mb-6">
                Share Knowledge.{' '}
                <span className="text-olive-gradient">Build Success</span>{' '}
                Together.
              </motion.h1>

              <motion.p custom={2} variants={fadeUp} className="body-lg mb-8 max-w-lg" style={{ color: '#6B6344' }}>
                CampusShare helps students discover, upload, and access notes, PYQs, assignments,
                lab manuals, and academic resources from one centralized, beautiful platform.
              </motion.p>

              <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-olive-lg">
                  Get Started Free <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/browse" className="btn-ghost-lg">Explore Resources</Link>
              </motion.div>

              {/* Micro-stats */}
              <motion.div custom={4} variants={fadeUp}
                className="flex items-center gap-8 mt-10 pt-8"
                style={{ borderTop: '1px solid rgba(110,99,46,0.15)' }}>
                {[
                  { val: `${stats.totalResources || '500'}+`, label: 'Resources' },
                  { val: `${stats.totalUsers    || '1,000'}+`, label: 'Students' },
                  { val: '5',                                   label: 'Branches' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">{val}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#9A8F5A' }}>{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <DashboardPreview stats={stats} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, rgba(219,209,237,0.25) 0%, rgba(237,232,208,0.8) 40%, rgba(171,190,237,0.15) 100%)' }}>
        <div className="container-xl py-20">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: '5,000+', label: 'Resources Shared',    icon: HiOutlineDocumentText },
              { val: '2,000+', label: 'Active Students',     icon: HiOutlineUsers },
              { val: '15+',    label: 'Departments',         icon: HiOutlineCollection },
              { val: '95%',    label: 'Satisfaction Rate',   icon: HiOutlineStar },
            ].map(({ val, label, icon: Icon }, i) => (
              <motion.div key={label} custom={i} variants={fadeUp} className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                     style={{ background: 'linear-gradient(135deg, rgba(219,209,237,0.7) 0%, rgba(171,190,237,0.5) 100%)', border: '1px solid rgba(110,99,46,0.12)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#6E632E' }} />
                </div>
                <p className="text-3xl font-extrabold text-[#2C2A1E] tracking-tight">{val}</p>
                <p className="text-sm mt-1" style={{ color: '#9A8F5A' }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="section-py relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #EDE8D0 0%, rgba(219,209,237,0.30) 35%, #EDE8D0 65%, rgba(171,190,237,0.20) 100%)' }}>
        <div className="blob-lavender w-[600px] h-[600px] -top-32 -left-32 opacity-30" />
        <div className="blob-pastel  w-[400px] h-[400px] bottom-0 right-0 opacity-25" />

        <div className="container-xl relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16">
            <motion.span custom={0} variants={fadeUp} className="section-pill">Features</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="heading-section">
              Everything you need,<br />
              <span className="text-olive-gradient">nothing you don't.</span>
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} className="body-lg max-w-xl mx-auto mt-4">
              A focused set of tools built specifically for academic resource sharing — clean, fast, and beautifully designed.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, grad }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp}>
                <div className="glass-card p-7 h-full" style={{ background: grad }}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                       style={{ background: 'linear-gradient(135deg, rgba(110,99,46,0.15) 0%, rgba(110,99,46,0.08) 100%)', border: '1px solid rgba(110,99,46,0.18)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#6E632E' }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-[#2C2A1E]">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6344' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="section-py relative overflow-hidden"
        style={{ background: 'linear-gradient(200deg, rgba(171,190,237,0.25) 0%, rgba(237,232,208,0.90) 40%, rgba(219,209,237,0.30) 80%, rgba(237,232,208,0.95) 100%)' }}>
        <div className="container-xl">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16">
            <motion.span custom={0} variants={fadeUp} className="section-pill">How it Works</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="heading-section">Up and running in minutes.</motion.h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div key={step} custom={i} variants={fadeUp}>
                <div className="glass-card p-8 text-center h-full relative overflow-hidden"
                     style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.85) 0%, rgba(219,209,237,0.35) 50%, rgba(171,190,237,0.25) 100%)' }}>
                  {/* Step number bg */}
                  <div className="absolute top-4 right-5 text-6xl font-black opacity-[0.05] select-none"
                       style={{ color: '#6E632E' }}>{step}</div>
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                         style={{ background: 'linear-gradient(135deg, #7A6F35, #6E632E)', boxShadow: '0 4px 20px rgba(110,99,46,0.30)' }}>
                      <Icon className="w-7 h-7 text-[#F5F0DC]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                         style={{ background: 'rgba(237,232,208,0.95)', border: '1.5px solid rgba(110,99,46,0.20)', color: '#6E632E', boxShadow: '0 2px 6px rgba(110,99,46,0.15)' }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#2C2A1E] mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6344' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RESOURCE SHOWCASE ────────────────────────────────────────────── */}
      <section className="section-py relative"
        style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.95) 0%, rgba(171,190,237,0.20) 50%, rgba(237,232,208,0.95) 100%)' }}>
        <div className="container-xl">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <motion.span custom={0} variants={fadeUp} className="section-pill">Resource Explorer</motion.span>
                <motion.h2 custom={1} variants={fadeUp} className="heading-section">Find what you need.</motion.h2>
              </div>
              <motion.div custom={2} variants={fadeUp}>
                <Link to="/browse" className="btn-ghost gap-2">
                  View All Resources <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Filter chips */}
            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
              {['All', 'Notes', 'PYQs', 'Assignments', 'Lab Manuals'].map((chip, i) => (
                <button key={chip} className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  i === 0
                    ? 'text-[#F5F0DC] border-transparent'
                    : 'text-[#6E632E] hover:border-[rgba(110,99,46,0.35)]'
                }`}
                style={i === 0
                  ? { background: 'linear-gradient(135deg, #7A6F35, #6E632E)', boxShadow: '0 2px 8px rgba(110,99,46,0.25)' }
                  : { background: 'rgba(237,232,208,0.7)', borderColor: 'rgba(110,99,46,0.18)', backdropFilter: 'blur(8px)' }}>
                  {chip}
                </button>
              ))}
            </motion.div>

            {/* Table */}
            <motion.div custom={4} variants={fadeUp} className="glass-card overflow-x-auto"
              style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.82) 0%, rgba(219,209,237,0.40) 50%, rgba(237,232,208,0.88) 100%)' }}>
              <table className="premium-table w-full">
                <thead>
                  <tr>
                    {['Resource', 'Subject', 'Department', 'Semester', 'Type', 'Downloads'].map(h => (
                      <th key={h} className="premium-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RESOURCES.map((r, i) => (
                    <tr key={i} className="premium-tr">
                      <td className="premium-td font-semibold text-[#2C2A1E]">{r.title}</td>
                      <td className="premium-td">{r.subject}</td>
                      <td className="premium-td"><span className="badge-olive">{r.branch}</span></td>
                      <td className="premium-td">Sem {r.sem}</td>
                      <td className="premium-td"><span className="badge-lavender">{RESOURCE_TYPES.find(t => t.value === r.type)?.label || r.type}</span></td>
                      <td className="premium-td text-[#6E632E] font-semibold">{r.downloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── DEPARTMENTS ──────────────────────────────────────────────────── */}
      <section id="departments" className="section-py relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(219,209,237,0.30) 0%, rgba(237,232,208,0.90) 30%, rgba(171,190,237,0.20) 70%, rgba(237,232,208,0.95) 100%)' }}>
        <div className="blob-pastel  w-[500px] h-[500px] top-0 right-0 opacity-25" />
        <div className="blob-lavender w-[400px] h-[400px] bottom-0 left-0 opacity-20" />

        <div className="container-xl relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14">
            <motion.span custom={0} variants={fadeUp} className="section-pill">Departments</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="heading-section">Built for every branch.</motion.h2>
            <motion.p custom={2} variants={fadeUp} className="body-lg max-w-lg mx-auto mt-4">
              Resources organized across all departments of JNCT, covering all 8 semesters and every subject.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {BRANCHES.map(({ value, label }, i) => (
              <motion.div key={value} custom={i} variants={fadeUp} whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.25 }}>
                <Link to={`/browse?branch=${value}`}
                  className="glass-card p-6 text-center flex flex-col items-center gap-3 group"
                  style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.80) 0%, rgba(219,209,237,0.45) 100%)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                                  group-hover:shadow-olive"
                       style={{ background: 'linear-gradient(135deg, rgba(110,99,46,0.12) 0%, rgba(110,99,46,0.06) 100%)', border: '1px solid rgba(110,99,46,0.15)' }}>
                    <span className="text-sm font-black" style={{ color: '#6E632E' }}>{value}</span>
                  </div>
                  <p className="text-xs text-center leading-tight" style={{ color: '#6B6344' }}>{label}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="section-py relative"
        style={{ background: 'linear-gradient(160deg, rgba(237,232,208,0.95) 0%, rgba(171,190,237,0.25) 40%, rgba(219,209,237,0.30) 70%, rgba(237,232,208,0.95) 100%)' }}>
        <div className="container-xl">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14">
            <motion.span custom={0} variants={fadeUp} className="section-pill">Testimonials</motion.span>
            <motion.h2 custom={1} variants={fadeUp} className="heading-section">Loved by students.</motion.h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, dept, text, rating }, i) => (
              <motion.div key={name} custom={i} variants={fadeUp} whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
                <div className="glass-card p-8 h-full flex flex-col gap-5"
                     style={{ background: i === 1
                       ? 'linear-gradient(135deg, rgba(219,209,237,0.55) 0%, rgba(237,232,208,0.85) 100%)'
                       : 'linear-gradient(135deg, rgba(237,232,208,0.82) 0%, rgba(171,190,237,0.30) 100%)' }}>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <HiOutlineStar key={j} className="w-4 h-4 fill-current" style={{ color: '#6E632E' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#4A4030' }}>"{text}"</p>
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(110,99,46,0.12)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: 'linear-gradient(135deg, rgba(219,209,237,0.8), rgba(171,190,237,0.6))', border: '1px solid rgba(110,99,46,0.15)' }}>
                      <span className="text-sm font-bold" style={{ color: '#6E632E' }}>{name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C2A1E]">{name}</p>
                      <p className="text-xs" style={{ color: '#9A8F5A' }}>{dept}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-py relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6E632E 0%, #7A6F35 25%, #5A5228 50%, #6E632E 75%, #4E4520 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
               style={{ background: 'radial-gradient(circle, #EDE8D0, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
               style={{ background: 'radial-gradient(circle, #DBD1ED, transparent)' }} />
          <div className="absolute inset-0 opacity-5"
               style={{ backgroundImage: 'linear-gradient(rgba(237,232,208,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(237,232,208,0.15) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="container-xl relative z-10 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 custom={0} variants={fadeUp}
              className="font-extrabold leading-none tracking-tight mb-4"
              style={{ color: '#F5F0DC', fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-0.03em' }}>
              Start Sharing Knowledge Today
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-[17px] leading-relaxed mb-8 max-w-lg mx-auto"
              style={{ color: 'rgba(237,232,208,0.75)' }}>
              Join thousands of students building a smarter academic community at JNCT.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <Link to="/upload" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'rgba(237,232,208,0.95)', color: '#6E632E', boxShadow: '0 4px 20px rgba(237,232,208,0.25)' }}>
                <HiOutlineUpload className="w-4 h-4" /> Upload Resource
              </Link>
              <Link to="/browse" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(237,232,208,0.10)]"
                style={{ borderColor: 'rgba(237,232,208,0.30)', color: 'rgba(237,232,208,0.90)' }}>
                Explore Library <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ── Dashboard Preview ──────────────────────────────────────────────────── */
function DashboardPreview({ stats }) {
  return (
    <div className="relative">
      <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(237,232,208,0.88) 0%, rgba(255,255,255,0.60) 50%, rgba(219,209,237,0.50) 100%)',
            border: '1px solid rgba(110,99,46,0.14)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 48px rgba(110,99,46,0.14), 0 2px 8px rgba(110,99,46,0.08), inset 0 1px 0 rgba(255,255,255,0.70)',
          }}>
          {/* Titlebar */}
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(110,99,46,0.10)', background: 'rgba(237,232,208,0.60)' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
              </div>
              <span className="text-xs font-medium ml-2" style={{ color: '#9A8F5A' }}>CampusShare Dashboard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px]" style={{ color: '#9A8F5A' }}>Live</span>
            </div>
          </div>

          <div className="p-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Total Resources', val: stats.totalResources || '500+', sub: '+12% this week' },
                { label: 'Active Students', val: stats.totalUsers || '1,200+',   sub: '+8% this week' },
                { label: 'Departments',     val: '5 Branches',                   sub: 'CSE, ECE, ME...' },
                { label: 'Downloads Today', val: '248',                          sub: '+31% vs yesterday' },
              ].map(({ label, val, sub }) => (
                <div key={label} className="rounded-2xl p-3.5"
                  style={{ background: 'rgba(237,232,208,0.70)', border: '1px solid rgba(110,99,46,0.10)' }}>
                  <p className="text-xs mb-1" style={{ color: '#9A8F5A' }}>{label}</p>
                  <p className="text-lg font-extrabold text-[#2C2A1E] tracking-tight">{val}</p>
                  <p className="text-[10px] mt-0.5 font-medium" style={{ color: '#6E632E' }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Recent uploads */}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9A8F5A' }}>Recent Uploads</p>
            <div className="space-y-2">
              {[
                { title: 'Data Structures Notes', branch: 'CSE', type: 'Notes', time: '2m ago', dot: '#6E632E' },
                { title: 'OS Previous Year Paper', branch: 'CSE', type: 'PYQ',   time: '18m ago', dot: '#8A7DBB' },
                { title: 'DBMS Lab Manual',        branch: 'ECE', type: 'Lab',   time: '1h ago', dot: '#3A5A9A' },
              ].map(({ title, branch, type, time, dot }) => (
                <div key={title} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-150 hover:bg-[rgba(110,99,46,0.05)]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(219,209,237,0.50)', border: '1px solid rgba(110,99,46,0.12)' }}>
                    <HiOutlineDocumentText className="w-4 h-4" style={{ color: '#6E632E' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#2C2A1E] truncate">{title}</p>
                    <p className="text-[10px]" style={{ color: '#9A8F5A' }}>{branch}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${dot}18`, color: dot, border: `1px solid ${dot}30` }}>{type}</span>
                    <span className="text-[9px]" style={{ color: '#9A8F5A' }}>{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badge — upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -bottom-5 -left-8 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, rgba(237,232,208,0.97), rgba(219,209,237,0.80))', border: '1px solid rgba(110,99,46,0.14)', boxShadow: '0 4px 24px rgba(110,99,46,0.14)', backdropFilter: 'blur(12px)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: 'linear-gradient(135deg, rgba(110,99,46,0.18), rgba(110,99,46,0.10))' }}>
          <HiOutlineCheckCircle className="w-4 h-4" style={{ color: '#6E632E' }} />
        </div>
        <div>
          <p className="text-xs font-bold text-[#2C2A1E]">New upload!</p>
          <p className="text-[10px]" style={{ color: '#9A8F5A' }}>Maths Unit 3 Notes</p>
        </div>
      </motion.div>

      {/* Floating badge — search */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="absolute -top-5 -right-6 rounded-2xl px-4 py-2.5 flex items-center gap-2"
        style={{ background: 'rgba(237,232,208,0.96)', border: '1px solid rgba(110,99,46,0.14)', boxShadow: '0 4px 20px rgba(110,99,46,0.12)', backdropFilter: 'blur(12px)' }}>
        <HiOutlineSearch className="w-3.5 h-3.5" style={{ color: '#6E632E' }} />
        <span className="text-xs font-medium" style={{ color: '#6B6344' }}>Search resources...</span>
        <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(110,99,46,0.10)', color: '#9A8F5A' }}>/</kbd>
      </motion.div>
    </div>
  );
}
