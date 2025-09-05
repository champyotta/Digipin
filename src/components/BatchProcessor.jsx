
'use client';

import { useState } from 'react';
import { FaUpload, FaDownload, FaSpinner, FaTrash, FaPlay, FaFileAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const BatchProcessor = () => {
  const [processingType, setProcessingType] = useState('coordinates'); // 'coordinates' or 'digipins'
  const [inputData, setInputData] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const sampleCoordinatesData = `28.6139,77.2090
19.0760,72.8777
13.0827,80.2707
22.5726,88.3639
12.9716,77.5946`;

  const sampleDigiPinsData = `39J-438-TJC7
4FK-595-8823
4T3-84L-L5L9
2TF-J7F-86MM
4P3-JK8-52C9
`;





  const parseInputData = () => {
    const lines = inputData.trim().split('\n').filter(line => line.trim() !== '');
    const parsed = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (processingType === 'coordinates') {
        const coords = line.split(',').map(c => c.trim());
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lon = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lon)) {
            parsed.push({ lat, lon, index: i + 1 });
          } else {
            parsed.push({ error: `Invalid coordinates on line ${i + 1}: ${line}`, index: i + 1 });
          }
        } else {
          parsed.push({ error: `Invalid format on line ${i + 1}: ${line}`, index: i + 1 });
        }
      } else {
        // Processing DigiPins
        const cleanPin = line.replace(/-/g, '').toUpperCase();
        if (cleanPin.length === 10) {
          parsed.push({ digiPin: line, index: i + 1 });
        } else {
          parsed.push({ error: `Invalid DigiPin on line ${i + 1}: ${line}`, index: i + 1 });
        }
      }
    }

    return parsed;
  };

  const processData = async () => {
    const parsedData = parseInputData();
    if (parsedData.length === 0) {
      setError('No valid data to process');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setProgress(0);

    const processedResults = [];
    const total = parsedData.length;

    for (let i = 0; i < parsedData.length; i++) {
      const item = parsedData[i];
      
      if (item.error) {
        processedResults.push({
          ...item,
          status: 'error'
        });
      } else {
        try {
          let response;
          if (processingType === 'coordinates') {
            response = await fetch(`/api/encode-digipin?lat=${item.lat}&lon=${item.lon}`);
          } else {
            response = await fetch(`/api/decode-digipin?digipin=${encodeURIComponent(item.digiPin)}`);
          }

          const data = await response.json();

          if (response.ok) {
            processedResults.push({
              ...item,
              ...data,
              status: 'success'
            });
          } else {
            processedResults.push({
              ...item,
              error: data.error || 'Processing failed',
              status: 'error'
            });
          }
        } catch (err) {
          processedResults.push({
            ...item,
            error: err.message,
            status: 'error'
          });
        }
      }

      setProgress(Math.round(((i + 1) / total) * 100));
      setResults([...processedResults]);
      
      // Add delay for API rate limiting (especially for geocoding)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setLoading(false);
  };

  const downloadResults = () => {
    if (results.length === 0) return;

    let csvContent = '';
    if (processingType === 'coordinates') {
      csvContent = 'Line,Latitude,Longitude,DigiPin,Address,Status,Error\n';
      results.forEach(result => {
        csvContent += `${result.index},${result.lat || ''},${result.lon || ''},${result.digiPin || ''},${result.address ? `"${result.address}"` : ''},${result.status},${result.error ? `"${result.error}"` : ''}\n`;
      });
    } else {
      csvContent = 'Line,DigiPin,Latitude,Longitude,Address,Status,Error\n';
      results.forEach(result => {
        csvContent += `${result.index},${result.digiPin || ''},${result.lat || ''},${result.lon || ''},${result.address ? `"${result.address}"` : ''},${result.status},${result.error ? `"${result.error}"` : ''}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digipin_batch_results_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadSampleData = () => {
    setInputData(processingType === 'coordinates' ? sampleCoordinatesData : sampleDigiPinsData);
    setResults([]);
    setError('');
  };

  const clearAll = () => {
    setInputData('');
    setResults([]);
    setError('');
    setProgress(0);
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Processing Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <FaFileAlt className="text-blue-600" />
          <span>Batch Processing</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              setProcessingType('coordinates');
              setInputData('');
              setResults([]);
              setError('');
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              processingType === 'coordinates'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <h3 className="font-semibold mb-2">Coordinates → DigiPins</h3>
            <p className="text-sm text-gray-700">Convert multiple coordinates to DigiPin codes</p>
            <p className="text-xs text-gray-700 mt-1">Format: lat,lon (one per line)</p>
          </button>
          
          <button
            onClick={() => {
              setProcessingType('digipins');
              setInputData('');
              setResults([]);
              setError('');
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              processingType === 'digipins'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <h3 className="font-semibold mb-2">DigiPins → Coordinates</h3>
            <p className="text-sm text-gray-700">Convert multiple DigiPin codes to coordinates</p>
            <p className="text-xs text-gray-700 mt-1">Format: DigiPin (one per line)</p>
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Input Data ({processingType === 'coordinates' ? 'Coordinates' : 'DigiPins'})
            </label>
            <div className="space-x-2">
              <label className="text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const text = await file.text();
                    let lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
                    if (lines.length < 1) return;
                    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
                    let newInput = '';
                    if (processingType === 'coordinates') {
                      const latIdx = header.indexOf('lat');
                      const lonIdx = header.indexOf('lon');
                      if (latIdx === -1 || lonIdx === -1) {
                        setError('CSV must have columns: lat, lon');
                        return;
                      }
                      for (let i = 1; i < lines.length; i++) {
                        const row = lines[i].split(',');
                        if (row.length > Math.max(latIdx, lonIdx)) {
                          const lat = row[latIdx].trim();
                          const lon = row[lonIdx].trim();
                          if (lat && lon) newInput += `${lat},${lon}\n`;
                        }
                      }
                    } else {
                      const pinIdx = header.indexOf('digipin');
                      if (pinIdx === -1) {
                        setError('CSV must have column: digipin');
                        return;
                      }
                      for (let i = 1; i < lines.length; i++) {
                        const row = lines[i].split(',');
                        if (row.length > pinIdx) {
                          const pin = row[pinIdx].trim();
                          if (pin) newInput += `${pin}\n`;
                        }
                      }
                    }
                    setInputData(newInput.trim());
                    setResults([]);
                    setError('');
                    e.target.value = '';
                  }}
                />
                Import CSV
              </label>
              <button
                onClick={loadSampleData}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Load Sample Data
              </button>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
              
            </div>
          </div>
          
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={
              processingType === 'coordinates'
                ? 'Enter coordinates (lat,lon) one per line:\n28.6139,77.2090\n19.0760,72.8777\n...'
                : 'Enter DigiPins one per line:\nF98-JC3-27K4\nM56L-MPT-FC98\n...'
            }
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm placeholder:text-gray-400 text-gray-700 shadow-sm"
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={processData}
              disabled={loading || !inputData.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl btn-hover"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaPlay />
                  <span>Process Data</span>
                </>
              )}
            </button>
            
            {results.length > 0 && (
              <button
                onClick={downloadResults}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FaDownload />
                <span>Download CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Processing Progress</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Processing Results</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <FaCheckCircle />
                  <span>{successCount} Success</span>
                </div>
                <div className="flex items-center space-x-1 text-red-600">
                  <FaExclamationTriangle />
                  <span>{errorCount} Errors</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Line</th>
                  {processingType === 'coordinates' ? (
                    <>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Coordinates</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">DigiPin</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">DigiPin</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Coordinates</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Address</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className={result.status === 'error' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 font-mono text-gray-700">{result.index}</td>
                    {processingType === 'coordinates' ? (
                      <>
                        <td className="px-4 py-3 font-mono text-gray-700">
                          {result.lat && result.lon ? `${result.lat}, ${result.lon}` : '-'}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-700">{result.digiPin || '-'}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-mono text-gray-700">{result.digiPin || '-'}</td>
                        <td className="px-4 py-3 font-mono text-gray-700">
                          {result.lat && result.lon ? `${result.lat}, ${result.lon}` : '-'}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={result.address}>
                      {result.address || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {result.status === 'success' ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <FaCheckCircle className="text-xs" />
                          <span>Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <FaExclamationTriangle className="text-xs" />
                          <span title={result.error}>Error</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchProcessor;
