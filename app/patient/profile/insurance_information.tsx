import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function InsuranceInformationScreen() {
  const router = useRouter()
  const [providerName, setProviderName] = useState('')
  const [planType, setPlanType] = useState('')
  const [memberId, setMemberId] = useState('')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Insurance Information" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Provider Name"
              placeholderTextColor="#AAAAAA"
              value={providerName}
              onChangeText={setProviderName}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Plan Type"
              placeholderTextColor="#AAAAAA"
              value={planType}
              onChangeText={setPlanType}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Member ID"
              placeholderTextColor="#AAAAAA"
              value={memberId}
              onChangeText={setMemberId}
              style={styles.input}
            />
          </View>

          <CustomButton
            title="Save"
            onPress={() => router.back()}
            height={64}
            width={"100%"}
            borderRadius={16}
            style={{ marginTop: 10 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: hp(40), paddingTop: hp(20) },

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
    color: '#000000',
    paddingVertical: hp(16),
    fontFamily: 'Poppins_400Regular',
  },
})