
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";


export const LeftAngleIcon = ({
    size = 16,
    color = "#822CE7",
}: IconProps) => {
    return (
        <Svg width="52" height="52" viewBox="0 0 52 52" fill="none" >
            <Rect width="52" height="52" rx="26" fill="#F8F8F8" />
            <Path d="M30.3332 34.6668L21.6665 26.0002L30.3332 17.3335" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


