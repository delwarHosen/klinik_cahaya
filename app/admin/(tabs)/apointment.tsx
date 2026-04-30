import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption2, Caption4 } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Tab = 'Upcoming' | 'Completed' | 'Canceled'
const TABS: Tab[] = ['Upcoming', 'Completed', 'Canceled']

export default function AdminAppointmentScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ activeTab: string }>();
  const [activeTab, setActiveTab] = useState(params.activeTab || 'Upcoming');

  const data = ADMIN_APPOINTMENTS.filter(a => {
    if (activeTab === 'Upcoming') return a.status === 'Upcoming'
    if (activeTab === 'Completed') return a.status === 'Completed'
    return a.status === 'Canceled'
  })

  useEffect(() => {
    if (params.activeTab) {
      setActiveTab(params.activeTab);
    }
  }, [params.activeTab]);
  

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Appointments" showBackButton={false} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Caption1 style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Caption1>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: hp(10) }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/admin/appointments/appointment_details' as any,
                params: { id: item.id },
              })
            }
          >
            {/* Left — doctor name + time */}
            <View style={styles.cardLeft}>
              <Caption1
                weight='semiBold'
                style={[
                  styles.doctorName,
                ]}
                numberOfLines={1}
              >
                {item.doctorName}
              </Caption1>
              <Caption4
                style={[
                  styles.meta,
                  item.status === 'Canceled' && { color: '#E57373' },
                ]}
              >
                {item.time} | {item.displayDate}
              </Caption4>
            </View>

            {/* Vertical divider */}
            <View style={styles.verticalDivider} />

            {/* Right — patient */}
            <View style={styles.cardRight}>
              <Caption4 style={styles.patientLabel}>Patient</Caption4>
              <Caption2 style={styles.patientName} numberOfLines={1}>
                {item.patientName}
              </Caption2>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Caption1 style={{ color: '#aaa' }}>No appointments found.</Caption1>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  header: {
    paddingTop: hp(10),
    paddingBottom: hp(20),
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: hp(16),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(10),
    borderRadius: 9,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.BRAND_PRIMARY },
  tabText: { color: '#555555', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '700' },

  // List
  listContent: {
    paddingBottom: hp(120),
  },

  // Card — same as home upcoming inner card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.APP_BACKGROUND,
    paddingVertical: hp(15),
  },
  cardLeft: {
    flex: 1,
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.BORDER_COLOR,
  },
  cardRight: {
    width: wp(130),
    paddingHorizontal: wp(14),
    paddingVertical: hp(12),
    alignItems: 'flex-end',
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
    marginBottom: hp(5),
  },
  meta: {
    color: '#666666',
    marginTop: 3,
  },
  patientLabel: {
    color: '#666666',
    marginBottom: hp(8),
  },
  patientName: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
    textAlign: 'right',
  },

  empty: { marginTop: hp(60), alignItems: 'center' },
})