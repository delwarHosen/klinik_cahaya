import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body2, Body3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useUpdateMedicalMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// অ্যালার্জি অপশন: label অনুবাদের জন্য এবং value ব্যাকএন্ডে পাঠানোর জন্য
const ALLERGY_OPTIONS = [
  { label: 'food_allergies', value: 'Food Allergies' },
  { label: 'seasonal_allergies', value: 'Seasonal Allergies' },
  { label: 'animal_allergies', value: 'Animal Allergies' },
  { label: 'dust_allergies', value: 'Dust Allergies' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MedicalInformationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [updateMedical, { isLoading }] = useUpdateMedicalMutation();

  // States
  const [bloodGroup, setBloodGroup] = useState('');
  const [showBloodModal, setShowBloodModal] = useState(false);

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const [medicalCondition, setMedicalCondition] = useState('');
  const [medication, setMedication] = useState('');

  // হ্যান্ডলার
  const handleSkip = () => {
    router.push('/(auth)/insurance_information');
  };

  const toggleAllergy = (allergyValue: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyValue)
        ? prev.filter((a) => a !== allergyValue)
        : [...prev, allergyValue]
    );
  };

  const handleContinue = async () => {
    try {
      await updateMedical({
        blood_group: bloodGroup,
        allergies: selectedAllergies.map((name) => ({
          name,
          type: null,
          severity: null,
        })),
        medical_condition: medicalCondition ? [medicalCondition] : [],
        medication: medication ? [medication] : [],
      }).unwrap();

      showToast(t('medical_saved'), 'success');
      router.push('/(auth)/insurance_information');
    } catch (err: any) {
      console.log('Medical error:', JSON.stringify(err));
      showToast(
        err?.data?.detail?.msg || err?.data?.message || t('medical_save_failed'),
        'error'
      );
    }
  };

  // UI তে দেখানোর জন্য নির্বাচিত অ্যালার্জিগুলোর অনুবাদিত টেক্সট তৈরি
  const allergyDisplayText = selectedAllergies
    .map((val) => {
      const option = ALLERGY_OPTIONS.find((opt) => opt.value === val);
      return option ? t(option.label) : val;
    })
    .join(', ');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <LeftAngleIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip}>
            <Body3 color={Colors.PLACEHOLLDER_TEXT}>{t('skip')}</Body3>
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
                title={t('setup_profile')}
                description={t('medical_info')}
              />
            </View>

            {/* Blood Group Field */}
            {!showBloodModal ? (
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowBloodModal(true)}
                activeOpacity={0.7}
              >
                <Body3
                  color={bloodGroup ? Colors.TEXT_COLOR : '#8C88A3'}
                  style={{ flex: 1 }}
                >
                  {bloodGroup || t('blood_group')}
                </Body3>
                <DownArrowIcon />
              </TouchableOpacity>
            ) : (
              <View style={styles.expandedContainer}>
                <View style={styles.expandedHeader}>
                  <Body2 color={Colors.TEXT_COLOR}>{t('select_blood_group')}</Body2>
                  <TouchableOpacity onPress={() => setShowBloodModal(false)}>
                    <UpArrowIcon />
                  </TouchableOpacity>
                </View>
                <View style={styles.bloodGrid}>
                  {BLOOD_GROUPS.map((group) => (
                    <TouchableOpacity
                      key={group}
                      style={[
                        styles.bloodOption,
                        bloodGroup === group && styles.optionSelected,
                      ]}
                      onPress={() => {
                        setBloodGroup(group);
                        setShowBloodModal(false);
                      }}
                    >
                      <Body3
                        color={
                          bloodGroup === group
                            ? Colors.BRAND_PRIMARY
                            : Colors.TEXT_COLOR
                        }
                      >
                        {group}
                      </Body3>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Allergies Field */}
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
                  {allergyDisplayText || t('allergies')}
                </Body3>
                <DownArrowIcon />
              </TouchableOpacity>
            ) : (
              <View style={styles.expandedContainer}>
                <View style={styles.expandedHeader}>
                  <Body2 color={Colors.TEXT_COLOR}>{t('choose_allergies')}</Body2>
                  <TouchableOpacity onPress={() => setShowAllergyModal(false)}>
                    <UpArrowIcon />
                  </TouchableOpacity>
                </View>
                {ALLERGY_OPTIONS.map((allergy) => {
                  const selected = selectedAllergies.includes(allergy.value);
                  return (
                    <TouchableOpacity
                      key={allergy.value}
                      style={styles.listOption}
                      onPress={() => toggleAllergy(allergy.value)}
                    >
                      <Body3 color={Colors.TEXT_COLOR}>{t(allergy.label)}</Body3>
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.checkboxSelected,
                        ]}
                      >
                        {selected && (
                          <Body3
                            color={Colors.BRAND_PRIMARY}
                            style={{ fontSize: 12 }}
                          >
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
              placeholder={t('medical_condition')}
            />

            {/* Medication */}
            <FormInput
              value={medication}
              onChangeText={setMedication}
              placeholder={t('medication')}
            />

            {/* Button Section */}
            {isLoading ? (
              <View style={{ alignItems: 'center', marginTop: hp(12) }}>
                <CustomLoader size={50} strokeWidth={3} />
              </View>
            ) : (
              <CustomButton
                title={t('continue')}
                onPress={handleContinue}
                width="100%"
                height={hp(70)}
                borderRadius={16}
                style={{ marginTop: hp(12) }}
              />
            )}
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
  expandedContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    backgroundColor: '#fff',
    marginBottom: hp(12),
    gap: hp(8),
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(10),
  },
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(10),
  },
  bloodOption: {
    width: wp(65),
    height: hp(45),
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
  },
  optionSelected: {
    borderColor: Colors.BRAND_PRIMARY,
    backgroundColor: '#E8F4FD',
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