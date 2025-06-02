import {
  BinData,
  PickupRequest,
  UserProfile,
  NotificationPreference,
  WasteStats,
} from '../types';

export const mockBins: BinData[] = [
  {
    id: 'bin-001',
    fillLevel: 70,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    binType: 'organic',
    location: 'Backyard Garden',
  },
];

export const mockPickups: PickupRequest[] = [
  {
    id: 'pickup-001',
    binId: 'bin-001',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    status: 'confirmed',
    timeSlot: '9:00 AM - 11:00 AM',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '(555) 123-4567',
  address: '123 Green Street',
  city: 'Eco City',
  zipCode: '12345',
  ecoPoints: 450,
};

export const mockNotificationPreferences: NotificationPreference = {
  fillLevelAlert: true,
  pickupReminders: true,
  statusUpdates: true,
  tipsAndNews: false,
  fillLevelThreshold: 80,
};

export const mockWasteStats: WasteStats[] = [
  {
    date: '2025-01-29',
    wasteTotalKg: 3.0,
    compostPercentage: 68,
    carbonSaved: 1.3,
  },
  {
    date: '2025-02-05',
    wasteTotalKg: 2.7,
    compostPercentage: 72,
    carbonSaved: 1.5,
  },
];

export const mockPlants = [
  {
    id: 'plant-001',
    name: 'Plants',
    image:
      'https://cdn.shopify.com/s/files/1/0918/8442/1427/files/Best-Cheap-Indoor-Plants-For-Your-Living-Room-or-Office.png?v=1739815904',
    ecoPoints: 100,
    available: true,
  },
  {
    id: 'plant-002',
    name: 'Fertilizers',
    image:
      'https://angkorgreen.com.kh/wp-content/uploads/2022/05/Quality-Product-300x264.jpg',
    ecoPoints: 150,
    available: false,
  },
];
