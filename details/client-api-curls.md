# Client Management API - CURL Commands

Base URL: `http://localhost:3000/api/v1`

**Authorization:** All client endpoints require authentication and either `super_admin` or `finance_manager` role.

---

## Client Routes

### 1. Create Client
```bash
curl -X POST http://localhost:3000/api/v1/clients/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "email": "contact@acmecorp.com",
    "phone": "+1234567890",
    "companyInfo": {
      "companyName": "Acme Corporation Ltd",
      "website": "https://acmecorp.com",
      "taxId": "TAX987654",
      "panNumber": "XYZAB5678C",
      "msme": "MSME789012",
      "cinNumber": "U74999DL2020PTC367890"
    },
    "address": {
      "country": "India",
      "stateProvince": "Delhi",
      "city": "New Delhi",
      "zipCode": "110001",
      "completeAddress": "456 Business Park, Connaught Place, New Delhi"
    },
    "status": "active"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Acme Corporation",
    "email": "contact@acmecorp.com",
    "phone": "+1234567890",
    "companyInfo": {
      "companyName": "Acme Corporation Ltd",
      "website": "https://acmecorp.com",
      "taxId": "TAX987654"
    },
    "status": "active",
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com",
    "createdAt": "2026-01-27T12:00:00.000Z",
    "updatedAt": "2026-01-27T12:00:00.000Z"
  }
}
```

---

### 2. List Clients (with Filters)
```bash
curl -X POST http://localhost:3000/api/v1/clients/listClients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "limit": 10,
    "search": "acme",
    "status": "active",
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }'
```

**Minimal Request (with defaults):**
```bash
curl -X POST http://localhost:3000/api/v1/clients/listClients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in name, email, or company name
- `status` (optional): Filter by status (`active`, `inactive`, `suspended`)
- `sortBy` (optional): Sort field (`name`, `email`, `status`, `createdAt`, `updatedAt`) (default: `createdAt`)
- `sortOrder` (optional): Sort direction (`asc`, `desc`) (default: `desc`)

**Response:**
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "data": {
    "clients": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Acme Corporation",
        "email": "contact@acmecorp.com",
        "phone": "+1234567890",
        "status": "active",
        "createdAt": "2026-01-27T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

### 3. Get Client by ID
```bash
curl -X GET http://localhost:3000/api/v1/clients/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Client retrieved successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Acme Corporation",
    "email": "contact@acmecorp.com",
    "phone": "+1234567890",
    "companyInfo": {
      "companyName": "Acme Corporation Ltd",
      "website": "https://acmecorp.com",
      "taxId": "TAX987654",
      "panNumber": "XYZAB5678C",
      "msme": "MSME789012",
      "cinNumber": "U74999DL2020PTC367890"
    },
    "address": {
      "country": "India",
      "stateProvince": "Delhi",
      "city": "New Delhi",
      "zipCode": "110001",
      "completeAddress": "456 Business Park, Connaught Place, New Delhi"
    },
    "status": "active",
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com",
    "createdAt": "2026-01-27T12:00:00.000Z",
    "updatedAt": "2026-01-27T12:00:00.000Z"
  }
}
```

---

### 4. Update Client
```bash
curl -X PUT http://localhost:3000/api/v1/clients/update/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation Global",
    "phone": "+1234567891",
    "status": "active",
    "companyInfo": {
      "website": "https://acmecorpglobal.com"
    },
    "address": {
      "city": "Mumbai"
    }
  }'
```

**Note:** All fields are optional. Only provide the fields you want to update. Nested objects (companyInfo, address) are merged with existing data.

**Response:**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Acme Corporation Global",
    "phone": "+1234567891",
    "companyInfo": {
      "companyName": "Acme Corporation Ltd",
      "website": "https://acmecorpglobal.com",
      "taxId": "TAX987654"
    },
    "address": {
      "country": "India",
      "stateProvince": "Delhi",
      "city": "Mumbai",
      "zipCode": "110001"
    },
    "updatedBy": "admin@example.com",
    "updatedAt": "2026-01-27T13:00:00.000Z"
  }
}
```

---

### 5. Delete Client
```bash
curl -X DELETE http://localhost:3000/api/v1/clients/delete/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Client deleted successfully",
  "data": null
}
```

---

## Complete Workflow Example

### Step 1: Login as Super Admin
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pollsphere.com",
    "password": "Admin@123"
  }' > login.json

# Extract token
export ACCESS_TOKEN=$(cat login.json | jq -r '.data.accessToken')
```

### Step 2: Create a New Client
```bash
curl -X POST http://localhost:3000/api/v1/clients/create \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Global Enterprises",
    "email": "info@globalenterprises.com",
    "phone": "+919876543210",
    "companyInfo": {
      "companyName": "Global Enterprises Private Limited",
      "website": "https://globalenterprises.com",
      "taxId": "27ABCDE5678G1Z9",
      "panNumber": "FGHIJ6789K"
    },
    "address": {
      "country": "India",
      "stateProvince": "Maharashtra",
      "city": "Mumbai",
      "zipCode": "400001",
      "completeAddress": "789 Enterprise Tower, BKC, Mumbai"
    }
  }' | jq '.'
```

### Step 3: List All Clients
```bash
curl -X POST http://localhost:3000/api/v1/clients/listClients \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10}' | jq '.'
```

### Step 4: Search Clients
```bash
curl -X POST http://localhost:3000/api/v1/clients/listClients \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "search": "global",
    "status": "active"
  }' | jq '.'
```

### Step 5: Update Client
```bash
# Save client ID from create response
export CLIENT_ID="65f1a2b3c4d5e6f7g8h9i0j1"

curl -X PUT http://localhost:3000/api/v1/clients/update/$CLIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "companyInfo": {
      "website": "https://newwebsite.com"
    }
  }' | jq '.'
```

### Step 6: Get Client Details
```bash
curl -X GET http://localhost:3000/api/v1/clients/$CLIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
```

### Step 7: Delete Client
```bash
curl -X DELETE http://localhost:3000/api/v1/clients/delete/$CLIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
```

---

## Client Status Options
- `active` - Client is active and operational
- `inactive` - Client is temporarily inactive
- `suspended` - Client is suspended

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Client not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Client with this email already exists"
}
```

### 400 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## Notes

1. **Authentication Required:** All client endpoints require a valid JWT access token from a user with `super_admin` or `finance_manager` role.

2. **Email Uniqueness:** Client email addresses must be unique across the system.

3. **Automatic Tracking:** The system automatically tracks who created and last updated each client using the authenticated admin's email.

4. **Pagination:** The list endpoint supports pagination with a maximum of 100 items per page.

5. **Search:** The search feature looks for matches in client name, email, and company name fields.

6. **Optional Fields:** All nested fields in `companyInfo` (except `companyName`) and `address` are optional.

7. **Nested Updates:** When updating nested objects (companyInfo, address), the new values are merged with existing data, so you only need to send the fields you want to change.

---

## Testing Tips

### Using Variables (Bash)
```bash
# Set your access token
export ACCESS_TOKEN="your_token_here"

# Use it in requests
curl -X GET http://localhost:3000/api/v1/clients/CLIENT_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Pretty Print JSON Response
```bash
curl -X POST http://localhost:3000/api/v1/clients/listClients \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.'
```

### Save Response to File
```bash
curl -X POST http://localhost:3000/api/v1/clients/create \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@client.com",
    "phone": "+1234567890",
    "companyInfo": {
      "companyName": "Test Company"
    }
  }' > client-response.json
```
