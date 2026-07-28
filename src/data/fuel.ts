import type { FuelLog } from '@/types';

const stations = [
  'Shell Fleet', 'BP Fleet Services', 'ExxonMobil Fleet', 'Chevron Truck Stop',
  "Love's Travel Stop", 'Pilot Flying J', 'TA Travel Center', 'Petro Stopping Center',
  'Speedco', 'Road Ranger', 'Maverik Fleet', 'Kum & Go Fleet',
  'Casey\'s Fleet Fuel', 'QuikTrip Fleet', 'Circle K Fleet', 'Murphy USA',
  'RaceTrac Fleet', 'Sheetz Fleet', 'Wawa Fleet', 'Rutter\'s Fleet',
];

const locations = [
  'I-10 Eastbound Mile 142, TX', 'I-40 Westbound Mile 67, NM', 'I-75 Southbound Mile 203, GA',
  'I-5 Northbound Mile 89, CA', 'I-80 Eastbound Mile 312, NE', 'I-95 Southbound Mile 178, FL',
  'I-35 Northbound Mile 56, OK', 'I-70 Westbound Mile 234, CO', 'I-65 Southbound Mile 91, IN',
  'I-55 Northbound Mile 167, IL', 'I-20 Eastbound Mile 45, LA', 'I-94 Westbound Mile 278, MI',
  'I-81 Southbound Mile 134, VA', 'I-84 Eastbound Mile 72, PA', 'I-90 Westbound Mile 198, NY',
  'I-25 Northbound Mile 113, WY', 'I-29 Southbound Mile 88, MO', 'I-59 Northbound Mile 43, AL',
  'I-77 Southbound Mile 156, OH', 'I-16 Eastbound Mile 29, GA',
];

const fuelTypes = ['diesel', 'diesel', 'diesel', 'diesel', 'gasoline', 'gasoline', 'electric'];

function simpleHash(n: number): number {
  let h = 311 + n * 7919;
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

export const fuelLogs: FuelLog[] = [];

const vehicleIds = Array.from({ length: 50 }, (_, i) => `VH-${String(i + 1).padStart(3, '0')}`);
const driverIds = Array.from({ length: 80 }, (_, i) => `DR-${String(i + 1).padStart(3, '0')}`);

// Track cumulative mileage per vehicle for realistic MPG / trip miles
const vehicleMileage: Record<string, number> = {};
for (const vid of vehicleIds) {
  vehicleMileage[vid] = 5000 + (simpleHash(vid.charCodeAt(3) * 100) % 200000);
}

for (let i = 0; i < 600; i++) {
  const id = `FL-${String(i + 1).padStart(3, '0')}`;
  const vehicleId = pick(vehicleIds, i * 3);

  // Pick driver — ~80% chance of having a driver
  let driverId: string | undefined;
  if (simpleHash(i * 7) % 5 < 4) {
    driverId = pick(driverIds, i * 11);
  }

  const station = pick(stations, i * 13);
  const location = pick(locations, i * 17);
  const fuelType = pick(fuelTypes, i * 19);

  const gallons = parseFloat((15 + (simpleHash(i * 23) % 46) + (simpleHash(i * 29) % 100) / 100).toFixed(2));
  const pricePerGallon = parseFloat((3.80 + (simpleHash(i * 31) % 270) / 100).toFixed(2));
  const totalCost = parseFloat((gallons * pricePerGallon).toFixed(2));

  // Trip miles: 100–650, but let the vehicle "travel" cumulatively
  const tripMiles = randBetween(100, 650, i * 37);
  vehicleMileage[vehicleId] += tripMiles;

  const mpg = parseFloat((tripMiles / gallons).toFixed(1));

  // Spread dates across 2023–2026
  const baseDate = new Date(2023, 0, 1).getTime() + randBetween(0, 1100, i * 41) * 86400000;
  const date = new Date(baseDate).toISOString();
  const createdAt = new Date(baseDate - randBetween(0, 3, i * 43) * 86400000).toISOString();

  fuelLogs.push({
    id,
    vehicleId,
    driverId,
    station: `${station} — ${location}`,
    gallons,
    pricePerGallon,
    totalCost,
    tripMiles,
    mpg,
    fuelType,
    date,
    createdAt,
  });
}
