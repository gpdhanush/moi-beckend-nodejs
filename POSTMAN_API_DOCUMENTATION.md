# Postman API Documentation - Moi Credit/Debit System

## Base URL
```
http://localhost:3000/apis
```
*(Replace with your actual server URL if different)*

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

**Note:** The registration endpoint (`/apis/user/create`) requires an API key instead of JWT token. See User Management section below.

---

## 0. USER MANAGEMENT ENDPOINTS

### 0.1 Register New User
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/user/create`  
**Headers:**
```
X-API-Key: MY_SON_NAME_IS_RENZO_ROWAN
Content-Type: application/json
```
**⚠️ Important:** This endpoint requires the `X-API-Key` header (not JWT token). The API key must match the `API_SECRET_KEY` value in your `.env` file.

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "9876543210",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்."
  }
}
```

**Error Responses:**

**Missing API Key (401):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "API key is required. Please include X-API-Key header."
  }
}
```

**Invalid API Key (403):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "Invalid API key. Access denied."
  }
}
```

**Missing Required Fields (400):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "அனைத்து புலங்களும் (பெயர், மின்னஞ்சல், மொபைல், கடவுச்சொல்) தேவையானவை!"
  }
}
```

**Duplicate Email (404):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!"
  }
}
```

**Duplicate Mobile (404):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!"
  }
}
```

**Rate Limit Exceeded (429):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "Too many registration attempts from this IP. Please try again after 15 minutes."
  }
}
```

**Rate Limiting:** Maximum 5 registration attempts per IP address per 15 minutes.

---

### 0.2 User Login
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/user/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "responseType": "S",
  "responseValue": {
    "id": 1,
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john.doe@example.com",
    "last_login": "2025-01-15 10:30:00",
    "profile_image": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Use the `token` from this response for authenticated requests.**

---

## 1. MOI CREDIT/DEBIT ENDPOINTS

### 1.1 Get Dashboard (Summary + Transactions)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/dashboard`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "userId": 1
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "personDetails": {
      "id": 1,
      "firstName": "S",
      "secondName": "சிவசங்கரன்",
      "parentName": "மணிமேகலை",
      "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
      "city": "செல்வநாயகபுரம் திருப்பூர்",
      "mobile": "9876543210"
    },
    "summary": {
      "moiReturn": 1000,
      "moiInvest": 500,
      "total": -500,
      "memberCount": 1
    },
    "transactions": [
      {
        "id": 1,
        "index": 1,
        "date": "24/05/2023",
        "functionName": "இல்ல புதுமனை புகுவிழா",
        "type": "RETURN",
        "mode": "MONEY",
        "amount": 1000,
        "remarks": "ஆண்டவர் மஹால் செங்கோட்டை",
        "person": {
          "id": 1,
          "firstName": "S",
          "secondName": "சிவசங்கரன்",
          "parentName": "மணிமேகலை",
          "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
          "city": "செல்வநாயகபுரம் திருப்பூர்",
          "mobile": "9876543210"
        }
      }
    ],
    "count": 1
  }
}
```

---

### 1.2 Get Transactions List (with filters)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/list`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON) - All fields optional:**
```json
{
  "userId": 1,
  "type": "RETURN",
  "search": "சிவசங்கரன்",
  "date": "2023-05-24"
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "count": 1,
  "responseValue": [
    {
      "id": 1,
      "index": 1,
      "date": "24/05/2023",
      "functionName": "இல்ல புதுமனை புகுவிழா",
      "type": "RETURN",
      "mode": "MONEY",
      "amount": 1000,
      "remarks": "ஆண்டவர் மஹால் செங்கோட்டை",
      "person": {
        "id": 1,
        "firstName": "S",
        "secondName": "சிவசங்கரன்",
        "parentName": "மணிமேகலை",
        "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
        "city": "செல்வநாயகபுரம் திருப்பூர்",
        "mobile": "9876543210"
      }
    }
  ]
}
```

---

### 1.3 Add Moi Return (Credit)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/return`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "userId": 1,
  "personId": 1,
  "functionId": 7,
  "mode": "MONEY",
  "date": "2023-05-24",
  "amount": 1000,
  "remarks": "ஆண்டவர் மஹால் செங்கோட்டை"
}
```
**For THINGS mode:**
```json
{
  "userId": 1,
  "personId": 1,
  "functionId": 7,
  "mode": "THINGS",
  "date": "2023-05-24",
  "amount": 0,
  "remarks": "தங்கம், வெள்ளி"
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "மொய் வரவு வெற்றிகரமாக சேர்க்கப்பட்டது.",
    "id": 1
  }
}
```

---

### 1.4 Add Moi Invest (Debit)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/invest`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "userId": 1,
  "personId": 1,
  "functionId": 3,
  "mode": "MONEY",
  "date": "2019-06-27",
  "amount": 500,
  "remarks": "MN மஹால் திருநெல்வேலி"
}
```
**For THINGS mode:**
```json
{
  "userId": 1,
  "personId": 1,
  "functionId": 3,
  "mode": "THINGS",
  "date": "2019-06-27",
  "amount": 0,
  "remarks": "தங்க காதணி"
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "மொய் செலவு வெற்றிகரமாக சேர்க்கப்பட்டது.",
    "id": 2
  }
}
```

---

### 1.5 Update Transaction
**Method:** `PUT`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/update`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON) - All fields except userId and id are optional:**
```json
{
  "userId": 1,
  "id": 1,
  "personId": 1,
  "functionId": 7,
  "type": "RETURN",
  "mode": "MONEY",
  "date": "2023-05-25",
  "amount": 1500,
  "remarks": "Updated remarks"
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "தரவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
  }
}
```

---

### 1.6 Get Transaction by ID
**Method:** `GET`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/1`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "id": 1,
    "userId": 1,
    "personId": 1,
    "functionId": 7,
    "type": "RETURN",
    "mode": "MONEY",
    "date": "2023-05-24",
    "amount": 1000,
    "remarks": "ஆண்டவர் மஹால் செங்கோட்டை",
    "person": {
      "id": 1,
      "firstName": "S",
      "secondName": "சிவசங்கரன்",
      "parentName": "மணிமேகலை",
      "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
      "city": "செல்வநாயகபுரம் திருப்பூர்",
      "mobile": "9876543210"
    },
    "functionName": "இல்ல புதுமனை புகுவிழா"
  }
}
```

---

### 1.7 Delete Transaction
**Method:** `DELETE`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/1`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "பதிவு வெற்றிகரமாக நீக்கப்பட்டது."
  }
}
```

---

## 2. MOI DEFAULT FUNCTIONS ENDPOINTS

### 2.1 Get Functions List (for dropdown)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-default-functions/list`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON) - userId is optional:**
```json
{
  "userId": 1
}
```
**Or without userId:**
```json
{}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "count": 38,
  "responseValue": [
    {
      "id": 1,
      "name": "திருமண நிச்சயதார்த்த விழா",
      "userId": 0
    },
    {
      "id": 2,
      "name": "நிச்சயதார்த்த விழா",
      "userId": 0
    },
    {
      "id": 3,
      "name": "இல்ல காதணி விழா",
      "userId": 0
    },
    {
      "id": 7,
      "name": "இல்ல புதுமனை புகுவிழா",
      "userId": 0
    }
  ]
}
```

---

### 2.2 Get Function by ID
**Method:** `GET`  
**URL:** `http://localhost:3000/apis/moi-default-functions/7`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "id": 7,
    "name": "இல்ல புதுமனை புகுவிழா",
    "userId": 0
  }
}
```

---

## 3. MOI PERSONS ENDPOINTS

### 3.1 Get Persons List
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-persons/list`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON) - search is optional:**
```json
{
  "userId": 1,
  "search": "சிவசங்கரன்"
}
```
**Or without search:**
```json
{
  "userId": 1
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "count": 1,
  "responseValue": [
    {
      "id": 1,
      "firstName": "S",
      "secondName": "சிவசங்கரன்",
      "parentName": "மணிமேகலை",
      "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
      "city": "செல்வநாயகபுரம் திருப்பூர்",
      "mobile": "9876543210"
    }
  ]
}
```

---

### 3.2 Create Person
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-persons/create`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON) - Only firstName is required:**
```json
{
  "userId": 1,
  "firstName": "S",
  "secondName": "சிவசங்கரன்",
  "parentName": "மணிமேகலை",
  "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
  "city": "செல்வநாயகபுரம் திருப்பூர்",
  "mobile": "9876543210"
}
```
**Minimal body:**
```json
{
  "userId": 1,
  "firstName": "Test Person"
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "நபர் வெற்றிகரமாக சேர்க்கப்பட்டது.",
    "id": 1
  }
}
```

---

### 3.3 Update Person
**Method:** `PUT`  
**URL:** `http://localhost:3000/apis/moi-persons/update`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "userId": 1,
  "id": 1,
  "firstName": "S",
  "secondName": "சிவசங்கரன்",
  "parentName": "மணிமேகலை",
  "business": "Updated Business Name",
  "city": "Updated City",
  "mobile": "9876543210"
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "நபர் விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
  }
}
```

---

### 3.4 Get Person by ID
**Method:** `GET`  
**URL:** `http://localhost:3000/apis/moi-persons/1`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "id": 1,
    "userId": 1,
    "firstName": "S",
    "secondName": "சிவசங்கரன்",
    "parentName": "மணிமேகலை",
    "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
    "city": "செல்வநாயகபுரம் திருப்பூர்",
    "mobile": "9876543210"
  }
}
```

---

### 3.5 Get Person Details (for current user header)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-persons/details`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "userId": 1
}
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "id": 1,
    "firstName": "S",
    "secondName": "சிவசங்கரன்",
    "parentName": "மணிமேகலை",
    "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
    "city": "செல்வநாயகபுரம் திருப்பூர்",
    "mobile": "9876543210"
  }
}
```

---

### 3.6 Delete Person
**Method:** `DELETE`  
**URL:** `http://localhost:3000/apis/moi-persons/1`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Sample Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "நபர் வெற்றிகரமாக நீக்கப்பட்டது."
  }
}
```

---

## Complete Flow Example

### Step 0: Register New User (if not already registered)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/user/create`  
**Headers:** `X-API-Key: MY_SON_NAME_IS_RENZO_ROWAN`  
**Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "9876543210",
  "password": "SecurePassword123"
}
```
**Response:** User registered successfully

---

### Step 1: Login to get token
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/user/login`  
**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```
**Response:** Get `token` from response

---

### Step 2: Get Functions List (for dropdown)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-default-functions/list`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "userId": 1
}
```

---

### Step 3: Create Person (if not exists)
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-persons/create`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "userId": 1,
  "firstName": "S",
  "secondName": "சிவசங்கரன்",
  "parentName": "மணிமேகலை",
  "business": "உரிமையாளர் SS எண்டர்பிரைசஸ்",
  "city": "செல்வநாயகபுரம் திருப்பூர்",
  "mobile": "9876543210"
}
```
**Response:** Get `personId` from response

---

### Step 4: Add Moi Return
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/return`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "userId": 1,
  "personId": 1,
  "functionId": 7,
  "mode": "MONEY",
  "date": "2023-05-24",
  "amount": 1000,
  "remarks": "ஆண்டவர் மஹால் செங்கோட்டை"
}
```

---

### Step 5: Get Dashboard
**Method:** `POST`  
**URL:** `http://localhost:3000/apis/moi-credit-debit/dashboard`  
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "userId": 1
}
```

---

## Notes

1. **Date Format:** Use `YYYY-MM-DD` format (e.g., "2023-05-24")
2. **Mode Values:** Use `"MONEY"` or `"THINGS"` (case-insensitive, will be converted to uppercase)
3. **Type Values:** Use `"RETURN"` for credit or `"INVEST"` for debit
4. **Amount:** Required for MONEY mode, should be 0 for THINGS mode
5. **Function IDs:** Get from `/moi-default-functions/list` endpoint
6. **Person ID:** Get from `/moi-persons/create` or `/moi-persons/list` endpoint
7. **All endpoints return:** `responseType: "S"` for success or `"F"` for failure
8. **Error responses:** Always check `responseType` before accessing `responseValue`
