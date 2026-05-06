import { DownloadIcon } from '@/assets/icons/common_icon/DownloadIcon';
import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal';
import { CancelModal } from '@/components/shared/CancleModal';
import { CustomButton } from '@/components/shared/CustomButton';
import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body2, Body3, Caption1, Caption2, H5, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetAppointmentsByPhoneQuery } from '@/redux/services/appointmentsApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PATIENT_PHONE = '60179224970';

const DOWNLOAD_ITEMS = [
  { key: 'diagnosis', label: 'Diagnosis Report' },
  { key: 'prescription', label: 'Prescription' },
  { key: 'billing', label: 'Billing receipt' },
];

function mapStatus(apiStatus: string): string {
  switch (apiStatus) {
    case 'received':
    case 'confirmed': return 'Upcoming';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Canceled';
    default: return 'Upcoming';
  }
}

export default function AppointmentDetails() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);

  const { data, isLoading } = useGetAppointmentsByPhoneQuery(PATIENT_PHONE);
  const appointments = data?.appointments ?? [];
  const item = appointments.find((a: any) => String(a.id) === String(appointmentId));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageLoader visible title="LOADING" subtitle="Fetching appointment details..." />
      </SafeAreaView>
    );
  }

  if (!item) return null;

  const status = mapStatus(item.status);
  const isCompleted = status === 'Completed';
  const isCanceled = status === 'Canceled';
  const isUpcoming = status === 'Upcoming';

  const dateObj = new Date(item.start);
  const date = dateObj.toLocaleDateString('en-MY', { day: '2-digit', month: 'long', year: 'numeric' });
  const time = dateObj.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });

  const provider = item.provider;
  const lead = item.lead;
  const serviceName = item.services?.[0]?.name ?? '-';

  const handleDoctorPress = () => {
    router.push({
      pathname: '/patient/doctors_info/doctor_details' as any,
      params: { doctorId: String(provider?.id) },
    });
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    console.log('Appointment cancelled:', item.id);
  };

  const handleRescheduleConfirm = (d: string, t: string) => {
    setRescheduleVisible(false);
    console.log('Rescheduled to:', d, t);
  };

  const handleDownload = (key: string) => {
    console.log('Download:', key);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionTitle title="Details" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Doctor Card */}
        <TouchableOpacity style={styles.doctorCard} onPress={handleDoctorPress} activeOpacity={0.8}>
          <Image
            source={{ uri: provider?.profile_image?.file }}
            style={styles.doctorImg}
          />
          <View style={styles.doctorInfo}>
            <Body1 color={Colors.BRAND_PRIMARY}>{provider?.name}</Body1>
            <Body1 color="#818181" style={{ marginTop: 4 }}>{serviceName}</Body1>
          </View>
        </TouchableOpacity>

        <H5 style={styles.sectionTitle} weight="semiBold">Appointment Details</H5>

        {/* Status + Date */}
        <View style={styles.statusSectionContainer}>
          <Caption1 color={Colors.TEXT_COLOR} style={{ marginBottom: 6 }}>Status</Caption1>
          <View style={styles.badgeAndDateRow}>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusBg(status),
                borderWidth: (isCompleted || isCanceled) ? 1 : 0,
                borderColor: isCompleted ? Colors.SUCCESS_COLOR : Colors.COLOR_DANGER,
              }
            ]}>
              <Caption2 weight="semiBold" color={getStatusTextColor(status)}>
                {status}
              </Caption2>
            </View>
            <View style={styles.dateTimeWrapper}>
              <H6 weight="semiBold" color="#0D0D0D">{date}</H6>
              <H6 weight="medium" color="#666">{time}</H6>
            </View>
          </View>
        </View>

        {/* Visit Reason — service name */}
        <View style={styles.infoBlock}>
          <Body3 color={Colors.TEXT_COLOR}>Visit Reason</Body3>
          <Body2 weight="bold" style={{ marginTop: 4 }}>{serviceName}</Body2>
          {item.lead?.remarks ? (
            <Body2 color="#0D0D0D" weight="regular" style={styles.description}>
              {item.lead.remarks}
            </Body2>
          ) : null}
        </View>

        {/* Patient */}
        <View style={styles.infoBlock}>
          <Caption1 color={Colors.TEXT_COLOR}>Patient</Caption1>
          <Body2 weight="bold" style={{ marginTop: 4 }}>{lead?.name}</Body2>
          <Caption2 color="#888" style={{ marginTop: 2 }}>
            Ref: {lead?.rid ?? '-'}
          </Caption2>
        </View>

        {/* Download — Completed only */}
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

        {/* Actions — Upcoming only */}
        {isUpcoming && (
          <View style={styles.actionsContainer}>
            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel Appointment"
                onPress={() => setShowCancelModal(true)}
                backgroundColor={Colors.APP_BACKGROUND}
                borderColor="#FF383C1A"
                borderRadius={12}
                width="48%"
                height={50}
                color={Colors.COLOR_DANGER}
              />
              <CustomButton
                title="Reschedule"
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
        disabledDates={['2026-05-10', '2026-05-15', '2026-05-18']}
        disabledTimes={['09:00 AM', '09:30 AM', '02:30 PM', '01:30 PM']}
      />
    </SafeAreaView>
  );
}

const getStatusBg = (s: string) => {
  if (s === 'Upcoming') return Colors.ACCENT_YELLOW;
  if (s === 'Completed') return 'transparent';
  if (s === 'Canceled') return 'transparent';
  return '#F0F0F0';
};

const getStatusTextColor = (s: string) => {
  if (s === 'Upcoming') return '#000';
  if (s === 'Completed') return Colors.SUCCESS_COLOR;
  if (s === 'Canceled') return Colors.COLOR_DANGER;
  return '#666';
};

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
  description: {
    marginTop: hp(12),
    lineHeight: 22,
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