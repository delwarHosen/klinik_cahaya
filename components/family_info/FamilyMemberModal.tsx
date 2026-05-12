import { Body3, Caption1, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { FamilyMember, GENDER_OPTIONS } from '@/types/familyTypes'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CalendarPicker from './CalendarPicker'


interface FamilyMemberModalProps {
  visible: boolean
  editingIndex: number | null
  initialData: FamilyMember
  onClose: () => void
  onSave: (data: FamilyMember) => void
}

export default function FamilyMemberModal({
  visible,
  editingIndex,
  initialData,
  onClose,
  onSave,
}: FamilyMemberModalProps) {
  const insets = useSafeAreaInsets()
  const [editData, setEditData] = useState<FamilyMember>(initialData)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)

  // Sync editData when initialData changes (e.g. when opening for a different member)
  React.useEffect(() => {
    setEditData(initialData)
    setShowCalendar(false)
    setShowGenderPicker(false)
  }, [initialData, visible])

  const handleSave = () => {
    onSave(editData)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <View style={[styles.card, { paddingBottom: insets.bottom + hp(20) }]}>
          <View style={styles.dragHandle} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <H6 style={{ marginBottom: hp(16) }}>
              {editingIndex !== null ? 'Edit Member' : 'Add Member'}
            </H6>

            {/* Name */}
            <Caption2 style={styles.label}>Name</Caption2>
            <View style={styles.fieldBox}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#AAAAAA"
                value={editData.member_name}
                onChangeText={val => setEditData(prev => ({ ...prev, member_name: val }))}
                style={styles.input}
              />
            </View>

            {/* IC Number */}
            <Caption2 style={styles.label}>IC Number</Caption2>
            <View style={styles.fieldBox}>
              <TextInput
                placeholder="IC Number"
                placeholderTextColor="#AAAAAA"
                value={editData.ic_number}
                onChangeText={val => setEditData(prev => ({ ...prev, ic_number: val }))}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>

            {/* Date of Birth */}
            <Caption2 style={styles.label}>Date of Birth</Caption2>
            <TouchableOpacity
              style={styles.fieldBox}
              onPress={() => { setShowCalendar(v => !v); setShowGenderPicker(false) }}
              activeOpacity={0.75}
            >
              <View style={styles.fieldRowInner}>
                <Body3
                  color={editData.date_of_birth ? '#000000' : '#AAAAAA'}
                  style={styles.inputText}
                >
                  {editData.date_of_birth || 'Select date'}
                </Body3>
                <Caption2 color="#AAAAAA">{showCalendar ? '▲' : '▼'}</Caption2>
              </View>
            </TouchableOpacity>
            {showCalendar && (
              <CalendarPicker
                value={editData.date_of_birth}
                onChange={date => {
                  setEditData(prev => ({ ...prev, date_of_birth: date }))
                  setShowCalendar(false)
                }}
              />
            )}

            {/* Relationship */}
            <Caption2 style={styles.label}>Relationship</Caption2>
            <View style={styles.fieldBox}>
              <TextInput
                placeholder="e.g. Brother"
                placeholderTextColor="#AAAAAA"
                value={editData.relationship}
                onChangeText={val => setEditData(prev => ({ ...prev, relationship: val }))}
                style={styles.input}
              />
            </View>

            {/* Gender */}
            <Caption2 style={styles.label}>Gender</Caption2>
            <TouchableOpacity
              style={styles.fieldBox}
              onPress={() => { setShowGenderPicker(v => !v); setShowCalendar(false) }}
              activeOpacity={0.75}
            >
              <View style={styles.fieldRowInner}>
                <Body3
                  color={editData.gender ? '#000000' : '#AAAAAA'}
                  style={styles.inputText}
                >
                  {editData.gender
                    ? editData.gender.charAt(0).toUpperCase() + editData.gender.slice(1)
                    : 'Select gender'}
                </Body3>
                <Caption2 color="#AAAAAA">{showGenderPicker ? '▲' : '▼'}</Caption2>
              </View>
            </TouchableOpacity>
            {showGenderPicker && (
              <View style={styles.genderOptions}>
                {GENDER_OPTIONS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderOption,
                      editData.gender === g && styles.genderOptionSelected,
                    ]}
                    onPress={() => {
                      setEditData(prev => ({ ...prev, gender: g }))
                      setShowGenderPicker(false)
                    }}
                    activeOpacity={0.75}
                  >
                    <Caption1 color={editData.gender === g ? '#FFFFFF' : '#1A1A1A'}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Caption1>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#EEEEEE' }]}
                onPress={onClose}
              >
                <H6 color="#555555">Cancel</H6>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: Colors.BRAND_PRIMARY }]}
                onPress={handleSave}
              >
                <H6 color="#FFFFFF">Done</H6>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000066',
  },
  kav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  card: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(12),
    maxHeight: '90%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
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
  fieldRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(16),
  },
  input: {
    fontSize: 15,
    color: '#000000',
    paddingVertical: hp(16),
    fontFamily: 'Poppins_400Regular',
  },
  inputText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: wp(8),
    marginTop: hp(6),
    marginBottom: hp(4),
  },
  genderOption: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  genderOptionSelected: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderColor: Colors.BRAND_PRIMARY,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: hp(20),
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
})