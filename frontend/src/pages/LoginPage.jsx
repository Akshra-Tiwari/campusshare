import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineBookOpen } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

const fadeUp = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.08,ease:[0.22,1,0.36,1]}}) };
const stagger = { visible:{transition:{staggerChildren:0.07}} };

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email:'', password:'' });
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await login(form.email, form.password); toast.success('Welcome back!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.code==='auth/invalid-credential'?'Invalid email or password.':err.message); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try { await loginWithGoogle(); toast.success('Welcome!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.message); }
    finally { setGoogleLoading(false); }
  };

  return (
    <div className="min-h-screen flex"
         style={{ background:'linear-gradient(135deg,rgba(171,190,237,0.35) 0%,rgba(237,232,208,0.95) 40%,rgba(219,209,237,0.30) 100%)' }}>
      {/* Blobs */}
      <div className="blob-lavender w-[500px] h-[500px] -top-32 -right-32 opacity-40 fixed pointer-events-none" />
      <div className="blob-pastel  w-[400px] h-[400px] bottom-0 left-0 opacity-30 fixed pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 relative overflow-hidden"
           style={{ background:'linear-gradient(135deg,#6E632E 0%,#7A6F35 30%,#5A5228 65%,#4E4520 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage:'linear-gradient(rgba(237,232,208,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(237,232,208,0.08) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
             style={{ background:'radial-gradient(circle,#EDE8D0,transparent)' }} />
        <div className="relative z-10 max-w-md">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
               style={{ background:'rgba(237,232,208,0.15)', border:'1px solid rgba(237,232,208,0.25)' }}>
            <HiOutlineBookOpen className="w-6 h-6" style={{ color:'#F5F0DC' }} />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color:'#F5F0DC', letterSpacing:'-0.03em' }}>
            Your academic hub awaits.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color:'rgba(237,232,208,0.70)' }}>
            Access thousands of notes, PYQs, and resources shared by your peers at JNCT.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[['500+','Resources'],['1,200+','Students'],['5','Branches'],['95%','Satisfaction']].map(([v,l]) => (
              <div key={l} className="p-4 rounded-2xl border"
                   style={{ background:'rgba(237,232,208,0.10)', borderColor:'rgba(237,232,208,0.18)', backdropFilter:'blur(8px)' }}>
                <p className="text-2xl font-bold" style={{ color:'#F5F0DC' }}>{v}</p>
                <p className="text-sm mt-0.5" style={{ color:'rgba(237,232,208,0.60)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.div custom={0} variants={fadeUp} className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7A6F35,#6E632E)' }}>
                <HiOutlineBookOpen className="w-4 h-4" style={{ color:'#F5F0DC' }} />
              </div>
              <span className="font-bold text-[#2C2A1E]">CampusShare</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-[#2C2A1E] tracking-tight">Sign in to your account</h1>
            <p className="text-sm mt-1.5" style={{ color:'#6B6344' }}>Welcome back — let's get you to your resources.</p>
          </motion.div>

          {/* Google */}
          <motion.button custom={1} variants={fadeUp} onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-250 mb-5 disabled:opacity-50"
            style={{ background:'rgba(237,232,208,0.80)', borderColor:'rgba(110,99,46,0.18)', color:'#2C2A1E', backdropFilter:'blur(8px)' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(219,209,237,0.60)'; e.currentTarget.style.borderColor='rgba(110,99,46,0.30)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(237,232,208,0.80)'; e.currentTarget.style.borderColor='rgba(110,99,46,0.18)'; }}>
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>

          <motion.div custom={2} variants={fadeUp} className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background:'rgba(110,99,46,0.15)' }} />
            <span className="text-xs" style={{ color:'#9A8F5A' }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background:'rgba(110,99,46,0.15)' }} />
          </motion.div>

          <motion.form variants={stagger} onSubmit={handleSubmit} className="space-y-4">
            <motion.div custom={3} variants={fadeUp}>
              <label className="field-label">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9A8F5A' }} />
                <input type="email" placeholder="you@example.com" className="input-field pl-10"
                  value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
              </div>
            </motion.div>

            <motion.div custom={4} variants={fadeUp}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold transition-colors" style={{ color:'#6E632E' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9A8F5A' }} />
                <input type="password" placeholder="Your password" className="input-field pl-10"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
              </div>
            </motion.div>

            <motion.button custom={5} variants={fadeUp} type="submit" disabled={loading} className="btn-olive w-full py-3 text-sm">
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          <motion.p custom={6} variants={fadeUp} className="text-center text-sm mt-6" style={{ color:'#6B6344' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors" style={{ color:'#6E632E' }}>Create one free</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
