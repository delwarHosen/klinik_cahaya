import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body2, Caption1, Caption3, H6 } from '@/components/typo/Typography';
import { APPOINTMENTS_DATA } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'Upcoming' | 'Completed' | 'Canceled';

export default function AppointmentScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const router = useRouter();

  const filteredData = APPOINTMENTS_DATA.filter(item => {
    if (activeTab === 'Upcoming') return item.status === 'Pending' || item.status === 'Accepted';
    if (activeTab === 'Completed') return item.status === 'Completed';
    if (activeTab === 'Canceled') return item.status === 'Canceled';
    return true;
  });

  const renderAppointmentCard = ({ item }: { item: typeof APPOINTMENTS_DATA[0] }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: "/patient/booking_appointment/appointment_details",
        params: { appointmentId: item.id }
      })}
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <H6 color={Colors.TEXT_COLOR} >{item.doctorName}</H6>
          <Caption3 color="#818181" numberOfLines={1} style={{ marginTop: 5 }}>{item.specialty}</Caption3>

          <View style={styles.infoRow}>
            <Body2 color="#0D0D0D" style={{ marginTop: hp(8) }} weight='regular'>{item.patientName}</Body2>
            <Body1 weight="semiBold" color={Colors.TEXT_COLOR} numberOfLines={1}>
              {item.time} | {item.date}
            </Body1>
          </View>
        </View>

        <View style={[
          styles.statusBadge,
          {
            backgroundColor: getStatusBg(item.status),
            borderWidth: (item.status === 'Completed' || item.status === 'Canceled') ? 1 : 0,
            borderColor: getStatusBorderColor(item.status)
          }
        ]}>
          <Caption1 weight="regular" color={getStatusTextColor(item.status)}>
            {item.status}
          </Caption1>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <SectionTitle title='Appointment' />
      </View>

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
        keyExtractor={(item) => item.id}
        renderItem={renderAppointmentCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Caption1 color="#999">No {activeTab} Appointments Found</Caption1>
          </View>
        }
      />
    </SafeAreaView>
  );
}




const getStatusBg = (status: string) => {
  switch (status) {
    case 'Pending': return Colors.ACCENT_YELLOW;
    case 'Accepted': return Colors.BRAND_PRIMARY;
    case 'Completed': return 'transparent'; // ব্যাকগ্রাউন্ড নেই
    case 'Canceled': return 'transparent';  // ব্যাকগ্রাউন্ড নেই
    default: return '#F0F0F0';
  }
};

// বর্ডার কালারের জন্য নতুন একটি ফাংশন
const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'Completed': return Colors.SUCCESS_COLOR;
    case 'Canceled': return Colors.COLOR_DANGER;
    default: return 'transparent'; // অন্যদের জন্য বর্ডার নেই
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'Pending': return '#000';
    case 'Accepted': return Colors.TEXT_WHITE;
    case 'Completed': return Colors.SUCCESS_COLOR;
    case 'Canceled': return Colors.COLOR_DANGER;
    default: return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20)
  },



  tabContainer: {
    flexDirection: 'row',
    // backgroundColor: '#F5F5F5',
    marginTop:hp(10),
    gap: 5,
    borderRadius: 12,
    padding: 4,
    marginBottom: hp(20),
  },

  tab: {
    flex: 1,
    paddingVertical: hp(10),
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "#F6F6F6",


  },

  activeTab: {
    backgroundColor: Colors.BRAND_PRIMARY,
  },

  listContent: {
    // paddingHorizontal: wp(20),
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
    marginLeft: wp(10)
  },

  emptyState: {
    alignItems: 'center',
    marginTop: hp(100),
  },
});