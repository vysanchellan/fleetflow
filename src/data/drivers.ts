import type { Driver } from '@/types';
import { vehicleDriverAssignments } from './vehicles';

const firstNames = [
  'James', 'Maria', 'Carlos', 'Sarah', 'Ahmed', 'Wei', 'Dmitri', 'Fatima', 'Omar', 'Priya',
  'Miguel', 'Elena', 'Andre', 'Yuki', 'Robert', 'Linda', 'Michael', 'Susan', 'David', 'Karen',
  'Richard', 'Lisa', 'Thomas', 'Nancy', 'Charles', 'Betty', 'Christopher', 'Margaret', 'Daniel', 'Sandra',
  'Matthew', 'Ashley', 'Anthony', 'Dorothy', 'Mark', 'Kimberly', 'Donald', 'Emily', 'Steven', 'Donna',
  'Paul', 'Carol', 'Andrew', 'Michelle', 'Joshua', 'Amanda', 'Kenneth', 'Melissa', 'Kevin', 'Deborah',
  'Brian', 'Stephanie', 'George', 'Rebecca', 'Timothy', 'Sharon', 'Ronald', 'Laura', 'Edward', 'Cynthia',
  'Jason', 'Kathleen', 'Jeffrey', 'Amy', 'Ryan', 'Angela', 'Jacob', 'Shirley', 'Gary', 'Anna',
  'Nicholas', 'Brenda', 'Eric', 'Pamela', 'Jonathan', 'Emma', 'Stephen', 'Nicole', 'Larry', 'Helen',
];

const lastNames = [
  'Smith', 'Garcia', 'Johnson', 'Chen', 'Williams', 'Patel', 'Brown', 'Kim', 'Jones', 'Singh',
  'Miller', 'Martinez', 'Davis', 'Rodriguez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson',
  'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips',
  'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
];

const statuses: Driver['status'][] = [
  'available', 'available', 'available', 'available', 'available',
  'on_trip', 'on_trip',
  'off_duty',
  'sick',
  'vacation',
];
const licenseClasses: Driver['licenseClass'][] = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'C'];
const departments = ['Transport', 'Mining', 'Construction', 'Logistics', 'Delivery', 'Municipal'];
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function simpleHash(n: number): number {
  const seed = 137;
  let h = seed + n * 7919;
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

function generateLicenseNumber(idx: number): string {
  let s = '';
  for (let i = 0; i < 3; i++) s += upper[simpleHash(idx * 100 + i * 7) % 26];
  for (let i = 0; i < 6; i++) s += simpleHash(idx * 200 + i * 11) % 10;
  for (let i = 0; i < 2; i++) s += upper[simpleHash(idx * 300 + i * 13) % 26];
  return s;
}

// Build reverse map: driverId -> vehicleId
const driverVehicleAssignments: Record<string, string> = {};
for (const [vehId, drvId] of Object.entries(vehicleDriverAssignments)) {
  driverVehicleAssignments[drvId] = vehId;
}

export const drivers: Driver[] = [];

for (let i = 0; i < 80; i++) {
  const id = `DR-${String(i + 1).padStart(3, '0')}`;
  const firstName = pick(firstNames, i);
  const lastName = pick(lastNames, i + 50);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${simpleHash(i * 37) % 99 + 1}@fleetflow.com`;
  const phone = `(${200 + (simpleHash(i * 41) % 800)}) ${200 + (simpleHash(i * 43) % 800)}-${1000 + (simpleHash(i * 47) % 9000)}`;
  const status = pick(statuses, i * 5);
  const licenseClass = pick(licenseClasses, i * 7);
  const department = pick(departments, i * 11);
  const drivingScore = randBetween(55, 100, i * 13);
  const totalTrips = randBetween(50, 2000, i * 17);
  const safetyIncidents = randBetween(0, 12, i * 19);

  const hireOffset = randBetween(0, 2500, i * 23);
  const hireDate = new Date(2018, 0, 1).getTime() + hireOffset * 86400000;
  const createdAt = new Date(hireDate).toISOString();
  const updatedAt = new Date(hireDate + randBetween(1, 800, i * 29) * 86400000).toISOString();

  // Assign vehicle if this driver has one assigned via vehicleDriverAssignments
  const assignedVehicleId = driverVehicleAssignments[id] || undefined;

  drivers.push({
    id,
    firstName,
    lastName,
    email,
    phone,
    status,
    licenseClass,
    licenseNumber: generateLicenseNumber(i),
    drivingScore,
    totalTrips,
    safetyIncidents,
    department,
    assignedVehicleId,
    hireDate: createdAt,
    createdAt,
    updatedAt,
  });
}
