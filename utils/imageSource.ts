// utils/imageSource.ts
import { ImageSourcePropType } from 'react-native'

/**
 * Converts string | number image values to a valid React Native ImageSourcePropType.
 * - string  → { uri: string }   (remote URL)
 * - number  → number            (local require() asset)
 * - undefined/null → { uri: '' }
 */
export const getImageSource = (img?: string | number): ImageSourcePropType => {
  if (!img) return { uri: '' }
  return typeof img === 'string' ? { uri: img } : (img as ImageSourcePropType)
}