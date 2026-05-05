import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import CustomLoader from '@/components/shared/CustomLoader';
import PageLoader from '@/components/shared/PageLoader';
import { showToast } from '@/components/shared/Toast';
import { Caption2 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { useLoginMutation, useSignupMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from '@/utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const isLoading = signupLoading || loginLoading;

  const [waitingVerification, setWaitingVerification] = useState(false);
  const userEmailRef = useRef('');
  const userPasswordRef = useRef('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tryAutoLogin = async () => {
    try {
      const loginRes = await login({
        email: userEmailRef.current,
        password: userPasswordRef.current,
      }).unwrap();

      // console.log(' Login response:', JSON.stringify(loginRes));

      if (loginRes?.access_token) {
        await AsyncStorage.setItem('access_token', loginRes.access_token);
        if (loginRes?.refresh_token) {
          await AsyncStorage.setItem('refresh_token', loginRes.refresh_token);
        }
        clearInterval(intervalRef.current!);
        setWaitingVerification(false);
        router.push('/(auth)/personal_information');
      }
    } catch {
      console.log(' Not verified yet, still waiting...');
    }
  };

  useEffect(() => {
    if (!waitingVerification) return;

    if (waitingVerification) {
      Keyboard.dismiss();
    }

    const subscription = Linking.addEventListener('url', () => {
      tryAutoLogin();
    });


    intervalRef.current = setInterval(tryAutoLogin, 4000);

    return () => {
      subscription.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [waitingVerification]);

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
      [FORM_FIELDS.CONTACT_NO]: validatePhoneNumber,
      [FORM_FIELDS.PASSWORD]: validatePassword,
      [FORM_FIELDS.CONFIRM_PASSWORD]: validatePassword,
    },
    onSubmit: async (values) => {
      try {
        await signup({
          name: values[FORM_FIELDS.FULL_NAME],
          email: values[FORM_FIELDS.EMAIL].trim().toLowerCase(),
          ic_number: values[FORM_FIELDS.CONTACT_NO],
          password: values[FORM_FIELDS.PASSWORD],
          confirm_password: values[FORM_FIELDS.CONFIRM_PASSWORD],
        }).unwrap();

        userEmailRef.current = values[FORM_FIELDS.EMAIL].trim().toLowerCase();
        userPasswordRef.current = values[FORM_FIELDS.PASSWORD];

        showToast('Check your email to verify your account.', 'success');
        setWaitingVerification(true);
      } catch (err: any) {
        console.log('Signup error:', JSON.stringify(err));
        showToast(err?.data?.detail?.msg || err?.data?.message || 'Register failed.', 'error');
      }
    },
  });

  return (
    <>
      <PageLoader
        visible={waitingVerification}
        title="VERIFYING"
        subtitle={"Please verify your email first.\nCheck your inbox and click the confirm link."}
      />

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
                title="Register"
                style={{ marginBottom: hp(30) }}
                description="Hello! Register to get started"
              />

              <View style={styles.form}>
                <FormInput
                  value={values[FORM_FIELDS.FULL_NAME]}
                  onChangeText={(text) => handleChange(FORM_FIELDS.FULL_NAME, text)}
                  placeholder="Enter Your Name"
                  error={errors[FORM_FIELDS.FULL_NAME]}
                  touched={touched[FORM_FIELDS.FULL_NAME]}
                />
                <FormInput
                  value={values[FORM_FIELDS.EMAIL]}
                  onChangeText={(text) => handleChange(FORM_FIELDS.EMAIL, text)}
                  type="email"
                  placeholder="Enter Your Email Address"
                  error={errors[FORM_FIELDS.EMAIL]}
                  touched={touched[FORM_FIELDS.EMAIL]}
                />
                <FormInput
                  value={values[FORM_FIELDS.CONTACT_NO]}
                  onChangeText={(text) => handleChange(FORM_FIELDS.CONTACT_NO, text)}
                  type="number"
                  placeholder="IC Number"
                  error={errors[FORM_FIELDS.CONTACT_NO]}
                  touched={touched[FORM_FIELDS.CONTACT_NO]}
                />
                <FormInput
                  value={values[FORM_FIELDS.PASSWORD]}
                  onChangeText={(text) => handleChange(FORM_FIELDS.PASSWORD, text)}
                  placeholder="Enter Your Password"
                  type="password"
                  error={errors[FORM_FIELDS.PASSWORD]}
                  touched={touched[FORM_FIELDS.PASSWORD]}
                />
                <FormInput
                  value={values[FORM_FIELDS.CONFIRM_PASSWORD]}
                  onChangeText={(text) => handleChange(FORM_FIELDS.CONFIRM_PASSWORD, text)}
                  placeholder="Confirm Password"
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
                    title="Sign Up"
                    onPress={handleSubmit}
                    width="100%"
                    height={hp(70)}
                    borderRadius={16}
                    style={{ marginTop: hp(12) }}
                  />
                )}
              </View>

              <View style={styles.footer}>
                <Caption2 color={Colors.TEXT_COLOR}>Already have an account?</Caption2>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Caption2 color={Colors.BRAND_PRIMARY}> Sign in</Caption2>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
  },
});