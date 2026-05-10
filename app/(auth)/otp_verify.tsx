import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body3, Caption2, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useResendForgotPasswordOtpMutation, useVerifyForgotPasswordOtpMutation } from '@/redux/services/authApi';

import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OTP_LENGTH = 6;

export default function ForgotPasswordOtpScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [verifyOtp, { isLoading: verifyLoading }] = useVerifyForgotPasswordOtpMutation();
    const [resendOtp, { isLoading: resendLoading }] = useResendForgotPasswordOtpMutation();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleOtpChange = (text: string, index: number) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length < OTP_LENGTH) {
            showToast('Please enter the complete 6-digit OTP.', 'error');
            return;
        }
        try {
            await verifyOtp({ email, otp: otpValue }).unwrap();
            showToast('OTP verified!', 'success');
            router.push({
                pathname: '/(auth)/set_new_password' as any,
                params: { email },
            });
        } catch (err: any) {
            showToast(
                err?.data?.detail?.msg || err?.data?.message || 'Invalid OTP. Please try again.',
                'error'
            );
        }
    };

    const handleResend = async () => {
        try {
            await resendOtp({ email }).unwrap();
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
            showToast('OTP resent! Check your email.', 'success');
        } catch (err: any) {
            showToast(
                err?.data?.detail?.msg || err?.data?.message || 'Failed to resend OTP.',
                'error'
            );
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <LeftAngleIcon />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <H2 color={Colors.TEXT_COLOR} style={styles.title}>
                            Enter your 6 digit code
                        </H2>
                        <Body3 color={Colors.PLACEHOLLDER_TEXT} style={styles.subtitle}>
                            We sent a code to{'\n'}
                            <Body3 color={Colors.BRAND_PRIMARY}>{email}</Body3>
                        </Body3>

                        {/* OTP Inputs */}
                        <View style={styles.otpRow}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={[styles.otpBox, digit ? styles.otpBoxFilled : {}]}
                                    value={digit}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    textContentType="oneTimeCode"
                                    autoComplete="one-time-code"
                                    selectTextOnFocus
                                    caretHidden
                                />
                            ))}
                        </View>

                        {/* Verify Button */}
                        {verifyLoading ? (
                            <View style={{ alignItems: 'center', marginTop: hp(24) }}>
                                <CustomLoader size={50} strokeWidth={1} />
                            </View>
                        ) : (
                            <CustomButton
                                title="Verify OTP"
                                onPress={handleVerify}
                                width="100%"
                                height={hp(70)}
                                borderRadius={16}
                                style={{ marginTop: hp(24) }}
                            />
                        )}

                        {/* Resend */}
                        <View style={styles.resendRow}>
                            <Caption2 color={Colors.TEXT_COLOR}>Haven't received the OTP? </Caption2>
                            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                                <Caption2 color={Colors.BRAND_PRIMARY}>
                                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                                </Caption2>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    header: {
        paddingHorizontal: wp(20),
        paddingTop: hp(10),
    },
    backButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: wp(20),
        paddingBottom: hp(40),
    },
    container: {
        flex: 1,
        paddingTop: hp(40),
    },
    title: {
        fontSize: hp(28),
        fontWeight: '700',
        marginBottom: hp(8),
    },
    subtitle: {
        marginBottom: hp(40),
        lineHeight: 24,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(8),
        marginBottom: hp(8),
    },
    otpBox: {
        flex: 1,
        aspectRatio: 1,
        maxWidth: wp(56),
        borderWidth: 1.5,
        borderColor: Colors.BORDER_COLOR,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: hp(22),
        fontWeight: '600',
        color: Colors.TEXT_COLOR,
        backgroundColor: '#fff',
    },
    otpBoxFilled: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: '#F0F8FF',
    },
    resendRow: {
        flexDirection: 'row',
        marginTop: hp(24),
        justifyContent: 'center',
    },
});