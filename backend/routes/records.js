import express from 'express';
import multer from 'multer';
import Record from '../models/Record.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.user.userId }).sort({ uploadDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
});

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const record = new Record({
      patientId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      fileURL: req.file ? `/uploads/${req.file.filename}` : null,
      fileType: req.file?.mimetype
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload record', error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({
      _id: req.params.id,
      patientId: req.user.userId
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete record', error: error.message });
  }
});

export default router;
