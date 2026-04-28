import { DocumentIcon } from '@/assets/icons/common_icon/DocumentIcon'
import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption4, H3 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ContactSupportScreen() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Contact & Support" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldBox}>
          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="#666666"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldBox}>
          <TextInput
            placeholder="Enter Email Address"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={[styles.fieldBox, styles.textAreaBox]}>
          <TextInput
            placeholder="Write here"
            placeholderTextColor="#666666"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            style={[styles.input, styles.textArea]}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.docBtn} activeOpacity={0.75}>
          <DocumentIcon />
          <Caption4 color="#888888" style={{ marginTop: 6 }}>Add Document</Caption4>
        </TouchableOpacity>

        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          height={64}
          width={"100%"}
          borderRadius={16}
          style={{ marginTop: 10 }}
        />
      </ScrollView>

      {/* ── Success Modal ── */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <SuccessVerifyIcon />
            <H3 style={styles.successTitle}>Submit Successfully</H3>
            <CustomButton
              title="Continue"
              onPress={() => {
                setShowSuccess(false)
                router.back()
              }}
              height={64}
              width={"100%"}
              borderRadius={16}
              style={{
                marginTop: 10,
                backgroundColor: Colors.APP_BACKGROUND,
                borderWidth: 2,
                borderColor: Colors.BRAND_PRIMARY,
              }}
              color={Colors.BRAND_PRIMARY}
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
    paddingTop: hp(20),
  },

  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginBottom: hp(12),
  },
  textAreaBox: { paddingVertical: hp(10) },
  input: {
    fontSize: 15,
    color: '#333333',
    paddingVertical: hp(14),
    fontFamily: 'Poppins_400Regular',
    height: hp(64),
  },
  textArea: { height: hp(150), paddingTop: hp(4) },

  docBtn: {
    width: wp(117),
    height: hp(150),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(32),
  },
  modalCard: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 24,
    paddingVertical: hp(40),
    paddingHorizontal: wp(28),
    alignItems: 'center',
    width: '100%',
    gap: hp(16),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  successTitle: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#1A1A1A',
  },
})