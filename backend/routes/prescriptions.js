import express from 'express';
import Prescription from '../models/Prescription.js';
import Doctor from '../models/Doctor.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Doctor creates prescription
router.post('/', authenticate, authorizeRole('doctor'), async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ userId: req.user.userId });
    if (!doctorProfile) return res.status(404).json({ message: 'Doctor profile not found' });

    const prescription = await Prescription.create({ ...req.body, doctorId: doctorProfile._id });

    // Send notification to patient
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.create({
      userId: req.body.patientId,
      title: '💊 New Prescription',
      message: `Dr. ${doctorProfile.name} has issued you a new prescription. Check your Prescriptions tab.`,
      type: 'general'
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patient views their prescriptions
router.get('/my', authenticate, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user.userId })
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date time')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor views prescriptions they wrote
router.get('/doctor', authenticate, authorizeRole('doctor'), async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ userId: req.user.userId });
    const prescriptions = await Prescription.find({ doctorId: doctorProfile._id })
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
