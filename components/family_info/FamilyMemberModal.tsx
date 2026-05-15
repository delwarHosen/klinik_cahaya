import { Body3, Caption1, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { FamilyMember, GENDER_OPTIONS } from '@/types/familyTypes'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(); 
  const insets = useSafeAreaInsets()
  const [editData, setEditData] = useState<FamilyMember>(initialData)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [icError, setIcError] = useState('')

  useEffect(() => {
    if (visible) {
      setEditData(initialData)
      setShowCalendar(false)
      setShowGenderPicker(false)
      setIcError('')
    }
  }, [initialData, visible])

  const isChild = !!editData.date_of_birth && calculateAge(editData.date_of_birth) < 18

  const handleIcChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12)
    setEditData(prev => ({ ...prev, ic_number: digits }))
    if (digits.length > 0 && digits.length < 12) {
      setIcError(t('ic_error')) // লোকালাইজড এরর
    } else {
      setIcError('')
    }
  }

  const handleSave = () => {
    if (editData.ic_number && editData.ic_number.length !== 12) {
      setIcError(t('ic_error'))
      return
    }
    onSave(editData)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, hp(20)) }]}>
          <View style={styles.dragHandle} />

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(20) }}>
            
            <H6 style={styles.modalTitle}>
              {editingIndex !== null ? t('edit_family_member') : t('add_family_member')}
            </H6>

            {/* Name */}
            <Caption2 style={styles.label}>{t('name_label')}</Caption2>
            <View style={styles.fieldBox}>
              <TextInput
                placeholder={t('full_name_placeholder')}
                placeholderTextColor="#AAAAAA"
                value={editData.member_name}
                onChangeText={val => setEditData(prev => ({ ...prev, member_name: val }))}
                style={styles.input}
              />
            </View>

            {/* IC Number */}
            <Caption2 style={styles.label}>{t('ic_number_label')}</Caption2>
            <View style={[styles.fieldBox, icError ? styles.fieldBoxError : null]}>
              <TextInput
                placeholder={t('ic_placeholder')}
                placeholderTextColor="#AAAAAA"
                value={editData.ic_number}
                onChangeText={handleIcChange}
                style={styles.input}
                keyboardType="numeric"
                maxLength={12}
              />
            </View>
            {icError ? <Text style={styles.errorText}>{icError}</Text> : null}

            {/* DOB */}
            <Caption2 style={styles.label}>{t('dob_label')}</Caption2>
            <TouchableOpacity style={styles.fieldBox} onPress={() => { setShowCalendar(v => !v); setShowGenderPicker(false) }} activeOpacity={0.75}>
              <View style={styles.fieldRowInner}>
                <Body3 color={editData.date_of_birth ? '#000000' : '#AAAAAA'} style={styles.inputText}>
                  {editData.date_of_birth || t('select_date')}
                </Body3>
                <View style={styles.dobRight}>
                  {isChild && (
                    <View style={styles.childBadge}>
                      <Text style={styles.childBadgeText}>{t('child_badge')}</Text>
                    </View>
                  )}
                  <Caption2 color="#AAAAAA">{showCalendar ? '▲' : '▼'}</Caption2>
                </View>
              </View>
            </TouchableOpacity>

            {showCalendar && (
              <View style={styles.calendarContainer}>
                <CalendarPicker
                  value={editData.date_of_birth}
                  onChange={date => {
                    setEditData(prev => ({ ...prev, date_of_birth: date }))
                    setShowCalendar(false)
                  }}
                />
              </View>
            )}

            {/* Relationship */}
            <Caption2 style={styles.label}>{t('relationship_label')}</Caption2>
            <View style={styles.fieldBox}>
              <TextInput
                placeholder={t('relationship_placeholder')}
                placeholderTextColor="#AAAAAA"
                value={editData.relationship}
                onChangeText={val => setEditData(prev => ({ ...prev, relationship: val }))}
                style={styles.input}
              />
            </View>

            {/* Gender */}
            <Caption2 style={styles.label}>{t('gender_label')}</Caption2>
            <TouchableOpacity style={styles.fieldBox} onPress={() => { setShowGenderPicker(v => !v); setShowCalendar(false) }} activeOpacity={0.75}>
              <View style={styles.fieldRowInner}>
                <Body3 color={editData.gender ? '#000000' : '#AAAAAA'} style={styles.inputText}>
                  {editData.gender ? t(editData.gender.toLowerCase()) : t('select_gender')}
                </Body3>
                <Caption2 color="#AAAAAA">{showGenderPicker ? '▲' : '▼'}</Caption2>
              </View>
            </TouchableOpacity>
            
            {showGenderPicker && (
              <View style={styles.genderOptions}>
                {GENDER_OPTIONS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderOption, editData.gender === g && styles.genderOptionSelected]}
                    onPress={() => {
                      setEditData(prev => ({ ...prev, gender: g }))
                      setShowGenderPicker(false)
                    }}
                  >
                    <Caption1 color={editData.gender === g ? '#FFFFFF' : '#1A1A1A'}>
                      {t(g.toLowerCase())}
                    </Caption1>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
                <H6 color="#555555">{t('cancel')}</H6>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnDone]} onPress={handleSave}>
                <H6 color="#FFFFFF">{t('done')}</H6>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  kav: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  card: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: wp(20),
    paddingTop: hp(12),
    maxHeight: '85%',
  },

  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: hp(16),
  },

  modalTitle: {
    marginBottom: hp(12),
    textAlign: 'center',
  },

  label: {
    color: Colors.TEXT_COLOR,
    marginBottom: hp(6),
    marginTop: hp(14),
    marginLeft: wp(4),
  },

  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: wp(16),
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
    height: hp(56),
  },

  input: {
    height: hp(56),
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Poppins_400Regular',
  },

  inputText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },

  errorText: {
    marginTop: hp(4),
    marginLeft: wp(4),
    fontSize: 12,
    color: '#F04438',
    fontFamily: 'Poppins_400Regular',
  },

  dobRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },

  childBadge: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 6,
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
  },

  childBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
  },

  calendarContainer: {
    marginTop: hp(8),
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },

  genderOptions: {
    flexDirection: 'row',
    gap: wp(10),
    marginTop: hp(10),
  },

  genderOption: {
    flex: 1,
    height: hp(48),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },

  genderOptionSelected: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderColor: Colors.BRAND_PRIMARY,
  },

  btnRow: {
    flexDirection: 'row',
    gap: wp(12),
    marginTop: hp(24),
  },

  btn: {
    flex: 1,
    height: hp(54),
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnCancel: {
    backgroundColor: '#F2F2F2',
  },

  btnDone: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
})