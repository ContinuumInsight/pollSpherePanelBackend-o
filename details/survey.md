


## apis
```
router.get('/start' );
router.get('/callback' );
router.get('/stats/:surveyId' );
router.post('/create', authorize );
router.post('/listSurveys');
router.get('/getSurvey);
router.put('/update);
router.delete('/delete);
router.put('/change-status);
 
```


### survey details

```
    const vendorSchema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true
  },
  vendor_name: {
    type: String,
    required: true
  },
  allocation: {
    type: Number,
    required: true
  },
  vendor_cpi: Number,
  vendor_currency: String,
  quota: {
    type: Boolean,
    default: false
  },
  redirects: {
    complete_redirect: String,
    quota_full_redirect: String,
    terminate_redirect: String,
    security_redirect: String
  },
  start_url: String,
  is_active: { type: Boolean, default: true }
}, { _id: false });

// Country object with nested vendors
const countrySchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  target_completes: Number,
  live_url: String,
  test_url: String,
  vendors: [vendorSchema]
}, { _id: false });

// Basic survey details
const basicDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  psCode:Number
  link_type: {
    type: String,
    enum: ['single', 'multiple'],
    default: 'single'
  },
  loi: {
    type: Number, // Length of interview
    required: true
  },
  ir: {
    type: Number, // Incidence rate
    required: true
  },
  device: {
    type: String,
    enum: ['mobile', 'desktop', 'both'],
    default: 'both'
  },
  launch_type: {
    type: String,
    enum: ['soft-launch', 'full-launch'],
    default: 'full-launch'
  },
  reconnect_study: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  is_internal_panel: {
    type: Boolean,
    default: false
  },
  
  start_date: Date,
  end_date: Date
}, { _id: false });

// Client details
const clientDetailsSchema = new mongoose.Schema({
  client_id: {
    type: String,
    required: true
  },
  client_name: String,
  cpi: Number,
  currency: String,
  total_completes: Number
}, { _id: false });

// Main Survey Panel Schema
const surveyPanelSchema = new mongoose.Schema({
  survey_id: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  basic: basicDetailsSchema,
  client: clientDetailsSchema,
  countries: [countrySchema],
  status: {
    type: String,
   
    default: 'LIVE',
    index: true
  },
  total_completes: {
    type: Number,
    default: 0
  },
  created_by: {
    type: String,
    required: true
  },
  updated_by: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

```


# Survey Routes (Backend)


## Public routes (no auth)

### `GET /start`
- **Purpose:** Vendor starts a respondent session and receives a redirect URL.
- **Query params:**
  - t: SIGNED_TOKEN
  - `uid` (string; respondent identifier)
- **How it works (short):**
  - Loads the survey panel by `survey_id`.
  - Validates survey is active and vendor is allowed.
  - Creates a `SurveyResponse` record (respondent tracking).
  - add or update survey stats 
  - redirect on  `live_url`.

### `GET /callback`
- **Purpose:** Client callback to finalize respondent outcome and get the vendor redirect.

- **Query params:**
  - `uid` (string)
  - `status` (string; one of `completed | terminated | quota_full | security`)
- **How it works (short):**
  - Finds the matching `SurveyResponse` by `( uid)`.
  - Updates response status + timestamps.
  - Increments stats counters (overall / country / vendor) in `SurveyStats`.
  - hit vendor redirect url according to status.


### `GET /surveyResponses/:surveyId`
- **Purpose:** Returns survey responses matching by surveyId.
- **Path params:**
  - `surveyId` (string)


### `POST /create`
- **Purpose:** Creates a new survey panel definition.
- **Body (high level):**
  - `basic` (object)
  - `client` (object)
  - `countries` (array of countries, each with nested `vendors`)
  - optional: `status`, `notes`
- **How it works (short):**
  - Validates required fields.
  - generate a **5-digit numeric** `psCode` that auto-increments by 1 on each new survey.
- Format: `00001`, `00002`, `00003`, ...
- Must be **atomic** (no duplicates even if 2 surveys are   created at the same time)
  - Creates `SurveyPanel`.
  - Uses Mongo `_id` as `survey_id` and generates vendor `start_url`.
- **Start url logic :**
 - `start_url` should look like:
  - `.../api/survey/start?t=<SIGNED_TOKEN>&uid=[XXXX]`
  - in SIGNED_TOKEN pass survey_id, vendor_id, country


### `POST /listSurveys`
- **Purpose:** List surveys with pagination + joined all stats.
- **Body (filters/pagination):**
  - `page`, `pageSize`
  - optional filters: `status`, `survey_id`, `client_id`, `created_by`
- **How it works (short):**
  - Aggregates `SurveyPanel` and `$lookup`s `SurveyStats`.
  - Returns surveys + `overall_stats`, `country_stats`, `vendor_stats`.


### `GET /getSurvey/:surveyId`
- **Purpose:** Fetch a single survey panel with all stats.
- **Path params:** `surveyId`


### `PUT /update/:surveyId`
- **Purpose:** Updates a survey panel.
- **How it works (short):**
  - Validates role.
  - Updates matching `SurveyPanel` by `survey_id`.
 

### `DELETE /delete/:surveyId`
- **Purpose:** Deletes a survey panel.
- **Notes:** Admin-only.
 

### `PUT /change-status/:surveyId`
- **Purpose:** Changes survey status.
- **Handler:** `changeSurveyStatusController`
- **Body:** `{ "status": "..." }`
 

## MongoDB schemas / collections

### `Survey` (collection: `surveys`)
- `survey_id` (string; usually `_id.toString()`, indexed)
- `basic` (name, psCode, link_type, loi, ir, device, launch_type, dates...)
- `client` (client_id, client_name, cpi, currency, total_completes)
- `countries[]`
  - `country`, `live_url`, `test_url`, `target_completes`
  - `vendors[]`
    - `vendor_id`, `vendor_name`, `allocation`, `vendor_cpi`, `vendor_currency`
    - `redirects` (complete/quota_full/terminate/security)
    - `start_url`, `is_active`
- `status` (enum in schema)
- audit fields: `created_by`, `updated_by`, `createdAt`, `updatedAt`

### `SurveyResponse` (collection: `surveyresponses`)
- Unique key: `(survey_id, uid)`
- Tracks a single respondent session:
  - `survey_id`, `vendor_id`, `uid`, `country`
  - `status` (enum: `initiated | completed | terminated | quota_full | security`)
  - `start_time`, `end_time`, `duration_seconds`
  - `ip`, `user_agent`

### `SurveyStats` (collection: `surveystats`)
- One doc per `(survey_id, country_code|null, vendor_id|null)`
  - overall: both null
  - country-level: country_code set, vendor_id null
  - vendor-level: both set
- `stats`: counter object with `initiated`, `completed`, `terminated`, `quota_full`, `security`

### survey register logic 
  - Validates required fields.
  - generate a **5-digit numeric** `psCode` that auto-increments by 1 on each new survey.
  - Format: `00001`, `00002`, `00003`, ...
  - Must be **atomic** (no duplicates even if 2 surveys are   created at the same time)
  - Uses Mongo `_id` as `survey_id` and generates vendor `start_url`.
  - `start_url` should look like:
    `.../api/survey/start?t=<SIGNED_TOKEN>&uid=[XXXX]`
  - for creating start url  create a  SIGNED_TOKEN in this token pass survey_id, vendor_id, country
  - in SIGNED_TOKEN pass survey_id, vendor_id, country

### survey start and update logic 
 - when survey start decode SIGNED_TOKEN and get details  from that
 - when survey initiated if all okay add details in survey responses and add or update survey stats in survey stats
 - redirect respondent to live url and put uid in start url pid
 - create a html pages, when survey starting and if any error show this page with error
 - when Client callback to finalize respondent outcome upadte survey response and stats
 - for updating response use uid
 - after updating response get survey id, vendor id and country frome survey response and update survey stats
 - after doing all these hit vendor redirect url according to status 







