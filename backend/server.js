import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import recordRoutes from './routes/records.js';
import seedRoutes from './routes/seed.js';
import prescriptionRoutes from './routes/prescriptions.js';
import feedbackRoutes from './routes/feedback.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import Appointment from './models/Appointment.js';
import Notification from './models/Notification.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// CORS - open for all origins (safe for this app)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectDB().then(() => createDefaultAdmin());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', seedRoutes);

// Create default admin account if not exists
async function createDefaultAdmin() {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@mediassist.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default admin created: admin@mediassist.com / admin123');
    }
  } catch (e) {
    console.error('Admin creation error:', e.message);
  }
}

// Reminder cron job - runs daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const upcomingAppointments = await Appointment.find({
      date: { $gte: tomorrow, $lt: dayAfter },
      status: 'scheduled'
    }).populate('patientId doctorId');

    for (const appt of upcomingAppointments) {
      await Notification.create({
        userId: appt.patientId._id,
        title: 'Appointment Reminder',
        message: `You have an appointment tomorrow at ${appt.time}`,
        type: 'reminder'
      });
    }
    console.log(`Sent ${upcomingAppointments.length} reminders`);
  } catch (error) {
    console.error('Reminder cron error:', error);
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'MediAssist API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
