'use client';

import { useState, useEffect } from 'react';
import { FaCopy, FaMapMarkerAlt, FaSpinner, FaTimes, FaLocationArrow } from 'react-icons/fa';

const CoordinateToDigiPin = ({ onDigiPinGenerated, selectedCoords, onClearSelection }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [digiPin, setDigiPin] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Update form when coordinates are selected from map
  useEffect(() => {
    if (selectedCoords.lat && selectedCoords.lon) {
      setLatitude(selectedCoords.lat);
      setLongitude(selectedCoords.lon);
      setError('');
      // Fetch address for selected coordinates
      fetchAddress(selectedCoords.lat, selectedCoords.lon);
    }
  }, [selectedCoords]);

  const fetchAddress = async (lat, lon) => {
    setLoadingAddress(true);
    setAddress('');
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
      // First, get the address if we don't have it
      if (!address && !loadingAddress) {
        await fetchAddress(latitude, longitude);
      }

      const response = await fetch(`/api/encode-digipin?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate DigiPin');
      }

      setDigiPin(data.digiPin);
      onDigiPinGenerated(latitude, longitude, data.digiPin, address || 'Address not available');
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
    setAddress('');
    setError('');
    onClearSelection();
  };

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          setLatitude(lat);
          setLongitude(lon);
          setError('');
          fetchAddress(lat, lon);
        },
        (error) => {
          setError('Unable to get current location: ' + error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2.5">
            <FaMapMarkerAlt className="text-white text-lg" />
          </div>
          <span>Coordinates to DigiPin</span>
        </h2>
        {(latitude || longitude) && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g., 28.6139"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-700 text-gray-700"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Range: 2.5 to 38.5</p>
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g., 77.2090"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-700 text-gray-700"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Range: 63.5 to 99.5</p>
          </div>
        </div>

        {/* Current Location Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
          >
            <FaLocationArrow className="text-sm" />
            <span>Use Current Location</span>
          </button>
        </div>

        {/* Address Display */}
        {(address || loadingAddress) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

        {selectedCoords.lat && selectedCoords.lon && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="text-green-600 text-sm mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Coordinates selected from map</p>
                <p className="text-sm text-green-700">{selectedCoords.lat}, {selectedCoords.lon}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !latitude || !longitude}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 font-medium"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Generating DigiPin...</span>
            </>
          ) : (
            <span>Generate DigiPin</span>
          )}
        </button>
      </form>

      {digiPin && (
        <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Generated DigiPin
          </label>
          <div className="flex items-center space-x-3 text-gray-700">
            <input
              type="text"
              value={digiPin}
              readOnly
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono text-lg font-semibold text-center"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
              title="Copy to clipboard"
            >
              <FaCopy className="text-sm" />
              {copySuccess && <span className="text-xs">Copied!</span>}
            </button>
          </div>
          
          {address && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-sm font-medium text-gray-700">Location Address:</p>
              <p className="text-sm text-gray-600 mt-1">{address}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoordinateToDigiPin;
