import { Colors } from "@/constants/theme";
 
import { LeftAngleIcon } from "@/assets/icons/common_icon/LeftAngleIcon";
import { hp, wp } from "@/utils/responsiveDevice";
import { useRouter } from "expo-router";
import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { Body1 } from "../typo/Typography";
 
 
interface SectionTitleProps {
    title?: string;
    containerStyle?: StyleProp<ViewStyle>;
    showBackButton?: boolean;
}
 
const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    containerStyle,
    showBackButton = true,
}) => {
    const router = useRouter();
 
    return (
        <View style={[styles.headerRow, containerStyle]}>
            {showBackButton && (
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backIconContainer}
                    activeOpacity={0.7}
                >
                    <LeftAngleIcon />
                </TouchableOpacity>
            )}
 
            <Body1 italic color={Colors.TEXT_COLOR} style={styles.headerTitle}>{title}</Body1>
        </View>
    );
};
 
export default SectionTitle;
 
const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"space-between",
        // gap: 10,
        // paddingVertical:"5%"
        paddingBottom:hp(10),
        paddingTop:wp(20)
    },
    backIconContainer: {
        // backgroundColor: Colors,
        // height: 40,
        // width: 40,
        // borderRadius: 20,
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // padding: 10,
        // marginLeft:wp(20)
    },
    headerTitle: {
        flex: 1,
        // marginLeft:"25%"
        textAlign:"center",
        paddingRight:"10%",
        // paddingTop:hp(25)
    },
});