import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useLazyGetMedicalRecordsQuery } from '@/redux/services/medicalRecordApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IcVerificationScreen() {
    const router = useRouter();
    const [digits, setDigits] = useState(['', '', '', '']);
    const inputs = useRef<(TextInput | null)[]>([]);

    const [triggerVerify, { isLoading }] = useLazyGetMedicalRecordsQuery();

    const handleChange = (text: string, index: number) => {
        const newDigits = [...digits];
        newDigits[index] = text;
        setDigits(newDigits);

        // Auto focus next
        if (text && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = digits.join('');
        if (code.length < 4) return;

        try {
            const res = await triggerVerify(code).unwrap();
            if (res.results && res.results.length > 0) {
                router.push({
                    pathname: '/patient/quick_access/medical_record',
                    params: { icLast4: code }
                });
            } else {
                showToast("No records found for this IC");
            }
        } catch (error) {
            showToast("Verification failed");
        }
    };


    // const isComplete = digits.every(d => d !== '');

    return (
        <SafeAreaView style={styles.container}>
            <SectionTitle title="IC Verification" />
            <View style={styles.content}>
                <H6 style={styles.subtitle} align="center">
                    4-digit IC verification{'\n'}(last 4 digits)
                </H6>

                <View style={styles.boxRow}>
                    {digits.map((digit, index) => (
                        <View key={index} style={[styles.box, digit ? styles.boxFilled : styles.boxEmpty]}>
                            <TextInput
                                ref={(ref) => { inputs.current[index] = ref; }}
                                style={styles.boxInput}
                                value={digit}
                                onChangeText={(text) => handleChange(text.slice(-1), index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                textAlign="center"
                            />
                        </View>
                    ))}
                </View>

                <CustomButton
                    title="Verify"
                    onPress={handleVerify}
                    isLoading={isLoading}
                    style={{ marginTop: hp(40) }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    content: {
        flex: 1,
        paddingTop: hp(40),
        alignItems: 'center',
    },
    subtitle: {
        color: Colors.TEXT_COLOR,
        lineHeight: 26,
        marginBottom: hp(36),
        fontSize: 16,
    },
    boxRow: {
        flexDirection: 'row',
        gap: wp(16),
        justifyContent: 'center',
    },
    box: {
        width: wp(60),
        height: wp(60),
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    boxEmpty: {
        borderColor: Colors.BORDER_COLOR,
    },
    boxFilled: {
        borderColor: Colors.BRAND_PRIMARY,
    },
    boxInput: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.TEXT_COLOR,
        width: '100%',
        height: '100%',
        textAlign: 'center',
    },
});