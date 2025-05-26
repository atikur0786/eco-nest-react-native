import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mockUserProfile } from '@/data/mockData';
import UserProfileForm from '@/components/UserProfileForm';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const handleSaveProfile = (updatedProfile: typeof mockUserProfile) => {
    console.log('Profile updated:', updatedProfile);
    // In a real app, this would save to backend/local storage
  };

  return (
    <View style={styles.container}>
      <UserProfileForm 
        profile={mockUserProfile}
        onSave={handleSaveProfile}
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