# University Research Opportunity Portal

A simple full-stack web portal for university faculty to post and manage student research opportunities.

- **GitHub Repository:** [https://github.com/mohsinamin1/Research-Opportunity-Portal](https://github.com/mohsinamin1/Research-Opportunity-Portal)
- **Course:** Computer Networks (CN) — Assignment #1
- **Campus:** FAST-NUCES Peshawar · BS (CS 5B)

---

## Tech Stack
- **Frontend:** React.js + Vite
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Testing:** Postman

---

## How to Run (3 Steps)

### 1. Database Setup
Start MySQL in XAMPP, open phpMyAdmin (or terminal), and run [`database/schema.sql`](./database/schema.sql):
```bash
mysql -u root < "D:\research opportunity portal\database\schema.sql"
```

### 2. Configure Backend
Create `backend/.env` with your MySQL settings (leave password blank for default XAMPP):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=research_portal
```

### 3. Start Application
From the project root folder, run:
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)

---

## API Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/opportunities` | Create new opportunity | `201 Created` / `400 Bad Request` |
| **GET** | `/api/opportunities` | Retrieve all opportunities | `200 OK` |
| **GET** | `/api/opportunities/:id` | Retrieve single opportunity | `200 OK` / `404 Not Found` |
| **PUT** | `/api/opportunities/:id` | Update opportunity / Close | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/opportunities/:id` | Delete opportunity | `200 OK` / `404 Not Found` |

---

## Postman Testing
The complete test collection is included in:  
📁 [`postman/Research-Opportunity-Portal.postman_collection.json`](./postman/Research-Opportunity-Portal.postman_collection.json)

Import this file into Postman to test all CRUD operations, the `404 Not Found` error, and the `400 Bad Request` validation test.
