import { NotificationIcon } from '@/assets/icons/common_icon/Notification'
import { CustomButton } from '@/components/shared/CustomButton'
import { Body1, Caption1, Caption2, Caption4, H3, H6 } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS, BOOKING_STATS } from '@/constants/adminData'
import { IMAGE_COMPONENTS } from '@/constants/image.index'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const upcomingList = ADMIN_APPOINTMENTS.filter(a => a.status === 'Upcoming')
const pendingList = ADMIN_APPOINTMENTS.filter(a => a.status === 'Pending')

export default function AdminHomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Image source={IMAGE_COMPONENTS.logo} style={styles.logo} />
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => router.push('/admin/notification' as any)}
        >
          <NotificationIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── Upcoming Appointment Card ── */}
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingCardHeader}>
            <Body1>Upcoming Appointment</Body1>
            <TouchableOpacity
              onPress={() => router.push('/admin/(tabs)/apointment' as any)}
            >
              <Caption4 color='#666666'>View All</Caption4>
            </TouchableOpacity>
          </View>

          <View style={styles.apptListInner}>
            {upcomingList.slice(0, 5).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.apptInnerCard}
                activeOpacity={0.75}
                onPress={() =>
                  router.push({
                    pathname: '/admin/appointments/appointment_details' as any,
                    params: { id: item.id },
                  })
                }
              >
                <View style={styles.apptLeft}>
                  <Caption1 weight='semiBold' style={styles.apptDoctor} numberOfLines={1}>
                    {item.doctorName}
                  </Caption1>
                  <Caption4 style={styles.apptMeta}>
                    {item.time} | {item.displayDate}
                  </Caption4>
                </View>

                <View style={styles.apptVerticalDivider} />

                <View style={styles.apptRight}>
                  <Caption4 style={styles.patientLabel}>Patient</Caption4>
                  <Caption2 style={styles.apptPatient} numberOfLines={1}>
                    {item.patientName}
                  </Caption2>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Caption4 style={styles.statLabel}>Booking Request</Caption4>
            <H3 style={styles.statNumber}>{BOOKING_STATS.bookingRequest}</H3>
          </View>
          <View style={styles.statDivider} />
          <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
            <Caption4 style={styles.statLabel}>Accepted</Caption4>
            <H3 style={styles.statNumber}>{BOOKING_STATS.accepted}</H3>
          </View>
        </View>

        {/* ── Recent Request ── */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <H6 style={styles.sectionTitle}>Recent Request</H6>
            <TouchableOpacity
              onPress={() => router.push('/admin/(tabs)/details' as any)}
            >
              <Caption4 color='#666666'>View All</Caption4>
            </TouchableOpacity>
          </View>

          {pendingList.slice(0, 3).map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.recentCard,
                index < Math.min(pendingList.length, 3) - 1 && { marginBottom: hp(12) },
              ]}
            >
              <View style={styles.recentLeft}>
                <Caption1 weight='semiBold' style={styles.apptDoctor} numberOfLines={1}>
                  {item.doctorName}
                </Caption1>
                <Caption4 style={styles.apptMeta}>{item.time}</Caption4>
                <Caption4 style={styles.apptMeta}>{item.displayDate}</Caption4>
              </View>

              <CustomButton
                title='View'
                borderRadius={14}
                onPress={() =>
                  router.push({
                    pathname: '/admin/appointments/appointment_details' as any,
                    params: { id: item.id },
                  })
                }
                width={"25%"}
              />
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
  },
  logo: { height: hp(54), width: wp(138), resizeMode: 'contain' },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center', alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(8),
    paddingBottom: hp(150),
    gap: hp(20),
  },

  // ── Upcoming card ──────────────────────────────
  upcomingCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
  upcomingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
  },

  apptListInner: {
    paddingHorizontal: wp(12),
    paddingBottom: hp(12),
    gap: hp(8),
  },

  apptInnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.APP_BACKGROUND,
    paddingVertical: hp(15),
  },
  apptLeft: {
    flex: 1,
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
  },
  apptVerticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.BORDER_COLOR,
  },
  apptRight: {
    width: wp(130),
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
    alignItems: 'flex-end',
  },
  apptDoctor: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
    marginBottom: hp(5),
  },
  apptMeta: {
    color: '#666666',
    marginBottom: 3,
  },
  patientLabel: {
    color: '#666666',
    marginBottom: hp(8),
  },
  apptPatient: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    textAlign: 'right',
  },

  // ── Stats ──────────────────────────────────────
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    overflow: 'hidden',
    backgroundColor: Colors.APP_BACKGROUND,
  },
  statItem: {
    flex: 1,
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: hp(12),
  },
  statLabel: { color: '#666666' },
  statNumber: { color: Colors.TEXT_COLOR, fontWeight: '700', marginTop: hp(4) },

  // ── Section header ─────────────────────────────
  recentSection: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  sectionTitle: { fontWeight: '700', color: '#1A1A1A' },

  // ── Recent Request ─────────────────────────────
  recentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.APP_BACKGROUND,
  },
  recentLeft: { flex: 1 },
})