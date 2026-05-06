import { LanguageIcon } from '@/assets/icons/common_icon/LanguageIcon'
import { ChangePasswordIcon } from '@/assets/icons/patient_icon/ChangePasswordIcon'
import { ContactSupportIcon } from '@/assets/icons/patient_icon/ContactSupportIcon'
import { LogoutIcon } from '@/assets/icons/patient_icon/LogoutIcon'
import { PrivacyPolicyIcon } from '@/assets/icons/patient_icon/PrivacyPolicyIcon'
import { TermsConditionIcon } from '@/assets/icons/patient_icon/TermsConditionIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import CustomLoader from '@/components/shared/CustomLoader'
import { ProfileCard } from '@/components/shared/ProfileCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body2, Caption1, Caption4, H2, H6 } from '@/components/typo/Typography'
import { IMAGE_COMPONENTS } from '@/constants/image.index'
import { Colors } from '@/constants/theme'
import { logout } from '@/redux/authSlice'
import { useGetProfileQuery, useLogoutMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'

export default function ProfileScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [logoutApi, { isLoading: logoutLoading }] = useLogoutMutation()
  const { data, isLoading: profileLoading } = useGetProfileQuery({})

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap()
    } catch {}
    finally {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'role'])
      dispatch(logout())
      router.replace('/(auth)/login')
    }
  }

  
  const name = data?.name ?? '-'
  const icNumber = data?.ic_number ?? '-'
  const phone = data?.steps?.profile?.data?.phone ?? '-'
  const dob = data?.steps?.profile?.data?.date_of_birth ?? '-'
  const bloodGroup = data?.steps?.medical?.data?.blood_group ?? '-'
  const allergies: string[] = data?.steps?.medical?.data?.allergies?.map((a: any) => a.name) ?? []
  const conditions: string[] = data?.steps?.medical?.data?.medical_condition ?? []
  const medication: string[] = data?.steps?.medical?.data?.medication ?? []
  const insurance = {
    provider: data?.steps?.insurance?.data?.provider_name ?? '-',
    planType: data?.steps?.insurance?.data?.plan_type ?? '-',
    memberId: data?.steps?.insurance?.data?.member_id ?? '-',
  }
  const avatarUrl = data?.profile_picture?.public_url ?? null

  if (profileLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <CustomLoader size={60} strokeWidth={2} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Patient Card ── */}
        <View style={styles.patientCard}>
          <View style={styles.cardHeader}>
            <View style={styles.logoRow}>
              <Image source={IMAGE_COMPONENTS.logo} style={styles.clinicLogo} resizeMode="contain" />
            </View>
            <View style={styles.icBadge}>
              <Caption4 color={Colors.BRAND_PRIMARY}>IC: {icNumber}</Caption4>
            </View>
          </View>

          {/* Avatar + Name */}
          <View style={styles.avatarSection}>
            <Image
              source={avatarUrl ? { uri: avatarUrl } : IMAGE_COMPONENTS.patient}
              style={styles.avatar}
            />
            <H2 color={Colors.TEXT_COLOR}>{name}</H2>
            <Body2 color={Colors.PLACEHOLLDER_TEXT}>{dob}</Body2>
            <H6 style={{ marginTop: 2 }}>{phone}</H6>
          </View>

          {/* Medical Info */}
          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <View style={styles.medicalBadge}>
                <Caption4 color="#FFFFFF">Medical</Caption4>
              </View>
            </View>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099">
              <Caption1 weight="semiBold" color="#555">Blood Group: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>{bloodGroup}</Caption1>
            </Caption1>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099">
              <Caption1 weight="semiBold" color="#555">Allergies: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>
                {allergies.length > 0 ? allergies.join(', ') : '-'}
              </Caption1>
            </Caption1>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099">
              <Caption1 weight="semiBold" color="#555">Medical Condition: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>
                {conditions.length > 0 ? conditions.join(', ') : '-'}
              </Caption1>
            </Caption1>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099">
              <Caption1 weight="semiBold" color="#555">Medication: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>
                {medication.length > 0 ? medication.join(', ') : '-'}
              </Caption1>
            </Caption1>
          </View>

          {/* Insurance Info */}
          <View style={styles.insuranceBox}>
            <View style={styles.insuranceBadge}>
              <Caption4 color="#00000099">Insurance</Caption4>
            </View>
            <H6 color={Colors.BRAND_PRIMARY}>{insurance.provider}</H6>
            <Caption1 color="#00000099" style={{ marginBottom: hp(8) }}>
              <Caption1 weight="semiBold" color="#00000099">Plan Type: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>{insurance.planType}</Caption1>
            </Caption1>
            <Caption1 color="#00000099" style={{ marginBottom: hp(8) }}>
              <Caption1 weight="semiBold" color="#00000099">Member ID: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>{insurance.memberId}</Caption1>
            </Caption1>
          </View>

          <CustomButton
            title='Edit Profile'
            onPress={() => router.push('/patient/profile/edit_profile')}
            height={56}
            width="100%"
            borderRadius={14}
          />
        </View>

        {/* ── Menu Items ── */}
        <View style={styles.menuSection}>
          <ProfileCard
            icon={<LanguageIcon size={22} color={Colors.BRAND_PRIMARY} />}
            label="Language"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/language')}
          />
          <ProfileCard
            icon={<ChangePasswordIcon size={22} color={Colors.BRAND_PRIMARY} />}
            label="Change Password"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/change_password')}
          />
          <ProfileCard
            icon={<ContactSupportIcon size={16} color={Colors.BRAND_PRIMARY} />}
            label="Contact & Support"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/contact_support')}
          />
          <ProfileCard
            icon={<TermsConditionIcon size={16} color={Colors.BRAND_PRIMARY} />}
            label="Terms & Conditions"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/terms_condition')}
          />
          <ProfileCard
            icon={<PrivacyPolicyIcon size={16} color={Colors.BRAND_PRIMARY} />}
            label="Privacy & Policy"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/privacy_policy')}
          />

          {logoutLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: hp(12) }}>
              <CustomLoader size={40} strokeWidth={3} />
            </View>
          ) : (
            <ProfileCard
              icon={<LogoutIcon size={16} color={Colors.COLOR_DANGER} />}
              label="Logout"
              iconBG={`${Colors.COLOR_DANGER}1A`}
              textColor={Colors.COLOR_DANGER}
              borderColor={`${Colors.COLOR_DANGER}33`}
              rightAngleColor={Colors.COLOR_DANGER}
              onPress={handleLogout}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  scrollContent: {
    paddingBottom: hp(100),
  },
  patientCard: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: hp(15),
    marginBottom: hp(20),
    marginTop: hp(10),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(12),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicLogo: {
    height: hp(54),
    width: wp(120),
  },
  icBadge: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 18,
    paddingHorizontal: wp(12),
    paddingVertical: hp(5),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: hp(16),
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: hp(8),
    borderWidth: 2,
    borderColor: '#DDDDDD',
  },
  infoBox: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 16,
    padding: wp(14),
    marginBottom: hp(12),
  },
  infoBoxHeader: {
    alignItems: 'flex-end',
    marginBottom: hp(6),
  },
  medicalBadge: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 20,
    paddingHorizontal: wp(15),
    paddingVertical: hp(8),
  },
  insuranceBox: {
    backgroundColor: '#E4E500',
    borderRadius: 12,
    padding: wp(14),
    marginBottom: hp(16),
  },
  insuranceBadge: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: wp(15),
    paddingVertical: hp(8),
  },
  menuSection: {
    gap: 0,
  },
})