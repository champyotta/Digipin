const DIGIPIN_GRID = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T']
];

const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5
};

function getLatLngFromDigiPin(digiPin) {
  const pin = digiPin.replace(/-/g, '');
  if (pin.length !== 10) throw new Error('Invalid DIGIPIN');

  let minLat = BOUNDS.minLat;
  let maxLat = BOUNDS.maxLat;
  let minLon = BOUNDS.minLon;
  let maxLon = BOUNDS.maxLon;

  for (let i = 0; i < 10; i++) {
    const char = pin[i];
    let found = false;
    let ri = -1, ci = -1;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (DIGIPIN_GRID[r][c] === char) {
          ri = r;
          ci = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) throw new Error(`Invalid character in DIGIPIN: ${char}`);

    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    const lat1 = maxLat - latDiv * (ri + 1);
    const lat2 = maxLat - latDiv * ri;
    const lon1 = minLon + lonDiv * ci;
    const lon2 = minLon + lonDiv * (ci + 1);

    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  return {
    latitude: +((minLat + maxLat) / 2).toFixed(6),
    longitude: +((minLon + maxLon) / 2).toFixed(6)
  };
}

// Test the problematic DigiPin
const testPin = '39M-6MM-3L8L';
console.log('Testing DigiPin:', testPin);

try {
  const result = getLatLngFromDigiPin(testPin);
  console.log('Success:', result);
} catch (error) {
  console.log('Error:', error.message);
}
