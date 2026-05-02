import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body3, Caption1, H6 } from '@/components/typo/Typography'
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface FamilyMember {
  id: string
  name: string
  ic: string
  dob: string
  relationship: string
}

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Razak bin Osman', ic: '900101-14-5677', dob: '10 January 1997', relationship: 'Brother' },
  { id: '2', name: 'Aisyah binti Musa', ic: '900101-14-5645', dob: '10 January 1994', relationship: 'Sister' },
]

interface MemberFormProps {
  visible: boolean
  title: string
  btnLabel: string
  initialData?: FamilyMember | null
  onClose: () => void
  onSave: (data: Omit<FamilyMember, 'id'>) => void
}

function MemberFormModal({ visible, title, btnLabel, initialData, onClose, onSave }: MemberFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [ic, setIc] = useState(initialData?.ic ?? '')
  const [dob, setDob] = useState(initialData?.dob ?? '')
  const [relationship, setRelationship] = useState(initialData?.relationship ?? '')

  React.useEffect(() => {
    if (visible) {
      setName(initialData?.name ?? '')
      setIc(initialData?.ic ?? '')
      setDob(initialData?.dob ?? '')
      setRelationship(initialData?.relationship ?? '')
    }
  }, [visible, initialData])

  const handleSave = () => {
    onSave({ name, ic, dob, relationship })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.sheet}>
            <H6 color="#1A1A1A" style={modalStyles.title}>{title}</H6>
            <Caption1 color="#888888" style={modalStyles.subtitle}>Family Information</Caption1>

            <View style={modalStyles.fieldBox}>
              <TextInput
                placeholder="Member Name"
                placeholderTextColor="#AAAAAA"
                value={name}
                onChangeText={setName}
                style={modalStyles.input}
              />
            </View>
            <View style={modalStyles.fieldBox}>
              <TextInput
                placeholder="IC Number"
                placeholderTextColor="#AAAAAA"
                value={ic}
                onChangeText={setIc}
                style={modalStyles.input}
              />
            </View>
            <View style={modalStyles.fieldBox}>
              <TextInput
                placeholder="Date Of Birth"
                placeholderTextColor="#AAAAAA"
                value={dob}
                onChangeText={setDob}
                style={modalStyles.input}
              />
            </View>
            <View style={modalStyles.fieldBox}>
              <TextInput
                placeholder="Relationship"
                placeholderTextColor="#AAAAAA"
                value={relationship}
                onChangeText={setRelationship}
                style={modalStyles.input}
              />
            </View>

            <CustomButton
              title='Save'
              onPress={handleSave}
              height={64}
              width={"100%"}
              borderRadius={16}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default function FamilyInformationScreen() {
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const router = useRouter();

  const handleAdd = (data: Omit<FamilyMember, 'id'>) => {
    setMembers(prev => [...prev, { ...data, id: Date.now().toString() }])
    setShowAddModal(false)
  }

  const handleUpdate = (data: Omit<FamilyMember, 'id'>) => {
    if (!editingMember) return
    setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...data, id: m.id } : m))
    setEditingMember(null)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Family Information" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {members.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Body3 color="#1A1A1A" weight="semiBold" style={{ marginBottom: 5 }}>{member.name}</Body3>
              <Caption1 color="#00000080">{member.ic}</Caption1>
              <Caption1 color="#00000080">{member.dob}</Caption1>
              <Caption1 color="#00000080">{member.relationship}</Caption1>
            </View>
            <TouchableOpacity onPress={() => router.push("/patient/profile/edit_family_info")}>
              <EditIcon size={18} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Button */}
        <View style={styles.addBtnRow}>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setShowAddModal(true)}
          >
            <H6 color={Colors.BRAND_PRIMARY} style={{ fontSize: 22 }}>+</H6>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Modal */}
      <MemberFormModal
        visible={showAddModal}
        title="Add Family Member"
        btnLabel="Save"
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
      />

      {/* Edit Modal */}
      <MemberFormModal
        visible={!!editingMember}
        title="Edit Family Information"
        btnLabel="Update"
        initialData={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleUpdate}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
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
  },
  memberInfo: { gap: 2 },

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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
})

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(28),
    paddingBottom: hp(60),
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: hp(4) },
  subtitle: { marginBottom: hp(20) },
  fieldBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginBottom: hp(12),
  },
  input: {
    fontSize: 15,
    color: '#333333',
    paddingVertical: hp(14),
    fontFamily: 'Poppins_400Regular',
  },
  saveBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: hp(18),
    alignItems: 'center',
    marginTop: hp(8),
  },
})