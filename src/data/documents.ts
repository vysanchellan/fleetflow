import type { Document } from '@/types';

const documentConfigs: Array<{
  name: string;
  fileName: string;
  category: Document['category'];
  tags: string[];
  linkVehicle: boolean;
  linkDriver: boolean;
  hasExpiry: boolean;
}> = [
  { name: 'Commercial Auto Insurance Policy', fileName: 'commercial_auto_insurance_2026.pdf', category: 'insurance', tags: ['insurance', 'liability', 'commercial'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Comprehensive Coverage Certificate', fileName: 'comprehensive_coverage.pdf', category: 'insurance', tags: ['insurance', 'comprehensive'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Fleet Liability Insurance', fileName: 'fleet_liability_2026.pdf', category: 'insurance', tags: ['insurance', 'liability', 'fleet'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Cargo Insurance Policy', fileName: 'cargo_insurance_policy.pdf', category: 'insurance', tags: ['insurance', 'cargo'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Vehicle Registration Certificate', fileName: 'vehicle_registration_2026.pdf', category: 'registration', tags: ['registration', 'dmv', 'legal'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Registration Renewal Receipt', fileName: 'registration_renewal_receipt.pdf', category: 'registration', tags: ['registration', 'receipt'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Title Transfer Document', fileName: 'title_transfer_document.pdf', category: 'registration', tags: ['registration', 'title', 'legal'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'DOT Inspection Report', fileName: 'dot_inspection_report.pdf', category: 'inspection', tags: ['inspection', 'dot', 'compliance'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Pre-Trip Inspection Checklist', fileName: 'pretrip_checklist_2026.pdf', category: 'inspection', tags: ['inspection', 'pretrip', 'checklist'], linkVehicle: true, linkDriver: true, hasExpiry: false },
  { name: 'Post-Trip Inspection Report', fileName: 'posttrip_inspection_report.pdf', category: 'inspection', tags: ['inspection', 'posttrip', 'safety'], linkVehicle: true, linkDriver: true, hasExpiry: false },
  { name: 'Annual Safety Inspection', fileName: 'annual_safety_inspection.pdf', category: 'inspection', tags: ['inspection', 'annual', 'safety'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Brake Inspection Certificate', fileName: 'brake_inspection_certificate.pdf', category: 'inspection', tags: ['inspection', 'brakes', 'certificate'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Oil Change Service Record', fileName: 'oil_change_service_record.pdf', category: 'maintenance', tags: ['maintenance', 'oil', 'service'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Transmission Service Report', fileName: 'transmission_service_report.pdf', category: 'maintenance', tags: ['maintenance', 'transmission', 'repair'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Tire Replacement Invoice', fileName: 'tire_replacement_invoice.pdf', category: 'maintenance', tags: ['maintenance', 'tires', 'invoice'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Engine Repair Summary', fileName: 'engine_repair_summary.pdf', category: 'maintenance', tags: ['maintenance', 'engine', 'repair'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Brake Job Work Order', fileName: 'brake_job_work_order.pdf', category: 'maintenance', tags: ['maintenance', 'brakes', 'work-order'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Warranty Claim Form', fileName: 'warranty_claim_form.pdf', category: 'maintenance', tags: ['maintenance', 'warranty', 'claim'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Driver License Copy', fileName: 'drivers_license_copy.pdf', category: 'driver', tags: ['driver', 'license', 'identification'], linkVehicle: false, linkDriver: true, hasExpiry: true },
  { name: 'Medical Certificate', fileName: 'medical_certificate.pdf', category: 'driver', tags: ['driver', 'medical', 'certificate'], linkVehicle: false, linkDriver: true, hasExpiry: true },
  { name: 'Driver Qualification File', fileName: 'driver_qualification_file.pdf', category: 'driver', tags: ['driver', 'qualification', 'compliance'], linkVehicle: false, linkDriver: true, hasExpiry: false },
  { name: 'Hazmat Endorsement', fileName: 'hazmat_endorsement.pdf', category: 'driver', tags: ['driver', 'hazmat', 'endorsement', 'certification'], linkVehicle: false, linkDriver: true, hasExpiry: true },
  { name: 'Driver Training Certificate', fileName: 'driver_training_certificate.pdf', category: 'driver', tags: ['driver', 'training', 'certificate'], linkVehicle: false, linkDriver: true, hasExpiry: false },
  { name: 'Accident Report Form', fileName: 'accident_report_form.pdf', category: 'other', tags: ['incident', 'accident', 'report'], linkVehicle: true, linkDriver: true, hasExpiry: false },
  { name: 'Fuel Tax Report', fileName: 'fuel_tax_report_q1_2026.pdf', category: 'other', tags: ['fuel', 'tax', 'report'], linkVehicle: false, linkDriver: false, hasExpiry: false },
  { name: 'Fleet Utilization Report', fileName: 'fleet_utilization_2026.pdf', category: 'other', tags: ['fleet', 'utilization', 'report', 'analytics'], linkVehicle: false, linkDriver: false, hasExpiry: false },
  { name: 'Vehicle Photo - Front View', fileName: 'vehicle_front_view.jpg', category: 'other', tags: ['photo', 'vehicle', 'inspection'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Vehicle Photo - Rear View', fileName: 'vehicle_rear_view.jpg', category: 'other', tags: ['photo', 'vehicle', 'inspection'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Vehicle Photo - VIN Plate', fileName: 'vin_plate_photo.jpg', category: 'other', tags: ['photo', 'vin', 'verification'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Damage Assessment Photos', fileName: 'damage_assessment_photos.png', category: 'other', tags: ['photo', 'damage', 'assessment'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Driver Photo ID', fileName: 'driver_photo_id.jpg', category: 'driver', tags: ['photo', 'driver', 'identification'], linkVehicle: false, linkDriver: true, hasExpiry: false },
  { name: 'Vehicle Lease Agreement', fileName: 'lease_agreement_signed.pdf', category: 'registration', tags: ['lease', 'agreement', 'legal', 'signed'], linkVehicle: true, linkDriver: false, hasExpiry: true },
  { name: 'Purchase Invoice', fileName: 'purchase_invoice.pdf', category: 'registration', tags: ['purchase', 'invoice', 'financial'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'DPF Replacement Receipt', fileName: 'dpf_replacement_receipt.pdf', category: 'maintenance', tags: ['maintenance', 'dpf', 'receipt', 'emissions'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Tire DOT Documentation', fileName: 'tire_dot_documentation.pdf', category: 'maintenance', tags: ['maintenance', 'tires', 'dot', 'compliance'], linkVehicle: true, linkDriver: false, hasExpiry: false },
  { name: 'Hours of Service Log', fileName: 'hours_of_service_log_2026.pdf', category: 'driver', tags: ['driver', 'hos', 'log', 'compliance'], linkVehicle: false, linkDriver: true, hasExpiry: false },
  { name: 'ELD Compliance Certificate', fileName: 'eld_compliance_certificate.pdf', category: 'driver', tags: ['driver', 'eld', 'compliance', 'certificate'], linkVehicle: false, linkDriver: true, hasExpiry: false },
  { name: 'Roadside Inspection CVSA', fileName: 'cvsa_inspection_report.pdf', category: 'inspection', tags: ['inspection', 'cvsa', 'roadside', 'dot'], linkVehicle: true, linkDriver: true, hasExpiry: false },
  { name: 'IFTA Fuel Tax Report', fileName: 'ifta_fuel_tax_q2.pdf', category: 'other', tags: ['fuel', 'tax', 'ifta', 'report'], linkVehicle: false, linkDriver: false, hasExpiry: false },
];

const fileTypes: Document['fileType'][] = ['pdf', 'pdf', 'pdf', 'pdf', 'pdf', 'jpg', 'png', 'docx'];

function simpleHash(n: number): number {
  let h = 823 + n * 7919;
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

let _loaded = false;
const _documents: Document[] = [];

function load(): void {
  if (_loaded) return;
  _loaded = true;

  const vehicleIds = Array.from({ length: 50 }, (_, i) => `VH-${String(i + 1).padStart(3, '0')}`);
  const driverIds = Array.from({ length: 80 }, (_, i) => `DR-${String(i + 1).padStart(3, '0')}`);

  for (let i = 0; i < 100; i++) {
    const id = `DC-${String(i + 1).padStart(3, '0')}`;
    const config = documentConfigs[i % documentConfigs.length];

    let fileType: Document['fileType'];
    if (config.fileName.endsWith('.pdf')) {
      fileType = simpleHash(i * 7) % 100 < 85 ? 'pdf' : pick(fileTypes, i * 11);
    } else if (config.fileName.endsWith('.jpg')) {
      fileType = simpleHash(i * 13) % 100 < 80 ? 'jpg' : pick(['jpg', 'png'] as Document['fileType'][], i * 17);
    } else {
      fileType = pick(fileTypes, i * 19);
    }

    const fileSize = randBetween(50000, 5000000, i * 23);

    let vehicleId: string | undefined;
    let driverId: string | undefined;
    if (config.linkVehicle) vehicleId = pick(vehicleIds, i * 29);
    if (config.linkDriver) driverId = pick(driverIds, i * 31);

    const uploadDate = new Date(2023, 0, 1).getTime() + randBetween(0, 1000, i * 37) * 86400000;
    const uploadedAt = new Date(uploadDate).toISOString();

    let expiresAt: string | undefined;
    if (config.hasExpiry) {
      const expDate = uploadDate + randBetween(180, 730, i * 41) * 86400000;
      expiresAt = new Date(expDate).toISOString();
    }

    const suffix = i >= documentConfigs.length ? `_${Math.floor(i / documentConfigs.length) + 1}` : '';
    const fileNameParts = config.fileName.split('.');
    const baseName = fileNameParts[0];
    const ext = fileType === 'pdf' ? 'pdf' : fileType;
    const fileName = `${baseName}${suffix}.${ext}`;

    _documents.push({
      id,
      name: config.name,
      fileName,
      fileType,
      category: config.category,
      fileSize,
      tags: config.tags,
      vehicleId,
      driverId,
      uploadedAt,
      expiresAt,
    });
  }
}

export const documents: Document[] = new Proxy(_documents, {
  get(_, prop) {
    load();
    if (typeof prop === 'string') {
      const num = parseInt(prop, 10);
      if (!isNaN(num)) return _documents[num];
    }
    if (prop === Symbol.iterator) return _documents[Symbol.iterator].bind(_documents);
    const val = (_documents as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? (val as Function).bind(_documents) : val;
  },
  has(_, prop) {
    load();
    return prop in _documents;
  },
}) as unknown as Document[];
