# My Shangri-La Referendum (MSLR)

## Setup

1. **DB**: Import mslr.sql to MySQL. Update .env in backend.

2. **Backend**:
   cd backend
   npm install
   npm dev

3. **Frontend**:
   cd frontend
   npm install
   npm start

## Features
- Registration with SCC validation and QR scan
- Login for voters/EC
- Dashboards as per spec
- REST API at /mslr
- Security: JWT, hashing
- Responsive with MUI

Run on localhost:3000 (frontend), 5000 (backend)