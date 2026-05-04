import { Caption1, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

interface Props {
    visible: boolean;
    title?: string;
    onClose: () => void;
    onConfirm: (date: string) => void;
    disabledDates?: string[];
}

export function DatePickerModal({
    visible,
    title = 'Select Date',
    onClose,
    onConfirm,
    disabledDates = [],
}: Props) {
    const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const leadingDays = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + i + 1);
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalCells = leadingDays.length + currentDays.length;
    const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

    const isDisabledDate = (day: number): boolean => {
        const thisDate = new Date(currentYear, currentMonth, day);
        thisDate.setHours(0, 0, 0, 0);
        if (thisDate < TODAY) return true;
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return disabledDates.includes(`${currentYear}-${mm}-${dd}`);
    };

    const canGoPrev = () => {
        const firstOfPrev = new Date(
            currentMonth === 0 ? currentYear - 1 : currentYear,
            currentMonth === 0 ? 11 : currentMonth - 1,
            1
        );
        return firstOfPrev >= new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    };

    const handlePrevMonth = () => {
        if (!canGoPrev()) return;
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
        setSelectedDay(null);
    };

    const handleConfirm = () => {
        if (!selectedDay) return;
        const dayName = WEEK_DAYS[new Date(currentYear, currentMonth, selectedDay).getDay()];
        const dateStr = `${MONTH_NAMES[currentMonth]} ${selectedDay}, ${currentYear} (${dayName})`;
        onConfirm(dateStr);
        resetState();
    };

    const resetState = () => {
        setSelectedDay(null);
    };

    const handleClose = () => {
        onClose();
        resetState();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <H6 style={styles.title}>{title}</H6>

                    {/* Month nav */}
                    <View style={styles.monthRow}>
                        <Caption1 style={styles.monthText}>
                            {MONTH_NAMES[currentMonth]} {currentYear}
                        </Caption1>
                        <View style={styles.navBtns}>
                            <TouchableOpacity
                                style={[styles.navBtn, !canGoPrev() && styles.navBtnDisabled]}
                                onPress={handlePrevMonth}
                                disabled={!canGoPrev()}
                            >
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
                        {currentDays.map((day) => {
                            const disabled = isDisabledDate(day);
                            const isSelected = day === selectedDay;
                            return (
                                <TouchableOpacity
                                    key={`day-${day}`}
                                    style={[styles.cell, isSelected && styles.selectedCell, disabled && styles.disabledCell]}
                                    onPress={() => !disabled && setSelectedDay(day)}
                                    disabled={disabled}
                                    activeOpacity={disabled ? 1 : 0.7}
                                >
                                    <Caption1 style={[
                                        styles.cellText,
                                        isSelected && styles.selectedCellText,
                                        disabled && styles.disabledCellText,
                                    ]}>
                                        {day}
                                    </Caption1>
                                </TouchableOpacity>
                            );
                        })}
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
                            onPress={handleConfirm}
                            style={[styles.okayBtn, !selectedDay && styles.disabledBtn]}
                            disabled={!selectedDay}
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
    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    monthText: { color: Colors.BRAND_PRIMARY, fontWeight: '600', fontSize: 15 },
    navBtns: { flexDirection: 'row', gap: 4 },
    navBtn: {
        width: 32, height: 32, borderRadius: 16,
        borderWidth: 1, borderColor: '#DDDDDD',
        justifyContent: 'center', alignItems: 'center',
    },
    navBtnDisabled: { opacity: 0.3 },
    dayRow: { flexDirection: 'row', marginBottom: hp(4) },
    dayLabel: {
        width: '14.28%', textAlign: 'center',
        color: '#888888', fontWeight: '600', fontSize: 13,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: hp(8) },
    cell: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    cellText: { color: '#333333', fontSize: 14 },
    fadedText: { color: '#CCCCCC', fontSize: 14 },
    selectedCell: { backgroundColor: Colors.BRAND_PRIMARY },
    selectedCellText: { color: '#FFFFFF', fontWeight: '600' },
    disabledCell: { opacity: 0.35 },
    disabledCellText: { color: '#AAAAAA' },
    btnRow: { flexDirection: 'row', gap: wp(12), marginTop: hp(12) },
    cancelBtn: {
        flex: 1, borderWidth: 1.5, borderColor: '#CCCCCC',
        borderRadius: 100, paddingVertical: hp(14), alignItems: 'center',
    },
    cancelText: { color: '#333333', fontWeight: '500' },
    okayBtn: {
        flex: 1, backgroundColor: Colors.BRAND_PRIMARY,
        borderRadius: 100, paddingVertical: hp(14), alignItems: 'center',
    },
    okayText: { color: '#FFFFFF', fontWeight: '600' },
    disabledBtn: { opacity: 0.5 },
});