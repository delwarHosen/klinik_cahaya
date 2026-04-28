import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { CalenderIcon } from '@/assets/icons/patient_icon/CalenderIcon'; // ১. আইকন ইম্পোর্ট
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

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export default function PersonalInformationScreen() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);

  
  const handleOpenCalendar = () => {
    // console.log('Open Calendar');
  };

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
              style={styles.inputWrapper} 
              onPress={() => setShowGenderModal(true)}
              activeOpacity={0.7}
            >
              <Body3 color={gender ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                {gender || 'Gender'}
              </Body3>
              <DownArrowIcon />
            </TouchableOpacity>

           
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={handleOpenCalendar}
              activeOpacity={0.7}
            >
              <Body3 color={dateOfBirth ? Colors.TEXT_COLOR : '#8C88A3'} style={{ flex: 1 }}>
                {dateOfBirth || 'Date Of Birth'}
              </Body3>
              <CalenderIcon />
            </TouchableOpacity>

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

   
      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade" 
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>

         
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => setShowGenderModal(false)}
            activeOpacity={1}
          />

         
          <View style={styles.genderModalContainer}>
            {/* Header */}
            <View style={styles.genderModalHeader}>
              <Body2 color={Colors.TEXT_COLOR}>Choose Gender</Body2>
              <TouchableOpacity onPress={() => setShowGenderModal(false)} style={styles.closeIcon}>
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
  inputWrapper: { 
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
  
  
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)', /
    justifyContent: 'center', // Vertical Center
    alignItems: 'center',     // Horizontal Center
    paddingHorizontal: wp(20), 
  },
  genderModalContainer: {
    width: '100%',
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 24, 
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: Platform.OS === 'ios' ? hp(40) : hp(30),
    gap: hp(8),
    
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    marginBottom: hp(16), 
  },
  closeIcon: { 
    padding: 5,
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