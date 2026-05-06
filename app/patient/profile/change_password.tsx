import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption2, H5 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useChangePasswordMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ChangePasswordScreen() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const handleUpdate = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.')
      return
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      }).unwrap()

      setShowModal(true)
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message ?? 'Failed to change password. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Change Password" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.fieldBox}>
          <TextInput
            placeholder="Previous Password"
            placeholderTextColor="#666666"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.fieldBox}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#666666"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.fieldBox}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#666666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <CustomButton
          title={isLoading ? 'Updating...' : 'Update Password'}
          onPress={handleUpdate}
          disabled={isLoading}
          height={64}
          width={'100%'}
          borderRadius={16}
          style={{ marginTop: 10 }}
        />
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SuccessVerifyIcon />
            <H5 style={styles.successTitle}>
              Your Password Has Been Changed Successfully
            </H5>
            <Caption2
              color="#888888"
              align="center"
              style={{ marginBottom: hp(10) }}
            >
              Continue To Login Again
            </Caption2>

            <CustomButton
              title="Continue"
              onPress={() => router.replace('/(auth)/login')}
              height={56}
              width={'100%'}
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
  scrollContent: { paddingBottom: hp(40), paddingTop: hp(10) },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginBottom: hp(12),
  },
  input: {
    fontSize: 15,
    color: '#333333',
    paddingVertical: hp(14),
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