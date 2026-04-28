import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, H6 } from '@/components/typo/Typography';
import { DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
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
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <SectionTitle title="Overview" />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
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

                {!!details && (
                    <>
                        <View style={styles.divider} />
                        <Caption1 style={styles.detailText}>{details}</Caption1>
                    </>
                )}
            </ScrollView>

            <View style={styles.bottomBar}>
                <CustomButton
                    title="Book Now"
                    height={54}
                    width="100%"
                    onPress={handleBookNow}
                />
            </View>

            {/* ── Success Modal ── */}
            <Modal visible={showSuccess} transparent animationType="fade" statusBarTranslucent>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <SuccessVerifyIcon />
                        <H6 style={styles.successText}>
                            Your Booking Has Been Confirmed{'\n'}Successfully
                        </H6>

                        <CustomButton
                            title=" Back To Home"
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
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        paddingHorizontal: wp(20),
        paddingTop: hp(10),
    },
    scroll: {
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
        paddingBottom: hp(20),
    },
    doctorName: { fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    specialty: { color: '#888888' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: hp(16) },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    rowLabel: { color: '#888888', marginBottom: 4 },
    rowValue: { color: '#1A1A1A', textAlign: 'right' },
    patientValue: { color: '#1A1A1A', marginTop: 4 },
    detailText: { color: '#333333', lineHeight: 22 },
    bottomBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp(20),
        paddingTop: hp(12),
        paddingBottom: hp(12),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },

    // Modal
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
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
    },
    successText: {
        textAlign: 'center',
        color: '#1A1A1A',
        lineHeight: 26,
    },
    backBtn: {
        borderWidth: 1.5,
        borderColor: Colors.BRAND_PRIMARY,
        borderRadius: 100,
        paddingVertical: hp(14),
        paddingHorizontal: wp(40),
        marginTop: hp(4),
    },
});