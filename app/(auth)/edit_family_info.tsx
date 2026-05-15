import { CalenderIcon } from '@/assets/icons/patient_icon/CalenderIcon'
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon'
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon'
import { AuthHeading } from '@/components/auth/AuthHeading'
import { FormInput } from '@/components/inputForm/inputForm'
import { CustomButton } from '@/components/shared/CustomButton'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Body2, Body3, Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useUpdateFamilyPatchMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'; // ১. ইম্পোর্ট
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// অনুবাদ কী (Key) সহ অপশন
const GENDER_OPTIONS = [
  { label: 'male', value: 'Male' },
  { label: 'female', value: 'Female' },
  { label: 'other', value: 'Other' },
];

const ALLERGY_OPTIONS = [
  { label: 'food_allergies', value: 'Food Allergies' },
  { label: 'seasonal_allergies', value: 'Seasonal Allergies' },
  { label: 'animal_allergies', value: 'Animal Allergies' },
  { label: 'dust_allergies', value: 'Dust Allergies' },
];

interface Allergy {
  name: string
  type: string | null
  severity: string | null
}

export default function EditFamilyInfoScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { t } = useTranslation() // ২. হুক কল
  const [updateFamilyPatch, { isLoading }] = useUpdateFamilyPatchMutation()

  const [memberName, setMemberName] = useState((params.member_name as string) ?? '')
  const [icNumber, setIcNumber] = useState((params.ic_number as string) ?? '')
  const [dateOfBirth, setDateOfBirth] = useState((params.date_of_birth as string) ?? '')
  const [relationship, setRelationship] = useState((params.relationship as string) ?? '')
  const [gender, setGender] = useState((params.gender as string) ?? '')
  
  const [allergies, setAllergies] = useState<Allergy[]>(() => {
    try {
      return params.allergies ? JSON.parse(params.allergies as string) : []
    } catch { return [] }
  })

  const allMembers: any[] = (() => {
    try {
      return params.all_members ? JSON.parse(params.all_members as string) : []
    } catch { return [] }
  })()
  const memberIndex = parseInt((params.index as string) ?? '0')

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [genderModalOpen, setGenderModalOpen] = useState(false)
  const [allergyModalOpen, setAllergyModalOpen] = useState(false)

  const handleDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false)
    if (selected) {
      setDateOfBirth(selected.toISOString().split('T')[0])
    }
  }

  const toggleAllergy = (name: string) => {
    const exists = allergies.find((a) => a.name === name)
    if (exists) {
      setAllergies((prev) => prev.filter((a) => a.name !== name))
    } else {
      setAllergies((prev) => [...prev, { name, type: null, severity: null }])
    }
  }

  const handleUpdate = async () => {
    const updatedMembers = allMembers.map((m: any, i: number) =>
      i === memberIndex
        ? { member_name: memberName, ic_number: icNumber, date_of_birth: dateOfBirth, relationship, gender, allergies }
        : m
    )

    try {
      await updateFamilyPatch({ family_members: updatedMembers }).unwrap()
      showToast(t('update_success'), 'success')

      router.replace({
        pathname: '/(auth)/get_family_info',
        params: {
          members: JSON.stringify(updatedMembers),
        },
      })
    } catch (err: any) {
      console.log('Update error:', JSON.stringify(err))
      showToast(err?.data?.detail?.msg || err?.data?.message || t('update_failed'), 'error')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthHeading 
            title={t('edit_member')} 
            style={{ marginBottom: hp(30) }} 
            description={t('family_info')} 
          />

          <FormInput value={memberName} onChangeText={setMemberName} placeholder={t('member_name')} />
          <FormInput value={icNumber} onChangeText={setIcNumber} placeholder={t('ic_placeholder')} type="number" />

          {/* Date of Birth */}
          <TouchableOpacity style={styles.dropdownBox} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <Body3 color={dateOfBirth ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
              {dateOfBirth || t('dob')}
            </Body3>
            <CalenderIcon />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <FormInput value={relationship} onChangeText={setRelationship} placeholder={t('relationship')} />

          {/* Gender */}
          <TouchableOpacity style={styles.dropdownBox} onPress={() => setGenderModalOpen(true)} activeOpacity={0.7}>
            <Body3 color={gender ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
              {gender ? t(GENDER_OPTIONS.find(opt => opt.value === gender)?.label || '') : t('gender')}
            </Body3>
            <DownArrowIcon />
          </TouchableOpacity>

          {/* Allergies */}
          <TouchableOpacity style={styles.dropdownBox} onPress={() => setAllergyModalOpen(true)} activeOpacity={0.7}>
            <Body3 color={allergies.length > 0 ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }} numberOfLines={1}>
              {allergies.length > 0 
                ? allergies.map((a) => t(ALLERGY_OPTIONS.find(opt => opt.value === a.name)?.label || a.name)).join(', ') 
                : t('allergies')}
            </Body3>
            <DownArrowIcon />
          </TouchableOpacity>

          <View style={styles.bottomBar}>
            {isLoading ? (
              <View style={{ alignItems: 'center', marginTop: hp(8) }}>
                <CustomLoader size={50} strokeWidth={3} />
              </View>
            ) : (
              <CustomButton title={t('update')} onPress={handleUpdate} height={hp(70)} width="100%" borderRadius={16} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal visible={genderModalOpen} transparent animationType="fade" onRequestClose={() => setGenderModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setGenderModalOpen(false)} activeOpacity={1} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Body2 color={Colors.TEXT_COLOR}>{t('choose_gender')}</Body2>
              <TouchableOpacity onPress={() => setGenderModalOpen(false)}>
                <UpArrowIcon />
              </TouchableOpacity>
            </View>
            {GENDER_OPTIONS.map((option) => {
              const selected = gender === option.value
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.modalOption, selected && styles.modalOptionSelected]}
                  onPress={() => { setGender(option.value); setGenderModalOpen(false) }}
                >
                  <Body3 color={Colors.TEXT_COLOR}>{t(option.label)}</Body3>
                  <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && <Caption1 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>✓</Caption1>}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </Modal>

      {/* Allergy Modal */}
      <Modal visible={allergyModalOpen} transparent animationType="fade" onRequestClose={() => setAllergyModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setAllergyModalOpen(false)} activeOpacity={1} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Body2 color={Colors.TEXT_COLOR}>{t('choose_allergies')}</Body2>
              <TouchableOpacity onPress={() => setAllergyModalOpen(false)}>
                <UpArrowIcon />
              </TouchableOpacity>
            </View>
            {ALLERGY_OPTIONS.map((option) => {
              const selected = !!allergies.find((a) => a.name === option.value)
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.modalOption, selected && styles.modalOptionSelected]}
                  onPress={() => toggleAllergy(option.value)}
                >
                  <Body3 color={Colors.TEXT_COLOR}>{t(option.label)}</Body3>
                  <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && <Caption1 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>✓</Caption1>}
                  </View>
                </TouchableOpacity>
              )
            })}
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
    paddingTop: hp(20),
    paddingBottom: hp(20),
  },

  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(24),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    marginBottom: hp(12),
  },

  bottomBar: {
    paddingTop: hp(12),
    paddingBottom: hp(20),
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },

  modalContainer: {
    width: '100%',
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: Platform.OS === 'ios' ? hp(40) : hp(30),
    gap: hp(8),
    elevation: 5,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(16),
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
  },

  modalOptionSelected: {
    backgroundColor: '#F0F8FF',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxSelected: {
    borderColor: Colors.BRAND_PRIMARY,
    backgroundColor: '#E8F4FD',
  },
});