// app/patient/(tabs)/search.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, Caption2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetDoctorsQuery } from '@/redux/services/doctorsApi';
import { useGetServicesQuery } from '@/redux/services/servicesApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ResultItem =
    | { kind: 'doctor'; id: string; name: string; subtitle: string }
    | { kind: 'service'; id: number; name: string; subtitle: string };

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const { data: doctorsData } = useGetDoctorsQuery(undefined);
    const { data: servicesData } = useGetServicesQuery(undefined);

    const doctors = doctorsData?.data ?? [];
    const services = servicesData?.results ?? [];

    const q = query.trim().toLowerCase();

    const results: ResultItem[] = q
        ? [
            ...doctors
                .filter((d: any) =>
                    d.name.toLowerCase().includes(q) ||
                    d.specialization?.toLowerCase().includes(q)
                )
                .map((d: any) => ({
                    kind: 'doctor' as const,
                    id: d.id,
                    name: d.name,
                    subtitle: d.specialization ?? '',
                })),
            ...services
                .filter((s: any) =>
                    s.title.toLowerCase().includes(q) ||
                    s.subtitle?.toLowerCase().includes(q)
                )
                .map((s: any) => ({
                    kind: 'service' as const,
                    id: s.id,
                    name: s.title,
                    subtitle: s.subtitle ?? '',
                })),
        ]
        : [];

    const handlePress = (item: ResultItem) => {
        if (item.kind === 'doctor') {
            router.push({
                pathname: '/patient/doctors_info/doctor_details' as any,
                params: { doctorId: item.id },
            });
        } else {
            router.push({
                pathname: '/patient/services/service_detail' as any,
                params: { serviceId: item.id },
            });
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionTitle title="Search" />

            {/* Search Input */}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Search doctors or services"
                    placeholderTextColor={Colors.TEXT_COLOR}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                        <Caption1 style={styles.clearBtn}>✕</Caption1>
                    </TouchableOpacity>
                )}
            </View>

            {/* Results */}
            <FlatList
                data={results}
                keyExtractor={(item) => `${item.kind}-${item.id}`}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        activeOpacity={0.8}
                        onPress={() => handlePress(item)}
                    >
                        {/* Tag badge */}
                        <View style={[
                            styles.badge,
                            item.kind === 'doctor' ? styles.doctorBadge : styles.serviceBadge,
                        ]}>
                            <Caption2 style={[
                                styles.badgeText,
                                item.kind === 'doctor' ? styles.doctorBadgeText : styles.serviceBadgeText,
                            ]}>
                                {item.kind === 'doctor' ? 'Doctor' : 'Service'}
                            </Caption2>
                        </View>

                        <Caption1 color={Colors.TEXT_COLOR} weight="semiBold" style={{ marginTop: hp(4) }}>
                            {item.name}
                        </Caption1>
                        {item.subtitle ? (
                            <Caption2 style={styles.subtitle}>{item.subtitle}</Caption2>
                        ) : null}
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp(20),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(8),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        borderRadius: 16,
        paddingHorizontal: wp(16),
        paddingVertical: hp(12),
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.TEXT_COLOR,
    },
    clearBtn: {
        color: Colors.TEXT_COLOR,
        fontSize: 16,
        paddingLeft: wp(8),
    },
    list: {
        paddingTop: hp(12),
        gap: hp(8),
    },
    resultItem: {
        paddingVertical: hp(12),
        paddingHorizontal: wp(16),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    subtitle: {
        color: '#888888',
        marginTop: 2,
    },

    // ── Badge ──
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
    },
    doctorBadge: {
        backgroundColor: '#EBF6FA',
        borderColor: '#C8E9F4',
    },
    doctorBadgeText: {
        color: Colors.BRAND_PRIMARY,
    },
    serviceBadge: {
        backgroundColor: '#F0FFF8',
        borderColor: '#B2DFCF',
    },
    serviceBadgeText: {
        color: '#1D9E75',
    },
});