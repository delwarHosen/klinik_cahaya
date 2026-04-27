// components/booking/ReasonDropdown.tsx
import { Caption1 } from '@/components/typo/Typography';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
    reasons: string[];
    selected: string | null;
    open: boolean;
    onToggle: () => void;
    onSelect: (r: string) => void;
}

export function ReasonDropdown({ reasons, selected, open, onToggle, onSelect }: Props) {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.dropdown} onPress={onToggle}>
                <Caption1 style={{ color: selected ? '#1A1A1A' : '#999' }}>
                    {selected ?? 'Select Reason'}
                </Caption1>
                <Caption1>{open ? '▲' : '▼'}</Caption1>
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownList}>
                    {reasons.map((r) => (
                        <TouchableOpacity
                            key={r}
                            style={styles.dropdownItem}
                            onPress={() => onSelect(r)}
                        >
                            <Caption1>{r}</Caption1>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    dropdown: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: wp(16), paddingVertical: hp(14),
    },
    dropdownList: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    dropdownItem: {
        paddingHorizontal: wp(16), paddingVertical: hp(12),
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1, borderBottomColor: '#EFEFEF',
    },
});