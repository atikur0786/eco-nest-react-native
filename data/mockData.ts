import { BinData, PickupRequest, UserProfile, NotificationPreference, WasteStats } from '../types';

export const mockBins: BinData[] = [
  {
    id: 'bin-001',
    fillLevel: 70,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    binType: 'organic',
    location: 'Backyard Garden',
  }
];

export const mockPickups: PickupRequest[] = [
  {
    id: 'pickup-001',
    binId: 'bin-001',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    status: 'confirmed',
    timeSlot: '9:00 AM - 11:00 AM'
  }
];

export const mockUserProfile: UserProfile = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '(555) 123-4567',
  address: '123 Green Street',
  city: 'Eco City',
  zipCode: '12345',
  ecoPoints: 450
};

export const mockNotificationPreferences: NotificationPreference = {
  fillLevelAlert: true,
  pickupReminders: true,
  statusUpdates: true,
  tipsAndNews: false,
  fillLevelThreshold: 80,
};

export const mockWasteStats: WasteStats[] = [
  { date: '2025-01-29', wasteTotalKg: 3.0, compostPercentage: 68, carbonSaved: 1.3 },
  { date: '2025-02-05', wasteTotalKg: 2.7, compostPercentage: 72, carbonSaved: 1.5 },
];

export const mockPlants = [
  {
    id: 'plant-001',
    name: 'Basil',
    image: 'https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg',
    ecoPoints: 100,
    available: true
  },
  {
    id: 'plant-002',
    name: 'Mint',
    image: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg',
    ecoPoints: 150,
    available: false
  },
  {
    id: 'plant-003',
    name: 'Tomato',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    ecoPoints: 200,
    available: false
  }
];