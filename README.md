# Github Copilot demo 

## Demo Scenarios

### To start discovering Github Copilot jump to [`The Ultimate GitHub Copilot Tutorial on MOAW`](https://aka.ms/github-copilot-hol)
<br/>

## Solution Overview

This repository has been inspired by the [Azure Container Apps: Dapr Albums Sample](https://github.com/Azure-Samples/containerapps-dapralbums)

It's used as a code base to demonstrate Github Copilot capabilities.

The solution is composed of three services:
- The original .NET album API (`albums-api`)
- The NEW Node.js/TypeScript album API (`album-api-v2`)
- The Vue.js album viewer with full CRUD operations (`album-viewer`)

### Album API - .NET (`albums-api`)

The original [`albums-api`](./albums-api) is a .NET 8 minimal Web API that manages a list of Albums in memory.

### Album API v2 - Node.js (`album-api-v2`) 🆕

The NEW [`album-api-v2`](./album-api-v2) is a Node.js/TypeScript REST API that is a complete rewrite of the .NET albums-api with:
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ TypeScript with Express.js
- ✅ Request validation with detailed error messages
- ✅ Auto-incrementing IDs
- ✅ 70+ comprehensive Jest unit tests
- ✅ In-memory data storage with 6 sample albums
- ✅ CORS enabled for frontend integration

### Album Viewer (`album-viewer`)

The enhanced [`album-viewer`](./album-viewer) is a modern Vue.js 3 application built with TypeScript featuring:
- ✅ Full CRUD interface (Add, Edit, Delete albums)
- ✅ Modal-based forms with validation error display
- ✅ Delete confirmation dialogs
- ✅ Loading states and error handling
- ✅ Responsive design with animations
- ✅ Vitest component tests

The application uses the Vue 3 Composition API with full TypeScript support for enhanced developer experience and type safety.

## Getting Started

There are multiple ways to run this solution locally. Choose the method that best fits your development workflow.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [TypeScript](https://www.typescriptlang.org/) (automatically installed with project dependencies)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Quick Start with album-api-v2 (Node.js) 🆕

This is the recommended way to run the new TypeScript API with full CRUD functionality.

#### Terminal 1 - Start the Node.js API:
```bash
cd album-api-v2
npm install
npm run build
npm test        # Optional: Run 70+ tests
npm start       # Starts on port 3000
```

#### Terminal 2 - Start the Vue.js Frontend:
```bash
cd album-viewer
npm install
npm test -- --run  # Optional: Run component tests
npm run dev        # Starts on port 3001
```

Then access the application at **http://localhost:3001**

#### Using Helper Scripts:

Alternatively, use the provided helper scripts:

```bash
# Terminal 1
chmod +x run-api.sh
./run-api.sh

# Terminal 2
chmod +x run-frontend.sh
./run-frontend.sh
```

### Album API v2 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/albums` | List all albums |
| GET | `/albums/:id` | Get album by ID |
| POST | `/albums` | Create new album |
| PUT | `/albums/:id` | Update album |
| DELETE | `/albums/:id` | Delete album |

#### Example API Usage:

```bash
# Get all albums
curl http://localhost:3000/albums

# Create a new album
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Album",
    "artist": "New Artist",
    "price": 19.99,
    "image_url": "https://example.com/image.jpg"
  }'

# Update an album
curl -X PUT http://localhost:3000/albums/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 24.99}'

# Delete an album
curl -X DELETE http://localhost:3000/albums/1
```

### Frontend Features (album-viewer)

The enhanced Vue.js frontend includes:
- 📋 **View Albums** - Responsive grid display of all albums
- ➕ **Add Album** - Click "Add New Album" button, fill form, and save
- ✏️ **Edit Album** - Click "Edit" on any album card to modify
- 🗑️ **Delete Album** - Click "Delete" with confirmation dialog
- ⏳ **Loading States** - Spinner indicators during operations
- ❌ **Error Display** - Field-specific validation error messages
- ✅ **Success Feedback** - Immediate UI updates after API confirmation

### Testing

#### API Tests (Jest):
```bash
cd album-api-v2
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

Test coverage includes:
- All CRUD operations
- Validation errors
- 404 handling
- Auto-increment IDs
- Edge cases

#### Frontend Tests (Vitest):
```bash
cd album-viewer
npm test                    # Run once
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

Test coverage includes:
- Component rendering
- Event emissions
- Form validation
- Modal behavior
- API error handling
- CRUD operations with mocked axios

### Sample Data

Both APIs include 6 pre-loaded albums:
1. "You, Me and an App Id" by Daprize - $10.99
2. "Seven Revision Army" by The Blue-Green Stripes - $13.99
3. "Scale It Up" by KEDA Club - $13.99
4. "Lost in Translation" by MegaDNS - $12.99
5. "Lock Down Your Love" by V is for VNET - $12.99
6. "Sweet Container O' Mine" by Guns N Probeses - $14.99

**⚠️ Important:** Data is stored in memory and resets when the API server restarts.

---

### Alternative: Original .NET API (`albums-api`)

---

### Alternative: Original .NET API (`albums-api`)

You can also run the original .NET API alongside the Vue.js frontend.

#### Option 1: Using VS Code Debug Panel (Recommended)

1. Open the solution in Visual Studio Code
2. Open the Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
3. Select **"All services"** from the dropdown
4. Click the green play button or press F5

This will automatically:
- Build the .NET API and start it on `http://localhost:3000`
- Start the Vue.js TypeScript app on `http://localhost:3001`
- Open both services in your default browser

You can also run individual services:
- **"C#: Album API Debug"** - Runs only the .NET API
- **"Node.js: Album Viewer Debug"** - Runs only the Vue.js TypeScript frontend

#### Option 2: Command Line

##### Starting the Album API (.NET)

```powershell
# Navigate to the API directory
cd albums-api

# Restore dependencies (first time only)
dotnet restore

# Run the API
dotnet run
```

The API will start on `http://localhost:3000` and you can access the Swagger documentation at `http://localhost:3000/swagger`.

##### Starting the Album Viewer (Vue.js + TypeScript)

```powershell
# Navigate to the viewer directory
cd album-viewer

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# Optional: Run TypeScript type checking
npm run type-check
```

The Vue.js TypeScript app will start on `http://localhost:3001` and automatically open in your browser.

##### Running Both Services

You can run both services simultaneously using separate terminal windows:

```powershell
# Terminal 1 - Start the API
cd albums-api
dotnet run

# Terminal 2 - Start the Vue TypeScript app
cd album-viewer
npm run dev
```

---

### Additional Documentation

- See **album-api-v2/README.md** for detailed Node.js API documentation
- See **IMPLEMENTATION.md** for complete implementation details and architecture
- See **album-viewer/README.md** for Vue.js frontend documentation

### Troubleshooting

**Node.js API won't start:**
- Check if port 3000 is available
- Run `npm install` in album-api-v2
- Check for build errors with `npm run build`

**Frontend can't connect to API:**
- Ensure API is running on port 3000
- Check browser console for CORS errors
- Verify Vite proxy configuration in `vite.config.ts`

**Tests failing:**
- Delete node_modules: `rm -rf node_modules package-lock.json && npm install`
- Run type checking: `npm run type-check`

### Environment Configuration

The solution uses the following default configuration:

- **Album API**: Runs on `http://localhost:3000`
- **Album Viewer**: Runs on `http://localhost:3001` (TypeScript + Vue 3)
- **API Endpoint**: The Vue app is configured to call the API at `localhost:3000`

If you need to change these settings, you can modify:
- API port: `albums-api/Properties/launchSettings.json`
- Vue app configuration: Environment variables in `.vscode/launch.json` or set `VITE_ALBUM_API_HOST` environment variable

### Alternative: GitHub Codespaces

The easiest way is to open this solution in a GitHub Codespace, or run it locally in a devcontainer. The development environment will be automatically configured for you.