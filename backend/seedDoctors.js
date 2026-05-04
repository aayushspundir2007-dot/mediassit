import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import connectDB from './config/db.js';

dotenv.config();

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '555-0101',
    specialization: 'Cardiology',
    experience: 15,
    qualification: 'MD, FACC',
    consultationFee: 150
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '555-0102',
    specialization: 'Neurology',
    experience: 12,
    qualification: 'MD, PhD',
    consultationFee: 180
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '555-0103',
    specialization: 'Pediatrics',
    experience: 10,
    qualification: 'MD, FAAP',
    consultationFee: 120
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '555-0104',
    specialization: 'Orthopedics',
    experience: 18,
    qualification: 'MD, FAAOS',
    consultationFee: 160
  },
  {
    name: 'Dr. Priya Patel',
    email: 'priya.patel@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '555-0105',
    specialization: 'Dermatology',
    experience: 8,
    qualification: 'MD, FAAD',
    consultationFee: 130
  },
  {
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '555-0106',
    specialization: 'General Medicine',
    experience: 20,
    qualification: 'MBBS, MD',
    consultationFee: 100
  }
];

const seedDoctors = async () => {
  try {
    await connectDB();
    
    // Clear existing doctors
    await User.deleteMany({ role: 'doctor' });
    await Doctor.deleteMany({});
    
    console.log('🗑️  Cleared existing doctors');
    
    // Create doctors
    for (const doctorData of doctors) {
      // Create user account
      const user = await User.create(doctorData);
      
      // Create doctor profile
      await Doctor.create({
        userId: user._id,
        name: doctorData.name,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        qualification: doctorData.qualification,
        consultationFee: doctorData.consultationFee,
        availableSlots: [
          { day: 'Monday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Tuesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Wednesday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Thursday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Friday', times: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] }
        ],
        rating: 4.5 + Math.random() * 0.5
      });
      
      console.log(`✅ Created: ${doctorData.name}`);
    }
    
    console.log('\n🎉 Successfully seeded doctors!');
    console.log('📧 Login credentials: email from above, password: doctor123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors();
