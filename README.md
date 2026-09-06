# EERIS (Early Ecosystem Risk Intelligence System)

**Created by: Pranav Ambre & Harsh Shinde**

EERIS is an enterprise-grade ecosystem monitoring and risk intelligence platform. It provides real-time visibility into complex business ecosystems (such as dealership networks, manufacturing supply chains, and finance networks), actively investigating anomalies and providing actionable, AI-driven insights to operators.

---

## 🚀 How It Works (Architecture & Workflow)

EERIS is built as a highly robust, full-stack application designed for real-time intelligence:

1. **The Ecosystem Engine (Backend):**
   - Built with **Python (FastAPI)**, the backend constantly processes mock real-world transaction data, dealer applications, and network health metrics.
   - It utilizes a **WebSocket** connection to instantly stream "Live Ecosystem Events" (like flagged applications or sudden risk spikes) directly to the frontend in real-time.

2. **The Intelligence Layer (AI Failover System):**
   - EERIS features a built-in AI Assistant accessible from anywhere in the dashboard.
   - **Auto-Failover Architecture:** The backend securely communicates with **Google Gemini (1.5 Flash)** as the primary intelligence engine. If Gemini becomes overloaded or rate-limited, the system automatically and instantly fails over to **Groq (Compound)**. This ensures 100% uptime for critical intelligence gathering.

3. **The Command Center (Frontend):**
   - Built with **React, TypeScript, and Vite**, the UI is designed as functional enterprise software.
   - It visualizes the raw data fed from the backend using modern interactive graphs (React Flow) and charts (Recharts).

---

## 🧭 How to Use the Dashboard

When you open the EERIS platform, you act as a Risk Operator. Here is your workflow:

1. **Dashboard & Ecosystem View:** 
   Start here to get a bird's-eye view of network health. Watch the live event feed in the top right for real-time anomalies. Use the Interactive Graph to map out connections between entities (e.g., seeing how multiple flagged loan applications trace back to a single risky dealership).

2. **Investigations Module:** 
   When the system flags high-risk activity (e.g., synthetic identity fraud or phantom inventory), it is sent to Investigations. Operators can view the evidence, review the automated Risk Score, and take immediate action (Freeze, Reject, Monitor).

3. **EERIS AI Assistant:**
   Click the Chatbot icon in the bottom right corner at any time. You can ask the AI to "Summarize the risk profile for Dealer X" or "Explain the latest anomalies." The AI reads the context and provides rapid, formatted analysis.

---

## 💻 Local Development Setup

If you want to run this project locally on your machine, follow these steps:

### 1. Start the Backend
Open a terminal and navigate to the `backend/` folder:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder and add your AI API keys:
```env
GEMINI_API_KEY="your-gemini-key"
GROK_API_KEY="your-groq-key"
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
Open a new terminal and stay in the root folder:
```bash
npm install
npm run dev
```
Open `http://localhost:5174` in your browser.

---

## ☁️ Deployment Guide

This project is configured for a split-deployment architecture to support real-time WebSockets:

- **Backend (Render):** Deployed as a Web Service. Render automatically reads the `render.yaml` and `requirements.txt` to build the Python environment. WebSockets remain open for live data streaming.
- **Frontend (Vercel):** Deployed as a Vite project. The `vercel.json` ensures SPA routing works correctly. The `VITE_API_URL` environment variable points the frontend directly to the Render backend.
