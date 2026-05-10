// app/admin/profile/add_doctor.tsx
import { PhotoIcon } from '@/assets/icons/common_icon/PhotoIcon'
import { DayPickerModal } from '@/components/admin/DayPickerModal'
import { TimePickerModal } from '@/components/admin/Timepickermodal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useAddDoctorMutation } from '@/redux/services/adminDoctors'
import { hp, wp } from '@/utils/responsiveDevice'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
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

// ─── Helper: extract readable message from FastAPI 422 errors ─────────────────
function extractErrorMessage(err: any): string {
    const detail = err?.data?.detail
    if (Array.isArray(detail) && detail.length > 0) {
        return detail.map((d: any) => `${d.loc?.slice(-1)[0]}: ${d.msg}`).join('\n')
    }
    if (typeof detail === 'string') return detail
    return err?.data?.message ?? err?.data ?? 'Failed to add doctor.'
}

export default function AddDoctorProfileScreen() {
    const router = useRouter()
    const [addDoctor, { isLoading }] = useAddDoctorMutation()

    // Avatar
    const [photo, setPhoto] = useState<string | null>(null)
    const [photoAsset, setPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)

    // Basic fields
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [designation, setDesignation] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [tier, setTier] = useState('')
    const [doctorPhone, setDoctorPhone] = useState('')
    const [about, setAbout] = useState('')
    const [specialties, setSpecialties] = useState('')
    const [yezzaProviderId, setYezzaProviderId] = useState('')
    const [yezzaServiceId, setYezzaServiceId] = useState('')

    // ── Consultation Days & Time (same as consultation_time.tsx) ──────────────
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [startTime, setStartTime] = useState('08:00 AM')
    const [endTime, setEndTime] = useState('01:00 PM')
    const [showDayPicker, setShowDayPicker] = useState(false)
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)

    const dayLabel =
        selectedDays.length === 0
            ? 'Select Days'
            : selectedDays.length === 7
                ? 'Everyday'
                : `${selectedDays[0]} - ${selectedDays[selectedDays.length - 1]}`

    const timeLabel = `${startTime} - ${endTime}`

    // ─── Image Picker ──────────────────────────────────────────────────────────
    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') return

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            setPhoto(result.assets[0].uri)
            setPhotoAsset(result.assets[0])
        }
    }

    // ─── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!id.trim() || !fullName.trim()) {
            showToast('Doctor ID and Full Name are required.', 'error')
            return
        }

        try {
            const formData = new FormData()

            formData.append('id', id.trim())
            formData.append('name', name.trim())
            formData.append('full_name', fullName.trim())
            formData.append('designation', designation.trim())
            formData.append('specialization', specialization.trim())
            formData.append('tier', tier)
            formData.append('active', 'true')

            // consultation_days: send as comma-separated string (server/backend handles it)
            formData.append('consultation_days', selectedDays.join(','))
            // consultation_time: "08:00 AM - 01:00 PM"
            formData.append('consultation_time', timeLabel)

            formData.append('doctor_phone', doctorPhone.trim())
            formData.append('about', about.trim())
            formData.append('specialties', specialties.trim())
            formData.append('yezza_provider_id', yezzaProviderId)
            formData.append('yezza_service_id', yezzaServiceId)

            if (photoAsset) {
                formData.append('avatar_file', {
                    uri: photoAsset.uri,
                    name: photoAsset.fileName ?? 'avatar.jpg',
                    type: photoAsset.mimeType ?? 'image/jpeg',
                } as any)
            }

           const res= await addDoctor(formData).unwrap()
           console.log("add Doctor ", res)
            showToast('Doctor added successfully!', 'success')
            router.back()
        } catch (err: any) {
            console.log('Add doctor error:', JSON.stringify(err, null, 2))
            showToast(extractErrorMessage(err), 'error')
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <SectionTitle title="Add Doctor" />
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
                        <TouchableOpacity
                            style={styles.avatar}
                            onPress={handlePickImage}
                            activeOpacity={0.8}
                        >
                            {photo ? (
                                <Image source={{ uri: photo }} style={styles.avatarImage} />
                            ) : (
                                <PhotoIcon />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* ── Doctor ID ── */}
                    <Caption1 weight='medium' style={styles.label}>Doctor ID</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. dr_john"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={id}
                            onChangeText={setId}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* ── Name ── */}
                    <Caption1 weight='medium' style={styles.label}>Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. Dr. John"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>

                    {/* ── Full Name ── */}
                    <Caption1 weight='medium' style={styles.label}>Full Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. Dr. John Bin Abdullah"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={fullName}
                            onChangeText={setFullName}
                            style={styles.input}
                        />
                    </View>

                    {/* ── Designation ── */}
                    <Caption1 weight='medium' style={styles.label}>Designation</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. General Practitioner"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={designation}
                            onChangeText={setDesignation}
                            style={styles.input}
                        />
                    </View>

                    {/* ── Specialization ── */}
                    <Caption1 weight='medium' style={styles.label}>Specialization</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. Family Medicine"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={specialization}
                            onChangeText={setSpecialization}
                            style={styles.input}
                        />
                    </View>

                    {/* ── Tier ── */}
                    <Caption1 weight='medium' style={styles.label}>Tier</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. 1 or 2"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={tier}
                            onChangeText={setTier}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    {/* ── Consultation Days (picker) ── */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Days</Caption1>
                    <TouchableOpacity
                        style={styles.navRow}
                        activeOpacity={0.8}
                        onPress={() => setShowDayPicker(true)}
                    >
                        <Caption1 style={[styles.navText, selectedDays.length === 0 && styles.placeholder]}>
                            {dayLabel}
                        </Caption1>
                    </TouchableOpacity>

                    {/* ── Consultation Time (picker) ── */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Time</Caption1>
                    <TouchableOpacity
                        style={styles.navRow}
                        activeOpacity={0.8}
                        onPress={() => setShowStartPicker(true)}
                    >
                        <Caption1 style={styles.navText}>{timeLabel}</Caption1>
                    </TouchableOpacity>

                    {/* ── Doctor Phone ── */}
                    <Caption1 weight='medium' style={styles.label}>Doctor Phone</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. 1234567890"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={doctorPhone}
                            onChangeText={setDoctorPhone}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                    </View>

                    {/* ── About ── */}
                    <Caption1 weight='medium' style={styles.label}>About</Caption1>
                    <View style={[styles.inputBox, { minHeight: hp(120) }]}>
                        <TextInput
                            placeholder="Write something about the doctor..."
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={about}
                            onChangeText={setAbout}
                            multiline
                            style={[styles.input, { lineHeight: 22 }]}
                        />
                    </View>

                    {/* ── Specialties ── */}
                    <Caption1 weight='medium' style={styles.label}>Specialties</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. General Consultation|Pediatric Consultation"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={specialties}
                            onChangeText={setSpecialties}
                            style={styles.input}
                        />
                    </View>

                    {/* ── Yezza Provider ID ── */}
                    <Caption1 weight='medium' style={styles.label}>Yezza Provider ID</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. 3849"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={yezzaProviderId}
                            onChangeText={setYezzaProviderId}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    {/* ── Yezza Service ID ── */}
                    <Caption1 weight='medium' style={styles.label}>Yezza Service ID</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. 93321"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={yezzaServiceId}
                            onChangeText={setYezzaServiceId}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>

                    <CustomButton
                        title="Save Doctor"
                        onPress={handleSave}
                        height={56}
                        width="100%"
                        borderRadius={16}
                        style={{ marginTop: hp(20) }}
                        isLoading={isLoading}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Day Picker Modal ── */}
            <DayPickerModal
                visible={showDayPicker}
                selectedDays={selectedDays}
                onClose={() => setShowDayPicker(false)}
                onConfirm={(days) => { setSelectedDays(days); setShowDayPicker(false) }}
            />

            {/* ── Start Time Picker ── */}
            <TimePickerModal
                visible={showStartPicker}
                title="Starting Time"
                initialTime={startTime}
                onClose={() => setShowStartPicker(false)}
                onConfirm={(t) => {
                    setStartTime(t)
                    setShowStartPicker(false)
                    setShowEndPicker(true)
                }}
            />

            {/* ── End Time Picker ── */}
            <TimePickerModal
                visible={showEndPicker}
                title="Ending Time"
                initialTime={endTime}
                onClose={() => setShowEndPicker(false)}
                onConfirm={(t) => { setEndTime(t); setShowEndPicker(false) }}
            />
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
    avatar: {
        width: 115,
        height: 115,
        borderRadius: 60,
        backgroundColor: '#E8F5F2',
        borderWidth: 3,
        borderColor: '#E8F5F2',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 115,
        height: 115,
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
        color: Colors.TEXT_COLOR,
        paddingVertical: hp(14),
        fontFamily: 'Poppins_400Regular',
    },
    navRow: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(18),
    },
    navText: { color: Colors.TEXT_COLOR, fontSize: 16 },
    placeholder: { color: Colors.PLACEHOLLDER_TEXT },
})