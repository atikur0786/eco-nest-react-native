import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mockNotificationPreferences } from '@/data/mockData';
import NotificationSettingsScreen from '@/components/NotificationSettingsScreen';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const handleSaveSettings = (updatedPreferences: typeof mockNotificationPreferences) => {
    console.log('Notification preferences updated:', updatedPreferences);
    // In a real app, this would save to backend/local storage
  };

  return (
    <View style={styles.container}>
      <NotificationSettingsScreen 
        preferences={mockNotificationPreferences}
        onSave={handleSaveSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
});