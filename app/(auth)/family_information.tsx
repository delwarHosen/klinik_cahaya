import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { CalenderIcon } from '@/assets/icons/patient_icon/CalenderIcon';
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { Body2, Body3, Caption1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ১. ইম্পোর্ট
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// অপশনগুলো অনুবাদ করার জন্য কী (Key) ব্যবহার করা হয়েছে
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
  name: string;
  type: string | null;
  severity: string | null;
}

interface FamilyMember {
  id: string;
  memberName: string;
  icNumber: string;
  icError: string;
  dateOfBirth: string;
  relationship: string;
  gender: string;
  allergies: Allergy[];
}

const EMPTY_MEMBER = (): FamilyMember => ({
  id: Date.now().toString() + Math.random().toString(),
  memberName: '',
  icNumber: '',
  icError: '',
  dateOfBirth: '',
  relationship: '',
  gender: '',
  allergies: [],
});

function isUnder18(dob: string): boolean {
  if (!dob) return false;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18;
}

export default function FamilyInformationScreen() {
  const router = useRouter();
  const { t } = useTranslation(); // ২. হুক কল

  const [members, setMembers] = useState<FamilyMember[]>([EMPTY_MEMBER()]);
  const [activeDatePickerId, setActiveDatePickerId] = useState<string | null>(null);
  const [activeGenderModalId, setActiveGenderModalId] = useState<string | null>(null);
  const [activeAllergyModalId, setActiveAllergyModalId] = useState<string | null>(null);

  const handleSkip = () => router.push('/(auth)/upload_photo');

  const handleChange = (id: string, field: keyof Omit<FamilyMember, 'id'>, value: any) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleIcChange = (id: string, val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const error = digits.length > 0 && digits.length < 12 ? t('ic_error') : '';
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, icNumber: digits, icError: error } : m))
    );
  };

  const handleDateChange = (id: string, _: any, selected?: Date) => {
    setActiveDatePickerId(null);
    if (selected) {
      handleChange(id, 'dateOfBirth', selected.toISOString().split('T')[0]);
    }
  };

  const toggleAllergy = (id: string, allergyName: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const exists = m.allergies.find((a) => a.name === allergyName);
        const updated = exists
          ? m.allergies.filter((a) => a.name !== allergyName)
          : [...m.allergies, { name: allergyName, type: null, severity: null }];
        return { ...m, allergies: updated };
      })
    );
  };

  const handleAddMember = () => {
    if (members.length >= 9) {
      showToast(t('max_member_error'), 'error');
      return;
    }
    setMembers((prev) => [...prev, EMPTY_MEMBER()]);
  };

  const handleContinue = () => {
    const invalidIc = members.find((m) => m.icNumber.length > 0 && m.icNumber.length !== 12);
    if (invalidIc) {
      showToast(t('ic_error'), 'error');
      setMembers((prev) =>
        prev.map((m) =>
          m.icNumber.length > 0 && m.icNumber.length !== 12
            ? { ...m, icError: t('ic_error') }
            : m
        )
      );
      return;
    }

    const filledMembers = members.filter((m) => m.memberName.trim() !== '');
    if (filledMembers.length === 0) {
      showToast(t('at_least_one_error'), 'error');
      return;
    }

    router.push({
      pathname: '/(auth)/get_family_info',
      params: {
        members: JSON.stringify(
          filledMembers.map((m) => ({
            member_name: m.memberName,
            ic_number: m.icNumber,
            date_of_birth: m.dateOfBirth,
            relationship: m.relationship,
            gender: m.gender,
            allergies: m.allergies,
          }))
        ),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
            <View style={styles.titleBlock}>
              <AuthHeading title={t('setup_profile')} description={t('family_info')} />
            </View>

            {members.map((member, index) => (
              <View key={member.id} style={styles.memberBlock}>
                {members.length > 1 && (
                  <View style={styles.memberHeader}>
                    <Body2 color={Colors.TEXT_COLOR}>{t('member')} {index + 1}</Body2>
                    <TouchableOpacity
                      onPress={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
                    >
                      <Caption1 color="#E24B4A">{t('remove')}</Caption1>
                    </TouchableOpacity>
                  </View>
                )}

                <FormInput
                  value={member.memberName}
                  onChangeText={(t) => handleChange(member.id, 'memberName', t)}
                  placeholder={t('member_name')}
                />

                <View style={styles.icWrapper}>
                  <View style={[styles.icBox, !!member.icError && styles.icBoxError]}>
                    <TextInput
                      value={member.icNumber}
                      onChangeText={(t) => handleIcChange(member.id, t)}
                      placeholder={t('ic_placeholder')}
                      placeholderTextColor={Colors.PLACEHOLLDER_TEXT ?? '#8C88A3'}
                      keyboardType="numeric"
                      maxLength={12}
                      style={styles.icInput}
                    />
                  </View>
                  {!!member.icError && <Text style={styles.errorText}>{member.icError}</Text>}
                </View>

                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setActiveDatePickerId(member.id)}
                  activeOpacity={0.7}
                >
                  <Body3 color={member.dateOfBirth ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                    {member.dateOfBirth
                      ? `${member.dateOfBirth}${isUnder18(member.dateOfBirth) ? ` (${t('children')})` : ''}`
                      : t('dob')}
                  </Body3>
                  <CalenderIcon />
                </TouchableOpacity>

                {activeDatePickerId === member.id && (
                  <DateTimePicker
                    value={member.dateOfBirth ? new Date(member.dateOfBirth) : new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(e, d) => handleDateChange(member.id, e, d)}
                  />
                )}

                <FormInput
                  value={member.relationship}
                  onChangeText={(t) => handleChange(member.id, 'relationship', t)}
                  placeholder={t('relationship')}
                />

                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setActiveGenderModalId(member.id)}
                  activeOpacity={0.7}
                >
                  <Body3 color={member.gender ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                    {member.gender ? t(GENDER_OPTIONS.find(opt => opt.value === member.gender)?.label || '') : t('gender')}
                  </Body3>
                  <DownArrowIcon />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setActiveAllergyModalId(member.id)}
                  activeOpacity={0.7}
                >
                  <Body3
                    color={member.allergies.length > 0 ? Colors.TEXT_COLOR : '#8C88A3'}
                    style={{ flex: 1 }}
                    numberOfLines={1}
                  >
                    {member.allergies.length > 0
                      ? member.allergies.map((a) => t(ALLERGY_OPTIONS.find(opt => opt.value === a.name)?.label || a.name)).join(', ')
                      : t('allergies')}
                  </Body3>
                  <DownArrowIcon />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.plusRow}>
              <TouchableOpacity
                style={[styles.plusButton, members.length >= 9 && { opacity: 0.4 }]}
                onPress={handleAddMember}
                disabled={members.length >= 9}
              >
                <PlusButtonIcon />
              </TouchableOpacity>
            </View>

            <CustomButton
              title={t('continue')}
              onPress={handleContinue}
              width="100%"
              height={hp(70)}
              borderRadius={16}
              style={{ marginTop: hp(12) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal visible={!!activeGenderModalId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setActiveGenderModalId(null)} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Body2 color={Colors.TEXT_COLOR}>{t('choose_gender')}</Body2>
              <TouchableOpacity onPress={() => setActiveGenderModalId(null)}><UpArrowIcon /></TouchableOpacity>
            </View>
            {GENDER_OPTIONS.map((option) => {
              const member = members.find((m) => m.id === activeGenderModalId);
              const selected = member?.gender === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.modalOption, selected && styles.modalOptionSelected]}
                  onPress={() => {
                    handleChange(activeGenderModalId!, 'gender', option.value);
                    setActiveGenderModalId(null);
                  }}
                >
                  <Body3 color={Colors.TEXT_COLOR}>{t(option.label)}</Body3>
                  <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && <Body3 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>✓</Body3>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Allergy Modal */}
      <Modal visible={!!activeAllergyModalId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setActiveAllergyModalId(null)} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Body2 color={Colors.TEXT_COLOR}>{t('choose_allergies')}</Body2>
              <TouchableOpacity onPress={() => setActiveAllergyModalId(null)}><UpArrowIcon /></TouchableOpacity>
            </View>
            {ALLERGY_OPTIONS.map((option) => {
              const member = members.find((m) => m.id === activeAllergyModalId);
              const selected = !!member?.allergies.find((a) => a.name === option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.modalOption, selected && styles.modalOptionSelected]}
                  onPress={() => toggleAllergy(activeAllergyModalId!, option.value)}
                >
                  <Body3 color={Colors.TEXT_COLOR}>{t(option.label)}</Body3>
                  <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && <Body3 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>✓</Body3>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
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

  memberBlock: {
    marginBottom: hp(16),
  },

  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(8),
    paddingHorizontal: wp(4),
  },

  icWrapper: {
    marginBottom: hp(12),
  },

  icBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    paddingHorizontal: wp(16),
    backgroundColor: 'transparent',
  },

  icBoxError: {
    borderColor: '#F04438',
  },

  icInput: {
    fontSize: 14,
    color: Colors.TEXT_COLOR,
    paddingVertical: hp(24),
    fontFamily: 'Poppins_400Regular',
  },

  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: '#F04438',
    fontFamily: 'Poppins_400Regular',
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

  plusRow: {
    alignItems: 'flex-end',
    marginBottom: hp(8),
    marginTop: hp(4),
  },

  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: Platform.OS === 'ios' ? hp(40) : hp(30),
    gap: hp(8),
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