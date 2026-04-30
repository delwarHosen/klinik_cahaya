// components/appointment/RejectReasonModal.tsx
import { CustomButton } from '@/components/shared/CustomButton'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { Modal, StyleSheet, TextInput, View } from 'react-native'

interface Props {
  visible: boolean
  onCancel: () => void
  onSave: (reason: string) => void
}

export function RejectReasonModal({ visible, onCancel, onSave }: Props) {
  const [reason, setReason] = useState('')

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.reasonBox}>
            <TextInput
              placeholder="Write here the reason"
              placeholderTextColor="#AAAAAA"
              value={reason}
              onChangeText={setReason}
              multiline
              style={styles.reasonInput}
            />
          </View>
          <View style={styles.btnRow}>
            <CustomButton
              title='Cancel'
              onPress={onCancel}
              width={"48%"}
              height={44}
              backgroundColor={Colors.APP_BACKGROUND}
              borderColor={Colors.BORDER_COLOR}
              borderRadius={12}
              color={Colors.TEXT_COLOR}
            />
            <CustomButton
              title='Save'
              onPress={() => onSave(reason)}
              backgroundColor={Colors.BRAND_PRIMARY}
              borderRadius={12}
              width={"48%"}
              height={44}
            />
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
  btnRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: hp(4) },
  reasonBox: {
    width: '100%', borderWidth: 1, borderColor: '#EEEEEE',
    borderRadius: 12, padding: wp(14), minHeight: hp(120),
  },
  reasonInput: {
    fontSize: 14, color: '#333',
    fontFamily: 'Poppins_400Regular', lineHeight: 22,
  },
})