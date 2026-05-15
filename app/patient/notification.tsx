// app/patient/notification.tsx
import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, H6 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import {
    useDeleteNotificationMutation,
    useGetPatientNotificationsQuery,
    useMarkNotificationReadMutation,
} from '@/redux/services/notificationApi'
import { hp, wp } from '@/utils/responsiveDevice'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PatientNotificationScreen() {
    const { t } = useTranslation() 
    const { data, isLoading } = useGetPatientNotificationsQuery()
    const [markRead] = useMarkNotificationReadMutation()
    const [deleteNotif] = useDeleteNotificationMutation()

    const notifications = data?.results ?? []

    
    function timeAgo(isoString: string): string {
        const diff = Date.now() - new Date(isoString).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return t('time_just_now')
        if (mins < 60) return t('time_m_ago', { count: mins })
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return t('time_h_ago', { count: hrs })
        const days = Math.floor(hrs / 24)
        return t('time_d_ago', { count: days })
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <SectionTitle title={t('notification')} />
            </View>

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color={Colors.BRAND_PRIMARY} size="large" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Caption1 style={{ color: '#999' }}>{t('no_notifications')}</Caption1>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.card, !item.is_read && styles.cardUnread]}
                            activeOpacity={0.75}
                            onPress={() => markRead({ id: item.id, role: 'patient' })}
                        >
                            {!item.is_read && <View style={styles.dot} />}

                            <View style={styles.cardContent}>
                                <View style={styles.textBlock}>
                                    <H6 style={[styles.title, !item.is_read && styles.boldText]}>
                                        {item.title}
                                    </H6>
                                    <Caption1
                                        style={[styles.body, !item.is_read && styles.boldText]}
                                        numberOfLines={2}
                                    >
                                        {item.body}
                                    </Caption1>
                                </View>

                                <View style={styles.rightCol}>
                                    <Caption1 style={[styles.time, !item.is_read && styles.boldText]}>
                                        {timeAgo(item.created_at)}
                                    </Caption1>
                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        onPress={() => deleteNotif({ id: item.id, role: 'patient' })}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    header: { paddingHorizontal: wp(20) },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: hp(60) },
    list: { paddingHorizontal: wp(20), paddingTop: hp(10), paddingBottom: hp(40) },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: hp(14),
        marginBottom: hp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: '#FFFFFF',
    },
    cardUnread: {
        backgroundColor: '#F0FAF7',
        borderColor: Colors.BRAND_PRIMARY + '40',
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.BRAND_PRIMARY,
        marginRight: wp(10),
        flexShrink: 0,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textBlock: { flex: 1, marginRight: wp(8) },
    title: { fontSize: 14, color: Colors.TEXT_COLOR, marginBottom: 3 },
    body: { color: '#666666', marginTop: 2, lineHeight: 18 },
    boldText: { fontWeight: '700' },
    rightCol: { alignItems: 'flex-end', gap: hp(8) },
    time: { color: '#999999', fontSize: 11 },
    deleteBtn: {
        width: 28, height: 28,
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#FFF0F0',
    },
})