// app/index.tsx
import { useRouter } from 'expo-router'
import { useVideoPlayer, VideoView } from 'expo-video'
import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

const { width, height } = Dimensions.get('screen')
const splashVideo = require('@/assets/videos/splash.mp4')

export default function Index() {
    const router = useRouter()

    const player = useVideoPlayer(splashVideo, (p) => {
        p.loop = false
        p.muted = true
        p.play()
    })

    useEffect(() => {
        const sub = player.addListener('playToEnd', () => {
            router.replace('/onboarding')
        })

        return () => sub.remove()
    }, [player])

    return (
        <View style={styles.container}>
            <VideoView
                player={player}
                style={styles.video}
                contentFit="contain"
                nativeControls={false}
               
                fullscreenOptions={{
                    enable: false, 
                }}
                allowsPictureInPicture={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width,
        height,
    },
})