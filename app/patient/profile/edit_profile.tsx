import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon'
import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Body3, Caption2, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditProfileScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('lunakellen@mail.com')
  const [phone, setPhone] = useState('+60 12 4523784')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Edit Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?u=luna' }}
                style={styles.avatar}
              />
              <View style={styles.cameraBtn}>
                <EditIcon size={14} color='#FFFFFF' />
              </View>
            </View>
          </View>

          {/* Read-Only Fields */}
          <Caption2 style={styles.label}>Name</Caption2>
          <View style={styles.readOnlyField}>
            <Body3 color="#0000004D">Luna Kellen</Body3>
            <View style={styles.readOnlyBadge}>
              <Caption2 color="#00000099">Read-Only</Caption2>
            </View>
          </View>

          <Caption2 style={styles.label}>IC Number</Caption2>
          <View style={styles.readOnlyField}>
            <Body3 color="#0000004D">900101-14-5678</Body3>
            <View style={styles.readOnlyBadge}>
              <Caption2 color="#00000099">Read-Only</Caption2>
            </View>
          </View>

          <Caption2 style={styles.label}>Date of Birth</Caption2>
          <View style={styles.readOnlyField}>
            <Body3 color="#0000004D">10 -Aug-1986</Body3>
            <View style={styles.readOnlyBadge}>
              <Caption2 color="#00000099">Read-Only</Caption2>
            </View>
          </View>

          {/* Editable Fields */}
          <Caption2 style={styles.label}>Email Address</Caption2>
          <View style={styles.editableField}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity>
              <EditIcon size={18} />
            </TouchableOpacity>
          </View>

          <Caption2 style={styles.label}>Contact Number</Caption2>
          <View style={styles.editableField}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.textInput}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              onPress={() => router.push("/patient/profile/edit_number")}
            >
              <EditIcon size={18} />
            </TouchableOpacity>
          </View>

          {/* Sub-section Links */}
          <TouchableOpacity
            style={styles.subSectionBtn}
            activeOpacity={0.75}
            onPress={() => router.push('/patient/profile/medical_information')}
          >
            <H6 color="#1A1A1A">Medical Information</H6>
            <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subSectionBtn}
            activeOpacity={0.75}
            onPress={() => router.push('/patient/profile/insurance_information')}
          >
            <H6 color="#1A1A1A">Insurance Information</H6>
            <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subSectionBtn}
            activeOpacity={0.75}
            onPress={() => router.push('/patient/profile/family_information')}
          >
            <H6 color="#1A1A1A">Family Information</H6>
            <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
          </TouchableOpacity>

          {/* Update Button */}
          <CustomButton
            title='Update profile'
            onPress={() => router.back()}
            height={64}
            width={"100%"}
            borderRadius={16}
            style={{ marginTop: 30 }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20)
  },
  scrollContent: { paddingBottom: hp(40) },

  avatarSection: { alignItems: 'center', marginVertical: hp(24) },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 114,
    height: 114,
    borderRadius: 57
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    backgroundColor: Colors.BRAND_PRIMARY,
    width: 28,
    height: 28,
    borderRadius: 14,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: { color: Colors.TEXT_COLOR, marginBottom: hp(6), marginTop: hp(14) },

  readOnlyField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(20),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  readOnlyBadge: {
    backgroundColor: Colors.APP_BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: wp(12),
    paddingVertical: hp(4),
  },

  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    paddingVertical: hp(12),
    fontFamily: 'Poppins_400Regular',
  },

  subSectionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: wp(18),
    paddingVertical: hp(18),
    marginTop: hp(12),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },

  updateBtn: {
    backgroundColor: Colors.BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: hp(18),
    alignItems: 'center',
    marginTop: hp(28),
  },
})