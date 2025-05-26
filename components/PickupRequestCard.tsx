import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PickupRequest } from '../types';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import { Calendar, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Circle as XCircle } from 'lucide-react-native';

interface PickupRequestCardProps {
  pickup: PickupRequest;
  onPress?: (pickup: PickupRequest) => void;
}

const getStatusColor = (status: PickupRequest['status']) => {
  switch (status) {
    case 'confirmed':
      return Colors.secondary[500];
    case 'completed':
      return Colors.success[500];
    case 'cancelled':
      return Colors.error[500];
    default:
      return Colors.warning[500]; // pending
  }
};

const getStatusIcon = (status: PickupRequest['status']) => {
  switch (status) {
    case 'confirmed':
      return <Clock size={20} color={getStatusColor(status)} />;
    case 'completed':
      return <CheckCircle size={20} color={getStatusColor(status)} />;
    case 'cancelled':
      return <XCircle size={20} color={getStatusColor(status)} />;
    default:
      return <AlertTriangle size={20} color={getStatusColor(status)} />;
  }
};

export default function PickupRequestCard({ pickup, onPress }: PickupRequestCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Pressable 
      style={[styles.container, { borderLeftColor: getStatusColor(pickup.status) }]}
      onPress={() => onPress && onPress(pickup)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pickup Request</Text>
        <View style={styles.statusContainer}>
          {getStatusIcon(pickup.status)}
          <Text style={[styles.statusText, { color: getStatusColor(pickup.status) }]}>
            {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.dateRow}>
          <Calendar size={16} color={Colors.neutral[500]} />
          <Text style={styles.dateLabel}>Scheduled:</Text>
          <Text style={styles.dateValue}>{formatDate(pickup.scheduledDate)}</Text>
        </View>
        
        <View style={styles.dateRow}>
          <Clock size={16} color={Colors.neutral[500]} />
          <Text style={styles.dateLabel}>Requested:</Text>
          <Text style={styles.dateValue}>{formatDate(pickup.requestDate)}</Text>
        </View>
        
        {pickup.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{pickup.notes}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    gap: Spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.neutral[500],
    marginLeft: 6,
    marginRight: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  notesContainer: {
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    backgroundColor: Colors.neutral[50],
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: Colors.neutral[700],
    fontStyle: 'italic',
  },
});