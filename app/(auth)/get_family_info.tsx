import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon'
import { AuthHeading } from '@/components/auth/AuthHeading'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Body3, Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useUpdateFamilyMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'; // ১. ইম্পোর্ট
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Allergy {
    name: string
    type: string | null
    severity: string | null
}

interface FamilyMember {
    member_name: string
    ic_number: string
    date_of_birth: string
    relationship: string
    gender: string
    allergies: Allergy[]
}

export default function GetFamilyInfo() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const { t } = useTranslation() // ২. হুক কল
    const [updateFamily, { isLoading }] = useUpdateFamilyMutation()

    const [members, setMembers] = useState<FamilyMember[]>([])

    useFocusEffect(
        useCallback(() => {
            try {
                const parsed = params.members ? JSON.parse(params.members as string) : []
                setMembers(parsed)
            } catch {
                setMembers([])
            }
        }, [params.members])
    )

    const handleSave = async () => {
        try {
            await updateFamily({ family_members: members }).unwrap()
            showToast(t('save_success'), 'success')
            router.replace('/(auth)/upload_photo')
        } catch (err: any) {
            console.log('Save error:', JSON.stringify(err))
            showToast(err?.data?.detail?.msg || err?.data?.message || t('save_failed'), 'error')
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionTitle />
            <AuthHeading
                title={t('setup_profile')}
                style={{ marginBottom: hp(30) }}
                description={t('get_family_info')}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {members.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Caption1 color="#AAAAAA">{t('no_family_added')}</Caption1>
                    </View>
                ) : (
                    members.map((member, index) => (
                        <View key={index} style={styles.memberCard}>
                            <View style={styles.memberInfo}>
                                <Body3 color="#1A1A1A" weight="semiBold" style={{ marginBottom: 5 }}>
                                    {member.member_name}
                                </Body3>
                                <Caption1 color="#00000080">{member.ic_number}</Caption1>
                                <Caption1 color="#00000080">{member.date_of_birth}</Caption1>
                                <Caption1 color="#00000080">{member.relationship}</Caption1>
                                {member.gender ? <Caption1 color="#00000080">{t(member.gender.toLowerCase())}</Caption1> : null}
                                {member.allergies?.length > 0 && (
                                    <Caption1 color="#00000080">
                                        {/* আলার্জিগুলোর নাম অনুবাদ করার চেষ্টা */}
                                        {member.allergies.map((a) => {
                                            const translationKey = a.name.toLowerCase().replace(/\s+/g, '_');
                                            return t(translationKey, { defaultValue: a.name });
                                        }).join(', ')}
                                    </Caption1>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: '/(auth)/edit_family_info',
                                        params: {
                                            index: index.toString(),
                                            member_name: member.member_name,
                                            ic_number: member.ic_number,
                                            date_of_birth: member.date_of_birth,
                                            relationship: member.relationship,
                                            gender: member.gender ?? '',
                                            allergies: JSON.stringify(member.allergies ?? []),
                                            all_members: JSON.stringify(members),
                                        },
                                    })
                                }
                            >
                                <EditIcon size={18} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {members.length < 9 && (
                    <View style={styles.addBtnRow}>
                        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={() => router.back()}>
                            <PlusButtonIcon />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ marginTop: hp(20) }}>
                    <CustomButton
                        title={t('save')}
                        onPress={handleSave}
                        isLoading={isLoading}
                        height={64}
                        width="100%"
                        borderRadius={16}
                    />
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
        paddingTop: hp(10),
        paddingBottom: hp(40),
    },
    memberCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderRadius: 16,
        padding: wp(16),
        marginBottom: hp(12),
        borderWidth: 1,
        borderColor: Colors.CARD_BORDER,
        backgroundColor: '#FFFFFF',
    },
    memberInfo: {
        flex: 1,
        gap: 2,
    },
    addBtnRow: {
        alignItems: 'flex-end',
        marginTop: hp(8),
    },
    addBtn: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.BORDER_COLOR,
    },
    emptyBox: {
        alignItems: 'center',
        paddingVertical: hp(40),
    },
});