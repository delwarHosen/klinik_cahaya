import { fp } from '@/utils/responsiveDevice';
import React from 'react';
import { Text, TextProps } from 'react-native';
 
const fontFamily = {
    regular: "Poppins_400Regular",
    regularItalic: "Poppins_400Regular_Italic",
    medium: "Poppins_500Medium",
    mediumItalic: "Poppins_500Medium_Italic",
    semiBold: "Poppins_600SemiBold",
    semiBoldItalic: "Poppins_600SemiBold_Italic",
    bold: "Poppins_700Bold",
    boldItalic: "Poppins_700Bold_Italic",
    extraBold: "Poppins_800ExtraBold",
};
 
export type TypographyVariant =
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "body1" | "body2" | "body3"| "body4"
    | "caption1" | "caption2" | "caption3"|"caption4"
    | "button"| "specialText"
 
export type TypographyWeight =
    | 'regular' | 'medium' | 'semiBold' | 'bold' | "extraBold"
 
interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    weight?: TypographyWeight;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    children: React.ReactNode;
    italic?: boolean;
}
 
const Typography: React.FC<TypographyProps> = ({
    variant = "body1",
    color = "#333333",
    align = "left",
    weight = "regular",
    children,
    style,
    italic = false,
    ...props
}) => {
 
    const getFontSize = () => {
        switch (variant) {
            case "h1": return fp(32);
            case "h2": return fp(24);
            case "h3": return fp(20);
            case "h4": return fp(20);
            case "h5": return fp(20);
            case "h6": return fp(16);
            case "body1": return fp(16);
            case "body2": return fp(16);
            case "body3": return fp(15);
            case "caption1": return fp(15);
            case "caption2": return fp(14);
            case "caption3": return fp(14);
            case "caption4": return fp(12);
            case 'button': return fp(16);
            case "body4": return fp(15);
            case "specialText": return fp(20);
            default: return fp(16);
        }
    }
 
    const getFontFamily = () => {
        if (italic) {
            switch (weight) {
                case "medium":
                    return fontFamily.semiBoldItalic;
                case "semiBold":
                    return fontFamily.semiBoldItalic;
                case "bold":
                    return fontFamily.boldItalic;
                case "extraBold":
                    return fontFamily.boldItalic;
                default:
                    return fontFamily.regularItalic;
            }
        }
 
        switch (weight) {
            case "regular": return fontFamily.regular;
            case "medium": return fontFamily.medium;
            case "semiBold": return fontFamily.semiBold;
            case "bold": return fontFamily.bold;
            case "extraBold": return fontFamily.extraBold;
            default: return fontFamily.regular;
        }
    };
 
    const getLineHeight = () => {
        switch (variant) {
            case "h1": return 52;
            case "h2": return 40;
            case "h3": return 36;
            case "h4": return 32;
            case "h5": return 28;
            case "h6": return 24;
            case "body1": return 22;
            case "body2": return 22;
            case "body3": return 20;
            case "body4": return 20;
            case "caption1": return 20;
            case "caption2": return 20;
            case "caption3": return 18;
            case "caption4": return 16;
            case 'button': return 24;
            case "specialText": return 20;
            default: return 24;
        }
    }
 
    return (
        <Text
            style={[
                {
                    fontSize: getFontSize(),
                    lineHeight: getLineHeight(),
                    color,
                    textAlign: align,
                    fontFamily: getFontFamily(),
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    )
}
 
 
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h1" weight="medium" {...props} />
);
export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h2" weight="semiBold" {...props} />
);
export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h3" weight="semiBold" {...props} />
);
export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h4" weight="semiBold" {...props} />
);
export const H5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h5" weight="medium" {...props} />
);
export const H6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="h6" weight="semiBold" {...props} />
);
export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body1" weight="medium" {...props} />
);
export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body2" weight="semiBold" {...props} />
);
export const Body3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body3" weight="medium" {...props} />
);
export const Body4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="body4" weight="medium" {...props} />
);
export const Caption1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption1" weight="regular" {...props} />
);
export const Caption2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption2" weight="medium" {...props} />
);
export const Caption3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption3" weight="regular" {...props} />
);
export const Caption4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="caption4" weight="medium" {...props} />
);
export const ButtonText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="button" weight="semiBold" {...props} />
);
 
export const SpecialText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
    <Typography variant="specialText" weight="extraBold" {...props} />
);
 
export default Typography;