import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal';
import { PatientCard } from '@/components/booking/PatientCard';
import { PatientDropdown } from '@/components/booking/PatientDropdown';
import { CustomButton } from '@/components/shared/CustomButton';
import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, SpecialText } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import {
  AppointmentMember,
  useGetAppointmentMembersQuery,
  useGetDoctorAvailabilityQuery,
} from '@/redux/services/bookingApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatDisplayDateTime(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const formattedTime = `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
  return `${monthName} ${day}, ${year} (${dayName})  ${formattedTime}`;
}

export default function InformationScreen() {
  const { t } = useTranslation();
  const router = useRouter();


  const REASONS = [
    t('reason_fever'),
    t('reason_checkup'),
    t('reason_followup'),
    t('reason_vaccine')
  ];

  const { id, consultationTime } = useLocalSearchParams<{ id: string; consultationTime: string }>();

  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useGetAppointmentMembersQuery();
  const { data: availabilityData, isLoading: availabilityLoading, refetch: refetchAvailability } =
    useGetDoctorAvailabilityQuery(id ?? '', { skip: !id });

  const { refreshing, onRefresh } = useRefresh([refetchMembers, refetchAvailability]);

  const [patientOpen, setPatientOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AppointmentMember | null>(null);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [dateTimeVisible, setDateTimeVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const isPageLoading = membersLoading || availabilityLoading;
  const members: AppointmentMember[] = membersData?.members ?? [];
  const availability = availabilityData?.availability ?? [];
  const maxDate = availabilityData?.range.to ?? '';

  const displayDateTime =
    selectedDate && selectedTime ? formatDisplayDateTime(selectedDate, selectedTime) : null;

  const canContinue = !!selectedMember && !!selectedReason && !!selectedDate && !!selectedTime;

  const handleSelectMember = (name: string) => {
    const member = members.find((m) => m.name === name) ?? null;
    setSelectedMember(member);
    setPatientOpen(false);
    setSelectedReason(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleConfirmDateTime = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setDateTimeVisible(false);
  };

  const handleContinue = () => {
    if (!canContinue || !id) return;

    const memberName = selectedMember!.type === 'self' ? 'null' : selectedMember!.name;

    router.push({
      pathname: '/patient/booking_appointment/overview' as any,
      params: {
        doctorId: id,
        memberName,
        patient: selectedMember!.name,
        reason: selectedReason!,
        details,
        date: selectedDate!,
        time: selectedTime!,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <PageLoader
        visible={isPageLoading}
        title={t('loading')}
        subtitle={t('loading_availability')}
      />

      <View style={styles.header}>
        <SectionTitle title={t('information')} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.BRAND_PRIMARY]}
              tintColor={Colors.BRAND_PRIMARY}
            />
          }
        >
          <SpecialText style={styles.question}>
            {t('treatment_question')}
          </SpecialText>
          <Caption1 weight="medium" style={styles.label}>{t('booking_for')}</Caption1>

          <PatientDropdown
            patients={[...new Map(members.map((m) => [m.name, m])).values()].map((m) => m.name)}
            selected={selectedMember?.name ?? null}
            open={patientOpen}
            onToggle={() => setPatientOpen((o) => !o)}
            onSelect={handleSelectMember}
          />

          {selectedMember && (
            <PatientCard
              patientName={selectedMember.name}
              reasons={REASONS}
              selectedReason={selectedReason}
              reasonOpen={reasonOpen}
              onToggleReason={() => setReasonOpen((o) => !o)}
              onSelectReason={(r) => { setSelectedReason(r); setReasonOpen(false); }}
              details={details}
              onChangeDetails={setDetails}
              selectedDate={displayDateTime}
              selectedTime={null}
              onPressDateTime={() => setDateTimeVisible(true)}
            />
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <CustomButton
            title={t('continue')}
            height={54}
            width="100%"
            onPress={handleContinue}
            borderRadius={16}
            disabled={!canContinue}
          />
        </View>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        visible={dateTimeVisible}
        onClose={() => setDateTimeVisible(false)}
        onConfirm={handleConfirmDateTime}
        availability={availability}
        maxDate={maxDate}
        consultationTime={consultationTime ?? ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  flex: {
    flex: 1
  },
  header: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10)
  },
  scroll: {
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(20)
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: hp(16)
  },
  label: {
    color: Colors.TEXT_COLOR,
    marginVertical: hp(12)
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(20),
    paddingTop: hp(12),
    paddingBottom: hp(12),
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_COLOR,
    width: '100%',
  },
});