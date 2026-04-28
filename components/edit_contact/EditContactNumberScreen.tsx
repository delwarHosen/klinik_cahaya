import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  onSendOtp: (phone: string) => void
}

export function EditContactNumberScreen({ onSendOtp }: Props) {
  const [phone, setPhone] = useState('+60 12 4523784')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Edit Contact Number" />

      <View style={styles.content}>
        <View style={styles.fieldBox}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <CustomButton
          title="Send OTP"
          onPress={() => onSendOtp(phone)}
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