import { AntenatalIcon } from '@/assets/icons/patient_icon/AntenatalIcon';
import { GeneralIcon } from '@/assets/icons/patient_icon/GenaralIcon';
import { PediatricIcon } from '@/assets/icons/patient_icon/PediatricIcon';
import { VaccinesIcon } from '@/assets/icons/patient_icon/VaccinesIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body2, Caption1, Caption2, H3, H6 } from '@/components/typo/Typography';
import { DOCTORS, SERVICE_NAMES } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { getImageSource } from '@/utils/imageSource';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
    '1': <GeneralIcon />,
    '2': <PediatricIcon />,
    '3': <AntenatalIcon />,
    '4': <VaccinesIcon />,
    '5': <GeneralIcon />,
    '6': <AntenatalIcon />,
};

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ServiceDetailScreen() {
    const router = useRouter();
    const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

    const service = SERVICE_NAMES.find(s => s.id === serviceId) ?? SERVICE_NAMES[0];
    const relatedDoctors = DOCTORS.filter(d => service.doctorIds.includes(d.id));

    const isFree = service.id === '6';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionTitle title="Service Details" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroIconWrapper}>
                        {SERVICE_ICONS[service.id]}
                    </View>
                    <View style={styles.heroInfo}>
                        <H3 style={styles.heroTitle}>{service.name}</H3>
                        <Caption1 style={styles.heroSubtitle}>{service.subtitle}</Caption1>
                    </View>
                </View>

                {/* Price Badge */}
                <View style={styles.priceRow}>
                    <View style={styles.priceBadge}>
                        <Caption2 style={styles.priceLabel}>Anggaran Harga</Caption2>
                        <H6 style={styles.priceValue} color={Colors.BRAND_PRIMARY}>
                            {service.price}
                        </H6>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <H6 style={styles.sectionTitle}>Tentang Perkhidmatan</H6>
                    <Body2 style={styles.description}>{service.description}</Body2>
                </View>

                {/* Related Doctors */}
                {relatedDoctors.length > 0 && (
                    <View style={styles.section}>
                        <H6 style={styles.sectionTitle}>Doktor Berkaitan</H6>
                        <View style={styles.doctorsList}>
                            {relatedDoctors.map(doctor => (
                                <TouchableOpacity
                                    key={doctor.id}
                                    style={styles.doctorCard}
                                    activeOpacity={0.8}
                                    onPress={() => router.push({
                                        pathname: '/patient/doctors_info/doctor_details' as any,
                                        params: { doctorId: doctor.id },
                                    })}
                                >
                                    <Image
                                        source={getImageSource(doctor.image)}
                                        style={styles.doctorImg}
                                    />
                                    <View style={styles.doctorInfo}>
                                        <Caption1
                                            weight="semiBold"
                                            color={Colors.BRAND_PRIMARY}
                                            numberOfLines={1}
                                        >
                                            {doctor.name}
                                        </Caption1>
                                        <Caption2
                                            color="#888"
                                            numberOfLines={2}
                                            style={{ marginTop: 2 }}
                                        >
                                            {doctor.fullSpecialty}
                                        </Caption2>
                                    </View>
                                    {/* <View style={styles.tierBadge}>
                                        <Caption2 style={[
                                            styles.tierText,
                                            { color: doctor.tier === 'Tier 1' ? '#388E3C' : '#F57C00' }
                                        ]}>
                                            {doctor.tier}
                                        </Caption2>
                                    </View> */}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={{ height: hp(100) }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                {isFree ? (
                    <CustomButton
                        title="Baca Artikel"
                        onPress={() => { }}
                        width="100%"
                        height={hp(54)}
                        borderRadius={14}
                    />
                ) : (
                    <CustomButton
                        title="Select Doctors"
                        onPress={() => router.push('/patient/booking_appointment/book_appointment' as any)}
                        width="100%"
                        height={hp(54)}
                        borderRadius={14}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scrollContent: {
        paddingTop: hp(16),
        paddingBottom: hp(20),
    },

    // ── Hero ──
    heroCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: wp(20),
        gap: wp(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(16),
    },
    heroIconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroEmoji: {
        fontSize: 48,
    },
    heroInfo: {
        flex: 1,
    },
    heroTitle: {
        color: Colors.BRAND_PRIMARY,
        fontWeight: '700',
    },
    heroSubtitle: {
        color: '#888888',
        marginTop: 4,
    },

    // ── Price ──
    priceRow: {
        marginBottom: hp(20),
    },
    priceBadge: {
        backgroundColor: '#EBF6FA',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(12),
        borderWidth: 1,
        borderColor: '#C8E9F4',
    },
    priceLabel: {
        color: '#666',
        marginBottom: 4,
    },
    priceValue: {
        fontWeight: '700',
    },

    // ── Section ──
    section: {
        marginBottom: hp(24),
    },
    sectionTitle: {
        color: '#1A1A1A',
        fontWeight: '700',
        marginBottom: hp(12),
    },
    description: {
        color: '#444444',
        lineHeight: 24,
    },

    // ── Doctors ──
    doctorsList: {
        gap: hp(10),
    },
    doctorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        gap: wp(12),
    },
    doctorImg: {
        width: wp(52),
        height: wp(52),
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
    },
    doctorInfo: {
        flex: 1,
    },
    tierBadge: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: wp(8),
        paddingVertical: hp(4),
    },
    tierText: {
        fontSize: 11,
        fontWeight: '700',
    },

    // ── Bottom Bar ──
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(20),
        paddingTop: hp(12),
        paddingBottom: hp(40),
    },
});