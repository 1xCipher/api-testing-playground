import { useState } from 'react'
import { Plus, Trash2, Play, CheckCircle, XCircle } from 'lucide-react'

const TEST_TYPES = [
  { id: 'status', name: 'Status Code', description: 'Check response status' },
  { id: 'header', name: 'Header Exists', description: 'Verify header presence' },
  { id: 'body', name: 'Body Contains', description: 'Check if body contains text' },
  { id: 'json', name: 'JSON Path', description: 'Validate JSON value' },
  { id: 'time', name: 'Response Time', description: 'Check response time' }
]

function TestsPanel({ tests, onChange, response }) {
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState([])

  const addTest = () => {
    const newTest = {
      id: Date.now().toString(),
      type: 'status',
      field: '',
      operator: 'equals',
      value: '200',
      enabled: true
    }
    onChange([...tests, newTest])
  }

  const updateTest = (id, updates) => {
    onChange(tests.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const removeTest = (id) => {
    onChange(tests.filter(t => t.id !== id))
  }

  const runTests = () => {
    if (!response) return

    const results = tests.filter(t => t.enabled).map(test => {
      let passed = false
      let message = ''

      try {
        switch (test.type) {
          case 'status':
            passed = response.status === parseInt(test.value)
            message = passed ? `Status is ${test.value}` : `Expected ${test.value}, got ${response.status}`
            break

          case 'header':
            const headerExists = response.headers && response.headers[test.field.toLowerCase()]
            passed = headerExists !== undefined
            message = passed ? `Header '${test.field}' exists` : `Header '${test.field}' not found`
            break

          case 'body':
            const bodyString = JSON.stringify(response.data)
            passed = bodyString.includes(test.value)
            message = passed ? `Body contains '${test.value}'` : `Body does not contain '${test.value}'`
            break

          case 'json':
            const value = getNestedValue(response.data, test.field)
            passed = String(value) === test.value
            message = passed ? `${test.field} equals ${test.value}` : `Expected ${test.value}, got ${value}`
            break

          case 'time':
            const maxTime = parseInt(test.value)
            passed = response.time <= maxTime
            message = passed ? `Response time (${response.time}ms) is under ${maxTime}ms` : `Response time (${response.time}ms) exceeds ${maxTime}ms`
            break

          default:
            passed = false
            message = 'Unknown test type'
        }
      } catch (error) {
        passed = false
        message = `Error: ${error.message}`
      }

      return { ...test, passed, message }
    })

    setTestResults(results)
    setShowResults(true)
  }

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  const passedTests = testResults.filter(t => t.passed).length
  const totalTests = testResults.length

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Response Tests</h3>
        <div className="flex gap-2">
          {response && tests.some(t => t.enabled) && (
            <button
              onClick={runTests}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Run Tests
            </button>
          )}
          <button
            onClick={addTest}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Test
          </button>
        </div>
      </div>

      {showResults && testResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`flex items-center gap-2 ${passedTests === totalTests ? 'text-green-600' : 'text-red-600'}`}>
              {passedTests === totalTests ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {passedTests}/{totalTests} tests passed
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {testResults.map(result => (
              <div
                key={result.id}
                className={`flex items-start gap-2 p-2 rounded ${
                  result.passed ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {result.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        {tests.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">No tests yet. Add a test to validate responses automatically.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tests.map(test => (
              <div key={test.id} className="p-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={test.enabled}
                    onChange={(e) => updateTest(test.id, { enabled: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />

                  <div className="flex-1 space-y-2">
                    <select
                      value={test.type}
                      onChange={(e) => updateTest(test.id, { type: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    >
                      {TEST_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      {(test.type === 'header' || test.type === 'json') && (
                        <input
                          type="text"
                          value={test.field}
                          onChange={(e) => updateTest(test.id, { field: e.target.value })}
                          placeholder={test.type === 'json' ? 'JSON path (e.g., data.user.id)' : 'Header name'}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                        />
                      )}

                      <input
                        type="text"
                        value={test.value}
                        onChange={(e) => updateTest(test.id, { value: e.target.value })}
                        placeholder={
                          test.type === 'status' ? '200' :
                          test.type === 'time' ? 'Max ms' :
                          'Expected value'
                        }
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <p className="text-xs text-gray-500">
                      {TEST_TYPES.find(t => t.id === test.type)?.description}
                    </p>
                  </div>

                  <button
                    onClick={() => removeTest(test.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TestsPanel
