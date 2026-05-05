import SectionTitle from '@/components/shared/SectionTitle';
import { Caption1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import i18n, { changeLanguage } from '@/src/i18n'; // এখানে i18n ইমপোর্ট করা হলো
import { hp, wp } from '@/utils/responsiveDevice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGES = [
    { label: 'English', code: 'en' },
    { label: 'Bahasa Malaysia', code: 'bm' }
];

export default function LanguageScreenContent() {
    const router = useRouter();
    const { t } = useTranslation();
    const [selected, setSelected] = useState<string>('en');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadCurrentLang = async () => {
            const currentLang = await AsyncStorage.getItem('APP_LANG') || i18n.language || 'en';
            setSelected(currentLang);
            setLoading(false);
        };
        loadCurrentLang();
    }, []);

    const handleLanguageChange = async (code: string) => {
        setSelected(code);
        await changeLanguage(code);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="small" color={Colors.BRAND_PRIMARY} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionTitle title={t('language')} />

            <View style={styles.content}>
                {/* Language Options */}
                <View style={styles.optionsList}>
                    {LANGUAGES.map((lang) => {
                        const isSelected = selected === lang.code;
                        return (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.optionRow,
                                    isSelected && { borderColor: Colors.BRAND_PRIMARY }
                                ]}
                                onPress={() => handleLanguageChange(lang.code)}
                                activeOpacity={0.7}
                            >
                                <Caption1 weight='medium' style={styles.langText}>
                                    {lang.label}
                                </Caption1>
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
                <TouchableOpacity onPress={() => router.back()} style={styles.changeBtn} activeOpacity={0.85}>
                    <Caption1 style={styles.changeBtnText}>{t('change_language')}</Caption1>
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