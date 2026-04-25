
import { IconProps } from "@/types/iconTypes";
import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";


export const EditIcon = ({
    size = 16,
    color = "#822CE7",
}: IconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <G clip-path="url(#clip0_429_3413)">
                <Path d="M9.16699 3.3332H3.33366C2.89163 3.3332 2.46771 3.50879 2.15515 3.82135C1.84259 4.13391 1.66699 4.55784 1.66699 4.99986V16.6665C1.66699 17.1086 1.84259 17.5325 2.15515 17.845C2.46771 18.1576 2.89163 18.3332 3.33366 18.3332H15.0003C15.4424 18.3332 15.8663 18.1576 16.1788 17.845C16.4914 17.5325 16.667 17.1086 16.667 16.6665V10.8332M15.417 2.0832C15.7485 1.75168 16.1982 1.56543 16.667 1.56543C17.1358 1.56543 17.5855 1.75168 17.917 2.0832C18.2485 2.41472 18.4348 2.86436 18.4348 3.3332C18.4348 3.80204 18.2485 4.25168 17.917 4.5832L10.0003 12.4999L6.66699 13.3332L7.50033 9.99986L15.417 2.0832Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_429_3413">
                    <Rect width="20" height="20" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>

    );
};


