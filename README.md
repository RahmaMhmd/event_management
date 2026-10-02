# Event Management System
## Overview
Event Management System is a full-stack web application that allows users to create, browse, and register for events. The system also includes an admin dashboard for managing users, categories, and event approvals.
## Features
* User registration and login with JWT authentication
* Browse and search events
* View event details
* Create events
* Event categories
* Event capacity management
* Register and cancel registration for events
* View personal registrations
* Admin dashboard
* Admin user management
* Admin event approval and rejection
* Category management
* Postman API collection included
## Technologies
### Frontend
* Next.js
* React
* Material UI (MUI)
* JavaScript
### Backend
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

## How to Run the Project
### 1. Clone the Repository
bash
git clone https://github.com/RahmaMhmd/event_management.git
cd event_management
### 2. Run the Backend
Open a terminal inside the `backend` folder:

cd backend
npm install
Create a `.env` file inside the `backend` folder and add the required environment variables.
Then start the backend:
bash
npm run dev
The backend runs on:
http://localhost:5000
### 3. Run the Frontend
Open another terminal and go to the `frontend` folder:

cd frontend
npm install
npm run dev
The frontend runs on:
http://localhost:3000

### 4. Database

The project uses MongoDB. Make sure MongoDB is running and the MongoDB connection string is configured in the backend `.env` file.

