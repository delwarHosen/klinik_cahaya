// app/admin/appointments/appointment_details.tsx
import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { WarningIcon } from '@/assets/icons/common_icon/WarningIcon'
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon'
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon'
import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, H6, SpecialText } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Upcoming: { label: 'Upcoming', color: '#1A1A1A', bg: '#F0F0F0', border: '#CCCCCC' },
  Pending: { label: 'Pending', color: '#1A1A1A', bg: '#D4F000', border: '#D4F000' },
  Completed: { label: 'Completed', color: '#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
  Canceled: { label: 'Canceled', color: '#FFFFFF', bg: '#FF383C', border: '#FF383C' },
}

// ── Reject Confirm Modal ──────────────────────────────────────────────────────
function RejectConfirmModal({
  visible, onCancel, onReject,
}: { visible: boolean; onCancel: () => void; onReject: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.card}>

          <View>
            <WarningIcon />
          </View>
          <H6 style={modalStyles.modalTitle}>Are You Sure</H6>
          <Caption1 style={modalStyles.modalSubtitle}>
            Do You Want To{' '}
            <Caption1 style={{ color: '#FF383C', fontWeight: '700' }}>Reject</Caption1>{' '}
            This Request
          </Caption1>
          <View style={modalStyles.btnRow}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onCancel}>
              <Caption1 style={{ color: '#1A1A1A', fontWeight: '600' }}>Cancel</Caption1>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.rejectBtn} onPress={onReject}>
              <Caption1 style={{ color: '#FF383C', fontWeight: '700' }}>Reject</Caption1>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// ── Booking Confirmed Modal ───────────────────────────────────────────────────
function BookingConfirmedModal({
  visible, onClose,
}: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={modalStyles.card}>
          <SuccessVerifyIcon />
          <H6 style={[modalStyles.modalTitle, { marginTop: hp(8) }]}>
            Booking Has Been Confirmed
          </H6>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// ── Reject Reason Modal ───────────────────────────────────────────────────────
function RejectReasonModal({
  visible, onCancel, onSave,
}: { visible: boolean; onCancel: () => void; onSave: (reason: string) => void }) {
  const [reason, setReason] = useState('')

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.card}>
          <View style={modalStyles.reasonBox}>
            <TextInput
              placeholder="Write here the reason"
              placeholderTextColor="#AAAAAA"
              value={reason}
              onChangeText={setReason}
              multiline
              style={modalStyles.reasonInput}
            />
          </View>
          <View style={modalStyles.btnRow}>
            <CustomButton
              title='Cancel'
              onPress={onCancel}
              width={"48%"}
              height={44}
              backgroundColor={Colors.APP_BACKGROUND}
              borderColor={Colors.BORDER_COLOR}
              borderRadius={12}
              color={Colors.TEXT_COLOR}
            />

            <CustomButton
              title='Save'
              onPress={() => onSave(reason)}
              backgroundColor={Colors.BRAND_PRIMARY}
              // borderColor={"#FF383C1A"}
              borderRadius={12}
              width={"48%"}
              height={44}

            />

          </View>
        </View>
      </View>
    </Modal>
  )
}

// ── Expandable Section ────────────────────────────────────────────────────────
function ExpandableSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <View style={expandStyles.wrapper}>
      <TouchableOpacity
        style={expandStyles.header}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.8}
      >
        <Caption1 style={expandStyles.title}>{title}</Caption1>
        <Caption2 weight='semiBold' color={Colors.TEXT_COLOR}>
          {expanded ? <UpArrowIcon /> : <DownArrowIcon />}
        </Caption2>
      </TouchableOpacity>
      {expanded && <View style={expandStyles.content}>{children}</View>}
    </View>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={expandStyles.row}>
      <Caption1 weight='medium'>{label}</Caption1>
      <Caption1 style={expandStyles.value}>{value}</Caption1>
    </View>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AppointmentDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const appt = ADMIN_APPOINTMENTS.find(a => a.id === id) ?? ADMIN_APPOINTMENTS[0]
  const cfg = STATUS_CONFIG[appt.status]
  const [rescheduleVisible, setRescheduleVisible] = useState(false);

  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [showConfirmed, setShowConfirmed] = useState(false)

  const isPending = appt.status === 'Pending'
  const isFamily = appt.patientType === 'Family Member'

  const handleAccept = () => {
    setShowConfirmed(true)
    setTimeout(() => {
      setShowConfirmed(false)
      router.back()
    }, 1800)
  }

  const handleRejectStep1 = () => {
    setShowRejectConfirm(false)
    setShowRejectReason(true)
  }


  const handleSaveReason = (_reason: string) => {
    setShowRejectReason(false);
    router.push({
      pathname: '/admin/(tabs)/apointment' as any,
      params: { activeTab: 'Canceled' }
    });
  };



  const handleRescheduleConfirm = (date: string, time: string) => {
    setRescheduleVisible(false);
    router.push({
      pathname: '/admin/(tabs)/apointment' as any,
      params: { activeTab: 'Upcoming' }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Header — outside ScrollView so it stays fixed */}
      <View style={styles.headerWrapper}>
        <SectionTitle title="Details" />
      </View>

      {/* ScrollView takes remaining flex space */}
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Doctor Row */}
        <View style={styles.doctorRow}>
          <Image source={{ uri: appt.doctorImage }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <H3 style={styles.doctorName}>{appt.doctorName}</H3>
            <Caption1 style={styles.doctorSpecialty} numberOfLines={4}>
              {appt.doctorSpecialty}
            </Caption1>
          </View>
        </View>

        {/* Appointment Details */}
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

        {appt.status === 'Canceled' && appt.canceledReason && (
          <View style={{ marginTop: hp(16) }}>
            <Caption2 style={styles.label}>Canceled Reason</Caption2>
            <Caption2 style={styles.boldValue}>{appt.canceledReason}</Caption2>
          </View>
        )}

        <Caption2 weight='regular' style={[styles.label, { marginTop: hp(20) }]}>Visit Reason</Caption2>
        <Caption2 weight='semiBold' style={styles.boldValue}>{appt.visitReason}</Caption2>
        <Caption2 weight='regular' style={styles.detailText}>{appt.details}</Caption2>

        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>
          Patients{' '}
          <Caption1 style={{ color: Colors.PLACEHOLLDER_TEXT }}>({appt.patientType})</Caption1>
        </Caption2>

        {!isFamily ? (
          <>
            <View style={styles.personCard}>
              <Image source={{ uri: appt.patientImage }} style={styles.personAvatar} />
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
              <Image source={{ uri: appt.bookedByImage }} style={styles.personAvatar} />
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

        {/* Action Buttons — Pending only */}
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
              // style={{ marginBottom: hp(20) }}
              />

              <CustomButton
                title='Accept'
                onPress={handleAccept}
                backgroundColor={Colors.BRAND_PRIMARY}
                // borderColor={"#FF383C1A"}
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
            // style={{ marginBottom: hp(20) }}
            />

          </View>
        )}
      </ScrollView>


      {/* Modals */}
      <RejectConfirmModal
        visible={showRejectConfirm}
        onCancel={() => setShowRejectConfirm(false)}
        onReject={handleRejectStep1}
      />
      <BookingConfirmedModal
        visible={showConfirmed}
        onClose={() => setShowConfirmed(false)}
      />
      <RejectReasonModal
        visible={showRejectReason}
        onCancel={() => setShowRejectReason(false)}
        onSave={handleSaveReason}
      />

      <DateTimePickerModal
        visible={rescheduleVisible}
        onClose={() => setRescheduleVisible(false)}
        onConfirm={handleRescheduleConfirm}
      />
    </SafeAreaView>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  flex: { flex: 1 },
  headerWrapper: {
    paddingTop: hp(4),
  },
  scrollContent: {
    paddingBottom: hp(40),
  },

  doctorRow: {
    flexDirection: 'row',
    gap: wp(14),
    alignItems: 'flex-start',
    marginTop: hp(10),
    marginBottom: hp(30),
  },
  doctorImage: {
    width: wp(100),
    height: hp(100),
    borderRadius: 16,
    backgroundColor: '#dfefee',
  },
  doctorInfo: { flex: 1, gap: 4 },
  doctorName: { color: Colors.BRAND_PRIMARY, fontWeight: '700', marginTop: hp(-10) },
  doctorSpecialty: { color: '#818181', lineHeight: 18, fontWeight: '700' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.TEXT_COLOR,
    marginBottom: hp(30),
  },
  label: { color: Colors.TEXT_COLOR, marginBottom: hp(6) },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: wp(16) },
  statusBadge: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: 10,
    borderWidth: 0.5,
  },
  statusText: { fontWeight: '700', fontSize: 13 },
  dateText: { color: Colors.TEXT_COLOR, fontWeight: '600', marginBottom: 2 },

  boldValue: { color: '#1A1A1A', fontWeight: '700', fontSize: 14, marginBottom: hp(8) },
  detailText: { color: '#333', lineHeight: 22, marginBottom: hp(4) },

  personCard: {
    flexDirection: 'row',
    gap: wp(12),
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: '#F8F8F8',
    padding: wp(14),
    marginTop: hp(8),
  },
  personAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#dfefee' },
  personInfo: { flex: 1, gap: 3 },
  personName: { color: Colors.TEXT_COLOR },
  personIC: { color: Colors.BRAND_PRIMARY },
  personMeta: { color: '#9C9C9C' },

  actionsSection: { marginTop: hp(28), gap: 12 },
  rejectAcceptRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: {
    flex: 1, paddingVertical: hp(16), borderRadius: 12,
    borderWidth: 1.5, borderColor: '#EEEEEE',
    alignItems: 'center', justifyContent: 'center',
  },
  rejectBtnText: { color: '#E53935', fontWeight: '700' },
  acceptBtn: {
    flex: 2, paddingVertical: hp(16), borderRadius: 12,
    backgroundColor: Colors.BRAND_PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: '700' },
  rescheduleBtn: {
    paddingVertical: hp(16), borderRadius: 12,
    borderWidth: 1.5, borderColor: '#EEEEEE', alignItems: 'center',
  },
  rescheduleBtnText: { color: '#1A1A1A', fontWeight: '600' },
})

const expandStyles = StyleSheet.create({
  wrapper: {
    borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE',
    marginTop: hp(12), overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(16), paddingVertical: hp(16),
  },
  title: { fontWeight: '700', color: Colors.TEXT_COLOR },
  content: { paddingHorizontal: wp(16), paddingBottom: hp(14), gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: Colors.TEXT_COLOR, fontWeight: '600', flex: 1 },
  value: { color: Colors.PLACEHOLLDER_TEXT, flex: 1, textAlign: 'right' },
})

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center', padding: wp(30),
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: wp(24), width: '100%', alignItems: 'center', gap: 12,
  },
  warningIcon: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: '#FFCDD2', backgroundColor: '#FFF5F5',
    justifyContent: 'center', alignItems: 'center',
  },
  warningText: { color: '#E53935', fontSize: 24, fontWeight: '700' },
  successIcon: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: Colors.BRAND_PRIMARY,
    backgroundColor: `${Colors.BRAND_PRIMARY}15`,
    justifyContent: 'center', alignItems: 'center',
  },
  successCheck: { color: Colors.BRAND_PRIMARY, fontSize: 26, fontWeight: '700' },
  modalTitle: { fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  modalSubtitle: { color: '#555', textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: hp(4) },
  cancelBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    borderWidth: 1, borderColor: '#EEEEEE', alignItems: 'center',
  },
  rejectBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    borderWidth: 1.5, borderColor: '#FFCDD2', backgroundColor: '#FFF5F5', alignItems: 'center',
  },
  saveBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    backgroundColor: Colors.BRAND_PRIMARY, alignItems: 'center',
  },
  reasonBox: {
    width: '100%', borderWidth: 1, borderColor: '#EEEEEE',
    borderRadius: 12, padding: wp(14), minHeight: hp(120),
  },
  reasonInput: {
    fontSize: 14, color: '#333',
    fontFamily: 'Poppins_400Regular', lineHeight: 22,
  },
})