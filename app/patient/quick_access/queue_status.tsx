import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Fake Data ───────────────────────────────────────────────────────────────

const QUEUE_DATA = [
  {
    id: '1',
    doctorName: 'Dr. Anis Effendi',
    waiting: 0,
    served: 4,
    estimatedWait: '0 minutes',
    status: 'Called',
  },
  {
    id: '2',
    doctorName: 'Dr. Anis Effendi',
    waiting: 1,
    served: 8,
    estimatedWait: '30 minutes',
    status: 'Waiting',
  },
];

const STATUS_COLOR: Record<string, string> = {
  Called: '#4CAF50',
  Waiting: '#FF9800',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function QueueStatusScreen() {
  const router = useRouter();
  // const [modalVisible, setModalVisible] = useState(false);

  // const handleTimeConfirm = (time: string) => {
  //   setModalVisible(false);
  //   router.push({
  //     pathname: '/patient/doctors_info/information',
  //     params: { selectedTime: time },
  //   });
  // };

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

            {/* Status row */}
            <View style={rowStyles.row}>
              <Body1 style={rowStyles.label}>Status:</Body1>
              <Body1 style={[rowStyles.value, { color: STATUS_COLOR[item.status] ?? Colors.TEXT_COLOR }]}>
                {item.status}
              </Body1>
            </View>

            <Row label="Waiting:" value={String(item.waiting)} />
            <Row label="Served:" value={String(item.served)} />
            <Row label="Estimated waiting time:" value={item.estimatedWait} />

            <CustomButton
              onPress={() => {}}
              title="I am coming"
              width="100%"
              style={styles.button}
            />
          </View>
        )}
      />

      {/* Time Picker Modal */}
      {/* <TimePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleTimeConfirm}
        disabledTimes={['09:00 AM', '09:30 AM', '10:30 AM', '02:00 PM','03:00 PM']} 
      /> */}
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
  },
  value: {
    color: Colors.TEXT_COLOR,
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
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    padding: wp(16),
    gap: hp(4),
  },
  button: {
    marginTop: hp(12),
    borderRadius: 100,
  },
});