import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon';
import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon';
import { Caption1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
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
        <View style={[styles.card, open && styles.cardOpen]}>
            {/* Trigger */}
            <TouchableOpacity style={styles.trigger} onPress={onToggle} activeOpacity={0.7}>
                <Caption1 style={{ color: selected ? '#555555' : '#AAAAAA' }}>
                    {selected ?? 'Select Reason'}
                </Caption1>
                {open ? <UpArrowIcon /> : <DownArrowIcon />}
            </TouchableOpacity>

            {/* Options */}
            {open && (
                <View style={styles.list}>
                    {reasons.map((r) => (
                        <TouchableOpacity
                            key={r}
                            style={[
                                styles.item,
                                selected === r && styles.itemSelected,
                            ]}
                            onPress={() => onSelect(r)}
                            activeOpacity={0.7}
                        >
                            <Caption1 style={[
                                styles.itemText,
                                selected === r && { color: Colors.BRAND_PRIMARY },
                            ]} weight='semiBold'>
                                {r}
                            </Caption1>
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
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        alignItems: 'center',
    },
    itemSelected: {
        backgroundColor: `${Colors.BRAND_PRIMARY}15`,
    },
    itemText: {
        textAlign: 'center',
        color: '#1A1A1A',
        fontSize: 15,
    },
});