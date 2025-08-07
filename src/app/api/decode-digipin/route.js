import { NextResponse } from 'next/server';
import { getLatLngFromDigiPin } from '@/lib/digipin';

async function getAddressFromCoordinates(lat, lon) {
  try {
    // Using OpenStreetMap Nominatim for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DigiPin-App'
        }
      }
    );
    
    if (!response.ok) {
      return 'Address not available';
    }
    
    const data = await response.json();
    return data.display_name || 'Address not available';
  } catch (error) {
    return 'Address not available';
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const digiPin = searchParams.get('digipin');

  if (!digiPin) {
    return NextResponse.json({ error: 'DigiPin parameter is required' }, { status: 400 });
  }

  try {
    const coords = getLatLngFromDigiPin(digiPin);
    const address = await getAddressFromCoordinates(coords.latitude, coords.longitude);
    
    return NextResponse.json({
      ...coords,
      // Also provide lat/lon for backward compatibility
      lat: coords.latitude,
      lon: coords.longitude,
      address
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
