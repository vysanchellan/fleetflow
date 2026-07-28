import type { Inspection, InspectionItem } from '@/types';

const inspectionTypes: Inspection['type'][] = [
  'pre_trip', 'pre_trip', 'pre_trip',
  'post_trip', 'post_trip',
  'scheduled',
  'random',
];

const inspectors = [
  'Frank Morrison', 'Diana Reyes', 'Terry Hawkins', 'Gloria Park', 'Leonard Cross',
  'Rita Vasquez', 'Harold Sherman', 'Mona Fischer', 'Reggie Daniels', 'Tina Malone',
  'Darnell Hicks', 'Shelly Byrd', 'Clifton Ray', 'Eunice Sutton', 'Roderick Myers',
  'Sabrina Quinn', 'Moses Horton', 'Cassandra Flynn', 'Gerald Schneider', 'Tracie West',
  'Manual inspection', 'Automated system check', 'Third-party auditor',
  'DOT inspection officer', 'Fleet compliance manager',
];

const itemNames = [
  'Brakes', 'Tires', 'Lights', 'Engine', 'Transmission', 'Suspension',
  'Steering', 'Body', 'Fluids', 'Electrical', 'Horn', 'Wipers',
  'Mirrors', 'Seat belts', 'Fire extinguisher', 'Reflective triangles',
  'Coupling devices', 'Exhaust system', 'Fuel system', 'Cooling system',
];

function simpleHash(n: number): number {
  let h = 521 + n * 7919;
  h = ((h << 13) ^ h) & 0x7fffffff;
  h = ((h * 16807 + 0) >>> 0) % 2147483647;
  h = ((h * 48271 + 0) >>> 0) % 2147483647;
  return h;
}

function pick<T>(arr: T[], idx: number): T {
  return arr[simpleHash(idx) % arr.length];
}

function randBetween(min: number, max: number, idx: number): number {
  return min + (simpleHash(idx) % (max - min + 1));
}

function generateInspectionItems(idx: number, result: Inspection['result']): InspectionItem[] {
  const count = randBetween(5, 8, idx);
  const items: InspectionItem[] = [];
  const usedNames = new Set<string>();

  for (let j = 0; j < count; j++) {
    let name = pick(itemNames, idx * 31 + j * 17);
    while (usedNames.has(name)) {
      name = pick(itemNames, idx * 31 + j * 17 + 100);
    }
    usedNames.add(name);

    let status: InspectionItem['status'] = 'pass';
    if (result === 'fail' && j === 0) {
      status = 'fail';
    } else if (result === 'conditional' && j < 2) {
      status = simpleHash(idx * 37 + j * 23) % 3 === 0 ? 'fail' : 'pass';
    } else if (result === 'fail' && j < 3) {
      status = simpleHash(idx * 41 + j * 29) % 2 === 0 ? 'fail' : 'pass';
    }

    // Sprinkle ~85% pass rate with some failures
    if (status === 'pass' && simpleHash(idx * 43 + j * 31) % 100 < 85) {
      status = 'pass';
    } else if (status === 'pass') {
      status = simpleHash(idx * 47 + j * 37) % 3 === 0 ? 'fail' : 'pass';
    }

    let notes: string | undefined;
    if (status === 'fail') {
      const failNotes = [
        'Worn beyond acceptable limits', 'Cracked housing detected',
        'Fluid leak observed', 'Cord exposure on sidewall',
        'Cracked lens, needs replacement', 'Excessive play in assembly',
        'Corrosion present, requires treatment', 'Bracket loose, tighten to spec',
      ];
      notes = pick(failNotes, idx * 53 + j * 41);
    }

    items.push({ name, status, notes });
  }

  return items;
}

export const inspections: Inspection[] = [];

const vehicleIds = Array.from({ length: 50 }, (_, i) => `VH-${String(i + 1).padStart(3, '0')}`);
const driverIds = Array.from({ length: 80 }, (_, i) => `DR-${String(i + 1).padStart(3, '0')}`);

for (let i = 0; i < 150; i++) {
  const id = `IN-${String(i + 1).padStart(3, '0')}`;
  const vehicleId = pick(vehicleIds, i * 3);
  const type = pick(inspectionTypes, i * 7);

  // Driver assignment: ~75% have a driver
  let driverId: string | undefined;
  if (simpleHash(i * 11) % 4 < 3) {
    driverId = pick(driverIds, i * 13);
  }

  // Result distribution ~70% pass, ~20% conditional, ~10% fail
  const resultRoll = simpleHash(i * 17) % 100;
  let result: Inspection['result'];
  if (resultRoll < 70) result = 'pass';
  else if (resultRoll < 90) result = 'conditional';
  else result = 'fail';

  const inspector = pick(inspectors, i * 19);
  const items = generateInspectionItems(i, result);

  const baseDate = new Date(2023, 0, 1).getTime() + randBetween(0, 1000, i * 23) * 86400000;
  const date = new Date(baseDate).toISOString();
  const createdAt = new Date(baseDate - randBetween(0, 2, i * 29) * 86400000).toISOString();
  const updatedAt = date;

  let notes: string | undefined;
  if (result === 'fail') {
    notes = `Vehicle requires immediate maintenance. ${items.filter(it => it.status === 'fail').length} item(s) failed inspection.`;
  } else if (result === 'conditional') {
    const failed = items.filter(it => it.status === 'fail');
    notes = `Conditional pass. ${failed.length} minor issue(s) found: ${failed.map(f => f.name).join(', ')}. Repair within 7 days.`;
  }

  inspections.push({
    id,
    vehicleId,
    driverId,
    type,
    result,
    inspector,
    items,
    notes,
    date,
    createdAt,
    updatedAt,
  });
}
