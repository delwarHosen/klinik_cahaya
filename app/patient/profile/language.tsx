import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGES = ['English', 'Bahasa Malaysia'];

export default function LanguageScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState('English');

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionTitle title="Language" />

            <View style={styles.content}>
                {/* Language Options */}
                <View style={styles.optionsList}>
                    {LANGUAGES.map((lang) => {
                        const isSelected = selected === lang;
                        return (
                            <TouchableOpacity
                                key={lang}
                                style={styles.optionRow}
                                onPress={() => setSelected(lang)}
                                activeOpacity={0.7}
                            >
                                <Caption1 weight='medium' style={styles.langText}>{lang}</Caption1>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={22}
                                    color={isSelected ? Colors.BRAND_PRIMARY : '#CCCCCC'}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Change Language Button */}
                <TouchableOpacity onPress={()=>router.back()} style={styles.changeBtn} activeOpacity={0.85}>
                    <Caption1 style={styles.changeBtnText}>Change Language</Caption1>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    content: {
        flex: 1,
        paddingTop: hp(20),
    },
    optionsList: {
        gap: hp(12),
        marginBottom: hp(30),
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(18),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    langText: {
        color: Colors.TEXT_COLOR,
        fontSize: 14,
    },
    changeBtn: {
        backgroundColor: Colors.BRAND_PRIMARY,
        borderRadius: 14,
        paddingVertical: hp(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    changeBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});