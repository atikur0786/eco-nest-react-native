import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { mockPlants, mockUserProfile } from '@/data/mockData';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { Bell } from 'lucide-react-native';

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop Plants</Text>
        <Text style={styles.subtitle}>with EcoPoints</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {mockPlants.map((plant) => (
          <View key={plant.id} style={styles.plantCard}>
            <Image source={{ uri: plant.image }} style={styles.plantImage} />
            <View style={styles.plantInfo}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Pressable
                style={[
                  styles.claimButton,
                  !plant.available && styles.claimButtonDisabled
                ]}
                disabled={!plant.available}
              >
                <Text style={[
                  styles.claimButtonText,
                  !plant.available && styles.claimButtonTextDisabled
                ]}>
                  {plant.available ? 'Add to Cart' : 'Claim with ecoments'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
    marginTop: 4,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  plantCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  plantImage: {
    width: '100%',
    height: 200,
  },
  plantInfo: {
    padding: Spacing.md,
  },
  plantName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  claimButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: Colors.neutral[200],
  },
  claimButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  claimButtonTextDisabled: {
    color: Colors.neutral[500],
  },
});