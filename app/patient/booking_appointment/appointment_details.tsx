import { CancelModal } from '@/components/shared/CancleModal';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body2, Body3, Caption1, Caption2, Caption4, H5, H6 } from '@/components/typo/Typography';
import { APPOINTMENTS_DATA } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppointmentDetails() {
    const router = useRouter();
    const { appointmentId } = useLocalSearchParams();
    const [showCancelModal, setShowCancelModal] = useState(false);


    const data = APPOINTMENTS_DATA.find(item => item.id === appointmentId) || APPOINTMENTS_DATA[0];

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <SectionTitle title='Details' />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.doctorCard}>
                    <Image source={{ uri: data.image }} style={styles.doctorImg} />
                    <View style={styles.doctorInfo}>
                        <View style={styles.nameRow}>
                            <View>
                                <Body1 color={Colors.BRAND_PRIMARY}>{data.doctorName}</Body1>
                            </View>
                            <View style={styles.tierBadge}>
                                <Caption4 color={Colors.SUCCESS_COLOR} weight="semiBold">{data.tier}</Caption4>
                            </View>
                        </View>
                        <Body1 color="#818181" style={{ marginTop: 4 }}>{data.specialty}</Body1>
                    </View>
                </View>

                <H5 style={styles.sectionTitle} weight="bold">Appointment Details</H5>

                {/* Status Section */}
                <View style={styles.statusSectionContainer}>
                    {/* Label 'Status' - stays on top */}
                    <Caption1 color={Colors.TEXT_COLOR} style={{ marginBottom: 6 }}>Status</Caption1>

                    {/* Row containing Badge and Date/Time */}
                    <View style={styles.badgeAndDateRow}>
                        {/* Status Badge */}
                        <View style={[
                            styles.statusBadge,
                            {
                                backgroundColor: getStatusBg(data.status),
                                borderWidth: (data.status === 'Completed' || data.status === 'Canceled') ? 1 : 0,
                                borderColor: data.status === 'Completed' ? Colors.SUCCESS_COLOR : Colors.COLOR_DANGER
                            }
                        ]}>
                            <Caption2 weight="semiBold" color={getStatusTextColor(data.status)}>
                                {data.status}
                            </Caption2>
                        </View>

                        {/* Date and Time */}
                        <View style={styles.dateTimeWrapper}>
                            <H6 weight="semiBold" color="#0D0D0D">{data.date}</H6>
                            <H6 weight="medium" color="#666">{data.time}</H6>
                        </View>
                    </View>
                </View>

                <View style={styles.infoBlock}>
                    <Body3 color={Colors.TEXT_COLOR}>Visit Reason</Body3>
                    <Body2 weight="bold" style={{ marginTop: 4 }}>{data.reason}</Body2>
                    <Body2 color="#0D0D0D" weight='regular' style={styles.description}>{data.details}</Body2>
                </View>

                <View style={styles.infoBlock}>
                    <Caption1 color={Colors.TEXT_COLOR}>
                        Patients <Caption2 color="#0D0D0D80">{data.patientType}</Caption2>
                    </Caption1>
                    <Body2 weight="bold" style={{ marginTop: 4 }}>{data.patientName}</Body2>
                </View>

                {(data.status === 'Accepted' || data.status === 'Pending') && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCancelModal(true)}>
                            <Caption4 color={Colors.COLOR_DANGER} weight="semiBold">Cancel Appointment</Caption4>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rescheduleBtn}>
                            <Caption4 color="#353535" weight="semiBold">Reschedule</Caption4>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <CancelModal
                visible={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => setShowCancelModal(false)}
            />
        </SafeAreaView>
    );
}

const getStatusBg = (s: string) => s === 'Accepted' ? Colors.BRAND_PRIMARY : s === 'Canceled' ? '#FFEBEE' : s === 'Completed' ? '#E8F5E9' : Colors.ACCENT_YELLOW;
const getStatusTextColor = (s: string) => (s === 'Accepted' || s === 'Pending') ? '#FFF' : s === 'Canceled' ? Colors.COLOR_DANGER : Colors.SUCCESS_COLOR;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: wp(20)
    },


    scrollContent: {
        paddingBottom: hp(40),
    },

    doctorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(-5),
    },

    doctorImg: {
        width: wp(100),
        height: wp(100),
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        marginTop: 20
    },

    doctorInfo: {
        flex: 1,
        marginLeft: wp(16),
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    tierBadge: {
        marginLeft: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.SUCCESS_COLOR,
        backgroundColor: "#1D9E7533"
    },

    sectionTitle: {
        marginTop: hp(30),
        marginBottom: hp(20),
    },

   

    statusBadge: {
         paddingHorizontal: wp(16),
        paddingVertical: hp(8),
        borderRadius: 10,
        minWidth: wp(90),
        alignItems: 'center',
        justifyContent: 'center',
    },

    dateTimeContainer: {
        alignItems: 'flex-start',
    },

    statusSectionContainer: {
        marginBottom: hp(25),
    },

    badgeAndDateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
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

    buttonContainer: {
        flexDirection: 'row',
        gap: wp(15),
        marginTop: hp(20),
    },

    cancelBtn: {
        flex: 1,
        height: hp(55),
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FF383C1A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    rescheduleBtn: {
        flex: 1,
        height: hp(55),
        borderRadius: 16,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#0000001A"
    },
});