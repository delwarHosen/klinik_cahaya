import { ExpandableSection, InfoRow } from '@/components/appointment/ExpandableSection'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, SpecialText } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, ImageSourcePropType, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const getImageSource = (img?: string | number): ImageSourcePropType => {
  if (!img) return { uri: '' }
  return typeof img === 'string' ? { uri: img } : (img as ImageSourcePropType)
}

export default function CanceledAppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  // ✅ id দিয়ে সঠিক appointment খোঁজা
  const appt = ADMIN_APPOINTMENTS.find(a => a.id === String(id)) ?? ADMIN_APPOINTMENTS[0]
  const isFamily = appt.patientType === 'Family Member'

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

        {/* ✅ Status row — Canceled badge + date right side */}
        <View style={styles.statusRow}>
          <View style={styles.canceledBadge}>
            <Caption1 style={styles.canceledBadgeText}>Canceled</Caption1>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Caption2 style={styles.dateText}>{appt.date}</Caption2>
            <Caption2 style={styles.dateText}>{appt.time}</Caption2>
          </View>
        </View>

        {/* ✅ Rejected Info Box */}
        <View style={styles.rejectedBox}>
          <View style={styles.rejectedBoxRow}>
            {/* Left — Rejected By */}
            <View style={{ flex: 1 }}>
              <Caption4 style={styles.rejectedBoxLabel}>Rejected By</Caption4>
              <Caption2 style={styles.rejectedBoxValue}>Jacob Jones</Caption2>
              <Caption4 style={styles.rejectedBoxMeta}>ID: {appt.patientIC}</Caption4>
              <Caption4 style={styles.rejectedBoxMeta}>
                10 March, 2026 09:00 AM
              </Caption4>
            </View>
            {/* Right — Reason */}
            <View style={{ alignItems: 'flex-end' }}>
              <Caption4 style={styles.rejectedBoxLabelRed}>Reason</Caption4>
              <Caption2 style={styles.rejectedReasonText}>
                {appt.canceledReason ?? 'False Information'}
              </Caption2>
            </View>
          </View>

          {/* Note */}
          <View style={styles.rejectedNoteBox}>
            <Caption4 style={styles.rejectedBoxLabel}>Note</Caption4>
            <Caption2 style={styles.rejectedNoteText}>
              Appointment Request Has Been Declined Due To Inaccurate Or False Information Provided.
            </Caption2>
          </View>
        </View>

        {/* ── Visit Reason ── */}
        <Caption2 weight='regular' style={[styles.label, { marginTop: hp(20) }]}>
          Visit Reason
        </Caption2>
        <Caption2 weight='semiBold' style={styles.boldValue}>{appt.visitReason}</Caption2>
        <Caption2 weight='regular' style={styles.detailText}>{appt.details}</Caption2>

        {/* ── Patients ── */}
        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>
          Patients{' '}
          <Caption1 style={{ color: Colors.PLACEHOLLDER_TEXT }}>
            ({appt.patientType === 'Family Member' ? 'Brother' : 'Own Self'})
          </Caption1>
        </Caption2>

        {isFamily ? (
          <>
            {/* ✅ Family — patient name bold, then expandable, then Booked By */}
            <Caption1 style={styles.boldValue}>{appt.patientName}</Caption1>

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

            {/* Booked By */}
            <Caption2 weight='semiBold' style={[styles.label, { marginTop: hp(16), fontSize: 15 }]}>
              Booked By
            </Caption2>
            <View style={styles.personCard}>
              <Image
                source={getImageSource(appt.bookedByImage)}
                style={styles.personAvatar}
              />
              <View style={styles.personInfo}>
                <Caption2 weight='semiBold'>
                  {appt.bookedByName}{' '}
                  <Caption1 style={{ color: '#888' }}>(Male)</Caption1>
                </Caption2>
                <Caption4 style={styles.personIC}>IC: {appt.bookedByIC}</Caption4>
                <Caption4 style={styles.personMeta}>
                  {appt.bookedByDOB}{' '}
                  <Caption4>({appt.bookedByAge})</Caption4>
                </Caption4>
                <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>
                  {appt.bookedByPhone}
                </Caption4>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* ✅ Own Self — patient card */}
            <View style={styles.personCard}>
              <Image source={getImageSource(appt.patientImage)} style={styles.personAvatar} />
              <View style={styles.personInfo}>
                <Caption2 weight='semiBold'>
                  {appt.patientName}{' '}
                  <Caption1 style={{ color: '#0D0D0D4D' }}>({appt.patientGender})</Caption1>
                </Caption2>
                <Caption4 style={styles.personIC}>IC: {appt.patientIC}</Caption4>
                <Caption4 style={styles.personMeta}>
                  {appt.patientDOB}{' '}
                  <Caption4>({appt.patientAge})</Caption4>
                </Caption4>
                <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>
                  {appt.patientPhone}
                </Caption4>
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
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

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
  scrollContent: {
    paddingBottom: hp(40),
  },

  // ── Doctor Row ──
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(14),
    marginBottom: hp(24),
    marginTop: hp(8),
  },
  doctorImage: {
    width: wp(80),
    height: hp(80),
    borderRadius: 16,
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

  // ── Section Title ──
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

  // ── Status Row ──
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(16),
  },
  canceledBadge: {
    backgroundColor: '#FF383C',
    borderRadius: 10,
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
  },
  canceledBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  dateText: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    marginBottom: 2,
  },

  // ── Rejected Box ──
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
    alignItems: 'flex-start',
  },
  rejectedBoxLabel: {
    color: '#FF383C',
    marginBottom: 2,
    fontWeight: '600',
  },
  rejectedBoxLabelRed: {
    color: '#FF383C',
    marginBottom: 2,
    fontWeight: '600',
    textAlign: 'right',
  },
  rejectedBoxValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
  },
  rejectedBoxMeta: {
    color: '#888',
    marginBottom: 1,
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

  // ── Content ──
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

  // ── Person Card ──
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
    marginBottom: hp(12),
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
})