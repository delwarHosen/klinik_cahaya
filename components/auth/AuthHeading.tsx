import { Colors } from '@/constants/theme';
import { hp, wp } from '@/utils/responsiveDevice';
import { ImageSource } from 'expo-image'; // ImageSource ইম্পোর্ট করুন
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption1, H1 } from '../typo/Typography';

interface TitleSectionProps {
  title: string;
  description: string;
  style?: object;
  titleColor?: string;
  descriptionColor?: string;
  imageSource?: string | number | ImageSource; // ইমেজের জন্য নতুন প্রপ
}

export const AuthHeading: React.FC<TitleSectionProps> = ({
  title,
  description,
  style,
  titleColor = Colors.TEXT_COLOR,
  descriptionColor = Colors.PLACEHOLLDER_TEXT,
  imageSource
}) => {
  return (
    <View style={style}>
      {/* ইমেজ সেকশন... */}

      {/* H1 এ italic দেবেন না, তাহলে এটা আগের মতো মোটা থাকবে */}
      <H1 color={titleColor}>{title}</H1>

      {/* Caption1 এ italic এবং weight="regular" বা আপনার ইচ্ছামতো দিতে পারেন */}
      <Caption1
        italic
        style={styles.description}
        color={descriptionColor}
        // weight='regular'
      >
        {description}
      </Caption1>
    </View>
  );
};

const styles = StyleSheet.create({

  headingImage: {
    height: hp(60),
    width: wp(140),
    marginBottom: hp(16),
  },
  description: {
    marginTop: hp(8),
  },
});