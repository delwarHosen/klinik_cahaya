import { FilterIcon } from '@/assets/icons/admin_icon/FilterIcon'
import { DatePickerModal } from '@/components/booking/DatePickerModal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body2, Caption1, Caption4 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { useGetFilteredBookingsQuery } from '@/redux/services/adminApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingRequest {
  id: string
  appointment_id: number | null
  patient_phone: number
  patient_name: string
  patient_ic: string
  doctor_phone: number
  doctor_name: string
  provider_id: number
  service_id: number
  appt_date: string
  appt_time: string
  reason: string
  status: string
  created_at: string
  reschedule_suggestion: any | null
  reschedule_state: any | null
  reschedule_data: any | null
  approved_by: string | null
  approved_at: string | null
}

// ─── Doctor list — uses provider_id (matches API field) ──────────────────────
const DOCTORS = [
  { id: 'dr_faiz',         name: 'Dr. Faiz',                    provider_id: 3849 },
  { id: 'dr_liyana_ramli', name: 'Dr. Noor Liyana Binti Ramli', provider_id: 3949 },
  { id: 'dr_liyana_yusoff',name: 'Dr. Liyana',                  provider_id: 3798 },
  { id: 'dr_mimi',         name: 'Dr. Mimi',                    provider_id: 6505 },
  { id: 'dr_sourav',       name: 'Dr. Sourav',                  provider_id: 8451 },
  { id: 'dr_anis',         name: 'Dr. Anis Effendi',            provider_id: 3797 },
]

// ─── Status options ───────────────────────────────────────────────────────────
type StatusOption = {
  label: string
  apiValue: string
  color: string
  bg: string
}

const STATUS_OPTIONS: StatusOption[] = [
  { label: 'Pending',     apiValue: 'pending',     color: '#1A1A1A', bg: '#D4F000' },
  { label: 'Confirmed',   apiValue: 'confirmed',   color: '#FFFFFF', bg: Colors.BRAND_PRIMARY },
  { label: 'Rejected',    apiValue: 'rejected',    color: '#FFFFFF', bg: '#FF383C' },
  { label: 'Expired',     apiValue: 'expired',     color: '#FFFFFF', bg: '#AAAAAA' },
  { label: 'Rescheduled', apiValue: 'rescheduled', color: '#FFFFFF', bg: '#F5A623' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return dateStr }
}

const formatTime = (timeStr: string) => {
  try {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 || 12}:${m} ${ampm}`
  } catch { return timeStr }
}

const getStatusConfig = (apiValue: string) =>
  STATUS_OPTIONS.find(s => s.apiValue === apiValue) ?? STATUS_OPTIONS[0]

// DatePickerModal returns e.g. "April 9, 2026 (Thursday)" → convert to "2026-04-09"
const parseToYMD = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const clean = dateStr.replace(/\s*\(.*?\)/, '').trim()
    const d = new Date(clean)
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
  } catch { }
  return ''
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookingRequestScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [search, setSearch] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [datePickerFor, setDatePickerFor] = useState<'start' | 'end'>('start')

  // ── Applied state → drives the API call ───────────────────────────────────
  const [appliedStatus, setAppliedStatus] = useState<StatusOption>(STATUS_OPTIONS[0])
  const [appliedProviderIds, setAppliedProviderIds] = useState<number[]>(
    DOCTORS.map(d => d.provider_id)
  )
  const [appliedStartDate, setAppliedStartDate] = useState('') // YYYY-MM-DD
  const [appliedEndDate, setAppliedEndDate] = useState('')     // YYYY-MM-DD

  // ── Temp state → inside modal only ────────────────────────────────────────
  const [tempStatus, setTempStatus] = useState<StatusOption>(STATUS_OPTIONS[0])
  const [tempProviderIds, setTempProviderIds] = useState<number[]>(
    DOCTORS.map(d => d.provider_id)
  )
  const [tempStartDate, setTempStartDate] = useState('') // display string
  const [tempEndDate, setTempEndDate] = useState('')     // display string

  // ── Build API params ───────────────────────────────────────────────────────
  const allSelected = appliedProviderIds.length === DOCTORS.length

  const filterParams = {
    status: appliedStatus.apiValue,
    // Send provider_id values joined as doctor_ids when not all doctors selected
    ...(!allSelected && {
      doctor_ids: appliedProviderIds.join(','),
    }),
    ...(appliedStartDate && { start_date: appliedStartDate }),
    ...(appliedEndDate   && { end_date:   appliedEndDate }),
  }

  const { data, isLoading, isFetching } = useGetFilteredBookingsQuery(filterParams)

  const allResults: BookingRequest[] = (data?.results ?? []) as BookingRequest[]

  // ── Client-side search only (everything else filtered by API) ─────────────
  const filteredResults = allResults.filter(item => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.doctor_name.toLowerCase().includes(q) ||
      item.patient_name.toLowerCase().includes(q)
    )
  })

  const isLoadingData = isLoading || isFetching

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const handleOpenFilter = () => {
    setTempStatus(appliedStatus)
    setTempProviderIds([...appliedProviderIds])
    // Show the stored YYYY-MM-DD as-is inside temp (parsed back on apply)
    setTempStartDate(appliedStartDate)
    setTempEndDate(appliedEndDate)
    setFilterVisible(true)
  }

  const handleApplyFilter = () => {
    setAppliedStatus(tempStatus)
    setAppliedProviderIds([...tempProviderIds])
    // parseToYMD handles the display string; if already YYYY-MM-DD it passes through
    setAppliedStartDate(parseToYMD(tempStartDate) || tempStartDate)
    setAppliedEndDate(parseToYMD(tempEndDate) || tempEndDate)
    setFilterVisible(false)
  }

  const handleResetFilter = () => {
    setTempStatus(STATUS_OPTIONS[0])
    setTempProviderIds(DOCTORS.map(d => d.provider_id))
    setTempStartDate('')
    setTempEndDate('')
  }

  // Toggle a single provider_id in the temp selection
  const toggleTempDoctor = (providerId: number) => {
    setTempProviderIds(prev =>
      prev.includes(providerId)
        ? prev.filter(x => x !== providerId)
        : [...prev, providerId]
    )
  }

  const handleDateConfirm = (dateDisplay: string) => {
    if (datePickerFor === 'start') setTempStartDate(dateDisplay)
    else setTempEndDate(dateDisplay)
    setDatePickerVisible(false)
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleCardPress = (item: BookingRequest) => {
    if (item.status === 'rejected') {
      router.push({
        pathname: '/admin/appointments/canceled_appointment_details' as any,
        params: { bookingId: item.id },
      })
    } else {
      router.push({
        pathname: '/admin/appointments/appointment_details' as any,
        params: { bookingId: item.id },
      })
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={{ marginTop: hp(10) }}>
        <SectionTitle title="Booking Request" showBackButton={false} />
      </View>

      {/* Search + Filter row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#AAAAAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctor or patient"
            placeholderTextColor="#AAAAAA"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#AAAAAA" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={handleOpenFilter} activeOpacity={0.8}>
          <FilterIcon />
        </TouchableOpacity>
      </View>

      {/* Active status badge + count */}
      <View style={styles.activeBadgeRow}>
        <View style={[styles.activeBadge, { backgroundColor: appliedStatus.bg }]}>
          <Caption1 style={[styles.activeBadgeText, { color: appliedStatus.color }]}>
            {appliedStatus.label}
          </Caption1>
        </View>
        {!isLoadingData && (
          <Caption4 style={styles.countText}>
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </Caption4>
        )}
      </View>

      {/* List */}
      {isLoadingData ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + hp(20) }}
        >
          {filteredResults.length === 0 ? (
            <View style={styles.empty}>
              <Caption1 style={{ color: '#aaa' }}>
                No {appliedStatus.label.toLowerCase()} requests found.
              </Caption1>
            </View>
          ) : (
            filteredResults.map(item => {
              const statusCfg = getStatusConfig(item.status)
              const isPending = item.status === 'pending'

              return (
                <TouchableOpacity
                  key={item.id}
                  style={{ marginBottom: hp(10) }}
                  activeOpacity={0.8}
                  onPress={() => handleCardPress(item)}
                >
                  <View style={styles.card}>
                    <View style={styles.cardLeft}>
                      <Caption1 weight="semiBold" style={styles.doctorName} numberOfLines={1}>
                        {item.doctor_name}
                      </Caption1>
                      <Caption4 style={styles.metaNormal}>
                        {formatTime(item.appt_time)} · {formatDate(item.appt_date)}
                      </Caption4>
                      <Caption4 style={[styles.metaNormal, { marginTop: hp(2) }]}>
                        {item.patient_name}
                      </Caption4>
                      {item.reason ? (
                        <Caption4 style={styles.reasonText} numberOfLines={1}>
                          {item.reason}
                        </Caption4>
                      ) : null}
                    </View>

                    <View style={styles.cardRight}>
                      <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                        <Caption4 style={[styles.statusBadgeText, { color: statusCfg.color }]}>
                          {statusCfg.label}
                        </Caption4>
                      </View>
                      {isPending && (
                        <CustomButton
                          title="View"
                          borderRadius={10}
                          onPress={() => handleCardPress(item)}
                          width={wp(60)}
                          height={hp(36)}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          )}
        </ScrollView>
      )}

      {/* ── Filter Modal ──────────────────────────────────────────────────── */}
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

                {/* Header */}
                <View style={styles.sheetHeader}>
                  <Body2 style={styles.sheetTitle}>Filter</Body2>
                  <TouchableOpacity onPress={handleResetFilter} activeOpacity={0.7}>
                    <Caption1 style={styles.resetText}>Reset</Caption1>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>

                  {/* Status */}
                  <Body2 style={styles.filterSectionLabel}>Status</Body2>
                  {STATUS_OPTIONS.map(opt => {
                    const selected = tempStatus.apiValue === opt.apiValue
                    return (
                      <TouchableOpacity
                        key={opt.apiValue}
                        style={styles.filterRow}
                        onPress={() => setTempStatus(opt)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.filterRowLeft}>
                          <View style={[styles.statusDot, { backgroundColor: opt.bg }]} />
                          <Caption1 style={styles.filterRowText}>{opt.label}</Caption1>
                        </View>
                        <View style={[styles.radio, selected && styles.radioSelected]}>
                          {selected && <View style={styles.radioInner} />}
                        </View>
                      </TouchableOpacity>
                    )
                  })}

                  {/* Doctor — keyed by provider_id */}
                  <Body2 style={styles.filterSectionLabel}>Doctor</Body2>
                  {DOCTORS.map(doc => {
                    const checked = tempProviderIds.includes(doc.provider_id)
                    return (
                      <TouchableOpacity
                        key={doc.id}
                        style={styles.filterRow}
                        onPress={() => toggleTempDoctor(doc.provider_id)}
                        activeOpacity={0.7}
                      >
                        <Caption1 style={styles.filterRowText}>{doc.name}</Caption1>
                        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                          {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
                        </View>
                      </TouchableOpacity>
                    )
                  })}

                  {/* Date Range — allowPastDates={true} so April etc. are selectable */}
                  <Body2 style={styles.filterSectionLabel}>Date Range</Body2>
                  <TouchableOpacity
                    style={styles.filterRow}
                    activeOpacity={0.7}
                    onPress={() => { setDatePickerFor('start'); setDatePickerVisible(true) }}
                  >
                    <Caption1 style={styles.filterRowText}>Start Date</Caption1>
                    <Caption1 style={tempStartDate ? styles.selectedDateText : styles.placeholderText}>
                      {tempStartDate || 'Select'}
                    </Caption1>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filterRow}
                    activeOpacity={0.7}
                    onPress={() => { setDatePickerFor('end'); setDatePickerVisible(true) }}
                  >
                    <Caption1 style={styles.filterRowText}>End Date</Caption1>
                    <Caption1 style={tempEndDate ? styles.selectedDateText : styles.placeholderText}>
                      {tempEndDate || 'Select'}
                    </Caption1>
                  </TouchableOpacity>

                  {/* Apply */}
                  <TouchableOpacity
                    style={styles.findBtn}
                    onPress={handleApplyFilter}
                    activeOpacity={0.85}
                  >
                    <Caption1 style={styles.findBtnText}>Apply Filter</Caption1>
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker — allowPastDates so filter can select historical dates */}
      <DatePickerModal
        visible={datePickerVisible}
        title={datePickerFor === 'start' ? 'Select Start Date' : 'Select End Date'}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        allowPastDates={true}   // ← KEY FIX: filter needs past dates like April
      />
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    marginBottom: hp(12),
  },
  activeBadge: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(6),
    borderRadius: 20,
  },
  activeBadgeText: {
    fontWeight: '600',
    fontSize: 13,
  },
  countText: {
    color: '#888888',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(14),
    paddingHorizontal: wp(16),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    gap: wp(10),
  },
  cardLeft: { flex: 1 },
  cardRight: {
    alignItems: 'flex-end',
    gap: hp(8),
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    marginBottom: hp(4),
  },
  metaNormal: {
    color: '#666666',
    marginBottom: 2,
  },
  reasonText: {
    color: '#999999',
    marginTop: hp(2),
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
    borderRadius: 8,
  },
  statusBadgeText: {
    fontWeight: '600',
    fontSize: 11,
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
    marginBottom: hp(12),
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  sheetTitle: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
    fontSize: 16,
  },
  resetText: {
    color: '#FF383C',
    fontWeight: '600',
    fontSize: 13,
  },
  filterSectionLabel: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    marginBottom: hp(10),
    marginTop: hp(12),
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
  filterRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  filterRowText: {
    color: Colors.TEXT_COLOR,
    fontSize: 14,
  },
  selectedDateText: {
    color: Colors.BRAND_PRIMARY,
    fontSize: 12,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
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