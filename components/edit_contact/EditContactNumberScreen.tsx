import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Colors } from '@/constants/theme'
import { useGetProfileQuery, useUpdatePhoneMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  onSuccess: () => void
}

const toE164 = (input: string): string => {
  const digits = input.replace(/\D/g, '')
  if (input.trim().startsWith('+')) return `+${digits}`
  if (digits.startsWith('0')) return `+880${digits.slice(1)}`
  return `+880${digits}`
}

export function EditContactNumberScreen({ onSuccess }: Props) {
  const [phone, setPhone] = useState('')
  const [updatePhone, { isLoading }] = useUpdatePhoneMutation()
  const { data } = useGetProfileQuery({})
  const existingPhone = data?.steps?.personal?.data?.phone ?? data?.phone ?? '+8801XXXXXXXXX'

  const handleSave = async () => {
    if (!phone.trim()) {
      showToast('Please enter a phone number.', 'error')
      return
    }

    const formatted = toE164(phone)

    try {
      await updatePhone({ phone: formatted }).unwrap()
      onSuccess()
    } catch (err: any) {
      showToast(err?.data?.detail?.msg ?? err?.data?.message ?? 'Failed to update phone number.', 'error')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Edit Contact Number" />

      <View style={styles.content}>
        <View style={styles.fieldBox}>
          <TextInput
            placeholder={existingPhone}
            placeholderTextColor="#AAAAAA"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <CustomButton
          title={isLoading ? 'Saving...' : 'Save'}
          onPress={handleSave}
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