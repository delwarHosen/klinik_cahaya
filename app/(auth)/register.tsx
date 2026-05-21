import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import { showToast } from '@/components/shared/Toast';
import { Caption2 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { useSignupMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { validateEmail, validateICNumber, validateName, validatePassword } from '@/utils/validation';
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

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [signup, { isLoading }] = useSignupMutation();
  const [phone, setPhone] = useState('');

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues: {
      [FORM_FIELDS.FULL_NAME]: '',
      [FORM_FIELDS.EMAIL]: '',
      [FORM_FIELDS.CONTACT_NO]: '',
      [FORM_FIELDS.PASSWORD]: '',
      [FORM_FIELDS.CONFIRM_PASSWORD]: '',
    },
    validationRules: {
      [FORM_FIELDS.FULL_NAME]: validateName,
      [FORM_FIELDS.EMAIL]: validateEmail,
      [FORM_FIELDS.CONTACT_NO]: validateICNumber,
      [FORM_FIELDS.PASSWORD]: validatePassword,
      [FORM_FIELDS.CONFIRM_PASSWORD]: (value) => {
        if (!value.trim()) return t('confirm_password_required', 'Confirm Password is required');
        if (value.length < 8) return t('password_too_short', 'Must be at least 8 characters');
        return '';
      },
    },
    onSubmit: async (values) => {
      try {
        await signup({
          name: values[FORM_FIELDS.FULL_NAME],
          email: values[FORM_FIELDS.EMAIL].trim().toLowerCase(),
          ic_number: values[FORM_FIELDS.CONTACT_NO],
          password: values[FORM_FIELDS.PASSWORD],
          confirm_password: values[FORM_FIELDS.CONFIRM_PASSWORD],
          phone,
        }).unwrap();

        showToast(t('check_email_otp', 'Check your email for the OTP code.'), 'success');

        router.push({
          pathname: '/(auth)/email_verify',
          params: {
            email: values[FORM_FIELDS.EMAIL].trim().toLowerCase(),
            password: values[FORM_FIELDS.PASSWORD],
          },
        });
      } catch (err: any) {
        showToast(err?.data?.detail?.msg || err?.data?.message || t('register_failed', 'Register failed.'), 'error');
      }
    },
  });

  // if (!phone.trim()) {
  //   showToast(t('enter_phone_error'), 'error');
  //   return;
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.container}>
          <View style={{ width: '100%', maxWidth: 500 }}>
            <AuthHeading
              imageSource={IMAGE_COMPONENTS.logo}
              title={t('sign_up')}
              style={{ marginBottom: hp(30) }}
              description={t('register_desc', 'Hello! Register to get started')}
            />

            <View style={styles.form}>
              <FormInput
                value={values[FORM_FIELDS.FULL_NAME]}
                onChangeText={(text) => handleChange(FORM_FIELDS.FULL_NAME, text)}
                placeholder={t('enter_full_name', 'Enter Your Name')}
                error={errors[FORM_FIELDS.FULL_NAME]}
                touched={touched[FORM_FIELDS.FULL_NAME]}
              />
              <FormInput
                value={values[FORM_FIELDS.EMAIL]}
                onChangeText={(text) => handleChange(FORM_FIELDS.EMAIL, text)}
                type="email"
                placeholder={t('enter_your_email')} // ৪. JSON থেকে ইমেল
                error={errors[FORM_FIELDS.EMAIL]}
                touched={touched[FORM_FIELDS.EMAIL]}
              />
              <FormInput
                value={values[FORM_FIELDS.CONTACT_NO]}
                onChangeText={(text) => handleChange(FORM_FIELDS.CONTACT_NO, text)}
                type="number"
                placeholder={t('ic_number_placeholder', 'IC Number (12 digits)')}
                error={errors[FORM_FIELDS.CONTACT_NO]}
                touched={touched[FORM_FIELDS.CONTACT_NO]}
              />

              <FormInput
                value={phone}
                onChangeText={setPhone}
                placeholder={t('phone')}
                type="number"
              />

              <FormInput
                value={values[FORM_FIELDS.PASSWORD]}
                onChangeText={(text) => handleChange(FORM_FIELDS.PASSWORD, text)}
                placeholder={t('enter_password', 'Enter Your Password')}
                type="password"
                error={errors[FORM_FIELDS.PASSWORD]}
                touched={touched[FORM_FIELDS.PASSWORD]}
              />
              <FormInput
                value={values[FORM_FIELDS.CONFIRM_PASSWORD]}
                onChangeText={(text) => handleChange(FORM_FIELDS.CONFIRM_PASSWORD, text)}
                placeholder={t('confirm_password', 'Confirm Password')}
                type="password"
                error={errors[FORM_FIELDS.CONFIRM_PASSWORD]}
                touched={touched[FORM_FIELDS.CONFIRM_PASSWORD]}
              />

              {isLoading ? (
                <View style={{ alignItems: 'center', marginTop: hp(12) }}>
                  <CustomLoader size={50} strokeWidth={1} />
                </View>
              ) : (
                <CustomButton
                  title={t('sign_up')}
                  onPress={handleSubmit}
                  width="100%"
                  height={hp(70)}
                  borderRadius={16}
                  style={{ marginTop: hp(12) }}
                />
              )}
            </View>

            <View style={styles.footer}>
              <Caption2 color={Colors.TEXT_COLOR}>
                {t('already_have_account', 'Already have an account?')}
              </Caption2>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Caption2 color={Colors.BRAND_PRIMARY}> {t('login')}</Caption2>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.APP_BACKGROUND,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(40),
  },
  form: {},
  footer: {
    marginTop: hp(20),
    flexDirection: 'row',
    justifyContent: 'center',
  },
});