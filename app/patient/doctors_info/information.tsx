import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal';
import { PatientCard } from '@/components/booking/PatientCard';
import { PatientDropdown } from '@/components/booking/PatientDropdown';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, SpecialText } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PATIENTS = ['My self', 'Razak bin Osman', 'Faris', 'Aisyah binti Musa'];
const REASONS = ['Demam/Sakit', 'Checkup', 'Follow-up', 'Vaksin'];

export default function InformationScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [patientOpen, setPatientOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [reasonOpen, setReasonOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [details, setDetails] = useState('');
    const [dateTimeVisible, setDateTimeVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleContinue = () => {
        if (!selectedPatient || !selectedReason || !selectedDate || !selectedTime) return;
        router.push({
            pathname: '/patient/booking_appointment/overview' as any,
            params: {
                doctorId: id,
                patient: selectedPatient,
                reason: selectedReason,
                details,
                date: selectedDate,
                time: selectedTime,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <SectionTitle title="Information" />
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
                >
                    <SpecialText style={styles.question}>
                        What kind of issue do you need treatment for?
                    </SpecialText>
                    <Caption1 weight="medium" style={styles.label}>Booking For</Caption1>

                    <PatientDropdown
                        patients={PATIENTS}
                        selected={selectedPatient}
                        open={patientOpen}
                        onToggle={() => setPatientOpen(o => !o)}
                        onSelect={(p) => {
                            setSelectedPatient(p);
                            setPatientOpen(false);
                            setSelectedReason(null);
                        }}
                    />

                    {selectedPatient && (
                        <PatientCard
                            patientName={selectedPatient}
                            reasons={REASONS}
                            selectedReason={selectedReason}
                            reasonOpen={reasonOpen}
                            onToggleReason={() => setReasonOpen(o => !o)}
                            onSelectReason={(r) => { setSelectedReason(r); setReasonOpen(false); }}
                            details={details}
                            onChangeDetails={setDetails}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onPressDateTime={() => setDateTimeVisible(true)}
                        />
                    )}
                </ScrollView>

                <View style={styles.bottomBar}>
                    <CustomButton
                        title="Continue"
                        height={54}
                        width="100%"
                        onPress={handleContinue}
                        borderRadius={16}
                    />
                </View>
            </KeyboardAvoidingView>

            <DateTimePickerModal
                visible={dateTimeVisible}
                onClose={() => setDateTimeVisible(false)}
                onConfirm={(date, time) => {
                    setSelectedDate(date);
                    setSelectedTime(time);
                    setDateTimeVisible(false);
                }}
                disabledDates={['2026-05-10', '2026-05-15','2026-05-18']}
                disabledTimes={['09:00 AM', '09:30 AM','02:30 PM','01:30 PM']}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    flex: { flex: 1 },
    header: {
        paddingHorizontal: wp(20),
        paddingTop: hp(10),
    },
    scroll: {
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
        paddingBottom: hp(20),
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: hp(16),
    },
    label: {
        color: Colors.TEXT_COLOR,
        marginVertical: hp(12),
    },
    bottomBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp(20),
        paddingTop: hp(12),
        // paddingBottom: hp(12),
        borderTopWidth: 1,
        borderTopColor: Colors.BORDER_COLOR,
        width: '100%',
    },
});