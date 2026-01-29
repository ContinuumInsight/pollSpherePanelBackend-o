# Survey Management API Documentation

Base URL: `http://localhost:8000/api/v1/surveys`

## Public Routes (No Authentication Required)

### 1. Survey Start (Vendor Entry Point)
**GET** `/start`

Vendor entry point - when a respondent clicks on the survey link from vendor.

**Query Parameters:**
- `token` (required): JWT token containing survey_id, vendor_id, and country
- `uid` (required): Unique respondent identifier (placeholder `{{uid}}`)

**Example:**
```bash
# Note: The start URL is auto-generated when creating/updating a survey
# Format: http://localhost:8000/api/v1/surveys/start?token=<JWT_TOKEN>&uid={{uid}}

curl "http://localhost:8000/api/v1/surveys/start?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&uid=RESP123"
```

**Response:** HTML page with survey information and auto-redirect to client survey URL

---

### 2. Survey Callback (Client Completion)
**GET** `/callback/:survey_id`

Client completion endpoint - called when respondent completes/terminates the survey.

**URL Parameters:**
- `survey_id`: Survey ID

**Query Parameters:**
- `status` (required): One of `COMPLETED`, `TERMINATED`, `QUOTA_FULL`, `SECURITY`
- `uid` (required): Respondent identifier

**Example:**
```bash
curl "http://localhost:8000/api/v1/surveys/callback/abc123xyz?status=COMPLETED&uid=RESP123"
```

**Response:** HTML page with status message and auto-redirect to vendor redirect URL

---

## Protected Routes (Authentication Required)

### 3. Create Survey
**POST** `/create`

Create a new survey with all details.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "basic": {
    "name": "Customer Satisfaction Survey 2024",
    "linkType": "single",
    "loi": 15,
    "ir": 85,
    "device": "both",
    "launchType": "soft-launch",
    "reconnectStudy": "no",
    "isInternalPanel": false,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "client": {
    "clientId": "client123",
    "clientName": "ABC Corporation",
    "cpi": 5.5,
    "currency": "USD",
    "totalCompletes": 1000
  },
  "countries": [
    {
      "country": "United States",
      "targetCompletes": 500,
      "liveUrl": "https://client.com/survey?surveyid=123",
      "testUrl": "https://client.com/test/survey?surveyid=123",
      "vendors": [
        {
          "vendorId": "vendor001",
          "vendorName": "Premium Vendor",
          "allocation": 300,
          "vendorCpi": 4.5,
          "vendorCurrency": "USD",
          "quota": true,
          "redirects": {
            "completeRedirect": "https://vendor.com/complete",
            "quotaFullRedirect": "https://vendor.com/quota",
            "terminateRedirect": "https://vendor.com/terminate",
            "securityRedirect": "https://vendor.com/security"
          },
          "isActive": true
        }
      ]
    }
  ],
  "status": "LP",
  "notes": "Initial survey setup"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/surveys/create \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "basic": {
      "name": "Test Survey",
      "loi": 10,
      "ir": 80
    },
    "client": {
      "clientId": "client123"
    },
    "countries": [
      {
        "country": "USA",
        "vendors": [
          {
            "vendorId": "v001",
            "vendorName": "Vendor A",
            "allocation": 100
          }
        ]
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Survey created successfully",
  "data": {
    "id": "...",
    "surveyId": "abc123xyz",
    "basic": {
      "name": "Test Survey",
      "psCode": 1,
      "linkType": "single",
      "loi": 10,
      "ir": 80,
      "device": "both",
      "launchType": "full-launch",
      "reconnectStudy": "no",
      "isInternalPanel": false
    },
    "client": {...},
    "countries": [
      {
        "country": "USA",
        "vendors": [
          {
            "vendorId": "v001",
            "vendorName": "Vendor A",
            "allocation": 100,
            "quota": false,
            "isActive": true,
            "startUrl": "http://localhost:8000/api/v1/surveys/start?token=eyJ...",
            "redirects": {}
          }
        ]
      }
    ],
    "status": "LP",
    "totalCompletes": 0,
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. List Surveys
**POST** `/listSurveys`

Get paginated list of surveys with filters.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "page": 1,
  "limit": 10,
  "status": "LP",
  "clientId": "client123",
  "search": "customer"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/surveys/listSurveys \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10, "status": "LP"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Surveys fetched successfully",
  "data": [
    {
      "id": "...",
      "surveyId": "abc123",
      "basic": {...},
      "client": {...},
      "countries": [...],
      "status": "LP",
      "totalCompletes": 0,
      "stats": {
        "overall": {
          "initiated": 0,
          "completed": 0,
          "terminated": 0,
          "quotaFull": 0,
          "security": 0
        },
        "countries": []
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 5. Get Survey by ID
**GET** `/getSurvey/:id`

Get detailed information about a specific survey.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Example:**
```bash
curl http://localhost:8000/api/v1/surveys/getSurvey/65abc123... \
  -H "Authorization: Bearer <access_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Survey fetched successfully",
  "data": {
    "id": "65abc123...",
    "surveyId": "abc123xyz",
    "basic": {...},
    "client": {...},
    "countries": [...],
    "status": "LP",
    "totalCompletes": 0,
    "stats": {
      "overall": {...},
      "countries": [...]
    },
    "createdBy": "user_id",
    "updatedBy": "user_id",
    "notes": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 6. Update Survey
**PUT** `/update/:id`

Update survey details.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "basic": {
    "name": "Updated Survey Name",
    "loi": 20
  },
  "status": "INITIATED",
  "notes": "Updated notes"
}
```

**Example:**
```bash
curl -X PUT http://localhost:8000/api/v1/surveys/update/65abc123... \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "basic": {
      "name": "Updated Survey"
    },
    "status": "INITIATED"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Survey updated successfully",
  "data": {
    "id": "65abc123...",
    "surveyId": "abc123xyz",
    "basic": {
      "name": "Updated Survey",
      "psCode": 1,
      "loi": 20,
      ...
    },
    "status": "INITIATED",
    ...
  }
}
```

---

### 7. Change Survey Status
**PUT** `/change-status/:id`

Update only the survey status.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Valid Status Values:**
- `LP` - Live Pending
- `INITIATED` - Survey has started
- `SECURITY` - Security check
- `QUOTA` - Quota management
- `CLOSE` - Survey closed
- `COMPLETED` - Survey completed
- `TERMINATED` - Survey terminated
- `INVOICED` - Survey invoiced
- `OTHER` - Other status

**Example:**
```bash
curl -X PUT http://localhost:8000/api/v1/surveys/change-status/65abc123... \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Survey status updated successfully",
  "data": {
    "id": "65abc123...",
    "status": "COMPLETED",
    ...
  }
}
```

---

### 8. Delete Survey
**DELETE** `/delete/:id`

Delete a survey and its associated stats.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/v1/surveys/delete/65abc123... \
  -H "Authorization: Bearer <access_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Survey deleted successfully"
}
```

---

### 9. Get Survey Responses
**GET** `/surveyResponses/:id`

Get all responses for a specific survey.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```bash
curl "http://localhost:8000/api/v1/surveys/surveyResponses/abc123xyz?page=1&limit=20" \
  -H "Authorization: Bearer <access_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Survey responses fetched successfully",
  "data": [
    {
      "id": "...",
      "surveyId": "abc123xyz",
      "psCode": 1,
      "uid": "RESP123",
      "vendorId": "vendor001",
      "vendorName": "Premium Vendor",
      "country": "US",
      "status": "COMPLETED",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "startedAt": "2024-01-01T10:00:00.000Z",
      "completedAt": "2024-01-01T10:15:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:15:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Survey Flow

1. **Admin creates survey** → POST `/create`
   - System auto-generates psCode (00001, 00002, etc.)
   - System generates unique surveyId
   - System creates start URLs for each vendor-country combination
  - Stats rows are upserted on events (overall/country/vendor)

2. **Vendor sends respondent to start URL** → GET `/start?token=...&uid=...`
   - System verifies JWT token
   - System checks survey status
   - System creates survey response with status "INITIATED"
   - System updates stats (overall, country, vendor)
   - System redirects to client survey URL

3. **Client completes survey** → GET `/callback/:survey_id?status=COMPLETED&uid=...`
   - System updates response status
  - System updates stats (monotonic increment only)
   - System redirects to vendor redirect URL

4. **Admin monitors progress** → GET `/getSurvey/:id` or GET `/surveyResponses/:id`

---

## Notes

- **psCode**: Auto-incrementing 5-digit code (00001, 00002, etc.)
- **surveyId**: Unique nanoid-generated identifier
- **Start URLs**: Auto-generated with JWT token (no expiration)
- **Token Format**: Contains survey_id, vendor_id, country
- **Stats**: Updated automatically on response creation and status changes
- **Response Statuses**: INITIATED, COMPLETED, TERMINATED, QUOTA_FULL, SECURITY
- **Survey Statuses**: LP, INITIATED, SECURITY, QUOTA, CLOSE, COMPLETED, TERMINATED, INVOICED, OTHER
- **Authorization**: All authenticated users can access survey APIs (no role restriction)

---

## Environment Variables

Add to `.env`:
```
BASE_URL=http://localhost:8000
```

This is used to generate survey start URLs.
