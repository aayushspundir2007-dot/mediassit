import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const SPECS = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Psychiatry', 'Ophthalmology', 'ENT', 'Gynecology'];

export default function DoctorRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'doctor', specialization: '', experience: '', qualification: '', consultationFee: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      login(data.token, data.user);
      toast.success('Welcome to MediAssist, Doctor!');
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            👨‍⚕️ Doctor Registration
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join as a Doctor</h1>
          <p className="text-gray-500 mt-2">Create your professional profile and start managing patients</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" required value={formData.name} onChange={e => set('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="Dr. John Smith" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <input type="email" required value={formData.email} onChange={e => set('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="doctor@hospital.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <input type="password" required value={formData.password} onChange={e => set('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                <select value={formData.specialization} onChange={e => set('specialization', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50">
                  <option value="">Select specialization</option>
                  {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qualification</label>
                <input type="text" value={formData.qualification} onChange={e => set('qualification', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="e.g. MBBS, MD" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience</label>
                <input type="number" min="0" max="60" value={formData.experience} onChange={e => set('experience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="e.g. 10" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fee (₹)</label>
                <input type="number" min="0" value={formData.consultationFee} onChange={e => set('consultationFee', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                  placeholder="e.g. 500" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating profile...</> : 'Create Doctor Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already registered? <Link to="/doctor/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
