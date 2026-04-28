// app/patient/profile/edit_number.tsx
import { ContactChangedSuccessScreen } from '@/components/edit_contact/ContactChangedSuccessScreen'
import { EditContactNumberScreen } from '@/components/edit_contact/EditContactNumberScreen'
import { OtpVerifyScreen } from '@/components/edit_contact/OtpVerifyScreen'
import { VerifyPasswordScreen } from '@/components/edit_contact/VerifyPasswordScreen'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'



type Step = 'verify_password' | 'edit_number' | 'otp' | 'success'

export default function EditContactFlowScreen() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('verify_password')
  const [phone, setPhone] = useState('+60 12 4523784')

  if (step === 'verify_password') {
    return <VerifyPasswordScreen onVerified={() => setStep('edit_number')} />
  }

  if (step === 'edit_number') {
    return (
      <EditContactNumberScreen
        onSendOtp={newPhone => {
          setPhone(newPhone)
          setStep('otp')
        }}
      />
    )
  }

  if (step === 'otp') {
    return <OtpVerifyScreen onVerified={() => setStep('success')} />
  }

  return <ContactChangedSuccessScreen onContinue={() => router.back()} />
}