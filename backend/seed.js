import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Doctor from './models/Doctor.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const doctors = [
  // Cardiology
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mediassist.com',
    specialization: 'Cardiology',
    experience: 15,
    qualification: 'MD, DM (Cardiology)',
    consultationFee: 1500,
    rating: 4.8,
    availableSlots: [
      { day: 'Monday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Wednesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Friday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] }
    ]
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@mediassist.com',
    specialization: 'Cardiology',
    experience: 12,
    qualification: 'MD, DM (Cardiology)',
    consultationFee: 1200,
    rating: 4.6,
    availableSlots: [
      { day: 'Tuesday', times: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', times: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Saturday', times: ['09:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  },
  
  // Dermatology
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@mediassist.com',
    specialization: 'Dermatology',
    experience: 10,
    qualification: 'MD, DDV (Dermatology)',
    consultationFee: 1000,
    rating: 4.7,
    availableSlots: [
      { day: 'Monday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', times: ['10:00 AM', '11:00 AM', '12:00 PM'] }
    ]
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@mediassist.com',
    specialization: 'Dermatology',
    experience: 8,
    qualification: 'MD, DDV (Dermatology)',
    consultationFee: 900,
    rating: 4.5,
    availableSlots: [
      { day: 'Tuesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'] },
      { day: 'Thursday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'] },
      { day: 'Saturday', times: ['10:00 AM', '11:00 AM', '12:00 PM'] }
    ]
  },
  
  // Orthopedics
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@mediassist.com',
    specialization: 'Orthopedics',
    experience: 18,
    qualification: 'MS (Orthopedics)',
    consultationFee: 1300,
    rating: 4.9,
    availableSlots: [
      { day: 'Monday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM'] },
      { day: 'Wednesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM'] },
      { day: 'Friday', times: ['09:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@mediassist.com',
    specialization: 'Orthopedics',
    experience: 14,
    qualification: 'MS (Orthopedics)',
    consultationFee: 1100,
    rating: 4.6,
    availableSlots: [
      { day: 'Tuesday', times: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', times: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Saturday', times: ['09:00 AM', '10:00 AM'] }
    ]
  },
  
  // Pediatrics
  {
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@mediassist.com',
    specialization: 'Pediatrics',
    experience: 11,
    qualification: 'MD (Pediatrics)',
    consultationFee: 800,
    rating: 4.8,
    availableSlots: [
      { day: 'Monday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'] }
    ]
  },
  {
    name: 'Dr. Amit Patel',
    email: 'amit.patel@mediassist.com',
    specialization: 'Pediatrics',
    experience: 9,
    qualification: 'MD (Pediatrics)',
    consultationFee: 750,
    rating: 4.7,
    availableSlots: [
      { day: 'Tuesday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Saturday', times: ['09:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  },
  
  // Neurology
  {
    name: 'Dr. Robert Martinez',
    email: 'robert.martinez@mediassist.com',
    specialization: 'Neurology',
    experience: 16,
    qualification: 'MD, DM (Neurology)',
    consultationFee: 1600,
    rating: 4.9,
    availableSlots: [
      { day: 'Monday', times: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', times: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', times: ['10:00 AM', '11:00 AM'] }
    ]
  },
  {
    name: 'Dr. Neha Gupta',
    email: 'neha.gupta@mediassist.com',
    specialization: 'Neurology',
    experience: 13,
    qualification: 'MD, DM (Neurology)',
    consultationFee: 1400,
    rating: 4.7,
    availableSlots: [
      { day: 'Tuesday', times: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Thursday', times: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Saturday', times: ['10:00 AM', '11:00 AM'] }
    ]
  },
  
  // General Medicine
  {
    name: 'Dr. David Thompson',
    email: 'david.thompson@mediassist.com',
    specialization: 'General Medicine',
    experience: 20,
    qualification: 'MBBS, MD (Medicine)',
    consultationFee: 600,
    rating: 4.6,
    availableSlots: [
      { day: 'Monday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Tuesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM'] },
      { day: 'Saturday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'] }
    ]
  },
  {
    name: 'Dr. Anjali Verma',
    email: 'anjali.verma@mediassist.com',
    specialization: 'General Medicine',
    experience: 7,
    qualification: 'MBBS, MD (Medicine)',
    consultationFee: 500,
    rating: 4.5,
    availableSlots: [
      { day: 'Monday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Tuesday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', times: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Saturday', times: ['09:00 AM', '10:00 AM', '11:00 AM'] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Create user accounts for doctors and then create doctor profiles
    for (const doctorData of doctors) {
      // Create user account
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const user = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        password: hashedPassword,
        role: 'doctor'
      });

      // Create doctor profile
      await Doctor.create({
        userId: user._id,
        name: doctorData.name,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        qualification: doctorData.qualification,
        consultationFee: doctorData.consultationFee,
        rating: doctorData.rating,
        availableSlots: doctorData.availableSlots
      });

      console.log(`Created doctor: ${doctorData.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nCreated ${doctors.length} doctors across specializations:`);
    console.log('- Cardiology: 2 doctors');
    console.log('- Dermatology: 2 doctors');
    console.log('- Orthopedics: 2 doctors');
    console.log('- Pediatrics: 2 doctors');
    console.log('- Neurology: 2 doctors');
    console.log('- General Medicine: 2 doctors');
    console.log('\nAll doctor accounts use password: doctor123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
