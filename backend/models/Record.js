import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  fileURL: String,
  fileType: String,
  uploadDate: { type: Date, default: Date.now },
  category: { type: String, enum: ['prescription', 'lab-report', 'scan', 'other'], default: 'other' }
});

export default mongoose.model('Record', recordSchema);
