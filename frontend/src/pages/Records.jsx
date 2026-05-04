import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { recordAPI } from '../services/api';

const CATEGORIES = ['prescription', 'lab-report', 'scan', 'other'];
const CAT_ICONS = { prescription: '💊', 'lab-report': '🧪', scan: '🩻', other: '📄' };
const CAT_COLORS = { prescription: 'bg-blue-50 border-blue-200', 'lab-report': 'bg-green-50 border-green-200', scan: 'bg-purple-50 border-purple-200', other: 'bg-gray-50 border-gray-200' };

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'other' });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await recordAPI.getAll();
      setRecords(data);
    } catch { toast.error('Failed to load records'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    if (file) fd.append('file', file);
    try {
      await recordAPI.create(fd);
      toast.success('Record uploaded!');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'other' });
      setFile(null);
      fetchRecords();
    } catch { toast.error('Failed to upload record'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await recordAPI.delete(id);
      toast.success('Record deleted');
      fetchRecords();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 mt-1">{records.length} record{records.length !== 1 ? 's' : ''} stored securely</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${showForm ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {showForm ? '✕ Cancel' : '+ Upload Record'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Upload New Record</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="e.g. Blood Test Report" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                rows={2} placeholder="Optional notes about this record..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <div className="text-3xl mb-2">📎</div>
              <p className="text-gray-600 text-sm mb-2">Drag & drop a file here, or</p>
              <label className="cursor-pointer text-blue-600 font-semibold text-sm hover:underline">
                Browse files
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} />
              </label>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
              {file && <p className="mt-2 text-sm text-green-600 font-medium">✓ {file.name}</p>}
            </div>

            <button type="submit" disabled={submitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center gap-2">
              {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Uploading...</> : '↑ Upload Record'}
            </button>
          </form>
        </div>
      )}

      {/* Records Grid */}
      {records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg font-medium">No records yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload your first medical record above</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map(r => (
            <div key={r._id} className={`rounded-2xl border p-5 ${CAT_COLORS[r.category] || CAT_COLORS.other} hover:shadow-md transition-all`}>
              <div className="flex justify-between items-start mb-3">
                <div className="text-3xl">{CAT_ICONS[r.category] || '📄'}</div>
                <button onClick={() => handleDelete(r._id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors text-sm">
                  🗑️
                </button>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
              <span className="inline-block text-xs font-medium text-gray-600 bg-white/70 px-2 py-0.5 rounded-lg capitalize mb-2">
                {r.category?.replace('-', ' ')}
              </span>
              {r.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.description}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/50">
                <p className="text-xs text-gray-500">{new Date(r.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {r.fileURL && (
                  <a href={`http://localhost:5000${r.fileURL}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    View ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
