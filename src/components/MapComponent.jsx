'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the entire map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

const MapComponent = ({ center, zoom, marker, onMapClick }) => {
  return (
    <div className="w-full h-full relative">
      <DynamicMap 
        center={center}
        zoom={zoom}
        marker={marker}
        onMapClick={onMapClick}
      />
    </div>
  );
};

export default MapComponent;
