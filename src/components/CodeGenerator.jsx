import { useState } from 'react'
import { Code, Copy, Check } from 'lucide-react'
import Editor from '@monaco-editor/react'

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript (Fetch)', icon: 'JS' },
  { id: 'curl', name: 'cURL', icon: 'cURL' },
  { id: 'python', name: 'Python (Requests)', icon: 'PY' },
  { id: 'node', name: 'Node.js (Axios)', icon: 'Node' },
  { id: 'go', name: 'Go', icon: 'Go' },
  { id: 'java', name: 'Java', icon: 'Java' }
]

function CodeGenerator({ request, onClose }) {
  const [selectedLang, setSelectedLang] = useState('javascript')
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    const { method, url, headers, body, params } = request

    // Build URL with params
    let fullUrl = url
    const enabledParams = params?.filter(p => p.enabled) || []
    if (enabledParams.length > 0) {
      const queryString = enabledParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&')
      fullUrl += (url.includes('?') ? '&' : '?') + queryString
    }

    // Build headers object
    const enabledHeaders = headers?.filter(h => h.enabled) || []
    const headersObj = {}
    enabledHeaders.forEach(h => {
      headersObj[h.key] = h.value
    })

    switch (selectedLang) {
      case 'javascript':
        return generateJavaScript(method, fullUrl, headersObj, body)
      case 'curl':
        return generateCurl(method, fullUrl, headersObj, body)
      case 'python':
        return generatePython(method, fullUrl, headersObj, body)
      case 'node':
        return generateNodeAxios(method, fullUrl, headersObj, body)
      case 'go':
        return generateGo(method, fullUrl, headersObj, body)
      case 'java':
        return generateJava(method, fullUrl, headersObj, body)
      default:
        return '// Select a language'
    }
  }

  const generateJavaScript = (method, url, headers, body) => {
    const options = {
      method,
      headers
    }
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = body
    }

    return `fetch('${url}', ${JSON.stringify(options, null, 2)})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
  }

  const generateCurl = (method, url, headers, body) => {
    let cmd = `curl -X ${method} '${url}'`

    Object.entries(headers).forEach(([key, value]) => {
      cmd += ` \\\n  -H '${key}: ${value}'`
    })

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      cmd += ` \\\n  -d '${body}'`
    }

    return cmd
  }

  const generatePython = (method, url, headers, body) => {
    let code = `import requests\n\n`
    code += `url = '${url}'\n`
    code += `headers = ${JSON.stringify(headers, null, 2)}\n`

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      code += `data = ${body}\n\n`
      code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`
    } else {
      code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)\n`
    }

    code += `print(response.json())`
    return code
  }

  const generateNodeAxios = (method, url, headers, body) => {
    const config = { method, url, headers }
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.data = JSON.parse(body || '{}')
    }

    return `const axios = require('axios');

const config = ${JSON.stringify(config, null, 2)};

axios(config)
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`
  }

  const generateGo = (method, url, headers, body) => {
    let code = `package main

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    url := "${url}"
    `

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      code += `payload := []byte(\`${body}\`)
    req, _ := http.NewRequest("${method}", url, bytes.NewBuffer(payload))
    `
    } else {
      code += `req, _ := http.NewRequest("${method}", url, nil)
    `
    }

    Object.entries(headers).forEach(([key, value]) => {
      code += `req.Header.Add("${key}", "${value}")
    `
    })

    code += `
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`

    return code
  }

  const generateJava = (method, url, headers, body) => {
    return `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class ApiRequest {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create("${url}"))
            .${method}(${body && ['POST', 'PUT', 'PATCH'].includes(method) ? `HttpRequest.BodyPublishers.ofString("${body.replace(/"/g, '\\"')}")` : 'HttpRequest.BodyPublishers.noBody()'});

${Object.entries(headers).map(([key, value]) => `        builder.header("${key}", "${value}");`).join('\n')}

        HttpRequest request = builder.build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println(response.body());
    }
}`
  }

  const handleCopy = async () => {
    const code = generateCode()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Generate Code</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedLang === lang.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={selectedLang === 'curl' ? 'shell' : selectedLang === 'node' ? 'javascript' : selectedLang}
            value={generateCode()}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2
            }}
            theme="vs-light"
          />
        </div>
      </div>
    </div>
  )
}

export default CodeGenerator
