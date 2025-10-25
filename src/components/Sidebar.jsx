import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Folder, ChevronDown, ChevronRight, Trash2, Edit2, FileText, MoreVertical } from 'lucide-react'

function Sidebar() {
  const {
    collections,
    requests,
    selectedRequest,
    selectedCollection,
    createCollection,
    createRequest,
    deleteCollection,
    deleteRequest,
    selectRequest,
    selectCollection,
    environments,
    selectedEnvironment,
    selectEnvironment,
    createEnvironment,
    deleteEnvironment
  } = useStore()

  const [expandedCollections, setExpandedCollections] = useState(new Set())
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [activeTab, setActiveTab] = useState('collections')
  const [showNewEnv, setShowNewEnv] = useState(false)
  const [newEnvName, setNewEnvName] = useState('')

  const toggleCollection = (id) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCollections(newExpanded)
  }

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    if (newCollectionName.trim()) {
      const collection = await createCollection(newCollectionName)
      setNewCollectionName('')
      setShowNewCollection(false)
      if (collection) {
        setExpandedCollections(new Set([...expandedCollections, collection.id]))
        selectCollection(collection.id)
      }
    }
  }

  const handleCreateRequest = async (collectionId) => {
    const request = await createRequest(collectionId, {
      name: 'New Request',
      method: 'GET',
      url: 'https://api.example.com/endpoint'
    })
    if (request) {
      selectRequest(request)
    }
  }

  const handleCreateEnvironment = async (e) => {
    e.preventDefault()
    if (newEnvName.trim()) {
      await createEnvironment(newEnvName, [])
      setNewEnvName('')
      setShowNewEnv(false)
    }
  }

  const getMethodColor = (method) => {
    const colors = {
      GET: 'text-green-600 bg-green-50',
      POST: 'text-blue-600 bg-blue-50',
      PUT: 'text-yellow-600 bg-yellow-50',
      PATCH: 'text-orange-600 bg-orange-50',
      DELETE: 'text-red-600 bg-red-50'
    }
    return colors[method] || 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'collections'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Collections
        </button>
        <button
          onClick={() => setActiveTab('environments')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'environments'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Environments
        </button>
      </div>

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4">
            <button
              onClick={() => setShowNewCollection(!showNewCollection)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Collection
            </button>

            {showNewCollection && (
              <form onSubmit={handleCreateCollection} className="mt-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCollection(false)}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="px-2 pb-4 space-y-1">
            {collections.map((collection) => (
              <div key={collection.id}>
                <div className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg group">
                  <button
                    onClick={() => toggleCollection(collection.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedCollections.has(collection.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <Folder className="w-4 h-4 text-blue-600" />
                  <span className="flex-1 text-sm font-medium text-gray-900">{collection.name}</span>
                  <button
                    onClick={() => handleCreateRequest(collection.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
                    title="Add request"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteCollection(collection.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-opacity"
                    title="Delete collection"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {expandedCollections.has(collection.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {(requests[collection.id] || []).map((request) => (
                      <div
                        key={request.id}
                        onClick={() => selectRequest(request)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group ${
                          selectedRequest?.id === request.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded ${getMethodColor(
                            request.method
                          )}`}
                        >
                          {request.method}
                        </span>
                        <span className="flex-1 text-sm text-gray-900 truncate">{request.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteRequest(request.id, collection.id)
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-opacity"
                          title="Delete request"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    ))}

                    {(!requests[collection.id] || requests[collection.id].length === 0) && (
                      <div className="px-3 py-2 text-xs text-gray-400 italic">No requests yet</div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {collections.length === 0 && !showNewCollection && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No collections yet. Create one to get started!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Environments Tab */}
      {activeTab === 'environments' && (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4">
            <button
              onClick={() => setShowNewEnv(!showNewEnv)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Environment
            </button>

            {showNewEnv && (
              <form onSubmit={handleCreateEnvironment} className="mt-2">
                <input
                  type="text"
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  placeholder="Environment name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewEnv(false)}
                    className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="px-4 pb-4 space-y-2">
            <div
              onClick={() => selectEnvironment(null)}
              className={`px-3 py-2 rounded-lg cursor-pointer ${
                selectedEnvironment === null
                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">No Environment</div>
            </div>

            {environments.map((env) => (
              <div
                key={env.id}
                onClick={() => selectEnvironment(env.id)}
                className={`px-3 py-2 rounded-lg cursor-pointer group ${
                  selectedEnvironment === env.id
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{env.name}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteEnvironment(env.id)
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-opacity"
                    title="Delete environment"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {env.variables?.length || 0} variables
                </div>
              </div>
            ))}

            {environments.length === 0 && !showNewEnv && (
              <div className="px-3 py-8 text-center text-sm text-gray-400">
                No environments yet. Create one to manage variables!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
