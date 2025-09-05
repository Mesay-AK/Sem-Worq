# Sem&Worq Backend API

A scalable web application backend built with Node.js, Express.js, and MongoDB. Follows Domain-Driven Design principles with a clean layered architecture.

## Features

- **Blog Management** - CRUD operations with likes, dislikes, and comments
- **Services Management** - Dynamic service page content
- **Portfolio Management** - Project showcase with image galleries
- **Testimonials System** - Client feedback management
- **Contact Us System** - Customer inquiry handling
- **Admin Authentication** - JWT-based auth with role-based access
- **Email Services** - Automated notifications via Postmark
- **Caching** - Redis integration for performance
- **File Upload** - Image handling with Multer
- **Testing** - Comprehensive unit tests with Jest

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Caching**: Redis
- **Email**: Postmark
- **Testing**: Jest, Supertest
- **File Upload**: Multer

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment**
   Create `.env` file:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/semworq
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret_key
   POSTMARK_API_TOKEN=your_postmark_token
   FRONTEND_URL=http://localhost:5000
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## API Endpoints

Base URL: `/sem&worq`

### Authentication

- `POST /register` - Admin registration
- `POST /login` - Admin login
- `POST /logout` - Admin logout
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset

### Blogs

- `GET /blogs` - Get all blogs (paginated)
- `GET /blogs/:id` - Get single blog
- `POST /blogs` - Create blog (Admin only)
- `PUT /blogs/:id` - Update blog (Admin only)
- `DELETE /blogs/:id` - Delete blog (Admin only)
- `POST /blogs/:id/like` - Like blog
- `POST /blogs/:id/dislike` - Dislike blog
- `POST /blogs/:id/comment` - Add comment

### Services

- `GET /services` - Get all services
- `POST /services` - Create service (Admin only)
- `PUT /services/:id` - Update service (Admin only)
- `DELETE /services/:id` - Delete service (Admin only)

### Portfolio

- `GET /portfolio` - Get all portfolio items
- `POST /portfolio` - Create portfolio item (Admin only)
- `PUT /portfolio/:id` - Update portfolio item (Admin only)
- `DELETE /portfolio/:id` - Delete portfolio item (Admin only)

### Testimonials

- `GET /testimony` - Get all testimonials
- `POST /testimony` - Create testimonial (Admin only)
- `PUT /testimony/:id` - Update testimonial (Admin only)
- `DELETE /testimony/:id` - Delete testimonial (Admin only)

### Contact Us

- `GET /contacts` - Get all contact messages (Admin only)
- `POST /contacts` - Submit contact form
- `DELETE /contacts/:id` - Delete contact message (Admin only)

## Architecture

Clean layered architecture with separation of concerns:

- **Controllers** - Handle HTTP requests
- **Domain Entities** - Business logic and validation
- **Repositories** - Data access layer
- **Infrastructure** - Database models and external services

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Admin-only endpoints)
- Password hashing with bcrypt
- Redis session management

## 📁 Project Structure

```
src/
├── adapters/          # Controllers, Routes, Middleware
├── Domain/           # Business entities and validation
├── Infrastructures/  # Database models, cache, email
├── Repositories/     # Data access layer
└── tests/           # Test suites
```

## Testing

```bash
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage
```

## Deployment

```bash
npm ci --only=production
npm start
```

## License

ISC License

---

**Sem&Worq Backend API** - Built with modern web technologies and best practices.
