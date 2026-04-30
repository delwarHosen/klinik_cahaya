import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
    size?: number;
    strokeWidth?: number;
    color?: string;
    visible?: boolean;
}

export default function CustomLoader({
    size = 160,
    strokeWidth = 1,
    color = Colors.BRAND_PRIMARY,
    visible = true,
}: Props) {
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

    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // ~75% of circle visible, 25% transparent tail
    const arcLength = circumference * 0.75;

    return (
        <View style={{ width: size, height: size }}>
            <Animated.View
                style={{
                    width: size,
                    height: size,
                    transform: [{ rotate }],
                }}
            >
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <Defs>
                        {/*
                          Gradient runs along the stroke direction.
                          offset="0%" = arc start (tail) — transparent
                          offset="100%" = arc end (head) — full color
                          gradientUnits="userSpaceOnUse" lets us aim along the circle.
                        */}
                        <LinearGradient
                            id="loaderGrad"
                            x1={`${center}`}
                            y1="0"
                            x2={`${center}`}
                            y2={`${size}`}
                            gradientUnits="userSpaceOnUse"
                        >
                            {/* Top = head, full brand color */}
                            <Stop offset="0%"   stopColor={color} stopOpacity="5"   />
                            <Stop offset="20%"  stopColor={color} stopOpacity="5" />
                            <Stop offset="40%"  stopColor={color} stopOpacity="5" />
                            <Stop offset="60%"  stopColor={color} stopOpacity="5" />
                            <Stop offset="80%"  stopColor={color} stopOpacity="5" />
                            {/* Bottom = tail, fades to transparent */}
                            <Stop offset="100%" stopColor={color} stopOpacity="1.5"   />
                            <Stop offset="0%" stopColor={color} stopOpacity="0"   />
                        </LinearGradient>
                    </Defs>

                    {/* Faint full background track */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        opacity={0.12}
                    />

                    {/* Gradient arc — starts at top (−90°) */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="url(#loaderGrad)"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                        strokeLinecap="round"
                        transform={`rotate(-90, ${center}, ${center})`}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
}