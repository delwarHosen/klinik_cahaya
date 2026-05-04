import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1 } from '@/components/typo/Typography';
import { DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRAFFIC_LEVELS = ['Light', 'Moderate', 'Busy'];

const TRAFFIC_COLOR: Record<string, string> = {
  Light: '#4CAF50',
  Moderate: '#FF9800',
  Busy: '#F44336',
};


const QUEUE_DATA = DOCTORS.map((doc, index) => ({
  id: doc.id,
  doctorName: doc.name,
  traffic: TRAFFIC_LEVELS[index % TRAFFIC_LEVELS.length],
  estimatedWait: '30 minutes',
}));

export default function QueueStatusScreen() {
  const router = useRouter();

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
            {/* Doctor */}
            <View style={styles.row}>
              <Caption1 weight='medium' style={styles.label}>Doctor: </Caption1>
              <Caption1 weight='medium' style={styles.doctorName}>{item.doctorName}</Caption1>
            </View>

            {/* Queue Traffic */}
            <View style={styles.row}>
              <Caption1 weight='medium' style={styles.label}>Queue Traffic: </Caption1>
              <Caption1 weight='medium' style={[styles.trafficText, { color: TRAFFIC_COLOR[item.traffic] }]}>
                {item.traffic}
              </Caption1>
            </View>

            {/* Estimated Wait */}
            <View style={styles.row}>
              <Caption1 weight='medium' style={styles.label}>Estimated waiting time: </Caption1>
              <Caption1 weight='medium' style={styles.label}>{item.estimatedWait}</Caption1>
            </View>

            {/* Button */}
            <CustomButton
              onPress={() => {}}
              title="I am coming"
              width="100%"
              height={hp(48)}
              borderRadius={100}
              style={styles.button}
              backgroundColor='#2596BE33'
              color='#2596BE'
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: wp(20),
    // paddingTop: hp(10),
    // paddingBottom: hp(10),
  },
  listContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(80),
    gap: hp(14),
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    gap: hp(6),
    // backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    color: Colors.TEXT_COLOR,
   
  },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
   
    fontWeight: '600',
  },
  trafficText: {
    
    fontWeight: '600',
  },
  button: {
    marginTop: hp(10),
    // backgroundColor: '#EBF6FA',
  },
});