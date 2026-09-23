# 💼 JobTrack — Minimalist Job Application Tracker & Analytics

<p align="center">
  <strong>A high-performance fullstack job application tracker and analytics dashboard built with React 19, Bun, SQLite, and Argon2id Security.</strong>
</p>

---

## 🌟 Overview

**JobTrack** is an executive-grade, privacy-first web application designed to help software engineers, product managers, and professionals manage their job hunt pipeline effectively. 

It provides real-time conversion metrics (*Total Applications, Active Pipeline, Offers Received, Win Rate %, Response Rate %*), dual view interfaces (Kanban Board & High-Density Data Table), an interactive Interview Prep & Checklist Master, and an industrial-grade security layer using **Argon2id Memory Hashing**.

---

## ✨ Key Features

- 🛡️ **Industrial-Grade Security (Argon2id + JWT)**: Passwords are protected using `Bun.password.hash` with **Argon2id** (the gold standard in modern cryptography), paired with token-based session authorization and user data isolation.
- 🗄️ **Native SQLite Persistence (`bun:sqlite`)**: High-performance local database engine storing user applications and timeline logs in `jobtrack.db`.
- 📊 **Executive Analytics & Funnel Breakdown**: Interactive metric cards with live conversion rate calculations and visual status progress bars.
- 🔀 **Dual View Interface**:
  - **Kanban Board**: Drag-and-drop status columns (`Wishlist`, `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`) with quick status changers and company avatar cards.
  - **Data Table**: High-density table with instant search filter, work type filters, and salary sorting.
- 📋 **Interview Prep & Checklist Master**: Full CRUD checklist tool for HR interviews, technical questions, and key questions to ask interviewers.
- 🎨 **Solid Color Minimalist UI**: Clean, non-distracting design system with solid color tokens, dark/light mode toggle, and a responsive **Mobile Slide Drawer**.
- ➕ **Floating Action Button (FAB)**: Quick add trigger floating button in the bottom right corner.
- 🎉 **Confetti Celebration**: Automated celebration trigger when an application status reaches **Offer**.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Runtime Engine** | [Bun](https://bun.sh/) | Fast JavaScript all-in-one toolkit & package manager |
| **Frontend Framework** | React 19 + Vite 6 | High-speed component UI bundler |
| **Database** | `bun:sqlite` (SQLite 3) | Native zero-dependency persistent file database |
| **Security & Auth** | Argon2id (`Bun.password`) | Cryptographic password hashing and session tokens |
| **UI Components** | Lucide React + Canvas Confetti | Minimalist icons & particle celebration effects |
| **Testing** | `bun test` | Built-in high speed unit test runner |

---

## 🚀 Quick Start

### Prerequisite
Ensure [Bun](https://bun.sh/) (v1.0+) is installed on your machine.

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/muhnazih029/JobTrack.git
cd JobTrack
bun install
```

### 2. Start Backend API Server
Start the Bun REST API server listening on `http://127.0.0.1:3001`:
```bash
bun server.js
```

### 3. Start Frontend Dev Server
In a separate terminal, launch the Vite dev server:
```bash
bun dev
```

Open your browser at **`http://localhost:3000/`**.

---

## 🧪 Automated Unit Testing

JobTrack includes an automated unit test suite covering authentication, Argon2id hashing, authorization headers, and REST API endpoints:

```bash
bun test
```

### Example Test Suite Output:
```text
server.test.js:
✓ GET /api/health - status OK, SQLite & Argon2id info
✓ POST /api/auth/register - user registration with Argon2id hashing
✓ POST /api/auth/login - password verification & token issuance
✓ POST /api/auth/login - rejects invalid credentials
✓ GET /api/auth/me - verifies authenticated session
✓ GET /api/jobs - fetches user-isolated applications
✓ POST /api/jobs - creates new job application

 7 pass, 0 fail (393ms)
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
