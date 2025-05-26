import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { mockBins, mockPickups } from '@/data/mockData';
import PickupRequestCard from '@/components/PickupRequestCard';
import SchedulePickupForm from '@/components/SchedulePickupForm';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { CalendarPlus, RotateCcw } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

export default function ScheduleScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedBin, setSelectedBin] = useState(mockBins[0]);
  
  // Animation values
  const tabIndicatorPosition = useSharedValue(0);
  const formSlideUp = useSharedValue(showScheduleForm ? 0 : 300);
  const mainContentOpacity = useSharedValue(showScheduleForm ? 0 : 1);
  
  // Filter pickups based on active tab
  const filteredPickups = mockPickups.filter(pickup => {
    const pickupDate = new Date(pickup.scheduledDate);
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return pickupDate > now || pickup.status === 'pending' || pickup.status === 'confirmed';
    } else {
      return pickupDate < now && (pickup.status === 'completed' || pickup.status === 'cancelled');
    }
  });
  
  const handleTabChange = (tab: 'upcoming' | 'history') => {
    setActiveTab(tab);
    tabIndicatorPosition.value = withTiming(tab === 'upcoming' ? 0 : 1, { 
      duration: 300,
      easing: Easing.bezier(0.16, 1, 0.3, 1)
    });
  };
  
  const handleSchedulePickup = () => {
    setShowScheduleForm(true);
    formSlideUp.value = withTiming(0, { duration: 400 });
    mainContentOpacity.value = withTiming(0, { duration: 300 });
  };
  
  const handleFormClose = () => {
    formSlideUp.value = withTiming(300, { duration: 400 });
    mainContentOpacity.value = withTiming(1, { duration: 300 });
    
    setTimeout(() => {
      setShowScheduleForm(false);
    }, 400);
  };
  
  const handleFormSubmit = (date: Date, time: string, notes: string) => {
    // In a real app, this would make an API call to schedule a pickup
    console.log('Scheduling pickup:', { date, time, notes, binId: selectedBin.id });
    
    // Auto-close the form after submission
    setTimeout(() => {
      handleFormClose();
    }, 2000);
  };
  
  // Animated styles
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabIndicatorPosition.value * 140 }]
    };
  });
  
  const formContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: formSlideUp.value }]
    };
  });
  
  const mainContentStyle = useAnimatedStyle(() => {
    return {
      opacity: mainContentOpacity.value
    };
  });
  
  // Calculate the next pickup date
  const getNextPickupDate = () => {
    const upcomingPickups = mockPickups.filter(p => 
      p.status === 'confirmed' && new Date(p.scheduledDate) > new Date()
    );
    
    if (upcomingPickups.length === 0) return null;
    
    // Sort by date and get the soonest pickup
    upcomingPickups.sort((a, b) => 
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
    
    return upcomingPickups[0].scheduledDate;
  };
  
  const nextPickupDate = getNextPickupDate();
  
  return (
    <View style={styles.container}>
      {showScheduleForm ? (
        <Animated.View style={[styles.formOverlay, formContainerStyle]}>
          <Pressable style={styles.closeButton} onPress={handleFormClose}>
            <RotateCcw size={24} color={Colors.neutral[600]} />
          </Pressable>
          <SchedulePickupForm bin={selectedBin} onSubmit={handleFormSubmit} />
        </Animated.View>
      ) : null}
      
      <Animated.View style={[styles.content, mainContentStyle]}>
        <View style={styles.header}>
          <View style={styles.tabContainer}>
            <Pressable 
              style={styles.tab} 
              onPress={() => handleTabChange('upcoming')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'upcoming' && styles.activeTabText
              ]}>
                Upcoming
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.tab} 
              onPress={() => handleTabChange('history')}
            >
              <Text style={[
                styles.tabText, 
                activeTab === 'history' && styles.activeTabText
              ]}>
                History
              </Text>
            </Pressable>
            
            <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
          </View>
          
          <Pressable 
            style={styles.scheduleButton} 
            onPress={handleSchedulePickup}
          >
            <CalendarPlus size={20} color={Colors.white} />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </Pressable>
        </View>
        
        {nextPickupDate && activeTab === 'upcoming' && (
          <View style={styles.nextPickupContainer}>
            <Text style={styles.nextPickupLabel}>Next Pickup:</Text>
            <Text style={styles.nextPickupDate}>
              {new Date(nextPickupDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        )}
        
        {filteredPickups.length > 0 ? (
          <FlatList
            data={filteredPickups}
            renderItem={({ item }) => (
              <PickupRequestCard pickup={item} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No pickups {activeTab === 'upcoming' ? 'scheduled' : 'completed'}</Text>
            {activeTab === 'upcoming' && (
              <Pressable 
                style={styles.emptyScheduleButton} 
                onPress={handleSchedulePickup}
              >
                <Text style={styles.emptyScheduleButtonText}>Schedule a Pickup</Text>
              </Pressable>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 20,
    position: 'relative',
    width: 280,
    height: 40,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  activeTabText: {
    color: Colors.primary[600],
  },
  tabIndicator: {
    position: 'absolute',
    width: 140,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  scheduleButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
  nextPickupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[50],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary[500],
  },
  nextPickupLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginRight: 8,
  },
  nextPickupDate: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.secondary[700],
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[500],
    marginBottom: Spacing.md,
  },
  emptyScheduleButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyScheduleButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    zIndex: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 11,
    padding: 8,
  },
});