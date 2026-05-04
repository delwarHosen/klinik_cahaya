import { DownloadIcon } from '@/assets/icons/common_icon/DownloadIcon';
import { DateTimePickerModal } from '@/components/booking/DateTimePickerModal';
import { CancelModal } from '@/components/shared/CancleModal';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body2, Body3, Caption1, Caption2, H5, H6 } from '@/components/typo/Typography';
import { APPOINTMENTS_DATA, DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { getImageSource } from '@/utils/imageSource';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DOWNLOAD_ITEMS = [
    { key: 'diagnosis', label: 'Diagnosis Report' },
    { key: 'prescription', label: 'Prescription' },
    { key: 'billing', label: 'Billing receipt' },
];

export default function AppointmentDetails() {
    const router = useRouter();
    const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [rescheduleVisible, setRescheduleVisible] = useState(false);

    const data = APPOINTMENTS_DATA.find(item => item.id === String(appointmentId)) || APPOINTMENTS_DATA[0];

    const status = data.status?.trim();
    const isCompleted = status === 'Completed';
    const isCanceled = status === 'Canceled';
    const isPending = status === 'Pending';

   
    const showActions = isPending;

    const doctor = DOCTORS.find(d => d.id === data.doctorId);

    const handleDoctorPress = () => {
        const targetId = doctor?.id ?? data.doctorId;
        if (targetId) {
            router.push({
                pathname: '/patient/doctors_info/doctor_details' as any,
                params: { doctorId: String(targetId) },
            });
        }
    };

    const handleRescheduleConfirm = (date: string, time: string) => {
        setRescheduleVisible(false);
        console.log("Rescheduled to:", date, time);
        router.push({
            pathname: '/patient/doctors_info/information' as any,
            params: { activeTab: 'Upcoming' },
        });
    };

    const handleCancelConfirm = () => {
        setShowCancelModal(false);
        console.log('Appointment cancelled');
    };

    const handleDownload = (key: string) => {
        console.log('Download:', key);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <SectionTitle title='Details' />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Doctor Card */}
                <TouchableOpacity
                    style={styles.doctorCard}
                    onPress={handleDoctorPress}
                    activeOpacity={0.8}
                >
                    <Image source={getImageSource(data.image)} style={styles.doctorImg} />
                    <View style={styles.doctorInfo}>
                        <Body1 color={Colors.BRAND_PRIMARY}>{data.doctorName}</Body1>
                        <Body1 color="#818181" style={{ marginTop: 4 }}>{data.specialty}</Body1>
                    </View>
                </TouchableOpacity>

                <H5 style={styles.sectionTitle} weight="semiBold">Appointment Details</H5>

                {/* Status Section */}
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
                            <H6 weight="semiBold" color="#0D0D0D">{data.date}</H6>
                            <H6 weight="medium" color="#666">{data.time}</H6>
                        </View>
                    </View>
                </View>

                {/* Canceled — Reason box */}
                {isCanceled && (
                    <View style={styles.cancelReasonBox}>
                        <Caption1 weight="semiBold" color={Colors.COLOR_DANGER}>Reason</Caption1>
                        <Body2 weight="semiBold" color="#0D0D0D" style={{ marginTop: hp(4) }}>
                            {data.cancelReason ?? 'No reason provided'}
                        </Body2>
                        <Caption2 color="#888" style={{ marginTop: hp(4) }}>
                            {data.cancelDate ?? ''}
                        </Caption2>
                    </View>
                )}

                {/* Visit Reason */}
                <View style={styles.infoBlock}>
                    <Body3 color={Colors.TEXT_COLOR}>Visit Reason</Body3>
                    <Body2 weight="bold" style={{ marginTop: 4 }}>{data.reason}</Body2>
                    <Body2 color="#0D0D0D" weight='regular' style={styles.description}>{data.details}</Body2>
                </View>

                {/* Patients */}
                <View style={styles.infoBlock}>
                    <Caption1 color={Colors.TEXT_COLOR}>
                        Patients <Caption2 color="#0D0D0D80">{data.patientType}</Caption2>
                    </Caption1>
                    <Body2 weight="bold" style={{ marginTop: 4 }}>{data.patientName}</Body2>
                </View>

                {/* Download Section — শুধু Completed এ */}
                {isCompleted && (
                    <View style={styles.downloadSection}>
                        {DOWNLOAD_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={styles.downloadRow}
                                onPress={() => handleDownload(item.key)}
                                activeOpacity={0.7}
                            >
                                <Caption1 weight='semiBold' style={styles.downloadLabel}>{item.label}</Caption1>
                                <DownloadIcon />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/*  Action Buttons —  Pending */}
                {showActions && (
                    <View style={styles.actionsContainer}>
                        <View style={styles.buttonRow}>
                            <CustomButton
                                title='Cancel Appointment'
                                onPress={() => setShowCancelModal(true)}
                                backgroundColor={Colors.APP_BACKGROUND}
                                borderColor={"#FF383C1A"}
                                borderRadius={12}
                                width={"48%"}
                                height={50}
                                color={Colors.COLOR_DANGER}
                            />
                            <CustomButton
                                title='Reschedule'
                                onPress={() => setRescheduleVisible(true)}
                                backgroundColor={Colors.APP_BACKGROUND}
                                borderColor={Colors.BORDER_COLOR}
                                borderRadius={12}
                                width={"48%"}
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

const getStatusBg = (s: string) =>
    s === 'Accepted' ? Colors.BRAND_PRIMARY :
        s === 'Canceled' ? '#FFEBEE' :
            s === 'Completed' ? '#E8F5E9' :
                Colors.ACCENT_YELLOW;

const getStatusTextColor = (s: string) => {
    if (s === 'Pending') return Colors.TEXT_COLOR;
    if (s === 'Canceled') return Colors.COLOR_DANGER;
    if (s === 'Accepted') return Colors.APP_BACKGROUND;
    if (s === 'Completed') return Colors.SUCCESS_COLOR;
    return Colors.TEXT_COLOR;
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
    cancelReasonBox: {
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFD6D6',
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        marginBottom: hp(24),
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
    downloadIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
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