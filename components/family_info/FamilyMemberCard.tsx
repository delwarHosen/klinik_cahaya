import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { Body3, Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { FamilyMember } from '@/types/familyTypes'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'


interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: () => void
}

export default function FamilyMemberCard({ member, onEdit }: FamilyMemberCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Body3 color="#1A1A1A" weight="semiBold" style={{ marginBottom: 5 }}>
          {member.member_name || '-'}
        </Body3>
        <Caption1 color="#00000080">IC: {member.ic_number || '-'}</Caption1>
        <Caption1 color="#00000080">DOB: {member.date_of_birth || '-'}</Caption1>
        <Caption1 color="#00000080">Relationship: {member.relationship || '-'}</Caption1>
        {member.gender ? (
          <Caption1 color="#00000080">Gender: {member.gender}</Caption1>
        ) : null}
      </View>
      <TouchableOpacity onPress={onEdit}>
        <EditIcon size={18} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: wp(16),
    marginBottom: hp(12),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    backgroundColor: '#FFFFFF',
  },
  info: { gap: 2, flex: 1 },
})