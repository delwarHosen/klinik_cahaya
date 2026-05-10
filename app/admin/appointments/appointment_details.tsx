import { BookingConfirmedModal } from '@/components/appointment/BookingConfirmedModal'
import { ExpandableSection, InfoRow } from '@/components/appointment/ExpandableSection'
import { RejectConfirmModal } from '@/components/appointment/RejectConfirmModal'
import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal'
import { CustomButton } from '@/components/shared/CustomButton'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, H6, SpecialText } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import {
  useGetBookingLookupQueryQuery,
  useGetStatusChangesMutation,
  useRescheduleBookingMutation,
} from '@/redux/services/adminApi'
import { useGetDoctorAvailabilityQuery } from '@/redux/services/bookingApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  confirmed:   { label: 'Upcoming',    color: '#1A1A1A', bg: '#F0F0F0',            border: '#CCCCCC' },
  pending:     { label: 'Pending',     color: '#1A1A1A', bg: '#D4F000',            border: '#D4F000' },
  completed:   { label: 'Completed',   color: '#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
  canceled:    { label: 'Canceled',    color: '#FFFFFF', bg: '#FF383C',            border: '#FF383C' },
  rejected:    { label: 'Canceled',    color: '#FFFFFF', bg: '#FF383C',            border: '#FF383C' },
  expired:     { label: 'Expired',     color: '#FFFFFF', bg: '#AAAAAA',            border: '#AAAAAA' },
  rescheduled: { label: 'Rescheduled', color: '#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return dateStr }
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return 'N/A'
  try {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 || 12}:${m} ${ampm}`
  } catch { return timeStr }
}

// ─── Reschedule Reason Modal ──────────────────────────────────────────────────
interface ReasonModalProps {
  visible: boolean
  date: string
  time: string
  onBack: () => void
  onConfirm: (reason: string) => void
  isLoading: boolean
}

function RescheduleReasonModal({ visible, date, time, onBack, onConfirm, isLoading }: ReasonModalProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason.trim() || `Rescheduled to ${date} at ${formatTime(time)}`)
    setReason('')
  }

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={rm.backdrop}>
        <View style={rm.card}>
          <H6 style={rm.title}>Reschedule Reason</H6>
          <Caption2 style={rm.subtitle}>
            {formatDate(date)}  ·  {formatTime(time)}
          </Caption2>

          <Caption1 style={rm.label}>Message to patient (optional)</Caption1>
          <TextInput
            style={rm.input}
            placeholder="e.g. The doctor is available after 10:00 AM on this date."
            placeholderTextColor="#AAAAAA"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
          />

          <View style={rm.btnRow}>
            <TouchableOpacity style={rm.cancelBtn} onPress={onBack} disabled={isLoading}>
              <Caption1 style={rm.cancelText}>Back</Caption1>
            </TouchableOpacity>
            <TouchableOpacity
              style={[rm.okBtn, isLoading && rm.okBtnDisabled]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading
                ? <ActivityIndicator color="#FFF" size="small" />
                : <Caption1 style={rm.okText}>Confirm</Caption1>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AppointmentDetailsScreen() {
  const router = useRouter()
  const { bookingId, id } = useLocalSearchParams<{ bookingId?: string; id?: string }>()
  const resolvedId = bookingId ?? id ?? ''

  const { data, isLoading, error } = useGetBookingLookupQueryQuery(resolvedId, {
    skip: !resolvedId,
  })
  const [changeStatus, { isLoading: isChanging }] = useGetStatusChangesMutation()
  const [reschedule, { isLoading: isRescheduling }] = useRescheduleBookingMutation()

  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showConfirmed, setShowConfirmed] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [pickedDate, setPickedDate] = useState('')
  const [pickedTime, setPickedTime] = useState('')

  // ── Doctor availability — needed for DateTimePickerModal ──
  const doctorId = data?.doctor?.id ?? ''
  const { data: availData } = useGetDoctorAvailabilityQuery(doctorId, {
    skip: !doctorId,
  })

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <SectionTitle title="Appointment Details" />
        <View style={styles.loadingBox}><CustomLoader size={50} /></View>
      </SafeAreaView>
    )
  }

  if (error || !data || !data.booking) {
    return (
      <SafeAreaView style={styles.container}>
        <SectionTitle title="Appointment Details" />
        <View style={styles.loadingBox}><H3>Data not found or error occurred</H3></View>
      </SafeAreaView>
    )
  }

  const booking     = data.booking
  const doctor      = data.doctor
  const patientInfo = data.patient?.requested_patient

  const cfg        = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['confirmed']
  const isPending  = booking.status === 'pending'
  const isCanceled = booking.status === 'rejected' || booking.status === 'canceled'

  // ── Accept ──
  const handleAccept = async () => {
    try {
      await changeStatus({ booking_id: resolvedId, status: 'confirmed' }).unwrap()
      setShowConfirmed(true)
      setTimeout(() => { setShowConfirmed(false); router.back() }, 2000)
    } catch (err) { console.log('Accept error:', err) }
  }

  // ── Reject ──
  const handleReject = async () => {
    try {
      await changeStatus({ booking_id: resolvedId, status: 'rejected' }).unwrap()
      setShowRejectConfirm(false)
      router.back()
    } catch (err) { console.log('Reject error:', err) }
  }

  // ── Reschedule Step 1 — date & time picked ──
  const handleDateTimeConfirm = (date: string, time: string) => {
    setPickedDate(date)
    setPickedTime(time)
    setShowDatePicker(false)
    setShowReasonModal(true)
  }

  // ── Reschedule Step 2 — reason confirmed ──
  const handleReasonConfirm = async (reason: string) => {
    try {
      await reschedule({
        booking_id: resolvedId,
        appt_date: pickedDate,
        appt_time: pickedTime,
        reschedule_suggestion: reason,
      }).unwrap()
      setShowReasonModal(false)
      router.back()
    } catch (err) { console.log('Reschedule error:', err) }
  }

  const maxDate = availData?.max_date ?? ''
  const availability = availData?.availability ?? []

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
          {doctor?.avatar_url
            ? <Image source={{ uri: doctor.avatar_url }} style={styles.doctorImage} />
            : <View style={[styles.doctorImage, { backgroundColor: '#dfefee' }]} />
          }
          <View style={styles.doctorInfo}>
            <H3 style={styles.doctorName}>{doctor?.full_name || doctor?.name || 'N/A'}</H3>
            <Caption1 style={styles.doctorSpecialty} numberOfLines={4}>
              {doctor?.specialization || 'General Physician'}
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
                <Caption2 style={styles.rejectedBoxValue}>{booking.approved_by ?? 'Admin'}</Caption2>
                <Caption4 style={styles.rejectedBoxMeta}>ID: {patientInfo?.ic || booking.patient_ic}</Caption4>
                <Caption4 style={styles.rejectedBoxMeta}>
                  {booking.approved_at ? formatDate(booking.approved_at) : formatDate(booking.appt_date)}
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
        <Caption2 weight='regular' style={[styles.label, { marginTop: hp(20) }]}>Visit Reason</Caption2>
        <Caption2 weight='semiBold' style={styles.boldValue}>
          {booking.reason || 'No reason provided'}
        </Caption2>

        {/* ── Patient Info ── */}
        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>Patient</Caption2>
        <View style={styles.personCard}>
          <View style={styles.personAvatar} />
          <View style={styles.personInfo}>
            <Caption2 weight='semiBold'>{patientInfo?.name ?? booking.patient_name}</Caption2>
            <Caption4 style={styles.personIC}>IC: {patientInfo?.ic ?? booking.patient_ic}</Caption4>
            <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>
              +{String(patientInfo?.phone ?? booking.patient_phone ?? '')}
            </Caption4>
          </View>
        </View>

        {/* ── Doctor Consultation Info ── */}
        {doctor?.consultation_days && (
          <ExpandableSection title="Consultation Info">
            <InfoRow label="Days" value={doctor.consultation_days} />
            <InfoRow label="Hours" value={doctor.consultation_time} />
            <InfoRow label="About" value={doctor.about} />
          </ExpandableSection>
        )}

        {/* ── Action Buttons ── */}
        {isPending && (
          <View style={styles.actionsSection}>
            <View style={styles.rejectAcceptRow}>
              <CustomButton
                title='Reject'
                onPress={() => setShowRejectConfirm(true)}
                backgroundColor={Colors.APP_BACKGROUND}
                borderColor={"#FF383C1A"}
                borderRadius={12} width={"48%"} height={50}
                color={"#FF383C"}
                isLoading={isChanging}
              />
              <CustomButton
                title='Accept'
                onPress={handleAccept}
                backgroundColor={Colors.BRAND_PRIMARY}
                borderRadius={12} width={"48%"} height={50}
                isLoading={isChanging}
              />
            </View>
            <CustomButton
              title='Reschedule'
              onPress={() => setShowDatePicker(true)}
              backgroundColor={Colors.APP_BACKGROUND}
              borderColor={Colors.BORDER_COLOR}
              borderRadius={12} width={"100%"} height={50}
              color={Colors.TEXT_COLOR}
            />
          </View>
        )}
      </ScrollView>

      {/* ── Modals ── */}
      <RejectConfirmModal
        visible={showRejectConfirm}
        onCancel={() => setShowRejectConfirm(false)}
        onReject={handleReject}
      />
      <BookingConfirmedModal
        visible={showConfirmed}
        doctorName={doctor?.full_name || doctor?.name || ''}
        onClose={() => setShowConfirmed(false)}
      />

      {/* ── Step 1: Date & Time Picker ── */}
      <DateTimePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateTimeConfirm}
        availability={availability}
        maxDate={maxDate}
        consultationTime={doctor?.consultation_time ?? ''}
      />

      {/* ── Step 2: Reschedule Reason ── */}
      <RescheduleReasonModal
        visible={showReasonModal}
        date={pickedDate}
        time={pickedTime}
        onBack={() => { setShowReasonModal(false); setShowDatePicker(true) }}
        onConfirm={handleReasonConfirm}
        isLoading={isRescheduling}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20), flexDirection: 'column' },
  flex: { flex: 1 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerWrapper: { paddingTop: hp(4), marginBottom: hp(16) },
  scrollContent: { paddingBottom: hp(40) },
  doctorRow: { flexDirection: 'column', alignItems: 'center', gap: hp(10), marginTop: hp(10), marginBottom: hp(24) },
  doctorImage: { width: wp(100), height: hp(100), borderRadius: 16, backgroundColor: '#dfefee' },
  doctorInfo: { alignItems: 'center', gap: 4 },
  doctorName: { color: Colors.BRAND_PRIMARY, fontWeight: '700' },
  doctorSpecialty: { color: '#818181', lineHeight: 18, fontWeight: '700', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '500', color: Colors.TEXT_COLOR, marginBottom: hp(16) },
  label: { color: Colors.TEXT_COLOR, marginBottom: hp(6) },
  statusRow: { flexDirection: 'column', alignItems: 'flex-start', gap: hp(8), marginBottom: hp(16) },
  statusBadge: { paddingHorizontal: wp(16), paddingVertical: hp(8), borderRadius: 10, borderWidth: 0.5 },
  statusText: { fontWeight: '700', fontSize: 13 },
  dateText: { color: Colors.TEXT_COLOR, fontWeight: '600', marginBottom: 2 },
  rejectedBox: { backgroundColor: '#FFF0F0', borderRadius: 12, borderWidth: 1, borderColor: '#FFD0D0', padding: wp(14), marginBottom: hp(8) },
  rejectedBoxRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rejectedBoxLabel: { color: '#FF383C', marginBottom: 2, fontWeight: '600' },
  rejectedBoxValue: { color: Colors.TEXT_COLOR, fontWeight: '600' },
  rejectedBoxMeta: { color: '#888' },
  rejectedReasonText: { color: '#FF383C', fontWeight: '600', textAlign: 'right' },
  boldValue: { color: Colors.TEXT_COLOR, fontWeight: '700', fontSize: 14, marginBottom: hp(8) },
  personCard: { flexDirection: 'row', alignItems: 'center', gap: wp(12), borderRadius: 24, borderWidth: 1, borderColor: Colors.BORDER_COLOR, backgroundColor: '#F8F8F8', padding: wp(14), marginTop: hp(8) },
  personAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#dfefee' },
  personInfo: { flex: 1, gap: 3 },
  personIC: { color: Colors.BRAND_PRIMARY },
  actionsSection: { marginTop: hp(24), gap: hp(12) },
  rejectAcceptRow: { flexDirection: 'row', gap: hp(12) },
})

// ─── Reason Modal Styles ──────────────────────────────────────────────────────
const rm = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: wp(20) },
  card: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: wp(20), paddingTop: hp(24), paddingBottom: hp(20), width: '100%' },
  title: { textAlign: 'center', color: Colors.BRAND_PRIMARY, fontWeight: '700', fontSize: 18, marginBottom: hp(4) },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: hp(20) },
  label: { color: Colors.TEXT_COLOR, fontWeight: '600', marginBottom: hp(8) },
  input: {
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12,
    paddingHorizontal: wp(14), paddingVertical: hp(12),
    fontSize: 13, color: '#333', minHeight: hp(100),
    textAlignVertical: 'top', marginBottom: hp(20),
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Poppins_400Regular',
  },
  btnRow: { flexDirection: 'row', gap: wp(12) },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: '#CCC', borderRadius: 100, paddingVertical: hp(14), alignItems: 'center' },
  cancelText: { color: '#333', fontWeight: '500' },
  okBtn: { flex: 1, backgroundColor: Colors.BRAND_PRIMARY, borderRadius: 100, paddingVertical: hp(14), alignItems: 'center' },
  okText: { color: '#FFF', fontWeight: '600' },
  okBtnDisabled: { opacity: 0.5 },
})