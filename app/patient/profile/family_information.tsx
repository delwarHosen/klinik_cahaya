import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon'
import FamilyMemberCard from '@/components/family_info/FamilyMemberCard'
import FamilyMemberModal from '@/components/family_info/FamilyMemberModal'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetProfileQuery, useUpdateFamilyPatchMutation } from '@/redux/services/authApi'
import { EMPTY_MEMBER, FamilyMember, MAX_MEMBERS } from '@/types/familyTypes'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FamilyInformationScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, refetch } = useGetProfileQuery({})
  const [updateFamily, { isLoading }] = useUpdateFamilyPatchMutation()

  const [members, setMembers] = useState<FamilyMember[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [modalData, setModalData] = useState<FamilyMember>(EMPTY_MEMBER)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (data?.steps?.family?.data?.family_members) {
      setMembers(data.steps.family.data.family_members)
    }
  }, [data])

  const openEdit = (index: number) => {
    setEditingIndex(index)
    setModalData({ ...EMPTY_MEMBER, ...members[index] })
    setModalVisible(true)
  }

  const openAdd = () => {
    if (members.length >= MAX_MEMBERS) {

      showToast(t('max_members_error', { count: MAX_MEMBERS }), 'error')
      return
    }
    setEditingIndex(null)
    setModalData({ ...EMPTY_MEMBER })
    setModalVisible(true)
  }

  const handleModalSave = (data: FamilyMember) => {
    if (editingIndex !== null) {
      setMembers(prev => prev.map((m, i) => (i === editingIndex ? data : m)))
    } else {
      setMembers(prev => [...prev, data])
    }
    setModalVisible(false)
  }

  const handleSave = async () => {
    try {
      await updateFamily({ family_members: members }).unwrap()
      await refetch()
      showToast(t('family_update_success'), 'success')
      router.back()
    } catch (err: any) {
      showToast(err?.data?.message || t('family_update_failed'), 'error')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title={t('family_information')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {members.map((member, index) => (
          <FamilyMemberCard
            key={index}
            member={member}
            onEdit={() => openEdit(index)}
          />
        ))}

        <View style={styles.addBtnRow}>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={openAdd}>
            <PlusButtonIcon />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ alignItems: 'center', marginTop: hp(20) }}>
            <CustomLoader size={50} strokeWidth={3} />
          </View>
        ) : (
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
            <H6 color="#FFFFFF">{t('save')}</H6>
          </TouchableOpacity>
        )}
      </ScrollView>

      <FamilyMemberModal
        visible={modalVisible}
        editingIndex={editingIndex}
        initialData={modalData}
        onClose={() => setModalVisible(false)}
        onSave={handleModalSave}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20)
  },
  scrollContent: {
    paddingBottom: hp(40),
    paddingTop: hp(10)
  },
  addBtnRow: {
    alignItems: 'flex-end',
    marginTop: hp(8)
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.BRAND_PRIMARY,
  },
  saveBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
  },
})