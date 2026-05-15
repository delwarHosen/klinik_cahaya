import { CustomButton } from '@/components/shared/CustomButton'
import { Caption1, Caption2, H3 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SectionTitle from '../shared/SectionTitle'

interface Props {
  onVerified: () => void
}

export function OtpVerifyScreen({ onVerified }: Props) {
  const { t } = useTranslation() 
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputs = useRef<(TextInput | null)[]>([])

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = text.slice(-1)
    setOtp(newOtp)
    if (text && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle />

      <View style={styles.content}>
        <H3 style={styles.title}>{t('enter_code_title')}</H3>
        <Caption1 color="#888888" style={styles.subtitle}>
          {t('enter_code_subtitle')}
        </Caption1>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputs.current[index] = ref }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : styles.otpBoxEmpty]}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <CustomButton
          title={t('verify')}
          onPress={onVerified}
          height={64}
          width="100%"
          borderRadius={16}
          style={{ marginTop: 4 }}
        />

        <View style={styles.resendRow}>
          <Caption2 color="#555555">{t('not_received_otp')}</Caption2>
          <TouchableOpacity>
            <Caption2 color={Colors.BRAND_PRIMARY}>{t('resend_otp')}</Caption2>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
  content: { paddingTop: hp(30) },
  title: { fontWeight: '700', color: Colors.TEXT_COLOR, marginBottom: hp(10), lineHeight: 34 },
  subtitle: { marginBottom: hp(28) },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(28),
    gap: wp(8),
  },
  otpBox: {
    flex: 1, aspectRatio: 1,
    borderRadius: 12, borderWidth: 1.5,
    textAlign: 'center', fontSize: 20,
    fontFamily: 'Poppins_600SemiBold', color: '#1A1A1A',
  },
  otpBoxFilled: { borderColor: Colors.BRAND_PRIMARY, backgroundColor: `${Colors.BRAND_PRIMARY}0D` },
  otpBoxEmpty: { borderColor: Colors.CARD_BORDER, backgroundColor: '#FFFFFF' },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: hp(20) },
})