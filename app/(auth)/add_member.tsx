import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon'
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon'
import { AuthHeading } from '@/components/auth/AuthHeading'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const GENDER_OPTIONS = ['Male', 'Female']
const ALLERGY_OPTIONS = ['Food Allergies', 'Seasonal Allergies', 'Animal Allergies', 'Dust Allergies']

export default function AddFamilyMemberScreen() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [relation, setRelation] = useState('')
    const [ic, setIc] = useState('')
    const [dob, setDob] = useState('')
    const [phone, setPhone] = useState('')
    const [genderOpen, setGenderOpen] = useState(false)
    const [selectedGender, setSelectedGender] = useState('')
    const [allergyModalVisible, setAllergyModalVisible] = useState(false)
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])

    const toggleAllergy = (opt: string) => {
        setSelectedAllergies(prev =>
            prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]
        )
    }

    const allergyLabel =
        selectedAllergies.length === 0
            ? 'Allergies'
            : selectedAllergies.join(', ')

    const handleSave = () => {
        router.push("/(auth)/get_family_info")
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionTitle />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <AuthHeading
                        title="Add Member"
                        style={{ marginBottom: hp(30) }}
                        description="Family Information"
                    />

                    <Field placeholder="Member Name *" value={name} onChangeText={setName} />
                    <Field placeholder="Relation *" value={relation} onChangeText={setRelation} />
                    <Field placeholder="IC Number *" value={ic} onChangeText={setIc} keyboardType="numeric" />
                    <Field placeholder="Date Of Birth *" value={dob} onChangeText={setDob} />
                    <Field placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    {/* Gender Dropdown */}
                    <TouchableOpacity
                        style={styles.dropdownBox}
                        onPress={() => setGenderOpen(o => !o)}
                        activeOpacity={0.8}
                    >
                        <Caption1 style={selectedGender ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                            {selectedGender || 'Gender'}
                        </Caption1>
                        <Caption1 style={styles.chevron}>
                            {genderOpen ? <UpArrowIcon /> : <DownArrowIcon />}
                        </Caption1>
                    </TouchableOpacity>
                    {genderOpen && (
                        <View style={styles.dropdownList}>
                            {GENDER_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={styles.dropdownItem}
                                    onPress={() => { setSelectedGender(opt); setGenderOpen(false) }}
                                >
                                    <Caption1 style={styles.dropdownItemText}>{opt}</Caption1>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Allergies — Modal trigger */}
                    <TouchableOpacity
                        style={styles.dropdownBox}
                        onPress={() => setAllergyModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Caption1
                            style={selectedAllergies.length > 0 ? styles.dropdownSelected : styles.dropdownPlaceholder}
                            numberOfLines={1}
                        >
                            {allergyLabel}
                        </Caption1>
                        <Caption1 style={styles.chevron}>
                            {allergyModalVisible ? <UpArrowIcon /> : <DownArrowIcon />}
                        </Caption1>
                    </TouchableOpacity>

                    <View style={styles.bottomBar}>
                        <CustomButton
                            title='Save'
                            onPress={handleSave}
                            height={64}
                            width={"100%"}
                            borderRadius={16}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/*  Allergy Modal */}
            <Modal
                visible={allergyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAllergyModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setAllergyModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalCard}>
                                {/* Header */}
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Choose Allergies</Text>
                                    <TouchableOpacity onPress={() => setAllergyModalVisible(false)}>
                                        <UpArrowIcon />
                                    </TouchableOpacity>
                                </View>

                                {/* Options */}
                                {ALLERGY_OPTIONS.map(opt => {
                                    const checked = selectedAllergies.includes(opt)
                                    return (
                                        <TouchableOpacity
                                            key={opt}
                                            style={styles.allergyRow}
                                            onPress={() => toggleAllergy(opt)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.allergyLabel}>{opt}</Text>
                                            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                                                {checked && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}

function Field({ placeholder, value, onChangeText, keyboardType }: any) {
    return (
        <View style={styles.fieldBox}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#AAAAAA"
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
                keyboardType={keyboardType ?? 'default'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scrollContent: {
        paddingTop: hp(20),
        paddingBottom: hp(20),
    },
    fieldBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical:hp(5),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(12),
    },
    input: {
        fontSize: 15,
        color: '#333333',
        paddingVertical: hp(16),
        fontFamily: 'Poppins_400Regular',
    },
    dropdownBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(20),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginBottom: hp(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownPlaceholder: {
        color: '#AAAAAA',
        fontSize: 15,
        flex: 1,
    },
    dropdownSelected: {
        color: '#333333',
        fontSize: 15,
        flex: 1,
    },
    chevron: {
        color: '#AAAAAA',
        fontSize: 11,
    },
    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        marginTop: hp(-8),
        marginBottom: hp(12),
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_COLOR,
    },
    dropdownItemText: {
        color: '#333333',
        fontSize: 15,
    },
    bottomBar: {
        paddingTop: hp(12),
        paddingBottom: hp(20),
    },

    //  Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(24),
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        width: '100%',
        paddingHorizontal: wp(20),
        paddingVertical: hp(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(16),
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#222222',
    },
    allergyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        marginBottom: hp(10),
    },
    allergyLabel: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#333333',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.BRAND_PRIMARY,
        borderColor: Colors.BRAND_PRIMARY,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
})