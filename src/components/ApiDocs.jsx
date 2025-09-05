'use client';

import { useState } from 'react';
import { FaCode, FaCopy, FaPlay, FaBook, FaKey, FaShieldAlt, FaRocket } from 'react-icons/fa';

const ApiDocs = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('encode');
  const [copySuccess, setCopySuccess] = useState('');

  const endpoints = [
    {
      id: 'encode',
      name: 'Encode Coordinates',
      method: 'GET',
      path: '/api/encode-digipin',
      description: 'Convert latitude and longitude coordinates to a DigiPin code',
      parameters: [
        { name: 'lat', type: 'number', required: true, description: 'Latitude (2.5 to 38.5)' },
        { name: 'lon', type: 'number', required: true, description: 'Longitude (63.5 to 99.5)' },
      ],
      example: {
        request: 'GET /api/encode-digipin?lat=28.6139&lon=77.2090',
        response: {
          digiPin: 'FC9-8J3-2K45',
          address: 'New Delhi, Delhi, India'
        }
      }
    },
    {
      id: 'decode',
      name: 'Decode DigiPin',
      method: 'GET',
      path: '/api/decode-digipin',
      description: 'Convert a DigiPin code back to coordinates',
      parameters: [
        { name: 'digipin', type: 'string', required: true, description: 'DigiPin code (10 characters)' },
      ],
      example: {
        request: 'GET /api/decode-digipin?digipin=FC9-8J3-2K45',
        response: {
          latitude: 28.6139,
          longitude: 77.2090,
          lat: 28.6139,
          lon: 77.2090,
          address: 'New Delhi, Delhi, India'
        }
      }
    }
  ];

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentEndpoint = endpoints.find(e => e.id === activeEndpoint);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FaBook className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h2>
        <p className="text-lg text-gray-600">
          Integrate DigiPin into your applications with our simple REST API
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <FaRocket className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Quick Start</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FaKey className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">1. Get API Key</h4>
            <p className="text-sm text-gray-600">Sign up for a free account to get your API key</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FaCode className="text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">2. Make Request</h4>
            <p className="text-sm text-gray-600">Send HTTP requests to our endpoints</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FaShieldAlt className="text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">3. Handle Response</h4>
            <p className="text-sm text-gray-600">Process JSON responses in your application</p>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4">Endpoints</h3>
            <nav className="space-y-2">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => setActiveEndpoint(endpoint.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeEndpoint === endpoint.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{endpoint.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {endpoint.method}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {currentEndpoint && (
            <>
              {/* Endpoint Details */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentEndpoint.method === 'GET' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {currentEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{currentEndpoint.path}</code>
                </div>
                <p className="text-gray-600 mb-6">{currentEndpoint.description}</p>

                {/* Parameters */}
                <h4 className="font-semibold text-gray-900 mb-4">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Required</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEndpoint.parameters.map((param, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-mono text-blue-600">{param.name}</td>
                          <td className="py-3 px-4 text-gray-600">{param.type}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              param.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {param.required ? 'Required' : 'Optional'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example Request */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Example Request</h4>
                  <button
                    onClick={() => copyToClipboard(currentEndpoint.example.request, 'request')}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    <FaCopy className="text-xs" />
                    <span>{copySuccess === 'request' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm">
                    {currentEndpoint.example.request}
                  </code>
                </div>
              </div>

              {/* Example Response */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Example Response</h4>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(currentEndpoint.example.response, null, 2), 'response')}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    <FaCopy className="text-xs" />
                    <span>{copySuccess === 'response' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-blue-400 font-mono text-sm">
                    {JSON.stringify(currentEndpoint.example.response, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Try It Out */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <FaPlay className="text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Try It Out</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Test this endpoint directly from our interactive API explorer
                </p>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                  Open API Explorer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">1,000</div>
            <div className="text-sm text-gray-600">Requests per hour</div>
            <div className="text-xs text-gray-500 mt-1">Free tier</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">10,000</div>
            <div className="text-sm text-gray-600">Requests per hour</div>
            <div className="text-xs text-gray-500 mt-1">Pro tier</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-1">Unlimited</div>
            <div className="text-sm text-gray-600">Requests per hour</div>
            <div className="text-xs text-gray-500 mt-1">Enterprise tier</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;