import { NextResponse } from 'next/server';
import { getDigiPin } from '@/lib/digipin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
  }

  try {
    const digiPin = getDigiPin(lat, lon);
    return NextResponse.json({ digiPin });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
