import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { FormInput } from '@/components/inputForm/inputForm'
import { CustomButton } from '@/components/shared/CustomButton'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Caption2, H5 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useAdminChangePasswordMutation } from '@/redux/services/adminAuth'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ChangePasswordScreen() {
  const router = useRouter()
  const [adminChangePassword, { isLoading }] = useAdminChangePasswordMutation()

  const [showModal, setShowModal] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordTouched, setOldPasswordTouched] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordTouched, setNewPasswordTouched] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const getOldPasswordError = () => {
    if (!oldPassword) return 'Previous password is required'
    return ''
  }

  const getNewPasswordError = () => {
    if (!newPassword) return 'New password is required'
    if (newPassword.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const getConfirmPasswordError = () => {
    if (!confirmPassword) return 'Please confirm your password'
    if (confirmPassword !== newPassword) return 'Passwords do not match'
    return ''
  }

  const handleUpdate = async () => {
    setOldPasswordTouched(true)
    setNewPasswordTouched(true)
    setConfirmPasswordTouched(true)

    if (getOldPasswordError() || getNewPasswordError() || getConfirmPasswordError()) return

    try {
      await adminChangePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      }).unwrap()

      setShowModal(true)
    } catch (err: any) {
      console.log('Change password error:', JSON.stringify(err))
      showToast(
        err?.data?.detail?.msg || err?.data?.message || 'Failed to change password.',
        'error'
      )
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Change Password" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <FormInput
          value={oldPassword}
          onChangeText={(text) => {
            setOldPassword(text)
            setOldPasswordTouched(true)
          }}
          placeholder="Previous Password"
          type="password"
          error={getOldPasswordError()}
          touched={oldPasswordTouched}
        />

        <FormInput
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text)
            setNewPasswordTouched(true)
          }}
          placeholder="New Password"
          type="password"
          error={getNewPasswordError()}
          touched={newPasswordTouched}
        />

        <FormInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text)
            setConfirmPasswordTouched(true)
          }}
          placeholder="Confirm Password"
          type="password"
          error={getConfirmPasswordError()}
          touched={confirmPasswordTouched}
        />

        {isLoading ? (
          <View style={{ alignItems: 'center', marginTop: hp(20) }}>
            <CustomLoader size={50} strokeWidth={1} />
          </View>
        ) : (
          <CustomButton
            title="Update Password"
            onPress={handleUpdate}
            height={64}
            width="100%"
            borderRadius={16}
            style={{ marginTop: hp(10) }}
          />
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SuccessVerifyIcon />
            <H5 style={styles.successTitle}>
              Your Password Has Been Changed Successfully
            </H5>
            <Caption2 color="#888888" align="center" style={{ marginBottom: hp(10) }}>
              Continue To Login Again
            </Caption2>
            <CustomButton
              title="Continue"
              onPress={() => router.replace('/(auth)/login')}
              height={56}
              width="100%"
              borderRadius={14}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  scrollContent: {
    paddingBottom: hp(40),
    paddingTop: hp(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(24),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: wp(30),
    alignItems: 'center',
    width: '100%',
    gap: hp(16),
  },
  successTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 28,
  },
})