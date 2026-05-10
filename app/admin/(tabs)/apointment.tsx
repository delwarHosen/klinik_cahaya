import { FilterIcon } from '@/assets/icons/admin_icon/FilterIcon'
import { DatePickerModal } from '@/components/booking/DatePickerModal'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body2, Caption1, Caption2, Caption4 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import {
  AppointmentFilterParams,
  AppointmentItem,
  useGetFilteredAppointmentsQuery,
} from '@/redux/services/adminApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
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

// ─── Doctors (provider_id) ────────────────────────────────────────────────────
const DOCTORS = [
  { id: 'dr_faiz', name: 'Dr. Faiz', provider_id: 3849 },
  { id: 'dr_liyana_ramli', name: 'Dr. Noor Liyana Binti Ramli', provider_id: 3949 },
  { id: 'dr_liyana_yusoff', name: 'Dr. Liyana Yusoff', provider_id: 3798 },
  { id: 'dr_mimi', name: 'Dr. Mimi', provider_id: 6505 },
  { id: 'dr_sourav', name: 'Dr. Sourav', provider_id: 8451 },
  { id: 'dr_anis', name: 'Dr. Anis Effendi', provider_id: 3797 },
]

// ─── Category Tabs ────────────────────────────────────────────────────────────
type Category = 'upcoming' | 'completed' | 'cancelled'

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

// ─── Status display map ───────────────────────────────────────────────────────
const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  received: { color: Colors.BRAND_PRIMARY, bg: '#E8F7F6' },
  absent: { color: '#888888', bg: '#F0F0F0' },
  cancelled: { color: '#FF383C', bg: '#FFF0F0' },
  cancel: { color: '#FF383C', bg: '#FFF0F0' },
  reject: { color: '#FF383C', bg: '#FFF0F0' },
  pending: { color: '#1A1A1A', bg: '#D4F000' },
  new: { color: Colors.BRAND_PRIMARY, bg: '#E8F7F6' },
  completed: { color: '#FFFFFF', bg: Colors.BRAND_PRIMARY },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso: string | null) => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return iso }
}

const formatTime = (iso: string | null) => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const h = d.getHours()
    const m = String(d.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${m} ${ampm}`
  } catch { return '' }
}

// DatePickerModal display string → YYYY-MM-DD
const parseToYMD = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    // "May 10, 2026 (Sunday)" → remove bracket → "May 10, 2026"
    const clean = dateStr.replace(/\s*\(.*?\)/, '').trim()
    // "May 10, 2026" → ["May", "10,", "2026"]
    const parts = clean.split(' ')
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const mo = String(monthNames.indexOf(parts[0]) + 1).padStart(2, '0')
    const day = String(parseInt(parts[1])).padStart(2, '0')
    const year = parts[2]
    if (monthNames.indexOf(parts[0]) === -1) return ''
    return `${year}-${mo}-${day}`
  } catch { }
  return ''
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminAppointmentScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ activeTab?: string }>()

  // ── Active category (applied) ──────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<Category>(
    (params.activeTab?.toLowerCase() as Category) ?? 'upcoming'
  )

  // ── Search ─────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')

  // ── Filter modal visibility ────────────────────────────────────────────────
  const [filterVisible, setFilterVisible] = useState(false)

  // ── Applied filter state (drives API call) ─────────────────────────────────
  const [appliedProviderIds, setAppliedProviderIds] = useState<number[]>(
    DOCTORS.map(d => d.provider_id)
  )
  const [appliedStartDate, setAppliedStartDate] = useState('')
  const [appliedEndDate, setAppliedEndDate] = useState('')

  // ── Temp filter state (inside modal) ──────────────────────────────────────
  const [tempCategory, setTempCategory] = useState<Category>(activeCategory)
  const [tempProviderIds, setTempProviderIds] = useState<number[]>(DOCTORS.map(d => d.provider_id))
  const [tempStartDate, setTempStartDate] = useState('')
  const [tempEndDate, setTempEndDate] = useState('')

  // ── Date picker ────────────────────────────────────────────────────────────
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [datePickerFor, setDatePickerFor] = useState<'start' | 'end'>('start')

  // ── Sync tab from route params ─────────────────────────────────────────────
  useEffect(() => {
    if (params.activeTab) {
      const cat = params.activeTab.toLowerCase() as Category
      setActiveCategory(cat)
      setTempCategory(cat)
    }
  }, [params.activeTab])

  // ── Build API params ───────────────────────────────────────────────────────
  const allSelected = appliedProviderIds.length === DOCTORS.length

  const filterParams: AppointmentFilterParams = {
    category: activeCategory,
    ...(!allSelected && { doctor_ids: appliedProviderIds.join(',') }),
    ...(appliedStartDate && { start_date: appliedStartDate }),
    ...(appliedEndDate && { end_date: appliedEndDate }),
  }


  console.log('🎯 filterParams being sent:', JSON.stringify(filterParams))

  const { data, isLoading, isFetching } = useGetFilteredAppointmentsQuery(filterParams)

  const isLoadingData = isLoading || isFetching
  const allResults: AppointmentItem[] = (data?.results ?? []) as AppointmentItem[]

  // ── Client-side search filter ──────────────────────────────────────────────
  const filtered = allResults.filter(item => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.provider.name.toLowerCase().includes(q) ||
      item.lead.name.toLowerCase().includes(q)
    )
  })

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const handleOpenFilter = () => {
    setTempCategory(activeCategory)
    setTempProviderIds([...appliedProviderIds])
    setTempStartDate(appliedStartDate)
    setTempEndDate(appliedEndDate)
    setFilterVisible(true)
  }

  const handleApplyFilter = () => {
    setActiveCategory(tempCategory)
    setAppliedProviderIds([...tempProviderIds])
    setAppliedStartDate(parseToYMD(tempStartDate) || tempStartDate)
    setAppliedEndDate(parseToYMD(tempEndDate) || tempEndDate)
    setFilterVisible(false)
  }

  const handleResetFilter = () => {
    setTempCategory('upcoming')
    setTempProviderIds(DOCTORS.map(d => d.provider_id))
    setTempStartDate('')
    setTempEndDate('')
  }

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
  const handleCardPress = (item: AppointmentItem) => {
    router.push({
      pathname: '/admin/appointments/appintment_status_details' as any,
      params: { appointmentId: String(item.id) },
    })
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={{ marginTop: hp(10) }}>
        <SectionTitle title="Appointments" showBackButton={false} />
      </View>

      {/* Search + Filter */}
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



      {/* Count */}
      {!isLoadingData && (
        <Caption4 style={styles.countText}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </Caption4>
      )}

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
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Caption1 style={{ color: '#aaa' }}>No appointments found.</Caption1>
            </View>
          ) : (
            filtered.map(item => {
              const statusKey = item.status?.toLowerCase() ?? ''
              const statusCfg = STATUS_COLOR[statusKey] ?? STATUS_COLOR['received']

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => handleCardPress(item)}
                >
                  {/* Left */}
                  <View style={styles.cardLeft}>
                    <Caption1 weight="semiBold" style={styles.doctorName} numberOfLines={1}>
                      {item.provider.name}
                    </Caption1>
                    <Caption4 style={styles.metaText}>
                      {formatTime(item.start)}
                      {item.start ? '  ·  ' : ''}
                      {formatDate(item.start)}
                    </Caption4>
                    {item.lead.remarks ? (
                      <Caption4 style={styles.remarkText} numberOfLines={1}>
                        {item.lead.remarks}
                      </Caption4>
                    ) : null}
                  </View>

                  {/* Divider */}
                  <View style={styles.verticalDivider} />

                  {/* Right */}
                  <View style={styles.cardRight}>
                    <Caption4 style={styles.patientLabel}>Patient</Caption4>
                    <Caption2 style={styles.patientName} numberOfLines={2}>
                      {item.lead.name}
                    </Caption2>
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                      <Caption4 style={[styles.statusText, { color: statusCfg.color }]}>
                        {item.status}
                      </Caption4>
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

                  {/* Category */}
                  <Body2 style={styles.filterSectionLabel}>Category</Body2>
                  {CATEGORIES.map(cat => {
                    const selected = tempCategory === cat.value
                    return (
                      <TouchableOpacity
                        key={cat.value}
                        style={styles.filterRow}
                        onPress={() => setTempCategory(cat.value)}
                        activeOpacity={0.7}
                      >
                        <Caption1 style={styles.filterRowText}>{cat.label}</Caption1>
                        <View style={[styles.radio, selected && styles.radioSelected]}>
                          {selected && <View style={styles.radioInner} />}
                        </View>
                      </TouchableOpacity>
                    )
                  })}

                  {/* Doctor */}
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

                  {/* Date Range — allowPastDates for historical filtering */}
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

      {/* Date Picker */}
      <DatePickerModal
        visible={datePickerVisible}
        title={datePickerFor === 'start' ? 'Select Start Date' : 'Select End Date'}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        allowPastDates={true}
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

  // Search
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

  // Category tabs
  tabRow: {
    flexDirection: 'row',
    gap: wp(8),
    marginBottom: hp(12),
  },
  tabPill: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  tabPillActive: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  tabText: {
    color: '#888888',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  countText: {
    color: '#888888',
    marginBottom: hp(10),
  },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: hp(10),
    overflow: 'hidden',
  },
  cardLeft: {
    flex: 1,
    paddingHorizontal: wp(14),
    paddingVertical: hp(14),
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: Colors.BORDER_COLOR,
  },
  cardRight: {
    width: wp(130),
    paddingHorizontal: wp(12),
    paddingVertical: hp(14),
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: hp(6),
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    marginBottom: hp(4),
  },
  metaText: {
    color: '#666666',
    marginBottom: hp(2),
  },
  remarkText: {
    color: '#999999',
    fontStyle: 'italic',
    marginTop: hp(2),
  },
  patientLabel: {
    color: '#888888',
  },
  patientName: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(3),
    borderRadius: 8,
    marginTop: hp(2),
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  empty: {
    marginTop: hp(60),
    alignItems: 'center',
  },

  // Modal
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