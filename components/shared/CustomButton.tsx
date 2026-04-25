import { Colors } from '@/constants/theme';
import { fp, hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { DimensionValue, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import CustomLoader from './CustomLoader';

interface CustomButtonProps {
    onPress: () => void;
    title?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
    color?: string;
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    borderColor?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export const CustomButton = ({
    onPress,
    title,
    icon,
    style,
    backgroundColor = Colors.BRAND_PRIMARY,
    color = "white",
    width = wp(120),
    height = hp(44),
    borderRadius = 100,
    borderColor,
    disabled,
    isLoading
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor,
                    borderWidth: borderColor ? 1 : 0,
                    borderColor: borderColor,
                },
                style
            ]}
        >
            {title ? (
                <Text style={{ fontFamily: "Poppins_600SemiBold", color, fontSize: fp(14) }}>
                    {isLoading && <CustomLoader size={16} />} {title}
                </Text>
            ) : null}
            {icon && icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});