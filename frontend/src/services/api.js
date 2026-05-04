import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const doctorAPI = {
  getAll: (specialization) => api.get('/doctors', { params: { specialization } }),
  getById: (id) => api.get(`/doctors/${id}`),
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getDoctorAppointments: () => api.get('/appointments/doctor'),
  book: (data) => api.post('/appointments', data),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.patch(`/appointments/${id}`, data),
  updateByDoctor: (id, data) => api.patch(`/appointments/doctor/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export const recordAPI = {
  getAll: () => api.get('/records'),
  upload: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  create: (formData) => api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/records/${id}`),
};

export const prescriptionAPI = {
  getMy: () => api.get('/prescriptions/my'),
  getDoctorPrescriptions: () => api.get('/prescriptions/doctor'),
  create: (data) => api.post('/prescriptions', data),
};

export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getForDoctor: (doctorId) => api.get(`/feedback/doctor/${doctorId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getAppointments: () => api.get('/admin/appointments'),
};

export default api;
