import { NextResponse } from 'next/server';
import { getDigiPin } from '@/lib/digipin';

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
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
  }

  try {
    const digiPin = getDigiPin(lat, lon);
    const address = await getAddressFromCoordinates(lat, lon);
    return NextResponse.json({ digiPin, address });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
