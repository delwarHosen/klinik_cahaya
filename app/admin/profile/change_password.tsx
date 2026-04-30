import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption2, H5 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function ChangePasswordScreen() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [previousPassword, setPreviousPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdate = () => {
   
    // if (!previousPassword || !newPassword || !confirmPassword) return
    // if (newPassword !== confirmPassword) return

    
    setShowModal(true)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Change Password" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldBox}>
          <TextInput
            placeholder="Previous Password"
            placeholderTextColor="#666666"
            value={previousPassword}
            onChangeText={setPreviousPassword}
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
          title='Update Password'
          onPress={handleUpdate}
          height={64}
          width={"100%"}
          borderRadius={16}
          style={{ marginTop: 10 }}
        />

      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SuccessVerifyIcon />
            <H5 style={styles.successTitle}>Your Password Has Been Changed Successfully</H5>
            <Caption2 color="#888888" align="center" style={{ marginBottom: hp(10) }}>
              Continue To Login Again
            </Caption2>

            
            <CustomButton
              title='Continue'
              onPress={() => router.replace('/(auth)/login')}
              height={56}
              width={"100%"}
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
    flex: 1, backgroundColor: Colors.APP_BACKGROUND,
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
  updateBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: hp(18),
    alignItems: 'center',
    marginTop: hp(20),
  },

  // Modal Styles
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
  continueBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: hp(18),
    alignItems: 'center',
    alignSelf: 'stretch',
  },
})