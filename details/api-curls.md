# API CURL Commands

Base URL: `http://localhost:3000/api/v1`

---

## Public Routes

### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/v1/health
```

### 2. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123",
    "name": "John Doe"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123"
  }'
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

---

## Protected Routes (Require Authentication)

**Note:** Replace `YOUR_ACCESS_TOKEN` with the actual access token received from login/register.

### 5. Get Current User
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Update User Profile
```bash
curl -X PUT http://localhost:3000/api/v1/auth/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "newemail@example.com"
  }'
```

### 7. Change Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Password@123",
    "newPassword": "NewPassword@456"
  }'
```

### 8. Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 9. Delete User Account
```bash
curl -X DELETE http://localhost:3000/api/v1/auth/delete \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Example Workflow

### Step 1: Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "admin",
      "createdAt": "2026-01-26T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 2: Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Step 3: Use access token for protected routes
```bash
# Get current user profile
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 4: Refresh token when access token expires
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## Testing Tips

### Using Variables (Bash)
```bash
# Set your access token
export ACCESS_TOKEN="your_token_here"

# Use it in requests
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Pretty Print JSON Response
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
```

### Save Response to File
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }' > login-response.json
```

---

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ]
}
```
