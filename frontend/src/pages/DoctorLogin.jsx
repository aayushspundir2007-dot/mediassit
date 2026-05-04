import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function DoctorLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      if (data.user.role !== 'doctor') {
        toast.error('This portal is for doctors only.');
        setLoading(false);
        return;
      }
      login(data.token, data.user);
      toast.success(`Welcome, Dr. ${data.user.name}!`);
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-teal-500 items-center justify-center p-12 text-white">
        <div className="max-w-md">
          <div className="text-5xl mb-6">👨‍⚕️</div>
          <h2 className="text-4xl font-bold mb-4">Doctor Portal</h2>
          <p className="text-green-100 text-lg leading-relaxed">Manage your appointments, view patient details, and update consultation statuses all in one place.</p>
          <div className="mt-8 bg-white/10 rounded-2xl p-4">
            <p className="text-sm text-green-100 font-medium mb-2">Demo Credentials:</p>
            <p className="text-sm text-white">Email: sarah.johnson@mediassist.com</p>
            <p className="text-sm text-white">Password: doctor123</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Sign In</h1>
            <p className="text-gray-500 mt-2">Access your doctor dashboard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="doctor@hospital.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 pr-12"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Signing in...</> : 'Sign In as Doctor'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              New doctor? <Link to="/doctor/register" className="text-green-600 font-semibold hover:underline">Register here</Link>
            </p>
            <p className="text-center text-sm text-gray-400 mt-2">
              <Link to="/login" className="hover:underline">Patient Login</Link> · <Link to="/" className="hover:underline">Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
