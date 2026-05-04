import { PhotoIcon } from '@/assets/icons/common_icon/PhotoIcon'
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AddDoctorProfileScreen() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [designation, setDesignation] = useState('')
    const [about, setAbout] = useState('')
    const consultationTime = 'Select Consultation Time'
    const services = 'Select Services'

    const handleSave = () => {
        // TODO: Add your save/creation logic here
        router.back()
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
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatar}>
                                <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                                   <PhotoIcon/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Name */}
                    <Caption1 weight='medium' style={styles.label}>Name</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="Enter doctor's name"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>

                    {/* Designation */}
                    <Caption1 weight='medium' style={styles.label}>Designation</Caption1>
                    <View style={styles.inputBox}>
                        <TextInput
                            placeholder="Enter designation / specialty"
                            placeholderTextColor={Colors.PLACEHOLLDER_TEXT}
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
                        <H6 weight='medium' style={[styles.navText, !consultationTime && { color: Colors.PLACEHOLLDER_TEXT }]} numberOfLines={1}>
                            {consultationTime}
                        </H6>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

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

                    {/* Services */}
                    <Caption1 weight='medium' style={styles.label}>Services</Caption1>
                    <TouchableOpacity
                        style={styles.navRow}
                        activeOpacity={0.8}
                        onPress={() => router.push('/admin/profile/services' as any)}
                    >
                        <Caption1 weight='medium' style={[styles.navText, { fontSize: 16 }]} numberOfLines={1}>
                            {services}
                        </Caption1>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    {/* Status */}
                    <Caption1 weight='medium' style={styles.label}>Activity Status</Caption1>
                    <TouchableOpacity
                        style={styles.navRow}
                        activeOpacity={0.8}
                        onPress={() => router.push('/admin/profile/services' as any)}
                    >
                        <Caption1 weight='medium' style={[styles.navText, { fontSize: 16 }]} numberOfLines={1}>
                            Set Status
                        </Caption1>
                        <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
                    </TouchableOpacity>

                    <CustomButton
                        title="Save Doctor"
                        onPress={handleSave}
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
    avatarWrapper: {
        //  position: 'relative' 
        },
    avatar: {
        width: 115, height: 115, borderRadius: 60,
        backgroundColor: '#E8F5F2',
        borderWidth: 3, borderColor: '#E8F5F2',
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
    cameraBtn: {
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
        color: Colors.TEXT_COLOR,
        paddingVertical: hp(14),
        fontFamily: 'Poppins_400Regular',
    },

    navRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: wp(16), paddingVertical: hp(18),
    },
    navText: { flex: 1, color: Colors.PLACEHOLLDER_TEXT },
})