import { ReasonDropdown } from '@/components/booking/ReasonDropdown';
import { Caption1, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    patientName: string;
    reasons: string[];
    selectedReason: string | null;
    reasonOpen: boolean;
    onToggleReason: () => void;
    onSelectReason: (r: string) => void;
    details: string;
    onChangeDetails: (t: string) => void;
    selectedDate: string | null;
    selectedTime: string | null;
    onPressDateTime: () => void;
}

export function PatientCard({
    patientName, reasons, selectedReason, reasonOpen,
    onToggleReason, onSelectReason,
    details, onChangeDetails,
    selectedDate, selectedTime, onPressDateTime,
}: Props) {
    return (
        <View style={styles.card}>
            <H6 style={styles.patientName}>{patientName}</H6>

            <ReasonDropdown
                reasons={reasons}
                selected={selectedReason}
                open={reasonOpen}
                onToggle={onToggleReason}
                onSelect={onSelectReason}
            />

            {/* Details */}
            <TextInput
                style={styles.textInput}
                placeholder="write here details....."
                placeholderTextColor="#999"
                multiline
                value={details}
                onChangeText={onChangeDetails}
            />

            {/* Date & Time */}
            <TouchableOpacity style={styles.row} onPress={onPressDateTime}>
                <Caption1 style={{ color: selectedDate ? '#1A1A1A' : '#999' }}>
                    {selectedDate && selectedTime
                        ? `${selectedDate}  ${selectedTime}`
                        : 'Date & Time'}
                </Caption1>
                <Caption1 style={{ color: Colors.BRAND_PRIMARY, fontSize: 20 }}>＋</Caption1>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, overflow: 'hidden', marginTop: hp(12) },
    patientName: { paddingHorizontal: wp(16), paddingTop: hp(14), paddingBottom: hp(6), color: '#1A1A1A' },
    row: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: wp(16), paddingVertical: hp(14),
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
    },
    textInput: {
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
        paddingHorizontal: wp(16), paddingVertical: hp(12),
        color: '#1A1A1A', fontSize: 13, minHeight: hp(60),
    },
});