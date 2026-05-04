import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getAll();
      setNotifications(res.data);
    } catch {}
  };

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate('/'); };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'doctor') return '/doctor/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link to={to}
      className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${isActive(to) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}>
      {label}
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-blue-600">Medi</span><span className="text-cyan-500">Assist</span>
          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium align-middle">Beta</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              {navLink(getDashboardLink(), '🏠 Dashboard')}
              {user.role === 'patient' && (
                <>
                  {navLink('/doctors', '👨‍⚕️ Doctors')}
                  {navLink('/appointments', '📅 Appointments')}
                  {navLink('/prescriptions', '💊 Prescriptions')}
                  {navLink('/records', '📋 Records')}
                </>
              )}

              {/* Notifications */}
              <div className="relative ml-2" ref={notifRef}>
                <button onClick={() => setShowNotif(!showNotif)}
                  className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{unread}</span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                      <span className="font-semibold text-gray-700 text-sm">Notifications</span>
                      {unread > 0 && <button onClick={markAllRead} className="text-xs text-blue-500 hover:text-blue-700 font-medium">Mark all read</button>}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="text-center text-gray-400 py-8 text-sm">
                          <div className="text-3xl mb-2">🔔</div>
                          No notifications yet
                        </div>
                      ) : notifications.map(n => (
                        <div key={n._id} className={`px-4 py-3 text-sm ${!n.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <p className="font-medium text-gray-800">{n.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-medium hidden lg:block">{user.name}</span>
                <button onClick={handleLogout}
                  className="ml-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">Patient Login</Link>
              <Link to="/doctor/login" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">Doctor Login</Link>
              <Link to="/admin/login" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Admin</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm ml-1">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-100 pt-3 space-y-1 px-2">
          {user ? (
            <>
              <Link to={getDashboardLink()} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Dashboard</Link>
              {user.role === 'patient' && (
                <>
                  <Link to="/doctors" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Doctors</Link>
                  <Link to="/appointments" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Appointments</Link>
                  <Link to="/prescriptions" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Prescriptions</Link>
                  <Link to="/records" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Records</Link>
                </>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Patient Login</Link>
              <Link to="/doctor/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Doctor Login</Link>
              <Link to="/register" className="block px-3 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
