
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const FilterIcon = ({
    size = 16,
    color = "#FFFFFF",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    );
};


