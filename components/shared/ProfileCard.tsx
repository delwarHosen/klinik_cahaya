import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Colors } from '@/constants/theme';
import { hp } from '@/utils/responsiveDevice';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Body3 } from '../typo/Typography';

interface ProfileItemProps {
    icon: ReactNode;
    label: string;
    onPress: () => void;
    style?: ViewStyle;
    textColor?: string,
    borderColor?: string,
    iconBG?: string,
    rightAngleColor?: string;
}

export const ProfileCard: React.FC<ProfileItemProps> = ({
    icon,
    label,
    onPress,
    style,
    textColor,
    borderColor,
    iconBG,
    rightAngleColor,
}) => {

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, style, { borderColor: borderColor ?? Colors.BORDER_COLOR }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center"
            }}>
                <View>
                    {icon}
                </View>
                <Body3 color={textColor ? textColor : Colors.TEXT_COLOR} >{label}</Body3>
            </View>
            <RightAngleIcon size={16}
                color={rightAngleColor ? rightAngleColor : Colors.BRAND_PRIMARY}
            />
        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: Colors.APP_BACKGROUND,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: hp(10)
    },
    icon: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        height: 30,
        width: 30,
    }
});