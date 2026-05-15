import { DownloadIcon } from '@/assets/icons/common_icon/DownloadIcon';
import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal';
import { CancelModal } from '@/components/shared/CancleModal';
import { CustomButton } from '@/components/shared/CustomButton';
import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body1, Body2, Body3, Caption1, Caption2, H5, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { useGetAppointmentsByPhoneQuery, useRejectAppointmentMutation, useRescheduleAppointmentMutation } from '@/redux/services/appointmentsApi';
import { useGetDoctorAvailabilityQuery } from '@/redux/services/bookingApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PATIENT_PHONE = '60179224970';

function mapStatus(apiStatus: string): 'upcoming' | 'completed' | 'canceled' {
  const s = (apiStatus ?? '').toLowerCase();
  switch (s) {
    case 'received':
    case 'confirmed':
    case 'pending':
    case 'new':
    case 'rescheduled':
      return 'upcoming';
    case 'completed':
      return 'completed';
    case 'cancelled':
    case 'canceled':
    case 'rejected':
    case 'reject':
      return 'canceled';
    default:
      return 'upcoming';
  }
}

export default function AppointmentDetails() {
  const { t } = useTranslation(); 
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const DOWNLOAD_ITEMS = [
    { key: 'diagnosis', label: t('diagnosis_report') },
    { key: 'prescription', label: t('prescription') },
    { key: 'billing', label: t('billing_receipt') },
  ];

  // ── Queries 
  const { data, isLoading, refetch } = useGetAppointmentsByPhoneQuery(PATIENT_PHONE);
  const [rejectAppointment, { isLoading: isRejecting }] = useRejectAppointmentMutation();
  const [rescheduleAppointment, { isLoading: isRescheduling }] = useRescheduleAppointmentMutation();

  // ── Appointment item 
  const appointments: any[] = Array.isArray(data)
    ? data
    : data?.appointments ?? [];

  const item = appointments.find((a: any) => String(a.id) === String(appointmentId));

  // ── Doctor availability
  const doctorId = item?.doctor_id ?? item?.doctor_info?.id ?? item?.provider?.id ?? '';
  const { data: availData, refetch: refetchAvail } = useGetDoctorAvailabilityQuery(doctorId, {
    skip: !doctorId,
  });

  const availability = availData?.availability ?? [];
  const maxDate = availData?.max_date ?? availData?.range?.to ?? '';

  const { refreshing, onRefresh } = useRefresh([refetch, refetchAvail]);

  // ── Loading 
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageLoader visible title={t('loading')} subtitle={t('fetching_details')} />
      </SafeAreaView>
    );
  }

  if (!item) return null;

  // ── Derived values
  const rawStatus  = localStatus ?? item.status;
  const statusKey  = mapStatus(rawStatus);
  const isCompleted = statusKey === 'completed';
  const isCanceled  = statusKey === 'canceled';
  const isUpcoming  = statusKey === 'upcoming';

  const dateStr = item.appt_date ?? item.date ?? item.start ?? '';
  const timeStr = item.appt_time ?? item.time ?? '';

  let displayDate = '-';
  let displayTime = '-';

  if (dateStr) {
    displayDate = new Date(dateStr).toLocaleDateString('en-MY', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  if (timeStr) {
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    displayTime = `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
  } else if (dateStr?.includes('T')) {
    displayTime = new Date(dateStr).toLocaleTimeString('en-MY', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  }

  const doctorInfo       = item.doctor_info ?? item.provider ?? {};
  const doctorName       = doctorInfo.name ?? doctorInfo.full_name ?? item.doctor_name ?? '-';
  const doctorAvatar     = doctorInfo.avatar_url ?? doctorInfo.profile_image?.file ?? '';
  const consultationTime = doctorInfo.consultation_time ?? '';
  const patientName      = item.patient_name ?? item.lead?.name ?? '-';
  const reason           = item.reason ?? item.services?.[0]?.name ?? '-';

  // ── Handlers 
  const handleDoctorPress = () => {
    const id = doctorInfo.id ?? item.doctor_id;
    if (!id) return;
    router.push({
      pathname: '/patient/doctors_info/doctor_details' as any,
      params: { doctorId: String(id) },
    });
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    try {
      await rejectAppointment({ appointmentId: String(item.id) }).unwrap();
      setLocalStatus('rejected');
      refetch();
    } catch (error: any) {
      showToast(t('cancel_failed'), error?.data?.message ?? t('something_went_wrong'));
    }
  };

  const handleRescheduleConfirm = async (newDate: string, newTime: string) => {
    setRescheduleVisible(false);
    try {
      await rescheduleAppointment({
        appointmentId: String(item.id),
        appt_date: newDate,
        appt_time: newTime,
        reschedule_suggestion: `Rescheduled to ${newDate} at ${newTime}`,
      }).unwrap();
      setLocalStatus('rescheduled');
      refetch();
    } catch (error: any) {
      showToast(t('reschedule_failed'), error?.data?.message ?? t('something_went_wrong'));
    }
  };

  const handleDownload = (key: string) => {
    console.log('Download:', key);
  };

  const getStatusBg = (s: string) => {
    if (s === 'upcoming') return Colors.ACCENT_YELLOW;
    return 'transparent';
  };

  const getStatusTextColor = (s: string) => {
    if (s === 'upcoming') return '#000';
    if (s === 'completed') return Colors.SUCCESS_COLOR;
    if (s === 'canceled') return Colors.COLOR_DANGER;
    return '#666';
  };

  // --- Render 
  return (
    <SafeAreaView style={styles.container}>
      <PageLoader visible={isRejecting || isRescheduling} title={t('updating')} subtitle={t('please_wait')} />

      <SectionTitle title={t('details')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
        <TouchableOpacity style={styles.doctorCard} onPress={handleDoctorPress} activeOpacity={0.8}>
          {doctorAvatar ? (
            <Image source={{ uri: doctorAvatar }} style={styles.doctorImg} />
          ) : (
            <View style={[styles.doctorImg, { backgroundColor: '#dfefee' }]} />
          )}
          <View style={styles.doctorInfo}>
            <Body1 color={Colors.BRAND_PRIMARY}>{doctorName}</Body1>
            <Body1 color="#818181" style={{ marginTop: 4 }}>
              {doctorInfo.specialization ?? '-'}
            </Body1>
          </View>
        </TouchableOpacity>

        <H5 style={styles.sectionTitle} weight="semiBold">{t('appointment_details')}</H5>

        <View style={styles.statusSectionContainer}>
          <Caption1 color={Colors.TEXT_COLOR} style={{ marginBottom: 6 }}>{t('status')}</Caption1>
          <View style={styles.badgeAndDateRow}>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusBg(statusKey),
                borderWidth: (isCompleted || isCanceled) ? 1 : 0,
                borderColor: isCompleted ? Colors.SUCCESS_COLOR : Colors.COLOR_DANGER,
              },
            ]}>
              <Caption2 weight="semiBold" color={getStatusTextColor(statusKey)}>
                {t(statusKey)}
              </Caption2>
            </View>
            <View style={styles.dateTimeWrapper}>
              <H6 weight="semiBold" color="#0D0D0D">{displayDate}</H6>
              <H6 weight="medium" color="#666">{displayTime}</H6>
            </View>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Body3 color={Colors.TEXT_COLOR}>{t('visit_reason')}</Body3>
          <Body2 weight="bold" style={{ marginTop: 4 }}>{reason}</Body2>
        </View>

        <View style={styles.infoBlock}>
          <Caption1 color={Colors.TEXT_COLOR}>{t('patient')}</Caption1>
          <Body2 weight="bold" style={{ marginTop: 4 }}>{patientName}</Body2>
          {item.patient_phone ? (
            <Caption2 color="#888" style={{ marginTop: 2 }}>
              {t('phone')}: {item.patient_phone}
            </Caption2>
          ) : null}
        </View>

        {isCompleted && (
          <View style={styles.downloadSection}>
            {DOWNLOAD_ITEMS.map((dl) => (
              <TouchableOpacity
                key={dl.key}
                style={styles.downloadRow}
                onPress={() => handleDownload(dl.key)}
                activeOpacity={0.7}
              >
                <Caption1 weight="semiBold" style={styles.downloadLabel}>{dl.label}</Caption1>
                <DownloadIcon />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isUpcoming && (
          <View style={styles.actionsContainer}>
            <View style={styles.buttonRow}>
              <CustomButton
                title={t('cancel_appointment')}
                onPress={() => setShowCancelModal(true)}
                backgroundColor={Colors.APP_BACKGROUND}
                borderColor="#FF383C1A"
                borderRadius={12}
                width="48%"
                height={50}
                color={Colors.COLOR_DANGER}
              />
              <CustomButton
                title={t('reschedule')}
                onPress={() => setRescheduleVisible(true)}
                backgroundColor={Colors.APP_BACKGROUND}
                borderColor={Colors.BORDER_COLOR}
                borderRadius={12}
                width="48%"
                height={50}
                color={Colors.TEXT_COLOR}
              />
            </View>
          </View>
        )}

        {isCanceled && (
          <View style={styles.actionsContainer}>
            <CustomButton
              title={t('reschedule')}
              onPress={() => setRescheduleVisible(true)}
              backgroundColor={Colors.APP_BACKGROUND}
              borderColor={Colors.BORDER_COLOR}
              borderRadius={12}
              width="100%"
              height={50}
              color={Colors.TEXT_COLOR}
            />
          </View>
        )}
      </ScrollView>

      <CancelModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        type="Cancel"
      />

      <DateTimePickerModal
        visible={rescheduleVisible}
        onClose={() => setRescheduleVisible(false)}
        onConfirm={handleRescheduleConfirm}
        availability={availability}
        maxDate={maxDate}
        consultationTime={consultationTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: wp(20),
  },
  scrollContent: {
    paddingBottom: hp(40),
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  doctorImg: {
    width: wp(100),
    height: wp(100),
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: wp(16),
  },
  sectionTitle: {
    marginTop: hp(30),
    marginBottom: hp(20),
  },
  statusSectionContainer: {
    marginBottom: hp(25),
  },
  badgeAndDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: 10,
    minWidth: wp(90),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeWrapper: {
    alignItems: 'flex-start',
  },
  infoBlock: {
    marginBottom: hp(25),
  },
  downloadSection: {
    gap: hp(10),
    marginBottom: hp(20),
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 12,
    borderWidth: 1,
  },
  downloadLabel: {
    color: Colors.TEXT_COLOR,
  },
  actionsContainer: {
    marginTop: hp(20),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(10),
  },
});