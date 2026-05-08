import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon'
import CustomLoader from '@/components/shared/CustomLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Body3, Caption1, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetProfileQuery, useUpdateFamilyPatchMutation } from '@/redux/services/authApi'
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

const MAX_MEMBERS = 9
const GENDER_OPTIONS = ['male', 'female', 'other']

// ─── Inline Calendar ─────────────────────────────────────────────────────────
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

interface CalendarPickerProps {
  value: string
  onChange: (date: string) => void
}

function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const today = new Date()
  const parsed = value ? new Date(value) : null

  const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth())
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  const selectedDay = parsed ? parsed.getDate() : null
  const selectedMonth = parsed ? parsed.getMonth() : null
  const selectedYear = parsed ? parsed.getFullYear() : null

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const years: number[] = []
  for (let y = 1930; y <= today.getFullYear(); y++) years.push(y)

  const handleDayPress = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${viewYear}-${mm}-${dd}`)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isSelected = (day: number) =>
    day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear

  return (
    <View style={calStyles.wrapper}>
      {/* Header */}
      <View style={calStyles.header}>
        <TouchableOpacity onPress={prevMonth} style={calStyles.navBtn}>
          <H6 color={Colors.BRAND_PRIMARY}>{'‹'}</H6>
        </TouchableOpacity>

        <View style={calStyles.headerCenter}>
          <TouchableOpacity
            onPress={() => { setShowMonthPicker(v => !v); setShowYearPicker(false) }}
            style={calStyles.headerLabel}
          >
            <Caption1 color="#1A1A1A" style={{ fontWeight: '600' }}>{MONTHS[viewMonth]}</Caption1>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setShowYearPicker(v => !v); setShowMonthPicker(false) }}
            style={calStyles.headerLabel}
          >
            <Caption1 color="#1A1A1A" style={{ fontWeight: '600' }}>{viewYear}</Caption1>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={nextMonth} style={calStyles.navBtn}>
          <H6 color={Colors.BRAND_PRIMARY}>{'›'}</H6>
        </TouchableOpacity>
      </View>

      {/* Month Dropdown */}
      {showMonthPicker && (
        <View style={calStyles.dropdown}>
          <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
            {MONTHS.map((m, i) => (
              <TouchableOpacity
                key={m}
                style={[calStyles.dropdownItem, viewMonth === i && calStyles.dropdownItemSelected]}
                onPress={() => { setViewMonth(i); setShowMonthPicker(false) }}
              >
                <Caption2 color={viewMonth === i ? '#FFFFFF' : '#1A1A1A'}>{m}</Caption2>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Year Dropdown */}
      {showYearPicker && (
        <View style={calStyles.dropdown}>
          <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
            {[...years].reverse().map(y => (
              <TouchableOpacity
                key={y}
                style={[calStyles.dropdownItem, viewYear === y && calStyles.dropdownItemSelected]}
                onPress={() => { setViewYear(y); setShowYearPicker(false) }}
              >
                <Caption2 color={viewYear === y ? '#FFFFFF' : '#1A1A1A'}>{y}</Caption2>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Day Names */}
      <View style={calStyles.dayNamesRow}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <View key={d} style={calStyles.dayNameCell}>
            <Caption2 color="#00000066">{d}</Caption2>
          </View>
        ))}
      </View>

      {/* Days */}
      {Array.from({ length: cells.length / 7 }, (_, row) => (
        <View key={row} style={calStyles.weekRow}>
          {cells.slice(row * 7, row * 7 + 7).map((day, col) => (
            <TouchableOpacity
              key={col}
              style={[
                calStyles.dayCell,
                day !== null && isSelected(day as number) && calStyles.dayCellSelected,
              ]}
              onPress={() => day !== null && handleDayPress(day as number)}
              activeOpacity={day !== null ? 0.7 : 1}
              disabled={day === null}
            >
              {day !== null && (
                <Caption2 color={isSelected(day) ? '#FFFFFF' : '#1A1A1A'}>{day}</Caption2>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  )
}

const calStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp(10),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginTop: hp(6),
    marginBottom: hp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(8),
  },
  headerCenter: { flexDirection: 'row', gap: wp(6) },
  headerLabel: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  navBtn: { padding: wp(8) },
  dayNamesRow: { flexDirection: 'row', marginBottom: hp(2) },
  dayNameCell: { flex: 1, alignItems: 'center', paddingVertical: hp(2) },
  weekRow: { flexDirection: 'row' },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginVertical: hp(1),
  },
  dayCellSelected: { backgroundColor: Colors.BRAND_PRIMARY },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    marginBottom: hp(6),
    overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: wp(14), paddingVertical: hp(10) },
  dropdownItemSelected: { backgroundColor: Colors.BRAND_PRIMARY },
})
// ─── End Calendar ─────────────────────────────────────────────────────────────

export default function FamilyInformationScreen() {
  const router = useRouter()
  const { data } = useGetProfileQuery({})
  const [updateFamily, { isLoading }] = useUpdateFamilyPatchMutation()

  const [members, setMembers] = useState<FamilyMember[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editData, setEditData] = useState<FamilyMember>(EMPTY_MEMBER)
  const [modalVisible, setModalVisible] = useState(false)

  // new UI states inside modal
  const [showCalendar, setShowCalendar] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)

  useEffect(() => {
    if (data?.steps?.family?.data?.family_members) {
      setMembers(data.steps.family.data.family_members)
    }
  }, [data])

  const openEdit = (index: number) => {
    setEditingIndex(index)
    setEditData({ ...members[index] })
    setShowCalendar(false)
    setShowGenderPicker(false)
    setModalVisible(true)
  }

  const openAdd = () => {
    if (members.length >= MAX_MEMBERS) {
      showToast(`Maximum ${MAX_MEMBERS} family members allowed`, 'error')
      return
    }
    setEditingIndex(null)
    setEditData({ ...EMPTY_MEMBER })
    setShowCalendar(false)
    setShowGenderPicker(false)
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
            {/* <H6 color={Colors.BRAND_PRIMARY} style={{ fontSize: 22 }}>+</H6> */}
            <PlusButtonIcon/>
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
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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

              {/* Date of Birth — Calendar */}
              <Caption2 style={styles.label}>Date of Birth</Caption2>
              <TouchableOpacity
                style={styles.fieldBox}
                onPress={() => { setShowCalendar(v => !v); setShowGenderPicker(false) }}
                activeOpacity={0.75}
              >
                <View style={styles.fieldRowInner}>
                  <Body3 color={editData.date_of_birth ? '#000000' : '#AAAAAA'} style={styles.inputText}>
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

              {/* Gender — Inline Picker */}
              <Caption2 style={styles.label}>Gender</Caption2>
              <TouchableOpacity
                style={styles.fieldBox}
                onPress={() => { setShowGenderPicker(v => !v); setShowCalendar(false) }}
                activeOpacity={0.75}
              >
                <View style={styles.fieldRowInner}>
                  <Body3 color={editData.gender ? '#000000' : '#AAAAAA'} style={styles.inputText}>
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
    maxHeight: '90%',
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