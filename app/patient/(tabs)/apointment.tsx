import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body2, Caption1, Caption3, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetAppointmentsByPhoneQuery } from '@/redux/services/appointmentsApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: replace with actual logged-in user's phone from auth context
const PATIENT_PHONE = '60179224970';

type TabType = 'Upcoming' | 'Completed' | 'Canceled';

function mapStatus(apiStatus: string): string {
  switch (apiStatus) {
    case 'received': return 'Upcoming';
    case 'confirmed': return 'Upcoming';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Canceled';
    default: return 'Upcoming';
  }
}

export default function AppointmentScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const router = useRouter();

  const { data, isLoading } = useGetAppointmentsByPhoneQuery(PATIENT_PHONE);
  const appointments = data?.appointments ?? [];

  const filteredData = appointments.filter((item: any) => {
    const mapped = mapStatus(item.status);
    return mapped === activeTab;
  });

  return (
    <SafeAreaView style={styles.container}>
      <PageLoader visible={isLoading} title="LOADING" subtitle="Fetching your appointments..." />

      <SectionTitle title="Appointments" />

      <View style={styles.tabContainer}>
        {(['Upcoming', 'Completed', 'Canceled'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Caption1 weight="medium" color={activeTab === tab ? Colors.TEXT_WHITE : '#666'}>
              {tab}
            </Caption1>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: { item: any }) => {
          const mapped = mapStatus(item.status);
          const dateObj = new Date(item.start);
          const date = dateObj.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });
          const time = dateObj.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
          const serviceName = item.services?.[0]?.name ?? '-';

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/patient/booking_appointment/appointment_details' as any,
                params: { appointmentId: item.id },
              })}
            >
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <H6 color={Colors.TEXT_COLOR}>{item.provider?.name}</H6>
                  <Caption3 color="#818181" numberOfLines={1} style={{ marginTop: 5 }}>
                    {serviceName}
                  </Caption3>
                  <View style={styles.infoRow}>
                    <Body2 color="#0D0D0D" style={{ marginTop: hp(8) }} weight="regular">
                      {item.lead?.name}
                    </Body2>
                    <Body1 weight="semiBold" color={Colors.TEXT_COLOR} numberOfLines={1}>
                      {time} | {date}
                    </Body1>
                  </View>
                </View>

                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusBg(mapped),
                    borderWidth: (mapped === 'Completed' || mapped === 'Canceled') ? 1 : 0,
                    borderColor: getStatusBorderColor(mapped),
                  }
                ]}>
                  <Caption1 weight="regular" color={getStatusTextColor(mapped)}>
                    {mapped}
                  </Caption1>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Caption1 color="#999">No {activeTab} Appointments Found</Caption1>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const getStatusBg = (s: string) => {
  if (s === 'Upcoming') return Colors.ACCENT_YELLOW;
  if (s === 'Completed') return 'transparent';
  if (s === 'Canceled') return 'transparent';
  return '#F0F0F0';
};

const getStatusBorderColor = (s: string) => {
  if (s === 'Completed') return Colors.BRAND_PRIMARY;
  if (s === 'Canceled') return Colors.COLOR_DANGER;
  return 'transparent';
};

const getStatusTextColor = (s: string) => {
  if (s === 'Upcoming') return '#000';
  if (s === 'Completed') return Colors.BRAND_PRIMARY;
  if (s === 'Canceled') return Colors.COLOR_DANGER;
  return '#666';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: hp(10),
    gap: 5,
    borderRadius: 12,
    padding: 4,
    marginBottom: hp(20),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(12),
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
  },
  activeTab: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  listContent: {
    paddingBottom: hp(20),
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: wp(10),
    paddingVertical: hp(10),
    marginBottom: hp(16),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    marginTop: hp(5),
  },
  statusBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: 8,
    minWidth: wp(80),
    alignItems: 'center',
    marginLeft: wp(10),
  },
  emptyState: {
    alignItems: 'center',
    marginTop: hp(100),
  },
});