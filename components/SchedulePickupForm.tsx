import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { BinData } from '../types';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import { Calendar, Clock, Send, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  runOnJS 
} from 'react-native-reanimated';

interface SchedulePickupFormProps {
  bin: BinData;
  onSubmit: (date: Date, time: string, notes: string) => void;
}

export default function SchedulePickupForm({ bin, onSubmit }: SchedulePickupFormProps) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('9:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Animation values
  const formOpacity = useSharedValue(1);
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.8);
  
  // Animated styles
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    };
  });
  
  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: successOpacity.value,
      transform: [{ scale: successScale.value }],
    };
  });
  
  const handleSubmit = () => {
    onSubmit(date, time, notes);
    
    // Run animation sequence
    formOpacity.value = withTiming(0, { duration: 300 });
    
    // After form fades out, show success message
    successOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    successScale.value = withDelay(300, withSequence(
      withTiming(1.1, { duration: 300 }),
      withTiming(1, { duration: 200 })
    ));
    
    // Update state to show success
    runOnJS(setIsSubmitted)(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setNotes('');
      formOpacity.value = withTiming(1);
      successOpacity.value = withTiming(0);
    }, 2000);
  };
  
  // Generate date options (today + next 7 days)
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  
  // Generate time options
  const timeOptions = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', 
    '4:00 PM', '5:00 PM'
  ];
  
  const formatDateOption = (d: Date) => {
    const isToday = d.getDate() === new Date().getDate();
    return isToday 
      ? 'Today' 
      : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Pickup</Text>
      <Text style={styles.subtitle}>
        {bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)} Bin • {bin.location}
      </Text>
      
      {!isSubmitted ? (
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={18} color={Colors.neutral[500]} />
              <Text style={styles.sectionTitle}>Select Date</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateOptionsContainer}
            >
              {dateOptions.map((d, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.dateOption,
                    date.toDateString() === d.toDateString() && styles.selectedDateOption
                  ]}
                  onPress={() => setDate(d)}
                >
                  <Text 
                    style={[
                      styles.dateOptionText,
                      date.toDateString() === d.toDateString() && styles.selectedDateOptionText
                    ]}
                  >
                    {formatDateOption(d)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={18} color={Colors.neutral[500]} />
              <Text style={styles.sectionTitle}>Select Time</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeOptionsContainer}
            >
              {timeOptions.map((t, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.timeOption,
                    time === t && styles.selectedTimeOption
                  ]}
                  onPress={() => setTime(t)}
                >
                  <Text 
                    style={[
                      styles.timeOptionText,
                      time === t && styles.selectedTimeOptionText
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any special instructions for pickup"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Schedule Pickup</Text>
            <Send size={18} color={Colors.white} />
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.successContainer, successAnimatedStyle]}>
          <View style={styles.successIconContainer}>
            <CheckCircle2 size={48} color={Colors.success[500]} />
          </View>
          <Text style={styles.successTitle}>Pickup Scheduled!</Text>
          <Text style={styles.successMessage}>
            Your pickup has been scheduled for {formatDateOption(date)} at {time}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
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
    marginBottom: Spacing.lg,
  },
  formContainer: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginLeft: Spacing.xs,
  },
  dateOptionsContainer: {
    paddingRight: Spacing.md,
  },
  dateOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginRight: Spacing.sm,
  },
  selectedDateOption: {
    backgroundColor: Colors.primary[500],
  },
  dateOptionText: {
    fontSize: 14,
    color: Colors.neutral[700],
  },
  selectedDateOptionText: {
    color: Colors.white,
    fontWeight: '500',
  },
  timeOptionsContainer: {
    paddingRight: Spacing.md,
  },
  timeOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginRight: Spacing.sm,
  },
  selectedTimeOption: {
    backgroundColor: Colors.secondary[500],
  },
  timeOptionText: {
    fontSize: 14,
    color: Colors.neutral[700],
  },
  selectedTimeOptionText: {
    color: Colors.white,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.neutral[800],
    height: 100,
  },
  submitButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginRight: Spacing.sm,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.success[500],
    marginBottom: Spacing.sm,
  },
  successMessage: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
});