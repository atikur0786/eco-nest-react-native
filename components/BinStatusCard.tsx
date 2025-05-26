import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BinData } from '../types';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import { Trash2, Recycle, Leaf } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface BinStatusCardProps {
  bin: BinData;
  onPress?: (bin: BinData) => void;
}

const getBinIcon = (binType: BinData['binType']) => {
  switch (binType) {
    case 'recycling':
      return <Recycle size={24} color={Colors.secondary[500]} />;
    case 'organic':
      return <Leaf size={24} color={Colors.success[500]} />;
    default:
      return <Trash2 size={24} color={Colors.neutral[700]} />;
  }
};

const getFillLevelColor = (fillLevel: number) => {
  if (fillLevel >= 90) return Colors.error[500];
  if (fillLevel >= 70) return Colors.warning[500];
  return Colors.success[500];
};

export default function BinStatusCard({ bin, onPress }: BinStatusCardProps) {
  // Animation for fill level
  const fillAnimation = useSharedValue(0);
  
  // Animate to actual fill level
  React.useEffect(() => {
    fillAnimation.value = withTiming(bin.fillLevel / 100, { duration: 1000 });
  }, [bin.fillLevel]);
  
  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      height: `${fillAnimation.value * 100}%`,
    };
  });

  // Format the last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <Pressable 
      style={styles.container}
      onPress={() => onPress && onPress(bin)}
    >
      <LinearGradient
        colors={[Colors.white, Colors.primary[50]]}
        style={styles.cardGradient}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getBinIcon(bin.binType)}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)} Bin
            </Text>
            <Text style={styles.location}>{bin.location}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.fillLevelContainer}>
            <View style={styles.fillLevelBackground}>
              <Animated.View 
                style={[
                  styles.fillLevelForeground, 
                  animatedFillStyle, 
                  { backgroundColor: getFillLevelColor(bin.fillLevel) }
                ]} 
              />
            </View>
            <Text style={styles.fillLevelText}>{bin.fillLevel}%</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>{formatLastUpdated(bin.lastUpdated)}</Text>
            </View>
            
            {bin.nextPickup && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Next Pickup:</Text>
                <Text style={styles.infoValue}>
                  {new Date(bin.nextPickup).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            <View style={styles.statusIndicator}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getFillLevelColor(bin.fillLevel) }
                ]} 
              />
              <Text style={[styles.statusText, { color: getFillLevelColor(bin.fillLevel) }]}>
                {bin.fillLevel >= 90 
                  ? 'Needs Attention' 
                  : bin.fillLevel >= 70 
                    ? 'Filling Up' 
                    : 'Good Status'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    borderRadius: 16,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillLevelContainer: {
    width: 60,
    height: 100,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  fillLevelBackground: {
    width: 30,
    height: 80,
    backgroundColor: Colors.neutral[200],
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fillLevelForeground: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 15,
  },
  fillLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
  },
  infoContainer: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});