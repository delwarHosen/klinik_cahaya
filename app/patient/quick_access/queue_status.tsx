import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, Caption2, H3, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetQueueQuery } from '@/redux/services/queueApi';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Traffic config — "traffic" field এর উপর নির্ভর করে ──────────────────────

function getTrafficConfig(traffic: string) {
  switch (traffic) {
    case 'light':
      return {
        color: Colors.SUCCESS_COLOR,
        bg: '#E8F5E9',
        border: '#A5D6A7',
        signalCount: 1,
      };
    case 'medium':
      return {
        color: '#FF9800',
        bg: '#FFF3E0',
        border: '#FFCC80',
        signalCount: 2,
      };
    case 'busy':
      return {
        color: '#F44336',
        bg: '#FFEBEE',
        border: '#EF9A9A',
        signalCount: 3,
      };
    default: // closed / unknown
      return {
        color: '#9E9E9E',
        bg: '#F5F5F5',
        border: '#E0E0E0',
        signalCount: 0,
      };
  }
}

// ─── Traffic Signal dots ──────────────────────────────────────────────────────

function TrafficSignal({ count, color }: { count: number; color: string }) {
  return (
    <View style={signal.row}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[signal.dot, { backgroundColor: i <= count ? color : '#E0E0E0' }]}
        />
      ))}
    </View>
  );
}

const signal = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function QueueStatusScreen() {
  const { data, isLoading, refetch, isFetching } = useGetQueueQuery(undefined);

  const totalWaiting = data?.totalWaiting ?? 0;
  const estimatedWait = data?.estimatedWaitMin ?? 0;
  const isOpen = data?.is_open ?? false;
  const traffic = data?.traffic ?? 'unknown';       // ← "light" | "medium" | "busy"
  const trafficLabelMs = data?.traffic_label_ms ?? '-';
  const trafficAdviceMs = data?.traffic_advice_ms ?? '';
  const doctors: any[] = data?.doctors ?? [];

  const config = getTrafficConfig(traffic);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <PageLoader visible title="LOADING" subtitle="Fetching queue status..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Queue Status" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[Colors.BRAND_PRIMARY]}
            tintColor={Colors.BRAND_PRIMARY}
          />
        }
      >

        {/* ── Traffic Status Card ── */}
        <View style={[styles.trafficCard, { backgroundColor: config.bg, borderColor: config.border }]}>
          <View style={styles.trafficTop}>
            <View style={styles.trafficLeft}>
              <H3 style={[styles.trafficLabel, { color: config.color }]}>{trafficLabelMs}</H3>
              <Caption1 style={[styles.trafficAdvice, { color: config.color }]}>{trafficAdviceMs}</Caption1>
            </View>
            <TrafficSignal count={config.signalCount} color={config.color} />
          </View>

          <View style={styles.trafficStats}>
            <View style={styles.statItem}>
              <H6 style={{ color: config.color }}>{totalWaiting}</H6>
              <Caption2 style={styles.statLabel}>Waiting</Caption2>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <H6 style={{ color: config.color }}>
                {estimatedWait === 0 ? 'Now' : `${estimatedWait} min`}
              </H6>
              <Caption2 style={styles.statLabel}>Est. Wait</Caption2>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <H6 style={{ color: config.color }}>{isOpen ? 'Open' : 'Closed'}</H6>
              <Caption2 style={styles.statLabel}>Status</Caption2>
            </View>
          </View>
        </View>

        {/* ── Doctors on Shift ── */}
        {doctors.length > 0 && (
          <View style={styles.doctorsSection}>
            <H6 style={styles.sectionTitle}>Doctors on Shift</H6>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.doctorsList}
            >
              {doctors.map((doctor: any) => (
                <View key={doctor.id} style={styles.doctorCard}>
                  <Image source={{ uri: doctor.avatar_url }} style={styles.doctorAvatar} />
                  <Caption1 style={styles.doctorName} numberOfLines={2}>{doctor.name}</Caption1>
                  <Caption2 style={styles.doctorSpec} numberOfLines={1}>{doctor.specialization}</Caption2>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: wp(20) },
  scrollContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(8),
    paddingBottom: hp(80),
    gap: hp(20),
  },
  trafficCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
    gap: hp(16),
  },
  trafficTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trafficLeft: { gap: 4 },
  trafficLabel: { fontWeight: '700' },
  trafficAdvice: { opacity: 0.8 },
  trafficStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: hp(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  statItem: { alignItems: 'center', gap: 4 },
  statLabel: { color: '#888888' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(0,0,0,0.08)' },
  doctorsSection: { gap: hp(12) },
  sectionTitle: { color: '#1A1A1A', fontWeight: '700' },
  doctorsList: { gap: wp(12), paddingBottom: hp(4) },
  doctorCard: {
    width: wp(100),
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: hp(14),
    paddingHorizontal: wp(8),
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
  },
  doctorAvatar: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    backgroundColor: '#E0E0E0',
  },
  doctorName: { color: Colors.BRAND_PRIMARY, fontWeight: '600', textAlign: 'center' },
  doctorSpec: { color: '#888888', textAlign: 'center', fontSize: 10 },
});