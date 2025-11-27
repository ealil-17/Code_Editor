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
│   │   └── languageService.js  # Language utilities
│   ├── temp/                   # Temporary files (auto-created)
│   ├── package.json
│   └── server.js               # Entry point
├── Frontend/                   # React application (coming soon)
└── README.md
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Languages Supported**: JavaScript, Python, C++, C, Java, TypeScript, Ruby, Go, PHP, Rust

### Frontend (Phase 2)
- **Framework**: React
- **Code Editor**: Monaco Editor / CodeMirror
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

For code execution, you need the respective compilers/interpreters installed:
- **Python**: `python` command
- **C/C++**: GCC (`gcc`, `g++`)
- **Java**: JDK (`javac`, `java`)
- **TypeScript**: `tsc`
- **Ruby**: `ruby`
- **Go**: `go`
- **PHP**: `php`
- **Rust**: `rustc`

### Backend Setup

```bash
cd Backend
npm install
npm start        # or npm run dev for auto-reload
```

Server runs on `http://localhost:5000`

### Frontend Setup (Coming Soon)

```bash
cd Frontend
npm install
npm start
```

App will run on `http://localhost:3000`

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
- [ ] **Phase 2**: Frontend - React-based code editor UI
- [ ] **Phase 3**: Additional features (user accounts, code saving, etc.)

## Security Notes

⚠️ This is a Phase 1 implementation. For production, consider:
- Sandboxing code execution (Docker containers)
- Rate limiting
- Resource limits (CPU, memory)
- Input sanitization
- User authentication

## License

ISC