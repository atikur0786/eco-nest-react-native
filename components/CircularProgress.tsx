import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CIRCLE_RADIUS = 120;
const STROKE_WIDTH = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * (CIRCLE_RADIUS - STROKE_WIDTH / 2);

const CircularProgress = ({ fill = 70 }) => {
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - fill / 100);

  return (
    <View style={styles.container}>
      <Svg width={240} height={240}>
        <Circle
          cx={120}
          cy={120}
          r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
          stroke="#e0e0e0"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={120}
          cy={120}
          r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
          stroke="#11B981"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${CIRCLE_CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="120,120"
        />
      </Svg>
      <View style={styles.progressInner}>
        <Text style={styles.progressText}>{fill}%</Text>
        <Text style={styles.progressLabel}>FULL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressInner: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 16,
    color: '#888',
  },
});

export default CircularProgress;
