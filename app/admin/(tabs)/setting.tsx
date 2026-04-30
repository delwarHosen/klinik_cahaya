import { ProfileIcon } from '@/assets/icons/common_icon/ProfileIcon'
import { ChangePasswordIcon } from '@/assets/icons/patient_icon/ChangePasswordIcon'
import { LogoutIcon } from '@/assets/icons/patient_icon/LogoutIcon'
import { ProfileCard } from '@/components/shared/ProfileCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



export default function SettingScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Profile"
      //  showBackButton={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Menu Items ── */}
        <View style={styles.menuSection}>
          <ProfileCard
            icon={<ProfileIcon size={22} color={Colors.BRAND_PRIMARY} />}
            label="Menage Doctors"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/admin/profile/manage_doctos')}
          />
          <ProfileCard
            icon={<ChangePasswordIcon size={22} color={Colors.BRAND_PRIMARY} />}
            label="Change Password"
            iconBG={`${Colors.BRAND_PRIMARY}1A`}
            onPress={() => router.push('/admin/profile/change_password')}
          />

          <ProfileCard
            icon={<LogoutIcon size={16} color={Colors.COLOR_DANGER} />}
            label="Logout"
            iconBG={`${Colors.COLOR_DANGER}1A`}
            textColor={Colors.COLOR_DANGER}
            borderColor={`${Colors.COLOR_DANGER}33`}
            rightAngleColor={Colors.COLOR_DANGER}
            onPress={() => {
              // handle logout
              router.push("/(auth)/login")
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
    paddingBottom: hp(100),
    paddingTop: hp(10)
  },



  menuSection: { gap: 0 },
})