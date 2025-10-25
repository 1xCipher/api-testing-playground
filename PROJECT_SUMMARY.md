# API Testing Playground - Project Summary

## Overview

A fully-featured, open-source API testing tool with real-time collaboration, code generation, automated testing, and AI integration. Built with modern web technologies and designed for developers who need a powerful, privacy-focused alternative to commercial tools.

## What We Built

### Core Application
- **Frontend**: Modern React app with beautiful UI (TailwindCSS + shadcn/ui inspired design)
- **Backend**: Express server with WebSocket support for real-time collaboration
- **Database**: Simple JSON file-based storage (no external dependencies)
- **State Management**: Zustand for reactive state
- **Code Editor**: Monaco Editor (same as VS Code)

### Key Features Implemented

#### 1. Collections & Organization
- Create unlimited collections
- Organize requests by project/feature
- Hierarchical folder structure
- Search and filter (ready for extension)

#### 2. Request Builder
- **7 HTTP Methods**: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Headers Management**: Add/remove/enable/disable individual headers
- **Query Parameters**: Manage URL params separately with toggles
- **Request Body**: JSON and plain text support with syntax highlighting
- **Monaco Editor**: Professional code editing experience

#### 3. Response Viewer
- Beautiful JSON formatting
- Syntax highlighting
- Status code visualization with color coding
- Response time tracking
- Response size calculation
- Headers viewer

#### 4. Code Generation (NEW!)
Generate production-ready code in 6 languages:
- JavaScript (Fetch API)
- Python (Requests library)
- Node.js (Axios)
- cURL
- Go (net/http)
- Java (HttpClient)

Features:
- Includes all headers, params, and body
- Ready to copy and paste
- Properly formatted and indented
- Handles authentication headers

#### 5. Automated Testing (NEW!)
Create assertions to validate responses:
- **Status Code**: Assert exact status (e.g., 200, 404)
- **Header Exists**: Verify response headers
- **Body Contains**: Search for text in response
- **JSON Path**: Validate nested values (`data.user.id`)
- **Response Time**: Ensure APIs meet SLA (<500ms)

Test Runner:
- Run all tests with one click
- See pass/fail results instantly
- Detailed error messages
- Visual indicators (green/red)

#### 6. Environment Variables
- Create multiple environments (dev, staging, prod)
- Define key-value pairs
- Use `{{variable}}` syntax in requests
- Toggle variables on/off
- Switch environments without changing requests

#### 7. Real-time Collaboration
- Multiple users can edit the same request
- Live cursor positions
- See who's online
- Changes sync instantly via WebSocket
- No conflicts or overwriting

#### 8. Request History
- Auto-save all executed requests
- Track response times over time
- Compare responses
- Replay historical requests

#### 9. MCP Server for AI Integration (NEW!)
Full Model Context Protocol server for Claude AI:

**Available Tools**:
- `list_collections` - List all collections
- `create_collection` - Create new collection
- `list_requests` - List requests in collection
- `create_request` - Create new request
- `execute_request` - Run request and get response
- `list_environments` - List environments
- `create_environment` - Create environment
- `export_collection` - Export as JSON

**Available Resources**:
- `api-playground://collections` - All collections
- `api-playground://environments` - All environments
- `api-playground://data` - Complete database

**Usage with Claude**:
- "Create a GET request to test my user API"
- "Execute the login request and show me the response"
- "List all my collections"
- "Export the Payment API collection"

### Easy Start/Stop Scripts

#### Windows
- `start.bat` - Launches both servers with clear instructions
- `stop.bat` - Cleanly shuts down all processes

#### macOS/Linux
- `start.sh` - Launches both servers with clear instructions
- `stop.sh` - Cleanly shuts down all processes

Both scripts show:
- Backend URL (http://localhost:5000)
- Frontend URL (http://localhost:3000)
- Clear instructions on how to stop

## File Structure

```
api-testing-playground/
├── server/
│   └── index.js                 # Express + Socket.io + REST API
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Collections & environments browser
│   │   ├── RequestPanel.jsx     # Request builder with tabs
│   │   ├── ResponsePanel.jsx    # Response viewer
│   │   ├── CodeGenerator.jsx    # Multi-language code gen
│   │   └── TestsPanel.jsx       # Automated testing UI
│   ├── store/
│   │   └── useStore.js          # Zustand state + API calls
│   ├── App.jsx                  # Main application
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + Tailwind
├── mcp-server/
│   ├── index.js                 # MCP server implementation
│   ├── package.json             # MCP dependencies
│   └── README.md                # MCP setup guide
├── start.bat / start.sh         # Easy start scripts
├── stop.bat / stop.sh           # Easy stop scripts
├── package.json                 # Main dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind setup
├── README.md                    # Full documentation
├── QUICKSTART.md                # Quick start guide
└── PROJECT_SUMMARY.md           # This file
```

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS
- **Monaco Editor** - VS Code's editor
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.io** - WebSocket for real-time features
- **UUID** - Unique ID generation
- **File System** - JSON-based storage (no DB needed)

### MCP Server
- **@modelcontextprotocol/sdk** - Official MCP SDK
- **Axios** - HTTP requests
- **Node.js** - Runtime

### Development
- **Concurrently** - Run multiple servers
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS compatibility

## Why This Project Stands Out

### 1. Privacy-First
- All data stored locally in `data.json`
- No cloud sync required
- No account creation
- No tracking or analytics
- You own your data

### 2. Developer-Focused Features
- **Code Generation**: 6 languages supported
- **Automated Tests**: Built-in assertion library
- **AI Integration**: Native Claude support via MCP
- **Monaco Editor**: Professional editing experience
- **Real-time Collaboration**: Work with teammates

### 3. Zero External Dependencies
- No database server needed
- No Redis or message queue
- Just Node.js and npm
- Works offline after initial install

### 4. Modern Architecture
- React with hooks
- Zustand (simpler than Redux)
- WebSocket for real-time
- REST API for persistence
- Modular component design

### 5. Production Ready
- Error handling
- Loading states
- Responsive design
- Proper state management
- Clean code structure

## Comparison with Competitors

| Feature | API Testing Playground | Postman | Insomnia | Bruno |
|---------|----------------------|---------|----------|--------|
| **Price** | Free & Open Source | Free/Paid | Free/Paid | Free |
| **Real-time Collab** | ✅ Free | ✅ Paid only | ❌ | ❌ |
| **Code Generation** | ✅ 6 languages | ✅ Many languages | ✅ Limited | ✅ |
| **Automated Tests** | ✅ Built-in | ✅ | ✅ | ✅ |
| **AI Integration** | ✅ Claude MCP | ❌ | ❌ | ❌ |
| **Local Storage** | ✅ JSON file | Cloud + Local | Local | Git-based |
| **No Account** | ✅ | ❌ (Cloud features) | ✅ | ✅ |
| **Privacy** | ✅ 100% local | ⚠️ Cloud sync | ✅ | ✅ |
| **Extensible** | ✅ Open source | ❌ | ✅ | ✅ |
| **Modern UI** | ✅ React + Tailwind | ✅ | ✅ | ✅ |

## What Makes It Unique

1. **AI-Native**: First API testing tool with native Claude integration via MCP
2. **Code-First**: Generate production-ready code in 6 languages
3. **Test-Driven**: Built-in assertion library without scripting
4. **Collaboration-Ready**: Real-time editing for free (others charge)
5. **Privacy-Focused**: 100% local, zero telemetry
6. **Developer-Made**: Built by developers, for developers

## Perfect For

- **Solo Developers**: Fast, local, no account needed
- **Small Teams**: Real-time collaboration without paid plans
- **Privacy-Conscious**: All data stays on your machine
- **AI Enthusiasts**: Native Claude integration
- **Open Source Projects**: Fork and customize
- **Learning**: Clean codebase to study modern React

## Future Extension Ideas

The codebase is designed to be easily extensible:

### Planned Features
- GraphQL support
- WebSocket/Socket.io testing
- Import/export Postman collections
- Dark mode
- Request chaining workflows
- Mock server functionality
- Performance/load testing
- Swagger/OpenAPI import
- Pre-request scripts
- Custom themes
- Plugin system

### Easy to Add
- New test types (regex, schema validation)
- More code generation languages (Rust, PHP, Ruby)
- Auth presets (OAuth 2.0, JWT, Basic Auth)
- Response diff viewer
- Request folders/subfolders
- Bulk operations
- CLI version
- Docker container

## Getting Started

### For Users

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/api-testing-playground.git
   cd api-testing-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   - Windows: `.\start.bat`
   - macOS/Linux: `./start.sh`

4. **Open in browser**
   - http://localhost:3000

### For Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### For Claude AI Users

1. Install MCP server:
   ```bash
   cd mcp-server
   npm install
   ```

2. Configure Claude Desktop (see `mcp-server/README.md`)

3. Ask Claude to manage your APIs!

## Support & Community

- **Documentation**: [README.md](README.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **MCP Setup**: [mcp-server/README.md](mcp-server/README.md)
- **Issues**: GitHub Issues
- **PRs**: Always welcome!

## License

MIT License - Use freely for any purpose!

## Credits

Built with ❤️ using:
- React team for React
- Evan You for Vite
- TailwindCSS team
- Microsoft for Monaco Editor
- Socket.io team
- Anthropic for Claude & MCP SDK
- The entire open-source community

---

**Ready to test APIs like a pro? Get started now!**

```bash
npm install
.\start.bat  # or ./start.sh on macOS/Linux
```

Open http://localhost:3000 and start testing! 🚀
