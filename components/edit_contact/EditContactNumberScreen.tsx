import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Colors } from '@/constants/theme'
import { useUpdatePhoneMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { Alert, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  onSendOtp: (phone: string) => void
}

const toE164 = (input: string): string => {
  const digits = input.replace(/\D/g, '')
  if (input.trim().startsWith('+')) return `+${digits}`
  if (digits.startsWith('0')) return `+880${digits.slice(1)}`
  return `+880${digits}`
}

export function EditContactNumberScreen({ onSendOtp }: Props) {
  const [phone, setPhone] = useState('')
  const [updatePhone, { isLoading }] = useUpdatePhoneMutation()

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter a phone number.')
      return
    }

    const formatted = toE164(phone)

    try {
      await updatePhone({ phone: formatted }).unwrap()
      onSendOtp(formatted)
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.data?.detail?.msg ?? err?.data?.message ?? 'Failed to update phone number.'
      )
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Edit Contact Number" />

      <View style={styles.content}>
        <View style={styles.fieldBox}>
          <TextInput
            placeholder="+8801XXXXXXXXX"
            placeholderTextColor="#AAAAAA"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <CustomButton
          title={isLoading ? 'Sending...' : 'Send OTP'}
          onPress={handleSendOtp}
          disabled={isLoading}
          height={64}
          width="100%"
          borderRadius={16}
          style={{ marginTop: 10 }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
  content: { paddingTop: hp(30) },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginBottom: hp(16),
  },
  input: { fontSize: 15, color: '#333333', paddingVertical: hp(14), fontFamily: 'Poppins_400Regular' },
})