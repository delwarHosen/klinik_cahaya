import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { EditIcon } from '@/assets/icons/patient_icon/EditIcon';
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body2, Body3, Caption1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useUpdateFamilyMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
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

interface FamilyMember {
  id: string;
  memberName: string;
  icNumber: string;
  dateOfBirth: string;
  relationship: string;
}

interface AddMemberForm {
  memberName: string;
  icNumber: string;
  dateOfBirth: string;
  relationship: string;
}

const EMPTY_FORM: AddMemberForm = {
  memberName: '',
  icNumber: '',
  dateOfBirth: '',
  relationship: '',
};

export default function FamilyInformationScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [inlineForm, setInlineForm] = useState<AddMemberForm>(EMPTY_FORM);
  const [updateFamily, { isLoading }] = useUpdateFamilyMutation();

  const handleSkip = () => {
    router.push('/(auth)/upload_photo');
  };

  // const handleContinue = async () => {
  //   try {
  //     await updateFamily({
  //       family_members: members.map((m) => ({
  //         member_name: m.memberName,
  //         ic_number: m.icNumber,
  //         date_of_birth: m.dateOfBirth,
  //         relationship: m.relationship,
  //       })),
  //     }).unwrap();

  //     showToast('Family info saved!', 'success');
  //     //  Continue → get_family_info
  //     router.push('/(auth)/get_family_info');
  //   } catch (err: any) {
  //     showToast(err?.data?.message || 'Failed to save family info.', 'error');
  //   }
  // };

  

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
          <TouchableOpacity onPress={handleSkip}>
            <Body3 color={Colors.PLACEHOLLDER_TEXT}>Skip</Body3>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.titleBlock}>
              <AuthHeading
                title="Set-up your Profile"
                description="Family Information"
              />
            </View>

            {members.length === 0 ? (
              <>
                <FormInput
                  value={inlineForm.memberName}
                  onChangeText={(text) => setInlineForm((f) => ({ ...f, memberName: text }))}
                  placeholder="Member Name"
                />
                <FormInput
                  value={inlineForm.icNumber}
                  onChangeText={(text) => setInlineForm((f) => ({ ...f, icNumber: text }))}
                  placeholder="IC Number"
                />
                <FormInput
                  value={inlineForm.dateOfBirth}
                  onChangeText={(text) => setInlineForm((f) => ({ ...f, dateOfBirth: text }))}
                  placeholder="Date Of Birth"
                />
                <FormInput
                  value={inlineForm.relationship}
                  onChangeText={(text) => setInlineForm((f) => ({ ...f, relationship: text }))}
                  placeholder="Relationship"
                />
              </>
            ) : (
              members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <Body2 color={Colors.TEXT_COLOR}>{member.memberName}</Body2>
                    <Caption1 color="#666">{member.icNumber}</Caption1>
                    <Caption1 color="#666">{member.dateOfBirth}</Caption1>
                    <Caption1 color="#666">{member.relationship}</Caption1>
                  </View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push('/(auth)/edit_family_info')}
                  >
                    <EditIcon />
                  </TouchableOpacity>
                </View>
              ))
            )}

            {/*  Plus icon → add_member route, */}
            <View style={styles.plusRow}>
              <TouchableOpacity
                style={styles.plusButton}
                onPress={() => router.push('/(auth)/add_member')}
              >
                <PlusButtonIcon />
              </TouchableOpacity>
            </View>

            {/*  Continue → get_family_info route */}
            <CustomButton
              title="Continue"
              onPress={()=> router.push('/(auth)/get_family_info')}
              // onPress={handleContinue}
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
    paddingBottom: hp(5),
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(20),
    paddingBottom: hp(40),
  },
  container: {
    flex: 1,
    paddingTop: hp(30),
  },
  titleBlock: {
    marginBottom: hp(30),
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    backgroundColor: '#fff',
    marginBottom: hp(12),
  },
  memberInfo: {
    gap: hp(2),
  },
  editButton: {
    padding: 6,
  },
  plusRow: {
    alignItems: 'flex-end',
    marginBottom: hp(8),
    marginTop: hp(4),
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});