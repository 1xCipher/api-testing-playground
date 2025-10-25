import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Send, Save, Users, Code } from 'lucide-react'
import Editor from '@monaco-editor/react'
import CodeGenerator from './CodeGenerator'
import TestsPanel from './TestsPanel'

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

function RequestPanel() {
  const { selectedRequest, updateRequest, executeRequest, loading, collaborators, response } = useStore()

  const [activeTab, setActiveTab] = useState('params')
  const [localRequest, setLocalRequest] = useState(null)
  const [showCodeGen, setShowCodeGen] = useState(false)

  useEffect(() => {
    if (selectedRequest) {
      setLocalRequest({
        ...selectedRequest,
        headers: selectedRequest.headers || [],
        params: selectedRequest.params || [],
        body: selectedRequest.body || '',
        tests: selectedRequest.tests || []
      })
    }
  }, [selectedRequest?.id])

  if (!localRequest) return null

  const handleUpdate = (updates) => {
    const updated = { ...localRequest, ...updates }
    setLocalRequest(updated)
    updateRequest(localRequest.id, updated)
  }

  const addHeader = () => {
    handleUpdate({
      headers: [...localRequest.headers, { key: '', value: '', enabled: true }]
    })
  }

  const updateHeader = (index, field, value) => {
    const headers = [...localRequest.headers]
    headers[index][field] = value
    handleUpdate({ headers })
  }

  const removeHeader = (index) => {
    handleUpdate({
      headers: localRequest.headers.filter((_, i) => i !== index)
    })
  }

  const addParam = () => {
    handleUpdate({
      params: [...localRequest.params, { key: '', value: '', enabled: true }]
    })
  }

  const updateParam = (index, field, value) => {
    const params = [...localRequest.params]
    params[index][field] = value
    handleUpdate({ params })
  }

  const removeParam = (index) => {
    handleUpdate({
      params: localRequest.params.filter((_, i) => i !== index)
    })
  }

  return (
    <>
    <div className="flex-1 flex flex-col border-b border-gray-200 bg-white">
      {/* Request Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={localRequest.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Request name"
          />

          {collaborators.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
              <Users className="w-4 h-4" />
              <span>{collaborators.length} online</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={localRequest.method}
            onChange={(e) => handleUpdate({ method: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-sm"
          >
            {METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={localRequest.url}
            onChange={(e) => handleUpdate({ url: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="https://api.example.com/endpoint"
          />

          <button
            onClick={() => setShowCodeGen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            <Code className="w-4 h-4" />
            Code
          </button>

          <button
            onClick={executeRequest}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {['params', 'headers', 'body', 'tests', 'auth'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
            {tab === 'params' && localRequest.params.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                {localRequest.params.filter((p) => p.enabled).length}
              </span>
            )}
            {tab === 'headers' && localRequest.headers.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                {localRequest.headers.filter((h) => h.enabled).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50">
        {/* Query Params */}
        {activeTab === 'params' && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2"></th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Key</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Value</th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {localRequest.params.map((param, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={(e) => updateParam(index, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParam(index, 'key', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="key"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParam(index, 'key', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="value"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeParam(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addParam}
                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200"
              >
                + Add Parameter
              </button>
            </div>
          </div>
        )}

        {/* Headers */}
        {activeTab === 'headers' && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2"></th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Key</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Value</th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {localRequest.headers.map((header, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={header.enabled}
                          onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Content-Type"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="application/json"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeHeader(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addHeader}
                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200"
              >
                + Add Header
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        {activeTab === 'body' && (
          <div className="p-4 h-full">
            <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
              <div className="flex gap-2 p-2 border-b border-gray-200">
                <button
                  onClick={() => handleUpdate({ body_type: 'json' })}
                  className={`px-3 py-1.5 text-sm rounded ${
                    localRequest.body_type === 'json'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JSON
                </button>
                <button
                  onClick={() => handleUpdate({ body_type: 'text' })}
                  className={`px-3 py-1.5 text-sm rounded ${
                    localRequest.body_type === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Text
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage={localRequest.body_type === 'json' ? 'json' : 'text'}
                  language={localRequest.body_type === 'json' ? 'json' : 'text'}
                  value={localRequest.body}
                  onChange={(value) => handleUpdate({ body: value || '' })}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tests */}
        {activeTab === 'tests' && (
          <TestsPanel
            tests={localRequest.tests || []}
            onChange={(tests) => handleUpdate({ tests })}
            response={response}
          />
        )}

        {/* Auth */}
        {activeTab === 'auth' && (
          <div className="p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                Authentication options coming soon! Use the Headers tab to add auth headers manually.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Code Generator Modal */}
    {showCodeGen && (
      <CodeGenerator
        request={localRequest}
        onClose={() => setShowCodeGen(false)}
      />
    )}
    </>
  )
}

export default RequestPanel
