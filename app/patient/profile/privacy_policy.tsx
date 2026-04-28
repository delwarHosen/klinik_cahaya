import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, H4 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const POLICY_CONTENT = [
  {
    heading: 'Payments',
    body: '',
    bullets: [
      'All Payments Are Processed Securely Via [Paystack].',
      'If A Payment Fails, Your Order May Be Canceled Automatically.',
    ],
  },
  {
    heading: 'Cancellations & Refunds',
    body: '',
    bullets: [
      'Refund Eligibility Depends On Timing Of Cancellation And Local Policy.',
    ],
  },
  {
    heading: 'Data Collection',
    body: '',
    bullets: [
      'We Collect Personal Information You Provide During Registration.',
      'Usage Data Is Collected Automatically To Improve Our Services.',
      'We Do Not Sell Your Personal Data To Third Parties.',
    ],
  },
  {
    heading: 'Your Rights',
    body: '',
    bullets: [
      'You Have The Right To Access, Update, Or Delete Your Personal Data.',
      'You May Opt Out Of Marketing Communications At Any Time.',
      'Contact Us To Exercise Any Of Your Data Rights.',
    ],
  },
]

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Privacy & Policy" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {POLICY_CONTENT.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <H4 style={styles.sectionHeading}>{section.heading}</H4>
            {section.body ? (
              <Caption1 color={Colors.TEXT_COLOR} style={styles.sectionBody}>{section.body}</Caption1>
            ) : null}
            {section.bullets.map((bullet, bIdx) => (
              <View key={bIdx} style={styles.bulletRow}>
                <Caption1 color={Colors.TEXT_COLOR} style={styles.bulletDot}>•</Caption1>
                <Caption1 color={Colors.TEXT_COLOR} style={styles.bulletText}>{bullet}</Caption1>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.APP_BACKGROUND,
    paddingHorizontal: wp(20),
  },
  scrollContent: {
    paddingBottom: hp(40),
    paddingTop: hp(10),
    paddingHorizontal: 5
  },

  section: { marginBottom: hp(28) },
  sectionHeading: {
    fontWeight: '700',
    color: Colors.TEXT_COLOR,
    textAlign: 'center',
    marginBottom: hp(16),
  },
  sectionBody: { lineHeight: 22 },
  bulletRow: { flexDirection: 'row', marginBottom: hp(10) },
  bulletDot: { marginRight: wp(8), marginTop: 1 },
  bulletText: { flex: 1, lineHeight: 22 },
})