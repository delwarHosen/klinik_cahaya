import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Body2, Caption1 } from '../typo/Typography';

export type InputType = "text" | "email" | "password" | "number" | "date" | "image";

interface FormInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    type?: InputType;
    error?: string;
    touched?: boolean;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    editable?: boolean;
    rightIcon?: React.ReactNode;
    onBlur?: () => void;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    type = "text",
    error,
    touched = false,
    required = false,
    maxLength,
    rightIcon,
    onBlur
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const getKeyboardtype = () => {
        switch (type) {
            case 'email': return "email-address";
            case 'number': return "numeric";
            default: return "default";
        }
    }

    const getError = () => {
        if (!touched) return undefined;
        if (required && !value.trim()) return "This field is required";
        return error;
    }

    return (
        <View style={styles.container}>
           
            {label && (
                <View style={styles.labelContainer}>
                    <Body2 color={Colors.ACCENT_YELLOW}>{label}</Body2>
                </View>
            )}

            <View style={[styles.inputContainer, getError() && styles.inputError]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={"#8C88A3"}
                    secureTextEntry={type === "password" && !showPassword}
                    keyboardType={getKeyboardtype()}
                    autoCapitalize={type === "email" ? "none" : "sentences"}
                    autoCorrect={false}
                    maxLength={maxLength}
                    onBlur={onBlur}
                />

                {type === "password" ? (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                       
                    </TouchableOpacity>
                ) : (
                    rightIcon && <View style={styles.iconButton}>{rightIcon}</View>
                )}
            </View>

           
            {getError() && (
                <Caption1 color='#EF4444' style={styles.error}>{getError()}</Caption1>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(4), 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        backgroundColor: 'transparent',
        marginBottom:hp(12)
    },
    input: {
        flex: 1,
        color: Colors.PLACEHOLLDER_TEXT,
        paddingVertical: hp(24), 
    },
    inputError: {
        borderColor: '#EF4444',
    },
    iconButton: {
        padding: 4,
    },
    error: {
        marginTop: 4,
    },
})