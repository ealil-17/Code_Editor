# Codvia - Online Code Editor

A web-based code editor supporting multiple programming languages. Write code and see output instantly, just like online compilers.

## Project Structure

```
Code_Editor/
├── Backend/                    # Node.js + Express API server
│   ├── config/
│   │   └── config.js           # Configuration settings
│   ├── controllers/
│   │   └── codeController.js   # Request handlers
│   ├── routes/
│   │   └── codeRoutes.js       # API routes
│   ├── services/
│   │   ├── codeExecutor.js     # Code execution logic
│   │   ├── errorSanitizer.js   # Error message sanitization
│   │   └── languageService.js  # Language utilities
│   ├── temp/                   # Temporary files (auto-created)
│   ├── Dockerfile
│   ├── package.json
│   └── server.js               # Entry point
├── Frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API services
│   │   └── constants/          # Language configurations
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml          # Docker orchestration
└── README.md
```

## Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Languages Supported**: JavaScript, Python, C++, C, Java, TypeScript, Ruby, Go, PHP, Rust

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Option 1: Docker (Recommended)

The easiest way to run Codvia with all language compilers pre-installed.

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000

```bash
# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up --build
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v18 or higher)
- npm

For code execution, you need the respective compilers/interpreters installed:
- **Python**: `python` command
- **C/C++**: GCC (`gcc`, `g++`)
- **Java**: JDK (`javac`, `java`)
- **TypeScript**: `tsc` (install via `npm install -g typescript`)
- **Ruby**: `ruby`
- **Go**: `go`
- **PHP**: `php`
- **Rust**: `rustc`

#### Backend Setup

```bash
cd Backend
npm install
npm start        # or npm run dev for auto-reload
```

Server runs on `http://localhost:5000`

#### Frontend Setup

```bash
cd Frontend
npm install
npm run dev      # Development server with hot reload
```

App will run on `http://localhost:5173`

For production build:
```bash
npm run build
npm run preview
```

---

## Backend API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/languages` | List supported languages |
| POST | `/api/code/execute` | Execute code |
| GET | `/api/code/boilerplate/:language` | Get starter template |

### Execute Code

**POST** `/api/code/execute`

**Request Body:**
```json
{
  "language": "javascript",
  "code": "console.log('Hello, World!');",
  "input": ""
}
```

**Response:**
```json
{
  "success": true,
  "language": "javascript",
  "output": "Hello, World!\n",
  "error": "",
  "exitCode": 0,
  "executionTime": 45
}
```

### Configuration

Options available in `Backend/config/config.js`:

| Option | Default | Description |
|--------|---------|-------------|
| `PORT` | 5000 | Server port |
| `EXECUTION_TIMEOUT` | 10000 | Max execution time (ms) |
| `MAX_OUTPUT_SIZE` | 50000 | Max output characters |

### Error Handling

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad request (missing params, unsupported language) |
| 408 | Timeout (code took too long) |
| 500 | Internal server error |

---

## Development Phases

- [x] **Phase 1**: Backend - Code execution API for multiple languages
- [x] **Phase 2**: Frontend - React-based code editor UI with Monaco Editor
- [x] **Phase 3**: Docker - Containerized deployment with all compilers
- [ ] **Phase 4**: Additional features (user accounts, code saving, sharing)

## Docker Details

The Docker setup includes:

### Backend Container
- Node.js 20 runtime
- All language compilers pre-installed:
  - GCC/G++ for C/C++
  - Python 3
  - OpenJDK for Java
  - TypeScript compiler
  - Ruby
  - Go
  - PHP CLI
  - Rust compiler
- Health checks enabled
- Runs as non-root user for security

### Frontend Container
- Multi-stage build (Node.js for build, Nginx for serving)
- Nginx reverse proxy to backend API
- Gzip compression
- Static asset caching
- Security headers

## Security Notes

⚠️ Security features implemented:
- Error message sanitization (hides file paths and server info)
- Non-root container execution
- Security headers in Nginx
- Input validation

For additional production hardening, consider:
- Rate limiting
- Resource limits (CPU, memory) per execution
- Network isolation
- User authentication
- HTTPS/TLS

## License

ISC