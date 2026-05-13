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
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CalendarPicker from './CalendarPicker'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calculateAge = (dobString: string): number => {
  const dob = new Date(dobString)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FamilyMemberModalProps {
  visible: boolean
  editingIndex: number | null
  initialData: FamilyMember
  onClose: () => void
  onSave: (data: FamilyMember) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
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
  const [icError, setIcError] = useState('')

  // Sync editData when initialData changes
  React.useEffect(() => {
    setEditData(initialData)
    setShowCalendar(false)
    setShowGenderPicker(false)
    setIcError('')
  }, [initialData, visible])

  // Derived: is this member a child?
  const isChild =
    !!editData.date_of_birth && calculateAge(editData.date_of_birth) < 18

  // IC Number handler — only allow digits, max 12
  const handleIcChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12)
    setEditData(prev => ({ ...prev, ic_number: digits }))
    if (digits.length > 0 && digits.length < 12) {
      setIcError('IC Number must be exactly 12 digits')
    } else {
      setIcError('')
    }
  }

  const handleSave = () => {
    if (editData.ic_number && editData.ic_number.length !== 12) {
      setIcError('IC Number must be exactly 12 digits')
      return
    }
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
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        {/*
          SafeAreaView fix:
          - Use paddingBottom = insets.bottom so content clears the home indicator
          - Use paddingTop: hp(12) for the drag handle area
          statusBarTranslucent + transparent modal = the insets are still valid
        */}
        <View
          style={[
            styles.card,
            {
              paddingBottom: Math.max(insets.bottom, hp(20)),
            },
          ]}
        >
          <View style={styles.dragHandle} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <H6 style={{ marginBottom: hp(16) }}>
              {editingIndex !== null ? 'Edit Member' : 'Add Member'}
            </H6>

            {/* ── Name ── */}
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

            {/* ── IC Number (max 12 digits) ── */}
            <Caption2 style={styles.label}>IC Number</Caption2>
            <View style={[styles.fieldBox, icError ? styles.fieldBoxError : null]}>
              <TextInput
                placeholder="IC Number (12 digits)"
                placeholderTextColor="#AAAAAA"
                value={editData.ic_number}
                onChangeText={handleIcChange}
                style={styles.input}
                keyboardType="numeric"
                maxLength={12}
              />
            </View>
            {icError ? <Text style={styles.errorText}>{icError}</Text> : null}

            {/* ── Date of Birth ── */}
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

                <View style={styles.dobRight}>
                  {/* Children badge */}
                  {isChild && (
                    <View style={styles.childBadge}>
                      <Text style={styles.childBadgeText}>Children</Text>
                    </View>
                  )}
                  <Caption2 color="#AAAAAA">{showCalendar ? '▲' : '▼'}</Caption2>
                </View>
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

            {/* ── Relationship ── */}
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

            {/* ── Gender ── */}
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

            {/* ── Buttons ── */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────
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
    marginBottom: hp(8),
  },
  label: { color: Colors.TEXT_COLOR, marginBottom: hp(6), marginTop: hp(10) },

  // Field box
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  fieldBoxError: {
    borderColor: '#F04438',
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
    flex: 1,
  },

  // IC error
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: '#F04438',
    fontFamily: 'Poppins_400Regular',
  },

  // DOB right side (badge + arrow)
  dobRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },

  // Children badge
  childBadge: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 20,
    paddingHorizontal: wp(8),
    paddingVertical: 2,
  },
  childBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    fontFamily: 'Poppins_600SemiBold',
  },

  // Gender
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

  // Buttons
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