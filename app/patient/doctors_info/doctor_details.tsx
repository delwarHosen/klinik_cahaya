import { CustomButton } from '@/components/shared/CustomButton';
import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, H3, SpecialText } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { useGetDoctorByIdQuery } from '@/redux/services/doctorsApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DoctorDetailsScreen() {
  const router = useRouter();
  const { id, doctorId } = useLocalSearchParams<{ id: string; doctorId: string }>();
  const resolvedId = doctorId ?? id;

  const { data, isLoading, refetch } = useGetDoctorByIdQuery(resolvedId);
  const { refreshing, onRefresh } = useRefresh([refetch]);
  const doctor = data?.data ?? data;

  const specialties =
    typeof doctor?.specialties === 'string'
      ? doctor.specialties.split('|')
      : doctor?.specialties ?? [];

  const consultationDays = doctor?.consultation_days ?? '';
  const consultationTime = doctor?.consultation_time ?? '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <PageLoader visible={isLoading} title="LOADING" subtitle="Loading doctor details..." />

      <SectionTitle title="Doctor Details" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.BRAND_PRIMARY]}
            tintColor={Colors.BRAND_PRIMARY}
          />
        }
      >
        {!isLoading && doctor && (
          <>
            {/* Doctor Card */}
            <View style={styles.profileRow}>
              <Image source={{ uri: doctor.avatar_url }} style={styles.doctorImage} />
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <H3 style={styles.doctorName} numberOfLines={1}>
                    {doctor.name}
                  </H3>
                </View>
                <Caption1 style={styles.specialty}>{doctor.specialization}</Caption1>
              </View>
            </View>

            {/* Consultation Time */}
            <SpecialText style={styles.sectionTitle}>
              Appointment Consultation Time
            </SpecialText>
            <View style={styles.timeRow}>
              <View style={styles.timeDot} />
              <View>
                <Caption1 style={styles.timeText}>{consultationDays}</Caption1>
                <Caption1 style={styles.timeText}>{consultationTime}</Caption1>
              </View>
            </View>

            {/* About */}
            <SpecialText style={styles.sectionTitle}>About</SpecialText>
            <Caption1 style={styles.aboutText}>{doctor.about}</Caption1>

            {/* Services */}
            <SpecialText style={styles.sectionTitle}>Services</SpecialText>
            {specialties.map((service: string, index: number) => (
              <View key={index} style={styles.serviceRow}>
                <View style={styles.bullet} />
                <Caption1 style={styles.serviceText}>{service}</Caption1>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      {!isLoading && doctor && (
        <View style={styles.bottomBar}>
          <CustomButton
            title="Book Appointment"
            height={54}
            width="100%"
            borderRadius={16}
            onPress={() =>
              router.push({
                pathname: '/patient/doctors_info/information' as any,
                params: {
                  id: resolvedId,
                  consultationTime,
                },
              })
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(20),
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: hp(20),
    paddingBottom: hp(30),
  },
  profileRow: {
    flexDirection: 'row',
    gap: wp(14),
    alignItems: 'flex-start',
    marginBottom: hp(24),
  },
  doctorImage: {
    width: wp(100),
    height: hp(100),
    backgroundColor: '#dfefee',
    borderWidth: 1,
    borderColor: '#dbf0ef',
    borderRadius: 16,
  },
  profileInfo: { flex: 1, gap: 6 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    marginTop: hp(-15),
  },
  specialty: { color: '#888888', lineHeight: 20 },
  sectionTitle: {
    color: '#1A1A1A',
    marginTop: hp(20),
    marginBottom: hp(20),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(12),
  },
  timeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: Colors.ACCENT_YELLOW,
    marginTop: hp(10),
  },
  timeText: { color: Colors.TEXT_COLOR, marginBottom: 2 },
  aboutText: { color: '#0D0D0D', lineHeight: 22 },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    marginBottom: hp(8),
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  serviceText: { color: '#0D0D0D' },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_COLOR,
    paddingTop: hp(12),
    paddingBottom: hp(12),
    marginHorizontal: wp(-20),
    paddingHorizontal: wp(20),
  },
});