import type { Notification } from '@/types';

const notificationTemplates: Array<{
  type: Notification['type'];
  title: string;
  messageTemplate: string;
  needsVehicle: boolean;
  needsDriver: boolean;
}> = [
  { type: 'maintenance', title: 'Service Due', messageTemplate: 'Scheduled maintenance is due for {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Repair Complete', messageTemplate: 'Repair has been completed for {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Parts Order Received', messageTemplate: 'Parts order for {vehicle} has arrived at the workshop', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Maintenance Overdue', messageTemplate: 'Maintenance is overdue for {vehicle} — driver {driver} notified', needsVehicle: true, needsDriver: true },
  { type: 'maintenance', title: 'Critical Repair Needed', messageTemplate: '{vehicle} requires immediate critical repair', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Tire Pressure Alert', messageTemplate: 'Low tire pressure detected on {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Engine Warning', messageTemplate: 'Check engine light reported for {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Brake Wear Warning', messageTemplate: 'Brake pads below minimum thickness on {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Warranty Expiration', messageTemplate: '{vehicle} warranty is expiring soon', needsVehicle: true, needsDriver: false },
  { type: 'maintenance', title: 'Battery Low', messageTemplate: 'Battery charge level critical for {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'inspection', title: 'Inspection Scheduled', messageTemplate: '{vehicle} scheduled for inspection on {date}', needsVehicle: true, needsDriver: true },
  { type: 'inspection', title: 'Inspection Failed', messageTemplate: '{vehicle} failed inspection — action required', needsVehicle: true, needsDriver: true },
  { type: 'inspection', title: 'Inspection Passed', messageTemplate: '{vehicle} passed all inspection checks', needsVehicle: true, needsDriver: false },
  { type: 'inspection', title: 'Random Inspection Alert', messageTemplate: '{vehicle} selected for random inspection', needsVehicle: true, needsDriver: false },
  { type: 'inspection', title: 'DOT Audit Notice', messageTemplate: 'DOT audit submission required for {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'license', title: 'License Expiring Soon', messageTemplate: '{driver} license expires within 30 days', needsVehicle: false, needsDriver: true },
  { type: 'license', title: 'License Renewed', messageTemplate: '{driver} license successfully renewed', needsVehicle: false, needsDriver: true },
  { type: 'license', title: 'License Suspended', messageTemplate: '{driver} license suspended pending review', needsVehicle: false, needsDriver: true },
  { type: 'insurance', title: 'Insurance Renewal', messageTemplate: '{vehicle} insurance policy up for renewal', needsVehicle: true, needsDriver: false },
  { type: 'insurance', title: 'Policy Updated', messageTemplate: '{vehicle} insurance policy has been updated', needsVehicle: true, needsDriver: false },
  { type: 'insurance', title: 'Insurance Claim Filed', messageTemplate: 'Claim filed for {vehicle} — driver {driver}', needsVehicle: true, needsDriver: true },
  { type: 'insurance', title: 'Registration Expiry', messageTemplate: '{vehicle} registration expiring soon', needsVehicle: true, needsDriver: false },
  { type: 'fuel', title: 'Fuel Efficiency Alert', messageTemplate: '{vehicle} fuel efficiency dropped below threshold', needsVehicle: true, needsDriver: true },
  { type: 'fuel', title: 'Fuel Card Alert', messageTemplate: 'Unusual fuel card activity for {driver} on {vehicle}', needsVehicle: true, needsDriver: true },
  { type: 'fuel', title: 'Low Fuel Range', messageTemplate: '{vehicle} approaching minimum fuel range', needsVehicle: true, needsDriver: false },
  { type: 'fuel', title: 'Idling Alert', messageTemplate: 'Excessive idling detected on {vehicle}', needsVehicle: true, needsDriver: false },
  { type: 'general', title: 'Fleet Policy Update', messageTemplate: 'New fleet policy update effective immediately', needsVehicle: false, needsDriver: false },
  { type: 'general', title: 'Driver Training Reminder', messageTemplate: 'Quarterly safety training due for {driver}', needsVehicle: false, needsDriver: true },
  { type: 'general', title: 'System Maintenance', messageTemplate: 'FleetFlow maintenance scheduled for this weekend', needsVehicle: false, needsDriver: false },
  { type: 'general', title: 'Compliance Reminder', messageTemplate: 'Annual compliance review approaching for {driver}', needsVehicle: false, needsDriver: true },
  { type: 'general', title: 'Holiday Schedule', messageTemplate: 'Updated holiday schedule published', needsVehicle: false, needsDriver: false },
  { type: 'general', title: 'Driver Logs Due', messageTemplate: 'Log submission pending for {driver}', needsVehicle: false, needsDriver: true },
  { type: 'general', title: 'Route Deviation', messageTemplate: 'Unexpected route deviation for {vehicle}', needsVehicle: true, needsDriver: true },
  { type: 'general', title: 'Speed Warning', messageTemplate: 'Speed limit exceeded by {vehicle}', needsVehicle: true, needsDriver: true },
  { type: 'general', title: 'Geofence Breach', messageTemplate: '{vehicle} exited designated geofence area', needsVehicle: true, needsDriver: false },
];

function simpleHash(n: number): number {
  let h = 677 + n * 7919;
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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let _loaded = false;
const _notifications: Notification[] = [];

function load(): void {
  if (_loaded) return;
  _loaded = true;

  const vehicleIds = Array.from({ length: 50 }, (_, i) => `VH-${String(i + 1).padStart(3, '0')}`);
  const driverIds = Array.from({ length: 80 }, (_, i) => `DR-${String(i + 1).padStart(3, '0')}`);

  for (let i = 0; i < 200; i++) {
    const id = `NT-${String(i + 1).padStart(3, '0')}`;
    const template = pick(notificationTemplates, i * 7);

    const baseDate = new Date(2024, 0, 1).getTime() + randBetween(0, 550, i * 3) * 86400000;
    const createdAt = new Date(baseDate + randBetween(0, 12, i * 5) * 3600000).toISOString();

    const read = simpleHash(i * 7) % 100 >= 40;
    const priority = pick(['low', 'low', 'medium', 'medium', 'high', 'critical'] as Notification['priority'][], i * 11);

    let vehicleId: string | undefined;
    let driverId: string | undefined;

    if (template.needsVehicle) vehicleId = pick(vehicleIds, i * 17);
    if (template.needsDriver) driverId = pick(driverIds, i * 19);

    const randomDate = `${months[randBetween(0, 11, i * 23)]} ${randBetween(1, 28, i * 29)}`;
    let message = template.messageTemplate
      .replace('{vehicle}', vehicleId || '')
      .replace('{driver}', driverId || '')
      .replace('{date}', randomDate)
      .replace(/\s+/g, ' ')
      .trim();

    _notifications.push({
      id,
      type: template.type,
      title: template.title,
      message,
      priority,
      read,
      vehicleId,
      driverId,
      createdAt,
    });
  }
}

export const notifications: Notification[] = new Proxy(_notifications, {
  get(_, prop) {
    load();
    if (typeof prop === 'string') {
      const num = parseInt(prop, 10);
      if (!isNaN(num)) return _notifications[num];
    }
    if (prop === Symbol.iterator) return _notifications[Symbol.iterator].bind(_notifications);
    const val = (_notifications as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? (val as Function).bind(_notifications) : val;
  },
  has(_, prop) {
    load();
    return prop in _notifications;
  },
}) as unknown as Notification[];
