# Apollo 247 Clone

A clone of Apollo 247's doctor consultation platform built with Next.js, Node.js, TypeScript, and MySQL.

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### MySQL Setup
1. Install MySQL and ensure it's running
2. Note your MySQL username and password (you'll need these for the .env file)

### Installation Steps

1. First, add the project files to your local system

2. Set up environment variables:
Create a `.env` file in the backend directory with the following content:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=apollo_db
PORT=5000
```
Replace `your_mysql_username` and `your_mysql_password` with your MySQL credentials.

3. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. Set up the database:
```bash
# From the backend directory
cd backend
npm run setup-db
```
This script will:
- Create the apollo_db database if it doesn't exist
- Create all required tables from schema.sql
- Add 6 sample doctors (3 male, 3 female) with their images
- Set up consultation modes, languages, and facilities
- Create all necessary relationships between doctors and their data

5. Start the development servers:
```bash
# From the root directory
npm run dev
```
This starts:
- Frontend server on http://localhost:3000
- Backend server on http://localhost:5000

## API Documentation

### Available Filter Values

#### Consultation Modes:
- ID 1: Online
- ID 2: Hospital Visit

#### Languages:
- ID 1: English
- ID 2: Hindi
- ID 3: Gujarati
- ID 4: Kannada
- ID 5: Tamil
- ID 6: Telugu
- ID 7: Marathi

#### Facilities:
- ID 1: Apollo Hospital
- ID 2: Apollo Clinic

### 1. List/Filter Doctors API
```
GET http://localhost:5000/api/doctors
```

Query Parameters:
- `modeIds`: Filter by consultation modes (e.g., `1,2` for Online and Hospital Visit)
- `experienceMin`, `experienceMax`: Filter by years of experience range
- `feesMin`, `feesMax`: Filter by consultation fees range
- `languageIds`: Filter by languages spoken (e.g., `1,2` for English and Hindi)
- `facilityIds`: Filter by available facilities
- `sortBy`: Sort results by:
  - `relevance` (default)
  - `experience_high`
  - `experience_low`
  - `fees_high`
  - `fees_low`
  - `rating`
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

Examples using curl:
```bash
# Get all doctors (first page)
curl "http://localhost:5000/api/doctors"

# Get English-speaking doctors with 5+ years experience
curl "http://localhost:5000/api/doctors?languageIds=1&experienceMin=5"

# Get doctors who do online consultation, sorted by rating
curl "http://localhost:5000/api/doctors?modeIds=1&sortBy=rating"

# Get doctors with fees between 500-1000
curl "http://localhost:5000/api/doctors?feesMin=500&feesMax=1000"

# Get page 2 of results
curl "http://localhost:5000/api/doctors?page=2"
```

### 2. Add Doctor API
```
POST http://localhost:5000/api/doctors
Content-Type: application/json
```

Testing with curl:
```bash
curl -X POST http://localhost:5000/api/doctors \
-H "Content-Type: application/json" \
-d '{
  "name": "Dr. Test Doctor",
  "specialty": "General Physician",
  "experience": 10,
  "qualifications": "MBBS, MD",
  "location": "Mumbai",
  "fees": 500,
  "rating": 4.5,
  "recommendations": 100,
  "profile_image": "/images/doctors/pexels-pixabay-415829.jpg",
  "consultation_modes": [
    {"id": "1", "name": "Online"},
    {"id": "2", "name": "Hospital Visit"}
  ],
  "languages": [
    {"id": "1", "name": "English"},
    {"id": "2", "name": "Hindi"}
  ],
  "facilities": [
    {"id": "1", "name": "Apollo Hospital"}
  ]
}'
```

All fields in the request body are required. The profile_image should point to an existing image in the frontend's public directory.

## Features
- Doctors listing with filters
- 6 sample doctors (3 male, 3 female)
- Filter by:
  - Consultation mode (Online/Hospital Visit)
  - Experience range
  - Consultation fees range
  - Languages
  - Hospital facilities
- Sort by relevance, experience, fees, rating
- Pagination (10 doctors per page)
- URL-based filters that persist on refresh
- Responsive design

## Database Schema

### Tables:
1. doctors
   - id (PK)
   - name
   - specialty
   - experience
   - qualifications
   - location
   - fees
   - rating
   - recommendations
   - profile_image

2. consultation_modes
   - id (PK)
   - name

3. languages
   - id (PK)
   - name

4. facilities
   - id (PK)
   - name

5. doctor_consultation_modes
   - doctor_id (FK)
   - mode_id (FK)

6. doctor_languages
   - doctor_id (FK)
   - language_id (FK)

7. doctor_facilities
   - doctor_id (FK)
   - facility_id (FK)

Full schema available in `backend/src/config/schema.sql`
