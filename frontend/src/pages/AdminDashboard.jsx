import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);
  useEffect(() => { if (tab === 'users') fetchUsers(); }, [tab, search, roleFilter]);
  useEffect(() => { if (tab === 'appointments') fetchAppointments(); }, [tab]);

  const fetchAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers({ search, role: roleFilter });
      setUsers(res.data);
    } catch { toast.error('Failed to load users'); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await adminAPI.getAppointments();
      setAppointments(res.data);
    } catch { toast.error('Failed to load appointments'); }
  };

  const toggleUser = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id);
      toast.success(res.data.message);
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value ?? '—'}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">MediAssist System Management</p>
          </div>
          <span className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">🛡️ Administrator</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm w-fit">
          {['analytics', 'users', 'appointments'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-medium capitalize transition-all ${tab === t ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {t === 'analytics' ? '📊 Analytics' : t === 'users' ? '👥 Users' : '📅 Appointments'}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div>
            {loading ? <p className="text-center text-gray-400 py-12">Loading...</p> : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard icon="👥" label="Total Users" value={analytics?.totalUsers} color="border-blue-500" />
                  <StatCard icon="👨‍⚕️" label="Doctors" value={analytics?.totalDoctors} color="border-green-500" />
                  <StatCard icon="🧑‍💼" label="Patients" value={analytics?.totalPatients} color="border-cyan-500" />
                  <StatCard icon="📅" label="Appointments" value={analytics?.totalAppointments} color="border-purple-500" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <StatCard icon="🕐" label="Scheduled" value={analytics?.scheduled} color="border-yellow-500" />
                  <StatCard icon="✅" label="Completed" value={analytics?.completed} color="border-green-400" />
                  <StatCard icon="❌" label="Cancelled" value={analytics?.cancelled} color="border-red-400" />
                  <StatCard icon="🆕" label="This Week" value={analytics?.recentAppointments} color="border-indigo-400" />
                </div>

                {analytics?.topDoctors?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Doctors by Appointments</h2>
                    <div className="space-y-3">
                      {analytics.topDoctors.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400">#{i + 1}</span>
                            <div>
                              <p className="font-medium text-gray-700">{d.doctor?.name}</p>
                              <p className="text-sm text-gray-500">{d.doctor?.specialization}</p>
                            </div>
                          </div>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{d.count} appointments</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div className="flex gap-3 mb-6">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name..." className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400" />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400">
                <option value="">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={fetchUsers} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">Search</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">User ID</th>
                    <th className="text-left px-4 py-3">Password Hash</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'doctor' ? 'bg-green-100 text-green-700' : u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded select-all text-gray-600" title={u._id}>
                          {u._id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded select-all" title={u.password}>
                          {u.password ? u.password.substring(0, 20) + '...' : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {u.role !== 'admin' && (
                          <>
                            <button onClick={() => toggleUser(u._id)}
                              className={`px-3 py-1 rounded text-xs font-medium ${u.isActive !== false ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                              {u.isActive !== false ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => deleteUser(u._id)}
                              className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200">
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-gray-400 py-8">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Patient</th>
                  <th className="text-left px-4 py-3">Doctor</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{a.patientId?.name}</td>
                    <td className="px-4 py-3">{a.doctorId?.name || a.doctorId?.userId?.name}</td>
                    <td className="px-4 py-3">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{a.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' : a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-8">No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
