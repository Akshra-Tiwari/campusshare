import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineBookOpen, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';

const fadeUp  = { hidden:{opacity:0,y:16}, visible:(i=0)=>({opacity:1,y:0,transition:{duration:0.5,delay:i*0.07}}) };
const stagger = { visible:{transition:{staggerChildren:0.07}} };

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await resetPassword(email); setSent(true); toast.success('Reset link sent!'); }
    catch (err) { toast.error(err.code==='auth/user-not-found'?'No account found.':err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:'linear-gradient(135deg,rgba(171,190,237,0.30),rgba(237,232,208,0.95),rgba(219,209,237,0.25))'}}>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div custom={0} variants={fadeUp} className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,#7A6F35,#6E632E)',boxShadow:'0 4px 16px rgba(110,99,46,0.30)'}}>
            <HiOutlineBookOpen className="w-6 h-6" style={{color:'#F5F0DC'}} />
          </div>
          <h1 className="text-2xl font-bold text-[#2C2A1E]">CampusShare</h1>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} className="glass-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(80,180,120,0.15)'}}>
                <HiOutlineCheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-[#2C2A1E] mb-2">Check your inbox</h2>
              <p className="text-sm mb-5" style={{color:'#6B6344'}}>We sent a reset link to <span className="font-medium text-[#2C2A1E]">{email}</span>.</p>
              <button onClick={()=>{setSent(false);setEmail('');}} className="text-sm font-medium" style={{color:'#6E632E'}}>Try a different email</button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#2C2A1E] mb-1">Reset your password</h2>
              <p className="text-sm mb-6" style={{color:'#6B6344'}}>Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="field-label">Email address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'#9A8F5A'}} />
                    <input type="email" placeholder="you@example.com" className="input-field pl-10" value={email} onChange={e=>setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn-olive w-full py-3 text-sm" disabled={loading}>{loading?'Sending...':'Send Reset Link'}</button>
              </form>
            </>
          )}
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium mt-6 transition-colors" style={{color:'#6B6344'}}>
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
