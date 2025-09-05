'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CoordinateToDigiPin from '../components/CoordinateToDigiPin';
import DigiPinToCoordinate from '../components/DigiPinToCoordinate';
import BatchProcessor from '../components/BatchProcessor';
import Analytics from '../components/Analytics';
import ApiDocs from '../components/ApiDocs';
import MapComponent from '../components/MapComponent';
import { FaExchangeAlt, FaRocket, FaLock, FaGlobe, FaBolt, FaUsers } from 'react-icons/fa';

export default function Home() {
  const [mapCenter, setMapCenter] = useState([20.5, 78.9]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);
  const [marker, setMarker] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState({ lat: '', lon: '' });
  const [activeTab, setActiveTab] = useState('convert');

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

  const features = [
    {
      icon: FaRocket,
      title: 'Lightning Fast',
      description: 'Convert coordinates to DigiPins in milliseconds with our optimized algorithm'
    },
    {
      icon: FaLock,
      title: 'Secure & Private',
      description: 'Your location data is processed securely without storing personal information'
    },
    {
      icon: FaGlobe,
      title: 'Global Coverage',
      description: 'Works worldwide with precise accuracy for any geographical location'
    },
    {
      icon: FaBolt,
      title: 'Batch Processing',
      description: 'Process thousands of coordinates at once with our powerful batch system'
    },
    {
      icon: FaUsers,
      title: 'Developer Friendly',
      description: 'Simple REST API with comprehensive documentation and examples'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'convert':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl border border-gray-200">
              <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                  Transform Coordinates into Memorable Codes
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Convert any location into a unique 10-character DigiPin code. Perfect for sharing precise locations, 
                  navigation, and location-based applications.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {features.slice(0, 3).map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <Icon className="text-blue-600 text-sm" />
                        <span className="text-sm font-medium text-gray-700">{feature.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Converters */}
              <div className="space-y-6">
                <CoordinateToDigiPin 
                  onDigiPinGenerated={handleCoordinateGenerated}
                  selectedCoords={selectedCoords}
                  onClearSelection={() => setSelectedCoords({ lat: '', lon: '' })}
                />
                
                <div className="flex items-center justify-center py-6">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
                    <div className="bg-white rounded-full p-4 shadow-lg border border-gray-200">
                      <FaExchangeAlt className="text-xl text-blue-600" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
                  </div>
                </div>
                
                <DigiPinToCoordinate 
                  onCoordinatesFound={handleDigiPinDecoded}
                />
              </div>

              {/* Right Column - Map */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
                    <p className="text-sm text-gray-600">Click anywhere on the map to select coordinates for conversion</p>
                    {marker && marker.address && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-700 mb-1">Selected Location:</p>
                        <p className="text-sm text-gray-600 mb-2">{marker.address}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>DigiPin: <span className="font-mono font-medium">{marker.digiPin}</span></span>
                          <span>Coords: {marker.lat.toFixed(6)}, {marker.lon.toFixed(6)}</span>
                        </div>
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

            {/* Features Section */}
            <div className="py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DigiPin?</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Built for developers, designed for everyone. Experience the future of location sharing.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 card-hover">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="text-white text-lg" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'batch':
        return <BatchProcessor />;

      case 'analytics':
        return <Analytics />;

      case 'docs':
        return <ApiDocs />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}