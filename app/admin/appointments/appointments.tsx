// app/admin/appointments/index.tsx
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption4 } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Tab = 'Upcoming' | 'Completed' | 'Canceled'
const TABS: Tab[] = ['Upcoming', 'Completed', 'Canceled']

export default function AdminAppointmentsScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Upcoming')

  const data = ADMIN_APPOINTMENTS.filter(a => {
    if (activeTab === 'Upcoming') return a.status === 'Upcoming'
    if (activeTab === 'Completed') return a.status === 'Completed'
    return a.status === 'Canceled'
  })

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Appointments" />
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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/admin/appointments/appointment_details' as any, params: { id: item.id } })}
          >
            <View style={styles.cardLeft}>
              <Caption1 style={[
                styles.doctorName,
                item.status === 'Canceled' && { color: '#E53935' }
              ]}>
                {item.doctorName}
              </Caption1>
              <Caption4 style={[
                styles.meta,
                item.status === 'Canceled' && { color: '#E57373' }
              ]}>
                {item.time} | {item.displayDate}
              </Caption4>
            </View>
            <View style={styles.cardRight}>
              <Caption4 style={styles.patientLabel}>Patient</Caption4>
              <Caption1 style={styles.patientName} numberOfLines={1}>{item.patientName}</Caption1>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: wp(20) },
  tabRow: {
    flexDirection: 'row', paddingHorizontal: wp(20),
    gap: 10, marginBottom: hp(8),
  },
  tab: {
    flex: 1, paddingVertical: hp(10),
    borderRadius: 10, backgroundColor: '#F2F2F2', alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.BRAND_PRIMARY },
  tabText: { color: '#555', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#FFFFFF', fontWeight: '700' },
  listContent: { paddingHorizontal: wp(20), paddingBottom: hp(40) },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: hp(16),
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  doctorName: { color: Colors.BRAND_PRIMARY, fontWeight: '600', fontSize: 13 },
  meta: { color: '#888', fontSize: 11, marginTop: 2 },
  patientLabel: { color: '#AAAAAA', fontSize: 10 },
  patientName: { color: '#1A1A1A', fontWeight: '600', fontSize: 13 },
  empty: { marginTop: hp(60), alignItems: 'center' },
})