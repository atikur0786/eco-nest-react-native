export interface BinData {
  id: string;
  fillLevel: number;
  lastUpdated: string;
  binType: 'organic';
  location: string;
  nextPickup?: string;
}

export interface PickupRequest {
  id: string;
  binId: string;
  requestDate: string;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  timeSlot: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  ecoPoints: number;
}

export interface NotificationPreference {
  fillLevelAlert: boolean;
  pickupReminders: boolean;
  statusUpdates: boolean;
  tipsAndNews: boolean;
  fillLevelThreshold: number;
}

export interface WasteStats {
  date: string;
  wasteTotalKg: number;
  compostPercentage?: number;
  carbonSaved?: number;
}