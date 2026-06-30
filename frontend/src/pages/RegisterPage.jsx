import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineBookOpen } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { BRANCHES, SEMESTERS } from '../config/constants';

const fadeUp = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.07,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.07}} };

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName:'', email:'', password:'', confirmPassword:'', branch:'', semester:'' });
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const up = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password!==form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length<6) return toast.error('Password must be at least 6 characters');
    if (!form.branch) return toast.error('Please select your branch');
    if (!form.semester) return toast.error('Please select your semester');
    setLoading(true);
    try { await register(form.email,form.password,form.displayName,form.branch,Number(form.semester)); toast.success('Account created!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.code==='auth/email-already-in-use'?'Email already registered.':err.message); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try { await loginWithGoogle(); toast.success('Welcome!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.message); }
    finally { setGoogleLoading(false); }
  };

  const selectStyle = { appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236E632E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', backgroundSize:'16px', paddingRight:'40px' };

  return (
    <div className="min-h-screen flex"
         style={{ background:'linear-gradient(135deg,rgba(219,209,237,0.30) 0%,rgba(237,232,208,0.95) 40%,rgba(171,190,237,0.25) 100%)' }}>
      <div className="blob-lavender w-[450px] h-[450px] top-0 right-0 opacity-35 fixed pointer-events-none" />
      <div className="blob-olive   w-[300px] h-[300px] bottom-0 left-0 opacity-25 fixed pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 relative overflow-hidden"
           style={{ background:'linear-gradient(160deg,rgba(237,232,208,0.90) 0%,rgba(219,209,237,0.50) 40%,rgba(171,190,237,0.40) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 100% 80% at 50% 50%,rgba(171,190,237,0.20),transparent)' }} />
        <div className="relative z-10 max-w-md">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
               style={{ background:'linear-gradient(135deg,#7A6F35,#6E632E)', boxShadow:'0 4px 16px rgba(110,99,46,0.30)' }}>
            <HiOutlineBookOpen className="w-6 h-6" style={{ color:'#F5F0DC' }} />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-[#2C2A1E] tracking-tight">Join the community.</h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color:'#6B6344' }}>
            Create a free account and start sharing knowledge with thousands of JNCT students.
          </p>
          {['Upload notes and help others','Access PYQs organized by semester','Rate and discover top resources','Track your contributions'].map((item,i) => (
            <div key={item} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background:'rgba(110,99,46,0.12)', border:'1px solid rgba(110,99,46,0.20)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background:'#6E632E' }} />
              </div>
              <p className="text-sm" style={{ color:'#4A4030' }}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 overflow-y-auto relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md py-8">
          <motion.div custom={0} variants={fadeUp} className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7A6F35,#6E632E)' }}>
                <HiOutlineBookOpen className="w-4 h-4" style={{ color:'#F5F0DC' }} />
              </div>
              <span className="font-bold text-[#2C2A1E]">CampusShare</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">Create your account</h1>
            <p className="text-sm mt-1.5" style={{ color:'#6B6344' }}>Free forever. No credit card required.</p>
          </motion.div>

          <motion.button custom={1} variants={fadeUp} onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-250 mb-5 disabled:opacity-50"
            style={{ background:'rgba(237,232,208,0.80)', borderColor:'rgba(110,99,46,0.18)', color:'#2C2A1E', backdropFilter:'blur(8px)' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(219,209,237,0.60)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(237,232,208,0.80)'; }}>
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </motion.button>

          <motion.div custom={2} variants={fadeUp} className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background:'rgba(110,99,46,0.15)' }} />
            <span className="text-xs" style={{ color:'#9A8F5A' }}>or fill in your details</span>
            <div className="flex-1 h-px" style={{ background:'rgba(110,99,46,0.15)' }} />
          </motion.div>

          <motion.form variants={stagger} onSubmit={handleSubmit} className="space-y-4">
            <motion.div custom={3} variants={fadeUp}>
              <label className="field-label">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9A8F5A' }} />
                <input type="text" placeholder="Your full name" className="input-field pl-10"
                  value={form.displayName} onChange={e=>up('displayName',e.target.value)} required />
              </div>
            </motion.div>

            <motion.div custom={4} variants={fadeUp}>
              <label className="field-label">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9A8F5A' }} />
                <input type="email" placeholder="you@example.com" className="input-field pl-10"
                  value={form.email} onChange={e=>up('email',e.target.value)} required />
              </div>
            </motion.div>

            <motion.div custom={5} variants={fadeUp} className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Branch</label>
                <select className="input-field" style={selectStyle} value={form.branch} onChange={e=>up('branch',e.target.value)} required>
                  <option value="">Branch</option>
                  {BRANCHES.map(b=><option key={b.value} value={b.value}>{b.value}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Semester</label>
                <select className="input-field" style={selectStyle} value={form.semester} onChange={e=>up('semester',e.target.value)} required>
                  <option value="">Semester</option>
                  {SEMESTERS.map(s=><option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
            </motion.div>

            <motion.div custom={6} variants={fadeUp}>
              <label className="field-label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9A8F5A' }} />
                <input type="password" placeholder="Min. 6 characters" className="input-field pl-10"
                  value={form.password} onChange={e=>up('password',e.target.value)} required />
              </div>
            </motion.div>

            <motion.div custom={7} variants={fadeUp}>
              <label className="field-label">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9A8F5A' }} />
                <input type="password" placeholder="Repeat your password" className="input-field pl-10"
                  value={form.confirmPassword} onChange={e=>up('confirmPassword',e.target.value)} required />
              </div>
            </motion.div>

            <motion.button custom={8} variants={fadeUp} type="submit" disabled={loading} className="btn-olive w-full py-3 text-sm">
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </motion.form>

          <motion.p custom={9} variants={fadeUp} className="text-center text-sm mt-6" style={{ color:'#6B6344' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color:'#6E632E' }}>Sign in</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
