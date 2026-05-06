import { H6 } from '@/components/typo/Typography';
import { QUICK_ACTIONS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const QUICK_ACTION_ROUTES: Record<string, string> = {
  '1': '/patient/quick_access/general',
  '2': '/patient/quick_access/queue_status',
  '3': '/patient/quick_access/vaccine_stock',
  '4': '/patient/quick_access/ic_verification',
};

interface QuickActionsGridProps {
  onItemPress?: (route: string) => void;
}

export function QuickActionsGrid({ onItemPress }: QuickActionsGridProps) {
  return (
    <View style={styles.gridContainer}>
      {QUICK_ACTIONS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.gridItem}
          activeOpacity={0.75}
          onPress={() => onItemPress?.(QUICK_ACTION_ROUTES[item.id])}
        >
          <H6 style={styles.gridText}>{item.title}</H6>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: hp(20),
    gap: 12,
  },
  gridItem: {
    width: '47.5%',
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    paddingVertical: hp(20),
    paddingHorizontal: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  gridText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.BRAND_PRIMARY,
    textAlign: 'center',
    lineHeight: 18,
  },
});