// components/appointment/ExpandableSection.tsx
import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon'
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon'
import { Caption1, Caption2 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
}

export function ExpandableSection({ title, children }: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.8}
      >
        <Caption1 style={styles.title}>{title}</Caption1>
        <Caption2 weight='semiBold' color={Colors.TEXT_COLOR}>
          {expanded ? <UpArrowIcon /> : <DownArrowIcon />}
        </Caption2>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  )
}

interface InfoRowProps {
  label: string
  value: string
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Caption1 weight='medium'>{label}</Caption1>
      <Caption1 style={styles.value}>{value}</Caption1>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE',
    marginTop: hp(12), overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(16), paddingVertical: hp(16),
  },
  title: { fontWeight: '700', color: Colors.TEXT_COLOR },
  content: { paddingHorizontal: wp(16), paddingBottom: hp(14), gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  value: { color: Colors.PLACEHOLLDER_TEXT, flex: 1, textAlign: 'right' },
})