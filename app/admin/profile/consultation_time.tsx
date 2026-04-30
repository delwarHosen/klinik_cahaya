// app/admin/profile/consultation_time.tsx
import { DayPickerModal } from '@/components/admin/DayPickerModal'
import { TimePickerModal } from '@/components/admin/Timepickermodal'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body1, Caption1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ConsultationTimeScreen() {
  const router = useRouter()

  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
  ])
  const [startTime, setStartTime] = useState('08:00 AM')
  const [endTime, setEndTime] = useState('01:00 PM')

  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  const dayLabel = selectedDays.length === 0
    ? 'Select Days'
    : selectedDays.length === 7
      ? 'Everyday'
      : `${selectedDays[0]} - ${selectedDays[selectedDays.length - 1]}`

  const timeLabel = `${startTime} - ${endTime}`

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Consultation Time" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Select Day */}
        <Body1 weight='medium' style={styles.label}>Select Day</Body1>
        <TouchableOpacity
          style={styles.fieldRow}
          activeOpacity={0.8}
          onPress={() => setShowDayPicker(true)}
        >
          <Caption1 style={styles.fieldText}>{dayLabel}</Caption1>
        </TouchableOpacity>

        {/* Select Time */}
        <Body1 weight='medium' style={[styles.label, { marginTop: hp(20) }]}>Select Time</Body1>
        <TouchableOpacity
          style={styles.fieldRow}
          activeOpacity={0.8}
          onPress={() => setShowStartPicker(true)}
        >
          <Caption1  style={styles.fieldText}>{timeLabel}</Caption1>
        </TouchableOpacity>

        <CustomButton 
          title="Save"
          onPress={() => router.back()}
          height={56}
          width="100%"
          borderRadius={16}
          style={{ marginTop: hp(32) }}
        />
      </ScrollView>

      {/* Day Picker */}
      <DayPickerModal
        visible={showDayPicker}
        selectedDays={selectedDays}
        onClose={() => setShowDayPicker(false)}
        onConfirm={days => { setSelectedDays(days); setShowDayPicker(false) }}
      />

      {/* Start Time Picker */}
      <TimePickerModal
        visible={showStartPicker}
        title="Starting Time"
        initialTime={startTime}
        onClose={() => setShowStartPicker(false)}
        onConfirm={t => {
          setStartTime(t)
          setShowStartPicker(false)
          setShowEndPicker(true)
        }}
      />

      {/* End Time Picker */}
      <TimePickerModal
        visible={showEndPicker}
        title="Ending Time"
        initialTime={endTime}
        onClose={() => setShowEndPicker(false)}
        onConfirm={t => { setEndTime(t); setShowEndPicker(false) }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: wp(20) ,paddingBottom:hp(20)},
  scrollContent: { paddingHorizontal: wp(20), paddingBottom: hp(40) },
  label: { color: Colors.TEXT_COLOR, marginBottom: hp(8) },
  fieldRow: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(18),
  },
  fieldText: { color: Colors.PLACEHOLLDER_TEXT, fontSize: 16 },
})