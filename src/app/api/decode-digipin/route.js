import { NextResponse } from 'next/server';
import { getLatLngFromDigiPin } from '@/lib/digipin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const digiPin = searchParams.get('digipin');

  if (!digiPin) {
    return NextResponse.json({ error: 'DigiPin parameter is required' }, { status: 400 });
  }

  try {
    const coords = getLatLngFromDigiPin(digiPin);
    return NextResponse.json(coords);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
