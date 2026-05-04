# MediAssist - Quick Start Guide

## ✅ Project is Running!

### 🌐 Access URLs
- **Frontend:** http://localhost:3001 ✅ WORKING
- **Backend API:** http://localhost:5000 ✅ WORKING

### ✅ Verified Working Features
- ✅ Doctor login
- ✅ Patient registration
- ✅ API endpoints responding
- ✅ Database connected with 6 doctors seeded

### 👥 Test Accounts

#### Doctors (Login at `/doctor/login`)
All doctors use password: `doctor123`

1. **Dr. Sarah Johnson** - Cardiology
   - Email: sarah.johnson@mediassist.com
   - Fee: $150

2. **Dr. Michael Chen** - Neurology
   - Email: michael.chen@mediassist.com
   - Fee: $180

3. **Dr. Emily Rodriguez** - Pediatrics
   - Email: emily.rodriguez@mediassist.com
   - Fee: $120

4. **Dr. James Wilson** - Orthopedics
   - Email: james.wilson@mediassist.com
   - Fee: $160

5. **Dr. Priya Patel** - Dermatology
   - Email: priya.patel@mediassist.com
   - Fee: $130

6. **Dr. Robert Taylor** - General Medicine
   - Email: robert.taylor@mediassist.com
   - Fee: $100

#### Patients
Create your own account at `/register`

### 🎯 How to Test

1. **Create a Patient Account:**
   - Go to http://localhost:3001/register
   - Fill in your details
   - Login at http://localhost:3001/login

2. **Browse Doctors:**
   - View all available doctors
   - See their specializations, experience, and fees

3. **Book an Appointment:**
   - Select a doctor
   - Choose date and time
   - Add consultation reason
   - Submit booking

4. **Doctor Portal:**
   - Login as a doctor at http://localhost:3001/doctor/login
   - View all appointments
   - Filter by status
   - Mark appointments as complete or cancelled

### 🔧 Technical Details

- **Database:** MongoDB Memory Server (in-memory, persistent)
- **Data Location:** `backend/.mongodb-data/`
- **Backend Port:** 5000
- **Frontend Port:** 3001

### 🛠️ Useful Commands

**Reseed Doctors:**
```bash
curl -Method POST http://localhost:5000/api/seed-doctors
```

**Check API Status:**
```bash
curl http://localhost:5000
```

**View All Doctors:**
```bash
curl http://localhost:5000/api/doctors
```

### 📝 Notes

- The database persists data between restarts
- Both servers auto-reload on code changes
- All passwords are encrypted with bcrypt
- JWT tokens expire after 7 days
