import type { Vehicle } from '@/types';

const makes = [
  { make: 'Ford', models: ['F-150', 'F-250', 'F-350', 'Transit 350'] },
  { make: 'Freightliner', models: ['Cascadia 126', 'Cascadia 116', 'M2 106', 'M2 112'] },
  { make: 'Kenworth', models: ['T680', 'T880', 'W900', 'T470'] },
  { make: 'Peterbilt', models: ['579', '567', '389', '520'] },
  { make: 'Volvo', models: ['VNL 760', 'VNL 860', 'VNR 400', 'VNX 300'] },
  { make: 'Mack', models: ['Anthem', 'Pinnacle', 'Granite', 'LR'] },
  { make: 'International', models: ['LT', 'RH', 'MV', 'HV'] },
  { make: 'Chevrolet', models: ['Silverado 2500', 'Silverado 3500', 'Express 3500', 'Colorado'] },
  { make: 'RAM', models: ['3500', '4500', '5500', 'ProMaster 3500'] },
  { make: 'GMC', models: ['Sierra 2500', 'Sierra 3500', 'Savana 3500', 'Canyon'] },
];

const statuses: Vehicle['status'][] = [
  'active', 'active', 'active', 'active', 'active', 'active',
  'in_maintenance', 'in_maintenance',
  'inactive', 'inactive',
  'out_of_service',
];
const fuelTypes: Vehicle['fuelType'][] = [
  'diesel', 'diesel', 'diesel', 'diesel', 'diesel', 'diesel',
  'gasoline', 'gasoline',
  'electric', 'hybrid', 'cng',
];
const departments = ['Transport', 'Mining', 'Construction', 'Logistics', 'Delivery', 'Municipal'];
const locations = [
  'Houston, TX', 'Dallas, TX', 'Phoenix, AZ', 'Denver, CO', 'Chicago, IL',
  'Atlanta, GA', 'Miami, FL', 'Seattle, WA', 'Portland, OR', 'Salt Lake City, UT',
  'Los Angeles, CA', 'San Diego, CA', 'Las Vegas, NV', 'Albuquerque, NM', 'Oklahoma City, OK',
  'Kansas City, MO', 'St. Louis, MO', 'Nashville, TN', 'Charlotte, NC', 'Columbus, OH',
];

const prefixLetters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
const vinChars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';

function simpleHash(n: number): number {
  const seed = 42;
  let h = seed + n * 7919;
  h = ((h << 13) ^ h) & 0x7fffffff;
  h = ((h * 16807 + 0) >>> 0) % 2147483647;
  h = ((h * 48271 + 0) >>> 0) % 2147483647;
  return h;
}

function pick<T>(arr: T[], idx: number): T {
  const h = simpleHash(idx);
  return arr[h % arr.length];
}

function randBetween(min: number, max: number, idx: number): number {
  const h = simpleHash(idx);
  return min + (h % (max - min + 1));
}

function generateVin(idx: number): string {
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += vinChars[(simpleHash(idx * 17 + i * 31)) % vinChars.length];
  }
  return vin;
}

function generatePlate(idx: number): string {
  const prefixes = ['FL', 'FT', 'FW', 'FC', 'FD', 'FM', 'FV', 'FR'];
  const h = simpleHash(idx + 1000);
  const prefix = prefixes[h % prefixes.length];
  const num = 1000 + (simpleHash(idx + 2000) % 9000);
  return `${prefix}-${num}`;
}

export const vehicleDriverAssignments: Record<string, string> = {};

let _loaded = false;
const _vehicles: Vehicle[] = [];

function load(): void {
  if (_loaded) return;
  _loaded = true;

  for (let i = 0; i < 50; i++) {
    const id = `VH-${String(i + 1).padStart(3, '0')}`;
    const makeModel = pick(makes, i);
    const make = makeModel.make;
    const model = pick(makeModel.models, i + 50);
    const year = randBetween(2019, 2025, i);
    const status = pick(statuses, i * 3);
    const fuelType = pick(fuelTypes, i * 7);
    const department = pick(departments, i * 11);
    const mileage = randBetween(5000, 250000, i * 13);
    const healthScore = randBetween(40, 98, i * 17);
    const price = 35000 + (simpleHash(i * 19) % 145001);
    const location = pick(locations, i * 23);

    const baseDate = new Date(2020, 0, 1);
    const createdOffset = randBetween(0, 1800, i * 29);
    const createdAt = new Date(baseDate.getTime() + createdOffset * 86400000).toISOString();
    const updatedOffset = randBetween(1, 600, i * 31);
    const updatedAt = new Date(new Date(createdAt).getTime() + updatedOffset * 86400000).toISOString();

    let assignedDriverId: string | undefined;
    if (status === 'active') {
      const driverIndex = simpleHash(i * 37) % 80;
      assignedDriverId = `DR-${String(driverIndex + 1).padStart(3, '0')}`;
      vehicleDriverAssignments[id] = assignedDriverId;
    }

    _vehicles.push({
      id,
      make,
      model,
      year,
      vin: generateVin(i),
      plateNumber: generatePlate(i),
      status,
      fuelType,
      mileage,
      healthScore,
      price,
      department,
      location,
      assignedDriverId,
      createdAt,
      updatedAt,
    });
  }
}

export function ensureVehiclesLoaded(): void {
  load();
}

export const vehicles: Vehicle[] = new Proxy(_vehicles, {
  get(_, prop) {
    load();
    if (typeof prop === 'string') {
      const num = parseInt(prop, 10);
      if (!isNaN(num)) return _vehicles[num];
    }
    if (prop === Symbol.iterator) return _vehicles[Symbol.iterator].bind(_vehicles);
    const val = (_vehicles as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? (val as Function).bind(_vehicles) : val;
  },
  has(_, prop) {
    load();
    return prop in _vehicles;
  },
}) as unknown as Vehicle[];
