import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { AntenatalIcon } from '@/assets/icons/patient_icon/AntenatalIcon';
import { GeneralIcon } from '@/assets/icons/patient_icon/GenaralIcon';
import { PediatricIcon } from '@/assets/icons/patient_icon/PediatricIcon';
import { VaccinesIcon } from '@/assets/icons/patient_icon/VaccinesIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body2, Caption1, Caption2, H3, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetServiceByIdQuery } from '@/redux/services/servicesApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
    '1': <GeneralIcon />,
    '2': <PediatricIcon />,
    '3': <AntenatalIcon />,
    '4': <VaccinesIcon />,
    '5': <GeneralIcon />,
    '6': <AntenatalIcon />,
};

export default function ServiceDetailScreen() {
    const router = useRouter();
    const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

    const { data, isLoading } = useGetServiceByIdQuery(serviceId ?? '1');

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <SectionTitle title="Service Details" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.BRAND_PRIMARY} />
                </View>
            </SafeAreaView>
        );
    }

    const service = data?.service;
    const doctors: any[] = data?.doctors ?? [];

    if (!service) return null;

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
                        {service.image_url ? (
                            <Image
                                source={{ uri: service.image_url }}
                                style={styles.heroImage}
                                resizeMode="contain"
                            />
                        ) : (
                            SERVICE_ICONS[String(service.id)] ?? <GeneralIcon />
                        )}
                    </View>
                    <View style={styles.heroInfo}>
                        <H3 style={styles.heroTitle}>{service.title}</H3>
                        <Caption1 style={styles.heroSubtitle}>{service.subtitle}</Caption1>
                    </View>
                </View>

                {/* Price Badge */}
                <View style={styles.priceRow}>
                    <View style={styles.priceBadge}>
                        <Caption2 style={styles.priceLabel}>Price Range</Caption2>
                        <H6 style={styles.priceValue} color={Colors.BRAND_PRIMARY}>
                            {service.price_range}
                        </H6>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <H6 style={styles.sectionTitle}>About Service</H6>
                    <Body2 style={styles.description}>{service.description}</Body2>
                </View>

                {/* Doctors */}
                {doctors.length > 0 && (
                    <View style={styles.section}>
                        <H6 style={styles.sectionTitle}>Available Doctors</H6>
                        <View style={styles.doctorsList}>
                            {doctors.map((doctor: any) => (
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
                                        source={{ uri: doctor.avatar_url }}
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
                                            numberOfLines={1}
                                            style={{ marginTop: 2 }}
                                        >
                                            {doctor.specialization}
                                        </Caption2>
                                        <Caption2
                                            color="#aaa"
                                            numberOfLines={1}
                                            style={{ marginTop: 2 }}
                                        >
                                            {doctor.consultation_days?.split(',').slice(0, 2).join(', ')}
                                            {' · '}
                                            {doctor.consultation_time}
                                        </Caption2>
                                    </View>
                                    <RightAngleIcon color={Colors.BRAND_PRIMARY} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={{ height: hp(60) }} />
            </ScrollView>
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
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: 56,
        height: 56,
        borderRadius: 10,
    },
    heroInfo: { flex: 1 },
    heroTitle: { color: Colors.BRAND_PRIMARY, fontWeight: '700' },
    heroSubtitle: { color: '#888888', marginTop: 4 },
    priceRow: { marginBottom: hp(20) },
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
        marginBottom: 4
    },
    priceValue: {
        fontWeight: '700'
    },
    section: {
        marginBottom: hp(24)
    },
    sectionTitle: {
        color: '#1A1A1A',
        fontWeight: '700',
        marginBottom: hp(12)
    },
    description: {
        color: '#444444',
        lineHeight: 24
    },
    doctorsList: {
        gap: hp(10)
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
    doctorInfo: { flex: 1 },
});