import { Caption1, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const TIMES = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: (date: string, time: string) => void;
}

export function DateTimePickerModal({ visible, onClose, onConfirm }: Props) {
    const today = new Date();
    const [step, setStep] = useState<'date' | 'time'>('date');
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
        setSelectedDay(null);
    };

    const handleTimeOkay = () => {
        if (!selectedDay || !selectedTime) return;
        const dayName = WEEK_DAYS[new Date(currentYear, currentMonth, selectedDay).getDay()];
        const dateStr = `${MONTH_NAMES[currentMonth]} ${selectedDay}, ${currentYear} (${dayName})`;
        onConfirm(dateStr, selectedTime);
        // reset
        setStep('date');
        setSelectedDay(null);
        setSelectedTime(null);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    {step === 'date' ? (
                        <>
                            <H6 style={styles.title}>Select Date</H6>
                            <View style={styles.monthRow}>
                                <Caption1 style={styles.monthText}>
                                    {MONTH_NAMES[currentMonth]} {currentYear}
                                </Caption1>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TouchableOpacity onPress={handlePrevMonth}>
                                        <Caption1>{'<'}</Caption1>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleNextMonth}>
                                        <Caption1>{'>'}</Caption1>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.dayRow}>
                                {DAYS.map((d, i) => (
                                    <Caption1 key={i} style={styles.dayLabel}>{d}</Caption1>
                                ))}
                            </View>
                            <View style={styles.grid}>
                                {cells.map((day, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.cell, day === selectedDay && styles.selectedCell]}
                                        onPress={() => day && setSelectedDay(day)}
                                        disabled={!day}
                                    >
                                        <Caption1 style={[styles.cellText, day === selectedDay && { color: '#fff' }]}>
                                            {day ?? ''}
                                        </Caption1>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.btnRow}>
                                <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                                    <Caption1 style={{ color: '#333' }}>Cancel</Caption1>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => selectedDay && setStep('time')}
                                    style={styles.okayBtn}
                                >
                                    <Caption1 style={{ color: '#fff' }}>Okay</Caption1>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <H6 style={styles.title}>Select Time</H6>
                            <View style={styles.timeGrid}>
                                {TIMES.map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[styles.timeCell, selectedTime === t && styles.selectedTimeCell]}
                                        onPress={() => setSelectedTime(t)}
                                    >
                                        <Caption1 style={[{ color: '#333' }, selectedTime === t && { color: '#fff' }]}>
                                            {t}
                                        </Caption1>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.btnRow}>
                                <TouchableOpacity onPress={() => setStep('date')} style={styles.cancelBtn}>
                                    <Caption1 style={{ color: '#333' }}>Cancel</Caption1>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleTimeOkay} style={styles.okayBtn}>
                                    <Caption1 style={{ color: '#fff' }}>Okay</Caption1>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: wp(20) },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: wp(20), width: '100%' },
    title: { textAlign: 'center', color: Colors.BRAND_PRIMARY, marginBottom: hp(16), fontWeight: '700' },
    monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(10) },
    monthText: { color: Colors.BRAND_PRIMARY, fontWeight: '600' },
    dayRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: hp(6) },
    dayLabel: { width: 36, textAlign: 'center', color: '#555', fontWeight: '600' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    selectedCell: { backgroundColor: Colors.BRAND_PRIMARY },
    cellText: { color: '#333', fontSize: 13 },
    btnRow: { flexDirection: 'row', gap: 12, marginTop: hp(16) },
    cancelBtn: { flex: 1, borderWidth: 1, borderColor: '#CCC', borderRadius: 100, paddingVertical: hp(12), alignItems: 'center' },
    okayBtn: { flex: 1, backgroundColor: Colors.BRAND_PRIMARY, borderRadius: 100, paddingVertical: hp(12), alignItems: 'center' },
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    timeCell: { paddingHorizontal: wp(12), paddingVertical: hp(10), borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' },
    selectedTimeCell: { backgroundColor: Colors.BRAND_PRIMARY, borderColor: Colors.BRAND_PRIMARY },
});