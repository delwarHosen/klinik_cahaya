import { ExpandableSection, InfoRow } from '@/components/appointment/ExpandableSection'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4, H3, SpecialText } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetBookingLookupMutation } from '@/redux/services/adminApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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

export default function CanceledAppointmentDetailsScreen() {
  const { t } = useTranslation()
  const { bookingId, id } = useLocalSearchParams<{ bookingId?: string; id?: string }>()
  const resolvedId = bookingId ?? id ?? ''

  const [getBookingLookup, { data, isLoading }] = useGetBookingLookupMutation()

  useEffect(() => {
    if (resolvedId) {
      getBookingLookup({ booking_id: resolvedId })
    }
  }, [resolvedId])

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.headerWrapper}>
          <SectionTitle title={t('reject_details')} />
        </View>
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
        </View>
      </SafeAreaView>
    )
  }

  const { booking, doctor, patient } = data
  const patientInfo = patient.requested_patient

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerWrapper}>
        <SectionTitle title={t('details')} />
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
            <Caption1 style={styles.doctorSpecialty} numberOfLines={4}>
              {doctor.specialization}
            </Caption1>
          </View>
        </View>

        {/* ── Appointment Details ── */}
        <SpecialText style={styles.sectionTitle}>{t('appointment_details')}</SpecialText>

        <Caption1 style={styles.label}>{t('status')}</Caption1>

        {/* Status row */}
        <View style={styles.statusRow}>
          <View style={styles.canceledBadge}>
            <Caption1 style={styles.canceledBadgeText}>Canceled</Caption1>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Caption2 style={styles.dateText}>{formatDate(booking.appt_date)}</Caption2>
            <Caption2 style={styles.dateText}>{formatTime(booking.appt_time)}</Caption2>
          </View>
        </View>

        {/* ── Rejected Info Box ── */}
        <View style={styles.rejectedBox}>
          <View style={styles.rejectedBoxRow}>
            {/* Left — Rejected By */}
            <View style={{ flex: 1 }}>
              <Caption4 style={styles.rejectedBoxLabel}>{t('rejected_by')}</Caption4>
              <Caption2 style={styles.rejectedBoxValue}>
                {booking.approved_by ?? 'Admin'}
              </Caption2>
              <Caption4 style={styles.rejectedBoxMeta}>
                ID: {patientInfo?.ic ?? booking.patient_ic}
              </Caption4>
              <Caption4 style={styles.rejectedBoxMeta}>
                {booking.approved_at
                  ? `${formatDate(booking.approved_at)} ${formatTime(booking.approved_at.split('T')[1] ?? '')}`
                  : formatDate(booking.appt_date)}
              </Caption4>
            </View>
            {/* Right — Reason */}
            <View style={{ alignItems: 'flex-end' }}>
              <Caption4 style={styles.rejectedBoxLabelRed}>{t('reason')}</Caption4>
              <Caption2 style={styles.rejectedReasonText}>—</Caption2>
            </View>
          </View>

          {/* Note */}
          <View style={styles.rejectedNoteBox}>
            <Caption4 style={styles.rejectedBoxLabel}>{t('note')}</Caption4>
            <Caption2 style={styles.rejectedNoteText}>
              {t('declined_note')}
            </Caption2>
          </View>
        </View>

        {/* ── Visit Reason ── */}
        <Caption2 weight='regular' style={[styles.label, { marginTop: hp(20) }]}>
          {t('visit_reason')}
        </Caption2>
        <Caption2 weight='semiBold' style={styles.boldValue}>{booking.reason}</Caption2>

        {/* ── Patient ── */}
        <Caption2 style={[styles.label, { marginTop: hp(20) }]}>{t('patient')}</Caption2>

        <View style={styles.personCard}>
          <View style={styles.personAvatar} />
          <View style={styles.personInfo}>
            <Caption2 weight='semiBold'>
              {patientInfo?.name ?? booking.patient_name}
            </Caption2>
            <Caption4 style={styles.personIC}>
              IC: {patientInfo?.ic ?? booking.patient_ic}
            </Caption4>
            <Caption4 weight='semiBold' color={Colors.TEXT_COLOR}>
              +{String(patientInfo?.phone ?? booking.patient_phone)}
            </Caption4>
          </View>
        </View>

        {/* ── Consultation Info ── */}
        {doctor.consultation_days && (
          <ExpandableSection title={t('consultation_info')}>
            <InfoRow label={t('days')}  value={doctor.consultation_days} />
            <InfoRow label={t('hours')} value={doctor.consultation_time} />
            <InfoRow label={t('about')} value={doctor.about} />
          </ExpandableSection>
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
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    paddingTop: hp(4),
    marginBottom: hp(8),
  },
  scrollContent: {
    paddingBottom: hp(40),
  },
  doctorRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(10),
    marginBottom: hp(24),
    marginTop: hp(8),
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