import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { FormInput } from '@/components/inputForm/inputForm'
import { CustomButton } from '@/components/shared/CustomButton'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Caption2, H5 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useChangePasswordMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter()
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const [showModal, setShowModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordTouched, setOldPasswordTouched] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordTouched, setNewPasswordTouched] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  
  const getOldPasswordError = () => {
    if (!oldPassword) return t('err_old_pw_req')
    return ''
  }

  const getNewPasswordError = () => {
    if (!newPassword) return t('err_new_pw_req')
    if (newPassword.length < 6) return t('err_pw_min')
    return ''
  }

  const getConfirmPasswordError = () => {
    if (!confirmPassword) return t('err_confirm_pw_req')
    if (confirmPassword !== newPassword) return t('err_pw_mismatch')
    return ''
  }

  const handleUpdate = async () => {
    setOldPasswordTouched(true)
    setNewPasswordTouched(true)
    setConfirmPasswordTouched(true)

    if (getOldPasswordError() || getNewPasswordError() || getConfirmPasswordError()) return

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      }).unwrap()

      setShowModal(true)
    } catch (err: any) {
      showToast(
        err?.data?.detail?.msg || err?.data?.message || t('err_failed_change_pw'),
        'error'
      )
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title={t('change_password')} />

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
          placeholder={t('previous_password')}
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
          placeholder={t('new_password')}
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
          placeholder={t('confirm_password')}
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
            title={t('update_password')}
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
              {t('pw_change_success')}
            </H5>
            <Caption2 color="#888888" align="center" style={{ marginBottom: hp(10) }}>
              {t('continue_to_login')}
            </Caption2>
            <CustomButton
              title={t('continue')}
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