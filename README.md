# University Research Opportunity Portal

A complete, full-stack web application designed for university faculty members to post, view, update, and manage research openings in one centralized platform, replacing scattered noticeboards, WhatsApp groups, and emails.

Developed for **FAST-NUCES Peshawar Campus** · **BS (CS 5B)** · **Computer Networks — Assignment #1**.

🔗 **GitHub Repository:** [https://github.com/mohsinamin1/Research-Opportunity-Portal](https://github.com/mohsinamin1/Research-Opportunity-Portal)

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Research Opportunity Fields](#research-opportunity-fields)
4. [Quick Setup & Run Guide](#quick-setup--run-guide)
5. [REST API Documentation](#rest-api-documentation)
6. [Postman Testing Guide](#postman-testing-guide)
7. [Submission Details](#submission-details)

---

## Tech Stack

- **Backend:** Node.js, Express.js, `mysql2` driver, `cors`, `dotenv`
- **Frontend:** React.js, Vite, Custom CSS (Responsive Design)
- **Database:** MySQL
- **API Testing:** Postman Collection (`v2.1`)
- **Version Control:** Git & GitHub

---

## Project Structure

```text
research-opportunity-portal/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── opportunities.js   # CRUD routes for opportunities
│   │   ├── db.js                  # MySQL database pool connection
│   │   ├── server.js              # Express app and middleware
│   │   └── validation.js          # Request payload validators
│   ├── .env.example               # Template for backend environment variables
│   └── package.json
├── database/
│   └── schema.sql                 # SQL script creating database and table
├── frontend/
│   ├── src/
│   │   ├── api.js                 # Frontend API client (fetch functions)
│   │   ├── App.jsx                # Main React UI component
│   │   ├── main.jsx               # React DOM entry point
│   │   └── styles.css             # Interface styling and responsive layout
│   ├── index.html
│   └── package.json
├── postman/
│   └── Research-Opportunity-Portal.postman_collection.json # Exported tests
├── package.json                   # Root workspace configuration
└── README.md
```

---

## Research Opportunity Fields

Every opportunity record in the database consists of all **10 required attributes**:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| **Unique ID** (`id`) | INT (Auto Increment) | Primary key generated automatically |
| **Research Title** (`title`) | VARCHAR(255) | Title of the research topic |
| **Research Description** (`description`) | TEXT | Detailed explanation of research work |
| **Research Area** (`research_area`) | VARCHAR(150) | Domain (e.g., AI, Computer Networks) |
| **Faculty Member** (`faculty_name`) | VARCHAR(150) | Name of the supervising faculty member |
| **Department** (`department`) | VARCHAR(150) | Department (e.g., Computer Science, EE) |
| **Required Skills** (`required_skills`) | TEXT | Prerequisites (e.g., Python, Linux) |
| **Available Positions** (`available_positions`) | INT | Number of open seats (must be $\ge 1$) |
| **Application Deadline** (`application_deadline`) | DATE | Deadline for submitting applications |
| **Status** (`status`) | ENUM | Either `'Open'` or `'Closed'` |

---

## Quick Setup & Run Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer)
- [XAMPP](https://www.apachefriends.org/) or [MySQL Server](https://dev.mysql.com/downloads/mysql/)

---

### Step 1: Database Setup

Make sure your MySQL server is running (e.g. click **Start** on MySQL in the XAMPP Control Panel).

#### Option A: Using phpMyAdmin (Browser GUI - Easiest)
1. Open your browser and go to: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Click the **SQL** tab at the top.
3. Open [`database/schema.sql`](./database/schema.sql), copy its contents, paste them into the box, and click **Go**.

#### Option B: Using Command Prompt / PowerShell
Run this command from your terminal:
```bash
mysql -u root < "D:\research opportunity portal\database\schema.sql"
```
*(If your MySQL user requires a password, add `-p` at the end).*

---

### Step 2: Environment Configuration

Create a file named `.env` inside the `backend` folder (or copy from `backend/.env.example`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=research_portal
```
> **Note for XAMPP users:** Leave `DB_PASSWORD=` blank because the default XAMPP MySQL root account has no password.

---

### Step 3: Install Dependencies & Run

Open your terminal in the root directory (`d:\research opportunity portal`) and run:

1. **Install dependencies:**
   ```bash
   npm install
   npm run install:all
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

Both servers will start together:
- **Frontend Web Portal:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **POST** | `/opportunities` | Create a new research opportunity | `201 Created`, `400 Bad Request` |
| **GET** | `/opportunities` | Retrieve all research opportunities | `200 OK`, `500 Server Error` |
| **GET** | `/opportunities/:id` | Retrieve one opportunity by its unique ID | `200 OK`, `404 Not Found` |
| **PUT** | `/opportunities/:id` | Update an existing opportunity's details | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/opportunities/:id` | Delete an opportunity from the database | `200 OK`, `404 Not Found` |

### Sample JSON Payload (for POST / PUT)
```json
{
  "title": "Artificial Intelligence in Healthcare",
  "description": "Investigating responsible machine learning models for early clinical diagnosis.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Ayesha Khan",
  "department": "Computer Science",
  "required_skills": "Python, PyTorch, Data Analysis",
  "available_positions": 2,
  "application_deadline": "2026-12-15",
  "status": "Open"
}
```

---

## Postman Testing Guide

The complete testing suite is exported in:
[`postman/Research-Opportunity-Portal.postman_collection.json`](./postman/Research-Opportunity-Portal.postman_collection.json)

### How to Import and Test:
1. Open the **Postman** desktop app.
2. Click **Import** (top-left) and select `Research-Opportunity-Portal.postman_collection.json`.
3. Run the requests in this order:

| Step | Request Name | Purpose & Expected Result |
| :---: | :--- | :--- |
| **1** | `Create opportunity 1` | Creates 1st opportunity (`201 Created`). Note down its `id`. |
| **2** | `Create opportunity 2` | Creates 2nd opportunity (`201 Created`). |
| **3** | `Create opportunity 3` | Creates 3rd opportunity (`201 Created`). |
| **4** | `Get all opportunities` | Retrieves all records from MySQL (`200 OK`). |
| **5** | `Get one opportunity` | Retrieves single record by `id` (`200 OK`). |
| **6** | `Update opportunity` | Modifies fields of an opportunity (`200 OK`). |
| **7** | `Close opportunity` | Updates status from `Open` to `Closed` (`200 OK`). |
| **8** | `Delete opportunity` | Deletes the specified opportunity (`200 OK`). |
| **9** | `Get deleted opportunity (404)` | Requests the deleted ID again (`404 Not Found`). |
| **10** | `Invalid request (400)` | Sends payload with missing fields (`400 Bad Request`). |

---

## Submission Details

- **Course:** Computer Networks (CN)
- **Assignment:** Assignment #01 — University Research Opportunity Portal
- **Class:** BS (CS 5B) — Fall 2026
- **Repository URL:** [https://github.com/mohsinamin1/Research-Opportunity-Portal](https://github.com/mohsinamin1/Research-Opportunity-Portal)
- **Demonstration Video:** 1-minute video demonstrating frontend CRUD, database persistence, and Postman API responses.
- **Submission ZIP Format:** `P24<RollNo>_<Name>_BSCS5B.zip`
