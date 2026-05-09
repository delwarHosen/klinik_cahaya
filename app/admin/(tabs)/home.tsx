import { NotificationIcon } from '@/assets/icons/common_icon/Notification'
import { CustomButton } from '@/components/shared/CustomButton'
import PageLoader from '@/components/shared/PageLoader'
import { Body1, Caption1, Caption2, Caption4, H3, H6 } from '@/components/typo/Typography'
import { IMAGE_COMPONENTS } from '@/constants/image.index'
import { Colors } from '@/constants/theme'
import {
  useGetBookingCountQuery,
  useGetBookingRequestsQuery,
  useGetUpcomingAppointmentsQuery,
} from '@/redux/services/adminApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * "2026-05-07T19:00:00+08:00"
 * → "Today" | "Tomorrow" | "07 May 2026"
 */
function smartDateLabel(isoStart: string): string {
  const apptDay  = toMidnight(new Date(isoStart));
  const today    = toMidnight(new Date());
  const tomorrow = toMidnight(new Date(today.getTime() + 86_400_000));

  if (apptDay.getTime() === today.getTime())    return 'Today';
  if (apptDay.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return new Date(isoStart).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** "2026-05-07T19:00:00+08:00" → "07:00 PM" */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-MY', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/** "2026-05-07" → "07 May 2026" */
function formatApptDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** "20:00" 24h → "08:00 PM" */
function formatApptTime(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  const h    = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminHomeScreen() {
  const router = useRouter()

  const { data: upcomingData, isLoading: upcomingLoading } = useGetUpcomingAppointmentsQuery();
  const { data: requestData,  isLoading: requestLoading  } = useGetBookingRequestsQuery();
  const { data: countData,    isLoading: countLoading    } = useGetBookingCountQuery();

  const isLoading = upcomingLoading || requestLoading || countLoading;

  const upcomingList = (upcomingData?.results ?? []).filter((r: any) => !!r.start);
  const pendingList  = (requestData?.results  ?? []).filter((r: any) => r.status === 'pending');

  const totalBooking   = countData?.total ?? 0;
  const confirmedCount = countData?.status_counts?.confirmed ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PageLoader visible={isLoading} title="LOADING" subtitle="Fetching dashboard data..." />

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
            <TouchableOpacity onPress={() => router.push('/admin/(tabs)/apointment' as any)}>
              <Caption4 color='#666666'>View All</Caption4>
            </TouchableOpacity>
          </View>

          <View style={styles.apptListInner}>
            {upcomingList.slice(0, 5).map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.apptInnerCard}
                activeOpacity={0.75}
                onPress={() =>
                  router.push({
                    pathname: '/admin/appointments/appintment_status_details' as any,
                    params: { appointmentId: item.id },
                  })
                }
              >
                <View style={styles.apptLeft}>
                  <Caption1 weight='semiBold' style={styles.apptDoctor} numberOfLines={1}>
                    {item.provider?.name ?? '-'}
                  </Caption1>
                 
                  <Caption4 style={styles.apptMeta}>
                    {`${formatTime(item.start)} | ${smartDateLabel(item.start)}`}
                  </Caption4>
                </View>

                <View style={styles.apptVerticalDivider} />

                <View style={styles.apptRight}>
                  <Caption4 style={styles.patientLabel}>Patient</Caption4>
                  <Caption2 style={styles.apptPatient} numberOfLines={1}>
                    {item.lead?.name ?? '-'}
                  </Caption2>
                </View>
              </TouchableOpacity>
            ))}

            {upcomingList.length === 0 && !isLoading && (
              <View style={styles.emptyInner}>
                <Caption4 color="#999">No upcoming appointments</Caption4>
              </View>
            )}
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Caption4 style={styles.statLabel}>Total Booking</Caption4>
            <H3 style={styles.statNumber}>{totalBooking}</H3>
          </View>
          <View style={styles.statDivider} />
          <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
            <Caption4 style={styles.statLabel}>Confirmed</Caption4>
            <H3 style={styles.statNumber}>{confirmedCount}</H3>
          </View>
        </View>

        {/* ── Recent Request ── */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <H6 style={styles.sectionTitle}>Recent Request</H6>
            <TouchableOpacity onPress={() => router.push('/admin/(tabs)/details' as any)}>
              <Caption4 color='#666666'>View All</Caption4>
            </TouchableOpacity>
          </View>

          {pendingList.slice(0, 3).map((item: any, index: number) => (
            <View
              key={item.id}
              style={[
                styles.recentCard,
                index < Math.min(pendingList.length, 3) - 1 && { marginBottom: hp(12) },
              ]}
            >
              <View style={styles.recentLeft}>
                <Caption1 weight='semiBold' style={styles.apptDoctor} numberOfLines={1}>
                  {item.doctor_name}
                </Caption1>
                <Caption4 style={styles.apptMeta}>{formatApptTime(item.appt_time)}</Caption4>
                <Caption4 style={styles.apptMeta}>{formatApptDate(item.appt_date)}</Caption4>
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

          {pendingList.length === 0 && !isLoading && (
            <View style={styles.emptyInner}>
              <Caption4 color="#999">No pending requests</Caption4>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  recentSection: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  sectionTitle: { fontWeight: '700', color: '#1A1A1A' },
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

  emptyInner: {
    alignItems: 'center',
    paddingVertical: hp(16),
  },
})