import { BookingConfirmedModal } from '@/components/appointment/BookingConfirmedModal'
import { ExpandableSection, InfoRow } from '@/components/appointment/ExpandableSection'
import { RejectConfirmModal } from '@/components/appointment/RejectConfirmModal'
import { RejectReasonModal } from '@/components/appointment/RejectReasonModal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, SpecialText } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, ImageSourcePropType, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const STATUS_CONFIG = {
  Upcoming: { label: 'Upcoming', color: '#1A1A1A', bg: '#F0F0F0', border: '#CCCCCC' },
  Pending: { label: 'Pending', color: '#1A1A1A', bg: '#D4F000', border: '#D4F000' },
  Completed: { label: 'Completed', color: '#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
  Canceled: { label: 'Canceled', color: '#FFFFFF', bg: '#FF383C', border: '#FF383C' },
}

const getImageSource = (img?: string | number): ImageSourcePropType => {
  if (!img) return { uri: '' }
  return typeof img === 'string' ? { uri: img } : (img as ImageSourcePropType)
}

export default function AppointmentDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const appt = ADMIN_APPOINTMENTS.find(a => a.id === id) ?? ADMIN_APPOINTMENTS[0]

  // Local override for status after action
  const [currentStatus, setCurrentStatus] = useState(appt.status)
  const [rejectedBy, setRejectedBy] = useState('')
  const [rejectedReason, setRejectedReason] = useState('')
  const [rejectedNote, setRejectedNote] = useState('')
  const [rejectedDate, setRejectedDate] = useState('')

  const cfg = STATUS_CONFIG[currentStatus]

  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [showConfirmed, setShowConfirmed] = useState(false)
  const [rescheduleVisible, setRescheduleVisible] = useState(false)

  const isPending = currentStatus === 'Pending'
  const isCanceled = currentStatus === 'Canceled'
  const isFamily = appt.patientType === 'Family Member'

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

  const handleSaveReason = (reason: string, note: string) => {
    setShowRejectReason(false)
    // Update local state to show rejected info on same page
    setCurrentStatus('Canceled')
    setRejectedBy('Admin')
    setRejectedReason(reason)
    setRejectedNote(note)
    const now = new Date()
    setRejectedDate(
      `${now.getDate()} ${now.toLocaleString('default', { month: 'long' })}, ${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    )
  }

  const handleRescheduleConfirm = (_date: string, _time: string) => {
    setRescheduleVisible(false)
    router.push({ pathname: '/admin/(tabs)/apointment' as any, params: { activeTab: 'Upcoming' } })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <View style={styles.headerWrapper}>
        <SectionTitle title="Appointment Details" />
      </View>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Doctor Row ── */}
        <View style={styles.doctorRow}>
          <Image source={getImageSource(appt.doctorImage)} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <H3 style={styles.doctorName}>{appt.doctorName}</H3>
            <Caption1 style={styles.doctorSpecialty} numberOfLines={4}>
              {appt.doctorSpecialty}
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
            <Caption2 style={styles.dateText}>{appt.date}</Caption2>
            <Caption2 style={styles.dateText}>{appt.time}</Caption2>
          </View>
        </View>

        {/* ── Rejected Info Box (shows after reject or if already canceled) ── */}
        {isCanceled && (rejectedBy || appt.canceledReason) && (
          <View style={styles.rejectedBox}>
            <View style={styles.rejectedBoxRow}>
              <View style={{ flex: 1 }}>
                <Caption4 style={styles.rejectedBoxLabel}>Rejected By</Caption4>
                <Caption2 style={styles.rejectedBoxValue}>
                  {rejectedBy || 'Admin'}
                </Caption2>
                <Caption4 style={styles.rejectedBoxMeta}>
                  ID: {appt.patientIC}
                </Caption4>
                <Caption4 style={styles.rejectedBoxMeta}>
                  {rejectedDate || appt.date} {appt.time}
                </Caption4>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Caption4 style={styles.rejectedBoxLabel}>Reason</Caption4>
                <Caption2 style={styles.rejectedReasonText}>
                  {rejectedReason || appt.canceledReason || '—'}
                </Caption2>
              </View>
            </View>
            {rejectedNote ? (
              <View style={styles.rejectedNoteBox}>
                <Caption4 style={styles.rejectedBoxLabel}>Note</Caption4>
                <Caption2 style={styles.rejectedNoteText}>{rejectedNote}</Caption2>
              </View>
            ) : null}
          </View>
        )}

        <Caption2 weight='regular' style={[styles.label, { marginTop: hp(20) }]}>Visit Reason</Caption2>
        <Caption2 weight='semiBold' style={styles.boldValue}>{appt.visitReason}</Caption2>
        <Caption2 weight='regular' style={styles.detailText}>{appt.details}</Caption2>

        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>
          Patients{' '}
          <Caption1 style={{ color: Colors.PLACEHOLLDER_TEXT }}>({appt.patientType})</Caption1>
        </Caption2>

        {/* ── Patient Info ── */}
        {!isFamily ? (
          <>
            <View style={styles.personCard}>
              <Image source={getImageSource(appt.patientImage)} style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption2 weight='semiBold'>
                  {appt.patientName}{' '}
                  <Caption1 style={{ color: '#0D0D0D4D' }}>({appt.patientGender})</Caption1>
                </Caption2>
                <Caption4 style={styles.personIC}>IC: {appt.patientIC}</Caption4>
                <Caption4 style={styles.personMeta}>
                  {appt.patientDOB} <Caption4>({appt.patientAge})</Caption4>
                </Caption4>
                <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>{appt.patientPhone}</Caption4>
              </View>
            </View>

            <ExpandableSection title="Medical Information">
              <InfoRow label="Blood Group" value={appt.medicalInfo.bloodGroup} />
              <InfoRow label="Allergies" value={appt.medicalInfo.allergies} />
              <InfoRow label="Medical Condition" value={appt.medicalInfo.medicalCondition} />
              <InfoRow label="Medication" value={appt.medicalInfo.medication} />
            </ExpandableSection>

            <ExpandableSection title="Insurance Information">
              <InfoRow label="Provider" value={appt.insuranceInfo.provider} />
              <InfoRow label="Plan Type" value={appt.insuranceInfo.planType} />
              <InfoRow label="Member ID" value={appt.insuranceInfo.memberId} />
            </ExpandableSection>
          </>
        ) : (
          <>
            <Caption1 style={styles.boldValue}>{appt.patientName}</Caption1>
            <Caption2 style={[styles.label, { marginTop: hp(16) }]}>Booked By</Caption2>
            <View style={styles.personCard}>
              <Image source={getImageSource(appt.bookedByImage)} style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption1 style={styles.personName}>
                  {appt.bookedByName}{' '}
                  <Caption1 style={{ color: '#888' }}>(Male)</Caption1>
                </Caption1>
                <Caption4 style={styles.personIC}>IC: {appt.bookedByIC}</Caption4>
                <Caption4 style={styles.personMeta}>
                  {appt.bookedByDOB} <Caption4>({appt.bookedByAge})</Caption4>
                </Caption4>
                <Caption4 color={Colors.TEXT_COLOR}>{appt.bookedByPhone}</Caption4>
              </View>
            </View>
          </>
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
              onPress={() => setRescheduleVisible(true)}
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
        doctorName={appt.doctorName}
        onClose={() => setShowConfirmed(false)}
      />
      <RejectReasonModal
        visible={showRejectReason}
        onCancel={() => setShowRejectReason(false)}
        onSave={handleSaveReason}
      />
      {/* <DateTimePickerModal
        visible={rescheduleVisible}
        onClose={() => setRescheduleVisible(false)}
        onConfirm={handleRescheduleConfirm}
        disabledDates={['2026-05-10', '2026-05-15', '2026-05-18']}
        disabledTimes={['09:00 AM', '09:30 AM', '02:30 PM', '01:30 PM']}
      /> */}
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

  // ── Rejected Info Box ──
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
  detailText: {
    color: '#333',
    lineHeight: 22,
    marginBottom: hp(6),
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
  personName: {
    color: Colors.TEXT_COLOR,
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
  section: {
    marginBottom: hp(20),
  },
})