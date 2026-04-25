import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const UpArrowIcon = ({
    size = 16,
    color = "#822CE7",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <Path d="M8 14L12 10L16 14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};
