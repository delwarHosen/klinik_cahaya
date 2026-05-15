import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon'
import { EditIcon } from '@/assets/icons/patient_icon/EditIcon'
import { CustomButton } from '@/components/shared/CustomButton'
import PageLoader from '@/components/shared/PageLoader'
import SectionTitle from '@/components/shared/SectionTitle'
import { showToast } from '@/components/shared/Toast'
import { Body3, Caption2, H6 } from '@/components/typo/Typography'
import { IMAGE_COMPONENTS } from '@/constants/image.index'
import { Colors } from '@/constants/theme'
import { useRefresh } from '@/hooks/useRefresh'
import { useGetProfileQuery, useUploadPhotoMutation } from '@/redux/services/authApi'
import { hp, wp } from '@/utils/responsiveDevice'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter()
  const { data, isLoading: profileLoading, refetch } = useGetProfileQuery({})
  const [uploadPhoto, { isLoading: uploading }] = useUploadPhotoMutation()

  // console.log("Profile Data", data)


  const [photo, setPhoto] = useState<string | null>(null)
  const [photoAsset, setPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)

  const { refreshing, onRefresh } = useRefresh([refetch])

  const showInitialLoader = profileLoading && !data

  const name = data?.name ?? '-'
  const icNumber = data?.ic_number ?? '-'
  const dob = data?.steps?.profile?.data?.date_of_birth ?? '-'
  // const phone = data?.steps?.profile?.data?.phone ?? '-'
  const phone = data?.phone_verification?.profile_phone ?? '-'
  const email = data?.email ?? '-'
  const avatarUrl = photo ?? data?.profile_picture?.public_url ?? null

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri)
      setPhotoAsset(result.assets[0])
    }
  }

  const handleUpdateProfile = async () => {
    try {
      if (photoAsset) {
        const formData = new FormData()
        formData.append('file', {
          uri: photoAsset.uri,
          name: photoAsset.fileName ?? 'photo.jpg',
          type: photoAsset.mimeType ?? 'image/jpeg',
        } as any)
        await uploadPhoto(formData).unwrap()
      }
      showToast(t('profile_success'), 'success')
      router.back()
    } catch (err: any) {
      showToast(err?.data?.message || t('profile_failed'), 'error')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      <PageLoader
        visible={showInitialLoader}
        title={t('loading')}
        subtitle={t('fetching_profile')}
      />

      <PageLoader
        visible={uploading}
        title={t('updating')}
        subtitle={t('saving_profile')}
      />

      <SectionTitle title={t('edit_profile')} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.BRAND_PRIMARY]}
              tintColor={Colors.BRAND_PRIMARY}
            />
          }
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage} activeOpacity={0.8}>
              <Image
                source={avatarUrl ? { uri: avatarUrl } : IMAGE_COMPONENTS.patient}
                style={styles.avatar}
              />
              <View style={styles.cameraBtn}>
                <EditIcon size={14} color='#FFFFFF' />
              </View>
            </TouchableOpacity>
          </View>

          {/* Read-Only Fields */}
          {[
            { label: t('label_name'), value: name },
            { label: t('label_ic'), value: icNumber },
            { label: t('label_dob'), value: dob },
            { label: t('label_email'), value: email },
          ].map(field => (
            <View key={field.label}>
              <Caption2 style={styles.label}>{field.label}</Caption2>
              <View style={styles.readOnlyField}>
                <Body3 color="#0000004D">{field.value}</Body3>
                <View style={styles.readOnlyBadge}>
                  <Caption2 color="#00000099">{t('read_only')}</Caption2>
                </View>
              </View>
            </View>
          ))}

          {/* Phone */}
          <Caption2 style={styles.label}>{t('label_contact')}</Caption2>
          <TouchableOpacity
            style={styles.editableField}
            activeOpacity={0.75}
            onPress={() => router.push('/patient/profile/edit_number')}
          >
            <Body3 style={styles.phoneText}>{phone}</Body3>
            <EditIcon size={18} />
          </TouchableOpacity>

          {/* Sub-section Links */}
          {[
            { label: t('medical_info'), route: '/patient/profile/medical_information' },
            { label: t('insurance_info'), route: '/patient/profile/insurance_information' },
            { label: t('family_info'), route: '/patient/profile/family_information' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.subSectionBtn}
              activeOpacity={0.75}
              onPress={() => router.push(item.route as any)}
            >
              <H6 color="#1A1A1A">{item.label}</H6>
              <RightAngleIcon size={16} color={Colors.BRAND_PRIMARY} />
            </TouchableOpacity>
          ))}

          {/* Update Button */}
          <CustomButton
            title={t('update_profile')}
            onPress={handleUpdateProfile}
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
    paddingHorizontal: wp(20),
  },
  scrollContent: { paddingBottom: hp(40) },
  avatarSection: { alignItems: 'center', marginVertical: hp(24) },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 114, height: 114, borderRadius: 57 },
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
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: wp(16),
    paddingVertical: hp(20),
    borderWidth: 1,
    borderColor: Colors.CARD_BORDER,
  },
  phoneText: { flex: 1, color: '#333333' },
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
})