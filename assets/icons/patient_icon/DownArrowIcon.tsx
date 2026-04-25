
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const DownArrowIcon = ({
    size = 16,
    color = "#822CE7",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M16 10L12 14L8 10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


