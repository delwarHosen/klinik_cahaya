import { Caption1, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

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

export default function CalendarPicker({ value, onChange }: CalendarPickerProps) {
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
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <H6 color={Colors.BRAND_PRIMARY}>{'‹'}</H6>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <TouchableOpacity
            onPress={() => { setShowMonthPicker(v => !v); setShowYearPicker(false) }}
            style={styles.headerLabel}
          >
            <Caption1 color="#1A1A1A" style={{ fontWeight: '600' }}>{MONTHS[viewMonth]}</Caption1>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setShowYearPicker(v => !v); setShowMonthPicker(false) }}
            style={styles.headerLabel}
          >
            <Caption1 color="#1A1A1A" style={{ fontWeight: '600' }}>{viewYear}</Caption1>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <H6 color={Colors.BRAND_PRIMARY}>{'›'}</H6>
        </TouchableOpacity>
      </View>

      {showMonthPicker && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
            {MONTHS.map((m, i) => (
              <TouchableOpacity
                key={m}
                style={[styles.dropdownItem, viewMonth === i && styles.dropdownItemSelected]}
                onPress={() => { setViewMonth(i); setShowMonthPicker(false) }}
              >
                <Caption2 color={viewMonth === i ? '#FFFFFF' : '#1A1A1A'}>{m}</Caption2>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {showYearPicker && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
            {[...years].reverse().map(y => (
              <TouchableOpacity
                key={y}
                style={[styles.dropdownItem, viewYear === y && styles.dropdownItemSelected]}
                onPress={() => { setViewYear(y); setShowYearPicker(false) }}
              >
                <Caption2 color={viewYear === y ? '#FFFFFF' : '#1A1A1A'}>{y}</Caption2>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.dayNamesRow}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <View key={d} style={styles.dayNameCell}>
            <Caption2 color="#00000066">{d}</Caption2>
          </View>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }, (_, row) => (
        <View key={row} style={styles.weekRow}>
          {cells.slice(row * 7, row * 7 + 7).map((day, col) => (
            <TouchableOpacity
              key={col}
              style={[
                styles.dayCell,
                day !== null && isSelected(day as number) && styles.dayCellSelected,
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

const styles = StyleSheet.create({
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