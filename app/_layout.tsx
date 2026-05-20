import Toast from '@/components/shared/Toast';
import { persistor, store } from '@/redux/store';
import i18n from '@/src/i18n';
import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

SplashScreen.preventAutoHideAsync();


const handleDeepLink = async ({ url }: { url: string }) => {
  console.log('Deep link URL:', url);

  const fragmentPart = url.includes('#') ? url.split('#')[1] : url.split('?')[1];
  if (!fragmentPart) return;

  const params = new URLSearchParams(fragmentPart);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  console.log('Access Token:', accessToken);

  if (accessToken) {
    await AsyncStorage.setItem('access_token', accessToken);
    console.log('Token saved!');
    router.push('/(auth)/personal_information');
  }
  if (refreshToken) {
    await AsyncStorage.setItem('refresh_token', refreshToken);
  }
};


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isI18nReady, setIsI18nReady] = useState(false);

  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
  });

  // Deep link listener
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const prepare = async () => {
      if (i18n.isInitialized) {
        setIsI18nReady(true);
      } else {
        i18n.on('initialized', () => {
          setIsI18nReady(true);
        });
      }

      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [loaded]);

  // ✅ Font বা i18n লোড না হলে loader দেখাও
  if (!loaded || !isI18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      {/* ✅ PersistGate যোগ করা হয়েছে — AsyncStorage থেকে auth rehydrate হওয়া পর্যন্ত loader */}
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="patient" options={{ headerShown: false }} />
          </Stack>
          <Toast />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}