import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import { useStore } from './store/useStore'

function App() {
  const {
    selectedRequest,
    loadCollections,
    loadEnvironments,
    collections
  } = useStore()

  useEffect(() => {
    loadCollections()
    loadEnvironments()
  }, [loadCollections, loadEnvironments])

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">API Testing Playground</h1>
            <p className="text-xs text-gray-500">Test, collaborate, and ship faster</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedRequest ? (
            <>
              <RequestPanel />
              <ResponsePanel />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {collections.length === 0 ? 'Create your first collection' : 'Select a request to get started'}
                </h2>
                <p className="text-gray-500 mb-6">
                  {collections.length === 0
                    ? 'Organize your API requests into collections'
                    : 'Choose a request from the sidebar or create a new one'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
