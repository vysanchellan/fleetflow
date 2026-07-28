export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  plateNumber: string;
  status: 'active' | 'in_maintenance' | 'inactive' | 'out_of_service';
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid' | 'cng';
  mileage: number;
  healthScore: number;
  price: number;
  department: string;
  location: string;
  assignedDriverId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'available' | 'on_trip' | 'off_duty' | 'sick' | 'vacation';
  licenseClass: 'A' | 'B' | 'C';
  licenseNumber: string;
  drivingScore: number;
  totalTrips: number;
  safetyIncidents: number;
  department: string;
  assignedVehicleId?: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  driverId?: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  cost: number;
  workshop: string;
  partsReplaced: string[];
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId?: string;
  station: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  tripMiles: number;
  mpg: number;
  fuelType: string;
  date: string;
  createdAt: string;
}

export interface InspectionItem {
  name: string;
  status: 'pass' | 'fail' | 'na';
  notes?: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  driverId?: string;
  type: 'pre_trip' | 'post_trip' | 'scheduled' | 'random';
  result: 'pass' | 'conditional' | 'fail';
  inspector: string;
  items: InspectionItem[];
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'maintenance' | 'inspection' | 'license' | 'insurance' | 'fuel' | 'general';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  vehicleId?: string;
  driverId?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'docx';
  category: 'insurance' | 'registration' | 'inspection' | 'maintenance' | 'driver' | 'other';
  fileSize: number;
  tags: string[];
  vehicleId?: string;
  driverId?: string;
  uploadedAt: string;
  expiresAt?: string;
}
