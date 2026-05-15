import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Colors } from '@/constants/theme'
import { useGetProfileQuery, useUpdatePhoneMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  onSuccess: () => void
}

const toE164 = (input: string): string => {
  const digits = input.replace(/\D/g, '')
  if (input.trim().startsWith('+')) return `+${digits}`
  if (digits.startsWith('0')) return `${digits.slice(1)}`
  return `${digits}`
}

export function EditContactNumberScreen({ onSuccess }: Props) {
  const { t } = useTranslation() 
  const [phone, setPhone] = useState('')
  const [updatePhone, { isLoading }] = useUpdatePhoneMutation()
  const { data } = useGetProfileQuery({})
  
 
  const existingPhone = data?.steps?.personal?.data?.phone ?? data?.phone ?? t('enter_add_new_number')

  const handleSave = async () => {
    if (!phone.trim()) {
      showToast(t('err_phone_req'), 'error')
      return
    }

    const formatted = toE164(phone)

    try {
      await updatePhone({ phone: formatted }).unwrap()
      onSuccess()
    } catch (err: any) {
      showToast(err?.data?.detail?.msg ?? err?.data?.message ?? t('err_phone_update_fail'), 'error')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title={t('edit_contact_number')} />

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
          title={isLoading ? t('saving') : t('save')}
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