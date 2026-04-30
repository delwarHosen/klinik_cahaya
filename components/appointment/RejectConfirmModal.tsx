// components/appointment/RejectConfirmModal.tsx
import { WarningIcon } from '@/assets/icons/common_icon/WarningIcon'
import { Caption1, H6 } from '@/components/typo/Typography'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

interface Props {
  visible: boolean
  onCancel: () => void
  onReject: () => void
}

export function RejectConfirmModal({ visible, onCancel, onReject }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <WarningIcon />
          <H6 style={styles.title}>Are You Sure</H6>
          <Caption1 style={styles.subtitle}>
            Do You Want To{' '}
            <Caption1 style={{ color: '#FF383C', fontWeight: '700' }}>Reject</Caption1>{' '}
            This Request
          </Caption1>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Caption1 style={{ color: '#1A1A1A', fontWeight: '600' }}>Cancel</Caption1>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
              <Caption1 style={{ color: '#FF383C', fontWeight: '700' }}>Reject</Caption1>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center', padding: wp(30),
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: wp(24), width: '100%', alignItems: 'center', gap: 12,
  },
  title: { fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  subtitle: { color: '#555', textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: hp(4) },
  cancelBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    borderWidth: 1, borderColor: '#EEEEEE', alignItems: 'center',
  },
  rejectBtn: {
    flex: 1, paddingVertical: hp(14), borderRadius: 10,
    borderWidth: 1.5, borderColor: '#FFCDD2', backgroundColor: '#FFF5F5', alignItems: 'center',
  },
})