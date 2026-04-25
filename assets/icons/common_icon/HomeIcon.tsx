import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { Path } from "react-native-svg";

export const HomeIcon = ({
    size = 24, 
    color = "#822CE7",
}: IconProps) => {
    return (
        <Svg 
            width={size} 
            height={size} 
            viewBox="0 0 28 28" 
            fill="none"
        >
            <Path 
                d="M23.3334 21.0003V11.2254C23.3334 9.84837 22.6394 8.56408 21.4874 7.80957L15.2785 3.74276C14.5021 3.23418 13.4981 3.23418 12.7216 3.74276L6.51272 7.80957C5.3608 8.56408 4.66675 9.84837 4.66675 11.2254V21.0003C4.66675 23.2555 6.49491 25.0837 8.75008 25.0837H19.2501C21.5052 25.0837 23.3334 23.2555 23.3334 21.0003Z" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeMiterlimit="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            <Path 
                d="M2.33325 10.4999L12.7283 3.74318C13.5015 3.24056 14.4983 3.24056 15.2716 3.74318L25.6666 10.4999" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeMiterlimit="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            <Path 
                d="M14 18.083V20.9997" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
            />
        </Svg>
    );
};