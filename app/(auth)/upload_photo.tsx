import { ImageIcon } from '@/assets/icons/patient_icon/ImageIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { setCredentials } from '@/redux/authSlice';
import { hp, wp } from '@/utils/responsiveDevice';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

export default function WelcomeProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [photo, setPhoto] = useState<string | null>(null);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setPhoto(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View >
               <SectionTitle/>
            </View>

            <View style={styles.container}>
                <View style={styles.titleBlock}>
                    <H1>Welcome to, KNC</H1>
                    <Body3 color={Colors.PLACEHOLLDER_TEXT} style={styles.description}>
                        Manage your appointments, insurance, and medical info—all in one place.
                    </Body3>
                </View>

                <TouchableOpacity style={styles.photoUpload} onPress={handlePickImage} activeOpacity={0.8}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.photoPreview} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <View style={styles.imageIcon}>
                                <View style={styles.iconOuter}>
                                    <Body3 color={Colors.BRAND_PRIMARY} style={{ fontSize: 28 }}>
                                        <ImageIcon />
                                    </Body3>
                                </View>
                            </View>
                            <Body3 color={Colors.PLACEHOLLDER_TEXT} style={styles.uploadLabel}>
                                Upload Photo
                            </Body3>
                        </View>
                    )}
                </TouchableOpacity>

                <CustomButton
                    title="Get Started"
                    onPress={() => {
                        dispatch(setCredentials({
                            access_token: 'mock-token',
                            refresh_token: 'mock-refresh-token',
                            role: 'patient',
                            user: { email: 'patient123@gmail.com', app_metadata: { role: 'patient' } },
                        }));
                        router.replace('/patient/(tabs)/home');
                    }}
                    width="100%"
                    height={hp(70)}
                    borderRadius={16}
                    style={{ marginTop: hp(40) }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
         paddingHorizontal: wp(20),
    },
    
    backButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        // paddingHorizontal: wp(20),
        paddingTop: hp(35),
    },
    titleBlock: {
        marginBottom: hp(50),
    },
    description: {
        marginTop: hp(8),
        lineHeight: 22,
    },
    photoUpload: {
        alignSelf: 'center',
    },
    photoPlaceholder: {
        alignItems: 'center',
        gap: hp(10),
    },
    photoPreview: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    imageIcon: {
        width: 115,
        height: 115,
        borderRadius: 75,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
    },
    iconOuter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadLabel: {
        marginTop: hp(6),
    },
});