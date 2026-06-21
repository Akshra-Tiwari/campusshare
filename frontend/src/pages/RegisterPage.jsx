import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineBookOpen } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { APP_NAME, COLLEGE_NAME, BRANCHES, SEMESTERS } from '../config/constants';

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: '',
    semester: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!form.branch) return toast.error('Please select your branch');
    if (!form.semester) return toast.error('Please select your semester');

    setLoading(true);
    try {
      await register(form.email, form.password, form.displayName, form.branch, Number(form.semester));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'This email is already registered.' : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <HiOutlineBookOpen className="text-white w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-800">{APP_NAME}</h1>
          <p className="text-slate-500 text-sm mt-1">{COLLEGE_NAME}</p>
        </div>

        <div className="card p-8">
          <h2 className="font-display font-bold text-xl text-slate-800 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-6">Join the JNCT study community</p>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700 text-sm mb-4 disabled:opacity-60"
          >
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or fill the form</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input-field pl-9"
                  value={form.displayName}
                  onChange={(e) => update('displayName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-9"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Branch</label>
                <select
                  className="input-field"
                  value={form.branch}
                  onChange={(e) => update('branch', e.target.value)}
                  required
                >
                  <option value="">Select branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b.value} value={b.value}>{b.value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Semester</label>
                <select
                  className="input-field"
                  value={form.semester}
                  onChange={(e) => update('semester', e.target.value)}
                  required
                >
                  <option value="">Semester</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="input-field pl-9"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className="input-field pl-9"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
