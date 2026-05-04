import { useState, useEffect } from 'react';
import { prescriptionAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionAPI.getMy()
      .then(res => setPrescriptions(res.data))
      .catch(() => toast.error('Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">💊 My Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-5xl mb-4">💊</p>
          <p className="text-gray-500">No prescriptions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(p => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-800">{p.doctorId?.name}</p>
                  <p className="text-sm text-gray-500">{p.doctorId?.specialization}</p>
                </div>
                <span className="text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>

              {p.medications?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Medications:</p>
                  <div className="space-y-2">
                    {p.medications.map((med, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm">
                        <span className="font-medium text-blue-800">{med.name}</span>
                        {med.dosage && <span className="text-gray-600"> — {med.dosage}</span>}
                        {med.duration && <span className="text-gray-500"> for {med.duration}</span>}
                        {med.instructions && <p className="text-gray-500 mt-1">{med.instructions}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {p.notes && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <span className="font-medium">Notes: </span>{p.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
