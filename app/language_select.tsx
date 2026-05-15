import { WorldIcon } from '@/assets/icons/common_icon/WorldIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body1, Body2, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { changeLanguage } from '@/src/i18n';
import { hp, wp } from '@/utils/responsiveDevice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGES = [
    { label: 'English', code: 'en', flag: '🇬🇧' },
    { label: 'Bahasa Malaysia', code: 'bm', flag: '🇲🇾' },
];

export default function LanguageSelectScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [selected, setSelected] = useState<string>('en');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        try {
            setLoading(true);
            await changeLanguage(selected);
            await AsyncStorage.setItem('APP_LANG', selected);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Language save error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Top globe illustration area */}
            <View style={styles.illustrationContainer}>
                <View style={styles.globeWrapper}>
                    <View style={styles.globeCircle}>
                        {/* Globe icon - replace with your actual globe image/icon */}
                        <Body1 style={styles.globeEmoji}>
                            <WorldIcon/>
                        </Body1>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <H2 style={styles.title}>Choose your language</H2>
                <Body2 style={styles.subtitle}>
                    Select the language you want to use in{'\n'}the application.
                </Body2>

                {/* Language Options */}
                <View style={styles.optionsList}>
                    {LANGUAGES.map((lang) => {
                        const isSelected = selected === lang.code;
                        return (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.optionRow,
                                    isSelected && styles.optionRowSelected,
                                ]}
                                onPress={() => setSelected(lang.code)}
                                activeOpacity={0.7}
                            >
                                {/* Flag */}
                                <View style={styles.flagContainer}>
                                    <Body1 style={styles.flagEmoji}>{lang.flag}</Body1>
                                </View>

                                {/* Language Label */}
                                <Body1 style={styles.langText}>{lang.label}</Body1>

                                {/* Checkmark */}
                                <View
                                    style={[
                                        styles.radioOuter,
                                        isSelected && styles.radioOuterSelected,
                                    ]}
                                >
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Continue Button */}
            <View style={styles.footer}>
                <CustomButton
                    onPress={handleContinue}
                    title={loading ? 'Please wait...' : 'Continue'}
                    width="100%"
                    height={hp(54)}
                    borderRadius={14}
                    backgroundColor={Colors.BRAND_PRIMARY}
                    disabled={loading}
                    isLoading={loading}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingHorizontal: wp(20),
    },

    /* ── Illustration ── */
    illustrationContainer: {
        alignItems: 'center',
        marginTop: hp(40),
        marginBottom: hp(30),
    },
    globeWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    globeCircle: {
        width: wp(100),
        height: wp(100),
        borderRadius: wp(50),
        backgroundColor: '#E8F4FD',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.BRAND_PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    globeEmoji: {
        fontSize: 48,
    },

    /* ── Content ── */
    content: {
        flex: 1,
    },
    title: {
        color: Colors.TEXT_COLOR,
        textAlign: 'center',
        marginBottom: hp(8),
    },
    subtitle: {
        color: Colors.PLACEHOLLDER_TEXT ?? '#888',
        textAlign: 'center',
        lineHeight: hp(22),
        marginBottom: hp(30),
    },

    /* ── Language Options ── */
    optionsList: {
        gap: hp(12),
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 0,
    },
    optionRowSelected: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: '#F0F9FF',
    },
    flagContainer: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(12),
        overflow: 'hidden',
    },
    flagEmoji: {
        fontSize: 20,
    },
    langText: {
        flex: 1,
        color: Colors.TEXT_COLOR,
        fontSize: 15,
        fontWeight: '500',
    },

    /* ── Radio Button ── */
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: Colors.BRAND_PRIMARY,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },

    /* ── Footer ── */
    footer: {
        paddingBottom: hp(10),
        paddingTop: hp(16),
    },
});