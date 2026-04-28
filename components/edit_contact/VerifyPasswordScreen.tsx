import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { H1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  onVerified: () => void
}

export function VerifyPasswordScreen({ onVerified }: Props) {
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle />

      <View style={styles.content}>
        <H1 style={styles.title}>To continue, first verify{'\n'}it's you</H1>

        <View style={styles.fieldBox}>
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <CustomButton
          title="Continue"
          onPress={onVerified}
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
  title: { fontWeight: '700', color: Colors.TEXT_COLOR, marginBottom: hp(24), lineHeight: 40 },
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