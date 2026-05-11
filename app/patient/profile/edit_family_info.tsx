// import { DownArrowIcon } from '@/assets/icons/patient_icon/DownArrowIcon'
// import { UpArrowIcon } from '@/assets/icons/patient_icon/UpArrowIcon'
// import { CustomButton } from '@/components/shared/CustomButton'
// import SectionTitle from '@/components/shared/SectionTitle'
// import { Caption1 } from '@/components/typo/Typography'
// import { Colors } from '@/constants/theme'
// import { hp, wp } from '@/utils/responsiveDevice'
// import { useRouter } from 'expo-router'
// import React, { useState } from 'react'
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const GENDER_OPTIONS = ['Male', 'Female']
// const ALLERGY_OPTIONS = ['Food Allergies', 'Seasonal Allergies', 'Pet Allergies', 'None']

// export default function EditFamilyInfoScreen() {
//   const router = useRouter()


//   const [name, setName] = useState('Razak Bin Osman')
//   const [relation, setRelation] = useState('Brother')
//   const [ic, setIc] = useState('90001-14-5677')
//   const [dob, setDob] = useState('10 January 1997')
//   const [phone, setPhone] = useState('+60 56125454212')
//   const [genderOpen, setGenderOpen] = useState(false)
//   const [selectedGender, setSelectedGender] = useState('Male')
//   const [allergyOpen, setAllergyOpen] = useState(false)
//   const [selectedAllergy, setSelectedAllergy] = useState('')

//   const handleUpdate = () => {
//     router.back()
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//       <SectionTitle title="Edit Family Information" />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Field placeholder="Member Name" value={name} onChangeText={setName} />
//           <Field placeholder="Relation" value={relation} onChangeText={setRelation} />
//           <Field placeholder="IC Number" value={ic} onChangeText={setIc} keyboardType="numeric" />
//           <Field placeholder="Date Of Birth" value={dob} onChangeText={setDob} />
//           <Field placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

//           {/* Gender Dropdown */}
//           <TouchableOpacity
//             style={styles.dropdownBox}
//             onPress={() => { setGenderOpen(o => !o); setAllergyOpen(false) }}
//             activeOpacity={0.8}
//           >
//             <Caption1 style={selectedGender ? styles.dropdownSelected : styles.dropdownPlaceholder}>
//               {selectedGender || 'Gender'}
//             </Caption1>
//             <Caption1 style={styles.chevron}>{genderOpen ? <UpArrowIcon /> : <DownArrowIcon />}</Caption1>
//           </TouchableOpacity>
//           {genderOpen && (
//             <View style={styles.dropdownList}>
//               {GENDER_OPTIONS.map(opt => (
//                 <TouchableOpacity
//                   key={opt}
//                   style={styles.dropdownItem}
//                   onPress={() => { setSelectedGender(opt); setGenderOpen(false) }}
//                 >
//                   <Caption1 style={styles.dropdownItemText}>{opt}</Caption1>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {/* Allergy Dropdown */}
//           <TouchableOpacity
//             style={styles.dropdownBox}
//             onPress={() => { setAllergyOpen(o => !o); setGenderOpen(false) }}
//             activeOpacity={0.8}
//           >
//             <Caption1 style={selectedAllergy ? styles.dropdownSelected : styles.dropdownPlaceholder}>
//               {selectedAllergy || 'Allergies'}
//             </Caption1>
//             <Caption1 style={styles.chevron}>{allergyOpen ? <UpArrowIcon /> : <DownArrowIcon />}</Caption1>
//           </TouchableOpacity>
//           {allergyOpen && (
//             <View style={styles.dropdownList}>
//               {ALLERGY_OPTIONS.map(opt => (
//                 <TouchableOpacity
//                   key={opt}
//                   style={styles.dropdownItem}
//                   onPress={() => { setSelectedAllergy(opt); setAllergyOpen(false) }}
//                 >
//                   <Caption1 style={styles.dropdownItemText}>{opt}</Caption1>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           <View style={styles.bottomBar}>
//             <CustomButton
//               title='Update'
//               onPress={handleUpdate}
//               height={54}
//               width={"100%"}
//               borderRadius={16}
//             />
//           </View>
//         </ScrollView>


//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }

// function Field({ placeholder, value, onChangeText, keyboardType }: any) {
//   return (
//     <View style={styles.fieldBox}>
//       <TextInput
//         placeholder={placeholder}
//         placeholderTextColor="#AAAAAA"
//         value={value}
//         onChangeText={onChangeText}
//         style={styles.input}
//         keyboardType={keyboardType ?? 'default'}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.APP_BACKGROUND,
//     paddingHorizontal: wp(20),
//   },
//   scrollContent: {
//     paddingTop: hp(20),
//     paddingBottom: hp(20),
//   },
//   fieldBox: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingHorizontal: wp(16),
//     borderWidth: 1,
//     borderColor: Colors.BORDER_COLOR,
//     marginBottom: hp(12),
//   },
//   input: {
//     fontSize: 15,
//     color: '#333333',
//     paddingVertical: hp(16),
//     fontFamily: 'Poppins_400Regular',
//   },
//   dropdownBox: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingHorizontal: wp(16),
//     paddingVertical: hp(16),
//     borderWidth: 1,
//     borderColor: Colors.BORDER_COLOR,
//     marginBottom: hp(12),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dropdownPlaceholder: {
//     color: '#AAAAAA',
//     fontSize: 15,
//   },
//   dropdownSelected: {
//     color: '#333333',
//     fontSize: 15,
//   },
//   chevron: {
//     color: '#AAAAAA',
//     fontSize: 11,
//   },
//   dropdownList: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.BORDER_COLOR,
//     marginTop: hp(-8),
//     marginBottom: hp(12),
//     overflow: 'hidden',
//   },
//   dropdownItem: {
//     paddingHorizontal: wp(16),
//     paddingVertical: hp(14),
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.BORDER_COLOR,
//   },
//   dropdownItemText: {
//     color: '#333333',
//     fontSize: 15,
//   },
//   bottomBar: {
//     paddingTop: hp(12),
//     paddingBottom: hp(20),
//   },
// })