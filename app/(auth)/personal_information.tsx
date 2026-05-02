import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { CalenderIcon } from '@/assets/icons/patient_icon/CalenderIcon';
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body2, Body3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useUpdateProfileMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const GENDER_OPTIONS = ['male', 'female', 'other'];

export default function PersonalInformationScreen() {
  const router = useRouter();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      const formatted = selected.toISOString().split('T')[0]; 
      setDateOfBirth(formatted);
    }
  };

  const handleContinue = async () => {
    try {
      await updateProfile({
        gender,
        date_of_birth: dateOfBirth,
        address,
        phone: phone || null,
      }).unwrap();

      showToast('Profile saved!', 'success');
      router.push('/(auth)/medical_information');
      console.log("hello")
    } catch (err: any) {

      console.log('update error error:', JSON.stringify(err));

      showToast(err?.data?.message || 'Failed to save profile.', 'error');
    }
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
            <View style={styles.titleBlock}>
              <AuthHeading title="Set-up your Profile" description="Personal Information" />
            </View>

            {/* Gender */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowGenderModal(true)}
              activeOpacity={0.7}
            >
              <Body3 color={gender ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Gender'}
              </Body3>
              <DownArrowIcon />
            </TouchableOpacity>

            {/* Date of Birth */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Body3 color={dateOfBirth ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                {dateOfBirth || 'Date Of Birth'}
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

            <FormInput value={address} onChangeText={setAddress} placeholder="Address" />
            <FormInput value={phone} onChangeText={setPhone} placeholder="Phone (optional)" type="number" />

            {isLoading ? (
              <View style={{ alignItems: 'center', marginTop: hp(8) }}>
                <CustomLoader size={50} strokeWidth={3} />
              </View>
            ) : (
              <CustomButton
                title="Continue"
                // onPress={handleContinue}
                onPress={()=>router.push('/(auth)/medical_information')}
                width="100%"
                height={hp(70)}
                borderRadius={16}
                style={{ marginTop: hp(12) }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent animationType="fade" onRequestClose={() => setShowGenderModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => setShowGenderModal(false)}
            activeOpacity={1}
          />
          <View style={styles.genderModalContainer}>
            <View style={styles.genderModalHeader}>
              <Body2 color={Colors.TEXT_COLOR}>Choose Gender</Body2>
              <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                <UpArrowIcon />
              </TouchableOpacity>
            </View>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.genderOption, gender === option && styles.genderOptionSelected]}
                onPress={() => { setGender(option); setShowGenderModal(false); }}
              >
                <Body3 color={Colors.TEXT_COLOR}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Body3>
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
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: wp(20), paddingTop: hp(20),
  },
  backButton: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: wp(20), paddingBottom: hp(40) },
  container: { flex: 1, paddingTop: hp(35) },
  titleBlock: { marginBottom: hp(30) },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16,
    borderWidth: 1, borderColor: Colors.BORDER_COLOR,
    paddingHorizontal: wp(16), paddingVertical: hp(24),
    backgroundColor: 'transparent', marginBottom: hp(12),
  },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: wp(20),
  },
  genderModalContainer: {
    width: '100%', zIndex: 2, backgroundColor: '#fff', borderRadius: 24,
    paddingHorizontal: wp(20), paddingTop: hp(16),
    paddingBottom: Platform.OS === 'ios' ? hp(40) : hp(30), gap: hp(8),
    elevation: 5,
  },
  genderModalHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: hp(16),
  },
  genderOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F5F5F5', borderRadius: 12,
    paddingHorizontal: wp(16), paddingVertical: hp(14),
  },
  genderOptionSelected: { backgroundColor: '#F0F8FF' },
  checkboxSelected: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 1.5,
    borderColor: Colors.BRAND_PRIMARY, backgroundColor: '#E8F4FD',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxEmpty: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff',
  },
});