import express from 'express';
import Feedback from '../models/Feedback.js';
import Doctor from '../models/Doctor.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Patient submits feedback
router.post('/', authenticate, authorizeRole('patient'), async (req, res) => {
  try {
    const existing = await Feedback.findOne({ patientId: req.user.userId, appointmentId: req.body.appointmentId });
    if (existing) return res.status(400).json({ message: 'Feedback already submitted for this appointment' });
    const feedback = await Feedback.create({ ...req.body, patientId: req.user.userId });

    // Update doctor average rating
    const allFeedback = await Feedback.find({ doctorId: req.body.doctorId });
    const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
    await Doctor.findByIdAndUpdate(req.body.doctorId, { rating: avg.toFixed(1) });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
