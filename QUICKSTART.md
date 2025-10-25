# Quick Start Guide

## Installation (One Time Only)

```bash
npm install
```

## Starting the Application

### Windows
Double-click `start.bat` or run:
```bash
.\start.bat
```

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

## Accessing the Application

Once started, open your browser to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Stopping the Application

### Windows
Double-click `stop.bat` or run:
```bash
.\stop.bat
```

### macOS/Linux
```bash
./stop.sh
```

Or simply press `Ctrl+C` in the terminal where the app is running.

## Your First API Test

1. **Create a Collection**
   - Click "New Collection" in sidebar
   - Name it (e.g., "My APIs")

2. **Add a Request**
   - Click the `+` icon next to your collection
   - A new request appears

3. **Configure Request**
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/posts/1`
   - Click "Send"

4. **View Response**
   - See status code, response time, and JSON body
   - Switch to "Headers" tab to see response headers

5. **Generate Code**
   - Click the "Code" button
   - Select your language (JavaScript, Python, cURL, etc.)
   - Copy the code to use in your project

6. **Add Tests** (Optional)
   - Go to "Tests" tab
   - Click "Add Test"
   - Select "Status Code"
   - Enter "200"
   - Click "Run Tests" after sending request

## Features Overview

### Collections & Organization
- Create multiple collections for different APIs
- Each collection can contain unlimited requests
- Drag requests between collections (coming soon)

### Request Builder
- **Methods**: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Headers**: Add custom headers with enable/disable toggles
- **Query Params**: Manage URL parameters separately
- **Body**: JSON or plain text with syntax highlighting
- **Auth**: Manual auth headers (OAuth coming soon)

### Tests & Validation
- **Status Code**: Assert response status
- **Headers**: Check if headers exist
- **Body Contains**: Search for text in response
- **JSON Path**: Validate nested values (e.g., `data.user.id`)
- **Response Time**: Ensure APIs meet SLA

### Code Generation
Languages supported:
- JavaScript (Fetch API)
- Python (Requests)
- Node.js (Axios)
- cURL
- Go
- Java

### Environments
- Create different environments (dev, staging, prod)
- Define variables (e.g., `{{baseUrl}}`, `{{apiKey}}`)
- Use variables in URLs: `{{baseUrl}}/users`
- Switch environments without changing requests

### Real-time Collaboration
- Multiple users can work on same request
- See who's online with live indicators
- Changes sync automatically via WebSocket

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Send request (coming soon)
- `Ctrl/Cmd + S` - Save request (auto-saves currently)
- `Ctrl/Cmd + K` - Focus URL bar (coming soon)

## Tips & Tricks

1. **Use Environment Variables**
   - Store base URLs and API keys in environments
   - Never hardcode sensitive data in requests

2. **Organize with Collections**
   - Group related endpoints together
   - Name collections clearly (e.g., "User API", "Payment API")

3. **Add Tests Early**
   - Catch breaking changes immediately
   - Validate critical response fields

4. **Generate Code**
   - Speed up integration by copying generated code
   - Choose the language that matches your stack

5. **Check Response Time**
   - Monitor API performance
   - Set test assertions for SLA compliance

## Troubleshooting

### App won't start
- Make sure ports 3000 and 5000 are available
- Run `npm install` if you just cloned the repo
- Check Node.js is installed: `node --version`

### Can't connect to API
- Check if the API URL is correct
- Verify CORS settings on the API
- Look at browser console for errors

### Tests failing
- Verify the test conditions are correct
- Check response data structure
- Ensure API is returning expected values

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- MCP server setup: [mcp-server/README.md](mcp-server/README.md)
- Open an issue on GitHub

## Next Steps

- Explore the Test Runner
- Set up environments for your APIs
- Try the code generation feature
- Install the MCP server for Claude AI integration
