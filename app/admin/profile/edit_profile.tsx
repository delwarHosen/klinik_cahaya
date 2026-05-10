// app/admin/profile/edit_profile.tsx
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon'
import { DayPickerModal } from '@/components/admin/DayPickerModal'
import { TimePickerModal } from '@/components/admin/Timepickermodal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Caption1, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import {
    useDeleteDoctorMutation,
    useGetDoctorByIdQuery,
    useUpdateDoctorProfileMutation,
} from '@/redux/services/adminDoctors'
import { hp, wp } from '@/utils/responsiveDevice'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
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

function extractErrorMessage(err: any): string {
    const detail = err?.data?.detail
    if (Array.isArray(detail) && detail.length > 0) {
        return detail.map((d: any) => `${d.loc?.slice(-1)[0]}: ${d.msg}`).join('\n')
    }
    if (typeof detail === 'string') return detail
    return err?.data?.message ?? err?.data ?? 'Failed. Please try again.'
}

export default function EditDoctorProfileScreen() {
    const router = useRouter()
    const { doctorId } = useLocalSearchParams<{ doctorId: string }>()

    const { data, isLoading, refetch } = useGetDoctorByIdQuery(doctorId ?? '', {
        skip: !doctorId,
        refetchOnMountOrArgChange: true,
    })
    const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorProfileMutation()
    const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation()

    const doctor = data?.data

    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [designation, setDesignation] = useState('')
    const [about, setAbout] = useState('')

    const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null)
    const [avatarAsset, setAvatarAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)

    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [startTime, setStartTime] = useState('08:00 AM')
    const [endTime, setEndTime] = useState('01:00 PM')
    const [showDayPicker, setShowDayPicker] = useState(false)
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)

    useEffect(() => {
        if (doctor) {
            setName(doctor.name ?? '')
            setFullName(doctor.full_name ?? '')
            setDesignation(doctor.designation ?? '')
            setAbout(doctor.about ?? '')
            if (doctor.consultation_days) {
                setSelectedDays(
                    doctor.consultation_days.split(',').map((d) => d.trim()).filter(Boolean)
                )
            }
            if (doctor.consultation_time) {
                const parts = doctor.consultation_time.split(' - ')
                if (parts.length === 2) {
                    setStartTime(parts[0].trim())
                    setEndTime(parts[1].trim())
                }
            }
        }
    }, [doctor])

    const dayLabel =
        selectedDays.length === 0
            ? 'Select Days'
            : selectedDays.length === 7
                ? 'Everyday'
                : `${selectedDays[0]} - ${selectedDays[selectedDays.length - 1]}`

    const timeLabel = `${startTime} - ${endTime}`

    // const handlePickImage = async () => {
    //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    //     if (status !== 'granted') {
    //         Alert.alert('Permission required', 'Please allow access to your photo library.')
    //         return
    //     }
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: 'images',
    //         allowsEditing: true,
    //         aspect: [1, 1],
    //         quality: 0.8,
    //     })
    //     if (!result.canceled && result.assets.length > 0) {
    //         setLocalAvatarUri(result.assets[0].uri)
    //         setAvatarAsset(result.assets[0])
    //     }
    // }

  const handleUpdate = async () => {
    if (!doctorId) return
    if (!fullName.trim()) {
        showToast('Full name is required.', 'error')
        return
    }

    try {
        await updateDoctor({
            doctorId,
            formData: {
                name: name.trim() || '',
                full_name: fullName.trim(),
                designation: designation.trim(),
                specialization: doctor?.specialization ?? '',
                tier: doctor?.tier,
                active: doctor?.active,
                consultation_days: selectedDays,
                consultation_time: timeLabel,
                about: about.trim(),
                specialties: doctor?.specialties ?? '',
                avatar_url: doctor?.avatar_url ?? '',
                yezza_provider_id: doctor?.yezza_provider_id,
                yezza_service_id: doctor?.yezza_service_id,
                doctor_phone: doctor?.doctor_phone != null ? String(doctor.doctor_phone) : '',
            },
        }).unwrap()

        showToast('Profile updated successfully!', 'success')
        setAvatarAsset(null)
        await refetch()
        router.back()
    } catch (err: any) {
        console.log('Update error:', JSON.stringify(err, null, 2))
        showToast(extractErrorMessage(err), 'error')
    }
}

    const handleDelete = () => {
        Alert.alert(
            'Delete Doctor',
            `Are you sure you want to delete ${doctor?.name ?? 'this doctor'}? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (!doctorId) return
                        try {
                            await deleteDoctor(doctorId).unwrap()
                            showToast('Doctor deleted successfully.', 'success')
                            router.back()
                        } catch (err: any) {
                            console.log('Delete error:', JSON.stringify(err, null, 2))
                            showToast(extractErrorMessage(err), 'error')
                        }
                    },
                },
            ]
        )
    }

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
            </SafeAreaView>
        )
    }

    const avatarSource = localAvatarUri
        ? { uri: localAvatarUri }
        : doctor?.avatar_url
            ? { uri: doctor.avatar_url }
            : undefined

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
                    {/* ── Avatar ── */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image source={avatarSource} style={styles.avatar} />
                            <TouchableOpacity
                                style={styles.cameraBtn}
                                activeOpacity={0.8}
                                onPress={()=>{}}
                                // onPress={handlePickImage}
                            >
                                {/* <EditIcon size={14} color='#FFFFFF' /> */}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── Name ── */}
                    <Caption1 weight='medium' style={styles.label}>Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput value={name} onChangeText={setName} style={styles.input}
                            placeholder="Display name" placeholderTextColor={Colors.PLACEHOLLDER_TEXT} />
                    </View>

                    {/* ── Full Name ── */}
                    <Caption1 weight='medium' style={styles.label}>Full Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput value={fullName} onChangeText={setFullName} style={styles.input}
                            placeholder="Full name" placeholderTextColor={Colors.PLACEHOLLDER_TEXT} />
                    </View>

                    {/* ── Designation ── */}
                    <Caption1 weight='medium' style={styles.label}>Designation</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput value={designation} onChangeText={setDesignation}
                            multiline style={styles.input} placeholder="Designation"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT} />
                    </View>

                    {/* ── Consultation Days ── */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Days</Caption1>
                    <TouchableOpacity style={styles.navRow} activeOpacity={0.8}
                        onPress={() => setShowDayPicker(true)}>
                        <H6 weight='medium' style={styles.navText} numberOfLines={1}>{dayLabel}</H6>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    {/* ── Consultation Time ── */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Time</Caption1>
                    <TouchableOpacity style={styles.navRow} activeOpacity={0.8}
                        onPress={() => setShowStartPicker(true)}>
                        <H6 weight='medium' style={styles.navText} numberOfLines={1}>{timeLabel}</H6>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    {/* ── About ── */}
                    <Caption1 weight='medium' style={styles.label}>About</Caption1>
                    <View style={[styles.inputBox, { minHeight: hp(120) }]}>
                        <TextInput value={about} onChangeText={setAbout} multiline
                            style={[styles.input, { lineHeight: 22 }]} placeholder="About doctor"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT} />
                    </View>

                    {/* ── Services ── */}
                    <Caption1 weight='medium' style={styles.label}>Services</Caption1>
                    <TouchableOpacity style={styles.navRow} activeOpacity={0.8}
                        onPress={() => router.push('/admin/profile/services' as any)}>
                        <Caption1 weight='medium' style={styles.navText} numberOfLines={1}>
                            {doctor?.specialties?.replace(/\|/g, ', ') ?? '—'}
                        </Caption1>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    {/* ── Update Button ── */}
                    <CustomButton
                        title="Update profile"
                        onPress={handleUpdate}
                        height={56} width="100%" borderRadius={16}
                        style={{ marginTop: hp(20) }}
                        isLoading={isUpdating}
                    />

                    {/* ── Delete Button ── */}
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        activeOpacity={0.8}
                        onPress={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? <ActivityIndicator color='#FF3B30' size="small" />
                            : <H6 weight='medium' style={styles.deleteBtnText}>Delete Doctor</H6>
                        }
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <DayPickerModal
                visible={showDayPicker}
                selectedDays={selectedDays}
                onClose={() => setShowDayPicker(false)}
                onConfirm={(days) => { setSelectedDays(days); setShowDayPicker(false) }}
            />
            <TimePickerModal
                visible={showStartPicker} title="Starting Time" initialTime={startTime}
                onClose={() => setShowStartPicker(false)}
                onConfirm={(t) => { setStartTime(t); setShowStartPicker(false); setShowEndPicker(true) }}
            />
            <TimePickerModal
                visible={showEndPicker} title="Ending Time" initialTime={endTime}
                onClose={() => setShowEndPicker(false)}
                onConfirm={(t) => { setEndTime(t); setShowEndPicker(false) }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    flex: { flex: 1 },
    centered: { justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: wp(20) },
    scrollContent: { paddingHorizontal: wp(20), paddingBottom: hp(32) },
    avatarSection: { alignItems: 'center', marginVertical: hp(20) },
    avatarWrapper: { position: 'relative' },
    avatar: {
        width: 115, height: 115, borderRadius: 60,
        backgroundColor: '#E8F5F2', borderWidth: 3, borderColor: '#E8F5F2', overflow: 'hidden',
    },
    cameraBtn: {
        // position: 'absolute', bottom: 10, right: 2,
        // backgroundColor: Colors.BRAND_PRIMARY,
        // width: 28, height: 28, borderRadius: 14, padding: 5,
        // justifyContent: 'center', alignItems: 'center',
    },
    label: { color: Colors.TEXT_COLOR, marginBottom: hp(6), marginTop: hp(16), fontWeight: '600' },
    inputBox: {
        borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12,
        paddingHorizontal: wp(16), paddingVertical: hp(4),
    },
    input: {
        fontSize: 16, color: Colors.PLACEHOLLDER_TEXT,
        paddingVertical: hp(14), fontFamily: 'Poppins_400Regular',
    },
    navRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12,
        paddingHorizontal: wp(16), paddingVertical: hp(18),
    },
    navText: { flex: 1 },
    deleteBtn: {
        marginTop: hp(12), height: 56, borderRadius: 16,
        borderWidth: 1.5, borderColor: '#FF3B30',
        justifyContent: 'center', alignItems: 'center',
    },
    deleteBtnText: { color: '#FF3B30' },
})