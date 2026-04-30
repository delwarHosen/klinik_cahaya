import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body3, Caption2, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CODE_LENGTH = 6;

export default function EmailVerifyOtp() {
    const router = useRouter();
    const [code, setCode] = useState<string>('');
    const [timer, setTimer] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<TextInput | null>(null);

    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = () => {
        if (!canResend) return;
        setTimer(30);
        setCanResend(false);
        setCode('');
        showToast("Verification code sent again!")
    };

    const handleVerify = () => {
        if (code.length !== CODE_LENGTH) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Navigate to personal information after verify
            router.push('/(auth)/personal_information');
        }, 1000);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.APP_BACKGROUND }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <LeftAngleIcon />
                </TouchableOpacity>

                <View style={styles.scrollContent}>
                    <View style={styles.container}>
                        <AuthHeading
                            title="Verify your code"
                            style={{ marginBottom: hp(30) }}
                            description="Enter the code we have sent to your Email"
                        />

                        <View style={styles.form}>
                            <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}>
                                <View style={styles.otpContainer}>
                                    {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.otpBox,
                                                {
                                                    borderColor: index === code.length
                                                        ? Colors.BRAND_PRIMARY
                                                        : "#E0E0E0",
                                                },
                                            ]}
                                        >
                                            <H2 style={styles.otpText}>
                                                {code[index] ? code[index] : (index < code.length ? '' : '')}
                                                {!code[index] && index >= code.length && (
                                                    <Body3 color="#ccc" style={{ fontSize: 20 }}>*</Body3>
                                                )}
                                            </H2>
                                        </View>
                                    ))}
                                </View>
                            </TouchableOpacity>

                            <TextInput
                                ref={inputRef}
                                value={code}
                                onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
                                keyboardType="number-pad"
                                maxLength={CODE_LENGTH}
                                style={styles.hiddenInput}
                                autoFocus={true}
                            />

                            <View style={styles.buttonWrapper}>
                                {loading ? (
                                    <CustomLoader size={50} />
                                ) : (
                                    <CustomButton
                                        title="Verify"
                                        onPress={handleVerify}
                                        width="100%"
                                        height={hp(71)}
                                        borderRadius={16}
                                    />
                                )}
                            </View>

                            <View style={styles.resendContainer}>
                                <Caption2 color="#000">Haven't received the OTP?</Caption2>
                                <TouchableOpacity
                                //  onPress={handleResend} 
                                 onPress={()=>router.push('/(auth)/personal_information')}
                                 disabled={!canResend}>
                                    <Caption2
                                        color={Colors.BRAND_PRIMARY}
                                        style={[styles.resendText, { opacity: canResend ? 1 : 0.5 }]}
                                    >
                                        {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                                    </Caption2>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp(20),
        marginTop: hp(20),
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: wp(24),
    },
    container: {
        width: '100%',
        marginTop: hp(40),
    },
    form: {
        width: '100%',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: wp(5),
        marginBottom: hp(30),
        width: '100%',
    },
    otpBox: {
        width: wp(45),
        height: 71,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    otpText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    buttonWrapper: {
        alignItems: 'center',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: hp(24),
        gap: 5,
    },
    resendText: {
        fontWeight: 'bold',
        textDecorationLine: 'none',
    },
});