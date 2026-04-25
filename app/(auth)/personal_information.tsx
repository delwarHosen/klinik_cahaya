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
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function PersonalInformationScreen() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);

  const handleContinue = () => {
    router.push('/(auth)/medical_information');
  };

  const handleSkip = () => {
    router.push('/(auth)/medical_information');
  };

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
                title="Set-up your Profile"
                description="Personal Information"
              />
            </View>

            {/* Gender Dropdown trigger */}
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowGenderModal(true)}
              activeOpacity={0.7}
            >
              <Body3 color={gender ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                {gender || 'Gender'}
              </Body3>
              <DownArrowIcon />
            </TouchableOpacity>

            {/* Date Of Birth */}
            <FormInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="Date Of Birth"
            />

            {/* Address */}
            <FormInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
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

      {/* Gender Modal — bottom sheet, keyboard aware */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>

          {/* Backdrop: zIndex 1 — click করলে modal বন্ধ */}
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            onPress={() => setShowGenderModal(false)}
            activeOpacity={1}
          />

          {/* Sheet: zIndex 2 — keyboard এর সাথে উঠবে */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', zIndex: 2 }}
          >
            <View style={styles.genderSheet}>
              {/* Handle */}
              <View style={styles.sheetHandle} />

              {/* Header */}
              <View style={styles.genderModalHeader}>
                <Body2 color={Colors.TEXT_COLOR}>Choose Gender</Body2>
                <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                  <UpArrowIcon />
                </TouchableOpacity>
              </View>

              {/* Options */}
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    gender === option && styles.genderOptionSelected,
                  ]}
                  onPress={() => {
                    setGender(option);
                    setShowGenderModal(false);
                  }}
                >
                  <Body3 color={Colors.TEXT_COLOR}>{option}</Body3>
                  {gender === option ? (
                    <View style={styles.checkboxSelected}>
                      <Body3 color={Colors.BRAND_PRIMARY} style={{ fontSize: 12 }}>✓</Body3>
                    </View>
                  ) : (
                    <View style={styles.checkboxEmpty} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </KeyboardAvoidingView>

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
    paddingTop: hp(35),
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  genderSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: Platform.OS === 'ios' ? hp(40) : hp(30),
    gap: hp(8),
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: hp(12),
  },
  genderModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(8),
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
  },
  genderOptionSelected: {
    backgroundColor: '#F0F8FF',
  },
  checkboxSelected: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.BRAND_PRIMARY,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEmpty: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});