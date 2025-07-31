# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a NestJS microservices template implementing Domain-Driven Design (DDD) with Clean Architecture principles. The system consists of three main services:

### Services Architecture
- **auth**: Authentication service (port 3000) - Handles OAuth 2.0 Google authentication, JWT tokens, and refresh token management
- **user**: User HTTP API service (port 3001) - Provides REST endpoints for user operations
- **user-grpc**: User gRPC service (port 5000) - Handles user CRUD operations via gRPC protocol

### Shared Libraries
- **@app/common**: Shared utilities, guards, strategies, and decorators
- **@app/user-common**: User domain models, repositories, and shared user logic

### Domain-Driven Design Structure
Each service follows Clean Architecture layers:
- **Domain**: Business logic, entities, value objects, factories, events
- **Application**: Use cases, command/query handlers, sagas (CQRS pattern)
- **Infrastructure**: Database persistence, external adapters, gRPC clients
- **Interface**: Controllers, DTOs, guards, interceptors, filters

## Development Commands

### Environment Setup
```bash
# Requires .env file with database credentials and OAuth configs
docker compose build
docker compose up -d
```

### Building Applications
```bash
pnpm run build:all          # Build all services
pnpm run "build auth"       # Build auth service only
pnpm run "build user"       # Build user service only  
pnpm run "build user-grpc"  # Build user-grpc service only
pnpm run "build common"     # Build common library
```

### Development & Testing
```bash
pnpm run start:dev          # Start with watch mode
pnpm run lint               # ESLint with auto-fix
pnpm run format             # Prettier formatting
pnpm run test               # Run unit tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:cov           # Run tests with coverage
pnpm run test:e2e           # Run E2E tests
```

### Docker Operations
```bash
docker compose exec app sh           # Connect to app container
docker compose exec db mariadb -u [user] -p    # Connect to MariaDB
docker compose down -v               # Shutdown with volume cleanup
```

### Protocol Buffer Generation
```bash
# Generate TypeScript types from proto files
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/[proto_file_name]
```

## Key Technical Patterns

### Authentication Flow
- OAuth 2.0 with Google strategy using Passport
- JWT access tokens with refresh token rotation
- Cookie-based refresh token storage with HTTP-only flags
- User session management with soft delete capabilities

### CQRS Implementation
- Commands for write operations (login, logout, token refresh)
- Queries for read operations (user retrieval)
- Event sourcing with domain events (UserLoggedOutEvent)
- Sagas for complex workflows (user-logout.saga.ts)

### Database Architecture
- TypeORM with MariaDB backend
- Repository pattern with domain interfaces
- Entity mappers for domain ↔ persistence translation
- Base entities with common fields (id, createdAt, updatedAt)

### gRPC Communication
- User service communication via gRPC protocol
- Proto definitions in `/proto/user.proto`
- Streaming support for pagination queries
- Health checks and service dependencies

### Value Objects & Domain Logic
- HashedRefreshTokenVO for token security
- Email value object with validation
- User status enumeration (ACTIVE, DELETED, PENDING)
- Aggregate roots with domain event publishing

## Environment Configuration

Required environment variables (defined in libs/common/src/config/env.validation.ts):
- Database: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_TOKEN_EXPIRES_IN`
- OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Ports: `USER_PORT` (3001), `AUTH_PORT` (3000)

## Module Dependencies

### Import Aliases
- `@app/common` → `libs/common/src`
- `@app/user-common` → `libs/user-common/src`
- Service-specific aliases: `@auth/*`, `@user/*`, `@user-grpc/*`

### Service Dependencies
- Auth service depends on user-grpc service for user operations
- All services depend on MariaDB database
- Services communicate via gRPC (user operations) and shared database

## Code Quality & Style Rules

### Clean Architecture & DDD Principles

**Domain Layer Rules**:
- Domain entities contain ONLY business logic, no infrastructure dependencies
- Value Objects must be immutable with built-in validation
- Domain events use past tense naming (UserRegisteredEvent, OrderCompletedEvent)
- Only Aggregate Roots can publish domain events
- Business rules are expressed in domain language, not technical terms

**Application Layer Rules**:
- Each Use Case follows Single Responsibility Principle (one business function)
- Strict Command/Query separation for CQRS pattern
- Application services orchestrate domain services, never contain business logic
- Input/output through DTOs only, never expose domain entities directly

**Infrastructure Layer Rules**:
- Repository implementations must implement domain interfaces
- Use Port-Adapter pattern for external system integration
- Entity Mappers handle domain ↔ persistence transformation
- Database concerns isolated from business logic

### TypeScript & NestJS Best Practices

**Type Safety Rules**:
- Explicit return types for all functions and methods
- Strict TypeScript configuration (`"strict": true`)
- Prefer `unknown` over `any`, avoid `@ts-ignore`
- Use interfaces for object shapes, types for unions/intersections
- Generic types for reusable components

**NestJS Module Organization**:
- Feature-based module structure (AuthModule, UserModule)
- Each module independently testable and deployable
- Constructor injection only for dependency injection
- DTOs with class-validator decorators for input validation
- Guards, interceptors, and filters follow single responsibility

**SOLID Principles Application**:
- Single Responsibility: One class, one reason to change
- Open/Closed: Extend through abstraction, minimal existing code changes
- Liskov Substitution: Derived classes fully substitutable
- Interface Segregation: Focused, client-specific interfaces
- Dependency Inversion: Depend on abstractions, not concrete implementations

### Code Quality Standards

**Naming Conventions**:
- Classes: PascalCase (UserService, AuthController)
- Methods/Variables: camelCase (getUserById, refreshToken)
- Constants: UPPER_SNAKE_CASE (JWT_SECRET, DB_HOST)
- Files: kebab-case (user-logout.saga.ts)
- Interfaces: PascalCase with descriptive names (IUserRepository)

**Function & Method Guidelines**:
- Methods under 20 lines preferred
- Parameters limited to 3, use objects for more
- Pure functions preferred, minimize side effects
- Guard clauses for early returns and validation
- Meaningful names that express intent

**Functional Programming Style**:
- Prefer functional programming patterns over imperative when applicable
- Use `map()`, `filter()`, `reduce()`, `find()` instead of traditional loops
- Immutable data structures and operations (avoid mutating arrays/objects)
- Function composition for complex data transformations
- Declarative code style that expresses "what" rather than "how"
- Higher-order functions for reusable logic patterns
- Avoid nested conditionals, prefer early returns and functional chains

**Code Readability & Expressiveness**:
- Self-documenting code that reduces need for comments
- Descriptive variable names that explain business context
- Extract complex conditions into well-named boolean variables
- Use method chaining for readable data transformations
- Prefer explicit over implicit, clarity over cleverness
- Break complex expressions into intermediate variables with meaningful names
- Use TypeScript's optional chaining (`?.`) and nullish coalescing (`??`) for cleaner null handling

**Error Handling Strategy**:
- Domain exceptions for business rule violations
- HTTP exceptions using @nestjs/common types
- Global Exception Filter for consistent error responses
- Never suppress errors silently
- Contextual error messages for debugging

**Security & Performance Rules**:
- Environment variables for sensitive configuration
- HttpOnly cookies for JWT tokens
- Input validation through DTO validation pipes
- Database queries optimized with proper indexing
- Lazy loading and pagination for large datasets

### Project Structure Standards

**File Organization**:
```
apps/[service]/src/
├── domain/           # Pure business logic
├── application/      # Use cases and handlers
├── infrastructure/   # External integrations
└── interface/        # Controllers and DTOs

libs/
├── common/          # Cross-cutting concerns
└── [domain]-common/ # Domain-specific shared logic
```

**Testing Strategy**:
- Unit tests for domain logic (>90% coverage)
- Integration tests for application services (>80% coverage)
- E2E tests for critical user journeys
- Test doubles (mocks/stubs) for external dependencies
- Arrange-Act-Assert pattern for test structure

### Code Review & Quality Gates

**Pre-commit Requirements**:
- All tests passing
- Linting and formatting applied
- Type checking without errors
- Security scan passing
- Documentation updated for public APIs

**Performance Considerations**:
- Database queries analyzed for N+1 problems
- Memory usage monitored for large datasets
- Response times under 200ms for API endpoints
- Proper caching strategies implemented
- Resource cleanup in finally blocks