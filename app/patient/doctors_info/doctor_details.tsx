import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, H3, SpecialText } from '@/components/typo/Typography';
import { DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { getImageSource } from '@/utils/imageSource';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DoctorDetailsScreen() {
  const router = useRouter();

  
  const { id, doctorId } = useLocalSearchParams<{ id: string; doctorId: string }>();
  const DOCTOR = DOCTORS.find((d) => d.id === (doctorId ?? id)) ?? DOCTORS[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      <View>
        <SectionTitle title="Doctor Details" />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Doctor Card */}
        <View style={styles.profileRow}>
          <Image source={getImageSource(DOCTOR.image)} style={styles.doctorImage} />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <H3 style={styles.doctorName} numberOfLines={1}>{DOCTOR.name}</H3>
            </View>
            <Caption1 style={styles.specialty}>{DOCTOR.fullSpecialty}</Caption1>
          </View>
        </View>

        {/* Consultation Time */}
        <SpecialText style={styles.sectionTitle}>Appointment Consultation Time</SpecialText>
        <View style={styles.timeRow}>
          <View style={styles.timeDot} />
          <View>
            <Caption1 style={styles.timeText}>{DOCTOR.consultationDays}</Caption1>
            <Caption1 style={styles.timeText}>{DOCTOR.consultationTime}</Caption1>
          </View>
        </View>

        {/* About */}
        <SpecialText style={styles.sectionTitle}>About</SpecialText>
        <Caption1 style={styles.aboutText}>{DOCTOR.about}</Caption1>

        {/* Services */}
        <SpecialText style={styles.sectionTitle}>Services</SpecialText>
        {DOCTOR.services.map((service, index) => (
          <View key={index} style={styles.serviceRow}>
            <View style={styles.bullet} />
            <Caption1 style={styles.serviceText}>{service}</Caption1>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <CustomButton
          title='Book Appointment'
          height={54}
          width={"100%"}
          borderRadius={16}
          onPress={() => router.push("/patient/doctors_info/information")}
        />
      </View>

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
    borderColor: "#dbf0ef",
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
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 3, borderColor: Colors.ACCENT_YELLOW,
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
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.BRAND_PRIMARY,
  },
  serviceText: { color: '#0D0D0D' },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_COLOR,
    paddingTop: hp(12),
    paddingBottom: hp(24),
    paddingHorizontal: wp(20),
    marginHorizontal: wp(-20),
    marginBottom: hp(30),
  },
});