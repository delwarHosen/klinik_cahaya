import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Caption1, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import {
  useCreateAppointmentMutation,
  useGetAppointmentMembersQuery,
} from '@/redux/services/bookingApi';
import { useGetDoctorByIdQuery } from '@/redux/services/doctorsApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Helpers 

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayName   = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });
  return `${monthName} ${day}, ${year} (${dayName})`;
}

function formatDisplayTime(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  const h    = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
}

export default function OverviewScreen() {
  const { t } = useTranslation(); 
  const router = useRouter();

  const { doctorId, memberName, patient, reason, details, date, time } =
    useLocalSearchParams<{
      doctorId: string;
      memberName: string;
      patient: string;
      reason: string;
      details: string;
      date: string;
      time: string;
    }>();

  // ── Remote data 
  const { data: doctorData, isLoading: doctorLoading, refetch: refetchDoctor } = useGetDoctorByIdQuery(
    doctorId ?? '',
    { skip: !doctorId },
  );
  const doctor = doctorData?.data ?? doctorData;

  const { data: membersData, refetch: refetchMembers } = useGetAppointmentMembersQuery();
  const selfMember = membersData?.members?.find((m: any) => m.type === 'self');

  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();

  const { refreshing, onRefresh } = useRefresh([refetchDoctor, refetchMembers]);
  const [showSuccess, setShowSuccess] = useState(false);

  const displayDate = useMemo(() => (date ? formatDisplayDate(date) : ''), [date]);
  const displayTime = useMemo(() => (time ? formatDisplayTime(time) : ''), [time]);

  const isSelf = memberName === 'null';

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleBookNow = async () => {
    if (!doctorId || !date || !time || !reason) return;

    const payload = {
      date,
      time,
      doctor_id: doctorId,
      reason,
      ...(isSelf
        ? { member_id: selfMember?.id ?? null }
        : { member_name: memberName }
      ),
    };

    try {
      await createAppointment(payload).unwrap();
      setShowSuccess(true);
    } catch (err: any) {
      showToast(t('booking_failed_msg'));
    }
  };

  const handleBackToHome = () => {
    setShowSuccess(false);
    router.replace('/patient/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <PageLoader
        visible={doctorLoading}
        title={t('loading')}
        subtitle={t('preparing_overview')}
      />

      <View style={styles.header}>
        <SectionTitle title={t('overview')} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.BRAND_PRIMARY]}
            tintColor={Colors.BRAND_PRIMARY}
          />
        }
      >
        <H6 style={styles.doctorName}>{doctor?.name ?? '—'}</H6>
        <Caption1 style={styles.specialty}>{doctor?.specialization ?? ''}</Caption1>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Caption1 weight="semiBold" style={styles.rowLabel}>{t('patients')}</Caption1>
          <View style={{ alignItems: 'flex-end' }}>
            <Caption1 weight="semiBold" style={styles.dateValue}>{displayDate}</Caption1>
            <Caption1 weight="semiBold" style={styles.dateValue}>{displayTime}</Caption1>
          </View>
        </View>
        <Caption1 weight="semiBold" style={styles.patientValue}>{patient}</Caption1>

        <View style={styles.divider} />

        <Caption1 weight="semiBold" style={styles.rowLabel}>{t('visit_reason')}</Caption1>
        <Caption1 weight="semiBold" style={styles.reasonValue}>{reason}</Caption1>

        {!!details && (
          <>
            <View style={styles.divider} />
            <Caption1 style={styles.detailText}>{details}</Caption1>
          </>
        )}

        <View style={styles.divider} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <CustomButton
          title={isBooking ? t('booking_status') : t('book_now')}
          height={54}
          width="100%"
          onPress={handleBookNow}
          disabled={isBooking || doctorLoading}
        />
      </View>

      <Modal visible={showSuccess} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <SuccessVerifyIcon />
            <H6 style={styles.successText}>
              {t('booking_success_title')}
            </H6>
            <CustomButton
              title={t('back_to_home')}
              height={54}
              width="100%"
              onPress={handleBackToHome}
              backgroundColor={Colors.APP_BACKGROUND}
              color={Colors.BRAND_PRIMARY}
              borderColor={Colors.BRAND_PRIMARY}
              borderRadius={20}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
  },

  scroll: {
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(20),
  },

  doctorName: {
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: hp(4),
  },

  specialty: {
    color: '#888888',
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: hp(16),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  rowLabel: {
    color: '#888888',
    marginBottom: hp(4),
  },

  dateValue: {
    color: '#1A1A1A',
    textAlign: 'right',
    marginBottom: hp(2),
  },

  patientValue: {
    color: '#1A1A1A',
    marginTop: hp(4),
  },

  reasonValue: {
    color: '#1A1A1A',
    marginTop: hp(4),
  },

  detailText: {
    color: '#333333',
    lineHeight: 22,
  },

  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(20),
    paddingTop: hp(12),
    paddingBottom: hp(12),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(32),
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: hp(40),
    paddingHorizontal: wp(28),
    alignItems: 'center',
    width: '100%',
    gap: hp(16),

    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },

  successText: {
    textAlign: 'center',
    color: '#1A1A1A',
    lineHeight: 26,
  },
});