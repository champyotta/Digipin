'use client';
import { useState, useEffect } from 'react';

export default function DigiPinPage() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [pin, setPin] = useState('');
  const [decoded, setDecoded] = useState(null);

  const handleEncode = async (latitude, longitude) => {
    if (latitude && longitude) {
      try {
        const res = await fetch(`/api/encode-digipin?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setPin(data.digiPin || data.error);
      } catch (error) {
        setPin('Error encoding');
      }
    } else {
      setPin('');
    }
  };

  const handleDecode = async (digiPin) => {
    if (digiPin) {
      try {
        const res = await fetch(`/api/decode-digipin?digipin=${digiPin}`);
        const data = await res.json();
        setDecoded(data.latitude ? data : { error: data.error });
      } catch (error) {
        setDecoded({ error: 'Error decoding' });
      }
    } else {
      setDecoded(null);
    }
  };

  useEffect(() => {
    handleEncode(lat, lon);
  }, [lat, lon]);

  useEffect(() => {
    handleDecode(pin);
  }, [pin]);

  return (
    <div style={{ padding: 20 }}>
      <h1>DIGIPIN Tool</h1>
      
      <div style={{ marginBottom: 20 }}>
        <h3>Encode Coordinates to DIGIPIN</h3>
        <input 
          value={lat} 
          onChange={(e) => setLat(e.target.value)} 
          placeholder="Latitude" 
          style={{ marginRight: 10, padding: 5 }}
        />
        <input 
          value={lon} 
          onChange={(e) => setLon(e.target.value)} 
          placeholder="Longitude" 
          style={{ padding: 5 }}
        />
        <p><strong>DIGIPIN:</strong> {pin}</p>
      </div>

      <div>
        <h3>Decode DIGIPIN to Coordinates</h3>
        <input 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
          placeholder="Enter DIGIPIN" 
          style={{ padding: 5, marginBottom: 10 }}
        />
        {decoded && (
          <p>
            <strong>Coordinates:</strong>{' '}
            {decoded.error
              ? `Error: ${decoded.error}`
              : `Lat: ${decoded.latitude}, Lon: ${decoded.longitude}`}
          </p>
        )}
      </div>
    </div>
  );
}
