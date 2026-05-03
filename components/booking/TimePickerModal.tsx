// components/shared/TimePickerModal.tsx

import { Caption1, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

const TIMES = [
    '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM',
    '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM',
];



interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: (time: string) => void;
    disabledTimes?: string[];
}

export function TimePickerModal({ visible, onClose, onConfirm, disabledTimes = [] }: Props) {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleOkay = () => {
        if (!selectedTime) return;
        onConfirm(selectedTime);
        setSelectedTime(null);
    };

    const handleClose = () => {
        setSelectedTime(null);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <H6 style={styles.title}>Select Time</H6>

                    <View style={styles.timeGrid}>
                        {TIMES.map((t) => {
                            const isDisabled = disabledTimes.includes(t);
                            const isSelected = selectedTime === t;

                            return (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.timeCell,
                                        isSelected && styles.selectedTimeCell,
                                        isDisabled && styles.disabledTimeCell,  // ← disabled style
                                    ]}
                                    onPress={() => !isDisabled && setSelectedTime(t)}
                                    disabled={isDisabled}
                                    activeOpacity={isDisabled ? 1 : 0.7}
                                >
                                    <Caption2 style={[
                                        styles.timeText,
                                        isSelected && styles.selectedTimeText,
                                        isDisabled && styles.disabledTimeText,  // ← disabled text
                                    ]}>
                                        {t}
                                    </Caption2>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.btnRow}>
                        <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
                            <Caption1 style={styles.cancelText}>Cancel</Caption1>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleOkay}
                            style={[styles.okayBtn, !selectedTime && styles.disabledBtn]}
                            disabled={!selectedTime}
                        >
                            <Caption1 style={styles.okayText}>Okay</Caption1>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(24),
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: wp(20),
        paddingTop: hp(24),
        paddingBottom: hp(20),
        width: '100%',
    },
    title: {
        textAlign: 'center',
        color: Colors.BRAND_PRIMARY,
        fontWeight: '700',
        fontSize: 18,
        marginBottom: hp(20),
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(8),
        marginBottom: hp(8),
    },
    timeCell: {
        width: '30.5%',
        paddingVertical: hp(14),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
    },
    timeText: {
        color: '#333333',
        fontSize: 13,
    },
    selectedTimeCell: {
        backgroundColor: Colors.BRAND_PRIMARY,
        borderColor: Colors.BRAND_PRIMARY,
    },
    selectedTimeText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    disabledTimeCell: {
        backgroundColor: '#F8F8F8',
        borderColor: '#E8E8E8',
        opacity: 0.5,
    },
    disabledTimeText: {
        color: '#AAAAAA',
        fontWeight: '400',
    },
    btnRow: {
        flexDirection: 'row',
        gap: wp(12),
        marginTop: hp(12),
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#CCCCCC',
        borderRadius: 100,
        paddingVertical: hp(14),
        alignItems: 'center',
    },
    cancelText: {
        color: '#333333',
        fontWeight: '500',
    },
    okayBtn: {
        flex: 1,
        backgroundColor: Colors.BRAND_PRIMARY,
        borderRadius: 100,
        paddingVertical: hp(14),
        alignItems: 'center',
    },
    okayText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    disabledBtn: {
        opacity: 0.5,
    },
});