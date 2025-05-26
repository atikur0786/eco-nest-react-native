import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WasteStats } from '../types';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import { Leaf, ChartBar as BarChart3 } from 'lucide-react-native';

interface StatsCardProps {
  title: string;
  icon?: React.ReactNode;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export function StatsCard({ 
  title, 
  icon, 
  value, 
  subtitle, 
  trend, 
  trendValue,
  color = Colors.primary[400]
}: StatsCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return Colors.success[500];
    if (trend === 'down') return Colors.error[500];
    return Colors.neutral[500];
  };

  const getTrendSymbol = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon}
      </View>
      
      <Text style={[styles.value, { color }]}>{value}</Text>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
      
      {trend && trendValue && (
        <View style={styles.trendContainer}>
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {getTrendSymbol()} {trendValue}
          </Text>
        </View>
      )}
    </View>
  );
}

interface WasteStatsCardProps {
  stats: WasteStats;
  previousStats?: WasteStats;
}

export function WasteStatsCard({ stats, previousStats }: WasteStatsCardProps) {
  // Calculate trends if previous stats exist
  const getWasteTrend = () => {
    if (!previousStats) return undefined;
    
    const diff = stats.wasteTotalKg - previousStats.wasteTotalKg;
    if (Math.abs(diff) < 0.1) return 'neutral';
    return diff < 0 ? 'down' : 'up'; // Lower waste is better (down is good)
  };

  const getRecyclingTrend = () => {
    if (!previousStats?.recyclingPercentage || !stats.recyclingPercentage) return undefined;
    
    const diff = stats.recyclingPercentage - previousStats.recyclingPercentage;
    if (Math.abs(diff) < 1) return 'neutral';
    return diff > 0 ? 'up' : 'down'; // Higher recycling is better (up is good)
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Weekly Summary</Text>
        <Text style={styles.statsDate}>{formatDate(stats.date)}</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <StatsCard
          title="Total Waste"
          icon={<BarChart3 size={20} color={Colors.neutral[500]} />}
          value={`${stats.wasteTotalKg} kg`}
          trend={getWasteTrend()}
          trendValue={previousStats ? `${Math.abs(stats.wasteTotalKg - previousStats.wasteTotalKg).toFixed(1)} kg` : undefined}
          color={Colors.neutral[700]}
        />
        
        {stats.recyclingPercentage && (
          <StatsCard
            title="Recycling"
            icon={<Recycle size={20} color={Colors.secondary[500]} />}
            value={`${stats.recyclingPercentage}%`}
            trend={getRecyclingTrend()}
            trendValue={previousStats?.recyclingPercentage ? `${Math.abs(stats.recyclingPercentage - previousStats.recyclingPercentage).toFixed(0)}%` : undefined}
            color={Colors.secondary[500]}
          />
        )}
        
        {stats.carbonSaved && (
          <StatsCard
            title="Carbon Saved"
            icon={<Leaf size={20} color={Colors.success[500]} />}
            value={`${stats.carbonSaved} kg`}
            color={Colors.success[500]}
          />
        )}
      </View>
    </View>
  );
}

import { Recycle } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    flex: 1,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  trendContainer: {
    marginTop: Spacing.xs,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  statsDate: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
});