# API Testing Playground

A modern, collaborative API testing tool with real-time collaboration features. Built for developers who need a fast, beautiful interface to test REST APIs.

## Features

### Core Features
- **Beautiful UI** - Clean, modern interface built with React and TailwindCSS
- **Real-time Collaboration** - Work with your team in real-time using WebSockets
- **Collections** - Organize requests into collections for better organization
- **Environments** - Manage environment variables across different setups
- **Request History** - Track all your API calls with automatic history
- **Response Viewer** - Beautiful JSON formatting with syntax highlighting
- **Monaco Editor** - Industry-standard code editor for request/response bodies

### Developer-Focused Features
- **Code Generation** - Generate code snippets in 6+ languages (JavaScript, Python, cURL, Go, Java, Node.js)
- **Automated Tests** - Create assertions to validate API responses automatically
- **Test Runner** - Run multiple tests and see pass/fail results
- **JSON Path Testing** - Validate nested JSON values with dot notation
- **Response Time Checks** - Assert response times meet SLA requirements
- **MCP Server** - Claude AI integration for programmatic API testing

## Quick Start

### Easy Start (Recommended)

**Windows:**
```bash
.\start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

The application will start and show you:
- Backend Server: http://localhost:5000
- Frontend App: http://localhost:3000

### Stop All Servers

**Windows:**
```bash
.\stop.bat
```

**macOS/Linux:**
```bash
chmod +x stop.sh
./stop.sh
```

### Manual Installation

```bash
npm install
npm run dev
```

This starts both the backend server (port 5000) and frontend dev server (port 3000).

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Create a Collection
- Click "New Collection" in the sidebar
- Give it a name and press Create

### 2. Add a Request
- Click the + icon next to a collection
- Configure your request:
  - Method (GET, POST, PUT, etc.)
  - URL
  - Headers
  - Query Parameters
  - Request Body

### 3. Send Request
- Click the "Send" button
- View response with status, timing, and formatted body

### 4. Generate Code
- Click the "Code" button
- Select your preferred language (JavaScript, Python, cURL, etc.)
- Copy the generated code snippet

### 5. Add Tests
- Go to the "Tests" tab
- Add assertions:
  - Status Code checks (e.g., status equals 200)
  - Header validation (e.g., Content-Type exists)
  - Body content checks (e.g., body contains "success")
  - JSON path assertions (e.g., data.user.id equals "123")
  - Response time limits (e.g., response time under 500ms)
- Click "Run Tests" to validate

### 6. Environments (Optional)
- Switch to "Environments" tab
- Create environment with variables
- Use `{{variable}}` syntax in URLs

### 7. Collaboration
- Multiple users can edit the same request simultaneously
- See who's online with real-time indicators

## MCP Server Integration

Integrate with Claude AI to manage your API tests programmatically.

### Setup

1. Install MCP server dependencies:
```bash
cd mcp-server
npm install
```

2. Add to your Claude Desktop config (see `mcp-server/README.md` for details)

3. Ask Claude to:
   - "List all my API collections"
   - "Create a new GET request to https://api.example.com/users"
   - "Execute request ID xyz123"
   - "Show me all environments"

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express, Socket.io
- **Database**: JSON file-based storage (no external DB needed)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **MCP**: Model Context Protocol for AI integration

## Project Structure

```
api-testing-playground/
├── server/
│   └── index.js              # Express + Socket.io server
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Collections & environments
│   │   ├── RequestPanel.jsx  # Request builder
│   │   ├── ResponsePanel.jsx # Response viewer
│   │   ├── CodeGenerator.jsx # Code generation
│   │   └── TestsPanel.jsx    # Automated tests
│   ├── store/
│   │   └── useStore.js       # Zustand state management
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── mcp-server/
│   ├── index.js              # MCP server for Claude AI
│   ├── package.json
│   └── README.md
├── start.bat / start.sh      # Easy start scripts
├── stop.bat / stop.sh        # Stop all servers
├── package.json
└── README.md
```

## Features Comparison

| Feature | API Testing Playground | Postman | Insomnia |
|---------|----------------------|---------|----------|
| Real-time Collaboration | ✅ | ✅ (Paid) | ❌ |
| Code Generation | ✅ (6 languages) | ✅ | ✅ |
| Automated Tests | ✅ | ✅ | ✅ |
| Environment Variables | ✅ | ✅ | ✅ |
| Open Source | ✅ | ❌ | ✅ |
| AI Integration (MCP) | ✅ | ❌ | ❌ |
| Local Storage | ✅ | Cloud + Local | Local |
| Free | ✅ | Limited | ✅ |

## Why Choose This?

- **100% Free & Open Source** - No premium tiers, no limits
- **Privacy First** - All data stored locally in JSON file
- **Developer-Friendly** - Built by developers, for developers
- **Modern Stack** - Latest React, Vite, and TailwindCSS
- **AI-Ready** - Native Claude AI integration via MCP
- **No Account Required** - Install and use immediately
- **Extensible** - Easy to customize and extend

## License

MIT - Feel free to use this for any purpose!

## Contributing

PRs welcome! This is an open-source project built to help developers test APIs more efficiently.

### Ideas for Contributions
- GraphQL support
- WebSocket testing
- Import/export Postman collections
- Dark mode
- Request chaining workflows
- Performance testing
- Mock server functionality

## Support

Found a bug or have a feature request? Open an issue on GitHub!
