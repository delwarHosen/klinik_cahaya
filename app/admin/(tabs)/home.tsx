import { Body1 } from '@/components/typo/Typography'
import React from 'react'
import { View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Body1>this is Home</Body1>
    </View>
  )
}