import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body3, Caption1, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface FamilyMember {
  id: string
  name: string
  ic: string
  dob: string
  relationship: string
}

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Razak bin Osman', ic: '900101-14-5677', dob: '10 January 1997', relationship: 'Brother' },
  { id: '2', name: 'Aisyah binti Musa', ic: '900101-14-5645', dob: '10 January 1994', relationship: 'Sister' },
]

export default function FamilyInformationScreen() {
  const [members] = useState<FamilyMember[]>(INITIAL_MEMBERS)
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Family Information" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {members.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Body3 color="#1A1A1A" weight="semiBold" style={{ marginBottom: 5 }}>
                {member.name}
              </Body3>
              <Caption1 color="#00000080">{member.ic}</Caption1>
              <Caption1 color="#00000080">{member.dob}</Caption1>
              <Caption1 color="#00000080">{member.relationship}</Caption1>
            </View>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/patient/profile/edit_family_info',
                params: {
                  id: member.id,
                  name: member.name,
                  ic: member.ic,
                  dob: member.dob,
                  relationship: member.relationship,
                }
              })}
            >
              <EditIcon size={18} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Button */}
        <View style={styles.addBtnRow}>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/patient/profile/add_family_member')}
          >
            <H6 color={Colors.BRAND_PRIMARY} style={{ fontSize: 22 }}>+</H6>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  scrollContent: {
    paddingBottom: hp(40),
    paddingTop: hp(10),
  },
  memberCard: {
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
  memberInfo: { gap: 2 },
  addBtnRow: {
    alignItems: 'flex-end',
    marginTop: hp(8),
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.BRAND_PRIMARY,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
})