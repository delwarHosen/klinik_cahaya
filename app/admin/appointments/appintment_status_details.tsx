import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, SpecialText } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetAppointmentLookupMutation } from '@/redux/services/adminApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Static placeholder (replace with API later) 
const STATIC_MEDICAL = {
  bloodGroup: 'A+',
  allergies: 'Food Allergies, Seasonal Allergies, Pet Allergies',
  medicalCondition: 'Asthma, Hypertension',
  medication: 'Cetirizine (Zyrtec)',
}

const STATIC_INSURANCE = {
  provider: 'AIA Malaysia',
  planType: 'A-Plus Med',
  memberId: 'AIA-MY-123456789',
}

// ─── Status config 
const getStatusConfig = (status?: string) => {
  const s = status?.toLowerCase()
  switch (s) {
    case 'completed':
    case 'received':
      return { label: 'Completed', color: '#FFFFFF', bg: Colors.BRAND_PRIMARY }
    case 'cancelled':
    case 'cancel':
    case 'rejected':
    case 'reject':
      return { label: 'Cancelled', color: '#FFFFFF', bg: '#FF383C' }
    case 'absent':
      return { label: 'Absent', color: '#FFFFFF', bg: '#888888' }
    case 'new':
    case 'upcoming':
    default:
      return { label: status ?? 'Upcoming', color: '#1A1A1A', bg: '#E0E0E0' }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDisplayDate = (iso: string | null | undefined) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
    })
  } catch { return iso }
}

const formatDisplayTime = (iso: string | null | undefined) => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM'
    return `${String(h % 12 || 12).padStart(2, '0')}:${m} ${ampm}`
  } catch { return '' }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AppointmentStatusScreen() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>()
  const [getLookup, { data, isLoading }] = useGetAppointmentLookupMutation()

  // console.log("medical and insurence info",data)

  useEffect(() => {
    if (appointmentId) getLookup({ appointment_id: appointmentId })
  }, [appointmentId])

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.headerWrapper}>
          <SectionTitle title="Details" />
        </View>
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
        </View>
      </SafeAreaView>
    )
  }

  const { appointment, doctor, normalized_appointment, patient } = data

  // ── Status ────────────────────────────────────────────────────────────────
  const rawStatus = normalized_appointment?.display_status || appointment.status
  const cfg = getStatusConfig(rawStatus)
  const isCompleted = ['completed', 'received'].includes(rawStatus?.toLowerCase() ?? '')

  // ── Patient relation ──────────────────────────────────────────────────────
  const patientFor = normalized_appointment?.patient_for
    ?? patient?.normalized_patient?.patient_for
    ?? 'self'
  const isSelf   = patientFor === 'self'
  const relation = isSelf ? 'Own Self' : (patientFor || 'Other')

  // ── Date / time from display_datetime ────────────────────────────────────
  // format: "10:00 AM | September 16, 2024 (Monday)"
  const displayDatetime = normalized_appointment?.display_datetime ?? ''
  let datePart = ''
  let timePart = ''
  if (displayDatetime.includes('|')) {
    const parts = displayDatetime.split('|').map((s: string) => s.trim())
    timePart = parts[0]  // "10:00 AM"
    datePart = parts[1]  // "September 16, 2024 (Monday)"
  } else {
    datePart = formatDisplayDate(appointment.start)
    timePart = formatDisplayTime(appointment.start)
  }

  // ── Patient info
  const patientName  = patient?.normalized_patient?.patient_name ?? appointment.lead?.name ?? '—'
  const patientIC    = appointment.patient?.ic    ?? patient?.yezza_patient_id?.ic    ?? 'N/A'
  const patientPhone = appointment.patient?.phone ?? patient?.yezza_patient_id?.phone ?? 'N/A'
  const patientEmail = appointment.patient?.email ?? patient?.yezza_patient_id?.email ?? ''

  // ── Booked by ─────────────────────────────────────────────────────────────
  const bookedByName  = patient?.normalized_patient?.booked_by_name
    ?? (appointment.booked_by
      ? `${appointment.booked_by.first_name} ${appointment.booked_by.last_name}`.trim()
      : null)
  const bookedByPhone = patient?.normalized_patient?.booked_by_phone ?? ''

  // ── Visit reason ──────────────────────────────────────────────────────────
  const visitReason = appointment.services?.[0]?.name
    ?? normalized_appointment?.reason
    ?? 'General Consultation'
  const visitDetail = normalized_appointment?.visit_reason_detail
    ?? appointment.lead?.remarks
    ?? ''

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerWrapper}>
        <SectionTitle title="Details" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Doctor Row ── */}
        <View style={styles.doctorRow}>
          {doctor.avatar_url ? (
            <Image source={{ uri: doctor.avatar_url }} style={styles.doctorImage} />
          ) : (
            <View style={[styles.doctorImage, { backgroundColor: '#dfefee' }]} />
          )}
          <View style={styles.doctorInfo}>
            <H3 style={styles.doctorName}>{doctor.full_name || doctor.name}</H3>
            <Caption1 style={styles.doctorSpecialty} numberOfLines={3}>
              {doctor.specialization}
            </Caption1>
          </View>
        </View>

        {/* ── Appointment Details ── */}
        <SpecialText style={styles.sectionTitle}>Appointment Details</SpecialText>

        <Caption1 style={styles.label}>Status</Caption1>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Caption2 style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Caption2>
          </View>
          <View style={styles.dateTimeBox}>
            <Caption2 weight='semiBold' style={styles.dateText}>{datePart}</Caption2>
            <Caption2 weight='semiBold' style={styles.dateText}>{timePart}</Caption2>
          </View>
        </View>

        {/* ── Visit Reason ── */}
        <Caption1 style={[styles.label, { marginTop: hp(20) }]}>Visit Reason</Caption1>
        <Caption2 weight='semiBold' style={styles.boldValue}>{visitReason}</Caption2>
        {visitDetail ? (
          <Caption2 style={styles.detailText}>{visitDetail}</Caption2>
        ) : null}

        {/* ── Patient section ── */}
        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>
          Patients{' '}
          <Caption1 style={{ color: Colors.PLACEHOLLDER_TEXT }}>({relation})</Caption1>
        </Caption2>

        {isSelf ? (
          // ── Own Self ──────────────────────────────────────────────────────
          <>
            <View style={styles.personCard}>
              <View style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption2 weight='semiBold'>{patientName}</Caption2>
                <Caption4 style={styles.personIC}>IC: {patientIC}</Caption4>
                <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>{patientPhone}</Caption4>
                {patientEmail ? (
                  <Caption4 style={styles.personMeta}>{patientEmail}</Caption4>
                ) : null}
              </View>
            </View>

            {/* <ExpandableSection title="Medical Information">
              <InfoRow label="Blood Group"       value={STATIC_MEDICAL.bloodGroup} />
              <InfoRow label="Allergies"         value={STATIC_MEDICAL.allergies} />
              <InfoRow label="Medical Condition" value={STATIC_MEDICAL.medicalCondition} />
              <InfoRow label="Medication"        value={STATIC_MEDICAL.medication} />
            </ExpandableSection>

            <ExpandableSection title="Insurance Information">
              <InfoRow label="Provider"  value={STATIC_INSURANCE.provider} />
              <InfoRow label="Plan Type" value={STATIC_INSURANCE.planType} />
              <InfoRow label="Member ID" value={STATIC_INSURANCE.memberId} />
            </ExpandableSection> */}
          </>
        ) : (
          // ── Family / Other ─────────────────────────────────────────────────
          <>
            <Caption1 style={styles.boldValue}>{patientName}</Caption1>

            {/* <ExpandableSection title="Medical Information">
              <InfoRow label="Blood Group"       value={STATIC_MEDICAL.bloodGroup} />
              <InfoRow label="Allergies"         value={STATIC_MEDICAL.allergies} />
              <InfoRow label="Medical Condition" value={STATIC_MEDICAL.medicalCondition} />
              <InfoRow label="Medication"        value={STATIC_MEDICAL.medication} />
            </ExpandableSection>

            <ExpandableSection title="Insurance Information">
              <InfoRow label="Provider"  value={STATIC_INSURANCE.provider} />
              <InfoRow label="Plan Type" value={STATIC_INSURANCE.planType} />
              <InfoRow label="Member ID" value={STATIC_INSURANCE.memberId} />
            </ExpandableSection> */}

            {/* Booked By — only when completed */}
            {isCompleted && bookedByName && (
              <>
                <Caption2 style={[styles.label, { marginTop: hp(16) }]}>Booked By</Caption2>
                <View style={styles.personCard}>
                  <View style={styles.personAvatar} />
                  <View style={styles.personInfo}>
                    <Caption2 weight='semiBold'>
                      {bookedByName}{' '}
                      <Caption1 style={{ color: '#888' }}>(Male)</Caption1>
                    </Caption2>
                    {bookedByPhone ? (
                      <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>{bookedByPhone}</Caption4>
                    ) : null}
                  </View>
                </View>
              </>
            )}
          </>
        )}


        {/* Booked By for Own Self + Completed */}
        {isSelf && isCompleted && bookedByName && (
          <>
            <Caption2 style={[styles.label, { marginTop: hp(16) }]}>Booked By</Caption2>
            <View style={styles.personCard}>
              <View style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption2 weight='semiBold'>{bookedByName}</Caption2>
                {bookedByPhone ? (
                  <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>{bookedByPhone}</Caption4>
                ) : null}
              </View>
            </View>
          </>
        )}

      </ScrollView>
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
  headerWrapper: {
    paddingTop: hp(4),
    marginBottom: hp(8),
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: hp(40),
  },

  // ── Doctor ──
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(14),
    marginTop: hp(10),
    marginBottom: hp(24),
  },
  doctorImage: {
    width: wp(80),
    height: hp(80),
    borderRadius: 12,
    backgroundColor: '#dfefee',
  },
  doctorInfo: {
    flex: 1,
    gap: 4,
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '700',
  },
  doctorSpecialty: {
    color: '#818181',
    lineHeight: 18,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_COLOR,
    marginBottom: hp(16),
  },
  label: {
    color: Colors.TEXT_COLOR,
    marginBottom: hp(6),
    fontSize: 14,
  },

  // ── Status row ──
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: hp(8),
  },
  statusBadge: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: 8,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 13,
  },
  dateTimeBox: {
    alignItems: 'flex-end',
    gap: hp(2),
  },
  dateText: {
    color: Colors.TEXT_COLOR,
    fontSize: 13,
  },

  // ── Content ──
  boldValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: hp(8),
  },
  detailText: {
    color: '#555',
    lineHeight: 22,
    marginBottom: hp(8),
  },

  // ── Person card ──
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: '#F8F8F8',
    padding: wp(14),
    marginTop: hp(8),
    marginBottom: hp(4),
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dfefee',
  },
  personInfo: {
    flex: 1,
    gap: 3,
  },
  personIC: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
  },
  personMeta: {
    color: '#9C9C9C',
  },
})