import { Caption1, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return dateStr }
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return 'N/A'
  try {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 || 12}:${m} ${ampm}`
  } catch { return timeStr }
}

interface RescheduleReasonModalProps {
  visible: boolean
  date: string
  time: string
  onBack: () => void
  onConfirm: (reason: string) => void
  isLoading: boolean
}

export function RescheduleReasonModal({
  visible,
  date,
  time,
  onBack,
  onConfirm,
  isLoading,
}: RescheduleReasonModalProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason.trim() || `Rescheduled to ${date} at ${formatTime(time)}`)
    setReason('')
  }

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <H6 style={styles.title}>Reschedule Reason</H6>
          <Caption2 style={styles.subtitle}>
            {formatDate(date)}  ·  {formatTime(time)}
          </Caption2>

          <Caption1 style={styles.label}>Message to patient (optional)</Caption1>
          <TextInput
            style={styles.input}
            placeholder="e.g. The doctor is available after 10:00 AM on this date."
            placeholderTextColor="#AAAAAA"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onBack} disabled={isLoading}>
              <Caption1 style={styles.cancelText}>Back</Caption1>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.okBtn, isLoading && styles.okBtnDisabled]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading
                ? <ActivityIndicator color="#FFF" size="small" />
                : <Caption1 style={styles.okText}>Confirm</Caption1>
              }
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: wp(20),
    paddingTop: hp(24),
    paddingBottom: hp(20),
    width: '100%',
  },
  title: {
    textAlign: 'center',
    color: Colors.BRAND_PRIMARY,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: hp(4),
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: hp(20),
  },
  label: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    marginBottom: hp(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
    fontSize: 13,
    color: '#333',
    minHeight: hp(100),
    textAlignVertical: 'top',
    marginBottom: hp(20),
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Poppins_400Regular',
  },
  btnRow: { flexDirection: 'row', gap: wp(12) },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 100,
    paddingVertical: hp(14),
    alignItems: 'center',
  },
  cancelText: { color: '#333', fontWeight: '500' },
  okBtn: {
    flex: 1,
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 100,
    paddingVertical: hp(14),
    alignItems: 'center',
  },
  okText: { color: '#FFF', fontWeight: '600' },
  okBtnDisabled: { opacity: 0.5 },
})