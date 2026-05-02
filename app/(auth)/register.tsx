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
import { setCredentials } from '@/redux/authSlice';
// import { useSignupMutation } from '@/redux/services/authApi'; // TODO: real API ready হলে uncomment
import { hp, wp } from '@/utils/responsiveDevice';
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from '@/utils/validation';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // TODO: real API ready হলে নিচের line uncomment করো এবং isLoading state সরাও
  // const [signup, { isLoading }] = useSignupMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues: {
      [FORM_FIELDS.FULL_NAME]: "",
      [FORM_FIELDS.EMAIL]: "",
      [FORM_FIELDS.CONTACT_NO]: "",
      [FORM_FIELDS.PASSWORD]: "",
      [FORM_FIELDS.CONFIRM_PASSWORD]: "",
    },
    validationRules: {
      [FORM_FIELDS.FULL_NAME]: validateName,
      [FORM_FIELDS.EMAIL]: validateEmail,
      [FORM_FIELDS.CONTACT_NO]: validatePhoneNumber,
      [FORM_FIELDS.PASSWORD]: validatePassword,
      [FORM_FIELDS.CONFIRM_PASSWORD]: validatePassword,
    },
    onSubmit: async (values) => {

      // ── MOCK REGISTER ─────────────────────────────────────────────────────
      // TODO: real API ready হলে এই block সরিয়ে নিচের commented block uncomment করো
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));

      const email = values[FORM_FIELDS.EMAIL].trim().toLowerCase();

      dispatch(setCredentials({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        role: 'patient',
        user: { email, app_metadata: { role: 'patient' } },
      }));

      setIsLoading(false);
      showToast('Registration successful!', 'success');
      router.push('/(auth)/personal_information');
      return;
      // ── END MOCK REGISTER ─────────────────────────────────────────────────

      // ── REAL API LOGIN (disabled) ─────────────────────────────────────────
      // TODO: mock period শেষ হলে উপরের mock block সরিয়ে এটা uncomment করো
      //
      // try {
      //   await signup({
      //     name: values[FORM_FIELDS.FULL_NAME],
      //     email: values[FORM_FIELDS.EMAIL].trim().toLowerCase(),
      //     ic_number: values[FORM_FIELDS.CONTACT_NO],
      //     password: values[FORM_FIELDS.PASSWORD],
      //     confirm_password: values[FORM_FIELDS.CONFIRM_PASSWORD],
      //   }).unwrap();
      //   showToast('Check your email to verify your account.', 'success');
      //   router.push('/(auth)/personal_information');
      // } catch (err: any) {
      //   console.log('Signup error:', JSON.stringify(err));
      //   showToast(err?.data?.message || 'Registration failed.', 'error');
      // }
      // ── END REAL API ──────────────────────────────────────────────────────
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                  onPress={() => router.push('/(auth)/personal_information')}
                  width="100%"
                  height={hp(70)}
                  borderRadius={16}
                  style={{ marginTop: hp(12) }}
                />
              )}
            </View>

            <View style={styles.footer}>
              <Caption2 color={Colors.TEXT_COLOR}>Already have an account?</Caption2>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Caption2 color={Colors.BRAND_PRIMARY}> Sign in</Caption2>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(20),
    paddingVertical: hp(40),
  },
  form: {},
  footer: {
    marginTop: hp(20),
    flexDirection: "row",
  },
});