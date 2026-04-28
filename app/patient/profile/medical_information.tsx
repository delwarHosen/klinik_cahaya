import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon'
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ALLERGY_OPTIONS = [
  'Insect Sting Allergies',
  'Seasonal Allergies',
  'Food Allergies',
  'Pet Allergies',
  'Drug Allergies',
]

const CONDITION_OPTIONS = [
  'Hyper Tension',
  'Asthma',
  'Diabetes',
  'Heart Disease',
  'Arthritis',
]

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function MedicalInformationScreen() {
  const [bloodGroup, setBloodGroup] = useState('A+')
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    'Insect Sting Allergies',
    'Seasonal Allergies',
  ])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'Hyper Tension',
    'Asthma',
  ])
  const [showBloodDropdown, setShowBloodDropdown] = useState(false)
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false)
  const router = useRouter();

  const toggleAllergy = (item: string) => {
    setSelectedAllergies(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    )
  }

  const toggleCondition = (item: string) => {
    setSelectedConditions(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Medical Information" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Blood Group */}
        <Caption2 style={styles.label}>Blood Group</Caption2>
        <TouchableOpacity
          style={styles.fieldBox}
          activeOpacity={0.8}
          onPress={() => setShowBloodDropdown(!showBloodDropdown)}
        >
          <H6 color={Colors.TEXT_COLOR}>{bloodGroup}</H6>
          <H6>{showBloodDropdown ? <UpArrowIcon /> : <DownArrowIcon />}</H6>
        </TouchableOpacity>
        {showBloodDropdown && (
          <View style={styles.dropdown}>
            {BLOOD_GROUPS.map(bg => (
              <TouchableOpacity
                key={bg}
                style={[styles.dropdownItem, bloodGroup === bg && styles.dropdownItemSelected]}
                onPress={() => { setBloodGroup(bg); setShowBloodDropdown(false) }}
              >
                <Caption2 color={bloodGroup === bg ? Colors.BRAND_PRIMARY : '#333333'}>{bg}</Caption2>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Allergies */}
        <Caption2 style={styles.label}>Allergies</Caption2>
        <TouchableOpacity
          style={styles.fieldBox}
          activeOpacity={0.8}
          onPress={() => setShowAllergyDropdown(!showAllergyDropdown)}
        >
          <View style={styles.tagsRow}>
            {selectedAllergies.map(a => (
              <View key={a} style={styles.tag}>
                <Caption2 color={Colors.TEXT_COLOR}>{a}</Caption2>
              </View>
            ))}
          </View>
          <H6>{showAllergyDropdown ? <UpArrowIcon /> : <DownArrowIcon />}</H6>
        </TouchableOpacity>
        {showAllergyDropdown && (
          <View style={styles.dropdown}>
            {ALLERGY_OPTIONS.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.dropdownItem, selectedAllergies.includes(item) && styles.dropdownItemSelected]}
                onPress={() => toggleAllergy(item)}
              >
                <Caption2 color={selectedAllergies.includes(item) ? Colors.BRAND_PRIMARY : ''}>
                  {item}
                </Caption2>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Medical Conditions */}
        <Caption2 style={styles.label}>Medical Conditions</Caption2>
        <View style={styles.fieldBox}>
          <View style={styles.tagsRow}>
            {selectedConditions.map(c => (
              <TouchableOpacity
                key={c}
                style={styles.tag}
                onPress={() => toggleCondition(c)}
              >
                <Caption2 color="#444444">{c}</Caption2>
              </TouchableOpacity>
            ))}
            {CONDITION_OPTIONS.filter(o => !selectedConditions.includes(o)).map(o => (
              <TouchableOpacity
                key={o}
                style={[styles.tag, styles.tagInactive]}
                onPress={() => toggleCondition(o)}
              >
                <Caption2 color="#AAAAAA">{o}</Caption2>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}

        <CustomButton
          title='Save'
          onPress={() => router.back()}
          height={64}
          width={"100%"}
          borderRadius={16}
          style={{ marginTop: 10 }}
        />

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20)
  },
  scrollContent: { paddingBottom: hp(40) },

  label: {
    color: Colors.TEXT_COLOR,
    marginBottom: hp(6),
    marginTop: hp(16)
  },

  fieldBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(20),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    flexWrap: 'wrap',
    gap: 6,
  },
  tagsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    paddingHorizontal: wp(12),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  tagInactive: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  dropdownItem: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: { backgroundColor: `${Colors.BRAND_PRIMARY}15` },


})