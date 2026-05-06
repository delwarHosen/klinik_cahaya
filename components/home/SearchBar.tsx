import { H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  onSearchPress?: () => void;
  placeholder?: string;
}

export function SearchBar({ onSearchPress, placeholder = 'Search doctors or service' }: SearchBarProps) {
  return (
    <View style={styles.searchSection}>
     
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={onSearchPress}
        activeOpacity={0.7}
      >
        <Text style={styles.searchPlaceholder}>{placeholder}</Text>
        <TouchableOpacity style={styles.searchBtn} onPress={onSearchPress}>
          <H6 color="#F4F4F4">Search</H6>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    marginTop: hp(20),
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
    overflow: 'hidden',
    alignItems: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    paddingHorizontal: wp(15),
    paddingVertical: hp(14),
    fontSize: 14,
    color: '#999',
  },
  searchBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    paddingHorizontal: wp(20),
    justifyContent: 'center',
    borderRadius: 14,
    margin: 4,
    paddingVertical: hp(10),
  },
});