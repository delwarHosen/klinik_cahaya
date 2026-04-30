// app/admin/profile/services.tsx
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body1 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ServicesScreen() {
  const router = useRouter()
  const [services, setServices] = useState<string[]>(['Bridge', 'Dental Cleaning', 'Pediatric'])

  const handleAdd = () => {
    setServices(prev => [...prev, ''])
  }

  const handleChange = (text: string, index: number) => {
    setServices(prev => prev.map((s, i) => i === index ? text : s))
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Services" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Body1 weight='medium' style={styles.label}>Service</Body1>

        {services.map((service, index) => (
          <View key={index} style={[styles.inputBox, index > 0 && { marginTop: hp(10) }]}>
            <TextInput
              value={service}
              onChangeText={text => handleChange(text, index)}
              placeholder="Name of Service"
              placeholderTextColor="#AAAAAA"
              style={styles.input}
            />
          </View>
        ))}

        {/* Add button */}
        <View style={styles.addBtnRow}>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
           <PlusButtonIcon/>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Save"
          onPress={() => router.back()}
          height={56}
          width="100%"
          borderRadius={16}
          style={{ marginTop: hp(20) }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: wp(20),paddingBottom:hp(20) },
  scrollContent: { paddingHorizontal: wp(20), paddingBottom: hp(40) },

  label: { color:Colors.TEXT_COLOR, marginBottom: hp(8) },

  inputBox: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(4),
  },
  input: {
    fontSize: 16,
    color: Colors.PLACEHOLLDER_TEXT,
    paddingVertical: hp(14),
    fontFamily: 'Poppins_400Regular',
  },

  addBtnRow: { alignItems: 'flex-end', marginTop: hp(12) },
  addBtn: {
    width: 44, height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addBtnText: { fontSize: 22, color: '#1A1A1A', lineHeight: 26 },
})