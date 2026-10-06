# Research Opportunity Portal

A simple full-stack CRUD application for managing university research openings. It uses a Node.js/Express REST API, MySQL, and a React frontend.

## Features

- Create, list, view, update, close, and delete research opportunities.
- Required-field and value validation with `400 Bad Request`.
- `404 Not Found` for missing or deleted opportunities.
- React interface with success/error messages and browser form validation.
- Importable Postman collection in [`postman/Research-Opportunity-Portal.postman_collection.json`](./postman/Research-Opportunity-Portal.postman_collection.json).

## Requirements

- Node.js 18 or newer
- MySQL 8 or newer
- npm

## Setup

1. Create the database and table:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. Install all JavaScript dependencies:

   ```bash
   npm install
   npm run install:all
   ```

3. Create `backend/.env` from `backend/.env.example` and set your local MySQL password:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=research_portal
   ```

The frontend uses `http://localhost:5000/api` by default. To point it at another API, create `frontend/.env` from `frontend/.env.example`.

## Run

Run both applications in separate terminals:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

Then open <http://localhost:5173>. The API is available at <http://localhost:5000/api>.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/opportunities` | Create an opportunity |
| GET | `/api/opportunities` | Retrieve all opportunities |
| GET | `/api/opportunities/:id` | Retrieve one opportunity |
| PUT | `/api/opportunities/:id` | Update all opportunity fields |
| DELETE | `/api/opportunities/:id` | Delete an opportunity |

## Postman demonstration

Start the backend, import the collection, and run the requests in this order:

1. Create the three sample opportunities.
2. Copy the first created record's `id` into the `opportunityId` collection variable.
3. Get all, get one, update, and close the opportunity.
4. Delete it and run the 404 request.
5. Run the invalid request to show the 400 validation response.

## Suggested six-commit history

The project can be submitted with these six meaningful commits:

1. `chore: scaffold full-stack project`
2. `feat: add mysql schema and crud api`
3. `feat: add react opportunity management interface`
4. `test: add postman api collection`
5. `docs: add setup and demonstration instructions`
6. `chore: validate production frontend build`

GitHub repository link: https://github.com/mohsinamin1/Research-Opportunity-Portal

Do not commit `backend/.env`, passwords, API keys, or other private credentials.
