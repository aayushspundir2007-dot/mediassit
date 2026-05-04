import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, recordAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [apptRes, recordRes] = await Promise.all([appointmentAPI.getAll(), recordAPI.getAll()]);
      setAppointments(apptRes.data);
      setRecords(recordRes.data);
    } catch { toast.error('Failed to load dashboard data'); }
    finally { setLoading(false); }
  };

  const upcoming = appointments.filter(a => a.status === 'scheduled' && new Date(a.date) >= new Date());
  const completed = appointments.filter(a => a.status === 'completed');
  const cancelled = appointments.filter(a => a.status === 'cancelled');

  const statusColor = (s) => s === 'scheduled' ? 'bg-blue-100 text-blue-700' : s === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your health overview</p>
        </div>
        <Link to="/doctors" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm text-sm">
          + Book Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Appointments', value: appointments.length, icon: '📅', color: 'from-blue-500 to-blue-600', light: 'bg-blue-50' },
          { label: 'Upcoming', value: upcoming.length, icon: '⏰', color: 'from-orange-400 to-orange-500', light: 'bg-orange-50' },
          { label: 'Completed', value: completed.length, icon: '✅', color: 'from-green-500 to-green-600', light: 'bg-green-50' },
          { label: 'Medical Records', value: records.length, icon: '📋', color: 'from-purple-500 to-purple-600', light: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.light} rounded-2xl p-5 border border-white shadow-sm`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map(apt => (
                <div key={apt._id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">👨‍⚕️</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{apt.doctorId?.name}</p>
                    <p className="text-xs text-gray-500">{apt.doctorId?.specialization}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-700">{new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-500">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-500 text-sm">No upcoming appointments</p>
              <Link to="/doctors" className="inline-block mt-3 text-blue-600 text-sm font-medium hover:underline">Book one now →</Link>
            </div>
          )}
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">Recent Records</h2>
            <Link to="/records" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
          </div>
          {records.length > 0 ? (
            <div className="space-y-3">
              {records.slice(0, 4).map(r => (
                <div key={r._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {r.category === 'prescription' ? '💊' : r.category === 'lab-report' ? '🧪' : r.category === 'scan' ? '🩻' : '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{r.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{r.category?.replace('-', ' ')}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">{new Date(r.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500 text-sm">No records uploaded yet</p>
              <Link to="/records" className="inline-block mt-3 text-blue-600 text-sm font-medium hover:underline">Upload now →</Link>
            </div>
          )}
        </div>

        {/* Recent Appointments History */}
        {appointments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Appointment History</h2>
              <Link to="/appointments" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Specialization</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.slice(0, 5).map(apt => (
                    <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-800">{apt.doctorId?.name}</td>
                      <td className="py-3 text-gray-500">{apt.doctorId?.specialization}</td>
                      <td className="py-3 text-gray-600">{new Date(apt.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 text-gray-600">{apt.time}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(apt.status)}`}>{apt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
