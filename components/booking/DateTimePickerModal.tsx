import { Caption1, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const TIMES = [
    '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM',
    '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM',
];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
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

    // prev month trailing days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const leadingDays = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + i + 1);

    // current month days
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // next month leading days to fill last row
    const totalCells = leadingDays.length + currentDays.length;
    const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

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
        setStep('date');
        setSelectedDay(null);
        setSelectedTime(null);
    };

    const handleClose = () => {
        onClose();
        setStep('date');
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    {step === 'date' ? (
                        <>
                            <H6 style={styles.title}>Select Date</H6>

                            {/* Month nav */}
                            <View style={styles.monthRow}>
                                <Caption1 style={styles.monthText}>
                                    {MONTH_NAMES[currentMonth]} {currentYear}
                                </Caption1>
                                <View style={styles.navBtns}>
                                    <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth}>
                                        <Caption2 color="#555">{'<'}</Caption2>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth}>
                                        <Caption2 color="#555">{'>'}</Caption2>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Day headers */}
                            <View style={styles.dayRow}>
                                {DAYS.map((d, i) => (
                                    <Caption2 key={i} style={styles.dayLabel}>{d}</Caption2>
                                ))}
                            </View>

                            {/* Calendar grid */}
                            <View style={styles.grid}>
                                {leadingDays.map((d, i) => (
                                    <View key={`lead-${i}`} style={styles.cell}>
                                        <Caption1 style={styles.fadedText}>{d}</Caption1>
                                    </View>
                                ))}
                                {currentDays.map((day) => (
                                    <TouchableOpacity
                                        key={`day-${day}`}
                                        style={[styles.cell, day === selectedDay && styles.selectedCell]}
                                        onPress={() => setSelectedDay(day)}
                                    >
                                        <Caption1 style={[styles.cellText, day === selectedDay && styles.selectedCellText]}>
                                            {day}
                                        </Caption1>
                                    </TouchableOpacity>
                                ))}
                                {trailingDays.map((d, i) => (
                                    <View key={`trail-${i}`} style={styles.cell}>
                                        <Caption1 style={styles.fadedText}>{d}</Caption1>
                                    </View>
                                ))}
                            </View>

                            {/* Buttons */}
                            <View style={styles.btnRow}>
                                <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
                                    <Caption1 style={styles.cancelText}>Cancel</Caption1>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => selectedDay && setStep('time')}
                                    style={[styles.okayBtn, !selectedDay && styles.disabledBtn]}
                                >
                                    <Caption1 style={styles.okayText}>Okay</Caption1>
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
                                        <Caption2 style={[
                                            styles.timeText,
                                            selectedTime === t && styles.selectedTimeText,
                                        ]}>
                                            {t}
                                        </Caption2>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Buttons */}
                            <View style={styles.btnRow}>
                                <TouchableOpacity onPress={() => setStep('date')} style={styles.cancelBtn}>
                                    <Caption1 style={styles.cancelText}>Cancel</Caption1>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleTimeOkay}
                                    style={[styles.okayBtn, !selectedTime && styles.disabledBtn]}
                                >
                                    <Caption1 style={styles.okayText}>Okay</Caption1>
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

    // Month navigation
    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    monthText: {
        color: Colors.BRAND_PRIMARY,
        fontWeight: '600',
        fontSize: 15,
    },
    navBtns: {
        flexDirection: 'row',
        gap: 4,
    },
    navBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Day headers
    dayRow: {
        flexDirection: 'row',
        marginBottom: hp(4),
    },
    dayLabel: {
        width: '14.28%',
        textAlign: 'center',
        color: '#888888',
        fontWeight: '600',
        fontSize: 13,
    },

    // Calendar grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: hp(8),
    },
    cell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    cellText: {
        color: '#333333',
        fontSize: 14,
    },
    fadedText: {
        color: '#CCCCCC',
        fontSize: 14,
    },
    selectedCell: {
        backgroundColor: Colors.BRAND_PRIMARY,
    },
    selectedCellText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // Buttons
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

    // Time grid — 3 columns
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
});