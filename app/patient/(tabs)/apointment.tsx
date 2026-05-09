import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body2, Caption1, Caption3, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetAppointmentsByPhoneQuery } from '@/redux/services/appointmentsApi';
import { useGetProfileQuery } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabType = 'Upcoming' | 'Completed' | 'Canceled';

interface DoctorInfo {
  id: string;
  name: string;
  full_name: string;
  avatar_url: string;
  specialization: string;
}

interface Appointment {
  id: string | number;
  date: string;
  time: string;
  doctor_name: string;
  doctor_phone: number;
  patient_name: string;
  patient_phone: number | string;
  reason: string | null;
  status: string;
  created_at: string;
  source: string;
  doctor_id: string;
  doctor_info?: DoctorInfo;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

/**
 * Maps API status + date → UI tab.
 * Upcoming  = future date AND active status (new/received/pending/confirmed)
 * Completed = received/completed with past date
 * Canceled  = cancelled/canceled
 */
function mapStatus(apiStatus: string, dateStr: string): TabType {
  const s = apiStatus?.toLowerCase()

  // Canceled always goes to Canceled tab regardless of date
  if (s === 'cancelled' || s === 'canceled' || s === 'rejected' || s === 'reject') {
    return 'Canceled'
  }

  // Completed
  if (s === 'completed') return 'Completed'

  // For active statuses — check date
  if (s === 'new' || s === 'pending' || s === 'received' || s === 'confirmed') {
    const apptDate = new Date(dateStr)
    apptDate.setHours(0, 0, 0, 0)
    if (apptDate >= TODAY) return 'Upcoming'
    // Past date with received → treat as Completed
    return 'Completed'
  }

  // Default future
  return 'Upcoming'
}

/** "2026-05-19" + "22:00:00" → displayDate and displayTime */
function formatDateTime(date: string, time: string): { displayDate: string; displayTime: string } {
  try {
    const [year, month, day] = date.split('-').map(Number)
    const [hStr, mStr] = time.split(':')
    const h = parseInt(hStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 === 0 ? 12 : h % 12

    const dateObj = new Date(year, month - 1, day)
    const displayDate = dateObj.toLocaleDateString('en-MY', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    const displayTime = `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`
    return { displayDate, displayTime }
  } catch {
    return { displayDate: date, displayTime: time }
  }
}

// ─── Status badge style helpers ───────────────────────────────────────────────

const getStatusBg = (s: TabType) => {
  if (s === 'Upcoming') return Colors.ACCENT_YELLOW
  return 'transparent'
}

const getStatusBorderColor = (s: TabType) => {
  if (s === 'Completed') return Colors.BRAND_PRIMARY
  if (s === 'Canceled') return Colors.COLOR_DANGER
  return 'transparent'
}

const getStatusTextColor = (s: TabType) => {
  if (s === 'Upcoming') return '#000'
  if (s === 'Completed') return Colors.BRAND_PRIMARY
  if (s === 'Canceled') return Colors.COLOR_DANGER
  return '#666'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppointmentScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming')
  const router = useRouter()

  // ── Profile → phone ────────────────────────────────────────────────────────
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery({})
  const phone = profileData?.steps?.profile?.data?.phone ?? ''

  // ── Appointments ───────────────────────────────────────────────────────────
  const { data, isLoading: appointmentsLoading } = useGetAppointmentsByPhoneQuery(phone, {
    skip: !phone,
  })


  const isLoading = profileLoading || appointmentsLoading

  // Safely extract appointments array from any response shape
  const appointments: Appointment[] = Array.isArray(data?.appointments)
    ? data.appointments
    : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : []

  // Filter by tab — date-aware
  const filteredData = appointments.filter(
    (item) => mapStatus(item.status, item.date) === activeTab
  )

  // Sort upcoming by date ascending, others descending
  const sortedData = [...filteredData].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time}`).getTime()
    const db = new Date(`${b.date}T${b.time}`).getTime()
    return activeTab === 'Upcoming' ? da - db : db - da
  })

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <PageLoader
        visible={isLoading}
        title="LOADING"
        subtitle="Fetching your appointments..."
      />

      <SectionTitle title="Appointments" />

      {/* ── Tabs ── */}
      <View style={styles.tabContainer}>
        {(['Upcoming', 'Completed', 'Canceled'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Caption1
              weight="medium"
              color={activeTab === tab ? Colors.TEXT_WHITE : '#666'}
            >
              {tab}
            </Caption1>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── List ── */}
      <FlatList
        data={sortedData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const mapped = mapStatus(item.status, item.date)
          const { displayDate, displayTime } = formatDateTime(item.date, item.time)

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/patient/booking_appointment/appointment_details' as any,
                  params: { appointmentId: String(item.id), source: item.source },
                })
              }
            >
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  {/* Doctor name */}
                  <H6 color={Colors.TEXT_COLOR}>
                    {item.doctor_info?.full_name || item.doctor_name}
                  </H6>

                  {/* Reason */}
                  {item.reason ? (
                    <Caption3 color="#818181" numberOfLines={1} style={{ marginTop: 5 }}>
                      {item.reason}
                    </Caption3>
                  ) : null}

                  <View style={styles.infoRow}>
                    {/* Patient name */}
                    <Body2 color="#0D0D0D" style={{ marginTop: hp(8) }} weight="regular">
                      {item.patient_name}
                    </Body2>
                    {/* Date & Time */}
                    <Body1
                      weight="semiBold"
                      color={Colors.TEXT_COLOR}
                      numberOfLines={1}
                    >
                      {displayTime} | {displayDate}
                    </Body1>
                  </View>
                </View>

                {/* Status badge */}
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusBg(mapped),
                    borderWidth: mapped !== 'Upcoming' ? 1 : 0,
                    borderColor: getStatusBorderColor(mapped),
                  },
                ]}>
                  <Caption1 weight="regular" color={getStatusTextColor(mapped)}>
                    {mapped}
                  </Caption1>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Caption1 color="#999">No {activeTab} Appointments Found</Caption1>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: hp(10),
    gap: 5,
    borderRadius: 12,
    padding: 4,
    marginBottom: hp(20),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(12),
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
  },
  activeTab: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  listContent: {
    paddingBottom: hp(20),
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: wp(10),
    paddingVertical: hp(10),
    marginBottom: hp(16),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    marginTop: hp(5),
  },
  statusBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: 8,
    minWidth: wp(80),
    alignItems: 'center',
    marginLeft: wp(10),
  },
  emptyState: {
    alignItems: 'center',
    marginTop: hp(100),
  },
})