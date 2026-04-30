import { CustomButton } from '@/components/shared/CustomButton'
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, Caption4 } from '@/components/typo/Typography'
import { ADMIN_APPOINTMENTS } from '@/constants/adminData'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const pendingList = ADMIN_APPOINTMENTS.filter(a => a.status === 'Pending')

export default function PendingRequestScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <SectionTitle title="Pending Request" showBackButton={false} />
      </View>

      <FlatList
        data={pendingList}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + hp(20) },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: hp(10) }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Caption1 weight='semiBold' style={styles.doctorName} numberOfLines={1}>
                {item.doctorName}
              </Caption1>
              <Caption4 style={styles.meta}>{item.time}</Caption4>
              <Caption4 style={styles.meta}>{item.displayDate}</Caption4>
            </View>

            <CustomButton
              title='View'
              borderRadius={14}
              onPress={() =>
                router.push({
                  pathname: '/admin/appointments/appointment_details' as any,
                  params: { id: item.id },
                })
              }
              width={"25%"}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Caption1 style={{ color: '#aaa' }}>No pending requests.</Caption1>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  header: {
    paddingVertical: hp(10),
  },
  listContent: {
    paddingTop: hp(12),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(16),
    paddingHorizontal: wp(20),
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 16,
    gap: 10,
  },
  cardLeft: { flex: 1 },
  doctorName: {
    color: Colors.BRAND_PRIMARY,
    fontWeight: '600',
    marginBottom: hp(5),
  },
  meta: {
    color: '#666666',
    marginBottom: 4,
  },
  empty: { marginTop: hp(60), alignItems: 'center' },
})