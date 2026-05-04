import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { appointmentAPI, doctorAPI } from '../services/api';

const statusStyle = (s) => s === 'scheduled' ? 'bg-blue-100 text-blue-700' : s === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

export default function Appointments() {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({ doctorId: '', date: '', time: '', reason: '' });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    fetchData();
    if (location.state?.doctorId) {
      setShowForm(true);
      setFormData(f => ({ ...f, doctorId: location.state.doctorId }));
    }
  }, []);

  useEffect(() => {
    if (location.state?.doctorId && doctors.length > 0) {
      const doc = doctors.find(d => d._id === location.state.doctorId);
      if (doc) setSelectedDoctor(doc);
    }
  }, [doctors]);

  const fetchData = async () => {
    try {
      const [apptRes, docRes] = await Promise.all([appointmentAPI.getAll(), doctorAPI.getAll()]);
      setAppointments(apptRes.data);
      setDoctors(docRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleDoctorChange = (doctorId) => {
    const doc = doctors.find(d => d._id === doctorId);
    setSelectedDoctor(doc);
    setFormData(f => ({ ...f, doctorId, date: '', time: '' }));
    setAvailableTimes([]);
  };

  const handleDateChange = (date) => {
    setFormData(f => ({ ...f, date, time: '' }));
    if (selectedDoctor && date) {
      const dayName = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
      const slot = selectedDoctor.availableSlots?.find(s => s.day === dayName);
      setAvailableTimes(slot?.times || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.time) { toast.error('Please select a time slot'); return; }
    setSubmitting(true);
    try {
      await appointmentAPI.create(formData);
      toast.success('Appointment booked successfully!');
      setShowForm(false);
      setFormData({ doctorId: '', date: '', time: '', reason: '' });
      setSelectedDoctor(null);
      setAvailableTimes([]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally { setSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.delete(id);
      toast.success('Appointment cancelled');
      fetchData();
    } catch { toast.error('Failed to cancel'); }
  };

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${showForm ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {showForm ? '✕ Cancel' : '+ Book Appointment'}
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Doctor</label>
              <select value={formData.doctorId} onChange={e => handleDoctorChange(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Choose a doctor...</option>
                {doctors.map(d => (
                  <option key={d._id} value={d._id}>{d.name} — {d.specialization} (₹{d.consultationFee})</option>
                ))}
              </select>
            </div>

            {selectedDoctor && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">👨‍⚕️</div>
                <div>
                  <p className="font-bold text-gray-800">{selectedDoctor.name}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.qualification} · {selectedDoctor.experience} yrs exp</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {selectedDoctor.availableSlots?.map((s, i) => (
                      <span key={i} className="text-xs bg-white text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200">{s.day?.slice(0, 3)}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input type="date" required value={formData.date} onChange={e => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} disabled={!formData.doctorId}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time Slot</label>
                {availableTimes.length > 0 ? (
                  <select value={formData.time} onChange={e => setFormData(f => ({ ...f, time: e.target.value }))} required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                    <option value="">Select time...</option>
                    {availableTimes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-400 text-sm">
                    {formData.date ? 'No slots available for this day' : 'Select a date first'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Visit</label>
              <textarea value={formData.reason} onChange={e => setFormData(f => ({ ...f, reason: e.target.value }))}
                rows={3} placeholder="Describe your symptoms or reason for visit..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
            </div>

            <button type="submit" disabled={submitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center gap-2">
              {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Booking...</> : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {['all', 'scheduled', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f} {f !== 'all' && <span className="ml-1 text-xs">({appointments.filter(a => a.status === f).length})</span>}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.map(apt => (
          <div key={apt._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">👨‍⚕️</div>
                <div>
                  <h3 className="font-bold text-gray-900">{apt.doctorId?.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{apt.doctorId?.specialization}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>📅 {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>🕐 {apt.time}</span>
                  </div>
                  {apt.reason && <p className="text-sm text-gray-600 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg">💬 {apt.reason}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle(apt.status)}`}>{apt.status}</span>
                {apt.status === 'scheduled' && (
                  <button onClick={() => handleCancel(apt._id)}
                    className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium border border-red-200">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-500 text-lg font-medium">No {filter !== 'all' ? filter : ''} appointments</p>
            {filter === 'all' && <p className="text-gray-400 text-sm mt-1">Book your first appointment above</p>}
          </div>
        )}
      </div>
    </div>
  );
}
