// app/admin/profile/manage_doctors.tsx
import { ProfileCard } from '@/components/shared/ProfileCard'
import SectionTitle from '@/components/shared/SectionTitle'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// unique doctors from adminData by doctorId
const doctorMap = new Map<string, { doctorId: string; doctorName: string; doctorImage: string; doctorSpecialty: string }>()
ADMIN_APPOINTMENTS.forEach(a => {
    if (!doctorMap.has(a.doctorId)) {
        doctorMap.set(a.doctorId, {
            doctorId: a.doctorId,
            doctorName: a.doctorName,
            doctorImage: a.doctorImage,
            doctorSpecialty: a.doctorSpecialty,
        })
    }
})
const DOCTORS = Array.from(doctorMap.values())

export default function ManageDoctors() {
    const router = useRouter()

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionTitle title="Manage Doctors" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.menuSection}>
                    {DOCTORS.map(doctor => (
                        <ProfileCard
                            key={doctor.doctorId}
                            icon={
                                <Image
                                    source={{ uri: doctor.doctorImage }}
                                    style={styles.avatar}
                                />
                            }
                            label={doctor.doctorName}
                            iconBG={`${Colors.BRAND_PRIMARY}1A`}
                            onPress={() =>
                                router.push({
                                    pathname: '/admin/profile/edit_profile' as any,
                                    params: { doctorId: doctor.doctorId },
                                })
                            }
                        />
                    ))}
                </View>
            </ScrollView>
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
})