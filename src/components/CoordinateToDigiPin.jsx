'use client';

import { useState, useEffect } from 'react';
import { FaCopy, FaMapMarkerAlt, FaSpinner, FaTimes } from 'react-icons/fa';

const CoordinateToDigiPin = ({ onDigiPinGenerated, selectedCoords, onClearSelection }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [digiPin, setDigiPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Update form when coordinates are selected from map
  useEffect(() => {
    if (selectedCoords.lat && selectedCoords.lon) {
      setLatitude(selectedCoords.lat);
      setLongitude(selectedCoords.lon);
      setError('');
    }
  }, [selectedCoords]);

  const validateCoordinates = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return 'Please enter valid numbers for latitude and longitude';
    }

    if (latNum < 2.5 || latNum > 38.5) {
      return 'Latitude must be between 2.5 and 38.5';
    }

    if (lonNum < 63.5 || lonNum > 99.5) {
      return 'Longitude must be between 63.5 and 99.5';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateCoordinates(latitude, longitude);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/encode-digipin?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate DigiPin');
      }

      setDigiPin(data.digiPin);
      onDigiPinGenerated(latitude, longitude, data.digiPin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(digiPin);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearForm = () => {
    setLatitude('');
    setLongitude('');
    setDigiPin('');
    setError('');
    onClearSelection();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <FaMapMarkerAlt className="text-blue-600" />
          <span>Coordinates to DigiPin</span>
        </h2>
        {(latitude || longitude) && (
          <button
            onClick={clearForm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear form"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g., 28.6139"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Range: 2.5 to 38.5</p>
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g., 77.2090"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Range: 63.5 to 99.5</p>
          </div>
        </div>

        {selectedCoords.lat && selectedCoords.lon && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              📍 Coordinates selected from map: {selectedCoords.lat}, {selectedCoords.lon}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !latitude || !longitude}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate DigiPin</span>
          )}
        </button>
      </form>

      {digiPin && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generated DigiPin
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={digiPin}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md font-mono text-lg"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center space-x-1"
              title="Copy to clipboard"
            >
              <FaCopy className="text-sm" />
              {copySuccess && <span className="text-xs">Copied!</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinateToDigiPin;
