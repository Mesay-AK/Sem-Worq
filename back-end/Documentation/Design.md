# Project Design Documentation

## 1. Project Overview
This project is a scalable, modular web application built with **Node.js**, **Express.js**, and **MongoDB**. It follows **Domain-Driven Design (DDD)** principles and a **layered architecture** to manage business logic, data persistence, and request handling separately.

### The system supports:
- **Blog management** (CRUD, likes, dislikes, comments)
- **Services page management**
- **Admin management**
- **Contact Us management**
- **Dynamic routing** with authentication and role-based access control

---

## 2. System Architecture
The project follows a **layered architecture**, ensuring clear separation of concerns.

### **Core Layers:**

#### **Domain Layer**
- Contains **business logic**, validation, and core entities.

#### **Application Layer**
- Handles **use cases** and **service orchestration** via Controllers and Repositories.

#### **Infrastructure Layer**
- Manages **database models** (MongoDB with Mongoose), **middleware**, and **configurations**.

#### **Adapters Layer**
- **Controllers**: Handle incoming HTTP requests, call domain and repository methods, and return responses.
- **Middlewares**: Manage authentication, admin checks, and validation.
- **Routes**: Map API endpoints to controller methods.

---

## 3. Key Domain Entities

| Entity            | Properties/Methods |
|------------------|------------------|
| **AdminEntity**  | `name`, `email`, `password`, `role`, `resetToken`<br>Methods: `validate()`, `validateResetPasswordFields()` |
| **BlogEntity**   | `title`, `content`, `author`, `image`, `tags`, `status`, `liked`, `disliked`, `comments`<br>Methods: `validate()`, `validateOnUpdate()` |
| **ServiceEntity**| `title`, `description`, `image`<br>Methods: `validate()` |
| **ContactUsEntity** | `firstName`, `lastName`, `email`, `subject`, `message`<br>Methods: `validate()` |
| **TestimonialEntity** | `name`, `description`, `profession`, `image`<br>Methods: `validate()` |
| **PortfolioEntity** | `title`, `description`, `images`, `category`<br>Methods: `validate()` |

---

## 4. Database Models
- All entities are mapped to **Mongoose models** under `/infrastructures/models`.
- **Timestamps** and **validation** are enforced at the schema level.

---

## 5. Repositories
Each repository encapsulates **data access logic**:
- CRUD operations
- Pagination & sorting
- Custom queries & filtering

### **Repositories include:**
- `AdminRepository`
- `BlogRepository`
- `ServicesRepository`
- `ContactRepository`
- `TestimonialRepository`
- `PortfolioRepository`

---

## 6. Controllers
Controllers handle API requests and delegate work to repositories and domain entities. They:
- Parse and **validate input**
- Handle **errors and exceptions**
- Return structured **JSON responses**

---

## 7. Routing Structure
Routes are defined under `/routes` and follow **RESTful conventions**:
- **Protected routes** require `authMiddleware` and `adminOnlyMiddleware`.
- **Example routes:**
  - `/blogs/` — Blog CRUD & interaction
  - `/services/` — Service management
  - `/contact-us/` — Contact messages
  - `/testimonials/` — Testimonials CRUD
  - `/portfolio/` — Portfolio management

---

## 8. Authentication & Authorization
The system uses **JWT-based authentication**.

### **Middleware:**
- `authMiddleware` — verifies user tokens.
- `adminOnlyMiddleware` — restricts certain routes to admin users.

---

## 9. Error Handling
- All layers use **try/catch** for exception handling.
- Repositories and controllers return **consistent error structures**.
- Errors are **logged server-side** with detailed messages.

---

## 10. Testing Strategy
The project will be covered with **unit tests** for:
- **Domains** (entity validations)
- **Repositories** (database actions with mocks)
- **Controllers** (API-level tests using mocks)
