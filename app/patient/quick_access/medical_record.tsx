import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 
// ─── Fake Data ───────────────────────────────────────────────────────────────
 
const PERSONAL_RECORDS = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'My Self',
    dateTime: '09:30 | May 05, 2026 (Tuesday)',
  },
  {
    id: '2',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'My Self',
    dateTime: '11:00 | May 12, 2026 (Tuesday)',
  },
  {
    id: '3',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'My Self',
    dateTime: '18:00 | May 24, 2026 (Sunday)',
  },
];
 
const FAMILY_RECORDS = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'Hakim',
    dateTime: '08:00 | May 03, 2026 (Sunday)',
  },
  {
    id: '2',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'Hakim',
    dateTime: '10:15 | May 15, 2026 (Friday)',
  },
  {
    id: '3',
    doctorName: 'Dr. Anis Effendi',
    specialty: 'GENERAL PRACTITIONER Primary Care for Adults & C...',
    patient: 'Hakim',
    dateTime: '16:45 | May 28, 2026 (Thursday)',
  },
];
 
type TabType = 'personal' | 'family';
 
// ─── Component ───────────────────────────────────────────────────────────────
 
export default function MedicalRecordScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
 
  const records = activeTab === 'personal' ? PERSONAL_RECORDS : FAMILY_RECORDS;
 
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <SectionTitle title="Medical Record" />
      </View>
 
      {/* ── Tab Toggle ── */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'personal' && styles.tabBtnActive]}
          onPress={() => setActiveTab('personal')}
          activeOpacity={0.85}
        >
          <Caption2
            style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}
          >
            Personal
          </Caption2>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'family' && styles.tabBtnActive]}
          onPress={() => setActiveTab('family')}
          activeOpacity={0.85}
        >
          <Caption2
            style={[styles.tabText, activeTab === 'family' && styles.tabTextActive]}
          >
            Family
          </Caption2>
        </TouchableOpacity>
      </View>
 
      {/* ── Records List ── */}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <H6 style={styles.doctorName}>{item.doctorName}</H6>
            <Caption2 style={styles.specialty} numberOfLines={1}>{item.specialty}</Caption2>
            <View style={styles.divider} />
            <Caption2 style={styles.patientName}>{item.patient}</Caption2>
            <Body4 style={styles.dateTime}>{item.dateTime}</Body4>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
 
// ─── Styles ──────────────────────────────────────────────────────────────────
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
     paddingHorizontal: wp(20)
  },
  header: {
    
  },
 
  // ── Tab Toggle
  tabContainer: {
    flexDirection: 'row',
    // marginHorizontal: wp(20),
    marginTop: hp(16),
    marginBottom: hp(4),
    // backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 4,
    gap:5
  },
  tabBtn: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor:"#F6F6F6"
  },
  tabBtnActive: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  tabText: {
    color: '#888888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
 
  // ── List
  listContent: {
    // paddingHorizontal: wp(20),
    paddingTop: hp(14),
    paddingBottom: hp(30),
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp(16),
    borderWidth:1,
    borderColor:Colors.BORDER_COLOR,
    gap: 4,
  },
  doctorName: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  specialty: {
    color: '#818181',
    // fontSize: 11,
    textTransform: 'uppercase',
  },
  divider: {
    // height: 1,
    // backgroundColor: '#F0F0F0',
    marginVertical: hp(6),
  },
  patientName: {
    color: '#818181',
    fontWeight: '600',
  },
  dateTime: {
    color: '#00000080',
  },
});