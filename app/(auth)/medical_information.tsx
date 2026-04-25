import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body2, Body3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALLERGY_OPTIONS = [
  'Food Allergies',
  'Seasonal Allergies',
  'Animal Allergies',
  'Dust Allergies',
];

export default function MedicalInformationScreen() {
  const router = useRouter();
  const [bloodGroup, setBloodGroup] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [medicalCondition, setMedicalCondition] = useState('');
  const [medication, setMedication] = useState('');
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const handleContinue = () => {
    router.push('/(auth)/insurance_information');
  };

  const handleSkip = () => {
    router.push('/(auth)/insurance_information');
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const allergyDisplayText =
    selectedAllergies.length > 0 ? selectedAllergies.join(', ') : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <LeftAngleIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip}>
            <Body3 color={Colors.PLACEHOLLDER_TEXT}>Skip</Body3>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Title */}
            <View style={styles.titleBlock}>
              <AuthHeading
                title='Set-up your Profile'
                description="Medical Information"
              />
            </View>

            {/* Blood Group */}
            <FormInput
              value={bloodGroup}
              onChangeText={setBloodGroup}
              placeholder="Blood Group"
            />

            {/* Allergies - shows expanded list inline when open, or dropdown trigger */}
            {!showAllergyModal ? (
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowAllergyModal(true)}
                activeOpacity={0.7}
              >
                <Body3
                  color={allergyDisplayText ? Colors.TEXT_COLOR : '#8C88A3'}
                  style={{ flex: 1 }}
                  numberOfLines={1}
                >
                  {allergyDisplayText || 'Allergies'}
                </Body3>
                <Body3 color="#8C88A3">
                  <DownArrowIcon/>
                </Body3>
              </TouchableOpacity>
            ) : (
              <View style={styles.allergyExpandedContainer}>
                <View style={styles.allergyExpandedHeader}>
                  <Body2 color={Colors.TEXT_COLOR}>Choose Allergies</Body2>
                  <TouchableOpacity onPress={() => setShowAllergyModal(false)}>
                    <Body3 color="#8C88A3">
                      <UpArrowIcon/>
                    </Body3>
                  </TouchableOpacity>
                </View>
                {ALLERGY_OPTIONS.map((allergy) => {
                  const selected = selectedAllergies.includes(allergy);
                  return (
                    <TouchableOpacity
                      key={allergy}
                      style={styles.allergyOption}
                      onPress={() => toggleAllergy(allergy)}
                    >
                      <Body3 color={Colors.TEXT_COLOR}>{allergy}</Body3>
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.checkboxSelected,
                        ]}
                      >
                        {selected && (
                          <Body3 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>
                            ✓
                          </Body3>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Medical Condition */}
            <FormInput
              value={medicalCondition}
              onChangeText={setMedicalCondition}
              placeholder="Medical Condition"
            />

            {/* Medication */}
            <FormInput
              value={medication}
              onChangeText={setMedication}
              placeholder="Medication"
            />

            <CustomButton
              title="Continue"
              onPress={handleContinue}
              width="100%"
              height={hp(70)}
              borderRadius={16}
              style={{ marginTop: hp(12) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(5),
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(20),
    paddingBottom: hp(40),
  },
  container: {
    flex: 1,
    paddingTop: hp(30),
  },
  titleBlock: {
    marginBottom: hp(30),
  },
  subtitle: {
    marginTop: hp(4),
    fontStyle: 'italic',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    paddingHorizontal: wp(16),
    paddingVertical: hp(24),
    backgroundColor: 'transparent',
    marginBottom: hp(12),
  },
  allergyExpandedContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    backgroundColor: '#fff',
    marginBottom: hp(12),
    gap: hp(8),
  },
  allergyExpandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(4),
  },
  allergyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
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