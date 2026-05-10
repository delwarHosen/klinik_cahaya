import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Caption2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useForgotPasswordMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSend = async () => {
    Keyboard.dismiss();
    if (!email.trim()) {
      showToast('Please enter your email.', 'error');
      return;
    }

    try {
      await forgotPassword({
        email: email.trim().toLowerCase(),
      }).unwrap();

      showToast('OTP sent! Check your email.', 'success');
      router.push({
        pathname: '/(auth)/otp_verify' as any,
        params: { email: email.trim().toLowerCase() },
      });
    } catch (err: any) {
      showToast(
        err?.data?.detail?.msg || err?.data?.message || 'Failed to send OTP.',
        'error'
      );
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

        <View style={styles.container}>
          <AuthHeading
            title="Forgot Password"
            description="We'll send an OTP to this email"
            style={{ marginBottom: hp(30) }}
          />

          <FormInput
            value={email}
            onChangeText={setEmail}
            type="email"
            placeholder="Enter Email Address"
          />

          {isLoading ? (
            <View style={{ alignItems: 'center', marginTop: hp(12) }}>
              <CustomLoader size={50} strokeWidth={3} />
            </View>
          ) : (
            <CustomButton
              title="Send OTP"
              onPress={handleSend}
              width="100%"
              height={hp(70)}
              borderRadius={16}
              style={{ marginTop: hp(12) }}
            />
          )}

          <View style={styles.footer}>
            <Caption2 color={Colors.TEXT_COLOR}>Remember your password?</Caption2>
            <TouchableOpacity onPress={() => router.back()}>
              <Caption2 color={Colors.BRAND_PRIMARY}> Sign in</Caption2>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: hp(20),
    paddingBottom: hp(5),
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(20),
    paddingTop: hp(35),
  },
  footer: {
    marginTop: hp(20),
    flexDirection: 'row',
  },
});