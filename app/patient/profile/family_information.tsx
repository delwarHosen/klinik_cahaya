import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Body3, Caption1, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetProfileQuery, useUpdateFamilyMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface FamilyMember {
  member_name: string
  ic_number: string
  date_of_birth: string
  relationship: string
  gender: string
  allergies: { name: string; type: string | null; severity: string | null }[]
}

const EMPTY_MEMBER: FamilyMember = {
  member_name: '',
  ic_number: '',
  date_of_birth: '',
  relationship: '',
  gender: '',
  allergies: [],
}

export default function FamilyInformationScreen() {
  const router = useRouter()
  const { data } = useGetProfileQuery({})
  const [updateFamily, { isLoading }] = useUpdateFamilyMutation()

  const [members, setMembers] = useState<FamilyMember[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editData, setEditData] = useState<FamilyMember>(EMPTY_MEMBER)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (data?.steps?.family?.data?.family_members) {
      setMembers(data.steps.family.data.family_members)
    }
  }, [data])

  const openEdit = (index: number) => {
    setEditingIndex(index)
    setEditData({ ...members[index] })
    setModalVisible(true)
  }

  const openAdd = () => {
    setEditingIndex(null)
    setEditData({ ...EMPTY_MEMBER })
    setModalVisible(true)
  }

  const handleSaveModal = () => {
    let updated: FamilyMember[]
    if (editingIndex !== null) {
      updated = members.map((m, i) => (i === editingIndex ? editData : m))
    } else {
      updated = [...members, editData]
    }
    setMembers(updated)
    setModalVisible(false)
  }

  const handleSave = async () => {
    try {
      await updateFamily({ family_members: members }).unwrap()
      showToast('Family information updated', 'success')
      router.back()
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to update family info', 'error')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Family Information" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {members.map((member, index) => (
          <View key={index} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Body3 color="#1A1A1A" weight="semiBold" style={{ marginBottom: 5 }}>
                {member.member_name || '-'}
              </Body3>
              <Caption1 color="#00000080">IC: {member.ic_number || '-'}</Caption1>
              <Caption1 color="#00000080">DOB: {member.date_of_birth || '-'}</Caption1>
              <Caption1 color="#00000080">Relationship: {member.relationship || '-'}</Caption1>
              {member.gender ? <Caption1 color="#00000080">Gender: {member.gender}</Caption1> : null}
            </View>
            <TouchableOpacity onPress={() => openEdit(index)}>
              <EditIcon size={18} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addBtnRow}>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={openAdd}>
            <H6 color={Colors.BRAND_PRIMARY} style={{ fontSize: 22 }}>+</H6>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ alignItems: 'center', marginTop: hp(20) }}>
            <CustomLoader size={50} strokeWidth={3} />
          </View>
        ) : (
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
            <H6 color="#FFFFFF">Save</H6>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Edit / Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalCard}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <H6 style={{ marginBottom: hp(16) }}>
                {editingIndex !== null ? 'Edit Member' : 'Add Member'}
              </H6>

              {([
                { label: 'Name', key: 'member_name', placeholder: 'Full Name' },
                { label: 'IC Number', key: 'ic_number', placeholder: 'IC Number' },
                { label: 'Date of Birth', key: 'date_of_birth', placeholder: 'YYYY-MM-DD' },
                { label: 'Relationship', key: 'relationship', placeholder: 'e.g. Brother' },
                { label: 'Gender', key: 'gender', placeholder: 'male / female' },
              ] as { label: string; key: keyof FamilyMember; placeholder: string }[]).map(field => (
                <View key={field.key}>
                  <Caption2 style={styles.label}>{field.label}</Caption2>
                  <View style={styles.fieldBox}>
                    <TextInput
                      placeholder={field.placeholder}
                      placeholderTextColor="#AAAAAA"
                      value={editData[field.key] as string}
                      onChangeText={val => setEditData(prev => ({ ...prev, [field.key]: val }))}
                      style={styles.input}
                    />
                  </View>
                </View>
              ))}

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#EEEEEE' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <H6 color="#555555">Cancel</H6>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: Colors.BRAND_PRIMARY }]}
                  onPress={handleSaveModal}
                >
                  <H6 color="#FFFFFF">Done</H6>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
  scrollContent: { paddingBottom: hp(40), paddingTop: hp(10) },
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
  memberInfo: { gap: 2, flex: 1 },
  addBtnRow: { alignItems: 'flex-end', marginTop: hp(8) },
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
  label: { color: Colors.TEXT_COLOR, marginBottom: hp(6), marginTop: hp(10) },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  input: {
    fontSize: 15,
    color: '#000000',
    paddingVertical: hp(16),
    fontFamily: 'Poppins_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wp(20),
    paddingBottom: hp(40),
    maxHeight: '85%',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: hp(20),
  },
  modalBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
})