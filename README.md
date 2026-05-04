# MediAssist - Digital Health Record & Appointment Tracker

A full-stack web application for managing medical records and booking doctor appointments.

## Features

- 🔐 Secure authentication with JWT
- 📋 Digital medical record storage
- 👨‍⚕️ Doctor profiles with specializations
- 📅 Appointment booking system
- 🔔 Automated reminders (cron-based)
- 📱 Responsive design with Tailwind CSS

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios, React Router
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediassist
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Create uploads folder:
```bash
mkdir uploads
```

5. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Doctors
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/:id` - Get doctor by ID
- POST `/api/doctors` - Create doctor profile

### Appointments
- GET `/api/appointments` - Get user appointments
- POST `/api/appointments` - Book appointment
- PATCH `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment

### Records
- GET `/api/records` - Get user records
- POST `/api/records` - Upload record
- DELETE `/api/records/:id` - Delete record

## Default Users

Create test accounts via the registration page or use MongoDB to seed data.

## Project Structure

```
mediassist/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── config/          # Database config
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   └── context/     # Auth context
│   └── public/
└── README.md
```

## Future Enhancements

- Twilio/EmailJS integration for SMS/Email reminders
- Video consultation feature
- Prescription management
- Health analytics dashboard
- Multi-language support
