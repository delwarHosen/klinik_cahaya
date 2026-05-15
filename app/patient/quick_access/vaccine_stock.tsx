import PageLoader from '@/components/shared/PageLoader';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body3, Caption1, Caption2, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useGetVaccineStockQuery } from '@/redux/services/vaccinesApi';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Status Helper ────────────────────────────────────────────────────────────

function getStockStatus(status: string) {
  if (status === 'out_of_stock') return 'stockout';
  if (status === 'low_stock') return 'low';
  return 'available';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function VaccineStockScreen() {
  const { t } = useTranslation()

  const { data, isLoading, refetch, isFetching } = useGetVaccineStockQuery(undefined);
  const vaccines = data ?? [];

  // console.log("Vaccine Data",vaccines)

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // if (isLoading) {
  //   return (
  //     <SafeAreaView style={styles.container} edges={['top']}>
  //       <View style={styles.header}>
  //         <SectionTitle title="Vaccine Stock" />
  //       </View>
  //       <View style={styles.loaderContainer}>
  //         <ActivityIndicator size="large" color={Colors.BRAND_PRIMARY} />
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PageLoader visible={isLoading} title="LOADING" subtitle="Fetching vaccine status..." />
      <View style={styles.header}>
        <SectionTitle title={t('vaccine_stock')} />

      </View>

      <FlatList
        data={vaccines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            colors={[Colors.BRAND_PRIMARY]}
            tintColor={Colors.BRAND_PRIMARY}
          />
        }
        renderItem={({ item }) => {
          const status = getStockStatus(item.status);
          const isStockout = status === 'stockout';
          const isLow = status === 'low';

          return (
            <View style={styles.card}>

              {/* Vaccine name & brand */}
              <Body1 style={styles.vaccineName}>{item.vaccine_name}</Body1>
              <Body3 style={styles.brandName}>{item.brand_name}</Body3>

              {/* Price */}
              <Body3 style={styles.price}>RM {item.price}</Body3>


              {item.expiry_date && (
                <Caption2 style={styles.expireText}>
                  Expire Date:{' '}
                  <Caption1 style={styles.expireDateValue}>{item.expiry_date}</Caption1>
                </Caption2>
              )}


              {!isStockout && (
                <Caption2 style={styles.stockCountText}>
                  Available:{' '}
                  <Caption1 style={styles.stockCountValue}>{item.available} units</Caption1>
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
                    <Caption4 style={styles.lowStockText}>Low Stock: {item.available} Units</Caption4>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    paddingBottom: hp(60),
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    padding: wp(12),
    gap: 6,
  },

  // ── Vaccine info ──
  vaccineName: {
    color: Colors.TEXT_COLOR,
    fontWeight: '700',
  },
  brandName: {
    color: '#555555',
    marginBottom: hp(2),
  },
  price: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
    marginBottom: hp(2),
  },

  // ── Stock count ──
  stockCountText: {
    color: '#AAAAAA',
    fontWeight: '500',
  },
  stockCountValue: {
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