import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { Caption2 } from '@/components/typo/Typography';
import { FORM_FIELDS, FORM_PLACEHOLDERS } from '@/components/ui/form';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { hp, wp } from '@/utils/responsiveDevice';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const ROLE_ROUTES: Record<string, string> = {
  'admin123@gmail.com':   '/admin/home',
  'patient123@gmail.com': '/patient/(tabs)/home',
};

export default function LoginScreen() {
  const router = useRouter();

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues: {
      [FORM_FIELDS.EMAIL]: '',
      [FORM_FIELDS.PASSWORD]: '',
    },
    validationRules: {
      [FORM_FIELDS.EMAIL]: validateEmail,
      [FORM_FIELDS.PASSWORD]: validatePassword,
    },
    onSubmit: async (values) => {
      try {
        const email = values[FORM_FIELDS.EMAIL].trim().toLowerCase();
        const route = ROLE_ROUTES[email];

        if (!route) {
          showToast('Invalid email or password.', 'error');
          return;
        }

        router.replace(route as any);
      } catch (error: any) {
        const message =
          error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          'Login failed. Please try again.';
        showToast(message, 'error');
      }
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={{ width: '100%', maxWidth: 500 }}>
            <AuthHeading
              imageSource={IMAGE_COMPONENTS.logo}
              title="Welcome Back"
              style={{ marginBottom: hp(30) }}
              description="Welcome back! Glad to See you again"
            />

            <View style={styles.form}>
              <FormInput
                value={values[FORM_FIELDS.EMAIL]}
                onChangeText={(text) => handleChange(FORM_FIELDS.EMAIL, text)}
                type="email"
                placeholder="Enter Your Email"
                error={errors[FORM_FIELDS.EMAIL]}
                touched={touched[FORM_FIELDS.EMAIL]}
              />

              <FormInput
                value={values[FORM_FIELDS.PASSWORD]}
                onChangeText={(text) => handleChange(FORM_FIELDS.PASSWORD, text)}
                placeholder={FORM_PLACEHOLDERS[FORM_FIELDS.PASSWORD]}
                type="password"
                error={errors[FORM_FIELDS.PASSWORD]}
                touched={touched[FORM_FIELDS.PASSWORD]}
              />

              <CustomButton
                title="Log in"
                onPress={handleSubmit}
                width="100%"
                height={hp(70)}
                borderRadius={16}
                style={{ marginTop: hp(8) }}
              />
            </View>

            <View style={{ marginTop: hp(20) }}>
              <View style={styles.forgotPasswordContainer}>
                <Link href="/(auth)/forgot_password" asChild>
                  <TouchableOpacity>
                    <Caption2 color={Colors.BRAND_PRIMARY} style={styles.forgotPassword}>
                      Forgot password?
                    </Caption2>
                  </TouchableOpacity>
                </Link>
              </View>

              <View style={styles.footer}>
                <Caption2 color={Colors.PLACEHOLLDER_TEXT}>Don't have an account?</Caption2>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Caption2 color={Colors.BRAND_PRIMARY}> Sign up</Caption2>
                </TouchableOpacity>
              </View>
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
  },
  form: {},
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: -5,
  },
  forgotPassword: {},
  footer: {
    marginTop: hp(16),
    flexDirection: 'row',
    justifyContent: 'center',
  },
});