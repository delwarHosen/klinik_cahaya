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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [waitingReset, setWaitingReset] = useState(false);
  const [checkingToken, setCheckingToken] = useState(false);

  const handleSend = async () => {
    Keyboard.dismiss();
    if (!email.trim()) {
      showToast('Please enter your email.', 'error');
      return;
    }

    try {
      await forgotPassword({
        email: email.trim().toLowerCase(),
        redirect_to: 'kliniknurcahaya://reset-password',
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

  const handleVerifyClick = async () => {
    setCheckingToken(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        router.push('/(auth)/set_new_password');
      } else {
        showToast("Token not found. Please click the reset link in your email first.", 'error');
      }
    } catch {
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setCheckingToken(false);
    }
  };

  // ─── Waiting Screen ───────────────────────────────────────
  if (waitingReset) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.waitingContainer}>
          <Caption2 color={Colors.TEXT_COLOR} style={styles.waitingTitle}>
            📧 Check Your Email
          </Caption2>

          <Caption2
            color={Colors.PLACEHOLLDER_TEXT}
            style={styles.waitingSubtitle}
          >
            We sent a reset link to{'\n'}
            <Caption2 color={Colors.BRAND_PRIMARY}>{email}</Caption2>
            {'\n\n'}
            Click the link in the email, then{'\n'}
            press the button below.
          </Caption2>

          {checkingToken ? (
            <View style={{ alignItems: 'center', marginTop: hp(12) }}>
              <CustomLoader size={50} strokeWidth={3} />
            </View>
          ) : (
            <CustomButton
              title="I've Clicked the Link ✓"
              onPress={handleVerifyClick}
              width="100%"
              height={hp(70)}
              borderRadius={16}
              style={{ marginTop: hp(30) }}
            />
          )}

          <TouchableOpacity
            style={{ marginTop: hp(20), alignItems: 'center' }}
            onPress={() => setWaitingReset(false)}
          >
            <Caption2 color={Colors.BRAND_PRIMARY}>← Send to a different email</Caption2>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main Screen ──────────────────────────────────────────
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
  waitingContainer: {
    flex: 1,
    paddingHorizontal: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: hp(16),
  },
  waitingSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
});