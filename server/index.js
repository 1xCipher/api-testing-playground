import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Simple JSON file-based database
const DB_FILE = join(__dirname, '..', 'data.json');

const initDB = () => {
  if (!existsSync(DB_FILE)) {
    const initialData = {
      collections: [],
      requests: [],
      environments: [],
      history: []
    };
    writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

const readDB = () => {
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
  } catch {
    initDB();
    return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
  }
};

const writeDB = (data) => {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

initDB();

// Active collaboration sessions
const collaborationSessions = new Map();

// API Routes

// Collections
app.get('/api/collections', (req, res) => {
  const db = readDB();
  res.json(db.collections);
});

app.post('/api/collections', (req, res) => {
  const { name } = req.body;
  const db = readDB();

  const collection = {
    id: uuidv4(),
    name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.collections.push(collection);
  writeDB(db);

  res.json(collection);
});

app.put('/api/collections/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const db = readDB();

  const collection = db.collections.find(c => c.id === id);
  if (collection) {
    collection.name = name;
    collection.updated_at = new Date().toISOString();
    writeDB(db);
  }

  res.json(collection);
});

app.delete('/api/collections/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  db.collections = db.collections.filter(c => c.id !== id);
  db.requests = db.requests.filter(r => r.collection_id !== id);
  writeDB(db);

  res.json({ success: true });
});

// Requests
app.get('/api/collections/:collectionId/requests', (req, res) => {
  const { collectionId } = req.params;
  const db = readDB();

  const requests = db.requests.filter(r => r.collection_id === collectionId);
  res.json(requests);
});

app.post('/api/requests', (req, res) => {
  const { collection_id, name, method, url, headers, body, body_type, params, auth, tests } = req.body;
  const db = readDB();

  const request = {
    id: uuidv4(),
    collection_id,
    name,
    method,
    url,
    headers: headers || [],
    body: body || '',
    body_type: body_type || 'json',
    params: params || [],
    auth: auth || null,
    tests: tests || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.requests.push(request);
  writeDB(db);

  res.json(request);
});

app.put('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const { name, method, url, headers, body, body_type, params, auth, tests } = req.body;
  const db = readDB();

  const request = db.requests.find(r => r.id === id);
  if (request) {
    request.name = name;
    request.method = method;
    request.url = url;
    request.headers = headers || [];
    request.body = body || '';
    request.body_type = body_type || 'json';
    request.params = params || [];
    request.auth = auth || null;
    request.tests = tests || [];
    request.updated_at = new Date().toISOString();
    writeDB(db);
  }

  res.json(request);
});

app.delete('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  db.requests = db.requests.filter(r => r.id !== id);
  writeDB(db);

  res.json({ success: true });
});

// Environments
app.get('/api/environments', (req, res) => {
  const db = readDB();
  res.json(db.environments);
});

app.post('/api/environments', (req, res) => {
  const { name, variables } = req.body;
  const db = readDB();

  const environment = {
    id: uuidv4(),
    name,
    variables: variables || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.environments.push(environment);
  writeDB(db);

  res.json(environment);
});

app.put('/api/environments/:id', (req, res) => {
  const { id } = req.params;
  const { name, variables } = req.body;
  const db = readDB();

  const environment = db.environments.find(e => e.id === id);
  if (environment) {
    environment.name = name;
    environment.variables = variables || [];
    environment.updated_at = new Date().toISOString();
    writeDB(db);
  }

  res.json(environment);
});

app.delete('/api/environments/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  db.environments = db.environments.filter(e => e.id !== id);
  writeDB(db);

  res.json({ success: true });
});

// Request History
app.get('/api/requests/:requestId/history', (req, res) => {
  const { requestId } = req.params;
  const db = readDB();

  const history = db.history
    .filter(h => h.request_id === requestId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50);

  res.json(history);
});

app.post('/api/history', (req, res) => {
  const { request_id, method, url, status, response_time, response_body, response_headers } = req.body;
  const db = readDB();

  const historyItem = {
    id: uuidv4(),
    request_id,
    method,
    url,
    status,
    response_time,
    response_body,
    response_headers,
    created_at: new Date().toISOString()
  };

  db.history.push(historyItem);
  writeDB(db);

  res.json({ success: true, id: historyItem.id });
});

// WebSocket for real-time collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-session', ({ requestId, username }) => {
    socket.join(requestId);

    if (!collaborationSessions.has(requestId)) {
      collaborationSessions.set(requestId, new Set());
    }

    collaborationSessions.get(requestId).add({ id: socket.id, username });

    // Notify others in the session
    io.to(requestId).emit('user-joined', {
      userId: socket.id,
      username,
      users: Array.from(collaborationSessions.get(requestId))
    });
  });

  socket.on('leave-session', ({ requestId }) => {
    socket.leave(requestId);

    if (collaborationSessions.has(requestId)) {
      const users = collaborationSessions.get(requestId);
      users.forEach(user => {
        if (user.id === socket.id) {
          users.delete(user);
        }
      });

      if (users.size === 0) {
        collaborationSessions.delete(requestId);
      }
    }

    io.to(requestId).emit('user-left', {
      userId: socket.id,
      users: collaborationSessions.has(requestId) ? Array.from(collaborationSessions.get(requestId)) : []
    });
  });

  socket.on('request-update', ({ requestId, data }) => {
    // Broadcast to all other users in the session
    socket.to(requestId).emit('request-updated', {
      userId: socket.id,
      data
    });
  });

  socket.on('cursor-position', ({ requestId, field, position }) => {
    socket.to(requestId).emit('cursor-moved', {
      userId: socket.id,
      field,
      position
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove user from all sessions
    collaborationSessions.forEach((users, requestId) => {
      users.forEach(user => {
        if (user.id === socket.id) {
          users.delete(user);
          io.to(requestId).emit('user-left', {
            userId: socket.id,
            users: Array.from(users)
          });
        }
      });

      if (users.size === 0) {
        collaborationSessions.delete(requestId);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
