import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const baseWidth = 360;
const baseHeight = 800;

export const wp = (size: number): number => {
  return (width / baseWidth) * size;
};

export const hp = (size: number): number => {
  return (height / baseHeight) * size;
};

export const fp = (size: number): number => {
  return (width / baseWidth) * size;
};