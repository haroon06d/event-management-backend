# Backend Setup Instruction

This backend is a **Node.js + Express + TypeScript** server with **PostgreSQL** as the database and **Prisma** as the ORM. It handles authentication, event management, and registrations.

---

## 1. Clone the Repo

```bash
git clone https://github.com/haroon06d/event-management-server.git
cd event-management-server
```

## 2. Environment Variables

Create a .env file in the backend folder:
``` bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eventdb?schema=public"
JWT_SECRET="supersecretjwt"
PORT=4000
```
DATABASE_URL – PostgreSQL connection string. Replace username/password/dbname as per your setup.

JWT_SECRET – secret key for JWT authentication.

PORT – keep it 4000, because frontend is hardcoded to this port.
If you change it, also update the API base URL in src/api/api on frontend.

## 3. Install Dependencies

Go to backend folder:
```bash
cd event-management-server
npm install
```

### Dependencies include:

* express – web framework
* cors – to allow frontend requests
* dotenv – load environment variables
* bcrypt – for hashing passwords
* jsonwebtoken – JWT auth
* multer – file uploads
* @prisma/client – database client

### Dev dependencies:

- typescript, ts-node-dev – TS compilation & hot reload
- @types/* – type definitions
- prisma – ORM for DB migrations


## 4. Prisma Setup (Database)

#### Initialize Prisma (if not already):
```bash
npx prisma init
```

The table structure is in prisma/schema.prisma in the backend folder.

#### Run migrations to create tables:
```bash
npx prisma migrate dev --name init
```

#### Generate Prisma client:
```bash
npx prisma generate
```
## 5. Routes Overview

/api/auth → signup / login

/api/events → create, update, delete, list events

/api/registrations → register for events / view registrations

## 6. Running the Backend

#### Make sure dependencies are installed :

```bash 
npm install
```

#### Make sure migrations are run:
```bash
npx prisma migrate dev --name init
```

#### Start the server:
```bash
npm run dev
```

##### Server will run at http://localhost:4000

## 7. Notes

Make sure PostgreSQL is installed and database exists.

Make sure .env exists.

For Uploaded image files go to uploads/ folder.
