import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineBookOpen, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import { APP_NAME, COLLEGE_NAME } from '../config/constants';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : 'Failed to send reset email. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Check your inbox</h2>
              <p className="text-slate-500 text-sm mb-6">
                We've sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
                Click the link in the email to set a new password.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                Send to a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display font-bold text-xl text-slate-800 mb-1">Reset your password</h2>
              <p className="text-slate-500 text-sm mb-6">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="input-field pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-primary-600 font-medium mt-6 transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
