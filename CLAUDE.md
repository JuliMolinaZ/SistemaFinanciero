# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack financial management system built with Node.js/Express backend and React frontend. The system manages clients, projects, financial accounts (payable/receivable), accounting, and user roles with comprehensive security features.

## Architecture

### Backend (`/Backend`)
- **Framework**: Express.js with modular architecture
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT + Firebase integration
- **Security**: Multi-layered with Helmet, rate limiting, input sanitization
- **Structure**: MVC pattern with clear separation of concerns

### Frontend (`/Frontend`)
- **Framework**: React 19 with Create React App
- **UI**: Material-UI (@mui/material) with custom components
- **State**: Context API with custom hooks
- **Charts**: Chart.js and Recharts for data visualization
- **Authentication**: Firebase Auth integration

## Common Development Commands

### Backend Development
```bash
cd Backend

# Development server with auto-reload
npm run dev

# Production server
npm start

# Database operations
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio GUI
npm run db:seed           # Seed database with initial data

# Setup and configuration
npm run setup             # Interactive setup menu
npm run setup:prisma      # Setup Prisma configuration
npm run setup:security    # Create security tables

# Testing and quality
npm test                  # Run Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run lint              # ESLint code checking
npm run lint:fix          # Auto-fix ESLint issues
npm run format            # Prettier code formatting

# Database switching (multiple environments)
npm run db:switch         # Switch between databases
npm run db:remote         # Switch to remote database
npm run db:local          # Switch to local database
npm run db:test-64        # Test connection to remote server
```

### Frontend Development
```bash
cd Frontend

# Development server
npm start

# Production build
npm build

# Run tests
npm test
```

## Key Architectural Patterns

### Backend Structure
```
Backend/src/
├── controllers/     # Request handlers and business logic
├── routes/         # Express route definitions  
├── middlewares/    # Custom middleware (auth, security, logging)
├── services/       # Business logic and external integrations
├── validations/    # Joi validation schemas
├── config/         # Configuration files and environment setup
└── utils/          # Utility functions and helpers
```

### Authentication & Security
- **Multi-layer security**: Helmet, CORS, rate limiting, input sanitization
- **JWT + Firebase**: Dual authentication system for flexibility
- **Role-based access**: Granular permissions system
- **Audit logging**: Complete activity tracking
- **Invitation system**: User invitation blocking middleware

### Database Design
- **Prisma ORM**: Type-safe database access with migration system
- **Multi-environment**: Local and remote database switching capability
- **Comprehensive models**: Users, Clients, Projects, Financial accounts, Audit logs
- **Relationship mapping**: Complex relationships between financial entities

### Frontend Architecture
- **Module-based**: Organized by feature modules in `/src/modules/`
- **Component structure**: Reusable components in `/src/components/`
- **Custom hooks**: Business logic in `/src/hooks/`
- **Context providers**: Global state management
- **Material-UI theming**: Consistent design system

## Development Workflow

### Database Changes
1. Modify `Backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create migration
3. Run `npm run prisma:generate` to update client
4. Update controllers/routes as needed

### Adding New Features
1. Create validation schema in `Backend/src/validations/`
2. Add controller in `Backend/src/controllers/`
3. Define routes in `Backend/src/routes/`
4. Add frontend components in `Frontend/src/modules/[feature]/`
5. Update navigation and routing as needed

### Security Considerations
- All routes protected by authentication middleware
- Input validation required for all endpoints
- Sensitive operations logged in audit trail
- User permissions checked before data access
- Rate limiting applied to prevent abuse

## Environment Configuration

### Backend Environment Variables
- `DATABASE_URL`: Prisma database connection string
- `JWT_SECRET`: JWT token signing secret
- `ENCRYPTION_KEY`: Data encryption key (32 characters)
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment mode
- Firebase configuration for authentication
- Rate limiting and logging settings

### Frontend Environment Variables
- Firebase configuration for authentication
- Backend API endpoint configuration

## Testing Strategy

### Backend Testing
- **Unit tests**: Controllers and utilities
- **Integration tests**: API endpoints and database operations  
- **Security tests**: Authentication and authorization
- **Connection tests**: Database and external service connectivity

### Key Test Commands
```bash
# Run specific test suites
npm run test:clients      # Test client module
npm run db:test-local     # Test local database connection
npm run db:test-64        # Test remote database connection
```

## Deployment Notes

### Database Switching
The system supports multiple database environments:
- Use `npm run db:switch` for interactive database switching
- Remote database at IP 64.23.225.99
- Local development database support

### Security in Production
- Change all default secrets in `.env`
- Enable proper CORS origins
- Configure rate limiting appropriately
- Set up proper backup retention
- Monitor audit logs regularly

## Module System

### Backend Modules
Major functional modules include:
- **Auth**: Authentication and authorization
- **Users**: User management and roles
- **Clients**: Client information management
- **Projects**: Project lifecycle management
- **Financial**: Accounts payable/receivable, accounting
- **Security**: Audit trails and security logging
- **Dashboard**: Analytics and reporting

### Frontend Modules
Located in `Frontend/src/modules/`, each with:
- Components specific to the module
- Custom hooks for business logic
- Module-specific styling
- Integration with backend APIs

This system emphasizes security, auditability, and maintainability with a clear separation of concerns between frontend and backend responsibilities.