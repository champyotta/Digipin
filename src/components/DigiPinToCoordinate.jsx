'use client';

import { useState } from 'react';
import { FaSearch, FaSpinner, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const DigiPinToCoordinate = ({ onCoordinatesFound }) => {
  const [digiPin, setDigiPin] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
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

  const fetchAddress = async (lat, lon) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    } finally {
      setLoadingAddress(false);
    }
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
    setAddress('');

    try {
      const response = await fetch(`/api/decode-digipin?digipin=${encodeURIComponent(digiPin)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to decode DigiPin');
      }

      setCoordinates(data);
      
      // Fetch address for the decoded coordinates
      await fetchAddress(data.latitude, data.longitude);
      
      // Note: We'll pass the address in a timeout to ensure it's loaded
      setTimeout(() => {
        onCoordinatesFound(data.latitude, data.longitude, digiPin, address);
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setDigiPin('');
    setCoordinates(null);
    setAddress('');
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2.5">
            <FaSearch className="text-white text-lg" />
          </div>
          <span>DigiPin to Coordinates</span>
        </h2>
        {digiPin && (
          <button
            onClick={clearForm}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="Clear form"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="digipin" className="block text-sm font-semibold text-gray-700 mb-2">
            DigiPin Code
          </label>
          <input
            type="text"
            id="digipin"
            value={digiPin}
            onChange={handleInputChange}
            placeholder="e.g., FC9-8J3-2K45"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-lg transition-all"
            required
            maxLength={12} // XXX-XXX-XXXX format
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: XXX-XXX-XXXX (hyphens will be added automatically)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !digiPin}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 font-medium"
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
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <FaMapMarkerAlt className="text-blue-600" />
            <span className="font-semibold text-gray-900">Found Coordinates</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={coordinates.latitude}
                readOnly
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={coordinates.longitude}
                readOnly
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono font-semibold"
              />
            </div>
          </div>

          {/* Address Display */}
          {(address || loadingAddress) && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Address Information</h4>
              {loadingAddress ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <FaSpinner className="animate-spin text-sm" />
                  <span className="text-sm">Fetching address...</span>
                </div>
              ) : (
                <p className="text-sm text-blue-700">{address}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DigiPinToCoordinate;
