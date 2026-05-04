import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, prescriptionAPI } from '../services/api';

const statusStyle = (s) =>
  s === 'scheduled' ? 'bg-amber-100 text-amber-700' :
  s === 'completed' ? 'bg-green-100 text-green-700' :
  s === 'ongoing' ? 'bg-blue-100 text-blue-700' :
  'bg-red-100 text-red-700';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  // Prescription modal state
  const [prescModal, setPrescModal] = useState(null); // appointment object
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '', instructions: '' }]);
  const [prescNotes, setPrescNotes] = useState('');
  const [prescLoading, setPrescLoading] = useState(false);

  // Reschedule modal state
  const [reschedModal, setReschedModal] = useState(null); // appointment object
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reschedLoading, setReschedLoading] = useState(false);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await appointmentAPI.getDoctorAppointments();
      setAppointments(data);
    } catch { toast.error('Failed to fetch appointments'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await appointmentAPI.updateByDoctor(id, { status });
      toast.success(`Marked as ${status}`);
      fetchAppointments();
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(null); }
  };

  // --- Prescription ---
  const openPrescModal = (apt) => {
    setPrescModal(apt);
    setMedications([{ name: '', dosage: '', duration: '', instructions: '' }]);
    setPrescNotes('');
  };

  const addMedRow = () => setMedications(prev => [...prev, { name: '', dosage: '', duration: '', instructions: '' }]);
  const removeMedRow = (i) => setMedications(prev => prev.filter((_, idx) => idx !== i));
  const updateMed = (i, field, val) => setMedications(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const submitPrescription = async () => {
    if (!medications[0].name) return toast.error('Add at least one medication');
    setPrescLoading(true);
    try {
      await prescriptionAPI.create({
        appointmentId: prescModal._id,
        patientId: prescModal.patientId._id,
        medications: medications.filter(m => m.name),
        notes: prescNotes
      });
      toast.success('Prescription sent to patient!');
      setPrescModal(null);
    } catch { toast.error('Failed to send prescription'); }
    finally { setPrescLoading(false); }
  };

  // --- Reschedule ---
  const openReschedModal = (apt) => {
    setReschedModal(apt);
    setNewDate(new Date(apt.date).toISOString().split('T')[0]);
    setNewTime(apt.time);
  };

  const submitReschedule = async () => {
    if (!newDate || !newTime) return toast.error('Select date and time');
    setReschedLoading(true);
    try {
      await appointmentAPI.updateByDoctor(reschedModal._id, { date: newDate, time: newTime });
      toast.success('Appointment rescheduled! Patient notified.');
      setReschedModal(null);
      fetchAppointments();
    } catch { toast.error('Failed to reschedule'); }
    finally { setReschedLoading(false); }
  };

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    ongoing: appointments.filter(a => a.status === 'ongoing').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const today = appointments.filter(a => {
    const d = new Date(a.date);
    return d.toDateString() === new Date().toDateString() && a.status === 'scheduled';
  });

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
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-sm">👨‍⚕️</div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dr. {user?.name}</h1>
          <p className="text-gray-500">Manage your appointments and patients</p>
        </div>
      </div>

      {/* Today Alert */}
      {today.length > 0 && (
        <div className="bg-blue-600 text-white rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="font-bold">You have {today.length} appointment{today.length > 1 ? 's' : ''} today</p>
            <p className="text-blue-200 text-sm">Stay on top of your schedule</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, icon: '📊', color: 'bg-gray-50 border-gray-200', text: 'text-gray-800' },
          { label: 'Scheduled', value: stats.scheduled, icon: '⏰', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
          { label: 'Ongoing', value: stats.ongoing, icon: '🟢', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: 'bg-green-50 border-green-200', text: 'text-green-700' },
          { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: 'bg-red-50 border-red-200', text: 'text-red-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} border rounded-2xl p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.text}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {['all', 'scheduled', 'ongoing', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f} {f !== 'all' && <span className="ml-1 text-xs">({stats[f]})</span>}
          </button>
        ))}
      </div>

      {/* Appointments */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 text-lg font-medium">No {filter !== 'all' ? filter : ''} appointments</p>
          </div>
        ) : filtered.map(apt => (
          <div key={apt._id} className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all ${apt.status === 'ongoing' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">
                  {apt.patientId?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{apt.patientId?.name || 'Unknown Patient'}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyle(apt.status)}`}>{apt.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                    <span>📅 {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>🕐 {apt.time}</span>
                    {apt.patientId?.phone && <span>📞 {apt.patientId.phone}</span>}
                    {apt.patientId?.email && <span>✉️ {apt.patientId.email}</span>}
                  </div>
                  {apt.reason && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                      💬 {apt.reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap flex-shrink-0">
                {apt.status === 'scheduled' && (
                  <>
                    {/* Ongoing Meeting */}
                    <button onClick={() => updateStatus(apt._id, 'ongoing')}
                      disabled={updating === apt._id + 'ongoing'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1">
                      🟢 Start Meeting
                    </button>

                    {/* Reschedule */}
                    <button onClick={() => openReschedModal(apt)}
                      className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-all">
                      📅 Reschedule
                    </button>

                    {/* Write Prescription */}
                    <button onClick={() => openPrescModal(apt)}
                      className="px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl text-sm font-semibold hover:bg-teal-100 transition-all">
                      💊 Prescription
                    </button>

                    {/* Complete */}
                    <button onClick={() => updateStatus(apt._id, 'completed')}
                      disabled={updating === apt._id + 'completed'}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-sm">
                      {updating === apt._id + 'completed' ? '...' : '✓ Complete'}
                    </button>

                    {/* Cancel */}
                    <button onClick={() => updateStatus(apt._id, 'cancelled')}
                      disabled={updating === apt._id + 'cancelled'}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">
                      {updating === apt._id + 'cancelled' ? '...' : '✕ Cancel'}
                    </button>
                  </>
                )}

                {apt.status === 'ongoing' && (
                  <>
                    {/* Write Prescription during meeting */}
                    <button onClick={() => openPrescModal(apt)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all shadow-sm">
                      💊 Write Prescription
                    </button>

                    {/* End Meeting */}
                    <button onClick={() => updateStatus(apt._id, 'completed')}
                      disabled={updating === apt._id + 'completed'}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-sm">
                      {updating === apt._id + 'completed' ? '...' : '✓ End & Complete'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== PRESCRIPTION MODAL ===== */}
      {prescModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">💊 Write Prescription</h2>
                <p className="text-sm text-gray-500 mt-1">Patient: {prescModal.patientId?.name}</p>
              </div>
              <button onClick={() => setPrescModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-semibold text-gray-700">Medications</label>
                  <button onClick={addMedRow} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Medicine</button>
                </div>
                <div className="space-y-3">
                  {medications.map((med, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex gap-2">
                        <input
                          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Medicine name *"
                          value={med.name}
                          onChange={e => updateMed(i, 'name', e.target.value)}
                        />
                        <input
                          className="w-32 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={e => updateMed(i, 'dosage', e.target.value)}
                        />
                        <input
                          className="w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="Duration"
                          value={med.duration}
                          onChange={e => updateMed(i, 'duration', e.target.value)}
                        />
                        {medications.length > 1 && (
                          <button onClick={() => removeMedRow(i)} className="text-red-400 hover:text-red-600 px-2 text-lg">×</button>
                        )}
                      </div>
                      <input
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Instructions (e.g. Take after meals)"
                        value={med.instructions}
                        onChange={e => updateMed(i, 'instructions', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-2">Doctor's Notes</label>
                <textarea
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  rows={3}
                  placeholder="Additional notes or advice for the patient..."
                  value={prescNotes}
                  onChange={e => setPrescNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setPrescModal(null)} className="px-5 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={submitPrescription} disabled={prescLoading}
                className="px-6 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all disabled:opacity-60">
                {prescLoading ? 'Sending...' : '💊 Send Prescription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESCHEDULE MODAL ===== */}
      {reschedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">📅 Reschedule Appointment</h2>
                <p className="text-sm text-gray-500 mt-1">Patient: {reschedModal.patientId?.name}</p>
              </div>
              <button onClick={() => setReschedModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                📢 Patient will be notified automatically when you reschedule.
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Date & Time</label>
                <p className="text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                  {new Date(reschedModal.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {reschedModal.time}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Date *</label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setNewDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Time *</label>
                <input
                  type="time"
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setReschedModal(null)} className="px-5 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>
              <button onClick={submitReschedule} disabled={reschedLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-60">
                {reschedLoading ? 'Rescheduling...' : '📅 Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
