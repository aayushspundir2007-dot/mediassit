import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get appointments for patients
router.get('/', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.userId })
      .populate('doctorId')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Get appointments for doctors
router.get('/doctor', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctors only.' });
    }
    
    // Find doctor profile linked to this user
    const Doctor = (await import('../models/Doctor.js')).default;
    const doctorProfile = await Doctor.findOne({ userId: req.user.userId });
    
    if (!doctorProfile) {
      return res.json([]);
    }
    
    const appointments = await Appointment.find({ doctorId: doctorProfile._id })
      .populate('patientId', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Update appointment status (for doctors)
router.patch('/doctor/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctors only.' });
    }

    const Doctor = (await import('../models/Doctor.js')).default;
    const Notification = (await import('../models/Notification.js')).default;
    const doctorProfile = await Doctor.findOne({ userId: req.user.userId });

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const updateFields = {};
    if (req.body.status) updateFields.status = req.body.status;
    if (req.body.date) updateFields.date = req.body.date;
    if (req.body.time) updateFields.time = req.body.time;
    if (req.body.notes) updateFields.notes = req.body.notes;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctorId: doctorProfile._id },
      updateFields,
      { new: true }
    ).populate('patientId', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send notification to patient
    let notifTitle = '';
    let notifMessage = '';

    if (req.body.status === 'completed') {
      notifTitle = 'Appointment Completed';
      notifMessage = `Your appointment with Dr. ${doctorProfile.name} has been marked as completed.`;
    } else if (req.body.status === 'cancelled') {
      notifTitle = 'Appointment Cancelled';
      notifMessage = `Your appointment with Dr. ${doctorProfile.name} has been cancelled.`;
    } else if (req.body.date || req.body.time) {
      const newDate = new Date(appointment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      notifTitle = 'Appointment Rescheduled';
      notifMessage = `Dr. ${doctorProfile.name} has rescheduled your appointment to ${newDate} at ${appointment.time}.`;
    }

    if (notifTitle) {
      await Notification.create({
        userId: appointment.patientId._id,
        title: notifTitle,
        message: notifMessage,
        type: 'status'
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      patientId: req.user.userId
    });
    await appointment.save();
    const populated = await Appointment.findById(appointment._id).populate('doctorId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.userId },
      req.body,
      { new: true }
    ).populate('doctorId');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      patientId: req.user.userId
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
});

export default router;
