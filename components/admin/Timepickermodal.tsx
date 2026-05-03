// components/admin/TimePickerModal.tsx
import { Caption1, Caption2, H1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

interface Props {
  visible: boolean
  title: string               // "Starting Time" or "Ending Time"
  initialTime?: string        // e.g. "08:00 AM"
  onClose: () => void
  onConfirm: (time: string) => void
}

export function TimePickerModal({ visible, title, initialTime = '12:00 AM', onClose, onConfirm }: Props) {
  const parseTime = (t: string) => {
    const [timePart, period] = t.split(' ')
    const [h, m] = timePart.split(':').map(Number)
    return { hours: h, minutes: m, period: period as 'AM' | 'PM' }
  }

  const { hours, minutes, period: initPeriod } = parseTime(initialTime)
  const [displayHours, setDisplayHours] = useState(hours)
  const [displayMinutes, setDisplayMinutes] = useState(minutes)
  const [period, setPeriod] = useState<'AM' | 'PM'>(initPeriod)

  const pad = (n: number) => String(n).padStart(2, '0')

  const incrementHours = () => setDisplayHours(h => (h % 12) + 1)
  const decrementHours = () => setDisplayHours(h => h === 1 ? 12 : h - 1)
  const incrementMinutes = () => setDisplayMinutes(m => (m + 30) % 60)
  const decrementMinutes = () => setDisplayMinutes(m => m === 0 ? 30 : m - 30)

  const handleConfirm = () => {
    onConfirm(`${pad(displayHours)}:${pad(displayMinutes)} ${period}`)
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Title */}
          <Caption1 style={styles.title}>{title}</Caption1>

          <View style={styles.body}>
            {/* AM / PM toggle */}
            <View style={styles.periodCol}>
              <TouchableOpacity
                style={[styles.periodBtn, period === 'AM' && styles.periodBtnActive]}
                onPress={() => setPeriod('AM')}
                activeOpacity={0.8}
              >
                <Caption2 style={[styles.periodText, period === 'AM' && styles.periodTextActive]}>
                  AM
                </Caption2>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodBtn, period === 'PM' && styles.periodBtnActive]}
                onPress={() => setPeriod('PM')}
                activeOpacity={0.8}
              >
                <Caption2 style={[styles.periodText, period === 'PM' && styles.periodTextActive]}>
                  PM
                </Caption2>
              </TouchableOpacity>
            </View>

            {/* Time display */}
            <View style={styles.timeDisplay}>
              {/* Hours */}
              <View style={styles.unitCol}>
                <TouchableOpacity onPress={incrementHours} style={styles.arrowBtn}>
                  <Caption1 style={styles.arrow}>▲</Caption1>
                </TouchableOpacity>
                <H1 style={styles.timeText}>{pad(displayHours)}</H1>
                <TouchableOpacity onPress={decrementHours} style={styles.arrowBtn}>
                  <Caption1 style={styles.arrow}>▼</Caption1>
                </TouchableOpacity>
              </View>

              <H1 style={styles.colon}>:</H1>

              {/* Minutes */}
              <View style={styles.unitCol}>
                <TouchableOpacity onPress={incrementMinutes} style={styles.arrowBtn}>
                  <Caption1 style={styles.arrow}>▲</Caption1>
                </TouchableOpacity>
                <H1 style={styles.timeText}>{pad(displayMinutes)}</H1>
                <TouchableOpacity onPress={decrementMinutes} style={styles.arrowBtn}>
                  <Caption1 style={styles.arrow}>▼</Caption1>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Caption1 style={styles.cancelText}>Cancel</Caption1>
            </TouchableOpacity>
            <TouchableOpacity style={styles.okayBtn} onPress={handleConfirm}>
              <Caption1 style={styles.okayText}>Okay</Caption1>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(20),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: wp(24),
    paddingVertical: hp(24),
    width: '100%',
  },
  title: {
    textAlign: 'center',
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: hp(20),
  },

  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(20),
    marginBottom: hp(24),
  },

  // AM / PM
  periodCol: {
    gap: hp(8),
  },
  periodBtn: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  periodText: { color: '#888888', fontWeight: '600' },
  periodTextActive: { color: '#FFFFFF', fontWeight: '700' },

  // Time display
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  unitCol: {
    alignItems: 'center',
    gap: hp(4),
  },
  arrowBtn: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
  },
  arrow: { color: '#CCCCCC', fontSize: 12 },
  timeText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 48,
    lineHeight: 56,
  },
  colon: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 48,
    lineHeight: 56,
    marginTop: hp(-8),
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap: wp(12),
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp(14),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  cancelText: { color: '#333333', fontWeight: '500' },
  okayBtn: {
    flex: 1,
    paddingVertical: hp(14),
    borderRadius: 10,
    backgroundColor: Colors.BRAND_PRIMARY,
    alignItems: 'center',
  },
  okayText: { color: '#FFFFFF', fontWeight: '600' },
})