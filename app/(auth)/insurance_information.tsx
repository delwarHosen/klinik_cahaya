import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Body3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useUpdateInsuranceMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ১. ইম্পোর্ট
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InsuranceInformationScreen() {
  const router = useRouter();
  const { t } = useTranslation(); // ২. হুক কল
  
  const [providerName, setProviderName] = useState('');
  const [planType, setPlanType] = useState('');
  const [memberId, setMemberId] = useState('');
  const [coverageType, setCoverageType] = useState('');
  const [updateInsurance, { isLoading }] = useUpdateInsuranceMutation();

  const handleSkip = () => {
    router.push('/(auth)/family_information');
  };

  const handleContinue = async () => {
    try {
      const res = await updateInsurance({
        provider_name: providerName,
        plan_type: planType,
        member_id: memberId,
        coverage_type: coverageType,
      }).unwrap();

      // console.log(' Insurance saved:', JSON.stringify(res));
      showToast(t('insurance_saved'), 'success'); 
      router.push('/(auth)/family_information');
    } catch (err: any) {
      console.log(' Insurance error:', JSON.stringify(err));
      showToast(
        err?.data?.detail?.msg || err?.data?.message || t('insurance_save_failed'), 
        'error'
      );
    }
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
            {/* Skip বাটনের অনুবাদ */}
            <Body3 color={Colors.PLACEHOLLDER_TEXT}>{t('skip')}</Body3> 
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Title - ডাইনামিক অনুবাদ */}
            <View style={styles.titleBlock}>
              <AuthHeading
                title={t('setup_profile')}
                description={t('insurance_info')}
              />
            </View>

            <FormInput
              value={providerName}
              onChangeText={setProviderName}
              placeholder={t('provider_name')}
            />

            <FormInput
              value={planType}
              onChangeText={setPlanType}
              placeholder={t('plan_type')}
            />

            <FormInput
              value={memberId}
              onChangeText={setMemberId}
              placeholder={t('member_id')}
            />

            <FormInput
              value={coverageType}
              onChangeText={setCoverageType}
              placeholder={t('coverage_type')}
            />

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
  subtitle: {
    marginTop: hp(4),
    fontStyle: 'italic',
  },
});