# Album API v2

A Node.js/TypeScript REST API for managing music albums. This is a rewrite of the original `albums-api` (written in .NET).

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- In-memory data storage
- TypeScript for type safety
- Input validation
- CORS enabled
- Comprehensive unit tests

## Data Storage

**Important:** This API uses in-memory storage for album data. All data will be reset when the server restarts. This is intentional for demonstration purposes and development convenience.

## API Endpoints

### Get Welcome Message
```
GET /
```
Returns a welcome message.

### List All Albums
```
GET /albums
```
Returns an array of all albums.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "You, Me and an App Id",
    "artist": "Daprize",
    "price": 10.99,
    "image_url": "https://aka.ms/albums-daprlogo"
  }
]
```

### Get Album by ID
```
GET /albums/:id
```
Returns a single album by ID.

**Response:** `200 OK` or `404 Not Found`

### Create Album
```
POST /albums
```
Creates a new album. ID is auto-generated.

**Request Body:**
```json
{
  "title": "Album Title",
  "artist": "Artist Name",
  "price": 12.99,
  "image_url": "https://example.com/image.jpg"
}
```

**Response:** `201 Created`
```json
{
  "id": 7,
  "title": "Album Title",
  "artist": "Artist Name",
  "price": 12.99,
  "image_url": "https://example.com/image.jpg"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "details": {
    "price": "Must be a positive number"
  }
}
```

### Update Album
```
PUT /albums/:id
```
Updates an existing album.

**Request Body:** Same as Create Album

**Response:** `200 OK` with updated album or `404 Not Found`

### Delete Album
```
DELETE /albums/:id
```
Deletes an album by ID.

**Response:** `204 No Content` or `404 Not Found`

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Run

```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

The API will be available at `http://localhost:3000`

## Test

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Configuration

- **Port:** 3000 (hardcoded in `src/server.ts`)
- **CORS:** Enabled for all origins
- **Data:** 6 sample albums included by default

## Sample Data

The API includes 6 sample albums:
1. "You, Me and an App Id" by Daprize
2. "Seven Revision Army" by The Blue-Green Stripes
3. "Scale It Up" by KEDA Club
4. "Lost in Translation" by MegaDNS
5. "Lock Down Your Love" by V is for VNET
6. "Sweet Container O' Mine" by Guns N Probeses
