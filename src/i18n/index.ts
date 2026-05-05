import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import bm from "./bm.json";
import en from "./en.json";

const LANG_KEY = "APP_LANG";

export const initI18n = async () => {
  let defaultLang = "en";

  const deviceLanguage = Localization.getLocales()[0]?.languageCode || "en";
  if (deviceLanguage.startsWith("ms") || deviceLanguage.startsWith("bm")) {
    defaultLang = "bm";
  }

  const savedLang = await AsyncStorage.getItem(LANG_KEY);
  const langToUse = savedLang || defaultLang;

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      bm: { translation: bm },
    },
    lng: langToUse,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
};

initI18n();

export const changeLanguage = async (lang: string) => {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
    await i18n.changeLanguage(lang);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

export default i18n;