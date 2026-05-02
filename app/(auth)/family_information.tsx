import { LeftAngleIcon } from '@/assets/icons/common_icon/LeftAngleIcon';
import { EditIcon } from '@/assets/icons/patient_icon/EditIcon';
import { PlusButtonIcon } from '@/assets/icons/patient_icon/PlusButtonIcon';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { Body2, Body3, Caption1, Caption2, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useUpdateFamilyMutation } from '@/redux/services/authApi';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<AddMemberForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inlineForm, setInlineForm] = useState<AddMemberForm>(EMPTY_FORM);
  const [updateFamily, { isLoading }] = useUpdateFamilyMutation();

  // const handleContinue = () => {
  //   router.push('/(auth)/upload_photo');
  // };

  const handleSkip = () => {
    router.push('/(auth)/upload_photo');
  };

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setForm({
      memberName: member.memberName,
      icNumber: member.icNumber,
      dateOfBirth: member.dateOfBirth,
      relationship: member.relationship,
    });
    setEditingId(member.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.memberName.trim()) return;

    if (editingId) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...form } : m))
      );
    } else {
      setMembers((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form },
      ]);
    }
    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };




  const handleContinue = async () => {
    try {
      await updateFamily({
        family_members: members.map((m) => ({
          member_name: m.memberName,
          ic_number: m.icNumber,
          date_of_birth: m.dateOfBirth,
          relationship: m.relationship,
        })),
      }).unwrap();

      showToast('Family info saved!', 'success');
      router.push('/(auth)/upload_photo');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to save family info.', 'error');
    }
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
                  <TouchableOpacity style={styles.editButton}
                    onPress={() => openEditModal(member)}
                  >
                    <Body3 color={Colors.TEXT_COLOR}>
                      <TouchableOpacity
                        onPress={() => router.push("/(auth)/edit_family_info")}
                      >
                        <EditIcon />
                      </TouchableOpacity>
                    </Body3>
                  </TouchableOpacity>
                </View>
              ))
            )}

            <View style={styles.plusRow}>
              <TouchableOpacity style={styles.plusButton} onPress={openAddModal}>
                <PlusButtonIcon />
              </TouchableOpacity>
            </View>

            <CustomButton
              title="Continue"
              // onPress={handleContinue}
              onPress={()=>router.push('/(auth)/upload_photo')}
              width="100%"
              height={hp(70)}
              borderRadius={16}
              style={{ marginTop: hp(12) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add / Edit Member Bottom Sheet Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalOverlay}>

            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowModal(false); }}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            {/* Bottom Sheet */}
            <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, hp(30)) }]}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetTitleBlock}>
                <H1>{editingId ? 'Edit Member' : 'Add Member'}</H1>
                <Caption2 style={styles.subtitle} italic>
                  Family Information
                </Caption2>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: hp(10) }}
              >
                <FormInput
                  value={form.memberName}
                  onChangeText={(text) => setForm((f) => ({ ...f, memberName: text }))}
                  placeholder="Member Name"
                />
                <FormInput
                  value={form.icNumber}
                  onChangeText={(text) => setForm((f) => ({ ...f, icNumber: text }))}
                  placeholder="IC Number"
                />
                <FormInput
                  value={form.dateOfBirth}
                  onChangeText={(text) => setForm((f) => ({ ...f, dateOfBirth: text }))}
                  placeholder="Date Of Birth"
                />
                <FormInput
                  value={form.relationship}
                  onChangeText={(text) => setForm((f) => ({ ...f, relationship: text }))}
                  placeholder="Relationship"
                />

                <CustomButton
                  title="Save"
                  onPress={handleSave}
                  width="100%"
                  height={hp(70)}
                  borderRadius={16}
                  style={{ marginTop: hp(12) }}
                />
              </ScrollView>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: wp(20),
    paddingTop: hp(16),
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: hp(20),
  },
  sheetTitleBlock: {
    marginBottom: hp(24),
  },
  subtitle: {
    marginTop: hp(4),
    color: Colors.PLACEHOLLDER_TEXT,
  },
});