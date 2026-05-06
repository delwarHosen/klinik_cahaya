import { CustomButton } from '@/components/shared/CustomButton'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Caption2 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetProfileQuery, useUpdateInsuranceMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
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
  const { data } = useGetProfileQuery({})
  const [updateInsurance, { isLoading }] = useUpdateInsuranceMutation()

  const [providerName, setProviderName] = useState('')
  const [planType, setPlanType] = useState('')
  const [memberId, setMemberId] = useState('')
  const [coverageType, setCoverageType] = useState('')

  useEffect(() => {
    if (data?.steps?.insurance?.data) {
      const ins = data.steps.insurance.data
      setProviderName(ins.provider_name ?? '')
      setPlanType(ins.plan_type ?? '')
      setMemberId(ins.member_id ?? '')
      setCoverageType(ins.coverage_type ?? '')
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateInsurance({
        provider_name: providerName,
        plan_type: planType,
        member_id: memberId,
        coverage_type: coverageType,
      }).unwrap()
      showToast('Insurance updated successfully', 'success')
      router.back()
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update insurance', 'error')
    }
  }

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
          <Caption2 style={styles.label}>Provider Name</Caption2>
          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Provider Name"
              placeholderTextColor="#AAAAAA"
              value={providerName}
              onChangeText={setProviderName}
              style={styles.input}
            />
          </View>

          <Caption2 style={styles.label}>Plan Type</Caption2>
          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Plan Type"
              placeholderTextColor="#AAAAAA"
              value={planType}
              onChangeText={setPlanType}
              style={styles.input}
            />
          </View>

          <Caption2 style={styles.label}>Member ID</Caption2>
          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Member ID"
              placeholderTextColor="#AAAAAA"
              value={memberId}
              onChangeText={setMemberId}
              style={styles.input}
            />
          </View>

          <Caption2 style={styles.label}>Coverage Type</Caption2>
          <View style={styles.fieldBox}>
            <TextInput
              placeholder="Coverage Type"
              placeholderTextColor="#AAAAAA"
              value={coverageType}
              onChangeText={setCoverageType}
              style={styles.input}
            />
          </View>

          {isLoading ? (
            <View style={{ alignItems: 'center', marginTop: hp(20) }}>
              <CustomLoader size={50} strokeWidth={3} />
            </View>
          ) : (
            <CustomButton
              title="Save"
              onPress={handleSave}
              height={64}
              width={"100%"}
              borderRadius={16}
              style={{ marginTop: 10 }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: hp(40), paddingTop: hp(20) },
  label: { color: Colors.TEXT_COLOR, marginBottom: hp(6), marginTop: hp(14) },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  input: {
    fontSize: 15,
    color: '#000000',
    paddingVertical: hp(16),
    fontFamily: 'Poppins_400Regular',
  },
})