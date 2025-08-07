'use client';

import { useState } from 'react';
import { FaSearch, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';

const DigiPinToCoordinate = ({ onCoordinatesFound }) => {
  const [digiPin, setDigiPin] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateDigiPin = (pin) => {
    // Remove hyphens for validation
    const cleanPin = pin.replace(/-/g, '');
    
    if (cleanPin.length !== 10) {
      return 'DigiPin must be exactly 10 characters long (excluding hyphens)';
    }

    // Check if all characters are valid (from the DIGIPIN_GRID)
    const validChars = 'FC98J327K456LMPT';
    for (let char of cleanPin.toUpperCase()) {
      if (!validChars.includes(char)) {
        return `Invalid character '${char}' in DigiPin`;
      }
    }

    return null;
  };

  const formatDigiPin = (pin) => {
    // Remove existing hyphens and convert to uppercase
    const cleanPin = pin.replace(/-/g, '').toUpperCase();
    
    // Add hyphens in the correct positions: XXX-XXX-XXXX
    if (cleanPin.length >= 3) {
      let formatted = cleanPin.substring(0, 3);
      if (cleanPin.length >= 6) {
        formatted += '-' + cleanPin.substring(3, 6);
        if (cleanPin.length > 6) {
          formatted += '-' + cleanPin.substring(6, 10);
        }
      } else if (cleanPin.length > 3) {
        formatted += '-' + cleanPin.substring(3);
      }
      return formatted;
    }
    return cleanPin;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formatted = formatDigiPin(value);
    setDigiPin(formatted);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateDigiPin(digiPin);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/decode-digipin?digipin=${encodeURIComponent(digiPin)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to decode DigiPin');
      }

      setCoordinates(data);
      onCoordinatesFound(data.latitude, data.longitude, digiPin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setDigiPin('');
    setCoordinates(null);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <FaSearch className="text-green-600" />
          <span>DigiPin to Coordinates</span>
        </h2>
        {digiPin && (
          <button
            onClick={clearForm}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            Clear
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="digipin" className="block text-sm font-medium text-gray-700 mb-1">
            DigiPin Code
          </label>
          <input
            type="text"
            id="digipin"
            value={digiPin}
            onChange={handleInputChange}
            placeholder="e.g., FC9-8J3-2K45"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-lg"
            required
            maxLength={12} // XXX-XXX-XXXX format
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: XXX-XXX-XXXX (hyphens will be added automatically)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !digiPin}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Finding Coordinates...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Find Coordinates</span>
            </>
          )}
        </button>
      </form>

      {coordinates && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2 mb-3">
            <FaMapMarkerAlt className="text-blue-600" />
            <span className="font-medium text-gray-900">Found Coordinates</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={coordinates.latitude}
                readOnly
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={coordinates.longitude}
                readOnly
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigiPinToCoordinate;
