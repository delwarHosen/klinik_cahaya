import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body3, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useResetPasswordMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateNewPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChangePassword = async () => {
    Keyboard.dismiss();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      showToast('Please fill all fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('access_token'); // ← access_token
      console.log('🔑 Token:', accessToken);

      if (!accessToken) {
        showToast('Session expired. Please request a new reset link.', 'error');
        return;
      }

      await resetPassword({
        new_password: newPassword,
        confirm_password: confirmPassword,
        access_token: accessToken,
      }).unwrap();

      setShowSuccessModal(true);
    } catch (err: any) {
      console.log('Reset password error:', JSON.stringify(err));
      showToast(
        err?.data?.detail?.msg || err?.data?.message || 'Failed to reset password.',
        'error'
      );
    }
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <LeftAngleIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <AuthHeading
            title="Set New Password"
            description="Create your New Password"
            style={{ marginBottom: hp(30) }}
          />

          <FormInput
            value={newPassword}
            onChangeText={setNewPassword}
            type="password"
            placeholder="New Password"
          />

          <FormInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            type="password"
            placeholder="Confirm Password"
          />

          {isLoading ? (
            <View style={{ alignItems: 'center', marginTop: hp(12) }}>
              <CustomLoader size={50} strokeWidth={3} />
            </View>
          ) : (
            <CustomButton
              title="Change Password"
              onPress={handleChangePassword}
              width="100%"
              height={hp(60)}
              borderRadius={16}
              style={{ marginTop: hp(12) }}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconWrapper}>
              <SuccessVerifyIcon />
            </View>
            <H2 style={styles.modalTitle}>Password Changed!</H2>
            <Body3 color={Colors.PLACEHOLLDER_TEXT} style={styles.modalDescription}>
              Your password has been changed successfully.
            </Body3>
            <CustomButton
              title="Back to Login"
              onPress={handleGoToLogin}
              width="100%"
              height={hp(60)}
              borderRadius={14}
              style={{ marginTop: hp(20) }}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(320),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: wp(24),
    paddingVertical: hp(32),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  successIconWrapper: {
    marginBottom: hp(16),
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: hp(8),
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: wp(10),
  },
});