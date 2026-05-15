import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import { H3 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  onContinue: () => void
}

export function ContactChangedSuccessScreen({ onContinue }: Props) {
  const { t } = useTranslation() 

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <SuccessVerifyIcon />
        
        
        <H3 style={styles.title}>
          {t('contact_success_titles')}
        </H3>
        
        <CustomButton
          title={t('continue')}
          onPress={onContinue}
          height={64}
          width="100%"
          borderRadius={16}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(20),
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 30,
  },
})