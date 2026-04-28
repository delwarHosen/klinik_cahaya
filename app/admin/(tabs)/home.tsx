// app/admin/(tabs)/home.tsx
import { NotificationIcon } from '@/assets/icons/common_icon/Notification'
import { Caption1, Caption4, H3, H6 } from '@/components/typo/Typography'
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
      {/* Header */}
      <View style={styles.header}>
        <Image source={IMAGE_COMPONENTS.logo} style={styles.logo} />
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/admin/notification' as any)}>
          <NotificationIcon />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Upcoming Appointment Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <H6 style={styles.cardTitle}>Upcoming Appointment</H6>
            <TouchableOpacity onPress={() => router.push('/admin/appointments/appointments' as any)}>
              <Caption1 style={styles.viewAll}>View All</Caption1>
            </TouchableOpacity>
          </View>

          {upcomingList.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.appointmentRow, index < upcomingList.slice(0, 5).length - 1 && styles.appointmentRowBorder]}
              activeOpacity={0.75}
              onPress={() => router.push({ pathname: '/admin/appointments/appointment_details' as any, params: { id: item.id } })}
            >
              <View style={styles.apptLeft}>
                <Caption1 style={styles.apptDoctor}>{item.doctorName}</Caption1>
                <Caption4 style={styles.apptMeta}>{item.time} | {item.displayDate}</Caption4>
              </View>
              <View style={styles.apptRight}>
                <Caption4 style={styles.patientLabel}>Patient</Caption4>
                <Caption1 style={styles.apptPatient} numberOfLines={1}>{item.patientName}</Caption1>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Caption1 style={styles.statLabel}>Booking Request</Caption1>
            <H3 style={styles.statNumber}>{BOOKING_STATS.bookingRequest}</H3>
          </View>
          <View style={[styles.statCard, styles.statCardBorder]}>
            <Caption1 style={[styles.statLabel, { textAlign: 'right' }]}>Accepted</Caption1>
            <H3 style={[styles.statNumber, { textAlign: 'right' }]}>{BOOKING_STATS.accepted}</H3>
          </View>
        </View>

        {/* Recent Request */}
        <View style={styles.sectionHeader}>
          <H6 style={styles.sectionTitle}>Recents Request</H6>
          <TouchableOpacity onPress={() => router.push('/admin/appointments/pending_request' as any)}>
            <Caption1 style={styles.viewAll}>View All</Caption1>
          </TouchableOpacity>
        </View>

        {pendingList.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.requestCard}>
            <View style={styles.requestLeft}>
              <Caption1 style={styles.apptDoctor}>{item.doctorName}</Caption1>
              <Caption4 style={styles.apptMeta}>{item.time}</Caption4>
              <Caption4 style={styles.apptMeta}>{item.displayDate}</Caption4>
            </View>
            <TouchableOpacity
              style={styles.viewBtn}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/admin/appointments/appointment_details' as any, params: { id: item.id } })}
            >
              <Caption1 style={styles.viewBtnText}>View</Caption1>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
  },
  logo: {
    height: hp(54),
    width: wp(138),
    resizeMode: 'contain'
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(150),
    gap: 16
  },

  // Upcoming card
  card: { borderRadius: 16, borderWidth: 1, borderColor: '#EEEEEE', overflow: 'hidden' },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(16), paddingVertical: hp(14),
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  cardTitle: { fontWeight: '700', color: '#1A1A1A' },
  viewAll: { color: '#AAAAAA', fontSize: 12 },
  appointmentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(16), paddingVertical: hp(12),
  },
  appointmentRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  apptLeft: { flex: 1 },
  apptRight: { alignItems: 'flex-end' },
  apptDoctor: { color: Colors.BRAND_PRIMARY, fontWeight: '600', fontSize: 13 },
  apptMeta: { color: '#888888', fontSize: 11, marginTop: 2 },
  patientLabel: { color: '#AAAAAA', fontSize: 10 },
  apptPatient: { color: '#1A1A1A', fontWeight: '600', fontSize: 13 },

  // Stats
  statsRow: {
    flexDirection: 'row', borderRadius: 16,
    borderWidth: 1, borderColor: '#EEEEEE', overflow: 'hidden',
  },
  statCard: { flex: 1, paddingHorizontal: wp(20), paddingVertical: hp(16) },
  statCardBorder: { borderLeftWidth: 1, borderLeftColor: '#EEEEEE' },
  statLabel: { color: '#888888', fontSize: 12 },
  statNumber: { color: '#1A1A1A', fontWeight: '700', marginTop: hp(4) },

  // Recent Request
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontWeight: '700', color: '#1A1A1A' },
  requestCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: hp(14), paddingHorizontal: wp(4),
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  requestLeft: { flex: 1 },
  viewBtn: {
    backgroundColor: Colors.BRAND_PRIMARY, borderRadius: 10,
    paddingHorizontal: wp(20), paddingVertical: hp(12),
  },
  viewBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
})