import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, Caption4, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetDoctorsQuery } from '@/redux/services/doctorsApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookAppointmentScreen() {
  const router = useRouter();
  const { data: doctorsData, isLoading, refetch, isFetching } = useGetDoctorsQuery(undefined);
  const doctors = doctorsData?.data ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="General" />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
           <PageLoader visible={isLoading} title="LOADING" subtitle="" />
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[Colors.BRAND_PRIMARY]}
              tintColor={Colors.BRAND_PRIMARY}
            />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push({
                pathname: '/patient/doctors_info/doctor_details',
                params: { doctorId: item.id },
              })}

            >
              <Image source={{ uri: item.avatar_url }} style={styles.doctorImage} />
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <H6 style={styles.doctorName} numberOfLines={1}>{item.name}</H6>
                </View>

                <View style={styles.timeBadge}>
                  <Caption4 style={styles.timeText} numberOfLines={1}>
                    {item.consultation_time}
                  </Caption4>
                </View>

                <Caption1 style={styles.specialty} numberOfLines={2}>
                  {item.specialization}
                </Caption1>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(20),
  },
  header: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: hp(100),
    paddingTop: hp(20),
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    overflow: 'hidden',
    paddingBottom: hp(10),
  },
  doctorImage: {
    width: wp(100),
    height: hp(120),
    backgroundColor: '#dfefee',
    borderWidth: 1,
    borderColor: '#dbf0ef',
    borderRadius: 16,
    marginLeft: wp(10),
    marginTop: hp(10),
  },
  cardInfo: {
    flex: 1,
    paddingVertical: wp(12),
    paddingHorizontal: hp(12),
    justifyContent: 'center',
    gap: 6,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  doctorName: { color: Colors.BRAND_PRIMARY, flexShrink: 1 },
  timeBadge: {
    backgroundColor: Colors.ACCENT_YELLOW,
    alignSelf: 'flex-start',
    paddingHorizontal: wp(12),
    paddingVertical: hp(5),
    borderRadius: 20,
  },
  timeText: { color: '#1A1A1A', fontWeight: '700' },
  specialty: { color: Colors.PLACEHOLLDER_TEXT, lineHeight: 18 },
});