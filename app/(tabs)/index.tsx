import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { mockBins, mockUserProfile } from '@/data/mockData';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { Leaf } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import CircularProgress from '@/components/CircularProgress';

export default function Dashboard() {
  const bin = mockBins[0];
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(bin.fillLevel / 100, { duration: 1500 });
  }, [bin.fillLevel]);

  console.log('Progess value', progress.value);

  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: '360deg' }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoNest</Text>

      <View style={styles.progressContainer}>
        {/* <Animated.View style={[styles.progressCircle, progressStyle]}>
          <View style={styles.progressInner}>
            <Text style={styles.progressText}>{bin.fillLevel}%</Text>
            <Text style={styles.progressLabel}>FULL</Text>
          </View>
        </Animated.View> */}
        <CircularProgress />
        <Text style={styles.binLabel}>Composting</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/schedule')}
        >
          <Text style={styles.buttonText}>Request Pickup</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton, styles.rewardsButton]}
          onPress={() => router.push('/shop')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            View My Rewards
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.primary[600],
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressInner: {
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: Colors.neutral[800],
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[500],
  },
  binLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.neutral[700],
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary[500],
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.primary[50],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButtonText: {
    color: Colors.primary[700],
  },
  rewardsButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
