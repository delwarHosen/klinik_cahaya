// components/common/PageLoader.tsx
import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Caption1, H4 } from '../typo/Typography';
 
interface PageLoaderProps {
  visible: boolean;
}
 
export default function PageLoader({ visible }: PageLoaderProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
 
      // Infinite spin
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      spinAnim.setValue(0);
    }
  }, [visible]);
 
  if (!visible) return null;
 
  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
 
  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {/* Spinning circle */}
        <Animated.View style={[styles.spinnerWrapper, { transform: [{ rotate }] }]}>
          <View style={styles.spinnerRing} />
        </Animated.View>
 
        {/* Loading text */}
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
  spinnerWrapper: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  spinnerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: Colors.BRAND_PRIMARY,
    borderRightColor: Colors.BRAND_PRIMARY,
    // Subtle shadow for depth
    shadowColor: Colors.BRAND_PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  loadingText: {
    color: '#1A1A1A',
    letterSpacing: 2,
    fontWeight: '700',
  },
  subText: {
    color: '#AAAAAA',
    textAlign: 'center',
  },
});