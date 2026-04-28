import SectionTitle from '@/components/shared/SectionTitle'
import { Caption1, H4 } from '@/components/typo/Typography'
import { Colors } from '@/constants/theme'
import { hp, wp } from '@/utils/responsiveDevice'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const TERMS_CONTENT = [
  {
    heading: 'Overview Of Our Service',
    body: 'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged. It Was Popularised In The 1960s.',
    bullets: [],
  },
  {
    heading: 'User Eligibility',
    body: '',
    bullets: [
      'You Must Be 18 Years Or Older (Or The Legal Age In Your Jurisdiction).',
      'You Agree To Provide Accurate And Up-To-Date Information (Name, Address, Payment Details).',
      'You Are Responsible For Maintaining The Confidentiality Of Your Account.',
    ],
  },
  {
    heading: 'Acceptable Use',
    body: '',
    bullets: [
      'You May Not Use The Service For Any Unlawful Purpose.',
      'You Must Not Attempt To Disrupt Or Interfere With The Service.',
      'Misuse Of The Platform May Result In Account Termination.',
    ],
  },
]

export default function TermsConditionScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SectionTitle title="Terms & Condition" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TERMS_CONTENT.map((section, idx) => (
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
  scrollContent: { paddingBottom: hp(40), paddingTop: hp(10) },

  section: { marginBottom: hp(28) },
  sectionHeading: {
    fontWeight: '700',
    color: Colors.TEXT_COLOR,
    textAlign: 'center',
    marginBottom: hp(16),
  },
  sectionBody: {
    lineHeight: 22,
    paddingHorizontal: 5
  },

  bulletRow: { flexDirection: 'row', marginBottom: hp(10) },
  bulletDot: {
    marginRight: wp(8),
    marginTop: 1,
    paddingHorizontal: 5
  },
  bulletText: {
    flex: 1,
    lineHeight: 22,
  },
})