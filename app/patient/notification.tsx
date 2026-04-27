// app/patient/notification.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
    { id: '1', doctor: 'Dr. Anis Effendi', message: 'Accept Your Booking Request', time: '9:30 PM', read: false }, // Unread (Bold + Dot)
    { id: '2', doctor: 'Dr. Muhammad Faiz', message: 'Reject Your Booking Request', time: '8:45 PM', read: false }, // Unread (Bold + Dot)
    { id: '3', doctor: 'Dr. Noormimi Khadijah', message: 'Reject Your Booking Request', time: '10:20 AM', read: true }, // Read (Normal)
    { id: '4', doctor: 'Dr. Liyana Binti Radzi', message: 'Accept Your Booking Request', time: 'Yesterday', read: true }, // Read (Normal)
];

export default function NotificationScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View>
                <SectionTitle title="Notification" />
            </View>
            <FlatList
                data={NOTIFICATIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Unread হলে ডট দেখাবে */}
                        {!item.read && <View style={styles.dot} />}
                        
                        <View style={styles.cardContent}>
                            <View style={{ flex: 1 }}>
                                {/* Unread হলে Bold, Read হলে 600 weight */}
                                <H6 style={[
                                    styles.doctorName, 
                                    { fontWeight: !item.read ? 'bold' : '600' }
                                ]}>
                                    {item.doctor}
                                </H6>
                                
                                {/* Unread হলে Bold, Read হলে Normal weight */}
                                <Caption1 style={[
                                    styles.message, 
                                    { fontWeight: !item.read ? 'bold' : '400' }
                                ]}>
                                    {item.message}
                                </Caption1>
                            </View>
                            
                            <Caption1 style={[
                                styles.time,
                                { fontWeight: !item.read ? 'bold' : '400' }
                            ]}>
                                {item.time}
                            </Caption1>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)
    },
    list: {
        paddingTop: hp(10),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: hp(14),
        marginBottom: hp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.BRAND_PRIMARY,
        marginRight: wp(10),
    },
    cardContent: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
    },
    doctorName: {
        fontSize: 14,
        color: Colors.TEXT_COLOR
    },
    message: { 
        color: Colors.TEXT_COLOR, 
        marginTop: 2 
    },
    time: { 
        color: Colors.TEXT_COLOR, 
        fontSize: 12 
    },
});