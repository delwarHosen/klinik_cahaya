import CustomLoader from '@/components/shared/CustomLoader';
import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useLazyGetMedicalRecordsQuery } from '@/redux/services/medicalRecordApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedicalRecordScreen() {
  const { t } = useTranslation();
  const { icLast4 } = useLocalSearchParams<{ icLast4: string }>();
  const [getRecords, { data, isLoading }] = useLazyGetMedicalRecordsQuery();

  React.useEffect(() => {
    if (icLast4) {
      getRecords(icLast4);
    }
  }, [icLast4]);

  const handleDownload = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <CustomLoader size={50} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>

        <PageLoader
          visible={isLoading}
          title={t('loading')}
          subtitle={t('fetching_records')}
        />
        <SectionTitle title={t('medical_records')} />
      </View>

      <FlatList
        data={data?.results ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <H6 style={styles.doctorName}>{item.patient_name}</H6>


            <Caption2 style={styles.specialty}>
              {t('result_type')}: {item.result_type}
            </Caption2>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Caption2 style={styles.label}>{t('test_date')}</Caption2>
                <Body4 weight='semiBold' style={styles.dateTime}>
                  {item.test_date}
                </Body4>
              </View>

              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => handleDownload(item.file_url)}
              >
                <Caption2 style={{ color: '#fff' }}>{t('view_file')}</Caption2>
              </TouchableOpacity>
            </View>

            <Caption2 style={styles.fileName} numberOfLines={1}>
              {t('file')}: {item.filename}
            </Caption2>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <H6>{t('no_records_founds')}</H6>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: wp(20), marginBottom: hp(10) },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: wp(20), paddingBottom: hp(20) },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: wp(16),
    marginBottom: hp(16),
    borderWidth: 1,
    borderColor: '#EEE',
  },
  doctorName: { color: Colors.BRAND_PRIMARY, marginBottom: 4 },
  specialty: { color: '#666' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: hp(12) },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#999', marginBottom: 2 },
  dateTime: { color: Colors.TEXT_COLOR },
  downloadBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: 8,
  },
  fileName: { marginTop: hp(8), color: '#888', fontStyle: 'italic' }
});