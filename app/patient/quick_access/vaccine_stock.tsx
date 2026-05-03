import { NotificationIcon } from '@/assets/icons/common_icon/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body3, Caption1, Caption2, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
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
    restockDate: null,
  },
  {
    id: '2',
    name: 'Japanese Encephalitis (JE) Vaccine',
    price: 'RM 1200',
    stock: 6,
    expireDate: 'October 30, 2027',
    restockDate: null,
  },
  {
    id: '3',
    name: '6-in-1 Vaccine (Hexaxim)',
    price: 'RM 1200',
    stock: 0,
    expireDate: null,
    restockDate: 'October 30, 2026',
  },
];

// ─── Status Helper ────────────────────────────────────────────────────────────

function getStockStatus(stock: number) {
  if (stock === 0) return 'stockout';
  if (stock <= 10) return 'low';
  return 'available';
}

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
          const status = getStockStatus(item.stock);
          const isStockout = status === 'stockout';
          const isLow = status === 'low';

          return (
            <View style={styles.card}>

             
              {isStockout && (
                <View style={styles.notifyRow}>
                  <Caption2 style={styles.notifyText}>Notify me when available</Caption2>
                  <TouchableOpacity style={styles.notifyIcon} activeOpacity={0.7}>
                    <NotificationIcon size={16} color={Colors.BRAND_PRIMARY} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Vaccine name & price */}
              <Body1 style={styles.vaccineName}>{item.name}</Body1>
              <Body3 style={styles.price}>{item.price}</Body3>

             
              {isStockout && item.restockDate && (
                <Caption2 style={styles.restockText}>
                  Restock ETA date:{' '}
                  <Caption1 style={styles.restockDateValue}>{item.restockDate}</Caption1>
                </Caption2>
              )}

             
              {!isStockout && item.expireDate && (
                <Caption2 style={styles.expireText}>
                  Expire Date:{' '}
                  <Caption1 style={styles.expireDateValue}>{item.expireDate}</Caption1>
                </Caption2>
              )}

              {/* Status Badge */}
              <View style={styles.statusRow}>
                {isStockout ? (
                  <View style={[styles.stockBadge, styles.stockoutBadge]}>
                    <Caption4 style={styles.stockoutText}>Stockout</Caption4>
                  </View>
                ) : isLow ? (
                  <View style={[styles.stockBadge, styles.lowStockBadge]}>
                    <Caption4 style={styles.lowStockText}>Low Stock: {item.stock} Units</Caption4>
                  </View>
                ) : (
                  <View style={[styles.stockBadge, styles.availableBadge]}>
                    <Caption4 style={styles.availableText}>Available</Caption4>
                  </View>
                )}
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
    padding: wp(12),
    gap: 6,
  },

  // ── Notify row ──
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  notifyText: {
    color: Colors.BRAND_PRIMARY,
    fontSize: 12,
  },
  notifyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.BRAND_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Vaccine info ──
  vaccineName: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
  },
  price: {
    color: '#888888',
    marginBottom: hp(2),
  },

  // ── Restock date ──
  restockText: {
    color: '#AAAAAA',
    fontWeight: '500',
  },
  restockDateValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '600',
  },

  // ── Expire date ──
  expireText: {
    color: '#AAAAAA',
    fontWeight: '600',
  },
  expireDateValue: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
  },

  // ── Status row ──
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
  },
  stockBadge: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(5),
    borderRadius: 20,
    borderWidth: 1,
  },

  // Available
  availableBadge: {
    backgroundColor: '#E8F5F0',
    borderColor: '#1D9E75',
  },
  availableText: {
    color: '#1D9E75',
    fontWeight: '500',
  },

  // Low Stock
  lowStockBadge: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FF9800',
  },
  lowStockText: {
    color: '#FF9800',
    fontWeight: '500',
  },

  // Stockout
  stockoutBadge: {
    backgroundColor: '#FFE8E8',
    borderColor: '#FF383C',
  },
  stockoutText: {
    color: '#FF383C',
    fontWeight: '500',
  },
});