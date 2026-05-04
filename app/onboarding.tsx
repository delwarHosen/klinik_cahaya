import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body1, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');

const SLIDES = [
    {
        id: '1',
        image: IMAGE_COMPONENTS.onboarding1,
        title: '23 Hours Clinic',
        description: 'Kami sedia melayan anda 23 jam sehari, 7 hari seminggu',
    },
    {
        id: '2',
        image: IMAGE_COMPONENTS.onboarding2,
        title: 'Family Care',
        description: 'Penjagaan kesihatan untuk seluruh keluarga anda',
    },
    {
        id: '3',
        image: IMAGE_COMPONENTS.onboarding3,
        title: 'AI Assistant',
        description: 'Tanya Hana - assistant virtual KNC anda',
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const navigateToLogin = () => router.replace('/(auth)/login');

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        } else {
            navigateToLogin();
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
        <View style={styles.slide}>
            <Image
                source={item.image}
                style={styles.backgroundImage}
                contentFit="cover"
            />
            <View style={styles.overlay} />

            <View style={[styles.bottomContent, { bottom: insets.bottom + hp(150) }]}>
                <H1 color={"#E4E500"} italic style={styles.title}>
                    {item.title}
                </H1>
                <Body1 color={Colors.TEXT_WHITE} italic style={styles.description}>
                    {item.description}
                </Body1>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                scrollEventThrottle={16}
            />

            {/* Header - Top Padding Insets theke nicche */}
            <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : hp(20) }]}>
                <View style={styles.logoContainer}>
                    <Image
                        source={IMAGE_COMPONENTS.logo}
                        style={{ height: 60, width: 140 }}
                        contentFit="contain"
                    />
                </View>
                <TouchableOpacity onPress={navigateToLogin} style={styles.skipBtn}>
                    <Body1 color={Colors.TEXT_WHITE}>Skip</Body1>
                </TouchableOpacity>
            </View>

            {/* Footer - Bottom Padding Insets theke nicche */}
            <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom + hp(10) : hp(20) }]}>
                <View style={styles.dotsRow}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === currentIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
                    <RightAngleIcon />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    slide: {
        width,
        height,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,              
        bottom: 0,         
        left: 0,
        right: 0,
        // borderRadius: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(20),
        zIndex: 10,
        marginTop: hp(30),
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skipBtn: {
        paddingVertical: hp(6),
        paddingHorizontal: wp(12),
    },
    bottomContent: {
        position: 'absolute',
        justifyContent:"center",
        alignItems:"center",
        left: wp(24),
        right: wp(24),
    },
    title: {
        marginBottom: hp(12),
    },
    description: {
        opacity: 0.9,
        textAlign:"center"
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(24),
        paddingTop: hp(16),
        backgroundColor: 'transparent',
        marginBottom: hp(10),
    },
    dotsRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:wp(50),
        gap: 8,
    },
    dot: {
        borderRadius: 100,
    },
    dotActive: {
        width: 30,
        height: 11,
        backgroundColor: Colors.ACCENT_YELLOW,
    },
    dotInactive: {
        width: 8,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    nextBtn: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: Colors.ACCENT_YELLOW,
        justifyContent: 'center',
        alignItems: 'center',
    },
});