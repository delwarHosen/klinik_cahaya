import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { FamilyMember } from '@/types/familyTypes'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface FamilyMemberCardProps {
  member: FamilyMember
  onEdit: () => void
}

export default function FamilyMemberCard({ member, onEdit }: FamilyMemberCardProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <H6 color="#1A1A1A">{member.member_name || '-'}</H6>
        <Caption2 color="#666666" style={{ marginTop: hp(4) }}>
          {member.relationship || '-'} · {member.gender || '-'}
        </Caption2>
        {member.date_of_birth ? (
          <Caption2 color="#999999" style={{ marginTop: hp(2) }}>
            {member.date_of_birth}
          </Caption2>
        ) : null}
      </View>
      <TouchableOpacity onPress={onEdit} activeOpacity={0.75} style={styles.editBtn}>
        <EditIcon size={18} color={Colors.BRAND_PRIMARY} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    marginBottom: hp(10),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  info: {
    flex: 1,
    marginRight: wp(12),
  },
  editBtn: {
    padding: 6,
  },
})