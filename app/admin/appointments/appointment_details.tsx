import { BookingConfirmedModal } from '@/components/appointment/BookingConfirmedModal'
import { ExpandableSection, InfoRow } from '@/components/appointment/ExpandableSection'
import { RejectConfirmModal } from '@/components/appointment/RejectConfirmModal'
import { RejectReasonModal } from '@/components/appointment/RejectReasonModal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, SpecialText } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetBookingLookupMutation } from '@/redux/services/adminApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Status badge config ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  confirmed:  { label: 'Upcoming',  color: '#1A1A1A', bg: '#F0F0F0',            border: '#CCCCCC' },
  pending:    { label: 'Pending',   color: '#1A1A1A', bg: '#D4F000',            border: '#D4F000' },
  completed:  { label: 'Completed', color: '#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
  canceled:   { label: 'Canceled',  color: '#FFFFFF', bg: '#FF383C',            border: '#FF383C' },
  rejected:   { label: 'Canceled',  color: '#FFFFFF', bg: '#FF383C',            border: '#FF383C' },
  expired:    { label: 'Expired',   color: '#FFFFFF', bg: '#AAAAAA',            border: '#AAAAAA' },
  rescheduled:{ label: 'Rescheduled',color:'#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
}

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return dateStr }
}

const formatTime = (timeStr: string) => {
  try {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 || 12}:${m} ${ampm}`
  } catch { return timeStr }
}

export default function AppointmentDetailsScreen() {
  const router = useRouter()
  // Accept bookingId (from new list) OR id (from old fake data paths)
  const { bookingId, id } = useLocalSearchParams<{ bookingId?: string; id?: string }>()
  const resolvedId = bookingId ?? id ?? ''

  const [getBookingLookup, { data, isLoading }] = useGetBookingLookupMutation()

  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showRejectReason, setShowRejectReason]   = useState(false)
  const [showConfirmed, setShowConfirmed]         = useState(false)

  useEffect(() => {
    if (resolvedId) {
      getBookingLookup({ booking_id: resolvedId })
    }
  }, [resolvedId])

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.headerWrapper}>
          <SectionTitle title="Appointment Details" />
        </View>
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
        </View>
      </SafeAreaView>
    )
  }

  const { booking, doctor, patient } = data
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['confirmed']

  const isPending  = booking.status === 'pending'
  const isCanceled = booking.status === 'rejected' || booking.status === 'canceled'

  // Patient info — from requested_patient (most common in this API)
  const patientInfo = patient.requested_patient

  const handleAccept = () => {
    setShowConfirmed(true)
    setTimeout(() => {
      setShowConfirmed(false)
      router.back()
    }, 2000)
  }

  const handleRejectStep1 = () => {
    setShowRejectConfirm(false)
    setShowRejectReason(true)
  }

  // After reject reason saved → go to canceled details page
  const handleSaveReason = (_reason: string, _note: string) => {
    setShowRejectReason(false)
    router.replace({
      pathname: '/admin/appointments/canceled_appointment_details' as any,
      params: { bookingId: resolvedId },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerWrapper}>
        <SectionTitle title="Appointment Detail" />
      </View>

      <ScrollView
        style={styles.flex}
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
            <Caption1 style={styles.doctorSpecialty} numberOfLines={4}>
              {doctor.specialization}
            </Caption1>
          </View>
        </View>

        {/* ── Appointment Details ── */}
        <SpecialText style={styles.sectionTitle}>Appointment Details</SpecialText>

        <Caption1 style={styles.label}>Status</Caption1>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
            <Caption1 style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Caption1>
          </View>
          <View>
            <Caption2 style={styles.dateText}>{formatDate(booking.appt_date)}</Caption2>
            <Caption2 style={styles.dateText}>{formatTime(booking.appt_time)}</Caption2>
          </View>
        </View>

        {/* ── Canceled Info Box ── */}
        {isCanceled && (
          <View style={styles.rejectedBox}>
            <View style={styles.rejectedBoxRow}>
              <View style={{ flex: 1 }}>
                <Caption4 style={styles.rejectedBoxLabel}>Rejected By</Caption4>
                <Caption2 style={styles.rejectedBoxValue}>
                  {booking.approved_by ?? 'Admin'}
                </Caption2>
                <Caption4 style={styles.rejectedBoxMeta}>ID: {patientInfo?.ic}</Caption4>
                <Caption4 style={styles.rejectedBoxMeta}>
                  {booking.approved_at ? formatDate(booking.approved_at) : booking.appt_date}
                </Caption4>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Caption4 style={styles.rejectedBoxLabel}>Reason</Caption4>
                <Caption2 style={styles.rejectedReasonText}>—</Caption2>
              </View>
            </View>
          </View>
        )}

        {/* ── Visit Reason ── */}
        <Caption2 weight='regular' style={[styles.label, { marginTop: hp(20) }]}>
          Visit Reason
        </Caption2>
        <Caption2 weight='semiBold' style={styles.boldValue}>{booking.reason}</Caption2>

        {/* ── Patient Info ── */}
        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>Patient</Caption2>

        <View style={styles.personCard}>
          <View style={styles.personAvatar} />
          <View style={styles.personInfo}>
            <Caption2 weight='semiBold'>
              {patientInfo?.name ?? booking.patient_name}
            </Caption2>
            <Caption4 style={styles.personIC}>IC: {patientInfo?.ic ?? booking.patient_ic}</Caption4>
            <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>
              +{String(patientInfo?.phone ?? booking.patient_phone)}
            </Caption4>
          </View>
        </View>

        {/* ── Doctor Consultation Info ── */}
        {doctor.consultation_days && (
          <ExpandableSection title="Consultation Info">
            <InfoRow label="Days"    value={doctor.consultation_days} />
            <InfoRow label="Hours"   value={doctor.consultation_time} />
            <InfoRow label="About"   value={doctor.about} />
          </ExpandableSection>
        )}

        {/* ── Action Buttons (Pending only) ── */}
        {isPending && (
          <View style={styles.actionsSection}>
            <View style={styles.rejectAcceptRow}>
              <CustomButton
                title='Reject'
                onPress={() => setShowRejectConfirm(true)}
                backgroundColor={Colors.APP_BACKGROUND}
                borderColor={"#FF383C1A"}
                borderRadius={12}
                width={"48%"}
                height={50}
                color={"#FF383C"}
              />
              <CustomButton
                title='Accept'
                onPress={handleAccept}
                backgroundColor={Colors.BRAND_PRIMARY}
                borderRadius={12}
                width={"48%"}
                height={50}
              />
            </View>
            <CustomButton
              title='Reschedule'
              onPress={() => {}}
              backgroundColor={Colors.APP_BACKGROUND}
              borderColor={Colors.BORDER_COLOR}
              borderRadius={12}
              width={"100%"}
              height={50}
              color={Colors.TEXT_COLOR}
            />
          </View>
        )}
      </ScrollView>

      {/* ── Modals ── */}
      <RejectConfirmModal
        visible={showRejectConfirm}
        onCancel={() => setShowRejectConfirm(false)}
        onReject={handleRejectStep1}
      />
      <BookingConfirmedModal
        visible={showConfirmed}
        doctorName={doctor.full_name || doctor.name}
        onClose={() => setShowConfirmed(false)}
      />
      <RejectReasonModal
        visible={showRejectReason}
        onCancel={() => setShowRejectReason(false)}
        onSave={handleSaveReason}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
    flexDirection: 'column',
  },
  flex: { flex: 1 },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    paddingTop: hp(4),
    marginBottom: hp(16),
  },
  scrollContent: {
    paddingBottom: hp(40),
  },
  doctorRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(10),
    marginTop: hp(10),
    marginBottom: hp(24),
  },
  doctorImage: {
    width: wp(100),
    height: hp(100),
    borderRadius: 16,
    backgroundColor: '#dfefee',
  },
  doctorInfo: {
    alignItems: 'center',
    gap: 4,
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '700',
  },
  doctorSpecialty: {
    color: '#818181',
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.TEXT_COLOR,
    marginBottom: hp(16),
  },
  label: {
    color: Colors.TEXT_COLOR,
    marginBottom: hp(6),
  },
  statusRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: hp(8),
    marginBottom: hp(16),
  },
  statusBadge: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: 10,
    borderWidth: 0.5,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 13,
  },
  dateText: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    marginBottom: 2,
  },
  rejectedBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD0D0',
    padding: wp(14),
    marginBottom: hp(8),
  },
  rejectedBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectedBoxLabel: {
    color: '#FF383C',
    marginBottom: 2,
    fontWeight: '600',
  },
  rejectedBoxValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
  },
  rejectedBoxMeta: {
    color: '#888',
  },
  rejectedReasonText: {
    color: '#FF383C',
    fontWeight: '600',
    textAlign: 'right',
  },
  rejectedNoteBox: {
    marginTop: hp(10),
    paddingTop: hp(10),
    borderTopWidth: 1,
    borderTopColor: '#FFD0D0',
  },
  rejectedNoteText: {
    color: Colors.TEXT_COLOR,
    lineHeight: 20,
  },
  boldValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: hp(8),
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: '#F8F8F8',
    padding: wp(14),
    marginTop: hp(8),
  },
  personAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#dfefee',
  },
  personInfo: {
    flex: 1,
    gap: 3,
  },
  personIC: {
    color: Colors.BRAND_PRIMARY,
  },
  personMeta: {
    color: '#9C9C9C',
  },
  actionsSection: {
    marginTop: hp(24),
    gap: hp(12),
  },
  rejectAcceptRow: {
    flexDirection: 'row',
    gap: hp(12),
  },
})