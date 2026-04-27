// app/patient/(tabs)/search.tsx
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1 } from '@/components/typo/Typography';
import { DOCTORS } from '@/constants/fakeData';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const filtered = query.trim()
        ? DOCTORS.filter(d =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.specialty.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View >
                <SectionTitle title="Search" />
            </View>

            {/* Search Input */}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Search doctors or service"
                    placeholderTextColor={Colors.TEXT_COLOR}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                        <Caption1 style={styles.clearBtn}>✕</Caption1>
                    </TouchableOpacity>
                )}
            </View>

            {/* Results */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => router.push(`/patient/doctors_info/doctor_details?id=${item.id}`)}
                    >
                        <Caption1 color={Colors.TEXT_COLOR} weight='semiBold'>{item.name}</Caption1>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp(20)
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginHorizontal: wp(20),
        marginTop: hp(8),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        borderRadius: 16,
        paddingHorizontal: wp(16),
        paddingVertical: hp(12),
        // backgroundColor: '#FAFAFA',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.TEXT_COLOR,
        fontWeight:"semibold"
    },
    clearBtn: {
        color: Colors.TEXT_COLOR,
        fontSize: 16,
        paddingLeft: wp(8),
    },
    list: {
        // paddingHorizontal: wp(20),
        paddingTop: hp(12),
    },
    resultItem: {
        paddingVertical: hp(14),
        paddingHorizontal: wp(16),
        borderRadius: 12,
        // backgroundColor: '#F8F8F8',
        marginBottom: hp(8),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    resultText: {
        color: '#1A1A1A',
        fontSize: 14,
    },
});