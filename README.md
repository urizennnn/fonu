
# Fonu API

Fonu is a RESTful API built with NestJS, MikroORM (MySQL), and JWT-based authentication. It provides user and task management with robust error handling, transactional operations, and contextual logging using Winston.

## Features

- **User Management:** Create and login users.
- **Task Management:** Create, list (with optional status filter), update, and delete tasks.
- **Authentication:** Secure endpoints with JWT.
- **Transactional Operations:** All create, update, and delete operations roll back on failure.
- **Logging:** Detailed request logging using Winston.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com)
- **ORM:** [MikroORM](https://mikro-orm.io) with MySQL
- **Authentication:** JWT (with Passport)
- **Logging:** Winston

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/urizennnn/fonu.git
   cd fonu
   ```

2. **Install dependencies:**

   ```bash
   yarn
   ```

## Configuration

Create a `.env` file in the project root with your settings:

```env
PORT=3000
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
JWT_REFRESH_EXPIRES_IN=7d
LOG_LEVEL=debug
```

## Running the Application

- **Development:**

  ```bash
  npm run start:dev
  ```

- **Production:**

  ```bash
  npm run build
  npm run start:prod
  ```

## API Endpoints

All endpoints are prefixed with `/api`.

### User Endpoints

- **POST /api/user/create**

  **Request Body (UserDto):**

  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword",
    "fullName": "John Doe"
  }
  ```

  **Response:** Returns the created user object and JWT tokens.

- **POST /api/user/login**

  **Request Body (LoginDto):**

  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```

  **Response:** Returns the authenticated user and JWT tokens.

### Task Endpoints (Protected)

*These routes require a valid JWT in the `Authorization: Bearer <token>` header.*

- **POST /api/tasks**

  **Request Body (CreateTaskDto):**

  ```json
  {
    "description": "Task description",
    "status": "active" // or "completed"
  }
  ```

  **Response:** Returns the created task object.

- **GET /api/tasks/list/?filter={argument}**

  **URL Parameter:**  
  `filter` can be `"active"`, `"completed"`, or omitted  to return all tasks.

  **Response:** Returns an array of tasks (filtered if a status is provided).

- **PATCH /api/tasks/:id**

  **Request Body:**

  ```json
  {
    "description": "Updated description",
    "status": "completed" // or "active"
  }
  ```

  **Response:** Returns the updated task.

- **DELETE /api/tasks/delete/:id**

  **Response:** Returns the deleted task object.

## Data Models

- **User:**
  - `id` (UUID)
  - `fullName`
  - `email`
  - `password`
  - `tasks` (One-to-many relationship with Task)

- **Task:**
  - `id` (UUID)
  - `description`
  - `status` (Enum: `active` or `completed`)
  - `createdAt`
  - `updatedAt`
  - `user` (Many-to-one relation to User)

## Authentication

- Users are authenticated using JWT.  
- Protected routes require an `Authorization` header with a bearer token.
- The JWTService handles token signing, verification, and refresh logic.

## Logging & Error Handling

- **Logging:** Uses Winston for structured logging via the AppLogger and FonuMiddlewareLogger.
- **Error Handling:** All service methods throw appropriate NestJS HTTP exceptions (e.g., `BadRequestException`, `InternalServerErrorException`) and use transactions to roll back any partial changes if an operation fails.

