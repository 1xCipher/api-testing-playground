import { useState } from 'react'
import { useStore } from '../store/useStore'
import Editor from '@monaco-editor/react'
import { Clock, Database, CheckCircle, XCircle } from 'lucide-react'

function ResponsePanel() {
  const { response } = useStore()
  const [activeTab, setActiveTab] = useState('body')

  if (!response) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No response yet</p>
          <p className="text-sm mt-2">Send a request to see the response here</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50'
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50'
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50'
    if (status >= 500) return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatJSON = (data) => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Response Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {response.status >= 200 && response.status < 300 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${getStatusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{response.time}ms</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Database className="w-4 h-4" />
            <span className="font-medium">{formatBytes(response.size)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['body', 'headers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900 bg-gray-50'
            }`}
          >
            {tab}
            {tab === 'headers' && response.headers && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                {Object.keys(response.headers).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'body' && (
          <div className="h-full">
            <Editor
              height="100%"
              defaultLanguage="json"
              language="json"
              value={formatJSON(response.data)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
              theme="vs-light"
            />
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="p-4 overflow-y-auto scrollbar-thin h-full bg-gray-50">
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Header</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {response.headers && Object.entries(response.headers).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{key}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResponsePanel
