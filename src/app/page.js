'use client';

import { useState } from 'react';
import CoordinateToDigiPin from '../components/CoordinateToDigiPin';
import DigiPinToCoordinate from '../components/DigiPinToCoordinate';
import MapComponent from '../components/MapComponent';
import { FaMapMarkerAlt, FaExchangeAlt } from 'react-icons/fa';

export default function Home() {
  const [mapCenter, setMapCenter] = useState([20.5, 78.9]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [marker, setMarker] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState({ lat: '', lon: '' });

  const handleCoordinateGenerated = (lat, lon, digiPin) => {
    const newMarker = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      digiPin,
      type: 'digipin'
    };
    setMarker(newMarker);
    setMapCenter([newMarker.lat, newMarker.lon]);
    setMapZoom(12);
  };

  const handleDigiPinDecoded = (lat, lon, digiPin) => {
    const newMarker = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      digiPin,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-900">DigiPin Portal</h1>
          </div>
          <p className="mt-2 text-gray-600">Convert between coordinates and DigiPin codes with interactive mapping</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Converters */}
          <div className="space-y-6">
            <CoordinateToDigiPin 
              onDigiPinGenerated={handleCoordinateGenerated}
              selectedCoords={selectedCoords}
              onClearSelection={() => setSelectedCoords({ lat: '', lon: '' })}
            />
            
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="h-px bg-gray-300 w-16"></div>
                <FaExchangeAlt className="text-lg" />
                <div className="h-px bg-gray-300 w-16"></div>
              </div>
            </div>
            
            <DigiPinToCoordinate 
              onCoordinatesFound={handleDigiPinDecoded}
            />
          </div>

          {/* Right Column - Map */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
                <p className="text-sm text-gray-600">Click on the map to select coordinates</p>
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
      </div>
    </div>
  );
}
