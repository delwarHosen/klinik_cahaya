// app/admin/appointments/details.tsx
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, H6, SpecialText } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    Image, Modal, ScrollView, StyleSheet,
    TextInput, TouchableOpacity, View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Upcoming:  { label: 'Upcoming',  color: '#1A1A1A', bg: '#F0F0F0',   border: '#CCCCCC' },
  Pending:   { label: 'Pending',   color: '#1A1A1A', bg: '#D4F000',   border: '#D4F000' },
  Completed: { label: 'Completed', color: '#FFFFFF', bg: Colors.BRAND_PRIMARY, border: Colors.BRAND_PRIMARY },
  Canceled:  { label: 'Canceled',  color: '#FFFFFF', bg: '#E53935',   border: '#E53935' },
}

// ── Reject Confirm Modal ──────────────────────────────────────────────────────
function RejectConfirmModal({ visible, onCancel, onReject }: { visible: boolean; onCancel: () => void; onReject: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.backdrop}>
        <View style={modalStyles.card}>
          <View style={modalStyles.warningIcon}>
            <Caption1 style={modalStyles.warningText}>!</Caption1>
          </View>
          <H6 style={modalStyles.modalTitle}>Are You Sure</H6>
          <Caption1 style={modalStyles.modalSubtitle}>
            Do You Want To <Caption1 style={{ color: '#E53935', fontWeight: '700' }}>Reject</Caption1> This Request
          </Caption1>
          <View style={modalStyles.btnRow}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onCancel}>
              <Caption1 style={{ color: '#1A1A1A', fontWeight: '600' }}>Cancel</Caption1>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.rejectBtn} onPress={onReject}>
              <Caption1 style={{ color: '#E53935', fontWeight: '700' }}>Reject</Caption1>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// ── Booking Confirmed Modal ───────────────────────────────────────────────────
function BookingConfirmedModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={modalStyles.card}>
          <View style={modalStyles.successIcon}>
            <Caption1 style={modalStyles.successCheck}>✓</Caption1>
          </View>
          <H6 style={[modalStyles.modalTitle, { marginTop: hp(8) }]}>Booking Has Been Confirmed</H6>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// ── Reject Reason Modal ───────────────────────────────────────────────────────
function RejectReasonModal({ visible, onCancel, onSave }: { visible: boolean; onCancel: () => void; onSave: (reason: string) => void }) {
  const [reason, setReason] = useState('')
  return (
    <Modal visible={visible} transparent animationType="fade">
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
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onCancel}>
              <Caption1 style={{ color: '#1A1A1A', fontWeight: '600' }}>Cancel</Caption1>
            </TouchableOpacity>
            <TouchableOpacity style={[modalStyles.rejectBtn, { backgroundColor: Colors.BRAND_PRIMARY, borderColor: Colors.BRAND_PRIMARY }]} onPress={() => onSave(reason)}>
              <Caption1 style={{ color: '#FFFFFF', fontWeight: '700' }}>Save</Caption1>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// ── Expandable Info Section ───────────────────────────────────────────────────
function ExpandableSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <View style={expandStyles.wrapper}>
      <TouchableOpacity style={expandStyles.header} onPress={() => setExpanded(e => !e)} activeOpacity={0.8}>
        <Caption1 style={expandStyles.title}>{title}</Caption1>
        <Caption1 style={expandStyles.arrow}>{expanded ? '▲' : '▼'}</Caption1>
      </TouchableOpacity>
      {expanded && <View style={expandStyles.content}>{children}</View>}
    </View>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={expandStyles.row}>
      <Caption1 style={expandStyles.label}>{label}</Caption1>
      <Caption1 style={expandStyles.value}>{value}</Caption1>
    </View>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AdminAppointmentDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const appt = ADMIN_APPOINTMENTS.find(a => a.id === id) ?? ADMIN_APPOINTMENTS[0]
  const cfg = STATUS_CONFIG[appt.status]

  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [showConfirmed, setShowConfirmed] = useState(false)

  const isPending = appt.status === 'Pending'
  const isFamily = appt.patientType === 'Family Member'

  const handleAccept = () => {
    setShowConfirmed(true)
    setTimeout(() => { setShowConfirmed(false); router.back() }, 1800)
  }

  const handleRejectConfirm = () => {
    setShowRejectConfirm(false)
    setShowRejectReason(true)
  }

  const handleSaveReason = (_reason: string) => {
    setShowRejectReason(false)
    router.back()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Details" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Doctor Card */}
        <View style={styles.doctorRow}>
          <Image source={{ uri: appt.doctorImage }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <H6 style={styles.doctorName}>{appt.doctorName}</H6>
            <Caption1 style={styles.doctorSpecialty}>{appt.doctorSpecialty}</Caption1>
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
            <Caption1 style={styles.dateText}>{appt.date}</Caption1>
            <Caption1 style={styles.dateText}>{appt.time}</Caption1>
          </View>
        </View>

        {/* Canceled Reason */}
        {appt.status === 'Canceled' && appt.canceledReason && (
          <View style={{ marginTop: hp(16) }}>
            <Caption1 style={styles.label}>Canceled Reason</Caption1>
            <Caption1 style={styles.boldValue}>{appt.canceledReason}</Caption1>
          </View>
        )}

        <Caption1 style={[styles.label, { marginTop: hp(20) }]}>Visit Reason</Caption1>
        <Caption1 style={styles.boldValue}>{appt.visitReason}</Caption1>
        <Caption1 style={styles.detailText}>{appt.details}</Caption1>

        {/* Patient */}
        <Caption1 style={[styles.label, { marginTop: hp(20) }]}>
          Patients <Caption1 style={{ color: '#888' }}>({appt.patientType})</Caption1>
        </Caption1>

        {/* Own Self — show patient card with medical/insurance */}
        {!isFamily ? (
          <>
            <Caption1 style={styles.boldValue}>{appt.patientName}</Caption1>
            <View style={styles.personCard}>
              <Image source={{ uri: appt.patientImage }} style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption1 style={styles.personName}>
                  {appt.patientName} <Caption1 style={{ color: '#888' }}>({appt.patientGender})</Caption1>
                </Caption1>
                <Caption1 style={styles.personIC}>IC: {appt.patientIC}</Caption1>
                <Caption1 style={styles.personMeta}>{appt.patientDOB} ({appt.patientAge})</Caption1>
                <Caption1 style={styles.personMeta}>{appt.patientPhone}</Caption1>
              </View>
            </View>

            {/* Expandable sections */}
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
          /* Family Member — show patient name + booked by */
          <>
            <Caption1 style={styles.boldValue}>{appt.patientName}</Caption1>

            <Caption1 style={[styles.label, { marginTop: hp(20) }]}>Booked By</Caption1>
            <View style={styles.personCard}>
              <Image source={{ uri: appt.bookedByImage }} style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption1 style={styles.personName}>
                  {appt.bookedByName} <Caption1 style={{ color: '#888' }}>(Male)</Caption1>
                </Caption1>
                <Caption1 style={styles.personIC}>IC: {appt.bookedByIC}</Caption1>
                <Caption1 style={styles.personMeta}>{appt.bookedByDOB} ({appt.bookedByAge})</Caption1>
                <Caption1 style={styles.personMeta}>{appt.bookedByPhone}</Caption1>
              </View>
            </View>
          </>
        )}

        {/* Action Buttons — Pending only */}
        {isPending && (
          <View style={styles.actionsSection}>
            <View style={styles.rejectAcceptRow}>
              <TouchableOpacity
                style={styles.rejectBtn}
                activeOpacity={0.8}
                onPress={() => setShowRejectConfirm(true)}
              >
                <Caption1 style={styles.rejectBtnText}>Reject</Caption1>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptBtn}
                activeOpacity={0.8}
                onPress={handleAccept}
              >
                <Caption1 style={styles.acceptBtnText}>Accept</Caption1>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.rescheduleBtn} activeOpacity={0.8}>
              <Caption1 style={styles.rescheduleBtnText}>Reschedule</Caption1>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Modals */}
      <RejectConfirmModal
        visible={showRejectConfirm}
        onCancel={() => setShowRejectConfirm(false)}
        onReject={handleRejectConfirm}
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
    </SafeAreaView>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: wp(20) },
  scrollContent: { paddingHorizontal: wp(20), paddingBottom: hp(40) },

  doctorRow: { flexDirection: 'row', gap: wp(14), alignItems: 'flex-start', marginBottom: hp(20) },
  doctorImage: { width: wp(80), height: hp(80), borderRadius: 12, backgroundColor: '#dfefee' },
  doctorInfo: { flex: 1, gap: 4 },
  doctorName: { color: Colors.BRAND_PRIMARY, fontWeight: '700' },
  doctorSpecialty: { color: '#888', lineHeight: 18 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: hp(16) },
  label: { color: '#555', marginBottom: hp(6) },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: wp(16) },
  statusBadge: { paddingHorizontal: wp(16), paddingVertical: hp(8), borderRadius: 10, borderWidth: 1.5 },
  statusText: { fontWeight: '700', fontSize: 13 },
  dateText: { color: '#1A1A1A', fontWeight: '600', marginBottom: 2 },
  boldValue: { color: '#1A1A1A', fontWeight: '700', fontSize: 14, marginBottom: hp(8) },
  detailText: { color: '#333', lineHeight: 22, marginBottom: hp(4) },

  personCard: {
    flexDirection: 'row', gap: wp(12), alignItems: 'center',
    borderRadius: 14, borderWidth: 1, borderColor: '#EEEEEE',
    padding: wp(14), marginTop: hp(8),
  },
  personAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#dfefee' },
  personInfo: { flex: 1, gap: 2 },
  personName: { color: '#1A1A1A', fontWeight: '600' },
  personIC: { color: Colors.BRAND_PRIMARY, fontSize: 12 },
  personMeta: { color: '#555', fontSize: 12 },

  actionsSection: { marginTop: hp(28), gap: 12 },
  rejectAcceptRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: {
    flex: 1, paddingVertical: hp(16), borderRadius: 12,
    borderWidth: 1.5, borderColor: '#EEEEEE', alignItems: 'center', justifyContent: 'center',
  },
  rejectBtnText: { color: '#E53935', fontWeight: '700' },
  acceptBtn: {
    flex: 2, paddingVertical: hp(16), borderRadius: 12,
    backgroundColor: Colors.BRAND_PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: '700' },
  rescheduleBtn: {
    paddingVertical: hp(16), borderRadius: 12,
    borderWidth: 1.5, borderColor: '#EEEEEE', alignItems: 'center',
  },
  rescheduleBtnText: { color: '#1A1A1A', fontWeight: '600' },
})

const expandStyles = StyleSheet.create({
  wrapper: { borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', marginTop: hp(12), overflow: 'hidden' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(16), paddingVertical: hp(16),
  },
  title: { fontWeight: '600', color: '#1A1A1A' },
  arrow: { color: '#888', fontSize: 12 },
  content: { paddingHorizontal: wp(16), paddingBottom: hp(14), gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: '#555', flex: 1 },
  value: { color: '#888', flex: 1, textAlign: 'right' },
})

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: wp(30) },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: wp(24), width: '100%', alignItems: 'center', gap: 12 },
  warningIcon: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: '#FFCDD2', backgroundColor: '#FFF5F5',
    justifyContent: 'center', alignItems: 'center',
  },
  warningText: { color: '#E53935', fontSize: 24, fontWeight: '700' },
  successIcon: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderColor: Colors.BRAND_PRIMARY, backgroundColor: `${Colors.BRAND_PRIMARY}15`,
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
  reasonBox: {
    width: '100%', borderWidth: 1, borderColor: '#EEEEEE',
    borderRadius: 12, padding: wp(14), minHeight: hp(120),
  },
  reasonInput: { fontSize: 14, color: '#333', fontFamily: 'Poppins_400Regular', lineHeight: 22 },
})