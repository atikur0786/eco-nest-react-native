import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { NotificationPreference } from '../types';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import {
  Bell,
  BellOff,
  TriangleAlert as AlertTriangle,
  Truck,
  Activity,
  Lightbulb,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  useAnimatedProps,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NotificationSettingsProps {
  preferences: NotificationPreference;
  onSave: (preferences: NotificationPreference) => void;
}

export default function NotificationSettingsScreen({
  preferences,
  onSave,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationPreference>({
    ...preferences,
  });
  const saveButtonScale = useSharedValue(1);

  const handleToggle = (key: keyof NotificationPreference) => {
    if (typeof settings[key] === 'boolean') {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));

      // Animate save button
      saveButtonScale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  };

  const handleSliderChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      fillLevelThreshold: Math.round(value),
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  // Customer Support Functions
  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to get in touch with us?',
      [
        {
          text: 'Phone Call',
          onPress: () => Linking.openURL('tel:+1234567890'),
        },
        {
          text: 'Email',
          onPress: () =>
            Linking.openURL(
              'mailto:support@wastemanagement.com?subject=Notification Settings Help'
            ),
        },
        {
          text: 'Live Chat',
          onPress: () => {
            // Navigate to chat screen or open chat module
            console.log('Opening live chat...');
            // You can replace this with your actual chat implementation
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleQuickHelp = () => {
    Alert.alert(
      'Quick Help',
      'Here are some common questions about notifications:\n\n• Fill Level Alerts: Get notified when your bin is getting full\n• Pickup Reminders: Notifications about scheduled pickups\n• Status Updates: Important service announcements\n• Tips & News: Helpful waste management tips\n\nStill need help? Contact our support team!',
      [
        {
          text: 'Contact Support',
          onPress: handleContactSupport,
        },
        {
          text: 'Got it',
          style: 'cancel',
        },
      ]
    );
  };

  const saveButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }],
    };
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Notification Settings</Text>
            <Text style={styles.subtitle}>
              Manage how and when you receive alerts
            </Text>
          </View>
          <Pressable style={styles.helpButton} onPress={handleQuickHelp}>
            <HelpCircle size={24} color={Colors.primary[500]} />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: Colors.warning[100] },
              ]}
            >
              <AlertTriangle size={20} color={Colors.warning[500]} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Fill Level Alerts</Text>
              <Text style={styles.settingDescription}>
                Get notified when bin reaches {settings.fillLevelThreshold}%
                capacity
              </Text>
            </View>
          </View>
          <Switch
            value={settings.fillLevelAlert}
            onValueChange={() => handleToggle('fillLevelAlert')}
            trackColor={{
              false: Colors.neutral[300],
              true: Colors.primary[400],
            }}
            thumbColor={Colors.white}
          />
        </View>

        {settings.fillLevelAlert && (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Alert Threshold: {settings.fillLevelThreshold}%
            </Text>
            <View style={styles.sliderTrack}>
              <Animated.View
                style={[
                  styles.sliderFill,
                  { width: `${settings.fillLevelThreshold}%` },
                ]}
              />
              <Pressable
                style={[
                  styles.sliderThumb,
                  { left: `${settings.fillLevelThreshold - 3}%` },
                ]}
                onPressIn={() => {}}
              />
            </View>
            <View style={styles.sliderMarkers}>
              <Pressable
                style={styles.sliderMarker}
                onPress={() => handleSliderChange(50)}
              >
                <Text style={styles.markerText}>50%</Text>
              </Pressable>
              <Pressable
                style={styles.sliderMarker}
                onPress={() => handleSliderChange(70)}
              >
                <Text style={styles.markerText}>70%</Text>
              </Pressable>
              <Pressable
                style={styles.sliderMarker}
                onPress={() => handleSliderChange(90)}
              >
                <Text style={styles.markerText}>90%</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: Colors.secondary[100] },
              ]}
            >
              <Truck size={20} color={Colors.secondary[500]} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Pickup Reminders</Text>
              <Text style={styles.settingDescription}>
                Receive notifications about upcoming and completed pickups
              </Text>
            </View>
          </View>
          <Switch
            value={settings.pickupReminders}
            onValueChange={() => handleToggle('pickupReminders')}
            trackColor={{
              false: Colors.neutral[300],
              true: Colors.primary[400],
            }}
            thumbColor={Colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: Colors.primary[100] },
              ]}
            >
              <Activity size={20} color={Colors.primary[500]} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Status Updates</Text>
              <Text style={styles.settingDescription}>
                Get notifications about bin status changes and service updates
              </Text>
            </View>
          </View>
          <Switch
            value={settings.statusUpdates}
            onValueChange={() => handleToggle('statusUpdates')}
            trackColor={{
              false: Colors.neutral[300],
              true: Colors.primary[400],
            }}
            thumbColor={Colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: Colors.success[100] },
              ]}
            >
              <Lightbulb size={20} color={Colors.success[500]} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Tips & News</Text>
              <Text style={styles.settingDescription}>
                Receive eco-friendly tips and waste reduction news
              </Text>
            </View>
          </View>
          <Switch
            value={settings.tipsAndNews}
            onValueChange={() => handleToggle('tipsAndNews')}
            trackColor={{
              false: Colors.neutral[300],
              true: Colors.primary[400],
            }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      <View style={styles.quietHoursSection}>
        <Text style={styles.sectionTitle}>Quiet Hours</Text>
        <Text style={styles.quietHoursDescription}>
          No notifications will be sent during these hours
        </Text>

        <View style={styles.timeRangeContainer}>
          <View style={styles.timeInput}>
            <Text style={styles.timeLabel}>From</Text>
            <Pressable style={styles.timeSelector}>
              <Text style={styles.timeValue}>10:00 PM</Text>
            </Pressable>
          </View>
          <View style={styles.timeInput}>
            <Text style={styles.timeLabel}>To</Text>
            <Pressable style={styles.timeSelector}>
              <Text style={styles.timeValue}>7:00 AM</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Customer Support Section */}
      <View style={styles.supportSection}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <Text style={styles.supportDescription}>
          Having trouble with notifications? Our support team is here to help!
        </Text>

        <View style={styles.supportButtons}>
          <Pressable
            style={styles.supportButton}
            onPress={handleContactSupport}
          >
            <MessageCircle size={20} color={Colors.primary[500]} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </Pressable>

          <Pressable
            style={styles.supportButtonSecondary}
            onPress={handleQuickHelp}
          >
            <HelpCircle size={20} color={Colors.neutral[600]} />
            <Text style={styles.supportButtonTextSecondary}>Quick Help</Text>
          </Pressable>
        </View>
      </View>

      <AnimatedPressable
        style={[styles.saveButton, saveButtonAnimatedStyle]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </AnimatedPressable>

      <View style={styles.toggleAllContainer}>
        <Pressable
          style={styles.toggleAllButton}
          onPress={() => {
            const allOn = Object.entries(settings)
              .filter(([key, value]) => typeof value === 'boolean')
              .every(([_, value]) => value === true);

            const newValue = !allOn;

            setSettings((prev) => ({
              ...prev,
              fillLevelAlert: newValue,
              pickupReminders: newValue,
              statusUpdates: newValue,
              tipsAndNews: newValue,
            }));
          }}
        >
          {Object.entries(settings)
            .filter(([key, value]) => typeof value === 'boolean')
            .every(([_, value]) => value === true) ? (
            <>
              <BellOff size={18} color={Colors.neutral[500]} />
              <Text style={styles.toggleAllText}>
                Disable All Notifications
              </Text>
            </>
          ) : (
            <>
              <Bell size={18} color={Colors.primary[500]} />
              <Text
                style={[styles.toggleAllText, { color: Colors.primary[500] }]}
              >
                Enable All Notifications
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  contentContainer: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  helpButton: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    marginLeft: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[500],
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  sliderContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary[400],
    borderRadius: 3,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary[500],
    position: 'absolute',
    top: -7,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
  },
  sliderMarker: {
    alignItems: 'center',
  },
  markerText: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  quietHoursSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quietHoursDescription: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginBottom: Spacing.md,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    width: '48%',
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginBottom: Spacing.xs,
  },
  timeSelector: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 16,
    color: Colors.neutral[700],
    fontWeight: '500',
  },
  // Customer Support Styles
  supportSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  supportDescription: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginBottom: Spacing.md,
  },
  supportButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[50],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  supportButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[50],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[600],
    marginLeft: Spacing.xs,
  },
  supportButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginLeft: Spacing.xs,
  },
  saveButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  toggleAllContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  toggleAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  toggleAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[500],
    marginLeft: Spacing.xs,
  },
});
