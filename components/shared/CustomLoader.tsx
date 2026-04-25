import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export default function CustomLoader({
    size = 45,
    strokeWidth = 6,
    color = Colors.BRAND_PRIMARY,
}: Props) {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000,          
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

    
    const cometLength = circumference * 0.72;

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
                        <LinearGradient 
                            id="cometGrad" 
                            x1="0%" 
                            y1="50%" 
                            x2="100%" 
                            y2="50%" 
                            gradientUnits="objectBoundingBox"
                        >
                            {/* Head — brightest & most opaque */}
                            <Stop offset="0%" stopColor={color} stopOpacity="1" />
                            {/* Middle — still strong but starting to fade */}
                            <Stop offset="25%" stopColor={color} stopOpacity="0.85" />
                            {/* Tail start — gradual fade */}
                            <Stop offset="65%" stopColor={color} stopOpacity="0.90" />
                            {/* Tail end — almost invisible */}
                            <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
                        </LinearGradient>
                    </Defs>

                    {/* Background faint circle */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        // stroke={color}
                        stroke="#d4b0ff"
                        strokeWidth={strokeWidth}
                        fill="none"
                        // opacity={1}
                    />

                    {/* Comet Effect */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="url(#cometGrad)"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${cometLength} ${circumference - cometLength}`}
                        strokeLinecap="round"          
                        strokeLinejoin="round"
                        transform={`rotate(-90, ${center}, ${center})`}   
                    />
                </Svg>
            </Animated.View>
        </View>
    );
}