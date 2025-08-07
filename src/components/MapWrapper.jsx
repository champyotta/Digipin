'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Custom hook to handle map events
function MapEventHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

// Component to handle map updates
function MapUpdater({ center, zoom }) {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

const MapWrapper = ({ center, zoom, marker, onMapClick }) => {
  const mapRef = useRef();

  // Create custom icon for DigiPin markers
  const createCustomIcon = (type) => {
    if (typeof window === 'undefined') return null;
    
    const color = type === 'digipin' ? '#3B82F6' : '#10B981'; // Blue for digipin, green for coordinates
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 25px;
          height: 25px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [25, 25],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler onMapClick={onMapClick} />
        <MapUpdater center={center} zoom={zoom} />
        
        {marker && (
          <Marker
            position={[marker.lat, marker.lon]}
            icon={createCustomIcon(marker.type)}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-2">
                  {marker.type === 'digipin' ? 'Generated DigiPin' : 'Decoded Coordinates'}
                </div>
                <div className="space-y-1">
                  <div><strong>DigiPin:</strong> {marker.digiPin}</div>
                  <div><strong>Latitude:</strong> {marker.lat}</div>
                  <div><strong>Longitude:</strong> {marker.lon}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-2 rounded shadow-md text-xs z-[1000]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">DigiPin Generated</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Coordinates Found</span>
          </div>
        </div>
      </div>
      
      {/* Click instruction */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded shadow-md text-xs z-[1000]">
        <span className="text-gray-700">💡 Click on the map to select coordinates</span>
      </div>
    </div>
  );
};

export default MapWrapper;
