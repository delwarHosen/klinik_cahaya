// components/common/PageLoader.tsx
import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Caption1, H4 } from '../typo/Typography';

interface PageLoaderProps {
  visible: boolean;
}

const LOADER_SIZE = 130;
const STROKE_WIDTH = 1.5;

function LoaderCircle() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const size = LOADER_SIZE;
  const strokeWidth = STROKE_WIDTH;
  const color = Colors.BRAND_PRIMARY;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient
            id="pageLoaderGrad"
            x1={`${center}`}
            y1="0"
            x2={`${center}`}
            y2={`${size}`}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={color} stopOpacity="5" />
            <Stop offset="20%" stopColor={color} stopOpacity="5" />
            <Stop offset="40%" stopColor={color} stopOpacity="5" />
            <Stop offset="60%" stopColor={color} stopOpacity="5" />
            <Stop offset="80%" stopColor={color} stopOpacity="5" />
            {/* Bottom = tail, fades to transparent */}
            <Stop offset="100%" stopColor={color} stopOpacity="1.5" />
            <Stop offset="0%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Faint background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.12}
        />

        {/* Gradient arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#pageLoaderGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
    </Animated.View>
  );
}

export default function PageLoader({ visible }: PageLoaderProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <LoaderCircle />
        <H4 style={styles.loadingText}>LOADING</H4>
        <Caption1 style={styles.subText}>May take few seconds to load this page</Caption1>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#1A1A1A',
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 8,
  },
  subText: {
    color: '#AAAAAA',
    textAlign: 'center',
  },
});