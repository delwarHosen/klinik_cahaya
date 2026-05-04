import { FilterIcon } from '@/assets/icons/admin_icon/FilterIcon'
import { DatePickerModal } from '@/components/booking/DatePickerModal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body2, Caption1, Caption4 } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { DOCTORS } from '@/constants/fakeData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const STATUS_OPTIONS = ['Pending', 'Rejected / Cancelled']

export default function BookingRequestScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [search, setSearch] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)

  // Status — radio (single)
  const [selectedStatus, setSelectedStatus] = useState<string>('Pending')

  // Doctor — checkbox (multi)
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(DOCTORS.map(d => d.name))

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [datePickerFor, setDatePickerFor] = useState<'start' | 'end'>('start')

  const toggleDoctor = (name: string) => {
    setSelectedDoctors(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    )
  }

  const openDatePicker = (type: 'start' | 'end') => {
    setDatePickerFor(type)
    setDatePickerVisible(true)
  }

  const handleDateConfirm = (date: string) => {
    if (datePickerFor === 'start') setStartDate(date)
    else setEndDate(date)
    setDatePickerVisible(false)
  }

  const filteredData = ADMIN_APPOINTMENTS.filter(a => {
    const matchSearch = a.doctorName.toLowerCase().includes(search.toLowerCase())
    const statusMatch =
      (selectedStatus === 'Pending' && a.status === 'Pending') ||
      (selectedStatus === 'Rejected / Cancelled' && a.status === 'Canceled')
    const doctorMatch = selectedDoctors.includes(a.doctorName)
    return matchSearch && statusMatch && doctorMatch
  })

  const pendingList = filteredData.filter(a => a.status === 'Pending')
  const rejectedList = filteredData.filter(a => a.status === 'Canceled')

  const renderPendingCard = ({ item }: { item: typeof ADMIN_APPOINTMENTS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Caption1 weight='semiBold' style={styles.doctorName} numberOfLines={1}>
          {item.doctorName}
        </Caption1>
        <Caption4 style={styles.metaNormal}>{item.time}</Caption4>
        <Caption4 style={styles.metaNormal}>{item.displayDate}</Caption4>
      </View>
      <CustomButton
        title='View'
        borderRadius={14}
        onPress={() =>
          router.push({
            pathname: '/admin/appointments/appointment_details' as any,
            params: { id: item.id },
          })
        }
        width={'25%'}
        height={hp(44)}
      />
    </View>
  )

  const renderRejectedCard = ({ item }: { item: typeof ADMIN_APPOINTMENTS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Caption1 weight='semiBold' style={styles.doctorName} numberOfLines={1}>
          {item.doctorName}
        </Caption1>
        <Caption4 style={styles.metaRed}>{item.time} | {item.displayDate}</Caption4>
      </View>
      <View style={styles.patientRight}>
        <Caption4 style={styles.patientLabel}>Patient</Caption4>
        <Caption4 style={styles.patientName}>{item.patientName}</Caption4>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={{ marginTop: hp(10) }}>
        <SectionTitle title="Booking Request" showBackButton={false} />
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#AAAAAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#AAAAAA"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterVisible(true)}
          activeOpacity={0.8}
        >
          <FilterIcon />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + hp(20) }}
      >
        {pendingList.length > 0 && (
          <>
            <Caption1 style={styles.sectionLabel}>Pending</Caption1>
            {pendingList.map(item => (
              <View key={item.id} style={{ marginBottom: hp(10) }}>
                {renderPendingCard({ item })}
              </View>
            ))}
          </>
        )}

        {rejectedList.length > 0 && (
          <>
            <Caption1 style={styles.sectionLabel}>Canceled</Caption1>
            {rejectedList.map(item => (
              <View key={item.id} style={{ marginBottom: hp(10) }}>
                {renderRejectedCard({ item })}
              </View>
            ))}
          </>
        )}

        {filteredData.length === 0 && (
          <View style={styles.empty}>
            <Caption1 style={{ color: '#aaa' }}>No requests found.</Caption1>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setFilterVisible(false) }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, hp(24)) }]}>
                <View style={styles.sheetHandle} />

                <ScrollView showsVerticalScrollIndicator={false}>

                  {/* Status — Radio */}
                  <Body2 style={styles.filterSectionLabel}>Status</Body2>
                  {STATUS_OPTIONS.map(opt => {
                    const selected = selectedStatus === opt
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={styles.filterRow}
                        onPress={() => setSelectedStatus(opt)}
                        activeOpacity={0.7}
                      >
                        <Caption1 style={styles.filterRowText}>{opt}</Caption1>
                        <View style={[styles.radio, selected && styles.radioSelected]}>
                          {selected && <View style={styles.radioInner} />}
                        </View>
                      </TouchableOpacity>
                    )
                  })}

                  {/* Doctor — Checkbox */}
                  <Body2 style={styles.filterSectionLabel}>Doctor</Body2>
                  {DOCTORS.map(doc => {
                    const checked = selectedDoctors.includes(doc.name)
                    return (
                      <TouchableOpacity
                        key={doc.id}
                        style={styles.filterRow}
                        onPress={() => toggleDoctor(doc.name)}
                        activeOpacity={0.7}
                      >
                        <Caption1 style={styles.filterRowText}>{doc.name}</Caption1>
                        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                          {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
                        </View>
                      </TouchableOpacity>
                    )
                  })}

                  {/* Date */}
                  <Body2 style={styles.filterSectionLabel}>Date</Body2>

                  <TouchableOpacity
                    style={styles.filterRow}
                    activeOpacity={0.7}
                    onPress={() => openDatePicker('start')}
                  >
                    <Caption1 style={styles.filterRowText}>Start date</Caption1>
                    {startDate ? (
                      <Caption1 style={styles.selectedDateText}>{startDate}</Caption1>
                    ) : null}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filterRow}
                    activeOpacity={0.7}
                    onPress={() => openDatePicker('end')}
                  >
                    <Caption1 style={styles.filterRowText}>End Date</Caption1>
                    {endDate ? (
                      <Caption1 style={styles.selectedDateText}>{endDate}</Caption1>
                    ) : null}
                  </TouchableOpacity>

                  {/* Find Button */}
                  <TouchableOpacity
                    style={styles.findBtn}
                    onPress={() => setFilterVisible(false)}
                    activeOpacity={0.85}
                  >
                    <Caption1 style={styles.findBtnText}>Find</Caption1>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={datePickerVisible}
        title={datePickerFor === 'start' ? 'Select Start Date' : 'Select End Date'}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    paddingVertical: hp(16),
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: wp(14),
    paddingVertical: hp(5),
    gap: wp(8),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.TEXT_COLOR,
    fontFamily: 'Poppins_400Regular',
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    marginBottom: hp(8),
    marginTop: hp(4),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  cardLeft: { flex: 1 },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    marginBottom: hp(4),
  },
  metaNormal: {
    color: '#666666',
    marginBottom: 2,
  },
  metaRed: {
    color: Colors.COLOR_DANGER,
    marginBottom: 2,
  },
  patientRight: {
    alignItems: 'flex-end',
  },
  patientLabel: {
    color: '#888888',
  },
  patientName: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
  },
  empty: {
    marginTop: hp(60),
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: hp(20),
  },
  filterSectionLabel: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    marginBottom: hp(10),
    marginTop: hp(8),
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    marginBottom: hp(8),
  },
  filterRowText: {
    color: Colors.TEXT_COLOR,
    fontSize: 14,
  },
  selectedDateText: {
    color: Colors.BRAND_PRIMARY,
    fontSize: 12,
  },

  // ── Radio (Status) ──
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.BRAND_PRIMARY,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.BRAND_PRIMARY,
  },

  // ── Checkbox (Doctor) ──
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderColor: Colors.BRAND_PRIMARY,
  },

  findBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: hp(18),
    alignItems: 'center',
    marginTop: hp(16),
    marginBottom: hp(8),
  },
  findBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
})