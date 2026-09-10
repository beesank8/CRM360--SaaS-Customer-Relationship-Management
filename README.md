# CRM360 — Smart CRM Platform

CRM360 is a full-stack Customer Relationship Management system built with the MERN stack (MongoDB, Express, React, Node.js).

**Repo:** https://github.com/beesank8/CRM360--SaaS-Customer-Relationship-Management

## Features

- Login and authentication
- Dashboard with live revenue tracking
- Customers management
- Leads (with search, filters, and conversion)
- Sales / revenue analytics
- Profile & settings
- Notifications
- Light / Dark / System appearance

## Tech Stack

| Layer    | Stack |
|----------|-------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Recharts |
| Backend  | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Auth     | JWT, bcrypt |

## Requirements

Just two things:

1. **Node.js**
2. **MongoDB** (running locally)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/beesank8/CRM360--SaaS-Customer-Relationship-Management.git
cd CRM360--SaaS-Customer-Relationship-Management
```

### 2. Backend setup

```bash
cd server
npm install
npm start
```

Backend runs at **http://localhost:5000**

The project already includes a working `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crm360
JWT_SECRET=b9579dd60dc3f8e549bce28b72f1f80b8d0d80b5c98c7fc9417b290fff6964916e4c3fd05d145d9a6d2d255f035fea4b80449daf1d4f46f601019d36a6e71c1f
CLIENT_URL=http://localhost:5173
```

No extra configuration needed — just run `npm install && npm start`.

### 3. Frontend setup

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

`client/.env` is already set:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database

Make sure MongoDB is running locally on port `27017`. The `crm360` database and its collections are created automatically the first time the app runs — no manual setup needed.

## Project Structure

```text
CRM360/
├── client/                # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       └── services/
├── server/                 # Node + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .gitignore
└── README.md
```

## API Routes

```text
/api/auth
/api/customers
/api/leads
/api/dashboard
/api/analytics
/api/notifications
/api/settings
```

## Notes for Evaluators

1. Install Node.js and MongoDB.
2. Terminal 1: `cd server && npm install && npm start`
3. Terminal 2: `cd client && npm install && npm run dev`
4. Open `http://localhost:5173`

No `.env` setup needed — the working config is already included above.

## Security Note

The `.env` values above (including `JWT_SECRET`) are development-only credentials meant to make local evaluation easy. If this repo is public, treat that secret as already exposed — don't reuse it for anything beyond this demo, and rotate it before any real deployment.

## Developer

**Sanket**

CRM360 — Smart CRM Platform, built using the MERN stack.
