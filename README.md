# FONU NestJS Application

## Overview
This repository contains a NestJS application implementing a simple user and task management system. It features:
- **JWT Authentication**: Secure login and protected endpoints.
- **User & Task Management**: Users can be created, updated, and deleted, with tasks having many-to-one (each task belongs to one user) and one-to-many (a user can have multiple tasks) relationships.
- **MikroORM Integration**: Using MySQL/MariaDB as the database.
- **Validation & Logging**: Input validation with class-validator and logging with Winston.

## Assumptions
- Environment variables are stored in a `.env` file in the project root.
- The database is MariaDB, accessible via the URL provided in the environment variables.
- Basic error handling and logging have been implemented for key operations.
- JWT tokens are used to protect endpoints that require authentication.

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/urizennnn/fonu 
   cd fonu
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Create a `.env` file in the project root** with the following contents:
   ```env
   PORT=4000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=3600
   ```

4. **Run database migrations:**
   ```bash
    npx mikro-orm migration:create  
    npx mikro-orm migration:up

   ```
   (Ensure you have MikroORM CLI configured or run the equivalent command based on your setup.)

5. **Start the application:**
   ```bash
   yarn start:dev
   ```
   The application will run on `http://localhost:4000` by default.

## Endpoints

### Authentication

- **Register a new user**
  - **URL:** `POST /api/auth/register`
  - **Body:** 
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securePassword"
    }
    ```
  - **Response:** Returns a success message with the created user data.

- **Login**
  - **URL:** `POST /api/auth/login`
  - **Body:** 
    ```json
    {
      "email": "john@example.com",
      "password": "securePassword"
    }
    ```
  - **Response:** Returns a JWT token and user data upon successful authentication.

### User Management

- **Get a user by ID**
  - **URL:** `GET /api/user/:id`
  - **Response:** Returns user data.
  - **Protection:** JWT protected endpoint (if configured using `NeedsAuth` decorator).

- **Update a user**
  - **URL:** `PUT /api/user/:id`
  - **Body:**
    ```json
    {
      "name": "New Name",
      "email": "newemail@example.com",
      "password": "newPassword"
    }
    ```
  - **Response:** Returns the updated user data.

- **Delete a user**
  - **URL:** `DELETE /api/user/:id`
  - **Response:** Returns a success message upon deletion.

### Task Management

- **Create a new task**
  - **URL:** `POST /api/task`
  - **Body:**
    ```json
    {
      "description": "Complete NestJS project"
    }
    ```
  - **Response:** Returns the created task data. The task is linked to a user (establishing a many-to-one relationship).

- **Get all tasks**
  - **URL:** `GET /api/task?status=active`
  - **Query Params:** `status` (optional) - Filter tasks by status (active/completed).
  - **Response:** Returns an array of tasks.

- **Update a task status**
  - **URL:** `PATCH /api/task/:id`
  - **Body:**
    ```json
    {
      "status": "completed"  // or "active"
    }
    ```
  - **Response:** Returns the updated task data.

- **Delete a task**
  - **URL:** `DELETE /api/task/:id`
  - **Response:** Returns a success message upon deletion.

## Additional Features & Enhancements

- **JWT Implementation:**  
  Endpoints use JWT for secure authentication. The JWT token is issued on login and validated in protected routes using a custom `JwtGuard`.

- **Relationships in Schemas:**  
  - **User Schema:**  
    - One-to-many relationship with `Task` (a user can have multiple tasks).
  - **Task Schema:**
    - Many-to-one relationship with `User` (each task belongs to a user).
  - **Logging:**  
    - Major actions and errors are logged using Winston with a custom logger implementation.

- **Validation & Logging:**  
  - Incoming requests are validated using NestJS pipes with class-validator.
  - All major actions and errors are logged using Winston with a custom logger implementation.


## License
*Specify your license here.*



