import { hp } from '@/utils/responsiveDevice';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { Body1 } from '../typo/Typography';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    type: ToastType;
    visible: boolean;
}

type ToastConfig = { message: string; type?: ToastType; duration?: number };

let toastRef: ((config: { message: string; type?: ToastType; duration?: number }) => void) | null = null;
const toastQueue: ToastConfig[] = [];

export const showToast = (message: string, type: ToastType = 'info', duration = 2000) => {
    if (toastRef) {
        toastRef({ message, type, duration });
    } else {
        toastQueue.push({ message, type, duration });
    }
};

export default function Toast() {
    const [state, setState] = useState<ToastState>({ message: '', type: 'info', visible: false });
    const opacity = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

   
    useEffect(() => {
        toastRef = ({ message, type = 'info', duration = 2000 }) => {
         
            if (animationRef.current) animationRef.current.stop();
            opacity.setValue(0);
            setState({ message, type, visible: true });

            animationRef.current = Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.delay(duration),
                Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]);

            animationRef.current.start(({ finished }) => {
                if (finished) setState(prev => ({ ...prev, visible: false }));
            });
        };

        
        if (toastQueue.length > 0) {
            const pending = toastQueue.shift()!;
            toastRef(pending);
        }

    }, []);

    const bgColor =
        state.type === 'success' ? '#2596BE' :
            state.type === 'error' ? '#FF383C' :
                '#1565C0';


    return (
        <Animated.View
            pointerEvents={state.visible ? 'auto' : 'none'}
            style={[
                styles.toast,
                {
                    opacity,
                    backgroundColor: bgColor,
                    display: state.visible ? 'flex' : 'none'
                }
            ]}
        >
            <View style={styles.row}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <Body1 style={styles.text}>{state.message}</Body1>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: hp(40),
        // bottom:hp(200),
        left: 20,
        right: 20,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 10,
        zIndex: 9999,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    icon: {
        width: 28,
        height: 28,
        borderRadius: 6,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
});