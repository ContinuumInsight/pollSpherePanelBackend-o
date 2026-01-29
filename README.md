

### Step 1: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/pollsphere
DB_NAME=pollsphere

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d


# AWS Configuration (S3 for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name


# Logging
LOG_LEVEL=info
```


## Project Structure

```
pollsphere-admin-panel-backend/
├── src/
│   ├── index.ts                          # Application entry point
│   ├── common/                           # Shared utilities and constants
│   │   ├── constants/                    # Global constants
│   │   │   └── index.ts                  # Error messages, token types, etc.
│   │   ├── datetime/                     # Date/time utilities
│   │   ├── errors/                       # Custom error classes
│   │   │   ├── index.ts
│   │   │   ├── AuthenticationError.ts
│   │   │   ├── ValidationError.ts
│   │   │   └── NotFoundError.ts
│   │   ├── helpers/                      # Helper functions
│   │   ├── response/                     # Response formatters
│   │   │   └── index.ts                  # Success/error response utilities
│   │   ├── types/                        # Global TypeScript types
│   │   │   └── index.ts                  # JWTPayload, user types, etc.
│   │   ├── utils/                        # Utility functions
│   │   │   ├── jwt.ts                    # JWT token generation/verification
│   │   │   ├── logger.ts                 # Winston logger configuration
│   │   │   └── password.ts               # Password hashing/comparison
│   │   └── validators/                   # Input validators
│   ├── config/                           # Configuration files
│   │   ├── aws.ts                        # AWS S3 configuration
│   │   ├── config.ts                     # Centralized config (JWT, BASE_URL, etc.)
│   │   ├── database.ts                   # MongoDB configuration
│   │   └── server.ts                     # Server configuration
│   ├── models/                           # Mongoose database models
│   │   ├── User.ts                       # User model (auth, roles)
│   │   ├── Vendor.ts                     # Vendor model (tier system)
│   │   ├── Client.ts                     # Client model
│   │   ├── Filter.ts                     # Global filter model
│   │   ├── Survey.ts                     # Survey model (main panel)
│   │   ├── SurveyResponse.ts             # Respondent tracking
│   │   └── SurveyStats.ts                # Multi-level statistics
│   ├── repositories/                     # Database access layer
│   │   ├── user.repository.ts            # User CRUD operations
│   │   ├── vendor.repository.ts          # Vendor CRUD operations
│   │   ├── client.repository.ts          # Client CRUD operations
│   │   ├── filter.repository.ts          # Filter operations
│   │   ├── survey.repository.ts          # Survey CRUD with psCode generation
│   │   ├── surveyResponse.repository.ts  # Response tracking
│   │   └── surveyStats.repository.ts     # Stats management
│   ├── services/                         # Business logic layer
│   │   ├── auth.service.ts               # Authentication logic
│   │   ├── vendor.service.ts             # Vendor business logic + filter sync
│   │   ├── client.service.ts             # Client business logic + filter sync
│   │   ├── filter.service.ts             # Filter management + auto-sync
│   │   └── survey.service.ts             # Survey management + stats tracking
│   ├── controllers/                      # Request handlers
│   │   ├── auth.controller.ts            # Auth endpoints
│   │   ├── vendor.controller.ts          # Vendor endpoints
│   │   ├── client.controller.ts          # Client endpoints
│   │   ├── filter.controller.ts          # Filter endpoints
│   │   └── survey.controller.ts          # Survey endpoints + HTML rendering
│   ├── routes/                           # API route definitions
│   │   ├── index.ts                      # Main router (health check + API routes)
│   │   ├── auth.routes.ts                # Auth routes (/api/v1/auth)
│   │   ├── vendor.routes.ts              # Vendor routes (/api/v1/vendors)
│   │   ├── client.routes.ts              # Client routes (/api/v1/clients)
│   │   ├── filter.routes.ts              # Filter routes (/api/v1/filters)
│   │   └── survey.routes.ts              # Survey routes (/api/v1/surveys)
│   ├── middleware/                       # Express middleware
│   │   ├── asyncHandler.ts               # Async error handling wrapper
│   │   ├── authenticate.ts               # JWT verification middleware
│   │   ├── authorize.ts                  # Role-based access control
│   │   ├── errorHandler.ts               # Global error handler
│   │   ├── rateLimiter.ts                # Rate limiting
│   │   ├── requestLogger.ts              # Request logging
│   │   └── validateRequest.ts            # Zod schema validation
│   ├── schemas/                          # Zod validation schemas
│   │   ├── auth.schema.ts                # Auth validation
│   │   ├── vendor.schema.ts              # Vendor validation
│   │   ├── client.schema.ts              # Client validation
│   │   ├── filter.schema.ts              # Filter validation
│   │   └── survey.schema.ts              # Survey validation
│   ├── dtos/                             # Data Transfer Objects
│   │   ├── auth.dto.ts                   # Auth DTOs
│   │   ├── vendor.dto.ts                 # Vendor DTOs
│   │   ├── client.dto.ts                 # Client DTOs
│   │   ├── filter.dto.ts                 # Filter DTOs
│   │   └── survey.dto.ts                 # Survey DTOs
│   ├── utils/                            # Additional utilities
│   │   └── surveyToken.util.ts           # Survey JWT token utils (no expiration)
│   ├── views/                            # HTML templates
│   │   ├── survey-start.html             # Survey start page
│   │   ├── survey-error.html             # Error page
│   │   └── survey-callback.html          # Completion page
│   └── guards/                           # Authorization guards
├── logs/                                 # Application logs (Winston)
├── dist/                                 # Compiled JavaScript (gitignored)
├── node_modules/                         # Dependencies (gitignored)
├── tsconfig.json                         # TypeScript configuration
├── tsconfig.build.json                   # TypeScript build configuration
├── package.json                          # Dependencies and scripts
├── package-lock.json                     # Lock file
├── .env                                  # Environment variables (gitignored)
├── .env.example                          # Example environment variables
├── .gitignore                            # Git ignore rules
├── README.md                             # This file
├── api-curls.md                          # Auth API documentation
├── vendor-api-curls.md                   # Vendor API documentation
├── client-api-curls.md                   # Client API documentation
└── survey-api-curls.md                   # Survey API documentation
```

### Architecture Layers

1. **Routes** → Defines API endpoints
2. **Controllers** → Handles HTTP requests/responses
3. **Services** → Contains business logic
4. **Repositories** → Handles database queries
5. **Models** → Database schema definitions

---

## API Routes Overview

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /logout` - User logout
- `POST /change-password` - Change password
- `GET /me` - Get current user
- `PUT /update` - Update user profile
- `DELETE /delete` - Delete user account

### Vendor Management (`/api/v1/vendors`)
- `POST /create` - Create vendor (super_admin, finance_manager)
- `POST /listVendors` - List vendors with pagination
- `GET /:id` - Get vendor by ID
- `PUT /update/:id` - Update vendor (super_admin, finance_manager)
- `DELETE /delete/:id` - Delete vendor (super_admin, finance_manager)

### Client Management (`/api/v1/clients`)
- `POST /create` - Create client (super_admin, finance_manager)
- `POST /listClients` - List clients with pagination
- `GET /:id` - Get client by ID
- `PUT /update/:id` - Update client (super_admin, finance_manager)
- `DELETE /delete/:id` - Delete client (super_admin, finance_manager)

### Filter Management (`/api/v1/filters`)
- `GET /all` - Get all filters
- `POST /addOrUpdate` - Add or update filter items
- `DELETE /remove` - Remove filter item

### Survey Management (`/api/v1/surveys`)
**Public Routes:**
- `GET /start` - Survey start (vendor entry point)
- `GET /callback/:survey_id` - Survey callback (client completion)

**Protected Routes:**
- `POST /create` - Create survey
- `POST /listSurveys` - List surveys with stats
- `GET /getSurvey/:id` - Get survey details
- `PUT /update/:id` - Update survey
- `PUT /change-status/:id` - Change survey status
- `DELETE /delete/:id` - Delete survey
- `GET /surveyResponses/:id` - Get survey responses

---

## Database Models

### User Model
- **Fields**: email, password, name, role (user/super_admin/finance_manager), refreshToken, lastLogin, isActive
- **Indexes**: email (unique)
- **Features**: Password hashing, JWT token management

### Vendor Model
- **Fields**: email, tier (tier_1/tier_2/tier_3), currency[], companyInfo, address, redirects, bankDetails
- **Indexes**: email (unique)
- **Features**: Nested objects, auto-sync to filters

### Client Model
- **Fields**: email, companyInfo, address
- **Indexes**: email (unique)
- **Features**: Auto-sync to filters

### Filter Model
- **Fields**: countries[], vendors[], clients[], gender[], status[]
- **Pattern**: Single document for all filters
- **Features**: Auto-updated by vendor/client changes

### Survey Model
- **Fields**: surveyId, basic (with psCode), client, countries[], status, totalCompletes
- **Features**: Auto-incrementing psCode, nested vendor schemas, JWT-signed start URLs

### SurveyResponse Model
- **Fields**: surveyId, psCode, uid, vendorId, country, status, ipAddress, userAgent
- **Indexes**: surveyId, uid, compound indexes
- **Features**: Lifecycle tracking (INITIATED → COMPLETED/TERMINATED/QUOTA_FULL/SECURITY)

### SurveyStats Model
- **Fields**: survey_id, vendor_id (nullable), country (nullable), stats { initiated, completed, quota_full, security, terminated }
- **Features**: Separate rows for overall/country/vendor stats using a unique compound key, monotonic ($inc) updates

---




## Key Features

✅ **User Authentication** - JWT-based authentication with refresh tokens  
✅ **Role-Based Access Control (RBAC)** - super_admin, finance_manager, and user roles   
✅ **Vendor Management** - Complete CRUD for vendors with tier system (tier_1, tier_2, tier_3)  
✅ **Client Management** - Complete CRUD for clients with company details  
✅ **Filter Management** - Global filters with auto-sync from vendor/client changes  
✅ **Survey Management** - Comprehensive survey system with:
  - Auto-incrementing psCode (00001, 00002, etc.)
  - JWT-signed start URLs for vendor integration
  - Respondent tracking with SurveyResponse
  - Multi-level statistics (overall, country, vendor)
  - HTML response pages for survey flow
  - Public and protected endpoints
✅ **Rate Limiting** - Protect APIs from abuse  
✅ **Error Handling** - Comprehensive error management  
✅ **Request Logging** - Winston-based logging system  
✅ **Request Validation** - Zod schema validation

---




> **Branching Strategy:**
>
> - **main** - Production-ready code (stable releases)
> - **dev** - Development branch (all feature development)
> - **feature/\*** - Feature branches (created from dev)

---
