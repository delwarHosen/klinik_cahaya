import { ChangePasswordIcon } from '@/assets/icons/patient_icon/ChangePasswordIcon'
import { ContactSupportIcon } from '@/assets/icons/patient_icon/ContactSupportIcon'
import { LogoutIcon } from '@/assets/icons/patient_icon/LogoutIcon'
import { PrivacyPolicyIcon } from '@/assets/icons/patient_icon/PrivacyPolicyIcon'
import { TermsConditionIcon } from '@/assets/icons/patient_icon/TermsConditionIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import { ProfileCard } from '@/components/shared/ProfileCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body2, Caption1, Caption4, H2, H6 } from '@/components/typo/Typography'
import { IMAGE_COMPONENTS } from '@/constants/image.index'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Fake patient data
const PATIENT = {
  name: 'Ahmad Bin Abdullah',
  ic: '900101-14-5678',
  dob: '10- Aug- 1986',
  phone: '+60 12 4523784',
  bloodGroup: 'A+',
  allergies: ['Food Allergies', 'Seasonal Allergies', 'Pet Allergies'],
  conditions: ['Asthma', 'Hypertension'],
  medication: 'Cetirizine (Zyrtec)',
  insurance: {
    provider: 'AIA Malaysia',
    planType: 'A-Plus Med',
    memberId: 'AIA-MY-123456789',
  },
  avatar: 'https://i.pravatar.cc/150?u=ahmad',
}

export default function ProfileScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Profile"
      //  showBackButton={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Patient Card ── */}
        <View style={styles.patientCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.logoRow}>
              <Image source={IMAGE_COMPONENTS.logo} style={styles.clinicLogo} resizeMode="contain" />
            </View>
            <View style={styles.icBadge}>
              <Caption4 color={Colors.BRAND_PRIMARY}>IC: {PATIENT.ic}</Caption4>
            </View>
          </View>

          {/* Avatar + Name */}
          <View style={styles.avatarSection}>
            <Image source={{ uri: PATIENT.avatar }} style={styles.avatar} />
            <H2 color={Colors.TEXT_COLOR}>{PATIENT.name}</H2>
            <Body2 color={Colors.PLACEHOLLDER_TEXT}>{PATIENT.dob}</Body2>
            <H6 style={{ marginTop: 2 }}>{PATIENT.phone}</H6>
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
              <Caption1 color={Colors.BRAND_PRIMARY}>{PATIENT.bloodGroup}</Caption1>
            </Caption1>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099" >
              <Caption1 weight="semiBold" color="#555">Allergies: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>{PATIENT.allergies.join(', ')}</Caption1>
            </Caption1>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099" >
              <Caption1 weight="semiBold" color="#555">Medical Condition: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY} >{PATIENT.conditions.join(', ')}</Caption1>
            </Caption1>
            <Caption1 style={{ marginBottom: hp(8) }} color="#00000099">
              <Caption1 weight="semiBold" color="#555">Medication: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}
              // weight='semiBold'
              >{PATIENT.medication}</Caption1>
            </Caption1>
          </View>

          {/* Insurance Info */}
          <View style={styles.insuranceBox}>
            <View style={styles.insuranceBadge}>
              <Caption4 color="#00000099">Insurance</Caption4>
            </View>
            <H6 color={Colors.BRAND_PRIMARY}>{PATIENT.insurance.provider}</H6>
            <Caption1 color="#00000099" style={{ marginBottom: hp(8) }}>
              <Caption1 weight="semiBold" color="#00000099">Plan Type: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>{PATIENT.insurance.planType}</Caption1>
            </Caption1>
            <Caption1 color="#00000099" style={{ marginBottom: hp(8) }}>
              <Caption1 weight="semiBold" color="#00000099">Member ID: </Caption1>
              <Caption1 color={Colors.BRAND_PRIMARY}>{PATIENT.insurance.memberId}</Caption1>
            </Caption1>
          </View>

          {/* Edit Profile Button */}
          <CustomButton
            title='Edit Profile'
            onPress={() => router.push('/patient/profile/edit_profile')}
            height={56}
            width={"100%"}
            borderRadius={14}
          />

        </View>

        {/* ── Menu Items ── */}
        <View style={styles.menuSection}>
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
            label="Terms & Condition"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/terms_condition')}
          />
          <ProfileCard
            icon={<PrivacyPolicyIcon size={16} color={Colors.BRAND_PRIMARY} />}
            label="Privacy & Policy"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/patient/profile/privacy_policy')}
          />
          <ProfileCard
            icon={<LogoutIcon size={16} color={Colors.COLOR_DANGER} />}
            label="Logout"
            iconBG={`${Colors.COLOR_DANGER}1A`}
            textColor={Colors.COLOR_DANGER}
            borderColor={`${Colors.COLOR_DANGER}33`}
            onPress={() => {
              // handle logout
            }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20)
  },
  scrollContent: {
    paddingBottom: hp(100)
  },

  patientCard: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 24,
    paddingHorizontal: (15),
    paddingVertical: hp(15),
    marginBottom: hp(20),
    marginTop: hp(10)
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(12),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  clinicLogo: {
    height: hp(54),
    width: wp(120)
  },
  icBadge: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 18,
    paddingHorizontal: wp(12),
    paddingVertical: hp(5),
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: hp(16)
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: hp(8),
    borderWidth: 2,
    borderColor: '#DDDDDD',
  },
  patientName: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2
  },

  infoBox: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 16,
    padding: wp(14),
    marginBottom: hp(12),
  },
  infoBoxHeader: {
    alignItems: 'flex-end',
    marginBottom: hp(6)
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

  editBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: hp(16),
    alignItems: 'center',
  },

  menuSection: { gap: 0 },
})