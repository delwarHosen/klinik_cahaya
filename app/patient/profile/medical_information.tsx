import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body2, Body3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetProfileQuery, useUpdateMedicalPatchMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALLERGY_OPTIONS = [
  'Food Allergies',
  'Seasonal Allergies',
  'Animal Allergies',
  'Dust Allergies',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MedicalInformationScreen() {
  const router = useRouter();
  const { data, isLoading: profileLoading } = useGetProfileQuery({});
  const [updateMedical, { isLoading }] = useUpdateMedicalPatchMutation();

  const [bloodGroup, setBloodGroup] = useState('');
  const [showBloodModal, setShowBloodModal] = useState(false);

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const [medicalCondition, setMedicalCondition] = useState('');
  const [medication, setMedication] = useState('');

  // Pre-fill existing data from profile
  useEffect(() => {
    const medicalData = data?.steps?.medical?.data;
    if (!medicalData) return;

    if (medicalData.blood_group) setBloodGroup(medicalData.blood_group);

    if (medicalData.allergies?.length) {
      const matched = medicalData.allergies
        .map((a: any) => a.name)
        .filter((name: string) => ALLERGY_OPTIONS.includes(name));
      setSelectedAllergies(matched);
    }

    if (medicalData.medical_condition?.length) {
      setMedicalCondition(medicalData.medical_condition.join(', '));
    }

    if (medicalData.medication?.length) {
      setMedication(medicalData.medication.join(', '));
    }
  }, [data]);

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSave = async () => {
    try {
      await updateMedical({
        blood_group: bloodGroup || null,
        allergies: selectedAllergies.length > 0
          ? selectedAllergies.map(name => ({ name, type: null, severity: null }))
          : null,
        medical_condition: medicalCondition
          ? medicalCondition.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        medication: medication
          ? medication.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      }).unwrap();

      showToast('Medical information updated!', 'success');
      router.back();
    } catch (err: any) {
      showToast(err?.data?.detail?.msg || err?.data?.message || 'Failed to update medical info.', 'error');
    }
  };

  const allergyDisplayText =
    selectedAllergies.length > 0 ? selectedAllergies.join(', ') : '';

  if (profileLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <CustomLoader size={60} strokeWidth={2} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <SectionTitle title="Medical Information" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* ── Blood Group Field ── */}
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
                  {bloodGroup || 'Blood Group'}
                </Body3>
                <DownArrowIcon />
              </TouchableOpacity>
            ) : (
              <View style={styles.expandedContainer}>
                <View style={styles.expandedHeader}>
                  <Body2 color={Colors.TEXT_COLOR}>Select Blood Group</Body2>
                  <TouchableOpacity onPress={() => setShowBloodModal(false)}>
                    <UpArrowIcon />
                  </TouchableOpacity>
                </View>
                <View style={styles.bloodGrid}>
                  {BLOOD_GROUPS.map(group => (
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
                      <Body3 color={bloodGroup === group ? Colors.BRAND_PRIMARY : Colors.TEXT_COLOR}>
                        {group}
                      </Body3>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── Allergies Field ── */}
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
                <DownArrowIcon />
              </TouchableOpacity>
            ) : (
              <View style={styles.expandedContainer}>
                <View style={styles.expandedHeader}>
                  <Body2 color={Colors.TEXT_COLOR}>Choose Allergies</Body2>
                  <TouchableOpacity onPress={() => setShowAllergyModal(false)}>
                    <UpArrowIcon />
                  </TouchableOpacity>
                </View>
                {ALLERGY_OPTIONS.map(allergy => {
                  const selected = selectedAllergies.includes(allergy);
                  return (
                    <TouchableOpacity
                      key={allergy}
                      style={styles.listOption}
                      onPress={() => toggleAllergy(allergy)}
                    >
                      <Body3 color={Colors.TEXT_COLOR}>{allergy}</Body3>
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                        {selected && (
                          <Body3 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>✓</Body3>
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

            {isLoading ? (
              <View style={{ alignItems: 'center', marginTop: hp(12) }}>
                <CustomLoader size={50} strokeWidth={3} />
              </View>
            ) : (
              <CustomButton
                title="Save Changes"
                onPress={handleSave}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(20),
    paddingBottom: hp(40),
  },
  container: {
    flex: 1,
    paddingTop: hp(20),
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