// app/admin/profile/add_doctor.tsx
import { PhotoIcon } from '@/assets/icons/common_icon/PhotoIcon'
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

export default function AddDoctorProfileScreen() {
    const router = useRouter()
    const [addDoctor, { isLoading }] = useAddDoctorMutation()

    const [photo, setPhoto] = useState<string | null>(null)
    const [photoAsset, setPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [designation, setDesignation] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [tier, setTier] = useState('')
    const [consultationDays, setConsultationDays] = useState('')
    const [consultationTime, setConsultationTime] = useState('')
    const [doctorPhone, setDoctorPhone] = useState('')
    const [about, setAbout] = useState('')
    const [specialties, setSpecialties] = useState('')
    const [yezzaProviderId, setYezzaProviderId] = useState('')
    const [yezzaServiceId, setYezzaServiceId] = useState('')

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') return

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            setPhoto(result.assets[0].uri)
            setPhotoAsset(result.assets[0])
        }
    }

    const handleSave = async () => {
        try {
            const formData = new FormData()

            formData.append('id', id)
            formData.append('name', name)
            formData.append('full_name', fullName)
            formData.append('designation', designation)
            formData.append('specialization', specialization)
            formData.append('tier', tier)
            formData.append('active', 'true')
            formData.append('consultation_days', consultationDays)
            formData.append('consultation_time', consultationTime)
            formData.append('doctor_phone', doctorPhone)
            formData.append('about', about)
            formData.append('specialties', specialties)
            formData.append('yezza_provider_id', yezzaProviderId)
            formData.append('yezza_service_id', yezzaServiceId)

            if (photoAsset) {
                formData.append('avatar_file', {
                    uri: photoAsset.uri,
                    name: photoAsset.fileName ?? 'avatar.jpg',
                    type: photoAsset.mimeType ?? 'image/jpeg',
                } as any)
            }

            await addDoctor(formData).unwrap()
            showToast('Doctor added successfully!', 'success')
            router.back()
        } catch (err: any) {
            const message =
                err?.data?.detail?.msg ||
                err?.data?.message ||
                err?.data ||
                'Failed to add doctor.'
            showToast(typeof message === 'string' ? message : 'Server error occurred.', 'error')
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
                    {/* Avatar */}
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

                    {/* Doctor ID */}
                    <Caption1 weight='medium' style={styles.label}>Doctor ID</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. dr_john"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={id}
                            onChangeText={setId}
                            style={styles.input}
                        />
                    </View>

                    {/* Name */}
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

                    {/* Full Name */}
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

                    {/* Designation */}
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

                    {/* Specialization */}
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

                    {/* Tier */}
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

                    {/* Consultation Days */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Days</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. Monday,Wednesday,Friday"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={consultationDays}
                            onChangeText={setConsultationDays}
                            style={styles.input}
                        />
                    </View>

                    {/* Consultation Time */}
                    <Caption1 weight='medium' style={styles.label}>Consultation Time</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="e.g. 9:00 AM - 5:00 PM"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={consultationTime}
                            onChangeText={setConsultationTime}
                            style={styles.input}
                        />
                    </View>

                    {/* Doctor Phone */}
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

                    {/* About */}
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

                    {/* Specialties */}
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

                    {/* Yezza Provider ID */}
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

                    {/* Yezza Service ID */}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(18),
    },
    navText: { flex: 1, color: Colors.PLACEHOLLDER_TEXT },
})