import { Caption1, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { AvailabilitySlot } from '@/redux/services/bookingApi';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parses "8:00 PM - 11:00 PM" → { startHour: 20, endHour: 23 }
 * Falls back to 8–23 if parsing fails.
 */
function parseConsultationTime(timeStr: string): { startHour: number; endHour: number } {
  const DEFAULT = { startHour: 8, endHour: 23 };
  if (!timeStr) return DEFAULT;

  const parts = timeStr.split('-').map((s) => s.trim()); // ["8:00 PM", "11:00 PM"]
  if (parts.length !== 2) return DEFAULT;

  const toHour24 = (t: string): number | null => {
    const match = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h;
  };

  const startHour = toHour24(parts[0]);
  const endHour = toHour24(parts[1]);
  if (startHour === null || endHour === null) return DEFAULT;

  return { startHour, endHour };
}

/**
 * Builds 30-min interval slots for a given hour range.
 * e.g. startHour=20, endHour=23 → ["20:00","20:30","21:00","21:30","22:00","22:30","23:00"]
 */
function buildSlotsForRange(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < endHour) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

/** "HH:MM" 24h  →  "08:00 PM" */
function formatSlot(slot: string): string {
  const [hStr, mStr] = slot.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
}

/** year/month(0-based)/day  →  "YYYY-MM-DD" */
function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Returns raw: date = "YYYY-MM-DD", time = "HH:MM" 24h */
  onConfirm: (date: string, time: string) => void;
  availability: AvailabilitySlot[];
  /** "YYYY-MM-DD" — last bookable date */
  maxDate: string;
  /**
   * Doctor's consultation_time string e.g. "8:00 PM - 11:00 PM".
   * Used to restrict which time slots are shown in the picker.
   * Defaults to full 8 AM–11 PM range if not provided.
   */
  consultationTime?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DateTimePickerModal({
  visible,
  onClose,
  onConfirm,
  availability,
  maxDate,
  consultationTime = '',
}: Props) {

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDateObj = useMemo(() => {
    const d = new Date(maxDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [maxDate]);

  /**
   * Derive time slots from doctor's consultation_time.
   * Recomputed only when consultationTime changes.
   */
  const allTimeSlots = useMemo(() => {
    const { startHour, endHour } = parseConsultationTime(consultationTime);
    return buildSlotsForRange(startHour, endHour);
  }, [consultationTime]);

  /**
   * availabilityMap: "YYYY-MM-DD" → Set<"HH:MM">
   * Normalises slots to "HH:MM" so "9:00" and "09:00" both match.
   */
  const availabilityMap = useMemo<Record<string, Set<string>>>(() => {
    const map: Record<string, Set<string>> = {};
    availability.forEach(({ date, slots }) => {
      map[date] = new Set(
        slots.map((s) => {
          const [h, m] = s.split(':');
          return `${String(parseInt(h, 10)).padStart(2, '0')}:${m}`;
        }),
      );
    });
    return map;
  }, [availability]);

  const [step, setStep] = useState<'date' | 'time'>('date');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ── Calendar helpers ──────────────────────────────────────────────────────

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const leadingDays = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + i + 1);
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = leadingDays.length + currentDays.length;
  const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

  const isDisabledDay = (day: number): boolean => {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(0, 0, 0, 0);
    if (d < today || d > maxDateObj) return true;
    return !availabilityMap[toDateStr(currentYear, currentMonth, day)];
  };

  const canGoPrev = (): boolean => {
    const firstOfPrev = new Date(
      currentMonth === 0 ? currentYear - 1 : currentYear,
      currentMonth === 0 ? 11 : currentMonth - 1,
      1,
    );
    return firstOfPrev >= new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const handlePrevMonth = () => {
    if (!canGoPrev()) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  // ── Time helpers ──────────────────────────────────────────────────────────

  const availableSlotsForDate: Set<string> = selectedDate
    ? (availabilityMap[selectedDate] ?? new Set())
    : new Set();

  /**
   * A slot is enabled only if:
   * 1. It falls within the doctor's consultation time range (allTimeSlots)
   * 2. The API marks it as available for the selected date
   */
  const isSlotEnabled = (slot: string) => availableSlotsForDate.has(slot);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleSelectDay = (day: number) => {
    if (isDisabledDay(day)) return;
    setSelectedDate(toDateStr(currentYear, currentMonth, day));
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    onConfirm(selectedDate, selectedTime);
    resetState();
  };

  const resetState = () => {
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>

          {/* ── DATE STEP ── */}
          {step === 'date' ? (
            <>
              <H6 style={styles.title}>Select Date</H6>

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

              <View style={styles.dayRow}>
                {DAY_LABELS.map((d, i) => (
                  <Caption2 key={i} style={styles.dayLabel}>{d}</Caption2>
                ))}
              </View>

              <View style={styles.grid}>
                {leadingDays.map((d, i) => (
                  <View key={`lead-${i}`} style={styles.cell}>
                    <Caption1 style={styles.fadedText}>{d}</Caption1>
                  </View>
                ))}
                {currentDays.map((day) => {
                  const dateStr = toDateStr(currentYear, currentMonth, day);
                  const disabled = isDisabledDay(day);
                  const isSelected = dateStr === selectedDate;
                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.cell,
                        isSelected && styles.selectedCell,
                        disabled && styles.disabledCell,
                      ]}
                      onPress={() => handleSelectDay(day)}
                      disabled={disabled}
                      activeOpacity={disabled ? 1 : 0.7}
                    >
                      <Caption1
                        style={[
                          styles.cellText,
                          isSelected && styles.selectedCellText,
                          disabled && styles.disabledCellText,
                        ]}
                      >
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

              <View style={styles.btnRow}>
                <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
                  <Caption1 style={styles.cancelText}>Cancel</Caption1>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectedDate && setStep('time')}
                  style={[styles.okayBtn, !selectedDate && styles.disabledBtn]}
                  disabled={!selectedDate}
                >
                  <Caption1 style={styles.okayText}>Okay</Caption1>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ── TIME STEP ── */
            <>
              <H6 style={styles.title}>Select Time</H6>

              {/* ScrollView so it doesn't overflow on small screens */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.timeScroll}
              >
                <View style={styles.timeGrid}>
                  {allTimeSlots.map((slot) => {
                    const enabled = isSlotEnabled(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeCell,
                          isSelected && styles.selectedTimeCell,
                          !enabled && styles.disabledTimeCell,
                        ]}
                        onPress={() => enabled && setSelectedTime(slot)}
                        disabled={!enabled}
                        activeOpacity={enabled ? 0.7 : 1}
                      >
                        <Caption2
                          style={[
                            styles.timeText,
                            isSelected && styles.selectedTimeText,
                            !enabled && styles.disabledTimeText,
                          ]}
                        >
                          {formatSlot(slot)}
                        </Caption2>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => {
                    setStep('date');
                    setSelectedTime(null);
                  }}
                  style={styles.cancelBtn}
                >
                  <Caption1 style={styles.cancelText}>Back</Caption1>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={[styles.okayBtn, !selectedTime && styles.disabledBtn]}
                  disabled={!selectedTime}
                >
                  <Caption1 style={styles.okayText}>Confirm</Caption1>
                </TouchableOpacity>
              </View>
            </>
          )}

        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    maxHeight: '90%',
  },
  title: {
    textAlign: 'center',
    color: Colors.BRAND_PRIMARY,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: hp(20),
  },

  // ── Month nav ──
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  monthText: { color: Colors.BRAND_PRIMARY, fontWeight: '600', fontSize: 15 },
  navBtns: { flexDirection: 'row', gap: 4 },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnDisabled: { opacity: 0.3 },

  // ── Day headers ──
  dayRow: { flexDirection: 'row', marginBottom: hp(4) },
  dayLabel: {
    width: '14.28%',
    textAlign: 'center',
    color: '#888888',
    fontWeight: '600',
    fontSize: 13,
  },

  // ── Calendar grid ──
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: hp(8) },
  cell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  cellText: { color: '#333333', fontSize: 14 },
  fadedText: { color: '#CCCCCC', fontSize: 14 },
  selectedCell: { backgroundColor: Colors.BRAND_PRIMARY },
  selectedCellText: { color: '#FFFFFF', fontWeight: '600' },
  disabledCell: { opacity: 0.3 },
  disabledCellText: { color: '#AAAAAA' },

  // ── Time grid ──
  timeScroll: { maxHeight: hp(300) },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
    paddingBottom: hp(8),
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
  timeText: { color: '#333333', fontSize: 13 },
  selectedTimeCell: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderColor: Colors.BRAND_PRIMARY,
  },
  selectedTimeText: { color: '#FFFFFF', fontWeight: '600' },
  disabledTimeCell: { opacity: 0.35 },
  disabledTimeText: { color: '#AAAAAA' },

  // ── Buttons ──
  btnRow: { flexDirection: 'row', gap: wp(12), marginTop: hp(12) },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 100,
    paddingVertical: hp(14),
    alignItems: 'center',
  },
  cancelText: { color: '#333333', fontWeight: '500' },
  okayBtn: {
    flex: 1,
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 100,
    paddingVertical: hp(14),
    alignItems: 'center',
  },
  okayText: { color: '#FFFFFF', fontWeight: '600' },
  disabledBtn: { opacity: 0.5 },
});