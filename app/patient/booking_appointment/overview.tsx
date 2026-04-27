// app/patient/booking_appointment/overview.tsx
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, H6 } from '@/components/typo/Typography';
import { DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OverviewScreen() {
    const router = useRouter();
    const { doctorId, patient, reason, details, date, time } = useLocalSearchParams<{
        doctorId: string; patient: string; reason: string;
        details: string; date: string; time: string;
    }>();

    const doctor = DOCTORS.find(d => d.id === doctorId) ?? DOCTORS[0];
    const [showSuccess, setShowSuccess] = useState(false);

    const handleBookNow = () => setShowSuccess(true);

    const handleBackToHome = () => {
        setShowSuccess(false);
        router.replace('/patient/(tabs)/home');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <SectionTitle title="Overview" />
            </View>

            <View style={styles.content}>
                <H6 style={styles.doctorName}>{doctor.name}</H6>
                <Caption1 style={styles.specialty}>{doctor.specialty}</Caption1>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Caption1 style={styles.rowLabel}>Patients</Caption1>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Caption1 style={styles.rowValue}>{date}</Caption1>
                        <Caption1 style={styles.rowValue}>{time}</Caption1>
                    </View>
                </View>
                <Caption1 style={styles.patientValue}>{patient}</Caption1>

                <View style={styles.divider} />

                <Caption1 style={styles.rowLabel}>Visit Reason</Caption1>
                <Caption1 style={styles.rowValue}>{reason}</Caption1>

                <View style={styles.divider} />

                <Caption1 style={styles.detailText}>{details}</Caption1>
            </View>

            <View style={styles.bottomBar}>
                <CustomButton
                    title="Book Now"
                    height={54}
                    width="100%"
                    onPress={handleBookNow}
                />
            </View>

            {/* ── Success Modal ── */}
            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        {/* <Ionicons name="checkmark-badge-outline" size={64} color={Colors.BRAND_PRIMARY} /> */}
                        <H6 style={styles.successText}>Your Booking Has Been Confirmed{'\n'}Successfully</H6>
                        <TouchableOpacity style={styles.backBtn} onPress={handleBackToHome}>
                            <Caption1 style={{ color: Colors.BRAND_PRIMARY }}>Back To Home</Caption1>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingHorizontal: wp(20), paddingTop: hp(10) },
    content: { flex: 1, paddingHorizontal: wp(20), paddingTop: hp(20) },
    doctorName: { fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    specialty: { color: '#888' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: hp(16) },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    rowLabel: { color: '#888', marginBottom: 4 },
    rowValue: { color: '#1A1A1A', textAlign: 'right' },
    patientValue: { color: '#1A1A1A', marginTop: 4 },
    detailText: { color: '#333', lineHeight: 22 },
    bottomBar: {
        paddingHorizontal: wp(20), paddingVertical: hp(16),
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
    },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: wp(30), alignItems: 'center', width: '80%' },
    successText: { textAlign: 'center', marginTop: hp(16), marginBottom: hp(24), color: '#1A1A1A', lineHeight: 24 },
    backBtn: { borderWidth: 1, borderColor: Colors.BRAND_PRIMARY, borderRadius: 100, paddingVertical: hp(12), paddingHorizontal: wp(30) },
});