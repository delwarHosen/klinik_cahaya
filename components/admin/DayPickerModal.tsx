// components/admin/DayPickerModal.tsx
import { Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Props {
  visible: boolean
  selectedDays: string[]
  onClose: () => void
  onConfirm: (days: string[]) => void
}

export function DayPickerModal({ visible, selectedDays, onClose, onConfirm }: Props) {
  const [localDays, setLocalDays] = useState<string[]>(selectedDays)

  const toggle = (day: string) => {
    setLocalDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {DAYS.map(day => (
            <TouchableOpacity
              key={day}
              style={styles.dayRow}
              onPress={() => toggle(day)}
              activeOpacity={0.7}
            >
              <Caption1 style={styles.dayText}>{day}</Caption1>
              <View style={[styles.radio, localDays.includes(day) && styles.radioSelected]}>
                {localDays.includes(day) && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Caption1 style={{ color: '#333' }}>Cancel</Caption1>
            </TouchableOpacity>
            <TouchableOpacity style={styles.okayBtn} onPress={() => onConfirm(localDays)}>
              <Caption1 style={{ color: '#fff' }}>Okay</Caption1>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: wp(20),
    width: '100%',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  dayText: { color: '#1A1A1A' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#CCC',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.BRAND_PRIMARY },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.BRAND_PRIMARY },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: hp(16) },
  cancelBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    borderWidth: 1, borderColor: '#CCC', alignItems: 'center',
  },
  okayBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    backgroundColor: Colors.BRAND_PRIMARY, alignItems: 'center',
  },
})