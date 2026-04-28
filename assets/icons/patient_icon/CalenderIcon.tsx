import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";


export const CalenderIcon = ({
    size = 16,
    color = "#822CE7",
}: IconProps) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 12 13" fill="none">
            <Path d="M8.08268 0.5V2.83333M3.41602 0.5V2.83333" stroke="#C9C6D6" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M6.33333 1.66699H5.16667C2.96678 1.66699 1.86684 1.66699 1.18342 2.35041C0.5 3.03383 0.5 4.13377 0.5 6.33366V7.50033C0.5 9.70019 0.5 10.8002 1.18342 11.4836C1.86684 12.167 2.96678 12.167 5.16667 12.167H6.33333C8.5332 12.167 9.63319 12.167 10.3166 11.4836C11 10.8002 11 9.70019 11 7.50033V6.33366C11 4.13377 11 3.03383 10.3166 2.35041C9.63319 1.66699 8.5332 1.66699 6.33333 1.66699Z" stroke="#C9C6D6" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M0.5 5.16699H11" stroke="#C9C6D6" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M7.79102 8.37516V9.54183M8.66602 8.9585C8.66602 9.44173 8.27425 9.8335 7.79102 9.8335C7.30778 9.8335 6.91602 9.44173 6.91602 8.9585C6.91602 8.47526 7.30778 8.0835 7.79102 8.0835C8.27425 8.0835 8.66602 8.47526 8.66602 8.9585Z" stroke="#C9C6D6" stroke-linecap="round" stroke-linejoin="round" />
        </Svg>

    );
};
