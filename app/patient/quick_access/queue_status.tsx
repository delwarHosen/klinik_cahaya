import SectionTitle from '@/components/shared/SectionTitle';
import { Body1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
 
// ─── Fake Data ───────────────────────────────────────────────────────────────
 
const QUEUE_DATA = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    waiting: 1,
    served: 4,
    estimatedWait: '30 minutes',
  },
];
 
// ─── Component ───────────────────────────────────────────────────────────────
 
export default function QueueStatusScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Queue Status" />
      </View>
 
      <FlatList
        data={QUEUE_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Row label="Doctor:" value={item.doctorName} />
            <Row label="Waiting:" value={String(item.waiting)} />
            <Row label="Served:" value={String(item.served)} />
            <Row label="Estimated waiting time:" value={item.estimatedWait} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
 
// ─── Helper ──────────────────────────────────────────────────────────────────
 
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Body1 style={rowStyles.label}>{label}</Body1>
      <Body1 style={rowStyles.value}>{value}</Body1>
    </View>
  );
}
 
const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: hp(0),
  },
  label: {
    color: Colors.TEXT_COLOR,
    // fontWeight: '600',
  },
  value: {
    color:Colors.TEXT_COLOR,
  },
});
 
// ─── Styles ──────────────────────────────────────────────────────────────────
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(10),
  },
  listContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(30),
    gap: 14,
  },
  card: {
    borderWidth:1,
    borderColor:Colors.BORDER_COLOR,
    borderRadius: 16,
    padding: wp(16),
  },
});