#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = join(__dirname, '..', 'data.json');
const API_URL = 'http://localhost:5000/api';

class ApiPlaygroundMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'api-testing-playground',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_collections',
          description: 'List all API request collections',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'create_collection',
          description: 'Create a new API request collection',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Collection name' },
            },
            required: ['name'],
          },
        },
        {
          name: 'list_requests',
          description: 'List all requests in a collection',
          inputSchema: {
            type: 'object',
            properties: {
              collection_id: { type: 'string', description: 'Collection ID' },
            },
            required: ['collection_id'],
          },
        },
        {
          name: 'create_request',
          description: 'Create a new API request in a collection',
          inputSchema: {
            type: 'object',
            properties: {
              collection_id: { type: 'string', description: 'Collection ID' },
              name: { type: 'string', description: 'Request name' },
              method: {
                type: 'string',
                description: 'HTTP method',
                enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
              },
              url: { type: 'string', description: 'Request URL' },
              headers: {
                type: 'array',
                description: 'Request headers',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                    enabled: { type: 'boolean' }
                  }
                }
              },
              body: { type: 'string', description: 'Request body (JSON string)' },
            },
            required: ['collection_id', 'name', 'method', 'url'],
          },
        },
        {
          name: 'execute_request',
          description: 'Execute an API request and get the response',
          inputSchema: {
            type: 'object',
            properties: {
              request_id: { type: 'string', description: 'Request ID to execute' },
            },
            required: ['request_id'],
          },
        },
        {
          name: 'list_environments',
          description: 'List all environment configurations',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'create_environment',
          description: 'Create a new environment with variables',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Environment name' },
              variables: {
                type: 'array',
                description: 'Environment variables',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                    enabled: { type: 'boolean' }
                  }
                }
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'export_collection',
          description: 'Export a collection as JSON',
          inputSchema: {
            type: 'object',
            properties: {
              collection_id: { type: 'string', description: 'Collection ID' },
            },
            required: ['collection_id'],
          },
        },
      ],
    }));

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'api-playground://collections',
          name: 'Collections',
          description: 'All API request collections',
          mimeType: 'application/json',
        },
        {
          uri: 'api-playground://environments',
          name: 'Environments',
          description: 'All environment configurations',
          mimeType: 'application/json',
        },
        {
          uri: 'api-playground://data',
          name: 'Complete Database',
          description: 'Full database export',
          mimeType: 'application/json',
        },
      ],
    }));

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      if (!existsSync(DATA_FILE)) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({ error: 'Database not initialized' }, null, 2),
            },
          ],
        };
      }

      const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

      switch (uri) {
        case 'api-playground://collections':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(data.collections, null, 2),
              },
            ],
          };

        case 'api-playground://environments':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(data.environments, null, 2),
              },
            ],
          };

        case 'api-playground://data':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(data, null, 2),
              },
            ],
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_collections': {
            const { data } = await axios.get(`${API_URL}/collections`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'create_collection': {
            const { data } = await axios.post(`${API_URL}/collections`, {
              name: args.name,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `Collection created successfully:\n${JSON.stringify(data, null, 2)}`,
                },
              ],
            };
          }

          case 'list_requests': {
            const { data } = await axios.get(`${API_URL}/collections/${args.collection_id}/requests`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'create_request': {
            const { data } = await axios.post(`${API_URL}/requests`, args);
            return {
              content: [
                {
                  type: 'text',
                  text: `Request created successfully:\n${JSON.stringify(data, null, 2)}`,
                },
              ],
            };
          }

          case 'execute_request': {
            // Load request details
            const dbData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
            const request = dbData.requests.find(r => r.id === args.request_id);

            if (!request) {
              throw new Error(`Request not found: ${args.request_id}`);
            }

            // Execute the request
            const config = {
              method: request.method.toLowerCase(),
              url: request.url,
              headers: {},
            };

            request.headers?.forEach(h => {
              if (h.enabled) {
                config.headers[h.key] = h.value;
              }
            });

            if (['post', 'put', 'patch'].includes(config.method) && request.body) {
              try {
                config.data = JSON.parse(request.body);
              } catch {
                config.data = request.body;
              }
            }

            const startTime = Date.now();
            const response = await axios({
              ...config,
              validateStatus: () => true, // Don't throw on any status
            });
            const endTime = Date.now();

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data,
                    responseTime: endTime - startTime,
                  }, null, 2),
                },
              ],
            };
          }

          case 'list_environments': {
            const { data } = await axios.get(`${API_URL}/environments`);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'create_environment': {
            const { data } = await axios.post(`${API_URL}/environments`, {
              name: args.name,
              variables: args.variables || [],
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `Environment created successfully:\n${JSON.stringify(data, null, 2)}`,
                },
              ],
            };
          }

          case 'export_collection': {
            const dbData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
            const collection = dbData.collections.find(c => c.id === args.collection_id);
            const requests = dbData.requests.filter(r => r.collection_id === args.collection_id);

            if (!collection) {
              throw new Error(`Collection not found: ${args.collection_id}`);
            }

            const exportData = {
              collection,
              requests,
              exported_at: new Date().toISOString(),
            };

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(exportData, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('API Testing Playground MCP Server running on stdio');
  }
}

const server = new ApiPlaygroundMCPServer();
server.run().catch(console.error);
