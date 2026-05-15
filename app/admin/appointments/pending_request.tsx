// // app/admin/pending_request/index.tsx
// import SectionTitle from '@/components/shared/SectionTitle'
// import { Caption1, Caption4 } from '@/components/typo/Typography'
// import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
// import { Colors } from '@/constants/theme'
// import { hp, wp } from '@/utils/responsiveDevice'
// import { useRouter } from 'expo-router'
// import React from 'react'
// import { useTranslation } from 'react-i18next'
// import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const pendingList = ADMIN_APPOINTMENTS.filter(a => a.status === 'Pending')

// export default function PendingRequestScreen() {
//   const { t } = useTranslation()
//   const router = useRouter()

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <View style={styles.header}>
//         <SectionTitle title={t('pending_request')} />
//       </View>

//       <FlatList
//         data={pendingList}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.cardLeft}>
//               <Caption1 style={styles.doctorName}>{item.doctorName}</Caption1>
//               <Caption4 style={styles.meta}>{item.time}</Caption4>
//               <Caption4 style={styles.meta}>{item.displayDate}</Caption4>
//             </View>
//             <TouchableOpacity
//               style={styles.viewBtn}
//               activeOpacity={0.85}
//               onPress={() => router.push({ pathname: '/admin/appointments/appointment_details' as any, params: { id: item.id } })}
//             >
//               <Caption1 style={styles.viewBtnText}>{t('view')}</Caption1>
//             </TouchableOpacity>
//           </View>
//         )}
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <Caption1 style={{ color: '#aaa' }}>{t('no_pending_requests')}</Caption1>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFFFF' },
//   header: { paddingHorizontal: wp(20) },
//   listContent: { paddingHorizontal: wp(20), paddingBottom: hp(40) },
//   card: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     paddingVertical: hp(16),
//     borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
//   },
//   cardLeft: { flex: 1 },
//   doctorName: { color: Colors.BRAND_PRIMARY, fontWeight: '600', fontSize: 13 },
//   meta: { color: '#888', fontSize: 11, marginTop: 2 },
//   viewBtn: {
//     backgroundColor: Colors.BRAND_PRIMARY, borderRadius: 10,
//     paddingHorizontal: wp(20), paddingVertical: hp(12),
//   },
//   viewBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
//   empty: { marginTop: hp(60), alignItems: 'center' },
// })