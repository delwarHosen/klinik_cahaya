import { Caption1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
    patients: string[];
    selected: string | null;
    open: boolean;
    onToggle: () => void;
    onSelect: (p: string) => void;
}

export function PatientDropdown({ patients, selected, open, onToggle, onSelect }: Props) {
    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.dropdown} onPress={onToggle}>
                <Caption1 style={{ color: selected ? '#1A1A1A' : '#999' }}>
                    {selected ?? 'Choose Patient'}
                </Caption1>
                <Caption1>{open ? '▲' : '▼'}</Caption1>
            </TouchableOpacity>

            {open && (
                <View style={styles.dropdownList}>
                    {patients.map((p) => (
                        <TouchableOpacity
                            key={p}
                            style={styles.dropdownItem}
                            onPress={() => onSelect(p)}
                        >
                            <Caption1 style={{ flex: 1 }}>{p}</Caption1>
                            <View style={[styles.radio, selected === p && styles.radioSelected]}>
                                {selected === p && <View style={styles.radioDot} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, overflow: 'hidden' },
    dropdown: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: wp(16), paddingVertical: hp(14),
    },
    dropdownList: { borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    dropdownItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: wp(16), paddingVertical: hp(12),
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1, borderBottomColor: '#EFEFEF',
    },
    radio: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 1.5, borderColor: '#CCC',
        alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: Colors.BRAND_PRIMARY },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.BRAND_PRIMARY },
});