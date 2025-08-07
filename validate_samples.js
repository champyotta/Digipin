const DIGIPIN_GRID = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T']
];

const sampleDigiPins = [
  'F98-JC3-27K4',
  'C92-832-7K56',
  'J32-745-6LMP',
  'K45-6LM-PTF9',
  'LMP-TFC-9832'
];

function validateDigiPin(digiPin) {
  const pin = digiPin.replace(/-/g, '');
  console.log(`\nTesting: ${digiPin} -> ${pin}`);
  
  if (pin.length !== 10) {
    console.log(`❌ Invalid length: ${pin.length} (expected 10)`);
    return false;
  }

  const validChars = 'FC98J327K456LMPT';
  for (let i = 0; i < pin.length; i++) {
    const char = pin[i];
    if (!validChars.includes(char)) {
      console.log(`❌ Invalid character '${char}' at position ${i + 1}`);
      return false;
    }
  }
  
  console.log('✅ Valid DigiPin');
  return true;
}

console.log('Validating sample DigiPins:');
sampleDigiPins.forEach(pin => validateDigiPin(pin));
