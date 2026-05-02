// app/admin/profile/edit_profile.tsx
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon'
import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, H6 } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { getImageSource } from '@/utils/imageSource'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function getDoctorById(doctorId: string) {
    const found = ADMIN_APPOINTMENTS.find(a => a.doctorId === doctorId)
    if (!found) return null
    return {
        doctorId: found.doctorId,
        doctorName: found.doctorName,
        doctorImage: found.doctorImage,
        doctorSpecialty: found.doctorSpecialty,
    }
}

export default function EditDoctorProfileScreen() {
    const router = useRouter()
    const { doctorId } = useLocalSearchParams<{ doctorId: string }>()

    const doctor = getDoctorById(doctorId ?? 'd1') ?? {
        doctorId: 'd1',
        doctorName: 'Dr. Anis Effendi',
        doctorImage: 'https://i.pravatar.cc/150?u=anis1',
        doctorSpecialty: 'GENERAL PRACTITIONER Primary Care For Adults & Children',
    }

    const [name, setName] = useState(doctor.doctorName)
    const [designation, setDesignation] = useState(doctor.doctorSpecialty)
    const [about, setAbout] = useState(
        'As a former Head of House Officer in General Internal Medicine, he has demonstrated exceptional leadership and decision-making skills. Dr. Anis has also played a key role in COVID-19 management and compliance.'
    )
    const consultationTime = 'Sunday - Friday | 08:00 AM - 01:00PM'
    const services = 'Bridge, Dental Cleaning, Pediatric...'

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

            <View style={styles.header}>
                <SectionTitle title="Edit Profile" />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image source={getImageSource(doctor.doctorImage)} style={styles.avatar} />
                            <View style={styles.cameraBtn}>
                                <EditIcon size={14} color='#FFFFFF' />
                            </View>
                        </View>
                    </View>

                    {/* Name */}
                    <Caption1 weight='medium' style={styles.label}>Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>

                    {/* Designation */}
                    <Caption1 weight='medium' style={styles.label}>Designation</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={designation}
                            onChangeText={setDesignation}
                            multiline
                            style={styles.input}
                        />
                    </View>

                    {/* Consultation Time */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Time</Caption1>
                    <TouchableOpacity
                        style={styles.navRow}
                        activeOpacity={0.8}
                        onPress={() => router.push('/admin/profile/consultation_time' as any)}
                    >
                        <H6 weight='medium' style={styles.navText} numberOfLines={1}>
                            {consultationTime}
                        </H6>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    {/* About */}
                    <Caption1 weight='medium' style={styles.label}>About</Caption1>
                    <View style={[styles.inputBox, { minHeight: hp(120) }]}>
                        <TextInput
                            value={about}
                            onChangeText={setAbout}
                            multiline
                            style={[styles.input, { lineHeight: 22 }]}
                        />
                    </View>

                    {/* Services */}
                    <Caption1 weight='medium' style={styles.label}>Services</Caption1>
                    <TouchableOpacity
                        style={styles.navRow}
                        activeOpacity={0.8}
                        onPress={() => router.push('/admin/profile/services' as any)}
                    >
                        <Caption1 weight='medium' style={styles.navText} numberOfLines={1}>
                            {services}
                        </Caption1>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    <CustomButton
                        title="Update profile"
                        onPress={() => router.back()}
                        height={56}
                        width="100%"
                        borderRadius={16}
                        style={{ marginTop: hp(20) }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    flex: { flex: 1 },
    header: { paddingHorizontal: wp(20) },
    scrollContent: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },

    avatarSection: { alignItems: 'center', marginVertical: hp(20) },
    avatarWrapper: { position: 'relative' },
    avatar: {
        width: 115, height: 115, borderRadius: 60,
        backgroundColor: '#E8F5F2',
        borderWidth: 3, borderColor: '#E8F5F2',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 10, right: 2,
        backgroundColor: Colors.BRAND_PRIMARY,
        width: 28, height: 28, borderRadius: 14,
        padding: 5,
        justifyContent: 'center', alignItems: 'center',
    },

    label: {
        color: Colors.TEXT_COLOR,
        marginBottom: hp(6),
        marginTop: hp(16),
        fontWeight: '600',
    },

    inputBox: {
        borderWidth: 1, borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16), paddingVertical: hp(4),
    },
    input: {
        fontSize: 16,
        color: Colors.PLACEHOLLDER_TEXT,
        paddingVertical: hp(14),
        fontFamily: 'Poppins_400Regular',
    },

    navRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16), paddingVertical: hp(18),
    },
    navText: { flex: 1 },
})