# VASTRA 🚀

> **AI-Powered Fashion Shopping Assistant & Personal Stylist for India**  
> Scalable cloud-native architecture built with React, FastAPI, Azure Cloud Services (Azure SQL & Azure Blob Storage), Firebase Authentication, Groq LLM, and Oxylabs Web Scraping.

---

## 📋 Table of Contents
1. [System Architecture](#-system-architecture)
2. [Prerequisites](#-prerequisites)
3. [Environment Configuration](#-environment-configuration)
4. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
   - [Backend Setup](#1-backend-setup-fastapi)
   - [Frontend Setup](#2-frontend-setup-react--vite)
   - [Database Initialization](#3-database-initialization)
5. [Test Login Credentials & RBAC](#-test-login-credentials--rbac)
6. [API Route Reference](#-api-route-reference)

---

## 🏛 System Architecture

- **Frontend**: React 19 + Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend API**: FastAPI (Python 3.10+ / async ASGI), httpx, Pydantic v2.
- **AI & NLP Orchestration**: Groq (`qwen/qwen3.8-27b` vision and LLM) with Indian fashion styling rules.
- **Cloud Storage**: Azure Blob Storage (`azure-storage-blob`) container `vastra-images` for visual searches.
- **Relational Database**: Azure SQL Database configured in strict **Third Normal Form (3NF)** via SQLAlchemy 2.0.
- **Authentication & RBAC**: Firebase Authentication (JWT client session + server token verification via Google OAuth2).
- **Web Scraping & Reviews**: Oxylabs Realtime Scraper API for live Flipkart & Amazon product reviews.

---

## ⚙ Prerequisites

- **Node.js**: v18.0.0 or later
- **Python**: v3.10 or later
- **ODBC Driver**: [Microsoft ODBC Driver 18 for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server) (required for Azure SQL `pyodbc` connections)
- **Git**

---

## 🔐 Environment Configuration

### 1. Backend (`backend/.env`)
Create `backend/.env` (reference `backend/.env.example`):

```dotenv
# AI & Shopping Search Providers
GROQ_API_KEY=gsk_your_groq_api_key_here
SERPAPI_KEY=your_serpapi_key_here

# Firebase Authentication (Backend Token Verification)
FIREBASE_PROJECT_ID=your-firebase-project-id

# Oxylabs Web Scraper API (Flipkart & Amazon Reviews)
OXYLABS_API_KEY=your_oxylabs_api_key

# Azure Blob Storage (Container: vastra-images)
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=your_account_key==;EndpointSuffix=core.windows.net"

# Azure SQL Database (ODBC or SQLAlchemy URL)
AZURE_SQL_CONNECTION_STRING="Driver={ODBC Driver 18 for SQL Server};Server=tcp:your-server.database.windows.net,1433;Database=vastra;Uid=your_username;Pwd=your_password;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
```

### 2. Frontend (`frontend/.env`)
Create `frontend/.env`:

```dotenv
# Backend API Base URL
VITE_API_URL=http://127.0.0.1:8000

# Firebase Client Configuration (Firebase Console -> Project Settings)
VITE_FIREBASE_API_KEY=AIzaSyYourClientApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   - **Windows**:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Interactive API Documentation is available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

---

### 2. Frontend Setup (React + Vite)

1. Open a separate terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend is accessible at: [http://localhost:5173](http://localhost:5173)*

---

### 3. Database Initialization

The relational database tables can be provisioned in either of two ways:

- **Method A: Automatic Lifecycle Deployment (Recommended)**  
  On application startup, FastAPI's `lifespan` handler automatically invokes `Base.metadata.create_all(bind=engine)` from `backend/app/main.py`. As long as `AZURE_SQL_CONNECTION_STRING` points to a reachable instance, all 5 3NF tables are generated automatically.
  
- **Method B: Manual DDL Script Execution**  
  Execute the raw T-SQL migration script in Azure Data Studio, SQL Server Management Studio (SSMS), or sqlcmd:
  ```bash
  sqlcmd -S your-server.database.windows.net -d vastra -U your_username -P your_password -i database/schema.sql
  ```
  Advanced analytical views, procedures, and test transactions can then be initialized using:
  ```bash
  sqlcmd -S your-server.database.windows.net -d vastra -U your_username -P your_password -i database/queries.sql
  ```

---

## 👥 Test Login Credentials & RBAC

Role-Based Access Control (RBAC) is enforced on the FastAPI backend via custom claims (`role`) verified in `app/dependencies/auth.py`.

| Role | Test Email | Password | Access Rights & Verified Endpoints |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@vastra.luxury` | `Password@Admin123` | - Full application access<br>- `GET /wishlist/admin` (Protected Admin Dashboard & user aggregation)<br>- Unrestricted catalog & audit review |
| **Regular User** | `user@vastra.luxury` | `Password@User123` | - AI Stylist Chat (`POST /chat`)<br>- Visual Search (`POST /image-search`)<br>- Personal Wishlist (`GET /wishlist`, `POST /wishlist/add`)<br>- *Access to `/wishlist/admin` returns **HTTP 403 Forbidden*** |

> **Note on Initial Account Creation:**  
> You can register any new account directly via the `/auth` page in the web UI. New registrations default to the `user` role. To promote an account to `admin`, set the Firebase custom user claim using the Firebase Admin SDK:  
> `admin.auth().setCustomUserClaims(uid, { role: 'admin' })`

---

## 📡 API Route Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health check and status verification | Public |
| `POST` | `/chat` | Conversational AI stylist with Indian fashion domain knowledge | Public |
| `POST` | `/image-search` | Uploads photo to Azure Blob Storage (`vastra-images`) and runs Google Lens match | Public |
| `POST` | `/outfit-analysis` | Vision analysis evaluating clothing harmony, balance, and styling suggestions | Public |
| `POST` | `/stylist-vision` | Multi-image wardrobe categorization & gap analysis with Groq vision | Public |
| `POST` | `/product-details` | Enriches product metadata with tailored Indian fashion advice | Public |
| `GET` | `/product-reviews` | Asynchronous Oxylabs scraper for real Flipkart / Amazon customer reviews | Public |
| `GET` | `/wishlist` | Returns authenticated user's saved fashion items | Bearer Token (User/Admin) |
| `POST` | `/wishlist/add` | Saves a product to the user's wishlist | Bearer Token (User/Admin) |
| `GET` | `/wishlist/admin` | Administrative route inspecting all system wishlists | Bearer Token (**Admin Only**) |
