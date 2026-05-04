// components/appointment/BookingConfirmedModal.tsx
import { SuccessVerifyIcon } from '@/assets/icons/common_icon/SuccessVerifyIcon'
import { H6 } from '@/components/typo/Typography'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  doctorName?: string 
}


export function BookingConfirmedModal({ visible, onClose, doctorName }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.card}>
          <SuccessVerifyIcon />
          <H6 style={[styles.title, { marginTop: hp(8) }]}>
            Booking Has Been Confirmed {doctorName ? `with ${doctorName}` : ''}
          </H6>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}
// ... rest of your styles

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
})