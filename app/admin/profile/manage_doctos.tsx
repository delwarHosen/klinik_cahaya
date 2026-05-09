// app/admin/profile/manage_doctors.tsx
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon'
import { ProfileCard } from '@/components/shared/ProfileCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { Colors } from '@/constants/theme'
import { useGetAllDoctorsQuery } from '@/redux/services/adminDoctors'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ManageDoctors() {
    const router = useRouter()
    const { data, isLoading, isError } = useGetAllDoctorsQuery()

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionTitle title="Manage Doctors" />

            {isLoading && (
                <View style={styles.centered}>
                    <ActivityIndicator color={Colors.BRAND_PRIMARY} />
                </View>
            )}

            {isError && (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Failed to load doctors.</Text>
                </View>
            )}

            {!isLoading && !isError && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.menuSection}>
                        {data?.results.map(doctor => (
                            <ProfileCard
                                key={doctor.id}
                                icon={
                                    <Image
                                        source={{ uri: doctor.avatar_url }}
                                        style={styles.avatar}
                                    />
                                }
                                label={doctor.name ?? doctor.full_name}
                                iconBG={`${Colors.BRAND_PRIMARY}1A`}
                                onPress={() =>
                                    router.push({
                                        pathname: '/admin/profile/edit_profile' as any,
                                        params: { doctorId: doctor.id },
                                    })
                                }
                            />
                        ))}
                    </View>

                    <ProfileCard
                        icon={<PlusButtonIcon size={16} color={Colors.BRAND_PRIMARY} />}
                        label="Add Doctor"
                        iconBG={`${Colors.COLOR_DANGER}1A`}
                        textColor={Colors.BRAND_PRIMARY}
                        rightAngleColor={Colors.BRAND_PRIMARY}
                        onPress={() => router.push('/admin/profile/add_doctor' as any)}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scrollContent: {
        paddingBottom: hp(100),
        paddingTop: hp(10),
    },
    menuSection: { gap: 0 },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.COLOR_DANGER,
        fontSize: 14,
    },
})