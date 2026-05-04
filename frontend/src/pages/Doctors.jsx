import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { doctorAPI } from '../services/api';

const SPECS = ['All', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];
const SPEC_ICONS = { Cardiology: '❤️', Dermatology: '🧴', Neurology: '🧠', Pediatrics: '👶', Orthopedics: '🦴', 'General Medicine': '🩺' };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchDoctors(); }, [filter]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await doctorAPI.getAll(filter === 'All' ? '' : filter);
      setDoctors(data);
    } catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Find a Doctor</h1>
        <p className="text-gray-500">Browse our verified specialists and book an appointment</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or specialization..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" />
      </div>

      {/* Specialization Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {SPECS.map(spec => (
          <button key={spec} onClick={() => setFilter(spec)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === spec ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
            {SPEC_ICONS[spec] && <span className="mr-1">{SPEC_ICONS[spec]}</span>}{spec}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 transform p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {SPEC_ICONS[doctor.specialization] || '👨‍⚕️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{doctor.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">{doctor.specialization}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{doctor.qualification}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-lg font-bold text-gray-800">{doctor.experience}</p>
                    <p className="text-xs text-gray-500">Yrs Exp</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-2">
                    <p className="text-lg font-bold text-yellow-600">⭐ {Number(doctor.rating || 0).toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2">
                    <p className="text-lg font-bold text-green-700">₹{doctor.consultationFee}</p>
                    <p className="text-xs text-gray-500">Fee</p>
                  </div>
                </div>

                {doctor.availableSlots?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">Available Days</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableSlots.slice(0, 4).map((slot, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg font-medium">{slot.day?.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => navigate('/appointments', { state: { doctorId: doctor._id } })}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm shadow-sm">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">No doctors found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
