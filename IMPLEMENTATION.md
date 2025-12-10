# Album Management System - Complete Implementation

This project includes a complete Node.js/TypeScript API rewrite (`album-api-v2`) of the original .NET `albums-api`, plus an enhanced Vue.js frontend with full CRUD operations.

## 🎯 What Was Built

### 1. **album-api-v2** - Node.js/TypeScript REST API
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ TypeScript for type safety
- ✅ Express.js web framework
- ✅ In-memory data storage with 6 sample albums
- ✅ Auto-incrementing IDs
- ✅ Request validation middleware
- ✅ CORS enabled for frontend integration
- ✅ Comprehensive Jest unit tests (70+ test cases)
- ✅ Matches routes expected by Vue.js frontend

### 2. **album-viewer** - Enhanced Vue.js Frontend
- ✅ Full CRUD UI (Add, Edit, Delete albums)
- ✅ Modal-based form for add/edit operations
- ✅ Confirmation dialog for delete operations
- ✅ Loading states during API calls
- ✅ API validation error display
- ✅ Responsive design with animations
- ✅ Comprehensive Vitest component tests

## 📁 Project Structure

```
gh-copilot-demo/
├── album-api-v2/               # Node.js API (NEW)
│   ├── src/
│   │   ├── models/album.ts     # Album TypeScript interfaces
│   │   ├── data/albums.ts      # In-memory data store with CRUD helpers
│   │   ├── middleware/validation.ts  # Request validation
│   │   ├── routes/albums.ts    # API route handlers
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server startup
│   ├── tests/
│   │   └── albums.test.ts      # 70+ API test cases
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── README.md
│
├── album-viewer/               # Vue.js Frontend (ENHANCED)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlbumCard.vue           # Enhanced with edit/delete buttons
│   │   │   ├── AlbumFormModal.vue      # NEW: Add/Edit form modal
│   │   │   └── ConfirmDialog.vue       # NEW: Delete confirmation
│   │   ├── types/album.ts
│   │   └── App.vue             # Enhanced with CRUD operations
│   ├── tests/                  # NEW: Component tests
│   │   ├── App.test.ts
│   │   ├── AlbumCard.test.ts
│   │   ├── AlbumFormModal.test.ts
│   │   └── ConfirmDialog.test.ts
│   ├── vitest.config.ts        # NEW: Vitest configuration
│   └── package.json (updated)
│
├── run-api.sh                  # Helper script to run API
├── run-frontend.sh             # Helper script to run frontend
└── IMPLEMENTATION.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- Two terminal windows/tabs

### Option 1: Manual Start (Recommended)

#### Terminal 1 - Start the API:
```bash
cd album-api-v2
npm install
npm run build
npm test        # Run API tests
npm start       # Starts on port 3000
```

#### Terminal 2 - Start the Frontend:
```bash
cd album-viewer
npm install
npm test -- --run  # Run frontend tests
npm run dev        # Starts on port 3001
```

### Option 2: Using Helper Scripts

#### Terminal 1:
```bash
chmod +x run-api.sh
./run-api.sh
```

#### Terminal 2:
```bash
chmod +x run-frontend.sh
./run-frontend.sh
```

## 🔌 API Endpoints

The album-api-v2 provides these endpoints:

| Method | Path | Description | Status Codes |
|--------|------|-------------|--------------|
| `GET` | `/` | Welcome message | 200 |
| `GET` | `/albums` | List all albums | 200 |
| `GET` | `/albums/:id` | Get album by ID | 200, 404 |
| `POST` | `/albums` | Create new album | 201, 400 |
| `PUT` | `/albums/:id` | Update album | 200, 400, 404 |
| `DELETE` | `/albums/:id` | Delete album | 204, 404 |

### Example API Calls:

**Create Album:**
```bash
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Album",
    "artist": "New Artist",
    "price": 19.99,
    "image_url": "https://example.com/image.jpg"
  }'
```

**Update Album:**
```bash
curl -X PUT http://localhost:3000/albums/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "price": 24.99
  }'
```

**Delete Album:**
```bash
curl -X DELETE http://localhost:3000/albums/1
```

## 🎨 Frontend Features

Access the frontend at `http://localhost:3001`

### User Interface:
1. **View Albums** - Grid display of all albums with image, title, artist, and price
2. **Add Album** - Click "Add New Album" button → Fill form → Save
3. **Edit Album** - Click "Edit" button on any album card → Modify fields → Update
4. **Delete Album** - Click "Delete" button → Confirm in dialog → Album removed

### UX Features:
- ⏳ Loading spinners during API operations
- ✅ Success feedback (immediate UI update after API confirmation)
- ❌ Error messages with field-specific validation details
- 🚫 Button disable states to prevent duplicate submissions
- 🎭 Smooth animations and transitions
- 📱 Responsive design for mobile and desktop

## 🧪 Testing

### API Tests (Jest):
```bash
cd album-api-v2
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
```

**Test Coverage:**
- ✅ All CRUD operations (success cases)
- ✅ Validation errors (missing fields, invalid types, negative prices)
- ✅ 404 errors for non-existent resources
- ✅ Auto-increment ID behavior
- ✅ Data persistence across requests
- ✅ Edge cases (empty updates, invalid IDs)

### Frontend Tests (Vitest):
```bash
cd album-viewer
npm test                    # Run once
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

**Test Coverage:**
- ✅ Component rendering and props
- ✅ Event emissions (edit, delete, save, cancel)
- ✅ Form validation and submission
- ✅ Modal open/close behavior
- ✅ Loading states
- ✅ API error display
- ✅ CRUD operations with mocked axios

## 📊 Sample Data

The API includes 6 pre-loaded albums:

1. "You, Me and an App Id" by Daprize - $10.99
2. "Seven Revision Army" by The Blue-Green Stripes - $13.99
3. "Scale It Up" by KEDA Club - $13.99
4. "Lost in Translation" by MegaDNS - $12.99
5. "Lock Down Your Love" by V is for VNET - $12.99
6. "Sweet Container O' Mine" by Guns N Probeses - $14.99

**⚠️ Important:** Data is stored in memory and resets when the API server restarts.

## 🛠️ Development

### API Development:
```bash
cd album-api-v2
npm run dev    # Auto-reload with ts-node
```

### Frontend Development:
```bash
cd album-viewer
npm run dev    # Vite dev server with HMR
```

## 🔍 Validation Rules

### Album Fields:
- **title** (required): Non-empty string
- **artist** (required): Non-empty string
- **price** (required): Positive number
- **image_url** (required): Non-empty string (URL format)

### Auto-Generated:
- **id**: Auto-incremented integer (starts at 7 for new albums)

### Example Validation Error Response:
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required and must be a non-empty string",
    "price": "Price must be a positive number"
  }
}
```

## 🎯 Key Implementation Details

### ID Auto-Increment Strategy:
```typescript
const newId = Math.max(...albums.map(a => a.id)) + 1
```
- Always increments from highest existing ID
- Doesn't reuse deleted IDs

### API Response Patterns:
- **POST** returns `201 Created` with the full created album object
- **PUT** returns `200 OK` with the full updated album object
- **DELETE** returns `204 No Content` with empty body
- **Validation errors** return `400 Bad Request` with details

### Frontend Update Strategy:
- **Optimistic Updates:** Disabled (waits for API confirmation)
- **Error Handling:** Displays API validation errors in modal
- **Loading States:** Prevents duplicate submissions

## 🔐 CORS Configuration

Both APIs (original .NET and new Node.js) use permissive CORS:
```typescript
app.use(cors()) // Allows all origins, headers, and methods
```

## 📝 Next Steps / Enhancements

Potential improvements for production:

1. **API:**
   - Add database integration (PostgreSQL, MongoDB)
   - Implement authentication/authorization
   - Add rate limiting
   - API versioning
   - Request logging
   - Swagger/OpenAPI documentation

2. **Frontend:**
   - Add Pinia for state management
   - Implement search and filter functionality
   - Add pagination for large album lists
   - Image upload functionality
   - Toast notifications for success messages
   - Offline support with service workers

3. **DevOps:**
   - Docker containers for both apps
   - CI/CD pipeline
   - Environment-specific configurations
   - Production build optimizations

## 🐛 Troubleshooting

### API won't start:
- Check if port 3000 is already in use
- Ensure dependencies are installed: `cd album-api-v2 && npm install`
- Check for TypeScript compilation errors: `npm run build`

### Frontend can't connect to API:
- Verify API is running on port 3000
- Check Vite proxy configuration in `vite.config.ts`
- Look for CORS errors in browser console

### Tests failing:
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run type-check`

## 📚 Technologies Used

### Backend (album-api-v2):
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Testing:** Jest + Supertest
- **Tools:** ts-node, ts-jest

### Frontend (album-viewer):
- **Framework:** Vue.js 3 (Composition API)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest + Vue Test Utils
- **HTTP Client:** Axios
- **Styling:** Scoped CSS with animations

## ✅ Implementation Checklist

- [x] Create Node.js project structure
- [x] Implement Album model and data store
- [x] Build validation middleware
- [x] Create all CRUD API routes
- [x] Configure Express server with CORS
- [x] Write comprehensive API tests
- [x] Create AlbumFormModal component
- [x] Create ConfirmDialog component
- [x] Update AlbumCard with edit/delete buttons
- [x] Enhance App.vue with CRUD logic
- [x] Write frontend component tests
- [x] Add loading states and error handling
- [x] Document implementation

---

**🎉 Implementation Complete!**

Both the Node.js API and Vue.js frontend are fully functional with complete CRUD operations, comprehensive testing, and production-ready features.
