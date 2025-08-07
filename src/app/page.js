'use client';

import { useState } from 'react';
import CoordinateToDigiPin from '../components/CoordinateToDigiPin';
import DigiPinToCoordinate from '../components/DigiPinToCoordinate';
import BatchProcessor from '../components/BatchProcessor';
import MapComponent from '../components/MapComponent';
import { FaMapMarkerAlt, FaExchangeAlt, FaBars } from 'react-icons/fa';

export default function Home() {
  const [mapCenter, setMapCenter] = useState([20.5, 78.9]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [marker, setMarker] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState({ lat: '', lon: '' });
  const [activeTab, setActiveTab] = useState('convert');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCoordinateGenerated = (lat, lon, digiPin, address) => {
    const newMarker = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      digiPin,
      address,
      type: 'digipin'
    };
    setMarker(newMarker);
    setMapCenter([newMarker.lat, newMarker.lon]);
    setMapZoom(12);
  };

  const handleDigiPinDecoded = (lat, lon, digiPin, address) => {
    const newMarker = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      digiPin,
      address,
      type: 'coordinates'
    };
    setMarker(newMarker);
    setMapCenter([newMarker.lat, newMarker.lon]);
    setMapZoom(12);
  };

  const handleMapClick = (lat, lon) => {
    setSelectedCoords({ lat: lat.toFixed(6), lon: lon.toFixed(6) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">DigiPin Portal</h1>
                <p className="text-gray-600">Professional coordinate management system</p>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FaBars className="text-xl" />
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button
                onClick={() => setActiveTab('convert')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'convert'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Convert
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'batch'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Batch Processing
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="lg:hidden mb-6 bg-white rounded-lg shadow-md p-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => {
                  setActiveTab('convert');
                  setSidebarOpen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'convert'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Convert
              </button>
              <button
                onClick={() => {
                  setActiveTab('batch');
                  setSidebarOpen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'batch'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Batch Processing
              </button>
            </nav>
          </div>
        )}

        {activeTab === 'convert' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Converters */}
            <div className="space-y-6">
              <CoordinateToDigiPin 
                onDigiPinGenerated={handleCoordinateGenerated}
                selectedCoords={selectedCoords}
                onClearSelection={() => setSelectedCoords({ lat: '', lon: '' })}
              />
              
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-3 text-gray-500">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20"></div>
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <FaExchangeAlt className="text-lg text-blue-600" />
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20"></div>
                </div>
              </div>
              
              <DigiPinToCoordinate 
                onCoordinatesFound={handleDigiPinDecoded}
              />
            </div>

            {/* Right Column - Map */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
                  <p className="text-sm text-gray-600">Click on the map to select coordinates for conversion</p>
                  {marker && marker.address && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-gray-700">Selected Location:</p>
                      <p className="text-sm text-gray-600">{marker.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        DigiPin: {marker.digiPin} | Coords: {marker.lat.toFixed(6)}, {marker.lon.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="h-96 lg:h-[600px]">
                  <MapComponent
                    center={mapCenter}
                    zoom={mapZoom}
                    marker={marker}
                    onMapClick={handleMapClick}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <BatchProcessor />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
