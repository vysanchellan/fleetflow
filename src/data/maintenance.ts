import type { MaintenanceRecord } from '@/types';

const serviceTypes = [
  'Oil Change',
  'Tire Replacement',
  'Brake Inspection & Repair',
  'Engine Tune-Up',
  'Transmission Service',
  'Coolant Flush',
  'Air Filter Replacement',
  'Battery Replacement',
  'Alignment & Balancing',
  'AC Service',
  'Exhaust System Repair',
  'Fuel System Cleaning',
  'Suspension Repair',
  'Electrical System Diagnosis',
  'Clutch Replacement',
  'Turbocharger Repair',
  'Differential Service',
  'Hydraulic System Service',
  'Emission System Check',
  'Steering Rack Replacement',
];

const statuses: MaintenanceRecord['status'][] = [
  'completed', 'completed', 'completed', 'completed', 'completed',
  'completed', 'completed',
  'in_progress',
  'pending',
  'cancelled',
];

const priorities: MaintenanceRecord['priority'][] = ['low', 'medium', 'medium', 'high', 'critical'];

const workshops = [
  'FleetCare Center', 'Precision Auto Works', 'TruckTech Solutions', 'MileX Service',
  'ProFleet Garage', 'Apex Diesel Repair', 'Valley Truck Center', 'City Fleet Services',
  'National Fleet Maintenance', 'Premier Truck Repair', 'Alliance Fleet Solutions',
  'Guardian Truck Services', 'Summit Diesel Repair', 'Legacy Fleet Care',
];

const partsInventory = [
  'Oil filter', 'Air filter', 'Fuel filter', 'Cabin filter', 'Brake pads',
  'Brake rotors', 'Brake calipers', 'Brake lines', 'Spark plugs', 'Ignition coils',
  'Battery', 'Alternator', 'Starter', 'Serpentine belt', 'Timing belt',
  'Radiator', 'Coolant hoses', 'Thermostat', 'Water pump', 'Heater core',
  'Shock absorbers', 'Struts', 'Control arms', 'Ball joints', 'Tie rods',
  'Tires (set of 4)', 'Tires (set of 2)', 'Wheel bearings', 'Lug nuts', 'Wheels',
  'Transmission fluid', 'Transmission filter', 'Clutch kit', 'Flywheel', 'Torque converter',
  'Drive shaft', 'CV axles', 'U-joints', 'Differential fluid', 'Differential cover',
  'Engine oil', 'Coolant', 'Power steering fluid', 'Brake fluid', 'Windshield washer fluid',
  'Oxygen sensor', 'Mass air flow sensor', 'Throttle body', 'Fuel injectors', 'Fuel pump',
  'Muffler', 'Catalytic converter', 'Exhaust pipe', 'Exhaust manifold', 'DPF filter',
  'Turbocharger assembly', 'Intercooler', 'Charge pipes', 'Boost sensor', 'EGR valve',
  'Leaf springs', 'Air bags', 'Air compressor', 'Brake chamber', 'Slack adjuster',
  'Headlight assembly', 'Tail light', 'Turn signal', 'Reflectors', 'LED light bar',
];

function simpleHash(n: number): number {
  let h = 199 + n * 7919;
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

function pickParts(idx: number): string[] {
  const count = randBetween(1, 5, idx);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const part = pick(partsInventory, idx * 23 + i * 17);
    if (!parts.includes(part)) parts.push(part);
  }
  return parts;
}

let _loaded = false;
const _records: MaintenanceRecord[] = [];

function load(): void {
  if (_loaded) return;
  _loaded = true;

  const vehicleIds = Array.from({ length: 50 }, (_, i) => `VH-${String(i + 1).padStart(3, '0')}`);
  const driverIds = Array.from({ length: 80 }, (_, i) => `DR-${String(i + 1).padStart(3, '0')}`);

  for (let i = 0; i < 300; i++) {
    const id = `MT-${String(i + 1).padStart(3, '0')}`;
    const vehicleId = vehicleIds[i % 50];
    const serviceType = pick(serviceTypes, i * 3);
    const status = pick(statuses, i * 7);
    const priority = pick(priorities, i * 11);
    const cost = randBetween(50, 5000, i * 13);
    const workshop = pick(workshops, i * 17);
    const partsReplaced = pickParts(i);
    const description = `${serviceType} for ${vehicleId}`;

    const baseDate = new Date(2022, 0, 1).getTime() + randBetween(0, 1100, i * 19) * 86400000;
    const scheduledDate = new Date(baseDate).toISOString();
    let completedDate: string | undefined;
    if (status === 'completed' || status === 'cancelled') {
      const daysAfter = randBetween(1, 14, i * 23);
      completedDate = new Date(baseDate + daysAfter * 86400000).toISOString();
    }

    let driverId: string | undefined;
    if (simpleHash(i * 29) % 10 < 7) {
      driverId = pick(driverIds, i * 31);
    }

    const notes: string | undefined =
      status === 'completed'
        ? `All ${serviceType.toLowerCase()} procedures completed successfully. Vehicle returned to service.`
        : status === 'in_progress'
          ? `Currently performing ${serviceType.toLowerCase()}. ETA ${randBetween(1, 5, i * 37)} days.`
          : status === 'pending'
            ? `Scheduled for ${serviceType.toLowerCase()} at ${workshop}. Awaiting parts.`
            : undefined;

    const createdAt = new Date(baseDate - randBetween(1, 7, i * 41) * 86400000).toISOString();
    const updatedAt = completedDate || scheduledDate;

    _records.push({
      id,
      vehicleId,
      driverId,
      serviceType,
      description,
      status,
      priority,
      cost,
      workshop,
      partsReplaced,
      scheduledDate,
      completedDate,
      notes,
      createdAt,
      updatedAt,
    });
  }
}

export const maintenanceRecords: MaintenanceRecord[] = new Proxy(_records, {
  get(_, prop) {
    load();
    if (typeof prop === 'string') {
      const num = parseInt(prop, 10);
      if (!isNaN(num)) return _records[num];
    }
    if (prop === Symbol.iterator) return _records[Symbol.iterator].bind(_records);
    const val = (_records as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? (val as Function).bind(_records) : val;
  },
  has(_, prop) {
    load();
    return prop in _records;
  },
}) as unknown as MaintenanceRecord[];
