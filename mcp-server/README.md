# API Testing Playground MCP Server

Model Context Protocol (MCP) server for the API Testing Playground. This allows AI assistants like Claude to interact with your API testing collections programmatically.

## Installation

```bash
cd mcp-server
npm install
```

## Configuration

Add this to your Claude Desktop config file:

### Windows
Location: `%APPDATA%\Claude\claude_desktop_config.json`

### macOS
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

### Linux
Location: `~/.config/Claude/claude_desktop_config.json`

Add the following to the `mcpServers` section:

```json
{
  "mcpServers": {
    "api-testing-playground": {
      "command": "node",
      "args": [
        "/absolute/path/to/api-testing-playground/mcp-server/index.js"
      ]
    }
  }
}
```

**Note**: Replace `/absolute/path/to/` with your actual installation directory.

**Windows Example:**
```json
"args": ["C:\\Users\\YourName\\projects\\api-testing-playground\\mcp-server\\index.js"]
```

**macOS/Linux Example:**
```json
"args": ["/home/username/projects/api-testing-playground/mcp-server/index.js"]
```

## Available Tools

The MCP server provides the following tools:

### Collections
- `list_collections` - List all API request collections
- `create_collection` - Create a new collection
- `export_collection` - Export a collection as JSON

### Requests
- `list_requests` - List all requests in a collection
- `create_request` - Create a new API request
- `execute_request` - Execute a request and get the response

### Environments
- `list_environments` - List all environments
- `create_environment` - Create a new environment with variables

## Available Resources

- `api-playground://collections` - All collections
- `api-playground://environments` - All environments
- `api-playground://data` - Complete database

## Usage Examples

Once configured, you can ask Claude:

- "List all my API collections"
- "Create a new collection called 'User API'"
- "Execute the request with ID xyz123"
- "Show me all requests in the Auth collection"
- "Create a new GET request to https://api.example.com/users"

## Requirements

- The API Testing Playground app must be running (backend on port 5000)
- Node.js installed
- Claude Desktop with MCP support
