# Architectural Diagram — Structure Overview:

                       ┌─────────────────────────────┐
                       │          Client             │
                       │ (Frontend / API Consumers)  │
                       └──────────────┬──────────────┘
                                      │  HTTP Requests
                                      ▼
                       ┌────────────────────────────┐
                       │          Routes            │
                       └──────────────┬──────────────
                                      │
                                      ▼
                       ┌─────────────────────────────┐
                       │        Middleware           │
                       │ (Auth, Admin Only, etc.)    │
                       └──────────────┬──────────────┘
                                      │
                                      ▼
                       ┌─────────────────────────────┐
                       │        Controllers          │
                       │  (Handles request logic)    │
                       └──────────────┬──────────────┘
                                      │
                                      ▼
                       ┌─────────────────────────────┐
                       │      Domain Entities        │
                       │ (Validation, business rules)│
                       └──────────────┬──────────────┘
                                      │
                                      ▼
                       ┌─────────────────────────────┐
                       │        Repositories         │
                       │ (Data access logic, queries)│
                       └──────────────┬──────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │   Infrastructure Layer       │
                       │ (MongoDB Models via Mongoose)│
                       └──────────────┬──────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │        MongoDB Database      │
                       └──────────────────────────────┘

## Layers Explanation

### Client - _The frontend or API consumers send HTTP requests._

### Routes - _Handles incoming requests and directs them to controllers._

### Middleware - _Authentication and validation layers._

### Controllers - _Processes requests and calls the business logic._

### Domain Entities - _Contains validation and business rules._

### Repositories - _Handles database queries and persistence._

### Infrastructure Layer - _Uses Mongoose models for database operations._

MongoDB Database - _The main data storage system._
