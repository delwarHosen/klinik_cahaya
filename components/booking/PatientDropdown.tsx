import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
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
        <View style={[styles.card, open && styles.cardOpen]}>
            {/* Trigger */}
            <TouchableOpacity style={styles.trigger} onPress={onToggle} activeOpacity={0.7}>
                <Caption1 style={{ color: selected ? '#555555' : '#AAAAAA' }}>
                    {selected ?? 'Choose Patient'}
                </Caption1>
                {open ? <UpArrowIcon /> : <DownArrowIcon />}
            </TouchableOpacity>

            {/* Options */}
            {open && (
                <View style={styles.list}>
                    {patients.map((p) => (
                        <TouchableOpacity
                            key={p}
                            style={styles.item}
                            onPress={() => onSelect(p)}
                            activeOpacity={0.7}
                        >
                            <Caption1 style={styles.itemText} weight='semiBold'>{p}</Caption1>
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
    card: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        marginBottom: hp(12),
    },
    cardOpen: {
        borderColor: '#CCCCCC',
    },
    trigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(18),
    },
    list: {
        paddingHorizontal: wp(12),
        paddingBottom: hp(12),
        gap: hp(8),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    itemText: {
        flex: 1,
        textAlign: 'center',
        color: '#1A1A1A',
        fontSize: 15,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    radioSelected: {
        borderColor: Colors.BRAND_PRIMARY,
    },
    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.BRAND_PRIMARY,
    },
});