import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    { icon: '📋', title: 'Digital Records', desc: 'Store and access your medical records securely anytime, anywhere.', color: 'bg-blue-50 border-blue-200' },
    { icon: '👨‍⚕️', title: 'Expert Doctors', desc: 'Find specialists across 6+ specializations with verified credentials.', color: 'bg-green-50 border-green-200' },
    { icon: '📅', title: 'Easy Booking', desc: 'Book appointments in seconds with real-time slot availability.', color: 'bg-purple-50 border-purple-200' },
    { icon: '🔔', title: 'Smart Reminders', desc: 'Never miss an appointment with automated notifications.', color: 'bg-orange-50 border-orange-200' },
    { icon: '💊', title: 'Prescriptions', desc: 'Access your prescriptions digitally from anywhere.', color: 'bg-pink-50 border-pink-200' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and protected at all times.', color: 'bg-cyan-50 border-cyan-200' },
  ];

  const stats = [
    { value: '12+', label: 'Expert Doctors' },
    { value: '6', label: 'Specializations' },
    { value: '24/7', label: 'Access' },
    { value: '100%', label: 'Secure' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-8 text-sm font-medium">
            <span>🏥</span> Trusted Healthcare Management Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Your Health,<br />
            <span className="text-cyan-200">Simplified.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Book appointments, manage records, and connect with top doctors — all in one place.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform">
                Get Started Free →
              </Link>
              <Link to="/login" className="bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/25 transition-all border border-white/30">
                Patient Login
              </Link>
            </div>
          ) : (
            <Link to={user.role === 'doctor' ? '/doctor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all shadow-xl">
              Go to Dashboard →
            </Link>
          )}

          {!user && (
            <div className="mt-6 flex gap-4 justify-center text-sm text-blue-200">
              <Link to="/doctor/login" className="hover:text-white transition-colors">Doctor Login</Link>
              <span>·</span>
              <Link to="/doctor/register" className="hover:text-white transition-colors">Doctor Sign Up</Link>
              <span>·</span>
              <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40Z" fill="rgb(239,246,255)" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold text-blue-700">{s.value}</div>
              <div className="text-gray-500 mt-1 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Everything You Need</h2>
          <p className="text-gray-500 text-lg">A complete healthcare management experience</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${f.color} hover:shadow-lg transition-all hover:-translate-y-1 transform`}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16 text-center text-white mx-6 mb-16 rounded-3xl max-w-5xl md:mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of patients managing their healthcare with MediAssist.</p>
          <Link to="/register" className="bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
            Create Free Account →
          </Link>
        </div>
      )}
    </div>
  );
}
