import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditFamilyInformationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [memberName, setMemberName] = useState((params.memberName as string) || '');
  const [icNumber, setIcNumber] = useState((params.icNumber as string) || '');
  const [dateOfBirth, setDateOfBirth] = useState((params.dateOfBirth as string) || '');
  const [relationship, setRelationship] = useState((params.relationship as string) || '');

  const handleUpdate = () => {
    // Pass updated data back and navigate
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <LeftAngleIcon />
          </TouchableOpacity>
          <Body2 color={Colors.TEXT_COLOR} style={styles.headerTitle}>
            Edit Family Information
          </Body2>
          {/* Spacer to center title */}
          <View style={{ width: 52 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <FormInput
              value={memberName}
              onChangeText={setMemberName}
              placeholder="Member Name"
            />
            <FormInput
              value={icNumber}
              onChangeText={setIcNumber}
              placeholder="IC Number"
            />
            <FormInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="Date Of Birth"
            />
            <FormInput
              value={relationship}
              onChangeText={setRelationship}
              placeholder="Relationship"
            />

            <CustomButton
              title="Update"
              onPress={handleUpdate}
              width="100%"
              height={hp(70)}
              borderRadius={16}
              style={{ marginTop: hp(12) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingVertical: hp(16),
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(20),
    paddingBottom: hp(40),
  },
  container: {
    flex: 1,
    paddingTop: hp(20),
  },
});