# Vendor Management API - CURL Commands

Base URL: `http://localhost:3000/api/v1`

**Authorization:** All vendor endpoints require authentication and either `super_admin` or `finance_manager` role.

---

## Vendor Routes

### 1. Create Vendor
```bash
curl -X POST http://localhost:3000/api/v1/vendors/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Solutions Inc",
    "email": "vendor@techsolutions.com",
    "phone": "+1234567890",
    "tier": "gold",
    "currency": ["USD", "EUR", "INR"],
    "companyInfo": {
      "companyName": "Tech Solutions Incorporated",
      "website": "https://techsolutions.com",
      "taxId": "TAX123456",
      "panNumber": "ABCDE1234F",
      "msme": "MSME123456",
      "cinNumber": "U12345MH2020PTC123456"
    },
    "address": {
      "country": "India",
      "stateProvince": "Maharashtra",
      "city": "Mumbai",
      "zipCode": "400001",
      "completeAddress": "123 Main Street, Andheri, Mumbai"
    },
    "redirects": {
      "completeRedirect": "https://techsolutions.com/complete",
      "terminateRedirect": "https://techsolutions.com/terminate",
      "quotaFullRedirect": "https://techsolutions.com/quota-full",
      "securityRedirect": "https://techsolutions.com/security"
    },
    "bankDetails": {
      "bankName": "HDFC Bank",
      "accountType": "Current",
      "accountNumber": "12345678901234",
      "accountHolderName": "Tech Solutions Inc",
      "ifscCode": "HDFC0001234",
      "micrCode": "400240001",
      "bankAddress": "HDFC Branch, Mumbai",
      "swiftCode": "HDFCINBB",
      "currency": "INR",
      "intermediaryAccountNo": "INT123456",
      "intermediarySwiftCode": "INTSWIFT123"
    },
    "status": "active"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor created successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Tech Solutions Inc",
    "email": "vendor@techsolutions.com",
    "tier": "gold",
    "currency": ["USD", "EUR", "INR"],
    "status": "active",
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com",
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T12:00:00.000Z"
  }
}
```

---

### 2. List Vendors (with Filters)
```bash
curl -X POST http://localhost:3000/api/v1/vendors/listVendors \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "limit": 10,
    "search": "tech",
    "status": "active",
    "tier": "gold",
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }'
```

**Minimal Request (with defaults):**
```bash
curl -X POST http://localhost:3000/api/v1/vendors/listVendors \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in name, email, or company name
- `status` (optional): Filter by status (`active`, `inactive`, `suspended`)
- `tier` (optional): Filter by tier (`platinum`, `gold`, `silver`, `bronze`)
- `sortBy` (optional): Sort field (`name`, `email`, `tier`, `status`, `createdAt`, `updatedAt`) (default: `createdAt`)
- `sortOrder` (optional): Sort direction (`asc`, `desc`) (default: `desc`)

**Response:**
```json
{
  "success": true,
  "message": "Vendors retrieved successfully",
  "data": {
    "vendors": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Tech Solutions Inc",
        "email": "vendor@techsolutions.com",
        "tier": "gold",
        "status": "active",
        "createdAt": "2026-01-26T12:00:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 3. Get Vendor by ID
```bash
curl -X GET http://localhost:3000/api/v1/vendors/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor retrieved successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Tech Solutions Inc",
    "email": "vendor@techsolutions.com",
    "phone": "+1234567890",
    "tier": "gold",
    "currency": ["USD", "EUR", "INR"],
    "companyInfo": {
      "companyName": "Tech Solutions Incorporated",
      "website": "https://techsolutions.com",
      "taxId": "TAX123456"
    },
    "address": {
      "country": "India",
      "city": "Mumbai"
    },
    "redirects": {},
    "bankDetails": {},
    "status": "active",
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com",
    "createdAt": "2026-01-26T12:00:00.000Z",
    "updatedAt": "2026-01-26T12:00:00.000Z"
  }
}
```

---

### 4. Update Vendor
```bash
curl -X PUT http://localhost:3000/api/v1/vendors/update/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Solutions Global",
    "phone": "+1234567891",
    "tier": "platinum",
    "status": "active",
    "companyInfo": {
      "website": "https://techsolutionsglobal.com"
    }
  }'
```

**Note:** All fields are optional. Only provide the fields you want to update.

**Response:**
```json
{
  "success": true,
  "message": "Vendor updated successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Tech Solutions Global",
    "tier": "platinum",
    "updatedBy": "admin@example.com",
    "updatedAt": "2026-01-26T13:00:00.000Z"
  }
}
```

---

### 5. Delete Vendor
```bash
curl -X DELETE http://localhost:3000/api/v1/vendors/delete/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor deleted successfully",
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

### Step 2: Create a New Vendor
```bash
curl -X POST http://localhost:3000/api/v1/vendors/create \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Survey Masters",
    "email": "contact@surveymasters.com",
    "phone": "+919876543210",
    "tier": "silver",
    "currency": ["INR", "USD"],
    "companyInfo": {
      "companyName": "Survey Masters Private Limited",
      "website": "https://surveymasters.com",
      "taxId": "29ABCDE1234F1Z5",
      "panNumber": "ABCDE1234F"
    },
    "address": {
      "country": "India",
      "stateProvince": "Karnataka",
      "city": "Bangalore",
      "zipCode": "560001",
      "completeAddress": "456 Tech Park, Koramangala, Bangalore"
    }
  }' | jq '.'
```

### Step 3: List All Vendors
```bash
curl -X POST http://localhost:3000/api/v1/vendors/listVendors \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10}' | jq '.'
```

### Step 4: Search Vendors
```bash
curl -X POST http://localhost:3000/api/v1/vendors/listVendors \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "search": "survey",
    "status": "active",
    "tier": "silver"
  }' | jq '.'
```

### Step 5: Update Vendor
```bash
# Save vendor ID from create response
export VENDOR_ID="65f1a2b3c4d5e6f7g8h9i0j1"

curl -X PUT http://localhost:3000/api/v1/vendors/update/$VENDOR_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "gold",
    "status": "active"
  }' | jq '.'
```

### Step 6: Get Vendor Details
```bash
curl -X GET http://localhost:3000/api/v1/vendors/$VENDOR_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
```

---

## Vendor Tiers
- `platinum` - Top tier vendors
- `gold` - Premium vendors
- `silver` - Standard vendors
- `bronze` - Basic tier vendors

## Vendor Status
- `active` - Vendor is active and operational
- `inactive` - Vendor is temporarily inactive
- `suspended` - Vendor is suspended

## Supported Currencies
Common currency codes: `USD`, `EUR`, `GBP`, `INR`, `AUD`, `CAD`, `SGD`, `JPY`, etc.

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
  "message": "Vendor not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Vendor with this email already exists"
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

1. **Authentication Required:** All vendor endpoints require a valid JWT access token from a user with `super_admin` or `finance_manager` role.

2. **Email Uniqueness:** Vendor email addresses must be unique across the system.

3. **Automatic Tracking:** The system automatically tracks who created and last updated each vendor using the authenticated admin's email.

4. **Pagination:** The list endpoint supports pagination with a maximum of 100 items per page.

5. **Search:** The search feature looks for matches in vendor name, email, and company name fields.

6. **Optional Fields:** Most nested fields (address, redirects, bankDetails, company info details) are optional except `companyName`.
