import { Caption1, Caption2, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { AvailabilitySlot } from '@/redux/services/bookingApi';
import { hp, wp } from '@/utils/responsiveDevice';
import React, { useMemo, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// FIX 2: Use screen width to calculate responsive cell size.
// Card uses paddingHorizontal wp(20) on each side inside a wp(24) outer padding.
// Total horizontal padding ≈ wp(44)*2. We divide remaining width into 7 equal cells.
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_PADDING = wp(20) * 2;   // paddingHorizontal inside card (left+right)
const OUTER_PADDING = wp(24) * 2;              // backdrop paddingHorizontal (left+right)
const CALENDAR_WIDTH = SCREEN_WIDTH - OUTER_PADDING - CARD_HORIZONTAL_PADDING;
const CELL_SIZE = Math.floor(CALENDAR_WIDTH / 7);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseConsultationTime(timeStr: string): { startHour: number; endHour: number } {
  const DEFAULT = { startHour: 8, endHour: 23 };
  if (!timeStr) return DEFAULT;

  const parts = timeStr.split('-').map((s) => s.trim());
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

function buildSlotsForRange(startHour: number, endHour: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < endHour) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

function formatSlot(slot: string): string {
  const [hStr, mStr] = slot.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr} ${ampm}`;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  availability: AvailabilitySlot[];
  maxDate: string;
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

  const allTimeSlots = useMemo(() => {
    const { startHour, endHour } = parseConsultationTime(consultationTime);
    return buildSlotsForRange(startHour, endHour);
  }, [consultationTime]);

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

              {/* FIX 2: Day label row — each label takes exactly 1/7 of the calendar width */}
              <View style={styles.dayRow}>
                {DAY_LABELS.map((d, i) => (
                  <View key={i} style={styles.dayLabelCell}>
                    <Caption2 style={styles.dayLabel}>{d}</Caption2>
                  </View>
                ))}
              </View>

              {/* FIX 2: Grid rows built week-by-week so cells never overflow */}
              <View style={styles.grid}>
                {/* Leading (prev month) */}
                {leadingDays.map((d, i) => (
                  <View key={`lead-${i}`} style={styles.cell}>
                    <Caption1 style={styles.fadedText}>{d}</Caption1>
                  </View>
                ))}

                {/* Current month days */}
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

                {/* Trailing (next month) */}
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

  // ── Day header row ──
  // FIX 2: Row is a flex container, each label cell takes exactly 1/7 width.
  dayRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: hp(4),
  },
  dayLabelCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 13,
  },

  // ── Calendar grid ──
  // FIX 2: grid uses flexWrap; each cell is exactly CELL_SIZE × CELL_SIZE.
  // This guarantees 7 cells per row on any screen width without overflow.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL_SIZE * 7, // explicit width = exactly 7 columns
    marginBottom: hp(8),
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CELL_SIZE / 2,
  },
  cellText: { color: '#333333', fontSize: 13 },
  fadedText: { color: '#CCCCCC', fontSize: 13 },
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