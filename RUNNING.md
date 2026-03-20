# How to Run CodeFlow Locally
CodeFlow consists of two parts: a **Backend** executer (Node.js/C++) and a **Frontend** interface (React). You need to run both concurrently.

## Prerequisites
- Node.js (v18 or higher) installed.
- npm installed.

## Step 1: Start the Backend
The backend handles the C++ execution logic.

1. Open a terminal.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npx ts-node src/server.ts
   ```
   *You should see: "Server running on http://localhost:3000"*

## Step 2: Start the Frontend
The frontend runs the React application.

1. Open a **new** terminal.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *You should see: "Local: http://localhost:5173/" (or similar port)*

## Step 3: Use the App
1. Open your browser and go to the link shown in the frontend terminal (usually `http://localhost:5173`).
2. Click "Start Visualizing".
3. Write C++ code or use the default example.
4. Click "Run" to visualize!

## Troubleshooting
- **Port in Use**: If `npm run dev` says port 5173 is in use, it will automatically try 5174. Check the terminal output for the correct URL.
- **Connection Error**: If you see a red "Connection Error" toast, ensure the **Backend** terminal is still running and hasn't crashed.
