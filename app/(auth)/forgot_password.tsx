import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import PageLoader from '@/components/shared/PageLoader';
import { showToast } from '@/components/shared/Toast';
import { Caption2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useForgotPasswordMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

  const [waitingReset, setWaitingReset] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handledRef = useRef(false);

  // URL থেকে token parse করে navigate করো
  const tryNavigateWithToken = async (url?: string | null) => {
    if (handledRef.current) return;

    // URL থেকে token নাও (Supabase #access_token=xxx অথবা ?access_token=xxx পাঠায়)
    if (url) {
      const fragment = url.includes('#') ? url.split('#')[1] : url.split('?')[1] ?? '';
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      console.log('🔗 URL:', url);
      console.log('🔑 Token from URL:', accessToken);

      if (accessToken) {
        handledRef.current = true;
        clearInterval(intervalRef.current!);
        setWaitingReset(false);
        await AsyncStorage.setItem('access_token', accessToken);
        if (refreshToken) await AsyncStorage.setItem('refresh_token', refreshToken);
        router.push('/(auth)/set_new_password');
      }
    }
  };

  useEffect(() => {
    if (!waitingReset) return;

    Keyboard.dismiss();
    handledRef.current = false;

    // Register এর মতো — deep link এলে সাথে সাথে handle করো
    const subscription = Linking.addEventListener('url', (event) => {
      tryNavigateWithToken(event.url);
    });


    intervalRef.current = setInterval(async () => {
      const url = await Linking.getInitialURL();
      tryNavigateWithToken(url);
    }, 4000);

    return () => {
      subscription.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [waitingReset]);

  const handleSend = async () => {
    Keyboard.dismiss();
    if (!email.trim()) {
      showToast('Please enter your email.', 'error');
      return;
    }

    try {
      const redirectUrl = Linking.createURL('reset-password');
      await forgotPassword({
        email: email.trim().toLowerCase(),
        redirect_to: redirectUrl,
      }).unwrap();

      showToast('Check your email to reset password.', 'success');
      setWaitingReset(true);
    } catch (err: any) {
      showToast(
        err?.data?.detail?.msg || err?.data?.message || 'Failed to send reset email.',
        'error'
      );
    }
  };

  return (
    <>
      <PageLoader
        visible={waitingReset}
        title="WAITING"
        subtitle={"Please check your email.\nClick the reset link to continue."}
      />

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
              description="We'll send a reset link to this email"
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
                title="Send Confirmation"
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
    </>
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