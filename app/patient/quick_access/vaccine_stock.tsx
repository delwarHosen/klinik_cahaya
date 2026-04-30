import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body3, Caption1, Caption2, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Fake Data ───────────────────────────────────────────────────────────────

const VACCINES = [
  {
    id: '1',
    name: 'BCG (Bacillus Calmette–Guérin)',
    price: 'RM 1200',
    stock: 56,
    expireDate: 'October 30, 2027',
  },
  {
    id: '2',
    name: 'Japanese Encephalitis (JE) Vaccine',
    price: 'RM 1200',
    stock: 56,
    expireDate: 'October 30, 2027',
  },
  {
    id: '3',
    name: '6-in-1 Vaccine (Hexaxim)',
    price: 'RM 1200',
    stock: 0,
    expireDate: 'October 30, 2027',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function VaccineStockScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Vaccine Stock" />
      </View>

      <FlatList
        data={VACCINES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const inStock = item.stock > 0;
          return (
            <View style={styles.card}>
              <Body1 style={styles.vaccineName}>{item.name}</Body1>
              <Body3 style={styles.price}>{item.price}</Body3>

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor: inStock ? '#E8F5F0' : '#FFE8E8',
                      borderColor: inStock ? '#1D9E75' : '#FF383C',
                    },
                  ]}
                >
                  <Caption4
                    style={{ color: inStock ? '#1D9E75' : '#FF383C', fontWeight: '500' }}
                  >
                    {inStock ? `Stock: ${item.stock} Units` : 'Stockout'}
                  </Caption4>
                </View>

                <Caption2 style={styles.expireText}>
                  Expire Date: <Caption1 style={styles.expireDateValue}>{item.expireDate}</Caption1>
                </Caption2>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    // paddingBottom: hp(10),
    // backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(30),
    gap: 14,
  },
  card: {
    borderWidth:1,
    borderColor:Colors.BORDER_COLOR,
    borderRadius: 16,
    padding: wp(16),
    gap: 6,
    
  },
  vaccineName: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
  },
  price: {
    color: '#888888',
    marginBottom: hp(4),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  stockBadge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(5),
    borderRadius: 20,
    borderWidth: 1,
  },
  expireText: {
    color: '#AAAAAA',
     fontWeight: '600',
  },
  expireDateValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
  },
});