// app/admin/profile/edit_profile.tsx
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon'
import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Caption1, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import {
    useGetDoctorByIdQuery,
    useUpdateDoctorProfileMutation,
} from '@/redux/services/adminDoctors'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
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

export default function EditDoctorProfileScreen() {
    const router = useRouter()
    const { doctorId } = useLocalSearchParams<{ doctorId: string }>()

    const { data, isLoading } = useGetDoctorByIdQuery(doctorId ?? '', {
        skip: !doctorId,
    })
    const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorProfileMutation()

    const doctor = data?.data

    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [designation, setDesignation] = useState('')
    const [about, setAbout] = useState('')

    useEffect(() => {
        if (doctor) {
            setName(doctor.name ?? '')
            setFullName(doctor.full_name ?? '')
            setDesignation(doctor.designation ?? '')
            setAbout(doctor.about ?? '')
        }
    }, [doctor])

    const handleUpdate = async () => {
        if (!doctorId) return
        try {
            await updateDoctor({
                doctorId,
                body: {
                    name: name || null,
                    full_name: fullName,
                    designation: designation,
                    specialization: doctor?.specialization ?? null,
                    tier: doctor?.tier ?? null,
                    active: doctor?.active ?? null,
                    consultation_days: doctor?.consultation_days ?? null,
                    consultation_time: doctor?.consultation_time ?? '',
                    about: about || null,
                    specialties: doctor?.specialties ?? null,
                    avatar_url: doctor?.avatar_url ?? '',
                    yezza_provider_id: doctor?.yezza_provider_id ?? null,
                    yezza_service_id: doctor?.yezza_service_id ?? 0,
                    doctor_phone: doctor?.doctor_phone ?? null,
                },
            }).unwrap()
            showToast('Profile updated successfully!', 'success')
            router.back()
        } catch (err: any) {
            const message =
                err?.data?.detail?.msg ||
                err?.data?.message ||
                err?.data ||
                'Failed to update.'
            showToast(typeof message === 'string' ? message : 'Server error occurred.', 'error')
        }
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
            </SafeAreaView>
        )
    }

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
                            <Image
                                source={{ uri: doctor?.avatar_url }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                style={styles.cameraBtn}
                                activeOpacity={0.8}
                            >
                                <EditIcon size={14} color='#FFFFFF' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Name */}
                    <Caption1 weight='medium' style={styles.label}>Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            placeholder="Display name"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                        />
                    </View>

                    {/* Full Name */}
                    <Caption1 weight='medium' style={styles.label}>Full Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            style={styles.input}
                            placeholder="Full name"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
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
                            placeholder="Designation"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
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
                            {doctor?.consultation_time ?? '—'}
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
                            placeholder="About doctor"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
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
                            {doctor?.specialties?.replace(/\|/g, ', ') ?? '—'}
                        </Caption1>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    <CustomButton
                        title="Update profile"
                        onPress={handleUpdate}
                        height={56}
                        width="100%"
                        borderRadius={16}
                        style={{ marginTop: hp(20) }}
                        isLoading={isUpdating}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    flex: { flex: 1 },
    centered: { justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: wp(20) },
    scrollContent: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
    avatarSection: { alignItems: 'center', marginVertical: hp(20) },
    avatarWrapper: { position: 'relative' },
    avatar: {
        width: 115,
        height: 115,
        borderRadius: 60,
        backgroundColor: '#E8F5F2',
        borderWidth: 3,
        borderColor: '#E8F5F2',
        overflow: 'hidden',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 10,
        right: 2,
        backgroundColor: Colors.BRAND_PRIMARY,
        width: 28,
        height: 28,
        borderRadius: 14,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: Colors.TEXT_COLOR,
        marginBottom: hp(6),
        marginTop: hp(16),
        fontWeight: '600',
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(4),
    },
    input: {
        fontSize: 16,
        color: Colors.PLACEHOLLDER_TEXT,
        paddingVertical: hp(14),
        fontFamily: 'Poppins_400Regular',
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(18),
    },
    navText: { flex: 1 },
})