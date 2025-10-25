import { create } from 'zustand'
import axios from 'axios'
import { io } from 'socket.io-client'

const API_URL = 'http://localhost:5000/api'
const socket = io('http://localhost:5000')

export const useStore = create((set, get) => ({
  // State
  collections: [],
  requests: {},
  environments: [],
  selectedCollection: null,
  selectedRequest: null,
  selectedEnvironment: null,
  response: null,
  loading: false,
  collaborators: [],

  // Socket connection
  socket,

  // Collections
  loadCollections: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/collections`)
      set({ collections: data })

      // Load requests for each collection
      for (const collection of data) {
        get().loadRequests(collection.id)
      }
    } catch (error) {
      console.error('Failed to load collections:', error)
    }
  },

  createCollection: async (name) => {
    try {
      const { data } = await axios.post(`${API_URL}/collections`, { name })
      set((state) => ({
        collections: [...state.collections, data],
        requests: { ...state.requests, [data.id]: [] }
      }))
      return data
    } catch (error) {
      console.error('Failed to create collection:', error)
    }
  },

  updateCollection: async (id, name) => {
    try {
      const { data } = await axios.put(`${API_URL}/collections/${id}`, { name })
      set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? data : c))
      }))
    } catch (error) {
      console.error('Failed to update collection:', error)
    }
  },

  deleteCollection: async (id) => {
    try {
      await axios.delete(`${API_URL}/collections/${id}`)
      set((state) => {
        const newRequests = { ...state.requests }
        delete newRequests[id]
        return {
          collections: state.collections.filter((c) => c.id !== id),
          requests: newRequests,
          selectedCollection: state.selectedCollection === id ? null : state.selectedCollection
        }
      })
    } catch (error) {
      console.error('Failed to delete collection:', error)
    }
  },

  selectCollection: (id) => {
    set({ selectedCollection: id })
  },

  // Requests
  loadRequests: async (collectionId) => {
    try {
      const { data } = await axios.get(`${API_URL}/collections/${collectionId}/requests`)
      set((state) => ({
        requests: { ...state.requests, [collectionId]: data }
      }))
    } catch (error) {
      console.error('Failed to load requests:', error)
    }
  },

  createRequest: async (collectionId, requestData) => {
    try {
      const { data } = await axios.post(`${API_URL}/requests`, {
        collection_id: collectionId,
        name: requestData.name || 'New Request',
        method: requestData.method || 'GET',
        url: requestData.url || '',
        headers: requestData.headers || [],
        body: requestData.body || '',
        body_type: requestData.body_type || 'json',
        params: requestData.params || [],
        auth: requestData.auth || null
      })

      set((state) => ({
        requests: {
          ...state.requests,
          [collectionId]: [...(state.requests[collectionId] || []), data]
        },
        selectedRequest: data
      }))

      return data
    } catch (error) {
      console.error('Failed to create request:', error)
    }
  },

  updateRequest: async (id, requestData) => {
    try {
      const { data } = await axios.put(`${API_URL}/requests/${id}`, requestData)

      set((state) => {
        const collectionId = data.collection_id
        return {
          requests: {
            ...state.requests,
            [collectionId]: state.requests[collectionId].map((r) => (r.id === id ? data : r))
          },
          selectedRequest: state.selectedRequest?.id === id ? data : state.selectedRequest
        }
      })

      // Broadcast update to collaborators
      if (get().selectedRequest?.id === id) {
        socket.emit('request-update', { requestId: id, data: requestData })
      }
    } catch (error) {
      console.error('Failed to update request:', error)
    }
  },

  deleteRequest: async (id, collectionId) => {
    try {
      await axios.delete(`${API_URL}/requests/${id}`)

      set((state) => ({
        requests: {
          ...state.requests,
          [collectionId]: state.requests[collectionId].filter((r) => r.id !== id)
        },
        selectedRequest: state.selectedRequest?.id === id ? null : state.selectedRequest
      }))
    } catch (error) {
      console.error('Failed to delete request:', error)
    }
  },

  selectRequest: (request) => {
    const currentRequest = get().selectedRequest

    // Leave previous session
    if (currentRequest) {
      socket.emit('leave-session', { requestId: currentRequest.id })
    }

    set({ selectedRequest: request, response: null })

    // Join new session
    if (request) {
      const username = localStorage.getItem('username') || `User${Math.floor(Math.random() * 1000)}`
      localStorage.setItem('username', username)
      socket.emit('join-session', { requestId: request.id, username })
    }
  },

  // Execute request
  executeRequest: async () => {
    const { selectedRequest, selectedEnvironment, environments } = get()
    if (!selectedRequest) return

    set({ loading: true })

    try {
      let url = selectedRequest.url
      let headers = {}

      // Apply environment variables
      if (selectedEnvironment) {
        const env = environments.find((e) => e.id === selectedEnvironment)
        if (env) {
          env.variables.forEach((v) => {
            if (v.enabled) {
              url = url.replace(new RegExp(`{{${v.key}}}`, 'g'), v.value)
            }
          })
        }
      }

      // Build headers
      selectedRequest.headers.forEach((h) => {
        if (h.enabled) {
          headers[h.key] = h.value
        }
      })

      // Build query params
      const params = new URLSearchParams()
      selectedRequest.params.forEach((p) => {
        if (p.enabled) {
          params.append(p.key, p.value)
        }
      })

      if (params.toString()) {
        url += (url.includes('?') ? '&' : '?') + params.toString()
      }

      const startTime = Date.now()

      // Execute request
      const axiosConfig = {
        method: selectedRequest.method.toLowerCase(),
        url,
        headers,
        validateStatus: () => true // Don't throw on any status
      }

      if (['post', 'put', 'patch'].includes(selectedRequest.method.toLowerCase())) {
        if (selectedRequest.body_type === 'json') {
          try {
            axiosConfig.data = JSON.parse(selectedRequest.body || '{}')
          } catch {
            axiosConfig.data = selectedRequest.body
          }
        } else {
          axiosConfig.data = selectedRequest.body
        }
      }

      const response = await axios(axiosConfig)
      const endTime = Date.now()

      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        time: endTime - startTime,
        size: JSON.stringify(response.data).length
      }

      set({ response: responseData, loading: false })

      // Save to history
      await axios.post(`${API_URL}/history`, {
        request_id: selectedRequest.id,
        method: selectedRequest.method,
        url,
        status: response.status,
        response_time: endTime - startTime,
        response_body: JSON.stringify(response.data),
        response_headers: response.headers
      })
    } catch (error) {
      set({
        response: {
          status: 0,
          statusText: 'Error',
          data: { error: error.message },
          time: 0,
          size: 0
        },
        loading: false
      })
    }
  },

  // Environments
  loadEnvironments: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/environments`)
      set({ environments: data })
    } catch (error) {
      console.error('Failed to load environments:', error)
    }
  },

  createEnvironment: async (name, variables) => {
    try {
      const { data } = await axios.post(`${API_URL}/environments`, { name, variables })
      set((state) => ({
        environments: [...state.environments, data]
      }))
      return data
    } catch (error) {
      console.error('Failed to create environment:', error)
    }
  },

  updateEnvironment: async (id, name, variables) => {
    try {
      const { data } = await axios.put(`${API_URL}/environments/${id}`, { name, variables })
      set((state) => ({
        environments: state.environments.map((e) => (e.id === id ? data : e))
      }))
    } catch (error) {
      console.error('Failed to update environment:', error)
    }
  },

  deleteEnvironment: async (id) => {
    try {
      await axios.delete(`${API_URL}/environments/${id}`)
      set((state) => ({
        environments: state.environments.filter((e) => e.id !== id),
        selectedEnvironment: state.selectedEnvironment === id ? null : state.selectedEnvironment
      }))
    } catch (error) {
      console.error('Failed to delete environment:', error)
    }
  },

  selectEnvironment: (id) => {
    set({ selectedEnvironment: id })
  },

  // Collaboration
  setupCollaboration: () => {
    socket.on('user-joined', ({ userId, username, users }) => {
      set({ collaborators: users })
    })

    socket.on('user-left', ({ userId, users }) => {
      set({ collaborators: users })
    })

    socket.on('request-updated', ({ userId, data }) => {
      const { selectedRequest } = get()
      if (selectedRequest) {
        set({
          selectedRequest: { ...selectedRequest, ...data }
        })
      }
    })
  }
}))

// Setup collaboration listeners
useStore.getState().setupCollaboration()
