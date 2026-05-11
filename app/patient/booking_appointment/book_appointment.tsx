import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, Caption4, H6 } from '@/components/typo/Typography';
import { DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { getImageSource } from '@/utils/imageSource';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookAppointmentScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Book Appointment" />
      </View>

      <FlatList
        data={DOCTORS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id; 

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push({
                pathname: '/patient/doctors_info/doctor_details',
                params: { id: item.id }
              })}
            >
              <Image source={getImageSource(item.image)} style={styles.doctorImage} />
              <View style={styles.cardInfo}>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // ← card click prevent
                    setExpandedId(isExpanded ? null : item.id)
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.nameRow}>
                    <H6
                      style={styles.doctorName}
                      numberOfLines={isExpanded ? 0 : 1}
                    >
                      {item.name}
                    </H6>
                  </View>
                </TouchableOpacity>

                <View style={styles.timeBadge}>
                  <Caption4 style={styles.timeText} numberOfLines={1}>{item.time}</Caption4>
                </View>

                <Caption1 style={styles.specialty} numberOfLines={2}>{item.fullSpecialty}</Caption1>

              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(20)
  },
  header: {},
  listContent: {
    paddingBottom: hp(100),
    paddingTop: hp(20),
    gap: 14
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    overflow: 'hidden',
  },
  doctorImage: {
    width: wp(100),
    height: hp(100),
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
    gap: 6
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  doctorName: { color: Colors.BRAND_PRIMARY, flexShrink: 1 },
  timeBadge: {
    backgroundColor: Colors.ACCENT_YELLOW,
    alignSelf: 'flex-start',
    paddingHorizontal: wp(12),
    paddingVertical: hp(5),
    borderRadius: 20
  },
  timeText: { color: '#1A1A1A', fontWeight: '700' },
  specialty: { color: Colors.PLACEHOLLDER_TEXT, lineHeight: 18 },
});