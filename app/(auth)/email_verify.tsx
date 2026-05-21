import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body3, Caption2, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useLoginMutation, useResendOtpMutation, useVerifyOtpMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const OTP_LENGTH = 8;
const RESEND_COOLDOWN = 45;

export default function EmailVerifyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { email, password } = useLocalSearchParams<{ email: string; password: string }>();

  const [verifyOtp, { isLoading: verifyLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();

  const isLoading = verifyLoading || loginLoading;

  const [otp, setOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCooldown();
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => {
      clearTimeout(timer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleOtpChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtp(digits);
  };

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      showToast(t('otp_complete_error'), 'error');
      return;
    }
    try {
      await verifyOtp({ email, otp }).unwrap();
      const loginRes = await login({ email, password }).unwrap();
      if (loginRes?.access_token) {
        await AsyncStorage.setItem('access_token', loginRes.access_token);
        if (loginRes?.refresh_token) {
          await AsyncStorage.setItem('refresh_token', loginRes.refresh_token);
        }
      }
      showToast(t('otp_verified_success'), 'success');
      router.push('/(auth)/personal_information');
    } catch (err: any) {
      showToast(
        err?.data?.detail?.msg || err?.data?.message || t('invalid_otp', 'Invalid OTP. Please try again.'),
        'error'
      );
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      await resendOtp({ email }).unwrap();
      setOtp('');
      inputRef.current?.focus();
      showToast(t('otp_resent_success'), 'success');
      startCooldown();
    } catch (err: any) {
      showToast(err?.data?.message || t('resend_failed', 'Failed to resend OTP.'), 'error');
    }
  };

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
              {t('otp_title')}
            </H2>
            <Body3 color={Colors.PLACEHOLLDER_TEXT} style={styles.subtitle}>
              {t('otp_subtitle')}
            </Body3>

            {/* ✅ Single input field */}
            <TextInput
              ref={inputRef}
              style={[styles.otpInput, otp.length > 0 && styles.otpInputFilled]}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              placeholder="Enter 8-digit code"
              placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
            />

            {isLoading ? (
              <View style={{ alignItems: 'center', marginTop: hp(24) }}>
                <CustomLoader size={50} strokeWidth={1} />
              </View>
            ) : (
              <CustomButton
                title={t('verify')}
                onPress={handleVerify}
                width="100%"
                height={hp(70)}
                borderRadius={16}
                style={{ marginTop: hp(24) }}
              />
            )}

            <View style={styles.resendRow}>
              <Caption2 color={Colors.TEXT_COLOR}>{t('havent_received_otp')}</Caption2>
              <TouchableOpacity onPress={handleResendOtp} disabled={!canResend || resendLoading}>
                <Caption2 color={canResend ? Colors.BRAND_PRIMARY : Colors.PLACEHOLLDER_TEXT}>
                  {resendLoading
                    ? t('sending')
                    : canResend
                      ? t('resend_otp')
                      : t('resend_in', { seconds: cooldown })}
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
  },
  otpInput: {
    width: '100%',
    height: hp(60),
    borderWidth: 1.5,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: wp(16),
    fontSize: hp(18),
    fontWeight: '600',
    color: Colors.TEXT_COLOR,
    backgroundColor: '#fff',
    letterSpacing: 4, // ✅ digits গুলো একটু ফাঁকে ফাঁকে দেখাবে
  },
  otpInputFilled: {
    borderColor: Colors.BRAND_PRIMARY,
    backgroundColor: '#F0F8FF',
  },
  resendRow: {
    flexDirection: 'row',
    marginTop: hp(24),
    justifyContent: 'center',
    gap: 4,
  },
});